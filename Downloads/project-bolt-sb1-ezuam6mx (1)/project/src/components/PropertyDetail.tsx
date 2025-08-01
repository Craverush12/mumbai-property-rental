import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, MapPin, Sparkles, Calendar, X, Image as ImageIcon, ChevronDown, Flag, Share, Heart, Home, ChevronRight as ChevronRightIcon, MessageCircle, Shield, Clock, Globe, Award, Camera, Loader2, Users, Bed, Wifi, Car, Coffee, Utensils, CheckCircle, Zap, ShoppingBag, Smartphone, Bus } from 'lucide-react';
import { PropertyService } from '../services/propertyService';
import BookingCalendar from './BookingCalendar';
import AvailabilityCalendar from './AvailabilityCalendar';
import SimilarListings from './SimilarListings';
import NeighborhoodGuide from './NeighborhoodGuide';
import SafetyFeatures from './SafetyFeatures';
import PhotoLightbox from './PhotoLightbox';
import InstagramTestimonials from './InstagramTestimonials';
import type { Database } from '../lib/database.types';

type Property = Database['public']['Tables']['properties']['Row'];

interface PropertyDetailProps {
  propertyId: number;
  onBackToHome: () => void;
  user?: any;
  isAuthenticated?: boolean;
  onBookingSuccess?: (bookingId: string) => void;
  onShowSocialSharing?: (data: any) => void;
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({ propertyId, onBackToHome, user, isAuthenticated, onBookingSuccess, onShowSocialSharing }) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Mock data for fallback when database is not available
  const mockProperty: Property = {
    id: 1,
    name: "The Bandra Cottage",
    location: "Bandra West, Mumbai",
    description: "A beautifully restored heritage cottage that seamlessly blends colonial charm with modern luxury. This unique property offers an authentic Mumbai experience with contemporary comforts.",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    price: 6200,
    category: "Heritage",
    aesthetic: "colonial grandeur",
    virtual_tour_url: null,
    video_url: null,
    highlights: ["Colonial Architecture", "Historical Significance", "Garden Parties", "Heritage Tours"],
    images: [
      "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
    ],
    features: {
      amenities: ["High-Speed WiFi", "Private Garden", "Vintage Furnishings", "Library", "Butler Service", "High Tea Service", "Air Conditioning", "Security", "Parking"],
      highlights: ["Colonial Architecture", "Historical Significance", "Garden Parties", "Heritage Tours"]
    },
    story: "Built in 1923, this colonial cottage has witnessed the transformation of Bombay into Mumbai. Each room tells a story of the city's rich history, from the original teak woodwork to the stained glass windows. The garden, planted by the original British owners, continues to bloom with century-old trees and exotic flowers. Recently restored with painstaking attention to detail, this property now offers the perfect blend of heritage charm and modern luxury.",
    testimonials: [
      { name: "Priya Sharma", rating: 5, comment: "A magical step back in time. The colonial charm and garden tranquility made our family vacation extraordinary." },
      { name: "Rajesh Mehta", rating: 5, comment: "Perfect for our anniversary celebration. The heritage atmosphere and butler service exceeded all expectations." },
      { name: "Sarah Johnson", rating: 5, comment: "The perfect blend of history and luxury. Every detail was thoughtfully curated." }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Load property data
  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await PropertyService.getPropertyById(propertyId);
        setProperty(data || mockProperty);
      } catch (err) {
        console.error('Error loading property:', err);
        setProperty(mockProperty); // Use mock data as fallback
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [propertyId]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
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
    const colors = {
      'Art & Culture': 'from-purple-600 to-pink-600',
      'Heritage': 'from-amber-600 to-orange-600',
      'Urban Zen': 'from-blue-600 to-cyan-600',
      'Studio': 'from-green-600 to-teal-600',
      'Penthouse': 'from-indigo-600 to-purple-600'
    };
    return colors[category as keyof typeof colors] || 'from-gray-600 to-slate-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rust-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your perfect stay...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || 'Property not found'}</p>
          <button 
            onClick={onBackToHome}
            className="bg-rust-500 text-white px-6 py-3 rounded-lg hover:bg-rust-600 transition-colors font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Property Header - Fixed at top */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={onBackToHome}
              className={`flex items-center space-x-2 transition-colors font-medium ${
                isScrolled ? 'text-gray-900 hover:text-rust-600' : 'text-white hover:text-white/80'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Properties</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button className={`p-2 rounded-full transition-colors ${
                isScrolled ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-white/10 text-white'
              }`}>
                <Share className="w-5 h-5" />
              </button>
              <button className={`p-2 rounded-full transition-colors ${
                isScrolled ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-white/10 text-white'
              }`}>
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Images - Improved Readability */}
      <div className="relative h-[70vh] lg:h-[70vh]">
        {/* Enhanced gradient overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/50 z-10"></div>
        
        {/* Main Image */}
        <img
          src={property.images[currentImageIndex] || property.images[0]}
          alt={property.name}
          className="w-full h-full object-cover"
        />

        {/* Improved Overlay - Better Contrast & Readability */}
        <div className="absolute inset-0 z-20">
          <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-end h-full pb-12">
              {/* Main Content Area */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
                {/* Left - Property Info */}
                <div className="lg:col-span-2 text-white space-y-6">
                  {/* Property Name & Location */}
                  <div>
                    <h1 className="text-4xl md:text-5xl font-light mb-4 drop-shadow-lg">{property.name}</h1>
                    <div className="flex items-center space-x-6 text-white/95 mb-6 drop-shadow-md">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span className="text-lg font-medium">{property.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
                        <span className="text-lg font-medium">4.9 (42 reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Indicators - Enhanced Visibility */}
                  <div className="flex items-center space-x-8 text-white/90 drop-shadow-md">
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Shield className="w-4 h-4 text-green-300" />
                      <span className="text-sm font-medium">Verified Host</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Clock className="w-4 h-4 text-blue-300" />
                      <span className="text-sm font-medium">Last booked 3h ago</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span className="text-sm font-medium">Instant booking</span>
                    </div>
                  </div>
                </div>

                {/* Right - CTA Only (Removed Pricing) */}
                <div className="lg:col-span-1">
                  <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 text-white shadow-2xl">
                    {/* Quick Stats */}
                    <div className="flex items-center justify-center space-x-6 mb-6 text-center">
                      <div>
                        <div className="text-xl font-bold drop-shadow-md">{property.guests}</div>
                        <div className="text-xs text-white/80">Guests</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold drop-shadow-md">{property.bedrooms}</div>
                        <div className="text-xs text-white/80">Bedrooms</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold drop-shadow-md">{property.bathrooms}</div>
                        <div className="text-xs text-white/80">Bathrooms</div>
                      </div>
                    </div>

                    {/* Availability Status */}
                    <div className="bg-amber-500/30 border border-amber-400/40 rounded-lg p-3 mb-4 backdrop-blur-sm">
                      <div className="flex items-center justify-center space-x-2">
                        <Zap className="w-4 h-4 text-amber-300" />
                        <span className="text-sm font-medium">Only 8 dates available</span>
                      </div>
                    </div>

                    {/* Primary CTA */}
                    <button 
                      onClick={() => document.getElementById('booking-card')?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-full bg-rust-500 hover:bg-rust-600 text-white font-medium py-3 px-4 rounded-lg transition-colors text-base mb-3 shadow-lg"
                    >
                      Check Availability
                    </button>

                    {/* Secondary Actions */}
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openLightbox(0)}
                        className="flex-1 bg-white/25 hover:bg-white/35 text-white py-2 px-3 rounded-lg transition-colors text-sm backdrop-blur-sm"
                      >
                        View Photos
                      </button>
                      <button className="flex-1 bg-white/25 hover:bg-white/35 text-white py-2 px-3 rounded-lg transition-colors text-sm backdrop-blur-sm">
                        Contact Host
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex space-x-2">
            {property.images.slice(0, 5).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Image Controls */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Quick Action Buttons */}
        <div className="absolute top-8 right-8 z-30 flex space-x-3">
          <button className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors">
            <Heart className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={() => onShowSocialSharing?.({
              title: property.name,
              description: property.description,
              image: property.images[0],
              url: `${window.location.origin}/property/${property.id}`,
              price: property.price,
              location: property.location
            })}
            className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors"
          >
            <Share className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Property Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Property Highlights Banner */}
            <div className="bg-gradient-to-r from-rust-50 to-orange-50 rounded-2xl p-6 border border-rust-100">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Why Choose This Property?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-rust-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Award className="w-4 h-4 text-rust-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Heritage Experience</h3>
                    <p className="text-sm text-gray-600">Authentic colonial architecture with modern luxury</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-rust-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-rust-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Prime Location</h3>
                    <p className="text-sm text-gray-600">Walking distance to Bandra's best attractions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-rust-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-4 h-4 text-rust-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Verified & Safe</h3>
                    <p className="text-sm text-gray-600">Professional cleaning, 24/7 support</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-rust-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Star className="w-4 h-4 text-rust-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Exceptional Service</h3>
                    <p className="text-sm text-gray-600">Butler service, cultural concierge</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Stats */}
            <div className="flex items-center space-x-8 text-gray-600 border-b border-gray-200 pb-6">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>{property.guests} guests</span>
              </div>
              <div className="flex items-center">
                <Bed className="w-5 h-5 mr-2" />
                <span>{property.bedrooms} bedrooms</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                <span>{property.bathrooms} bathrooms</span>
              </div>
            </div>

            {/* Category Badge */}
            <div className="flex items-center justify-between">
              <div className="inline-block">
                <span className={`bg-gradient-to-r ${getCategoryColor(property.category)} text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg`}>
                  {property.category}
                </span>
              </div>
              <button 
                onClick={() => onShowSocialSharing?.({
                  title: property.name,
                  description: property.description,
                  image: property.images[0],
                  url: `${window.location.origin}/property/${property.id}`,
                  price: property.price,
                  location: property.location
                })}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Share className="w-4 h-4" />
                <span>Share Property</span>
              </button>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-6">About this place</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {property.description}
              </p>
            </div>
            
            {/* Story */}
            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-6">The Story</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {property.story}
              </p>
            </div>
            
            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-6">What this place offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(property.features as any)?.amenities?.map((amenity: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-rust-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-rust-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-6">Guest Reviews</h2>
              <div className="space-y-8">
                {(property.testimonials as any[]).map((review, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 text-lg">{review.name}</h4>
                        <p className="text-gray-600">Verified Guest</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">{review.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Neighborhood Guide */}
            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-6">Neighborhood Guide</h2>
              <div className="bg-gradient-to-r from-sage-50 to-teal-50 rounded-2xl p-8">
                <h3 className="text-xl font-medium text-gray-900 mb-4">{property.location}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Nearby Attractions</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Bandra Fort (5 min walk)</li>
                      <li>• Carter Road Promenade (8 min walk)</li>
                      <li>• Linking Road Shopping (10 min walk)</li>
                      <li>• Bandra Station (12 min walk)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Local Highlights</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Best cafes and restaurants</li>
                      <li>• Art galleries and cultural spots</li>
                      <li>• Shopping and entertainment</li>
                      <li>• Public transport access</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Practical Information */}
            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-6">Practical Information</h2>
              
              {/* Transportation Section */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
                <h3 className="text-xl font-medium text-gray-900 mb-6 flex items-center">
                  <MapPin className="w-6 h-6 mr-3 text-rust-600" />
                  How to Reach
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* From Airport */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-blue-600" />
                      From Airport
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Car className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium">Taxi</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">45-60 min</div>
                          <div className="text-xs text-gray-600">₹800-1200</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Wifi className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-sm font-medium">Metro + Local</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">75 min</div>
                          <div className="text-xs text-gray-600">₹200</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Smartphone className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-sm font-medium">Uber/Ola</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">50-65 min</div>
                          <div className="text-xs text-gray-600">₹600-900</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* From Railway Station */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <Car className="w-4 h-4 mr-2 text-orange-600" />
                      From Railway Station
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-orange-600" />
                          </div>
                          <span className="text-sm font-medium">Bandra Station</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">12 min</div>
                          <div className="text-xs text-gray-600">Walk</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <Car className="w-4 h-4 text-red-600" />
                          </div>
                          <span className="text-sm font-medium">Auto Rickshaw</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">8-10 min</div>
                          <div className="text-xs text-gray-600">₹50-80</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Public Transport */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <Wifi className="w-4 h-4 mr-2 text-green-600" />
                      Public Transport
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Wifi className="w-4 h-4 text-indigo-600" />
                          </div>
                          <span className="text-sm font-medium">Metro Station</span>
                        </div>
                        <span className="text-sm text-gray-600">5 min walk</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Bus className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium">Bus Routes</span>
                        </div>
                        <span className="text-sm text-gray-600">201, 202, 203</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-yellow-600" />
                          </div>
                          <span className="text-sm font-medium">Auto Stand</span>
                        </div>
                        <span className="text-sm text-gray-600">12 min walk</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Local Amenities Section */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
                <h3 className="text-xl font-medium text-gray-900 mb-6 flex items-center">
                  <Star className="w-6 h-6 mr-3 text-rust-600" />
                  What's Around
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Restaurants */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <Utensils className="w-4 h-4 mr-2 text-amber-600" />
                      Restaurants & Cafes
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative h-24 bg-gradient-to-r from-amber-100 to-orange-100">
                          <img 
                            src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop" 
                            alt="Pali Village Cafe"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20"></div>
                          <div className="absolute bottom-2 left-2">
                            <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs font-medium">4.8</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Pali Village Cafe</span>
                            <span className="text-sm text-gray-600">3 min walk</span>
                          </div>
                          <span className="text-xs text-gray-500">Continental • Outdoor Seating</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative h-24 bg-gradient-to-r from-blue-100 to-cyan-100">
                          <img 
                            src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop" 
                            alt="Bastian"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20"></div>
                          <div className="absolute bottom-2 left-2">
                            <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs font-medium">4.9</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Bastian</span>
                            <span className="text-sm text-gray-600">5 min walk</span>
                          </div>
                          <span className="text-xs text-gray-500">Seafood • Fine Dining</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative h-24 bg-gradient-to-r from-green-100 to-emerald-100">
                          <img 
                            src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop" 
                            alt="Salt Water Cafe"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20"></div>
                          <div className="absolute bottom-2 left-2">
                            <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs font-medium">4.7</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Salt Water Cafe</span>
                            <span className="text-sm text-gray-600">7 min walk</span>
                          </div>
                          <span className="text-xs text-gray-500">Breakfast • Beach View</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shopping & Entertainment */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <ShoppingBag className="w-4 h-4 mr-2 text-pink-600" />
                      Shopping & Entertainment
                    </h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Linking Road</span>
                          <span className="text-sm text-gray-600">10 min walk</span>
                        </div>
                        <span className="text-xs text-gray-500">Shopping District</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Phoenix MarketCity</span>
                          <span className="text-sm text-gray-600">15 min drive</span>
                        </div>
                        <span className="text-xs text-gray-500">Shopping Mall</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Juhu Beach</span>
                          <span className="text-sm text-gray-600">20 min drive</span>
                        </div>
                        <span className="text-xs text-gray-500">Beach</span>
                      </div>
                    </div>
                  </div>

                  {/* Essential Services */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-teal-600" />
                      Essential Services
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Medical Store</span>
                        <span className="text-sm text-gray-600">2 min walk (24/7)</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">ATM</span>
                        <span className="text-sm text-gray-600">3 min walk</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Grocery Store</span>
                        <span className="text-sm text-gray-600">5 min walk</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Police Station</span>
                        <span className="text-sm text-gray-600">8 min walk</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Policies Section */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <h3 className="text-xl font-medium text-gray-900 mb-6 flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-rust-600" />
                  Property Details & Policies
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Check-in/Check-out */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-indigo-600" />
                      Check-in/Check-out
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Check-in</span>
                        <span className="text-sm text-gray-900">3:00 PM</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Check-out</span>
                        <span className="text-sm text-gray-900">11:00 AM</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Early Check-in</span>
                        <span className="text-sm text-green-600">Available</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Late Check-out</span>
                        <span className="text-sm text-green-600">Available</span>
                      </div>
                    </div>
                  </div>

                  {/* House Rules */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <Award className="w-4 h-4 mr-2 text-emerald-600" />
                      House Rules
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">No smoking</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">No parties or events</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">Pets not allowed</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">Quiet hours 10 PM - 7 AM</span>
                      </div>
                    </div>
                  </div>

                  {/* Cancellation Policy */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <X className="w-4 h-4 mr-2 text-rose-600" />
                      Cancellation Policy
                    </h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-700 mb-1">
                          <strong>Free cancellation</strong> until 24 hours before check-in
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-700 mb-1">
                          <strong>50% refund</strong> if cancelled within 24 hours
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-700">
                          <strong>No refund</strong> for no-shows
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

                        {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  {/* Booking Card */}
                  <div id="booking-card" className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
                    {/* Enhanced Pricing Display */}
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-gray-900 mb-1">{formatPrice(property.price)}</div>
                      <div className="text-gray-600 text-lg">per night</div>
                      <div className="flex items-center justify-center mt-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-medium text-gray-700">4.9 (42 reviews)</span>
                      </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Verified Host</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Instant booking</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-green-700">
                        <span>• Last booked 3h ago</span>
                        <span>• 100% response rate</span>
                      </div>
                    </div>

                    <BookingCalendar 
                      propertyId={property.id}
                      price={property.price}
                      user={user}
                      isAuthenticated={isAuthenticated}
                    />
                  </div>

              {/* Contact Host */}
              <div className="mt-6 bg-gray-50 rounded-2xl p-6">
                <h3 className="font-medium text-gray-900 mb-4">Questions about this property?</h3>
                <button className="w-full bg-rust-500 text-white py-3 rounded-lg hover:bg-rust-600 transition-colors font-medium flex items-center justify-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Host</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Instagram Testimonials Section */}
        <div className="mt-16">
          <InstagramTestimonials 
            propertyId={propertyId}
            onPropertySelect={(id) => {
              // Handle property selection if needed
              console.log('Selected property:', id);
            }}
          />
        </div>
      </div>

      {/* Photo Lightbox */}
      {isLightboxOpen && (
        <PhotoLightbox
          images={property.images.map((url, index) => ({ url, title: `${property.name} - Image ${index + 1}` }))}
          initialIndex={currentImageIndex}
          isOpen={isLightboxOpen}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
};

export default PropertyDetail;