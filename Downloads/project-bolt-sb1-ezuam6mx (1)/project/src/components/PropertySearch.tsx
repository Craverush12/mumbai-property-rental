import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Filter, X, SlidersHorizontal, Calendar, Users, DollarSign, Star, SortAsc, SortDesc } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Property = Database['public']['Tables']['properties']['Row'];

interface PropertySearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
  properties: Property[];
  isLoading?: boolean;
}

interface SearchFilters {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  priceRange: [number, number];
  amenities: string[];
  propertyType: string[];
  rating: number;
  sortBy: 'price' | 'rating' | 'popularity' | 'distance';
  sortOrder: 'asc' | 'desc';
}

interface LocationSuggestion {
  id: string;
  name: string;
  type: 'neighborhood' | 'landmark' | 'area';
  coordinates?: [number, number];
}

const PropertySearch: React.FC<PropertySearchProps> = ({
  onSearch,
  onClear,
  properties,
  isLoading = false
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    priceRange: [0, 50000],
    amenities: [],
    propertyType: [],
    rating: 0,
    sortBy: 'popularity',
    sortOrder: 'desc'
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Location suggestions data
  const mumbaiLocations: LocationSuggestion[] = [
    { id: '1', name: 'Bandra West', type: 'neighborhood', coordinates: [19.0596, 72.8295] },
    { id: '2', name: 'Juhu', type: 'neighborhood', coordinates: [19.0996, 72.8295] },
    { id: '3', name: 'Andheri West', type: 'neighborhood', coordinates: [19.1197, 72.8464] },
    { id: '4', name: 'Worli', type: 'neighborhood', coordinates: [19.0176, 72.8138] },
    { id: '5', name: 'Colaba', type: 'neighborhood', coordinates: [18.9149, 72.8316] },
    { id: '6', name: 'Marine Drive', type: 'landmark', coordinates: [18.9435, 72.8238] },
    { id: '7', name: 'Gateway of India', type: 'landmark', coordinates: [18.9217, 72.8347] },
    { id: '8', name: 'Juhu Beach', type: 'landmark', coordinates: [19.0996, 72.8295] },
    { id: '9', name: 'Bandra Bandstand', type: 'landmark', coordinates: [19.0596, 72.8295] },
    { id: '10', name: 'Powai', type: 'area', coordinates: [19.1197, 72.9089] }
  ];

  // Available amenities
  const availableAmenities = [
    'WiFi', 'Air Conditioning', 'Kitchen', 'Washing Machine', 'TV', 'Parking',
    'Gym', 'Pool', 'Garden', 'Balcony', 'Elevator', 'Security', 'Housekeeping',
    'Breakfast', 'Airport Transfer', 'Concierge', 'Pet Friendly', 'Wheelchair Accessible'
  ];

  // Property types
  const propertyTypes = [
    'Art & Culture Loft', 'Heritage Villa', 'Urban Zen Apartment', 'Studio Space', 'Penthouse'
  ];

  // Handle location search
  const handleLocationSearch = (query: string) => {
    if (query.length < 2) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = mumbaiLocations.filter(location =>
      location.name.toLowerCase().includes(query.toLowerCase())
    );
    setLocationSuggestions(filtered);
    setShowSuggestions(true);
  };

  // Handle location selection
  const handleLocationSelect = (location: LocationSuggestion) => {
    setFilters(prev => ({ ...prev, location: location.name }));
    setShowSuggestions(false);
  };

  // Handle search submission
  const handleSearch = () => {
    onSearch(filters);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle amenity toggle
  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // Handle property type toggle
  const togglePropertyType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      propertyType: prev.propertyType.includes(type)
        ? prev.propertyType.filter(t => t !== type)
        : [...prev.propertyType, type]
    }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      location: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      priceRange: [0, 50000],
      amenities: [],
      propertyType: [],
      rating: 0,
      sortBy: 'popularity',
      sortOrder: 'desc'
    });
    onClear();
  };

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate active filters count
  const activeFiltersCount = [
    filters.location,
    filters.checkIn,
    filters.checkOut,
    filters.amenities.length,
    filters.propertyType.length,
    filters.rating > 0
  ].filter(Boolean).length;

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Main Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location Search */}
          <div className="relative" ref={searchRef}>
            <div className="flex items-center bg-gray-50 rounded-xl p-3">
              <MapPin className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Where to?"
                value={filters.location}
                onChange={(e) => {
                  handleFilterChange('location', e.target.value);
                  handleLocationSearch(e.target.value);
                }}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
            
            {/* Location Suggestions */}
            {showSuggestions && locationSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-lg border border-gray-200 mt-2 z-50 max-h-60 overflow-y-auto">
                {locationSuggestions.map((location) => (
                  <div
                    key={location.id}
                    onClick={() => handleLocationSelect(location)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="font-medium text-gray-700">{location.name}</div>
                        <div className="text-sm text-gray-500 capitalize">{location.type}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Check-in Date */}
          <div className="flex items-center bg-gray-50 rounded-xl p-3">
            <Calendar className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="date"
              value={filters.checkIn}
              onChange={(e) => handleFilterChange('checkIn', e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700"
            />
          </div>

          {/* Check-out Date */}
          <div className="flex items-center bg-gray-50 rounded-xl p-3">
            <Calendar className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="date"
              value={filters.checkOut}
              onChange={(e) => handleFilterChange('checkOut', e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700"
            />
          </div>

          {/* Guests */}
          <div className="flex items-center bg-gray-50 rounded-xl p-3">
            <Users className="w-5 h-5 text-gray-400 mr-2" />
            <select
              value={filters.guests}
              onChange={(e) => handleFilterChange('guests', parseInt(e.target.value))}
              className="flex-1 bg-transparent outline-none text-gray-700"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button and Filters */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </div>
              ) : (
                <div className="flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </div>
              )}
            </button>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 mr-1" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none"
            >
              <option value="popularity">Popularity</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="distance">Distance</option>
            </select>
            
            <button
              onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Advanced Filters</h3>
            <button
              onClick={handleClearFilters}
              className="text-gray-500 hover:text-gray-700 text-sm flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Price Range */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Price Range
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange[0]}
                    onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                    className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 50000])}
                    className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Rating */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Minimum Rating
              </h4>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => handleFilterChange('rating', rating)}
                    className={`p-2 rounded-lg transition-colors ${
                      filters.rating >= rating
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
                {filters.rating > 0 && (
                  <button
                    onClick={() => handleFilterChange('rating', 0)}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Property Types */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Property Type</h4>
              <div className="space-y-2">
                {propertyTypes.map(type => (
                  <label key={type} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.propertyType.includes(type)}
                      onChange={() => togglePropertyType(type)}
                      className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-700 mb-3">Amenities</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {availableAmenities.map(amenity => (
                <label key={amenity} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results Summary */}
      {properties.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-gray-600">
              Found <span className="font-semibold text-gray-800">{properties.length}</span> properties
              {filters.location && ` in ${filters.location}`}
            </div>
            <div className="text-sm text-gray-500">
              {filters.checkIn && filters.checkOut && (
                <span>
                  {filters.checkIn} - {filters.checkOut}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertySearch; 