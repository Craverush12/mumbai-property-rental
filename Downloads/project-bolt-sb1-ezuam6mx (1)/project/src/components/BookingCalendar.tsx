import React, { useState, useEffect } from 'react';
import { Calendar, Users, Upload, CreditCard, CheckCircle, Clock, Shield, Star, Camera, MapPin, Loader2, AlertCircle, ArrowRight, ArrowLeft, Zap, Award, Users as UsersIcon, Clock as ClockIcon, MessageCircle } from 'lucide-react';
import { BookingService } from '../services/bookingService';
import { useAuth } from '../hooks/useAuth';
import type { Database } from '../lib/database.types';

type Property = Database['public']['Tables']['properties']['Row'];
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface BookingCalendarProps {
  propertyId: number;
  price: number;
  user?: UserProfile | null;
  isAuthenticated?: boolean;
  onBookingSuccess?: (bookingId: string) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ propertyId, price, user, isAuthenticated, onBookingSuccess }) => {
  const { user: authUser } = useAuth();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    purpose: '',
    specialRequests: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingTotal, setBookingTotal] = useState<{
    nightlyRate: number;
    totalNights: number;
    subtotal: number;
    serviceFee: number;
    petFee: number;
    total: number;
  } | null>(null);
  const [availability, setAvailability] = useState<{ available: boolean; message?: string }>({ available: true });
  const [isLongTermBooking, setIsLongTermBooking] = useState(false);
  const [totalDays, setTotalDays] = useState(0);
  const [petCount, setPetCount] = useState(0);
  const [isPetFriendly, setIsPetFriendly] = useState(true); // Mock: assuming all properties are pet-friendly

  // Mock data for trust indicators and social proof
  const trustData = {
    rating: 4.9,
    reviewCount: 42,
    responseRate: 98,
    responseTime: '2 hours',
    lastBooked: '3 hours ago',
    availableDates: 8,
    verifiedHost: true,
    instantBooking: true,
    freeCancellation: true
  };

  // Pre-fill form data if user is authenticated
  useEffect(() => {
    if (authUser) {
      setFormData(prev => ({
        ...prev,
        fullName: authUser.full_name || '',
        email: '', // Email not available in user profile
        phone: authUser.phone || ''
      }));
    }
  }, [authUser]);

  // Calculate booking total when dates change
  useEffect(() => {
    if (checkIn && checkOut && guests) {
      calculateBookingTotal();
      calculateTotalDays();
    }
  }, [checkIn, checkOut, guests, petCount]);

  const calculateTotalDays = () => {
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const days = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      setTotalDays(days);
      setIsLongTermBooking(days > 30);
    }
  };

  const calculateBookingTotal = async () => {
    try {
      const total = await BookingService.calculateBookingTotal(
        propertyId,
        checkIn,
        checkOut,
        guests
      );
      
      // Add pet fees if pets are included
      const petFee = petCount > 0 ? petCount * 500 : 0; // ₹500 per pet per stay
      const totalWithPets = {
        ...total,
        petFee,
        total: total.total + petFee
      };
      
      setBookingTotal(totalWithPets);
    } catch (err) {
      console.error('Error calculating booking total:', err);
      // Use fallback calculation
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const totalNights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      const subtotal = price * totalNights;
      const serviceFee = Math.round(subtotal * 0.12); // 12% service fee
      const petFee = petCount > 0 ? petCount * 500 : 0; // ₹500 per pet per stay
      const total = subtotal + serviceFee + petFee;
      
      setBookingTotal({
        nightlyRate: price,
        totalNights,
        subtotal,
        serviceFee,
        petFee,
        total
      });
    }
  };

  const checkAvailability = async () => {
    if (!checkIn || !checkOut) return;

    try {
      setLoading(true);
      const result = await BookingService.checkAvailability(propertyId, checkIn, checkOut);
      setAvailability({
        available: result.available,
        message: result.available ? undefined : 'Property not available for selected dates'
      });
    } catch (err) {
      console.error('Error checking availability:', err);
      // Assume available if service fails
      setAvailability({ available: true });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      // Validate dates and guests
      if (!checkIn || !checkOut) {
        setError('Please select check-in and check-out dates');
        return;
      }
      if (guests < 1) {
        setError('Please select at least 1 guest');
        return;
      }
      
      // Check availability before proceeding
      await checkAvailability();
      if (!availability.available) {
        return;
      }
    }
    
    if (currentStep === 2) {
      // Validate guest details
      if (!formData.fullName || !formData.email || !formData.phone) {
        setError('Please fill in all required fields');
        return;
      }
    }
    
    setError(null);
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError(null);
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleBooking = async () => {
    if (!isAuthenticated || !authUser) {
      setError('Please sign in to complete your booking');
      return;
    }

    if (!bookingTotal) {
      setError('Please select dates to continue');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const bookingData = {
        property_id: propertyId,
        user_id: authUser.id,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        total_amount: bookingTotal.total,
        guest_details: {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          purpose: formData.purpose
        },
        special_requests: formData.specialRequests || null,
        status: 'pending' as const
      };

      const booking = await BookingService.createBooking(bookingData);
      
      // Show success message or redirect
      console.log('Booking created successfully:', booking);
      
      // Call success callback
      onBookingSuccess?.(booking.id.toString());
      
      // Reset form
      setCurrentStep(1);
      setCheckIn('');
      setCheckOut('');
      setGuests(2);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        purpose: '',
        specialRequests: ''
      });
      
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stepIcons = [Calendar, Users, CreditCard];
  const stepTitles = ['Dates & Guests', 'Guest Details', 'Payment & Verification'];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="relative">
      {/* Trust Indicators & Social Proof */}
      <div className="mb-6 space-y-4">
        {/* Rating & Reviews */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 font-semibold text-gray-900">{trustData.rating}</span>
            </div>
            <span className="text-gray-600">({trustData.reviewCount} reviews)</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Verified Host</span>
          </div>
        </div>

        {/* Host Response & Activity */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <ClockIcon className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">{trustData.responseRate}% response rate</div>
              <div className="text-xs text-gray-600">Usually responds in {trustData.responseTime}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg border border-orange-100">
            <UsersIcon className="w-4 h-4 text-orange-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">Last booked</div>
              <div className="text-xs text-gray-600">{trustData.lastBooked}</div>
            </div>
          </div>
        </div>

        {/* Urgency & Availability */}
        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-gray-900">Only {trustData.availableDates} dates available this month</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700">Instant booking</span>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
          <Shield className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">Free cancellation until 24 hours before check-in</span>
        </div>
      </div>

      {/* Long-term Booking Contact Section */}
      {isLongTermBooking && checkIn && checkOut && (
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                Extended Stay Request ({totalDays} days)
              </h3>
              <p className="text-purple-700 mb-4">
                For stays longer than 30 days, we offer special rates and personalized service. 
                Please contact the host directly to discuss your extended stay requirements.
              </p>
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Check-in:</span>
                    <div className="font-medium">{new Date(checkIn).toLocaleDateString()} at 2:00 PM</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Check-out:</span>
                    <div className="font-medium">{new Date(checkOut).toLocaleDateString()} at 11:00 AM</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Guests:</span>
                    <div className="font-medium">{guests}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <div className="font-medium">{totalDays} days</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    // Scroll to contact section or open contact modal
                    document.getElementById('contact')?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Host</span>
                </button>
                <button
                  onClick={() => {
                    // Reset to short-term booking
                    setIsLongTermBooking(false);
                    setCheckIn('');
                    setCheckOut('');
                    setTotalDays(0);
                  }}
                  className="flex items-center justify-center space-x-2 px-6 py-3 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <span>Adjust Dates</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          {stepTitles.map((title, index) => (
            <div key={index} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep > index + 1 
                  ? 'bg-green-500 text-white' 
                  : currentStep === index + 1 
                    ? 'bg-rust-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}>
                                 {currentStep > index + 1 ? (
                   <CheckCircle className="w-4 h-4" />
                 ) : (
                   React.createElement(stepIcons[index], { className: "w-4 h-4" })
                 )}
              </div>
              {index < stepTitles.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <h3 className="text-lg font-medium text-gray-900">{stepTitles[currentStep - 1]}</h3>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {/* Step Content */}
      {!isLongTermBooking && currentStep === 1 && (
        <div className="space-y-6">
          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Check-in/Check-out Times Information */}
          {(checkIn || checkOut) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 mb-2">Check-in & Check-out Times</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-blue-800">
                        <span className="font-medium">Check-in:</span> 2:00 PM
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-blue-800">
                        <span className="font-medium">Check-out:</span> 11:00 AM
                      </span>
                    </div>
                  </div>
                  <p className="text-blue-700 text-xs mt-2">
                    Early check-in and late check-out may be available upon request
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Guests Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="text-lg font-medium">{guests}</span>
              <button
                onClick={() => setGuests(guests + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Pet Selection */}
          {isPetFriendly && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Pets (₹500 per pet)
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setPetCount(Math.max(0, petCount - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="text-lg font-medium">{petCount}</span>
                <button
                  onClick={() => setPetCount(petCount + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
              {petCount > 0 && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-green-700">
                    <span>✓</span>
                    <span>Pet-friendly property. Additional fee: ₹{petCount * 500}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Availability Status */}
          {loading && (
            <div className="flex items-center space-x-2 text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Checking availability...</span>
            </div>
          )}

          {!loading && checkIn && checkOut && (
            <div className={`flex items-center space-x-2 text-sm ${
              availability.available ? 'text-green-600' : 'text-red-600'
            }`}>
              {availability.available ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>{availability.message || 'Available for selected dates'}</span>
            </div>
          )}
        </div>
      )}

      {!isLongTermBooking && currentStep === 2 && (
        <div className="space-y-6">
          {/* Guest Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust-500 focus:border-transparent"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Purpose of Stay</label>
            <select
              value={formData.purpose}
              onChange={(e) => handleInputChange('purpose', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust-500 focus:border-transparent"
            >
              <option value="">Select purpose</option>
              <option value="leisure">Leisure/Vacation</option>
              <option value="business">Business</option>
              <option value="family">Family Visit</option>
              <option value="romantic">Romantic Getaway</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust-500 focus:border-transparent resize-none"
              placeholder="Any special requests or requirements..."
            />
          </div>
        </div>
      )}

      {!isLongTermBooking && currentStep === 3 && (
        <div className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Booking Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in:</span>
                <span className="font-medium">{new Date(checkIn).toLocaleDateString()} at 2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out:</span>
                <span className="font-medium">{new Date(checkOut).toLocaleDateString()} at 11:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Guests:</span>
                <span className="font-medium">{guests}</span>
              </div>
              {petCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Pets:</span>
                  <span className="font-medium">{petCount}</span>
                </div>
              )}
            </div>
          </div>

          {/* Price Breakdown */}
          {bookingTotal && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Price Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{formatPrice(bookingTotal.nightlyRate)} × {bookingTotal.totalNights} nights</span>
                  <span className="font-medium">{formatPrice(bookingTotal.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service fee</span>
                  <span className="font-medium">{formatPrice(bookingTotal.serviceFee)}</span>
                </div>
                {bookingTotal.petFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pet fee ({petCount} pets)</span>
                    <span className="font-medium">{formatPrice(bookingTotal.petFee)}</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(bookingTotal.total)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Verification Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Verification Required</h4>
                <p className="text-blue-700 text-sm">
                  Your booking will be verified after payment. We'll contact you within 2 hours to confirm your stay.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      {!isLongTermBooking && (
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-rust-500 text-white rounded-lg hover:bg-rust-600 transition-colors disabled:opacity-50"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleBooking}
              disabled={loading || !isAuthenticated}
              className="flex items-center space-x-2 px-6 py-2 bg-rust-500 text-white rounded-lg hover:bg-rust-600 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Complete Booking</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;