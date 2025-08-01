import React, { useState } from 'react';
import { Calendar, Users, Search, MapPin } from 'lucide-react';

interface SearchWidgetProps {
  onSearch?: () => void;
}

const SearchWidget: React.FC<SearchWidgetProps> = ({ onSearch }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMinCheckOut = () => {
    return checkIn || getMinDate();
  };

  return (
    <div className="search-widget max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="backdrop-blur-2xl bg-white/20 rounded-2xl sm:rounded-3xl border border-white/30 shadow-2xl overflow-hidden">
        {/* Mobile Collapsible Design */}
        <div className="block lg:hidden">
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full p-4 sm:p-6 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center text-white/90">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                  <span className="text-base sm:text-lg font-body font-medium">Search properties</span>
                </div>
                <div className="text-white/60">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </button>
          ) : (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-body font-medium text-white">Search Properties</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-white/60 hover:text-white transition-colors p-1"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              
              {/* Mobile Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white/90 text-sm font-body font-medium mb-2">
                    Check-in
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-body font-medium text-base focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400/50 placeholder-white/60 touch-manipulation"
                      placeholder="Select date"
                      min={getMinDate()}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/60 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-body font-medium mb-2">
                    Check-out
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-body font-medium text-base focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400/50 placeholder-white/60 touch-manipulation"
                      placeholder="Select date"
                      min={getMinCheckOut()}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/60 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-body font-medium mb-2">
                    Guests
                  </label>
                  <div className="relative">
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-body font-medium text-base focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400/50 appearance-none cursor-pointer touch-manipulation"
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1} className="text-gray-800 bg-white">
                          {i + 1} {i + 1 === 1 ? 'guest' : 'guests'}
                        </option>
                      ))}
                    </select>
                    <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/60 pointer-events-none" />
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-white py-3 px-6 rounded-lg font-body font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center touch-manipulation"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-base sm:text-lg">Search Properties</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden lg:grid grid-cols-4 gap-0 divide-x divide-white/20">
          {/* Check-in */}
          <div className="p-6">
            <label className="block text-white/90 text-sm font-body font-medium mb-2">
              Check-in
            </label>
            <div className="relative">
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent border-0 text-white font-body font-medium text-lg focus:outline-none focus:ring-0 placeholder-white/60 touch-manipulation"
                placeholder="Add dates"
                min={getMinDate()}
              />
              <Calendar className="absolute right-0 top-1 w-5 h-5 text-white/60 pointer-events-none" />
            </div>
          </div>

          {/* Check-out */}
          <div className="p-6">
            <label className="block text-white/90 text-sm font-body font-medium mb-2">
              Check-out
            </label>
            <div className="relative">
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent border-0 text-white font-body font-medium text-lg focus:outline-none focus:ring-0 placeholder-white/60 touch-manipulation"
                placeholder="Add dates"
                min={getMinCheckOut()}
              />
              <Calendar className="absolute right-0 top-1 w-5 h-5 text-white/60 pointer-events-none" />
            </div>
          </div>

          {/* Guests */}
          <div className="p-6">
            <label className="block text-white/90 text-sm font-body font-medium mb-2">
              Guests
            </label>
            <div className="relative">
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full bg-transparent border-0 text-white font-body font-medium text-lg focus:outline-none focus:ring-0 appearance-none cursor-pointer touch-manipulation"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1} className="text-gray-800">
                    {i + 1} {i + 1 === 1 ? 'guest' : 'guests'}
                  </option>
                ))}
              </select>
              <Users className="absolute right-0 top-1 w-5 h-5 text-white/60 pointer-events-none" />
            </div>
          </div>

          {/* Search Button */}
          <div className="p-6 flex items-end">
            <button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-white py-3 px-6 rounded-lg font-body font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center touch-manipulation"
            >
              <Search className="w-5 h-5 mr-2" />
              <span className="text-lg">Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchWidget;