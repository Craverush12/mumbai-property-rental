import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Calendar, MapPin, Edit, Save, X, Camera, Heart, Star, Clock, CheckCircle, XCircle, ArrowLeft, Settings, Bell, Shield, Download, Share2, MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { AuthService } from '../services/authService';
import { BookingService } from '../services/bookingService';
import type { Database } from '../lib/database.types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type Booking = Database['public']['Tables']['bookings']['Row'];

interface UserProfileProps {
  onBackToHome: () => void;
  onViewBooking: (bookingId: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onBackToHome, onViewBooking }) => {
  const { user, updateProfile, updatePreferences } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'favorites' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [editForm, setEditForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    date_of_birth: user?.date_of_birth || '',
    nationality: user?.nationality || '',
    bio: user?.bio || '',
    marketing_consent: user?.marketing_consent || false,
    newsletter_subscribed: user?.newsletter_subscribed || false
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      // Load bookings
      const userBookings = await BookingService.getUserBookings(user!.id);
      setBookings(userBookings);
      
      // Load favorites (placeholder for now)
      setFavorites([]);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await updateProfile(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      full_name: user?.full_name || '',
      email: user?.email || '',
      date_of_birth: user?.date_of_birth || '',
      nationality: user?.nationality || '',
      bio: user?.bio || '',
      marketing_consent: user?.marketing_consent || false,
      newsletter_subscribed: user?.newsletter_subscribed || false
    });
    setIsEditing(false);
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
        return <Clock className="w-4 h-4" />;
    }
  };

  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.check_in) >= new Date() && booking.status !== 'cancelled'
  );

  const pastBookings = bookings.filter(booking => 
    new Date(booking.check_out) < new Date()
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to view your profile</p>
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
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600">Manage your account and preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-8">
              {/* Profile Card */}
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.phone.slice(-2)}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {user.full_name || 'Guest User'}
                </h3>
                <p className="text-gray-600 text-sm">{user.phone}</p>
                {user.is_verified && (
                  <div className="inline-flex items-center mt-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </div>
                )}
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: User },
                  { id: 'bookings', label: 'My Bookings', icon: Calendar, count: bookings.length },
                  { id: 'favorites', label: 'Favorites', icon: Heart, count: favorites.length },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <tab.icon className="w-4 h-4 mr-3" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </div>
                    {tab.count !== undefined && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Profile Information */}
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="text-sm font-medium">Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleSaveProfile}
                          disabled={loading}
                          className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          <span className="text-sm font-medium">Save</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span className="text-sm font-medium">Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={editForm.full_name}
                          onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <input
                          type="date"
                          value={editForm.date_of_birth}
                          onChange={(e) => setEditForm({ ...editForm, date_of_birth: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                        <input
                          type="text"
                          value={editForm.nationality}
                          onChange={(e) => setEditForm({ ...editForm, nationality: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your nationality"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                        <textarea
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="marketing_consent"
                            checked={editForm.marketing_consent}
                            onChange={(e) => setEditForm({ ...editForm, marketing_consent: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="marketing_consent" className="ml-2 text-sm text-gray-700">
                            I agree to receive marketing communications
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="newsletter_subscribed"
                            checked={editForm.newsletter_subscribed}
                            onChange={(e) => setEditForm({ ...editForm, newsletter_subscribed: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="newsletter_subscribed" className="ml-2 text-sm text-gray-700">
                            Subscribe to our newsletter for updates and offers
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Full Name</p>
                        <p className="font-medium text-gray-900">{user.full_name || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <p className="font-medium text-gray-900">{user.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Phone</p>
                        <p className="font-medium text-gray-900">{user.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                        <p className="font-medium text-gray-900">
                          {user.date_of_birth ? formatDate(user.date_of_birth) : 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Nationality</p>
                        <p className="font-medium text-gray-900">{user.nationality || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Member Since</p>
                        <p className="font-medium text-gray-900">{formatDate(user.created_at)}</p>
                      </div>
                      {user.bio && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600 mb-1">Bio</p>
                          <p className="font-medium text-gray-900">{user.bio}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Bookings</p>
                        <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Upcoming Stays</p>
                        <p className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Favorites</p>
                        <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  {bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              Booking #{booking.id} - {(booking as any).properties?.name || 'Property'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDate(booking.check_in)} to {formatDate(booking.check_out)}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1">{booking.status}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-8">No recent activity</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">My Bookings</h2>
                  
                  {/* Booking Tabs */}
                  <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                      {[
                        { id: 'upcoming', label: 'Upcoming', count: upcomingBookings.length },
                        { id: 'past', label: 'Past', count: pastBookings.length },
                        { id: 'all', label: 'All', count: bookings.length }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            tab.id === 'upcoming' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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

                  {/* Bookings List */}
                  {upcomingBookings.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming bookings</h3>
                      <p className="text-gray-600 mb-6">Start exploring our properties to book your next stay!</p>
                      <button
                        onClick={onBackToHome}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Browse Properties
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 rounded-lg overflow-hidden">
                                <img
                                  src={(booking as any).properties?.images?.[0] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'}
                                  alt={(booking as any).properties?.name || 'Property'}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{(booking as any).properties?.name || 'Property'}</h4>
                                <p className="text-sm text-gray-600">{(booking as any).properties?.location || 'Location'}</p>
                                <p className="text-sm text-gray-600">
                                  {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{formatPrice(booking.total_amount)}</p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {getStatusIcon(booking.status)}
                                <span className="ml-1">{booking.status}</span>
                              </span>
                              <button
                                onClick={() => onViewBooking(booking.id.toString())}
                                className="block mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">My Favorites</h2>
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                    <p className="text-gray-600 mb-6">Start exploring properties and add them to your favorites!</p>
                    <button
                      onClick={onBackToHome}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Properties
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((favorite) => (
                      <div key={favorite.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={favorite.image}
                          alt={favorite.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{favorite.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{favorite.location}</p>
                          <p className="font-semibold text-gray-900">{formatPrice(favorite.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Notifications</p>
                          <p className="text-sm text-gray-600">Manage your notification preferences</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Configure
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Privacy & Security</p>
                          <p className="text-sm text-gray-600">Manage your privacy settings</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Manage
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Download className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Download Data</p>
                          <p className="text-sm text-gray-600">Export your personal data</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Export
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MessageCircle className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Customer Support</p>
                          <p className="text-sm text-gray-600">Get help and contact support</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 