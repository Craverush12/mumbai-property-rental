import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Booking = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

export class BookingService {
  // Create a new booking
  static async createBooking(bookingData: Omit<BookingInsert, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('BookingService.createBooking error:', error);
      throw error;
    }
  }

  // Get booking by ID
  static async getBookingById(bookingId: string): Promise<Booking | null> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          properties (
            id,
            name,
            location,
            images,
            price
          ),
          user_profiles (
            id,
            full_name,
            phone,
            email
          )
        `)
        .eq('id', bookingId)
        .single();

      if (error) {
        console.error('Error fetching booking:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('BookingService.getBookingById error:', error);
      throw error;
    }
  }

  // Get all bookings for a user
  static async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          properties (
            id,
            name,
            location,
            images,
            price
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user bookings:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('BookingService.getUserBookings error:', error);
      throw error;
    }
  }

  // Get all bookings for a property
  static async getPropertyBookings(propertyId: number): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          user_profiles (
            id,
            full_name,
            phone,
            email
          )
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching property bookings:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('BookingService.getPropertyBookings error:', error);
      throw error;
    }
  }

  // Update booking status
  static async updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<Booking> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) {
        console.error('Error updating booking status:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('BookingService.updateBookingStatus error:', error);
      throw error;
    }
  }

  // Cancel booking
  static async cancelBooking(bookingId: string, cancellationReason?: string): Promise<Booking> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled',
          cancellation_reason: cancellationReason,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) {
        console.error('Error cancelling booking:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('BookingService.cancelBooking error:', error);
      throw error;
    }
  }

  // Check availability for a property
  static async checkAvailability(
    propertyId: number, 
    checkInDate: string, 
    checkOutDate: string,
    excludeBookingId?: string
  ): Promise<{ available: boolean; conflictingBookings?: Booking[] }> {
    try {
      let query = supabase
        .from('bookings')
        .select('*')
        .eq('property_id', propertyId)
        .neq('status', 'cancelled')
        .or(`check_in_date.lte.${checkOutDate},check_out_date.gte.${checkInDate}`);

      if (excludeBookingId) {
        query = query.neq('id', excludeBookingId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error checking availability:', error);
        throw error;
      }

      const conflictingBookings = data || [];
      const available = conflictingBookings.length === 0;

      return {
        available,
        conflictingBookings: available ? undefined : conflictingBookings
      };
    } catch (error) {
      console.error('BookingService.checkAvailability error:', error);
      throw error;
    }
  }

  // Get booking statistics
  static async getBookingStats(userId?: string): Promise<{
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    revenue: number;
  }> {
    try {
      let query = supabase
        .from('bookings')
        .select('status, total_amount');

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching booking stats:', error);
        throw error;
      }

      const bookings = data || [];
      const stats = {
        total: bookings.length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        pending: bookings.filter(b => b.status === 'pending').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
        revenue: bookings
          .filter(b => b.status === 'confirmed')
          .reduce((sum, b) => sum + (b.total_amount || 0), 0)
      };

      return stats;
    } catch (error) {
      console.error('BookingService.getBookingStats error:', error);
      throw error;
    }
  }

  // Search bookings with filters
  static async searchBookings(filters: {
    userId?: string;
    propertyId?: number;
    status?: 'pending' | 'confirmed' | 'cancelled';
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ bookings: Booking[]; total: number }> {
    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          properties (
            id,
            name,
            location,
            images
          ),
          user_profiles (
            id,
            full_name,
            phone
          )
        `, { count: 'exact' });

      // Apply filters
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters.propertyId) {
        query = query.eq('property_id', filters.propertyId);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.dateFrom) {
        query = query.gte('check_in_date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('check_out_date', filters.dateTo);
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error searching bookings:', error);
        throw error;
      }

      return {
        bookings: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('BookingService.searchBookings error:', error);
      throw error;
    }
  }

  // Calculate booking total
  static async calculateBookingTotal(
    propertyId: number,
    checkInDate: string,
    checkOutDate: string,
    guests: number
  ): Promise<{
    nightlyRate: number;
    totalNights: number;
    subtotal: number;
    serviceFee: number;
    total: number;
  }> {
    try {
      // Get property price
      const { data: property, error } = await supabase
        .from('properties')
        .select('price')
        .eq('id', propertyId)
        .single();

      if (error) {
        console.error('Error fetching property price:', error);
        throw error;
      }

      const nightlyRate = property.price;
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const totalNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      
      const subtotal = nightlyRate * totalNights;
      const serviceFee = Math.round(subtotal * 0.12); // 12% service fee
      const total = subtotal + serviceFee;

      return {
        nightlyRate,
        totalNights,
        subtotal,
        serviceFee,
        total
      };
    } catch (error) {
      console.error('BookingService.calculateBookingTotal error:', error);
      throw error;
    }
  }

  // Get upcoming bookings
  static async getUpcomingBookings(userId: string, limit: number = 5): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          properties (
            id,
            name,
            location,
            images
          )
        `)
        .eq('user_id', userId)
        .gte('check_in_date', new Date().toISOString())
        .neq('status', 'cancelled')
        .order('check_in_date', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching upcoming bookings:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('BookingService.getUpcomingBookings error:', error);
      throw error;
    }
  }

  // Get past bookings
  static async getPastBookings(userId: string, limit: number = 10): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          properties (
            id,
            name,
            location,
            images
          )
        `)
        .eq('user_id', userId)
        .lt('check_out_date', new Date().toISOString())
        .order('check_out_date', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching past bookings:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('BookingService.getPastBookings error:', error);
      throw error;
    }
  }
}