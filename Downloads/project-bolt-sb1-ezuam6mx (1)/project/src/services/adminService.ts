import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Property = Database['public']['Tables']['properties']['Row'];
type Booking = Database['public']['Tables']['bookings']['Row'];
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface DashboardStats {
  totalProperties: number;
  totalBookings: number;
  totalUsers: number;
  totalRevenue: number;
  activeBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  monthlyRevenue: number;
  monthlyGrowth: number;
  occupancyRate: number;
  averageRating: number;
}

interface PropertyFormData {
  name: string;
  location: string;
  description: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  category: string;
  aesthetic: string;
  images: string[];
  features: any;
  story: string;
}

interface BookingUpdateData {
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  payment_status: 'paid' | 'pending' | 'failed';
  notes?: string;
}

interface UserUpdateData {
  full_name?: string;
  email?: string;
  phone?: string;
  is_active?: boolean;
  role?: 'user' | 'admin';
}

class AdminService {
  private static instance: AdminService;

  private constructor() {}

  static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  // Dashboard Statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Get total properties
      const { count: totalProperties } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      // Get total bookings
      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      // Get total users
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Get booking statistics
      const { data: bookings } = await supabase
        .from('bookings')
        .select('status, total_amount, created_at');

      // Calculate revenue and booking stats
      const totalRevenue = bookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;
      const activeBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;
      const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
      const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;
      const cancelledBookings = bookings?.filter(b => b.status === 'cancelled').length || 0;

      // Calculate monthly revenue
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyBookings = bookings?.filter(b => {
        const bookingDate = new Date(b.created_at);
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
      }) || [];
      const monthlyRevenue = monthlyBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);

      // Calculate occupancy rate (simplified)
      const occupancyRate = totalProperties ? (activeBookings / totalProperties) * 100 : 0;

      return {
        totalProperties: totalProperties || 0,
        totalBookings: totalBookings || 0,
        totalUsers: totalUsers || 0,
        totalRevenue,
        activeBookings,
        pendingBookings,
        completedBookings,
        cancelledBookings,
        monthlyRevenue,
        monthlyGrowth: 12.5, // This would be calculated from historical data
        occupancyRate: Math.round(occupancyRate),
        averageRating: 4.8 // This would come from reviews table
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Property Management
  async getAllProperties(): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

  async createProperty(propertyData: PropertyFormData): Promise<Property> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  async updateProperty(id: number, propertyData: Partial<PropertyFormData>): Promise<Property> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }

  async deleteProperty(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }

  async uploadPropertyImage(file: File): Promise<string> {
    try {
      const fileName = `properties/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading property image:', error);
      throw error;
    }
  }

  // Booking Management
  async getAllBookings(): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          properties(name, location),
          user_profiles(full_name, phone, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  async updateBooking(id: string, bookingData: BookingUpdateData): Promise<Booking> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(bookingData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  async getBookingAnalytics(): Promise<any> {
    try {
      const { data: bookings } = await supabase
        .from('bookings')
        .select('status, total_amount, created_at, check_in, check_out');

      // Calculate analytics
      const monthlyData = this.calculateMonthlyAnalytics(bookings || []);
      const statusDistribution = this.calculateStatusDistribution(bookings || []);
      const revenueTrends = this.calculateRevenueTrends(bookings || []);

      return {
        monthlyData,
        statusDistribution,
        revenueTrends
      };
    } catch (error) {
      console.error('Error fetching booking analytics:', error);
      throw error;
    }
  }

  // User Management
  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async updateUser(id: string, userData: UserUpdateData): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(userData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deactivateUser(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }

  async getUserAnalytics(): Promise<any> {
    try {
      const { data: users } = await supabase
        .from('user_profiles')
        .select('created_at, phone');

      // Calculate user growth
      const userGrowth = this.calculateUserGrowth(users || []);
      const userActivity = this.calculateUserActivity(users || []);

      return {
        userGrowth,
        userActivity
      };
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      throw error;
    }
  }

  // Analytics Helper Methods
  private calculateMonthlyAnalytics(bookings: any[]): any[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map((month, index) => {
      const monthBookings = bookings.filter(b => {
        const bookingDate = new Date(b.created_at);
        return bookingDate.getMonth() === index;
      });
      
      return {
        month,
        bookings: monthBookings.length,
        revenue: monthBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)
      };
    });

    return monthlyData;
  }

  private calculateStatusDistribution(bookings: any[]): any[] {
    const statuses = ['confirmed', 'pending', 'completed', 'cancelled'];
    return statuses.map(status => ({
      status,
      count: bookings.filter(b => b.status === status).length
    }));
  }

  private calculateRevenueTrends(bookings: any[]): any[] {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date;
    }).reverse();

    return last6Months.map(date => {
      const monthBookings = bookings.filter(b => {
        const bookingDate = new Date(b.created_at);
        return bookingDate.getMonth() === date.getMonth() && 
               bookingDate.getFullYear() === date.getFullYear();
      });

      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        revenue: monthBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)
      };
    });
  }

  private calculateUserGrowth(users: any[]): any[] {
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date;
    }).reverse();

    return last12Months.map(date => {
      const monthUsers = users.filter(u => {
        const userDate = new Date(u.created_at);
        return userDate.getMonth() === date.getMonth() && 
               userDate.getFullYear() === date.getFullYear();
      });

      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        newUsers: monthUsers.length
      };
    });
  }

  private calculateUserActivity(users: any[]): any {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => {
      // This would be calculated based on recent activity
      return true; // Simplified for now
    }).length;

    return {
      totalUsers,
      activeUsers,
      activityRate: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0
    };
  }

  // System Settings
  async getSystemSettings(): Promise<any> {
    try {
      // This would typically come from a settings table
      return {
        siteName: 'Infiniti Casa',
        contactEmail: 'admin@infiniticasa.com',
        notifications: {
          email: true,
          sms: false,
          whatsapp: true
        },
        maintenance: false
      };
    } catch (error) {
      console.error('Error fetching system settings:', error);
      throw error;
    }
  }

  async updateSystemSettings(settings: any): Promise<void> {
    try {
      // This would typically update a settings table
      console.log('Updating system settings:', settings);
    } catch (error) {
      console.error('Error updating system settings:', error);
      throw error;
    }
  }

  // Export Data
  async exportData(type: 'properties' | 'bookings' | 'users'): Promise<string> {
    try {
      let data: any[] = [];
      
      switch (type) {
        case 'properties':
          data = await this.getAllProperties();
          break;
        case 'bookings':
          data = await this.getAllBookings();
          break;
        case 'users':
          data = await this.getAllUsers();
          break;
      }

      const csv = this.convertToCSV(data);
      return csv;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  }

  // Notifications
  async sendNotification(userId: string, message: string, type: 'email' | 'sms' | 'whatsapp'): Promise<void> {
    try {
      // This would integrate with notification services
      console.log(`Sending ${type} notification to user ${userId}: ${message}`);
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  async sendBulkNotification(userIds: string[], message: string, type: 'email' | 'sms' | 'whatsapp'): Promise<void> {
    try {
      // This would send notifications to multiple users
      console.log(`Sending bulk ${type} notification to ${userIds.length} users: ${message}`);
    } catch (error) {
      console.error('Error sending bulk notification:', error);
      throw error;
    }
  }
}

export default AdminService.getInstance(); 