import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, Phone, MapPin, ArrowRight, User, LogOut, Search, Settings } from 'lucide-react';
import type { Database } from '../lib/database.types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface NavigationProps {
  onSuggestionClick?: () => void;
  user?: UserProfile | null;
  onShowAuth?: () => void;
  isAuthenticated?: boolean;
  onViewUserProfile?: () => void;
  onShowSearch?: () => void;
  onShowAdminDashboard?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  onSuggestionClick,
  user,
  onShowAuth,
  isAuthenticated = false,
  onViewUserProfile,
  onShowSearch,
  onShowAdminDashboard
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest('.mobile-menu')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navItems = [
    { name: 'Properties', href: '#properties', action: () => document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' }) },
    { name: 'Experience', href: '#experience', action: () => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }) },
    { name: 'About', href: '#about', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
    { name: 'Contact', href: '#contact', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }
  ];

  const handleNavClick = (action: () => void) => {
    setIsMenuOpen(false);
    action();
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      // Handle logout
      console.log('Logout clicked');
    } else {
      onShowAuth?.();
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number for display
    if (phone.startsWith('+91')) {
      return `+91 ${phone.slice(3, 8)} ${phone.slice(8)}`;
    }
    return phone;
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-white/10 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className={`text-2xl font-light transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                Infiniti Casa
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={onShowSearch}
                className={`flex items-center space-x-2 transition-colors duration-300 ${
                  isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-white/80'
                }`}
              >
                <Search className="w-4 h-4" />
                <span className="text-sm font-medium">Search</span>
              </button>
              
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.action)}
                  className={`text-sm font-medium transition-colors duration-300 hover:text-rust-500 relative group ${
                    isScrolled ? 'text-gray-700' : 'text-white/90'
                  }`}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rust-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
              
              {/* User/Auth Section */}
              <div className="flex items-center space-x-4">
                {/* Admin Dashboard Button - Always Visible */}
                <button
                  onClick={onShowAdminDashboard}
                  className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors"
                  title="Admin Dashboard"
                >
                  <Settings className="w-4 h-4 text-purple-600" />
                </button>
                
                {isAuthenticated && user ? (
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        isScrolled ? 'text-gray-900' : 'text-white'
                      }`}>
                        {user.full_name || 'Guest'}
                      </p>
                      <p className={`text-xs ${
                        isScrolled ? 'text-gray-600' : 'text-white/70'
                      }`}>
                        {user.phone ? formatPhoneNumber(user.phone) : 'Phone not available'}
                      </p>
                    </div>
                    <button
                      onClick={onViewUserProfile}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      title="View Profile"
                    >
                      <User className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={handleAuthClick}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAuthClick}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                      isScrolled 
                        ? 'border-gray-300 text-gray-700 hover:bg-gray-50' 
                        : 'border-white/30 text-white hover:bg-white/10'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Sign In</span>
                  </button>
                )}
                
                {/* CTA Button */}
                <button
                  onClick={onSuggestionClick}
                  className="bg-rust-500 hover:bg-rust-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Book Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md transition-colors ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md border-t border-gray-100">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.action)}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-rust-500 hover:bg-gray-50 rounded-md transition-colors"
                >
                  {item.name}
                </button>
              ))}
              
              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {/* Admin Dashboard Button - Always Visible */}
                <button
                  onClick={onShowAdminDashboard}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </button>
                
                {isAuthenticated && user ? (
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {user.full_name || 'Guest'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {user.phone ? formatPhoneNumber(user.phone) : 'Phone not available'}
                    </p>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={onViewUserProfile}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                    </div>
                    <button
                      onClick={handleAuthClick}
                      className="mt-2 w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAuthClick}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                )}
                
                <button
                  onClick={onSuggestionClick}
                  className="w-full mt-2 bg-rust-500 hover:bg-rust-600 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;