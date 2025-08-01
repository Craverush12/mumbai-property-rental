import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface UserActivity {
  id: string;
  user_id: string;
  activity_type: 'login' | 'booking' | 'profile_update' | 'property_view' | 'search' | 'payment';
  activity_data: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: 'user' | 'admin' | 'moderator' | 'host';
  permissions: string[];
  created_at: string;
  updated_at: string;
}

interface UserPrivacySettings {
  user_id: string;
  profile_visibility: 'public' | 'private' | 'friends_only';
  contact_visibility: 'public' | 'private' | 'verified_only';
  booking_history_visibility: 'public' | 'private' | 'friends_only';
  activity_visibility: 'public' | 'private' | 'friends_only';
  marketing_emails: boolean;
  sms_notifications: boolean;
  whatsapp_notifications: boolean;
  push_notifications: boolean;
  data_sharing: boolean;
  analytics_tracking: boolean;
}

interface ProgressiveProfileData {
  step: number;
  required_fields: string[];
  optional_fields: string[];
  completion_percentage: number;
  next_step?: string;
}

class UserManagementService {
  private static instance: UserManagementService;

  private constructor() {}

  static getInstance(): UserManagementService {
    if (!UserManagementService.instance) {
      UserManagementService.instance = new UserManagementService();
    }
    return UserManagementService.instance;
  }

  // Phone Number Validation and Verification
  async validatePhoneNumber(phone: string): Promise<{ valid: boolean; country?: string; formatted?: string }> {
    try {
      // Basic phone number validation
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      const isValid = phoneRegex.test(phone);
      
      if (!isValid) {
        return { valid: false };
      }

      // Extract country code
      const countryCode = phone.substring(0, 3);
      const country = this.getCountryFromCode(countryCode);

      // Format phone number
      const formatted = this.formatPhoneNumber(phone);

      return {
        valid: true,
        country,
        formatted
      };
    } catch (error) {
      console.error('Error validating phone number:', error);
      return { valid: false };
    }
  }

  private getCountryFromCode(code: string): string {
    const countryCodes: { [key: string]: string } = {
      '+91': 'India',
      '+1': 'United States',
      '+44': 'United Kingdom',
      '+61': 'Australia',
      '+86': 'China',
      '+81': 'Japan',
      '+49': 'Germany',
      '+33': 'France',
      '+39': 'Italy',
      '+34': 'Spain'
    };
    return countryCodes[code] || 'Unknown';
  }

  private formatPhoneNumber(phone: string): string {
    // Format based on country code
    if (phone.startsWith('+91')) {
      // Indian format: +91 98765 43210
      return `${phone.substring(0, 3)} ${phone.substring(3, 8)} ${phone.substring(8)}`;
    }
    return phone;
  }

