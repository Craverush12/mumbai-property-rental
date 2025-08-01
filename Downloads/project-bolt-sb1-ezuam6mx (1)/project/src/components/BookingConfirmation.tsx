import React, { useState, useEffect } from 'react';
import { CheckCircle, Calendar, MapPin, Users, CreditCard, Download, Share2, MessageCircle, Phone, Mail, ArrowLeft } from 'lucide-react';
import { BookingService } from '../services/bookingService';
import type { Database } from '../lib/database.types';

type Booking = Database['public']['Tables']['bookings']['Row'];
type Property = Database['public']['Tables']['properties']['Row'];

interface BookingConfirmationProps {
  bookingId: string;
  onBackToHome: () => void;
  onViewBooking: (bookingId: string) => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ 
  bookingId, 
  onBackToHome, 
  onViewBooking 
}) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const bookingData = await BookingService.getBookingById(bookingId);
      if (bookingData) {
        setBooking(bookingData);
        // Property data is included in the booking response
        if (bookingData.properties) {
          setProperty(bookingData.properties as any);
        }
      } else {
        setError('Booking not found');
      }
    } catch (err) {
      console.error('Error loading booking details:', err);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleDownloadReceipt = () => {
    // Generate and download receipt
    const receiptData = {
      bookingId: booking?.id,
      propertyName: property?.name,
      checkIn: booking?.check_in,
      checkOut: booking?.check_out,
      guests: booking?.guests,
      totalAmount: booking?.total_amount,
      confirmationCode: booking?.confirmation_code
    };
    
    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-${booking?.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: `Booking Confirmation - ${property?.name}`,
        text: `I've booked ${property?.name} for ${formatDate(booking?.check_in || '')}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Booking link copied to clipboard!');
    }
  };

  const handleWhatsAppShare = () => {
    const message = `Hi! I've booked ${property?.name} for ${formatDate(booking?.check_in || '')}. Confirmation code: ${booking?.confirmation_code}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Booking not found'}</p>
          <button 
            onClick={onBackToHome}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToHome}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            <div className="text-right">
              <p className="text-sm text-gray-600">Confirmation Code</p>
              <p className="font-mono font-bold text-lg text-gray-900">
                {booking.confirmation_code || `BK${booking.id.toString().padStart(6, '0')}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600">
            Your booking has been successfully confirmed. We've sent you a confirmation email and WhatsApp message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={property.images[0] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.name}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{property.guests} guests</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{property.bedrooms} bedrooms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Check-in</p>
                    <p className="font-semibold text-gray-900">{formatDate(booking.check_in)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Check-out</p>
                    <p className="font-semibold text-gray-900">{formatDate(booking.check_out)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Guests</p>
                    <p className="font-semibold text-gray-900">{booking.guests} people</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Booking ID</p>
                    <p className="font-mono font-semibold text-gray-900">#{booking.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-xl font-bold text-gray-900">{formatPrice(booking.total_amount)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Details */}
            {booking.guest_details && (
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Guest Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Full Name</p>
                    <p className="font-semibold text-gray-900">
                      {(booking.guest_details as any).full_name || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-semibold text-gray-900">
                      {(booking.guest_details as any).email || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-semibold text-gray-900">
                      {(booking.guest_details as any).phone || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Purpose</p>
                    <p className="font-semibold text-gray-900">
                      {(booking.guest_details as any).purpose || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Special Requests */}
            {booking.special_requests && (
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Special Requests</h2>
                <p className="text-gray-700">{booking.special_requests}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleDownloadReceipt}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Receipt</span>
                </button>
                
                <button
                  onClick={handleShareBooking}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Booking</span>
                </button>
                
                <button
                  onClick={handleWhatsAppShare}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Share on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <a
                  href="tel:+91-98765-43210"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Support</span>
                </a>
                <a
                  href="mailto:support@infiniticasa.com"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Support</span>
                </a>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Support</span>
                </a>
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Payment Method</span>
              </div>
              <p className="font-semibold text-gray-900 mb-4">Credit/Debit Card</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment ID</span>
                  <span className="font-mono text-gray-900">
                    {booking.payment_id || 'Processing...'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${
                    booking.payment_status === 'completed' 
                      ? 'text-green-600' 
                      : booking.payment_status === 'pending'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}>
                    {booking.payment_status || 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <button
            onClick={() => onViewBooking(bookingId)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View All My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 