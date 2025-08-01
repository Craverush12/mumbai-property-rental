import { supabase } from '../lib/supabase';

interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  bucket: string;
  path: string;
  uploaded_by: string;
  uploaded_at: string;
  is_public: boolean;
  tags?: string[];
  description?: string;
}

interface UploadOptions {
  bucket?: string;
  path?: string;
  isPublic?: boolean;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  compress?: boolean;
  resize?: {
    width?: number;
    height?: number;
    quality?: number;
  };
}

interface FileUploadResult {
  success: boolean;
  file?: FileMetadata;
  error?: string;
  url?: string;
}

class FileStorageService {
  private static instance: FileStorageService;

  private readonly DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  private readonly ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  private readonly ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

  private constructor() {}

  static getInstance(): FileStorageService {
    if (!FileStorageService.instance) {
      FileStorageService.instance = new FileStorageService();
    }
    return FileStorageService.instance;
  }

  // File Upload with Validation and Optimization
  async uploadFile(
    file: File,
    options: UploadOptions = {}
  ): Promise<FileUploadResult> {
    try {
      // Validate file
      const validation = await this.validateFile(file, options);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Process file if needed
      const processedFile = await this.processFile(file, options);

      // Generate unique filename
      const fileName = this.generateFileName(file.name);
      const filePath = options.path ? `${options.path}/${fileName}` : fileName;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(options.bucket || 'general')
        .upload(filePath, processedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(options.bucket || 'general')
        .getPublicUrl(filePath);

      // Create file metadata
      const metadata: FileMetadata = {
        id: data.path,
        name: file.name,
        size: file.size,
        type: file.type,
        url: publicUrl,
        bucket: options.bucket || 'general',
        path: filePath,
        uploaded_by: 'user', // This would come from auth context
        uploaded_at: new Date().toISOString(),
        is_public: options.isPublic ?? true
      };

      // Store metadata in database
      await this.storeFileMetadata(metadata);

      return {
        success: true,
        file: metadata,
        url: publicUrl
      };
    } catch (error) {
      console.error('File upload error:', error);
      return { success: false, error: 'Upload failed' };
    }
  }

  // Image Upload with Optimization
  async uploadImage(
    file: File,
    options: {
      bucket?: string;
      path?: string;
      resize?: { width?: number; height?: number; quality?: number };
      compress?: boolean;
    } = {}
  ): Promise<FileUploadResult> {
    const uploadOptions: UploadOptions = {
      bucket: options.bucket || 'property-images',
      path: options.path,
      allowedTypes: this.ALLOWED_IMAGE_TYPES,
      maxSize: 5 * 1024 * 1024, // 5MB for images
      compress: options.compress ?? true,
      resize: options.resize,
      isPublic: true
    };

    return this.uploadFile(file, uploadOptions);
  }

  // Document Upload
  async uploadDocument(
    file: File,
    options: {
      bucket?: string;
      path?: string;
    } = {}
  ): Promise<FileUploadResult> {
    const uploadOptions: UploadOptions = {
      bucket: options.bucket || 'documents',
      path: options.path,
      allowedTypes: this.ALLOWED_DOCUMENT_TYPES,
      maxSize: 20 * 1024 * 1024, // 20MB for documents
      isPublic: false
    };

    return this.uploadFile(file, uploadOptions);
  }

  // Video Upload
  async uploadVideo(
    file: File,
    options: {
      bucket?: string;
      path?: string;
    } = {}
  ): Promise<FileUploadResult> {
    const uploadOptions: UploadOptions = {
      bucket: options.bucket || 'videos',
      path: options.path,
      allowedTypes: this.ALLOWED_VIDEO_TYPES,
      maxSize: 100 * 1024 * 1024, // 100MB for videos
      isPublic: true
    };

    return this.uploadFile(file, uploadOptions);
  }

  // File Validation
  private async validateFile(file: File, options: UploadOptions): Promise<{ valid: boolean; error?: string }> {
    // Check file size
    const maxSize = options.maxSize || this.DEFAULT_MAX_SIZE;
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${this.formatFileSize(maxSize)}`
      };
    }

    // Check file type
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${options.allowedTypes.join(', ')}`
      };
    }

    // Check for malicious files
    if (!this.isFileSafe(file)) {
      return {
        valid: false,
        error: 'File appears to be unsafe and cannot be uploaded'
      };
    }

