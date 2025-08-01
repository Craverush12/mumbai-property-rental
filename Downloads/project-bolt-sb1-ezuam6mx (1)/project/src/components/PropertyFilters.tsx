import React, { useState } from 'react';
import { Filter, X, Users, Home, DollarSign, MapPin } from 'lucide-react';

interface FilterOptions {
  priceRange: [number, number];
  guests: number;
  category: string;
  location: string;
}

interface PropertyFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  onClose: () => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({ onFiltersChange, onClose }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 25000],
    guests: 1,
    category: '',
    location: ''
  });

  const categories = [
    'All Categories',
    'Art & Culture',
    'Heritage',
    'Urban Zen',
    'Studio',
    'Penthouse'
  ];

  const locations = [
    'All Locations',
    'Bandra West',
    'Colaba',
    'Lower Parel',
    'Worli'
  ];

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      priceRange: [0, 25000] as [number, number],
      guests: 1,
      category: '',
      location: ''
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="backdrop-blur-xl bg-white/90 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-white/50">
        {/* Header */}
        <div className="bg-gradient-to-r from-gold-500/90 to-gold-600/90 backdrop-blur-xl p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 backdrop-blur-sm bg-white/10 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center">
            <Filter className="w-6 h-6 mr-3" />
            <div>
              <h2 className="text-2xl font-light mb-1">Filter Properties</h2>
              <p className="text-white/90 font-light text-sm">Find your perfect Mumbai stay</p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Price Range */}
          <div className="mb-6">
            <label className="flex items-center text-lg font-medium text-gray-900 mb-4">
              <DollarSign className="w-5 h-5 mr-2 text-gold-500" />
              Price Range (per night)
            </label>
            <div className="backdrop-blur-xl bg-white/40 rounded-2xl p-4 border border-white/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700">₹{filters.priceRange[0].toLocaleString()}</span>
                <span className="text-gray-700">₹{filters.priceRange[1].toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="25000"
                step="1000"
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                className="w-full h-2 bg-gold-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="mb-6">
            <label className="flex items-center text-lg font-medium text-gray-900 mb-4">
              <Users className="w-5 h-5 mr-2 text-gold-500" />
              Number of Guests
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 4, 8].map((guestCount) => (
                <button
                  key={guestCount}
                  onClick={() => handleFilterChange('guests', guestCount)}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm ${
                    filters.guests === guestCount
                      ? 'border-gold-500 bg-gold-500/20 text-gold-700'
                      : 'border-white/50 bg-white/30 hover:border-gold-300'
                  }`}
                >
                  {guestCount}+ guests
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="flex items-center text-lg font-medium text-gray-900 mb-4">
              <Home className="w-5 h-5 mr-2 text-gold-500" />
              Property Category
            </label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleFilterChange('category', category === 'All Categories' ? '' : category)}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm text-left ${
                    filters.category === (category === 'All Categories' ? '' : category)
                      ? 'border-gold-500 bg-gold-500/20 text-gold-700'
                      : 'border-white/50 bg-white/30 hover:border-gold-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="mb-8">
            <label className="flex items-center text-lg font-medium text-gray-900 mb-4">
              <MapPin className="w-5 h-5 mr-2 text-gold-500" />
              Location
            </label>
            <div className="grid grid-cols-2 gap-3">
              {locations.map((location) => (
                <button
                  key={location}
                  onClick={() => handleFilterChange('location', location === 'All Locations' ? '' : location)}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm text-left ${
                    filters.location === (location === 'All Locations' ? '' : location)
                      ? 'border-gold-500 bg-gold-500/20 text-gold-700'
                      : 'border-white/50 bg-white/30 hover:border-gold-300'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={clearFilters}
              className="flex-1 backdrop-blur-sm bg-white/50 hover:bg-white/70 text-gray-700 py-3 rounded-xl font-medium transition-all duration-300 border border-white/50"
            >
              Clear Filters
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;