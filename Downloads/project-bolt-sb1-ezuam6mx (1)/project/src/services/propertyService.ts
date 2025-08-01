import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Property = Database['public']['Tables']['properties']['Row'];
type PropertyInsert = Database['public']['Tables']['properties']['Insert'];
type PropertyUpdate = Database['public']['Tables']['properties']['Update'];

export class PropertyService {
  static async getAllProperties(): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('PropertyService.getAllProperties error:', error);
      throw error;
    }
  }

  static async getPropertyById(id: number): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching property:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('PropertyService.getPropertyById error:', error);
      return null;
    }
  }

  static async getPropertiesByCategory(category: string): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('category', category)
        .order('price', { ascending: true });

      if (error) {
        console.error('Error fetching properties by category:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('PropertyService.getPropertiesByCategory error:', error);
      throw error;
    }
  }

  static async getPropertiesByAesthetic(aesthetic: string): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('aesthetic', aesthetic)
        .order('price', { ascending: true });

      if (error) {
        console.error('Error fetching properties by aesthetic:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('PropertyService.getPropertiesByAesthetic error:', error);
      throw error;
    }
  }

  static async searchProperties(query: string): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .or(`name.ilike.%${query}%,location.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching properties:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('PropertyService.searchProperties error:', error);
      throw error;
    }
  }

  static async filterProperties(filters: {
    minPrice?: number;
    maxPrice?: number;
    guests?: number;
    bedrooms?: number;
    category?: string;
    aesthetic?: string;
    location?: string;
  }): Promise<Property[]> {
    try {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('is_active', true);

      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.guests !== undefined) {
        query = query.gte('guests', filters.guests);
      }

      if (filters.bedrooms !== undefined) {
        query = query.gte('bedrooms', filters.bedrooms);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.aesthetic) {
        query = query.eq('aesthetic', filters.aesthetic);
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      const { data, error } = await query.order('price', { ascending: true });

      if (error) {
        console.error('Error filtering properties:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('PropertyService.filterProperties error:', error);
      throw error;
    }
  }

  static async createProperty(property: PropertyInsert): Promise<Property> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert(property)
        .select()
        .single();

      if (error) {
        console.error('Error creating property:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('PropertyService.createProperty error:', error);
      throw error;
    }
  }

  static async updateProperty(id: number, updates: PropertyUpdate): Promise<Property> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating property:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('PropertyService.updateProperty error:', error);
      throw error;
    }
  }

  static async deleteProperty(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('Error deleting property:', error);
        throw error;
      }
    } catch (error) {
      console.error('PropertyService.deleteProperty error:', error);
      throw error;
    }
  }

  static async getPropertyCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('category')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching property categories:', error);
        throw error;
      }

      const categories = [...new Set(data?.map(p => p.category) || [])];
      return categories;
    } catch (error) {
      console.error('PropertyService.getPropertyCategories error:', error);
      throw error;
    }
  }

  static async getPropertyAesthetics(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('aesthetic')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching property aesthetics:', error);
        throw error;
      }

      const aesthetics = [...new Set(data?.map(p => p.aesthetic) || [])];
      return aesthetics;
    } catch (error) {
      console.error('PropertyService.getPropertyAesthetics error:', error);
      throw error;
    }
  }

  static async getPropertyLocations(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('location')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching property locations:', error);
        throw error;
      }

      const locations = [...new Set(data?.map(p => p.location) || [])];
      return locations;
    } catch (error) {
      console.error('PropertyService.getPropertyLocations error:', error);
      throw error;
    }
  }
}