    return { valid: true };
  }

  private isFileSafe(file: File): boolean {
    // Check file extension
    const fileName = file.name.toLowerCase();
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js'];
    
    if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
      return false;
    }

    // Check MIME type
    const dangerousMimeTypes = [
      'application/x-executable',
      'application/x-msdownload',
      'application/x-msi',
      'application/x-msdos-program'
    ];

    if (dangerousMimeTypes.includes(file.type)) {
      return false;
    }

    return true;
  }

  // File Processing
  private async processFile(file: File, options: UploadOptions): Promise<File | Blob> {
    if (options.compress && file.type.startsWith('image/')) {
      return await this.compressImage(file, options.resize);
    }

    return file;
  }

  private async compressImage(
    file: File,
    resizeOptions?: { width?: number; height?: number; quality?: number }
  ): Promise<Blob> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        const maxWidth = resizeOptions?.width || 1920;
        const maxHeight = resizeOptions?.height || 1080;
        const quality = resizeOptions?.quality || 0.8;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // File Management
  async getFileMetadata(fileId: string): Promise<FileMetadata | null> {
    try {
      const { data, error } = await supabase
        .from('file_metadata')
        .select('*')
        .eq('id', fileId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching file metadata:', error);
      return null;
    }
  }

  async listFiles(bucket: string, path?: string): Promise<FileMetadata[]> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path || '');

      if (error) throw error;

      const files: FileMetadata[] = [];
      for (const file of data) {
        const metadata = await this.getFileMetadata(file.name);
        if (metadata) {
          files.push(metadata);
        }
      }

      return files;
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  }

  async deleteFile(fileId: string, bucket: string): Promise<boolean> {
    try {
      // Get file metadata
      const metadata = await this.getFileMetadata(fileId);
      if (!metadata) {
        throw new Error('File not found');
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(bucket)
        .remove([metadata.path]);

      if (storageError) throw storageError;

      // Delete metadata from database
      const { error: dbError } = await supabase
        .from('file_metadata')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  async updateFileMetadata(
    fileId: string,
    updates: Partial<Pick<FileMetadata, 'tags' | 'description' | 'is_public'>>
  ): Promise<FileMetadata | null> {
    try {
      const { data, error } = await supabase
        .from('file_metadata')
        .update(updates)
        .eq('id', fileId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating file metadata:', error);
      return null;
    }
  }

  // File Cleanup
  async cleanupOrphanedFiles(): Promise<number> {
    try {
      let cleanedCount = 0;

      // Get all files from storage
      const buckets = ['property-images', 'documents', 'videos', 'general'];
      
      for (const bucket of buckets) {
        const { data: files } = await supabase.storage
          .from(bucket)
          .list('');

        if (files) {
          for (const file of files) {
            // Check if metadata exists
            const metadata = await this.getFileMetadata(file.name);
            if (!metadata) {
              // Delete orphaned file
              await supabase.storage
                .from(bucket)
                .remove([file.name]);
              cleanedCount++;
            }
          }
        }
      }

      return cleanedCount;
    } catch (error) {
      console.error('Error cleaning up orphaned files:', error);
      return 0;
    }
  }

  async cleanupExpiredFiles(expirationDays: number = 30): Promise<number> {
    try {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() - expirationDays);

      const { data: expiredFiles, error } = await supabase
        .from('file_metadata')
        .select('*')
        .lt('uploaded_at', expirationDate.toISOString())
        .eq('is_public', false);

      if (error) throw error;

      let cleanedCount = 0;
      for (const file of expiredFiles || []) {
        const deleted = await this.deleteFile(file.id, file.bucket);
        if (deleted) cleanedCount++;
      }

      return cleanedCount;
    } catch (error) {
      console.error('Error cleaning up expired files:', error);
      return 0;
    }
  }

  // Utility Methods
  private generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `${timestamp}-${randomString}.${extension}`;
  }

  private formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  private async storeFileMetadata(metadata: FileMetadata): Promise<void> {
    try {
      const { error } = await supabase
        .from('file_metadata')
        .insert([metadata]);

      if (error) throw error;
    } catch (error) {
      console.error('Error storing file metadata:', error);
      throw error;
    }
  }

  // File URL Generation
  async getSignedUrl(filePath: string, bucket: string, expiresIn: number = 3600): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, expiresIn);

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      return null;
    }
  }

  // Bulk Operations
  async uploadMultipleFiles(
    files: File[],
    options: UploadOptions = {}
  ): Promise<FileUploadResult[]> {
    const results: FileUploadResult[] = [];

    for (const file of files) {
      const result = await this.uploadFile(file, options);
      results.push(result);
    }

    return results;
  }

  async deleteMultipleFiles(fileIds: string[], bucket: string): Promise<boolean[]> {
    const results: boolean[] = [];

    for (const fileId of fileIds) {
      const result = await this.deleteFile(fileId, bucket);
      results.push(result);
    }

    return results;
  }

  // File Statistics
  async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    bucketStats: { [key: string]: { files: number; size: number } };
  }> {
    try {
      const { data: files } = await supabase
        .from('file_metadata')
        .select('*');

      const totalFiles = files?.length || 0;
      const totalSize = files?.reduce((sum, file) => sum + file.size, 0) || 0;

      const bucketStats: { [key: string]: { files: number; size: number } } = {};
      files?.forEach(file => {
        if (!bucketStats[file.bucket]) {
          bucketStats[file.bucket] = { files: 0, size: 0 };
        }
        bucketStats[file.bucket].files++;
        bucketStats[file.bucket].size += file.size;
      });

      return {
        totalFiles,
        totalSize,
        bucketStats
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return {
        totalFiles: 0,
        totalSize: 0,
        bucketStats: {}
      };
    }
  }
}

export default FileStorageService.getInstance(); 