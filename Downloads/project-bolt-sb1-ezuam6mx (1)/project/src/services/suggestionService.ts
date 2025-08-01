import { supabase } from '../lib/supabase';
import { PropertyService } from './propertyService';
import type { Database } from '../lib/database.types';

type PropertySuggestion = Database['public']['Tables']['property_suggestions']['Row'];

export interface UserPreferences {
  groupSize: string;
  purpose: string;
  aesthetic: string;
  budget: string;
  duration: string;
}

export class SuggestionService {
  // Get property suggestion based on user preferences
  static async getPropertySuggestion(preferences: UserPreferences): Promise<any> {
    try {
      // Get all properties
      const properties = await PropertyService.getAllProperties();
      
      if (properties.length === 0) {
        throw new Error('No properties available');
      }

      // Calculate scores for each property
      const scores: { [key: number]: number } = {};
      
      properties.forEach(property => {
        scores[property.id] = 0;
      });

      // Group size scoring
      const groupSize = parseInt(preferences.groupSize);
      properties.forEach(property => {
        if (groupSize <= property.guests) {
          scores[property.id] += 3;
          if (Math.abs(groupSize - property.guests) <= 2) {
            scores[property.id] += 2; // Bonus for optimal size
          }
        }
      });

      // Purpose scoring
      properties.forEach(property => {
        if (preferences.purpose === 'romantic') {
          if (property.category === 'Studio') scores[property.id] += 5;
          if (property.category === 'Heritage') scores[property.id] += 3;
        } else if (preferences.purpose === 'business') {
          if (property.category === 'Urban Zen') scores[property.id] += 5;
          if (property.category === 'Penthouse') scores[property.id] += 4;
        } else if (preferences.purpose === 'celebration') {
          if (property.category === 'Penthouse') scores[property.id] += 5;
          if (property.category === 'Heritage') scores[property.id] += 4;
        } else if (preferences.purpose === 'cultural') {
          if (property.category === 'Art & Culture') scores[property.id] += 5;
          if (property.category === 'Heritage') scores[property.id] += 4;
        } else if (preferences.purpose === 'relaxation') {
          if (property.category === 'Urban Zen') scores[property.id] += 5;
          if (property.category === 'Studio') scores[property.id] += 4;
        }
      });

      // Aesthetic scoring
      properties.forEach(property => {
        if (preferences.aesthetic === 'modern') {
          if (property.aesthetic.includes('luxury') || property.aesthetic.includes('zen')) {
            scores[property.id] += 4;
          }
          if (property.aesthetic.includes('contemporary')) {
            scores[property.id] += 3;
          }
        } else if (preferences.aesthetic === 'traditional') {
          if (property.aesthetic.includes('heritage') || property.aesthetic.includes('grandeur')) {
            scores[property.id] += 5;
          }
        } else if (preferences.aesthetic === 'artistic') {
          if (property.aesthetic.includes('art') || property.aesthetic.includes('scandinavian')) {
            scores[property.id] += 5;
          }
        } else if (preferences.aesthetic === 'minimalist') {
          if (property.aesthetic.includes('zen') || property.aesthetic.includes('scandinavian')) {
            scores[property.id] += 5;
          }
        }
      });

      // Budget scoring
      const budget = parseInt(preferences.budget);
      properties.forEach(property => {
        if (property.price <= budget) {
          scores[property.id] += 3;
          if (property.price <= budget * 0.8) {
            scores[property.id] += 2; // Bonus for being well within budget
          }
        }
      });

      // Find the property with the highest score
      const bestPropertyId = Object.entries(scores).reduce((a, b) => 
        scores[parseInt(a[0])] > scores[parseInt(b[0])] ? a : b
      )[0];

      const suggestedProperty = properties.find(p => p.id === parseInt(bestPropertyId));

      if (!suggestedProperty) {
        throw new Error('No suitable property found');
      }

      // Save the suggestion to database
      await this.saveSuggestion(preferences, suggestedProperty.id);

      return {
        id: suggestedProperty.id,
        name: suggestedProperty.name,
        category: suggestedProperty.category,
        price: suggestedProperty.price,
        guests: suggestedProperty.guests,
        aesthetic: suggestedProperty.aesthetic
      };
    } catch (error) {
      console.error('Error getting property suggestion:', error);
      throw new Error('Failed to get property suggestion');
    }
  }

  // Save suggestion to database for analytics
  static async saveSuggestion(preferences: UserPreferences, propertyId: number): Promise<PropertySuggestion> {
    const { data, error } = await supabase
      .from('property_suggestions')
      .insert({
        user_preferences: preferences,
        suggested_property_id: propertyId
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving suggestion:', error);
      // Don't throw error here as it's not critical for user experience
    }

    return data;
  }

  // Get suggestion analytics (admin only)
  static async getSuggestionAnalytics(): Promise<any> {
    const { data, error } = await supabase
      .from('property_suggestions')
      .select(`
        *,
        properties (
          name,
          category
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching suggestion analytics:', error);
      throw new Error('Failed to fetch suggestion analytics');
    }

    return data || [];
  }
}