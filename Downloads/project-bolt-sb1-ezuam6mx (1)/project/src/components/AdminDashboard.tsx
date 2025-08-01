import React, { useState, useEffect } from 'react';
import { 
  Home, Users, Calendar, BarChart3, Settings, Plus, Edit, Trash, Eye, 
  Search, Filter, Download, Upload, Bell, TrendingUp, TrendingDown, 
  DollarSign, MapPin, Star, Clock, CheckCircle, XCircle, AlertCircle,
  ArrowUp, ArrowDown, Activity, PieChart, LineChart, BarChart,
  UserPlus, CalendarDays, CreditCard, MessageSquare, Phone, Mail,
  ChevronLeft, ChevronRight, MoreHorizontal, RefreshCw, Zap, X
} from 'lucide-react';
import type { Database } from '../lib/database.types';

type Property = Database['public']['Tables']['properties']['Row'];
type Booking = Database['public']['Tables']['bookings']['Row'];
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DashboardStats {
  totalProperties: number;
  totalBookings: number;
  totalUsers: number;
  totalRevenue: number;
  activeBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  monthlyRevenue: number;
  monthlyGrowth: number;
  occupancyRate: number;
  averageRating: number;
}

// Utility functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusColor = (status: string) => {
  const colors = {
    'confirmed': 'text-green-600 bg-green-100',
    'pending': 'text-yellow-600 bg-yellow-100',
    'cancelled': 'text-red-600 bg-red-100',
    'completed': 'text-blue-600 bg-blue-100'
  };
  return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
};

