import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Bell, Settings, X, CheckCircle, Clock, AlertCircle, Send, Phone, Mail, User, Shield, Volume2, VolumeX } from 'lucide-react';

interface Notification {
  id: string;
  type: 'booking' | 'reminder' | 'confirmation' | 'support' | 'promotion';
  title: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  phone: string;
  isRead: boolean;
}

interface WhatsAppPreferences {
  bookingNotifications: boolean;
  reminderNotifications: boolean;
  promotionalNotifications: boolean;
  supportNotifications: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  language: 'en' | 'hi' | 'mr';
}

interface WhatsAppNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  userPhone?: string;
}

const WhatsAppNotifications: React.FC<WhatsAppNotificationsProps> = ({
  isOpen,
  onClose,
  userPhone
}) => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'chat' | 'preferences'>('notifications');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<WhatsAppPreferences>({
    bookingNotifications: true,
    reminderNotifications: true,
    promotionalNotifications: false,
    supportNotifications: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    language: 'en'
  });
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'booking',
        title: 'Booking Confirmed',
        message: 'Your booking at Art & Culture Loft has been confirmed for Dec 15-17. Check-in instructions will be sent 24h before arrival.',
        timestamp: '2024-12-10T10:30:00Z',
        status: 'read',
        phone: userPhone || '+91 98765 43210',
        isRead: true
      },
      {
        id: '2',
        type: 'reminder',
        title: 'Check-in Reminder',
        message: 'Your stay at Heritage Villa starts tomorrow! We\'ll send you detailed check-in instructions shortly.',
        timestamp: '2024-12-14T09:00:00Z',
        status: 'delivered',
        phone: userPhone || '+91 98765 43210',
        isRead: false
      },
      {
        id: '3',
        type: 'support',
        title: 'Support Request',
        message: 'We\'ve received your support request. Our team will get back to you within 2 hours.',
        timestamp: '2024-12-13T15:45:00Z',
        status: 'sent',
        phone: userPhone || '+91 98765 43210',
        isRead: true
      },
      {
        id: '4',
        type: 'promotion',
        title: 'Special Offer',
        message: '🎉 20% off on all properties this weekend! Book now to secure this exclusive deal.',
        timestamp: '2024-12-12T11:20:00Z',
        status: 'failed',
        phone: userPhone || '+91 98765 43210',
        isRead: false
      }
    ];
    setNotifications(mockNotifications);
  }, [userPhone]);

  // Mock chat history
  useEffect(() => {
    const mockChatHistory = [
      {
        id: '1',
        type: 'received',
        message: 'Hi! How can I help you today?',
        timestamp: '2024-12-14T10:00:00Z',
        sender: 'Infiniti Casa Support'
      },
      {
        id: '2',
        type: 'sent',
        message: 'I have a question about my booking',
        timestamp: '2024-12-14T10:01:00Z',
        sender: 'You'
      },
      {
        id: '3',
        type: 'received',
        message: 'Sure! I\'d be happy to help. What\'s your booking reference number?',
        timestamp: '2024-12-14T10:02:00Z',
        sender: 'Infiniti Casa Support'
      }
    ];
    setChatHistory(mockChatHistory);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Handle send message
  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      type: 'sent' as const,
      message: chatMessage,
      timestamp: new Date().toISOString(),
      sender: 'You'
    };

    setChatHistory(prev => [...prev, newMessage]);
    setChatMessage('');
    setIsTyping(true);

    // Simulate typing indicator and response
    setTimeout(() => {
      setIsTyping(false);
      const response = {
        id: (Date.now() + 1).toString(),
        type: 'received' as const,
        message: 'Thank you for your message. Our team will get back to you shortly.',
        timestamp: new Date().toISOString(),
        sender: 'Infiniti Casa Support'
      };
      setChatHistory(prev => [...prev, response]);
    }, 2000);
  };

  // Handle preference change
  const handlePreferenceChange = (key: keyof WhatsAppPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  // Handle quiet hours change
  const handleQuietHoursChange = (key: keyof WhatsAppPreferences['quietHours'], value: any) => {
    setPreferences(prev => ({
      ...prev,
      quietHours: { ...prev.quietHours, [key]: value }
    }));
  };

  // Get status icon
  const getStatusIcon = (status: Notification['status']) => {
    switch (status) {
      case 'read':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'sent':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  // Get notification type color
  const getNotificationTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'booking':
        return 'bg-green-100 text-green-800';
      case 'reminder':
        return 'bg-blue-100 text-blue-800';
      case 'support':
        return 'bg-purple-100 text-purple-800';
      case 'promotion':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">WhatsApp Notifications</h2>
              <p className="text-sm text-gray-500">Stay connected with Infiniti Casa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'chat'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Customer Service</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'preferences'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Preferences</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="h-full overflow-y-auto">
              <div className="p-6">
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-xl border transition-colors ${
                        notification.isRead
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNotificationTypeColor(notification.type)}`}>
                              {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            {getStatusIcon(notification.status)}
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Phone className="w-3 h-3 mr-1" />
                            {notification.phone}
                          </div>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="h-full flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-green-50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Infiniti Casa Support</h4>
                    <p className="text-xs text-gray-500">Usually responds within 2 hours</p>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Online</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.type === 'sent'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'sent' ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatMessage.trim()}
                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Notification Types */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Types</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900">Booking Notifications</span>
                        <p className="text-sm text-gray-500">Confirmations, updates, and reminders</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.bookingNotifications}
                        onChange={(e) => handlePreferenceChange('bookingNotifications', e.target.checked)}
                        className="rounded text-green-600 focus:ring-green-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900">Reminder Notifications</span>
                        <p className="text-sm text-gray-500">Check-in and check-out reminders</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.reminderNotifications}
                        onChange={(e) => handlePreferenceChange('reminderNotifications', e.target.checked)}
                        className="rounded text-green-600 focus:ring-green-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900">Support Notifications</span>
                        <p className="text-sm text-gray-500">Customer service updates</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.supportNotifications}
                        onChange={(e) => handlePreferenceChange('supportNotifications', e.target.checked)}
                        className="rounded text-green-600 focus:ring-green-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900">Promotional Messages</span>
                        <p className="text-sm text-gray-500">Special offers and deals</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.promotionalNotifications}
                        onChange={(e) => handlePreferenceChange('promotionalNotifications', e.target.checked)}
                        className="rounded text-green-600 focus:ring-green-500"
                      />
                    </label>
                  </div>
                </div>

                {/* Quiet Hours */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quiet Hours</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900">Enable Quiet Hours</span>
                        <p className="text-sm text-gray-500">Pause notifications during specified hours</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.quietHours.enabled}
                        onChange={(e) => handleQuietHoursChange('enabled', e.target.checked)}
                        className="rounded text-green-600 focus:ring-green-500"
                      />
                    </label>

                    {preferences.quietHours.enabled && (
                      <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                          <input
                            type="time"
                            value={preferences.quietHours.start}
                            onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                          <input
                            type="time"
                            value={preferences.quietHours.end}
                            onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Language</h3>
                  <div className="space-y-2">
                    {[
                      { value: 'en', label: 'English' },
                      { value: 'hi', label: 'Hindi' },
                      { value: 'mr', label: 'Marathi' }
                    ].map((lang) => (
                      <label key={lang.value} className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer">
                        <input
                          type="radio"
                          name="language"
                          value={lang.value}
                          checked={preferences.language === lang.value}
                          onChange={(e) => handlePreferenceChange('language', e.target.value)}
                          className="mr-3 text-green-600 focus:ring-green-500"
                        />
                        <span className="font-medium text-gray-900">{lang.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Privacy & Security */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy & Security</h3>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Shield className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <span className="font-medium text-gray-900">End-to-End Encryption</span>
                        <p className="text-sm text-gray-500">Your messages are secure and private</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <span className="font-medium text-gray-900">Data Protection</span>
                        <p className="text-sm text-gray-500">We never share your personal information</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppNotifications; 