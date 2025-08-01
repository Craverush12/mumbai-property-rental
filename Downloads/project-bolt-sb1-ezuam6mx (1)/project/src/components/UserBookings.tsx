import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Star, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft, Eye, Download, MessageCircle } from 'lucide-react';
import { BookingService } from '../services/bookingService';
import { useAuth } from '../hooks/useAuth';
import type { Database } from '../lib/database.types';

type Booking = Database['public']['Tables']['bookings']['Row'];

interface UserBookingsProps {
  onBackToHome: () => void;
  onViewBooking: (bookingId: string) => void;
}

const UserBookings: React.FC<UserBookingsProps> = ({ onBackToHome, onViewBooking }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  useEffect(() => {
    if (user) {
      loadUserBookings();
    }
  }, [user]);

  const loadUserBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userBookings = await BookingService.getUserBookings(user!.id);
      setBookings(userBookings);
    } catch (err) {
      console.error('Error loading user bookings:', err);
      setError('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
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

  const filterBookings = () => {
    const now = new Date();
    
    switch (activeTab) {
      case 'upcoming':
        return bookings.filter(booking => 
          new Date(booking.check_in) >= now && booking.status !== 'cancelled'
        );
      case 'past':
        return bookings.filter(booking => 
          new Date(booking.check_out) < now
        );
      default:
        return bookings;
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await BookingService.cancelBooking(bookingId.toString(), 'Cancelled by user');
      await loadUserBookings(); // Reload bookings
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const handleWhatsAppSupport = (bookingId: number) => {
    const message = `Hi! I need help with my booking #${bookingId}. Can you please assist me?`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredBookings = filterBookings();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadUserBookings}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToHome}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
                <p className="text-gray-600">Manage your property bookings</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold text-gray-900">{user?.full_name || 'Guest'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'upcoming', label: 'Upcoming', count: bookings.filter(b => new Date(b.check_in) >= new Date() && b.status !== 'cancelled').length },
                { id: 'past', label: 'Past', count: bookings.filter(b => new Date(b.check_out) < new Date()).length },
                { id: 'all', label: 'All', count: bookings.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'upcoming' ? 'No upcoming bookings' : 
               activeTab === 'past' ? 'No past bookings' : 'No bookings yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'upcoming' ? 'Start exploring our properties to book your next stay!' :
               activeTab === 'past' ? 'Your past bookings will appear here.' :
               'Your bookings will appear here once you make your first reservation.'}
            </p>
            {activeTab === 'upcoming' && (
              <button
                onClick={onBackToHome}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Properties
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        {/* Property Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={(booking as any).properties?.images?.[0] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'}
                            alt={(booking as any).properties?.name || 'Property'}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Booking Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {(booking as any).properties?.name || 'Property'}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {getStatusIcon(booking.status)}
                                <span className="ml-1">{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm">{(booking as any).properties?.location || 'Location'}</span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Check-in</p>
                              <p className="font-medium text-gray-900">{formatDate(booking.check_in)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Check-out</p>
                              <p className="font-medium text-gray-900">{formatDate(booking.check_out)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Guests</p>
                              <p className="font-medium text-gray-900">{booking.guests} people</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total</p>
                              <p className="font-bold text-gray-900">{formatPrice(booking.total_amount)}</p>
                            </div>
                          </div>

                          {/* Booking ID and Confirmation Code */}
                          <div className="mt-4 flex items-center space-x-4 text-sm">
                            <div>
                              <span className="text-gray-600">Booking ID: </span>
                              <span className="font-mono font-medium text-gray-900">#{booking.id}</span>
                            </div>
                            {booking.confirmation_code && (
                              <div>
                                <span className="text-gray-600">Confirmation: </span>
                                <span className="font-mono font-medium text-gray-900">{booking.confirmation_code}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => onViewBooking(booking.id.toString())}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">View Details</span>
                      </button>
                      
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm">Cancel</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleWhatsAppSupport(booking.id)}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">Get Help</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookings; 