import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Users, Bed, Star, Heart, Calendar, ArrowRight, Play, Loader2, Share2, Check } from 'lucide-react';
import { PropertyService } from '../services/propertyService';
import type { Database } from '../lib/database.types';

type Property = Database['public']['Tables']['properties']['Row'];

interface PropertyGridProps {
  onPropertySelect: (propertyId: number) => void;
  onShowComparison?: (propertyIds: number[]) => void;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({ onPropertySelect, onShowComparison }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredProperty, setHoveredProperty] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load properties from database
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await PropertyService.getAllProperties();
        setProperties(data);
      } catch (err) {
        console.error('Error loading properties:', err);
        setError('Failed to load properties. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Art & Culture': 'from-purple-900/60 to-pink-900/40',
      'Heritage': 'from-amber-900/60 to-orange-900/40',
      'Urban Zen': 'from-blue-900/60 to-cyan-900/40',
      'Studio': 'from-green-900/60 to-teal-900/40',
      'Penthouse': 'from-indigo-900/60 to-purple-900/40'
    };
    return colors[category as keyof typeof colors] || 'from-gray-900/60 to-slate-900/40';
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      'Art & Culture': 'Art & Culture',
      'Heritage': 'Heritage',
      'Urban Zen': 'Urban Zen',
      'Studio': 'Studio',
      'Penthouse': 'Penthouse'
    };
    return badges[category as keyof typeof badges] || category;
  };

  const handleComparisonToggle = (propertyId: number) => {
    setSelectedForComparison(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        if (prev.length >= 3) {
          alert('You can compare up to 3 properties at a time');
          return prev;
        }
        return [...prev, propertyId];
      }
    });
  };

  const handleStartComparison = () => {
    if (selectedForComparison.length >= 2) {
      onShowComparison?.(selectedForComparison);
      setSelectedForComparison([]);
    } else {
      alert('Please select at least 2 properties to compare');
    }
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-24 bg-properties-gradient relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Our Properties
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Discover our curated collection of luxury boutique stays
            </p>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="flex items-center space-x-2 text-white">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading properties...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16 lg:py-24 bg-properties-gradient relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Our Properties
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Discover our curated collection of luxury boutique stays
            </p>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="text-center text-white">
              <p className="text-lg mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-properties-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pink-500/10 to-orange-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div 
          ref={containerRef}
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Our Properties
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-6">
            Discover our curated collection of luxury boutique stays in Mumbai's most desirable locations
          </p>
          
          {/* Comparison Controls */}
          {selectedForComparison.length > 0 && (
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                <span className="text-white text-sm">
                  {selectedForComparison.length} property{selectedForComparison.length > 1 ? 'ies' : 'y'} selected
                </span>
              </div>
              <button
                onClick={handleStartComparison}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Compare Properties</span>
              </button>
            </div>
          )}
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {properties.map((property, index) => (
            <div
              key={property.id}
              className={`group relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredProperty(property.id)}
              onMouseLeave={() => setHoveredProperty(null)}
            >
              {/* Property Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={property.images[0] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'}
                  alt={property.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${getCategoryColor(property.category)}`}></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full border border-white/30">
                    {getCategoryBadge(property.category)}
                  </span>
                </div>

                {/* Price */}
                <div className="absolute top-4 right-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-lg font-bold px-3 py-1 rounded-lg border border-white/30">
                    {formatPrice(property.price)}
                  </span>
                </div>

                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
                  hoveredProperty === property.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <button
                    onClick={() => onPropertySelect(property.id)}
                    className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>

              {/* Property Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                  {property.name}
                </h3>
                
                <div className="flex items-center text-white/80 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                  {property.description}
                </p>

                {/* Property Stats */}
                <div className="flex items-center justify-between text-white/80 text-sm mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{property.guests} guests</span>
                    </div>
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      <span>{property.bedrooms} beds</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>4.9</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onPropertySelect(property.id)}
                    className="flex items-center text-white hover:text-blue-200 transition-colors text-sm font-medium"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleComparisonToggle(property.id);
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        selectedForComparison.includes(property.id)
                          ? 'bg-blue-600 text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/20'
                      }`}
                      title={selectedForComparison.includes(property.id) ? 'Remove from comparison' : 'Add to comparison'}
                    >
                      {selectedForComparison.includes(property.id) ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                    
                    <button className="p-2 text-white/70 hover:text-white transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className={`text-center mt-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '600ms' }}>
          <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full font-medium hover:bg-white/30 transition-all duration-300 border border-white/30 hover:scale-105">
            View All Properties
          </button>
        </div>
      </div>
    </section>
  );
};

export default PropertyGrid;