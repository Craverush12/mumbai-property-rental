import React, { useState, useEffect } from 'react';
import { X, Share2, Download, Star, MapPin, Users, Calendar, Heart, ArrowLeft, ArrowRight, CheckCircle, XCircle, Minus, Plus } from 'lucide-react';
import { PropertyService } from '../services/propertyService';
import type { Database } from '../lib/database.types';

type Property = Database['public']['Tables']['properties']['Row'];

interface PropertyComparisonProps {
  onClose: () => void;
  onPropertySelect: (propertyId: number) => void;
  initialProperties?: number[];
  isOpen: boolean;
}

const PropertyComparison: React.FC<PropertyComparisonProps> = ({
  onClose,
  onPropertySelect,
  initialProperties = [],
  isOpen
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPropertySelector, setShowPropertySelector] = useState(false);
  const [allProperties, setAllProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadProperties();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialProperties.length > 0) {
      loadSelectedProperties();
    }
  }, [initialProperties]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const allProps = await PropertyService.getAllProperties();
      setAllProperties(allProps);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSelectedProperties = async () => {
    try {
      setLoading(true);
      const selectedProps = await Promise.all(
        initialProperties.map(id => PropertyService.getPropertyById(id))
      );
      // Filter out null values
      const validProps = selectedProps.filter(prop => prop !== null) as Property[];
      setSelectedProperties(validProps);
    } catch (error) {
      console.error('Error loading selected properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPropertyToComparison = (property: Property) => {
    if (selectedProperties.length >= 3) {
      alert('You can compare up to 3 properties at a time');
      return;
    }
    if (selectedProperties.find(p => p.id === property.id)) {
      alert('This property is already in your comparison');
      return;
    }
    setSelectedProperties(prev => [...prev, property]);
    setShowPropertySelector(false);
  };

  const removePropertyFromComparison = (propertyId: number) => {
    setSelectedProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const clearComparison = () => {
    setSelectedProperties([]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Art & Culture': 'from-purple-500 to-pink-500',
      'Heritage': 'from-amber-500 to-orange-500',
      'Urban Zen': 'from-green-500 to-teal-500',
      'Studio': 'from-blue-500 to-indigo-500',
      'Penthouse': 'from-red-500 to-pink-500'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const getFeatureComparison = () => {
    const features = [
      { key: 'guests', label: 'Guests', icon: Users },
      { key: 'bedrooms', label: 'Bedrooms', icon: Calendar },
      { key: 'bathrooms', label: 'Bathrooms', icon: Calendar },
      { key: 'price', label: 'Price per Night', icon: Star }
    ];

    return features.map(feature => ({
      ...feature,
      values: selectedProperties.map(prop => prop[feature.key as keyof Property])
    }));
  };

  const shareComparison = () => {
    const comparisonData = {
      properties: selectedProperties.map(p => ({ id: p.id, name: p.name })),
      timestamp: new Date().toISOString()
    };
    
    const shareText = `Compare these properties on Infiniti Casa:\n${selectedProperties.map(p => `• ${p.name} - ${formatPrice(p.price)}`).join('\n')}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Property Comparison - Infiniti Casa',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Comparison copied to clipboard!');
    }
  };

  const downloadComparison = () => {
    const comparisonData = {
      properties: selectedProperties.map(p => ({
        name: p.name,
        location: p.location,
        price: p.price,
        guests: p.guests,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        category: p.category,
        aesthetic: p.aesthetic
      })),
      comparisonDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(comparisonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'property-comparison.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Property Comparison</h2>
              <p className="text-gray-600">Compare up to 3 properties side by side</p>
            </div>
            <div className="flex items-center space-x-3">
              {selectedProperties.length > 0 && (
                <>
                  <button
                    onClick={shareComparison}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={downloadComparison}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Property Selector */}
        {selectedProperties.length < 3 && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedProperties.length}/3 properties selected
              </p>
              <button
                onClick={() => setShowPropertySelector(!showPropertySelector)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Property</span>
              </button>
            </div>
            
            {showPropertySelector && (
              <div className="mt-4 p-4 bg-white rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select a Property</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                  {allProperties
                    .filter(prop => !selectedProperties.find(p => p.id === prop.id))
                    .map(property => (
                      <div
                        key={property.id}
                        onClick={() => addPropertyToComparison(property)}
                        className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                      >
                        <img
                          src={property.images[0] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'}
                          alt={property.name}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{property.name}</h4>
                        <p className="text-sm text-gray-600">{property.location}</p>
                        <p className="text-sm font-semibold text-gray-900">{formatPrice(property.price)}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Comparison Content */}
        <div className="flex-1 overflow-auto">
          {selectedProperties.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties to compare</h3>
              <p className="text-gray-600 mb-6">Add properties to start comparing their features</p>
              <button
                onClick={() => setShowPropertySelector(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Properties
              </button>
            </div>
          ) : (
            <div className="p-6">
              {/* Property Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {selectedProperties.map((property, index) => (
                  <div key={property.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img
                        src={property.images[0] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'}
                        alt={property.name}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() => removePropertyFromComparison(property.id)}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                      <div className="absolute top-2 left-2">
                        <span className={`bg-gradient-to-r ${getCategoryColor(property.category)} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                          {property.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 truncate">{property.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {property.location}
                      </p>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                        <div className="text-center">
                          <p className="text-gray-600">Guests</p>
                          <p className="font-semibold text-gray-900">{property.guests}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Bedrooms</p>
                          <p className="font-semibold text-gray-900">{property.bedrooms}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Bathrooms</p>
                          <p className="font-semibold text-gray-900">{property.bathrooms}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-gray-900">{formatPrice(property.price)}</p>
                        <button
                          onClick={() => onPropertySelect(property.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Feature Comparison Table */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900">Feature Comparison</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Features
                        </th>
                        {selectedProperties.map((property, index) => (
                          <th key={property.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Property {index + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getFeatureComparison().map((feature) => (
                        <tr key={feature.key}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div className="flex items-center">
                              <feature.icon className="w-4 h-4 mr-2 text-gray-600" />
                              {feature.label}
                            </div>
                          </td>
                          {feature.values.map((value, index) => (
                                                       <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                             {feature.key === 'price' ? formatPrice(value as number) : String(value)}
                           </td>
                          ))}
                        </tr>
                      ))}
                      
                      {/* Aesthetic Comparison */}
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-2 text-gray-600" />
                            Aesthetic
                          </div>
                        </td>
                        {selectedProperties.map((property) => (
                          <td key={property.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                            <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs">
                              {property.aesthetic}
                            </span>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Price Comparison Chart */}
              <div className="mt-6 bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900">Price Comparison</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {selectedProperties.map((property, index) => (
                      <div key={property.id} className="flex items-center space-x-4">
                        <div className="w-24 text-sm font-medium text-gray-900 truncate">
                          {property.name}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-200 rounded-full h-4">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                              style={{
                                width: `${(property.price / Math.max(...selectedProperties.map(p => p.price))) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                        <div className="w-24 text-right text-sm font-semibold text-gray-900">
                          {formatPrice(property.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyComparison;