import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type NewsletterSubscription = Database['public']['Tables']['newsletter_subscriptions']['Row'];
type UserActivity = Database['public']['Tables']['user_activity_log']['Row'];
type UserFavorite = Database['public']['Tables']['user_favorites']['Row'];

export interface UserProfileUpdate {
  full_name?: string;
  phone?: string;
  date_of_birth?: string;
  nationality?: string;
  preferred_language?: string;
  marketing_consent?: boolean;
  newsletter_subscribed?: boolean;
  profile_image_url?: string;
  bio?: string;
  preferences?: Record<string, any>;
}

export interface NewsletterSubscriptionData {
  email: string;
  full_name?: string;
  subscription_source?: string;
  preferences?: Record<string, any>;
}

export class UserService {
  // Get current user profile
  static async getCurrentUserProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  }

  // Update user profile
  static async updateUserProfile(updates: UserProfileUpdate): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }

    return data;
  }

  // Subscribe to newsletter
  static async subscribeToNewsletter(subscriptionData: NewsletterSubscriptionData): Promise<NewsletterSubscription | null> {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .upsert(subscriptionData, { onConflict: 'email' })
      .select()
      .single();

    if (error) {
      console.error('Error subscribing to newsletter:', error);
      return null;
    }

    return data;
  }

  // Unsubscribe from newsletter
  static async unsubscribeFromNewsletter(email: string): Promise<boolean> {
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .update({ subscription_status: 'unsubscribed' })
      .eq('email', email);

    if (error) {
      console.error('Error unsubscribing from newsletter:', error);
      return false;
    }

    return true;
  }

  // Log user activity
  static async logActivity(activityType: string, activityData: Record<string, any> = {}): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('user_activity_log')
      .insert({
        user_id: user.id,
        activity_type: activityType,
        activity_data: activityData
      });

    if (error) {
      console.error('Error logging user activity:', error);
      return false;
    }

    return true;
  }

  // Add property to favorites
  static async addToFavorites(propertyId: number): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: user.id,
        property_id: propertyId
      });

    if (error && error.code !== '23505') { // Ignore unique constraint violations
      console.error('Error adding to favorites:', error);
      return false;
    }

    return true;
  }

  // Remove property from favorites
  static async removeFromFavorites(propertyId: number): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('property_id', propertyId);

    if (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }

    return true;
  }

  // Get user favorites
  static async getUserFavorites(): Promise<UserFavorite[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        *,
        properties (
          id,
          name,
          location,
          price,
          images
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching user favorites:', error);
      return [];
    }

    return data || [];
  }

  // Check if property is in favorites
  static async isPropertyFavorited(propertyId: number): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', propertyId)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignore "not found" errors
      console.error('Error checking favorite status:', error);
      return false;
    }

    return !!data;
  }

  // Get user booking history
  static async getUserBookingHistory(): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_booking_history')
      .select('*')
      .eq('user_id', user.id)
      .order('booking_created_at', { ascending: false });

    if (error) {
      console.error('Error fetching booking history:', error);
      return [];
    }

    return data || [];
  }

  // Get user activity log
  static async getUserActivityLog(limit: number = 50): Promise<UserActivity[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_activity_log')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user activity:', error);
      return [];
    }

    return data || [];
  }

  // Update user preferences
  static async updateUserPreferences(preferences: Record<string, any>): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('user_profiles')
      .update({ preferences })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating user preferences:', error);
      return false;
    }

    return true;
  }

  // Get user preferences
  static async getUserPreferences(): Promise<Record<string, any> | null> {
    const profile = await this.getCurrentUserProfile();
    return profile?.preferences || null;
  }
} 