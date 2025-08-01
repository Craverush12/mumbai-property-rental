import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from '../lib/database.types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

export class AuthService {
  // Generate OTP for phone verification
  static async generateOTP(phone: string): Promise<{ success: boolean; message: string }> {
    try {
      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

      // Store OTP in database
      const { error } = await supabase
        .from('otp_verifications')
        .insert({
          phone,
          otp,
          expires_at: expiresAt.toISOString(),
          is_used: false
        });

      if (error) {
        console.error('Error storing OTP:', error);
        throw error;
      }

      // TODO: Integrate with WhatsApp Business API for OTP delivery
      // For now, we'll simulate OTP delivery
      console.log(`OTP for ${phone}: ${otp}`);

      return {
        success: true,
        message: 'OTP sent successfully via WhatsApp'
      };
    } catch (error) {
      console.error('AuthService.generateOTP error:', error);
      return {
        success: false,
        message: 'Failed to send OTP'
      };
    }
  }

  // Verify OTP and create/update user profile
  static async verifyOTP(phone: string, otp: string): Promise<{ 
    success: boolean; 
    user?: UserProfile; 
    message: string;
    isNewUser?: boolean;
  }> {
    try {
      // Find valid OTP
      const { data: otpData, error: otpError } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq('phone', phone)
        .eq('otp', otp)
        .eq('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (otpError || !otpData) {
        return {
          success: false,
          message: 'Invalid or expired OTP'
        };
      }

      // Mark OTP as used
      await supabase
        .from('otp_verifications')
        .update({ is_used: true })
        .eq('id', otpData.id);

      // Check if user profile exists
      const { data: existingUser, error: userError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('phone', phone)
        .single();

      let user: UserProfile;
      let isNewUser = false;

      if (userError || !existingUser) {
        // Create new user profile
        const { data: newUser, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            phone,
            is_verified: true,
            preferences: { notifications: true, language: 'en' }
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating user profile:', createError);
          throw createError;
        }

        user = newUser;
        isNewUser = true;
      } else {
        // Update existing user verification status
        const { data: updatedUser, error: updateError } = await supabase
          .from('user_profiles')
          .update({ is_verified: true })
          .eq('id', existingUser.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating user profile:', updateError);
          throw updateError;
        }

        user = updatedUser;
      }

      // Log activity
      await this.logActivity(user.id, 'phone_verification', {
        phone,
        verification_method: 'otp',
        is_new_user: isNewUser
      });

      return {
        success: true,
        user,
        message: isNewUser ? 'Account created successfully' : 'Login successful',
        isNewUser
      };
    } catch (error) {
      console.error('AuthService.verifyOTP error:', error);
      return {
        success: false,
        message: 'Verification failed'
      };
    }
  }

  // Get current user profile
  static async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('AuthService.getCurrentUserProfile error:', error);
      return null;
    }
  }

  // Update user profile
  static async updateProfile(updates: UserProfileUpdate): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      // Log activity
      await this.logActivity(user.id, 'profile_update', updates);

      return profile;
    } catch (error) {
      console.error('AuthService.updateProfile error:', error);
      return null;
    }
  }

  // Sign out user
  static async signOut(): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }

      return {
        success: true,
        message: 'Signed out successfully'
      };
    } catch (error) {
      console.error('AuthService.signOut error:', error);
      return {
        success: false,
        message: 'Failed to sign out'
      };
    }
  }

  // Check if phone number is verified
  static async isPhoneVerified(phone: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('is_verified')
        .eq('phone', phone)
        .single();

      if (error || !data) {
        return false;
      }

      return data.is_verified;
    } catch (error) {
      console.error('AuthService.isPhoneVerified error:', error);
      return false;
    }
  }

  // Resend OTP
  static async resendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    try {
      // Delete any existing unused OTPs for this phone
      await supabase
        .from('otp_verifications')
        .delete()
        .eq('phone', phone)
        .eq('is_used', false);

      // Generate new OTP
      return await this.generateOTP(phone);
    } catch (error) {
      console.error('AuthService.resendOTP error:', error);
      return {
        success: false,
        message: 'Failed to resend OTP'
      };
    }
  }

  // Log user activity
  private static async logActivity(
    userId: string, 
    activityType: string, 
    activityData: Record<string, any>
  ): Promise<void> {
    try {
      await supabase
        .from('user_activity_log')
        .insert({
          user_id: userId,
          activity_type: activityType,
          activity_data: activityData
        });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  // Get user by phone number
  static async getUserByPhone(phone: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('phone', phone)
        .single();

      if (error) {
        console.error('Error fetching user by phone:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('AuthService.getUserByPhone error:', error);
      return null;
    }
  }

  // Update user preferences
  static async updatePreferences(preferences: Record<string, any>): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({ preferences })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating preferences:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('AuthService.updatePreferences error:', error);
      return false;
    }
  }
}