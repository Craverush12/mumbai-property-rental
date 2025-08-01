import { useState, useEffect } from 'react';
import { AuthService } from '../services/authService';
import type { Database } from '../lib/database.types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing user session on mount
  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      setLoading(true);
      const profile = await AuthService.getCurrentUserProfile();
      setUser(profile);
    } catch (error) {
      console.error('Error checking user session:', error);
      setError('Failed to check user session');
    } finally {
      setLoading(false);
    }
  };

  const generateOTP = async (phone: string) => {
    try {
      setError(null);
      const result = await AuthService.generateOTP(phone);
      
      if (!result.success) {
        setError(result.message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error generating OTP:', error);
      setError('Failed to send OTP');
      return false;
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await AuthService.verifyOTP(phone, otp);
      
      if (!result.success) {
        setError(result.message);
        return { success: false, isNewUser: false };
      }
      
      setUser(result.user || null);
      return { success: true, isNewUser: result.isNewUser || false };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Failed to verify OTP');
      return { success: false, isNewUser: false };
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async (phone: string) => {
    try {
      setError(null);
      const result = await AuthService.resendOTP(phone);
      
      if (!result.success) {
        setError(result.message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error resending OTP:', error);
      setError('Failed to resend OTP');
      return false;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await AuthService.signOut();
      
      if (!result.success) {
        setError(result.message);
        return false;
      }
      
      setUser(null);
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setError(null);
      const updatedProfile = await AuthService.updateProfile(updates);
      
      if (updatedProfile) {
        setUser(updatedProfile);
        return true;
      }
      
      setError('Failed to update profile');
      return false;
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
      return false;
    }
  };

  const updatePreferences = async (preferences: Record<string, any>) => {
    try {
      setError(null);
      const success = await AuthService.updatePreferences(preferences);
      
      if (success && user) {
        setUser({ ...user, preferences });
        return true;
      }
      
      setError('Failed to update preferences');
      return false;
    } catch (error) {
      console.error('Error updating preferences:', error);
      setError('Failed to update preferences');
      return false;
    }
  };

  const isPhoneVerified = async (phone: string) => {
    try {
      return await AuthService.isPhoneVerified(phone);
    } catch (error) {
      console.error('Error checking phone verification:', error);
      return false;
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    generateOTP,
    verifyOTP,
    resendOTP,
    signOut,
    updateProfile,
    updatePreferences,
    isPhoneVerified,
    checkUserSession
  };
};