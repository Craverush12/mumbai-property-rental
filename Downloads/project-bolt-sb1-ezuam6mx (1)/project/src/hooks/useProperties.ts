import { useState, useEffect } from 'react';
import { PropertyService } from '../services/propertyService';
import type { Database } from '../lib/database.types';

type Property = Database['public']['Tables']['properties']['Row'];

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await PropertyService.getAllProperties();
        setProperties(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      const data = await PropertyService.getAllProperties();
      setProperties(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  return { properties, loading, error, refetch };
};

export const useProperty = (id: number) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await PropertyService.getPropertyById(id);
        setProperty(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch property');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  return { property, loading, error };
};