const getStatusIcon = (status: string) => {
  const icons = {
    'confirmed': '✓',
    'pending': '⏳',
    'cancelled': '✕',
    'completed': '✓'
  };
  return icons[status as keyof typeof icons] || '•';
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'bookings' | 'users' | 'analytics' | 'settings'>('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    monthlyRevenue: 0,
    monthlyGrowth: 0,
    occupancyRate: 0,
    averageRating: 0
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadDashboardData();
    }
  }, [isOpen]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Simulate loading dashboard data
      await Promise.all([
        loadStats(),
        loadProperties(),
        loadBookings(),
        loadUsers()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    // Simulate API call
    const mockStats: DashboardStats = {
      totalProperties: 8,
      totalBookings: 156,
      totalUsers: 89,
      totalRevenue: 2847500,
      activeBookings: 23,
      pendingBookings: 7,
      completedBookings: 126,
      cancelledBookings: 3,
      monthlyRevenue: 425000,
      monthlyGrowth: 12.5,
      occupancyRate: 78.5,
      averageRating: 4.8
    };
    setStats(mockStats);
  };

  const loadProperties = async () => {
    // Simulate API call
    const mockProperties: Property[] = [
      {
        id: 1,
        name: 'Bandra Art Loft',
        location: 'Bandra West, Mumbai',
        description: 'A stunning art-inspired loft...',
        guests: 4,
        bedrooms: 2,
        bathrooms: 2,
        price: 8500,
        category: 'Art & Culture',
        aesthetic: 'Contemporary',
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
        features: { amenities: ['WiFi', 'Kitchen'] },
        story: 'This loft transformed my creative process...',
        testimonials: [],
        virtual_tour_url: 'https://example.com',
        video_url: 'https://example.com',
        highlights: ['Art Gallery', 'City Views'],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];
    setProperties(mockProperties);
  };

  const loadBookings = async () => {
    // Simulate API call
    const mockBookings: Booking[] = [
      {
        id: 1,
        property_id: 1,
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        check_in: '2024-02-15',
        check_out: '2024-02-18',
        guests: 2,
        total_amount: 25500,
        status: 'confirmed',
        guest_details: { guest_name: 'Priya Sharma' },
        special_requests: 'Early check-in if possible',
        payment_status: 'completed',
        confirmation_code: 'BK20240215001',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];
    setBookings(mockBookings);
  };

  const loadUsers = async () => {
    // Simulate API call
    const mockUsers: UserProfile[] = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        full_name: 'Priya Sharma',
        phone: '+919876543210',
        date_of_birth: '1990-05-15',
        nationality: 'Indian',
        profile_image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        bio: 'Digital nomad and travel enthusiast',
        preferred_language: 'en',
        marketing_consent: true,
        newsletter_subscribed: true,
        preferences: { preferred_categories: ['Art & Culture'] },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];
    setUsers(mockUsers);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your luxury rental platform</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'properties', name: 'Properties', icon: Home },
            { id: 'bookings', name: 'Bookings', icon: Calendar },
            { id: 'users', name: 'Users', icon: Users },
            { id: 'analytics', name: 'Analytics', icon: TrendingUp },
            { id: 'settings', name: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && <OverviewTab stats={stats} />}
              {activeTab === 'properties' && <PropertiesTab properties={properties} />}
              {activeTab === 'bookings' && <BookingsTab bookings={bookings} />}
              {activeTab === 'users' && <UsersTab users={users} />}
              {activeTab === 'analytics' && <AnalyticsTab stats={stats} />}
              {activeTab === 'settings' && <SettingsTab />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ stats: DashboardStats }> = ({ stats }) => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Bookings</span>
              <span className="font-semibold text-green-600">{stats.activeBookings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pending Bookings</span>
              <span className="font-semibold text-yellow-600">{stats.pendingBookings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Completed Bookings</span>
              <span className="font-semibold text-blue-600">{stats.completedBookings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Cancelled Bookings</span>
              <span className="font-semibold text-red-600">{stats.cancelledBookings}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Monthly Revenue</span>
              <span className="font-semibold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Monthly Growth</span>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-600">+{stats.monthlyGrowth}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Occupancy Rate</span>
              <span className="font-semibold text-gray-900">{stats.occupancyRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Average Rating</span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-semibold text-gray-900">{stats.averageRating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New booking confirmed', property: 'Art & Culture Loft', time: '2 hours ago', type: 'booking' },
            { action: 'New user registered', user: 'John Doe', time: '4 hours ago', type: 'user' },
            { action: 'Property updated', property: 'Heritage Villa', time: '6 hours ago', type: 'property' },
            { action: 'Payment received', amount: '₹25,500', time: '8 hours ago', type: 'payment' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-600">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Properties Tab Component
const PropertiesTab: React.FC<{ properties: Property[] }> = ({ properties }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Properties</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Property</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Trash className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-2">{property.location}</p>
            <p className="text-sm text-gray-500 mb-4">{property.description.substring(0, 100)}...</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">{formatCurrency(property.price)}</span>
              <span className="text-sm text-gray-600">{property.guests} guests</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Bookings Tab Component
const BookingsTab: React.FC<{ bookings: Booking[] }> = ({ bookings }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Bookings</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Booking</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.confirmation_code}
                  </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                     {(booking.guest_details as any)?.guest_name || 'N/A'}
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Property #{booking.property_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(booking.total_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Users Tab Component
const UsersTab: React.FC<{ users: UserProfile[] }> = ({ users }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Users</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <UserPlus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                 {user.profile_image_url ? (
                   <img src={user.profile_image_url} alt={user.full_name || 'User'} className="w-12 h-12 rounded-full" />
                 ) : (
                   <Users className="w-6 h-6 text-gray-600" />
                 )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user.full_name || 'Unknown User'}</h3>
                <p className="text-sm text-gray-600">{user.phone || 'No phone'}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">{user.bio || 'No bio available'}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Member since {formatDate(user.created_at)}</span>
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab: React.FC<{ stats: DashboardStats }> = ({ stats }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Monthly Revenue</span>
              <span className="font-semibold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Growth Rate</span>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-600">+{stats.monthlyGrowth}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Occupancy Rate</span>
              <span className="font-semibold text-gray-900">{stats.occupancyRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Average Rating</span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-semibold text-gray-900">{stats.averageRating}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Bookings</span>
              <span className="font-semibold text-gray-900">{stats.totalBookings}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Tab Component
const SettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
      
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
            <input
              type="text"
              defaultValue="Infiniti Casa"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
            <input
              type="email"
              defaultValue="admin@infiniticasa.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              defaultValue="+91 98765 43210"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Save Changes
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 