import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image, File, Video, AlertCircle, CheckCircle, Trash2, Crop, RotateCw, Download, Eye } from 'lucide-react';
import FileStorageService from '../services/fileStorageService';

interface FileUploadProps {
  onUploadComplete: (files: UploadedFile[]) => void;
  onUploadError: (error: string) => void;
  multiple?: boolean;
  accept?: string[];
  maxSize?: number; // in MB
  maxFiles?: number;
  type?: 'image' | 'document' | 'video' | 'all';
  showPreview?: boolean;
  allowCrop?: boolean;
  bucket?: string;
  path?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnail?: string;
  uploadedAt: string;
  status: 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
}

interface FileWithPreview extends File {
  preview?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  onUploadError,
  multiple = false,
  accept = ['image/*', 'application/pdf', 'video/*'],
  maxSize = 10, // 10MB default
  maxFiles = 5,
  type = 'all',
  showPreview = true,
  allowCrop = false,
  bucket = 'general',
  path = ''
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropData, setCropData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Get accepted file types based on type prop
  const getAcceptedTypes = () => {
    switch (type) {
      case 'image':
        return ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      case 'document':
        return ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      case 'video':
        return ['video/mp4', 'video/webm', 'video/ogg'];
      default:
        return accept;
    }
  };

  // Validate file
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${maxSize}MB`
      };
    }

    // Check file type
    const acceptedTypes = getAcceptedTypes();
    if (!acceptedTypes.some(type => file.type.match(type.replace('*', '.*')))) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed`
      };
    }

    // Check if we've reached max files
    if (uploadedFiles.length + files.length >= maxFiles) {
      return {
        valid: false,
        error: `Maximum ${maxFiles} files allowed`
      };
    }

    return { valid: true };
  };

  // Handle file selection
  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const fileArray = Array.from(selectedFiles);
    const validFiles: FileWithPreview[] = [];
    const errors: string[] = [];

    fileArray.forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        const fileWithPreview = file as FileWithPreview;
        if (file.type.startsWith('image/')) {
          fileWithPreview.preview = URL.createObjectURL(file);
        }
        validFiles.push(fileWithPreview);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      onUploadError(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  // Handle drag and drop
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter === 0) {
      setIsDragging(false);
    }
  }, [dragCounter]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, []);

  // Upload files
  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadPromises = files.map(async (file, index) => {
      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${index}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: '',
        uploadedAt: new Date().toISOString(),
        status: 'uploading',
        progress: 0
      };

      setUploadedFiles(prev => [...prev, uploadedFile]);

      try {
        const uploadOptions = {
          bucket,
          path,
          maxSize: maxSize * 1024 * 1024,
          allowedTypes: getAcceptedTypes()
        };

        const result = await FileStorageService.uploadFile(file, uploadOptions);

        if (result.success && result.file) {
          const updatedFile: UploadedFile = {
            ...uploadedFile,
            url: result.url || '',
            status: 'success',
            progress: 100
          };

          setUploadedFiles(prev => 
            prev.map(f => f.id === uploadedFile.id ? updatedFile : f)
          );

          return updatedFile;
        } else {
          const errorFile: UploadedFile = {
            ...uploadedFile,
            status: 'error',
            error: result.error || 'Upload failed'
          };

          setUploadedFiles(prev => 
            prev.map(f => f.id === uploadedFile.id ? errorFile : f)
          );

          throw new Error(result.error || 'Upload failed');
        }
      } catch (error) {
        console.error('Upload error:', error);
        const errorFile: UploadedFile = {
          ...uploadedFile,
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed'
        };

        setUploadedFiles(prev => 
          prev.map(f => f.id === uploadedFile.id ? errorFile : f)
        );

        throw error;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(file => file.status === 'success');
      onUploadComplete(successfulUploads);
      
      // Clear files after successful upload
      setFiles([]);
      setUploadedFiles([]);
    } catch (error) {
      console.error('Upload failed:', error);
      onUploadError('Some files failed to upload');
    } finally {
      setIsUploading(false);
    }
  };

  // Remove file
  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Remove uploaded file
  const removeUploadedFile = async (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file) {
      try {
        await FileStorageService.deleteFile(fileId, bucket);
        setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  // Handle crop
  const handleCrop = (file: FileWithPreview) => {
    setSelectedFile(file);
    setShowCropModal(true);
  };

  // Get file icon
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-8 h-8 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="w-8 h-8 text-purple-500" />;
    } else {
      return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isDragging ? 'Drop files here' : 'Upload files'}
        </h3>
        <p className="text-gray-500 mb-4">
          Drag and drop files here, or{' '}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            browse
          </button>
        </p>
        <p className="text-sm text-gray-400">
          {type === 'all' ? 'Images, documents, and videos' : type}s up to {maxSize}MB
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={getAcceptedTypes().join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Selected Files</h4>
          <div className="space-y-3">
            {files.map((file, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                {showPreview && file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded-lg mr-4"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                    {getFileIcon(file)}
                  </div>
                )}
                
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 truncate">{file.name}</h5>
                  <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                </div>

                <div className="flex items-center space-x-2">
                  {allowCrop && file.type.startsWith('image/') && (
                    <button
                      onClick={() => handleCrop(file)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Crop image"
                    >
                      <Crop className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => removeFile(index)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </p>
            <button
              onClick={uploadFiles}
              disabled={isUploading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload Files'}
            </button>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Upload Progress</h4>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {file.status === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    ) : file.status === 'error' ? (
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                    )}
                    <span className="font-medium text-gray-900">{file.name}</span>
                  </div>
                  
                  {file.status === 'success' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(file.url, '_blank')}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View file"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeUploadedFile(file.id)}
                        className="p-1 text-red-400 hover:text-red-600 transition-colors"
                        title="Delete file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {file.status === 'uploading' && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress || 0}%` }}
                    ></div>
                  </div>
                )}

                {file.status === 'error' && (
                  <p className="text-sm text-red-600">{file.error}</p>
                )}

                {file.status === 'success' && (
                  <p className="text-sm text-green-600">Upload successful</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {showCropModal && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Crop Image</h3>
              <button
                onClick={() => setShowCropModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <img
                src={selectedFile.preview}
                alt="Crop preview"
                className="max-w-full h-auto rounded-lg"
              />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowCropModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle crop save
                  setShowCropModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 