  // User Activity Tracking
  async trackUserActivity(
    userId: string,
    activityType: UserActivity['activity_type'],
    activityData: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      const activity: Omit<UserActivity, 'id' | 'created_at'> = {
        user_id: userId,
        activity_type: activityType,
        activity_data: activityData,
        ip_address: ipAddress,
        user_agent: userAgent
      };

      const { error } = await supabase
        .from('user_activity_log')
        .insert([activity]);

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking user activity:', error);
    }
  }

  async getUserActivity(userId: string, limit: number = 50): Promise<UserActivity[]> {
    try {
      const { data, error } = await supabase
        .from('user_activity_log')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user activity:', error);
      return [];
    }
  }

  // Admin User Roles and Permissions
  async createUserRole(userId: string, role: UserRole['role'], permissions: string[]): Promise<UserRole> {
    try {
      const userRole: Omit<UserRole, 'id' | 'created_at' | 'updated_at'> = {
        user_id: userId,
        role,
        permissions
      };

      const { data, error } = await supabase
        .from('user_roles')
        .insert([userRole])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user role:', error);
      throw error;
    }
  }

  async getUserRole(userId: string): Promise<UserRole | null> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  }

  async updateUserRole(userId: string, role: UserRole['role'], permissions: string[]): Promise<UserRole> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .update({ role, permissions, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  async hasPermission(userId: string, permission: string): Promise<boolean> {
    try {
      const userRole = await this.getUserRole(userId);
      if (!userRole) return false;

      return userRole.permissions.includes(permission) || userRole.role === 'admin';
    } catch (error) {
      console.error('Error checking user permission:', error);
      return false;
    }
  }

  // Progressive Profile Management
  async getProgressiveProfileData(userId: string): Promise<ProgressiveProfileData> {
    try {
      const { data: user } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!user) throw new Error('User not found');

      const requiredFields = ['phone', 'full_name'];
      const optionalFields = ['email', 'date_of_birth', 'nationality', 'preferences'];

      const completedRequired = requiredFields.filter(field => user[field as keyof UserProfile]).length;
      const completedOptional = optionalFields.filter(field => user[field as keyof UserProfile]).length;

      const totalRequired = requiredFields.length;
      const completionPercentage = Math.round((completedRequired / totalRequired) * 100);

      let nextStep: string | undefined;
      if (!user.full_name) {
        nextStep = 'Add your full name';
      } else if (!user.email) {
        nextStep = 'Add your email address';
      } else if (!user.date_of_birth) {
        nextStep = 'Add your date of birth';
      } else if (!user.nationality) {
        nextStep = 'Add your nationality';
      }

      return {
        step: Math.min(completedRequired + 1, 5),
        required_fields: requiredFields,
        optional_fields: optionalFields,
        completion_percentage: completionPercentage,
        next_step: nextStep
      };
    } catch (error) {
      console.error('Error getting progressive profile data:', error);
      throw error;
    }
  }

  async updateProgressiveProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      // Track profile update activity
      await this.trackUserActivity(userId, 'profile_update', {
        updated_fields: Object.keys(profileData)
      });

      return data;
    } catch (error) {
      console.error('Error updating progressive profile:', error);
      throw error;
    }
  }

  // User Privacy Controls
  async getUserPrivacySettings(userId: string): Promise<UserPrivacySettings> {
    try {
      const { data, error } = await supabase
        .from('user_privacy_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        // Create default privacy settings
        return await this.createDefaultPrivacySettings(userId);
      }

      return data;
    } catch (error) {
      console.error('Error fetching user privacy settings:', error);
      throw error;
    }
  }

  private async createDefaultPrivacySettings(userId: string): Promise<UserPrivacySettings> {
    try {
      const defaultSettings: Omit<UserPrivacySettings, 'user_id'> = {
        profile_visibility: 'public',
        contact_visibility: 'private',
        booking_history_visibility: 'private',
        activity_visibility: 'private',
        marketing_emails: true,
        sms_notifications: true,
        whatsapp_notifications: true,
        push_notifications: true,
        data_sharing: false,
        analytics_tracking: true
      };

      const { data, error } = await supabase
        .from('user_privacy_settings')
        .insert([{ user_id: userId, ...defaultSettings }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating default privacy settings:', error);
      throw error;
    }
  }

  async updateUserPrivacySettings(userId: string, settings: Partial<UserPrivacySettings>): Promise<UserPrivacySettings> {
    try {
      const { data, error } = await supabase
        .from('user_privacy_settings')
        .update(settings)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      // Track privacy settings update
      await this.trackUserActivity(userId, 'profile_update', {
        updated_privacy_settings: Object.keys(settings)
      });

      return data;
    } catch (error) {
      console.error('Error updating user privacy settings:', error);
      throw error;
    }
  }

  // User Data Management
  async getUserData(userId: string): Promise<any> {
    try {
      const [profile, activity, privacySettings] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('id', userId).single(),
        this.getUserActivity(userId, 10),
        this.getUserPrivacySettings(userId)
      ]);

      return {
        profile: profile.data,
        recent_activity: activity,
        privacy_settings: privacySettings
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  async exportUserData(userId: string): Promise<string> {
    try {
      const userData = await this.getUserData(userId);
      
      // Convert to JSON for export
      const exportData = {
        export_date: new Date().toISOString(),
        user_data: userData
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  }

  async deleteUserData(userId: string): Promise<void> {
    try {
      // Anonymize user data instead of complete deletion for compliance
      const anonymizedData = {
        full_name: 'Deleted User',
        email: null,
        phone: 'DELETED',
        date_of_birth: null,
        nationality: null,
        preferences: null,
        is_active: false,
        deleted_at: new Date().toISOString()
      };

      await supabase
        .from('user_profiles')
        .update(anonymizedData)
        .eq('id', userId);

      // Track data deletion
      await this.trackUserActivity(userId, 'profile_update', {
        action: 'data_deletion',
        anonymized: true
      });
    } catch (error) {
      console.error('Error deleting user data:', error);
      throw error;
    }
  }

  // User Analytics
  async getUserAnalytics(userId: string): Promise<any> {
    try {
      const [activity, bookings, profile] = await Promise.all([
        this.getUserActivity(userId, 100),
        supabase.from('bookings').select('*').eq('user_id', userId),
        supabase.from('user_profiles').select('*').eq('id', userId).single()
      ]);

      const totalBookings = bookings.data?.length || 0;
      const totalSpent = bookings.data?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;
      const averageBookingValue = totalBookings > 0 ? totalSpent / totalBookings : 0;

      const activityTypes = activity.reduce((acc, act) => {
        acc[act.activity_type] = (acc[act.activity_type] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      return {
        user_id: userId,
        total_bookings: totalBookings,
        total_spent: totalSpent,
        average_booking_value: averageBookingValue,
        activity_summary: activityTypes,
        last_activity: activity[0]?.created_at,
        profile_completion: await this.getProgressiveProfileData(userId)
      };
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      throw error;
    }
  }

  // Admin Functions
  async getAllUsers(limit: number = 50, offset: number = 0): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  async searchUsers(query: string): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .or(`full_name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  async deactivateUser(userId: string, reason?: string): Promise<void> {
    try {
      await supabase
        .from('user_profiles')
        .update({ 
          is_active: false, 
          deactivated_at: new Date().toISOString(),
          deactivation_reason: reason 
        })
        .eq('id', userId);

      // Track deactivation
      await this.trackUserActivity(userId, 'profile_update', {
        action: 'deactivation',
        reason
      });
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }

  async reactivateUser(userId: string): Promise<void> {
    try {
      await supabase
        .from('user_profiles')
        .update({ 
          is_active: true, 
          deactivated_at: null,
          deactivation_reason: null 
        })
        .eq('id', userId);

      // Track reactivation
      await this.trackUserActivity(userId, 'profile_update', {
        action: 'reactivation'
      });
    } catch (error) {
      console.error('Error reactivating user:', error);
      throw error;
    }
  }
}

export default UserManagementService.getInstance(); 