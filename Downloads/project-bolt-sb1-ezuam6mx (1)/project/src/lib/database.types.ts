export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type SubscriptionStatus = 'active' | 'unsubscribed' | 'bounced'

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: number
          name: string
          location: string
          description: string
          guests: number
          bedrooms: number
          bathrooms: number
          price: number
          category: string
          aesthetic: string
          virtual_tour_url: string | null
          video_url: string | null
          images: string[]
          features: Json
          story: string
          testimonials: Json
          highlights: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          location: string
          description: string
          guests: number
          bedrooms: number
          bathrooms: number
          price: number
          category: string
          aesthetic: string
          virtual_tour_url?: string | null
          video_url?: string | null
          images?: string[]
          features?: Json
          story?: string
          testimonials?: Json
          highlights?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          location?: string
          description?: string
          guests?: number
          bedrooms?: number
          bathrooms?: number
          price?: number
          category?: string
          aesthetic?: string
          virtual_tour_url?: string | null
          video_url?: string | null
          images?: string[]
          features?: Json
          story?: string
          testimonials?: Json
          highlights?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          date_of_birth: string | null
          nationality: string | null
          profile_image_url: string | null
          bio: string | null
          preferred_language: string
          marketing_consent: boolean
          newsletter_subscribed: boolean
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          nationality?: string | null
          profile_image_url?: string | null
          bio?: string | null
          preferred_language?: string
          marketing_consent?: boolean
          newsletter_subscribed?: boolean
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          nationality?: string | null
          profile_image_url?: string | null
          bio?: string | null
          preferred_language?: string
          marketing_consent?: boolean
          newsletter_subscribed?: boolean
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: number
          property_id: number
          user_id: string
          check_in: string
          check_out: string
          guests: number
          total_amount: number
          special_requests: string | null
          confirmation_code: string | null
          status: BookingStatus
          guest_details: Json
          payment_status: PaymentStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          property_id: number
          user_id: string
          check_in: string
          check_out: string
          guests: number
          total_amount: number
          special_requests?: string | null
          confirmation_code?: string | null
          status?: BookingStatus
          guest_details?: Json
          payment_status?: PaymentStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          property_id?: number
          user_id?: string
          check_in?: string
          check_out?: string
          guests?: number
          total_amount?: number
          special_requests?: string | null
          confirmation_code?: string | null
          status?: BookingStatus
          guest_details?: Json
          payment_status?: PaymentStatus
          created_at?: string
          updated_at?: string
        }
      }
      booking_payments: {
        Row: {
          id: number
          booking_id: number
          payment_id: string
          payment_method: string
          amount: number
          currency: string
          status: PaymentStatus
          payment_gateway: string
          gateway_response: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          booking_id: number
          payment_id: string
          payment_method: string
          amount: number
          currency?: string
          status?: PaymentStatus
          payment_gateway?: string
          gateway_response?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          booking_id?: number
          payment_id?: string
          payment_method?: string
          amount?: number
          currency?: string
          status?: PaymentStatus
          payment_gateway?: string
          gateway_response?: Json
          created_at?: string
          updated_at?: string
        }
      }
      property_reviews: {
        Row: {
          id: number
          property_id: number
          user_id: string | null
          booking_id: number | null
          rating: number
          title: string | null
          review_text: string | null
          photos: string[]
          verified_stay: boolean
          helpful_votes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          property_id: number
          user_id?: string | null
          booking_id?: number | null
          rating: number
          title?: string | null
          review_text?: string | null
          photos?: string[]
          verified_stay?: boolean
          helpful_votes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          property_id?: number
          user_id?: string | null
          booking_id?: number | null
          rating?: number
          title?: string | null
          review_text?: string | null
          photos?: string[]
          verified_stay?: boolean
          helpful_votes?: number
          created_at?: string
          updated_at?: string
        }
      }
      property_amenities: {
        Row: {
          id: number
          property_id: number
          category: string
          name: string
          description: string | null
          icon: string | null
          available: boolean
          created_at: string
        }
        Insert: {
          id?: number
          property_id: number
          category: string
          name: string
          description?: string | null
          icon?: string | null
          available?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          property_id?: number
          category?: string
          name?: string
          description?: string | null
          icon?: string | null
          available?: boolean
          created_at?: string
        }
      }
      neighborhood_guides: {
        Row: {
          id: number
          property_id: number
          category: string
          title: string
          description: string | null
          location_name: string | null
          distance_meters: number | null
          rating: number | null
          price_range: string | null
          opening_hours: Json
          contact_info: Json
          images: string[]
          created_at: string
        }
        Insert: {
          id?: number
          property_id: number
          category: string
          title: string
          description?: string | null
          location_name?: string | null
          distance_meters?: number | null
          rating?: number | null
          price_range?: string | null
          opening_hours?: Json
          contact_info?: Json
          images?: string[]
          created_at?: string
        }
        Update: {
          id?: number
          property_id?: number
          category?: string
          title?: string
          description?: string | null
          location_name?: string | null
          distance_meters?: number | null
          rating?: number | null
          price_range?: string | null
          opening_hours?: Json
          contact_info?: Json
          images?: string[]
          created_at?: string
        }
      }
      property_suggestions: {
        Row: {
          id: number
          suggested_property_id: number
          user_preferences: Json
          created_at: string
        }
        Insert: {
          id?: number
          suggested_property_id: number
          user_preferences?: Json
          created_at?: string
        }
        Update: {
          id?: number
          suggested_property_id?: number
          user_preferences?: Json
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: number
          session_id: string | null
          user_id: string | null
          suggested_property_id: number | null
          preferences: Json
          converted_to_booking: boolean
          created_at: string
        }
        Insert: {
          id?: number
          session_id?: string | null
          user_id?: string | null
          suggested_property_id?: number | null
          preferences?: Json
          converted_to_booking?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          session_id?: string | null
          user_id?: string | null
          suggested_property_id?: number | null
          preferences?: Json
          converted_to_booking?: boolean
          created_at?: string
        }
      }
      user_favorites: {
        Row: {
          id: number
          user_id: string | null
          property_id: number | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id?: string | null
          property_id?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string | null
          property_id?: number | null
          created_at?: string
        }
      }
      user_activity_log: {
        Row: {
          id: number
          user_id: string | null
          activity_type: string
          ip_address: string | null
          user_agent: string | null
          activity_data: Json
          created_at: string
        }
        Insert: {
          id?: number
          user_id?: string | null
          activity_type: string
          ip_address?: string | null
          user_agent?: string | null
          activity_data?: Json
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string | null
          activity_type?: string
          ip_address?: string | null
          user_agent?: string | null
          activity_data?: Json
          created_at?: string
        }
      }
      newsletter_subscriptions: {
        Row: {
          id: number
          email: string
          full_name: string | null
          subscription_status: SubscriptionStatus
          subscription_source: string
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          email: string
          full_name?: string | null
          subscription_status?: SubscriptionStatus
          subscription_source?: string
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          email?: string
          full_name?: string | null
          subscription_status?: SubscriptionStatus
          subscription_source?: string
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      user_booking_history: {
        Row: {
          booking_id: number
          user_id: string
          property_id: number
          property_name: string
          property_location: string
          check_in: string
          check_out: string
          guests: number
          total_amount: number
          booking_status: string
          confirmation_code: string | null
          booking_created_at: string
        }
      }
    }
    Functions: {
      check_booking_conflicts: {
        Args: {
          p_property_id: number
          p_check_in: string
          p_check_out: string
          p_booking_id?: number
        }
        Returns: boolean
      }
      generate_confirmation_code: {
        Args: Record<string, never>
        Returns: string
      }
      update_updated_at_column: {
        Args: Record<string, never>
        Returns: unknown
      }
    }
    Enums: {
      booking_status: BookingStatus
      payment_status: PaymentStatus
      subscription_status: SubscriptionStatus
    }
  }
}