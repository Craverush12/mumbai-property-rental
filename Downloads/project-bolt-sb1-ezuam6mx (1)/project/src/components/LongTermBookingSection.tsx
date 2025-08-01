import React, { useState } from 'react';
import { Calendar, Clock, Star, MapPin, ArrowRight, Sparkles, Home, Users, MessageCircle } from 'lucide-react';

interface LongTermBookingSectionProps {
  onContactClick?: () => void;
}

const LongTermBookingSection: React.FC<LongTermBookingSectionProps> = ({ onContactClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const benefits = [
    {
      icon: Star,
      title: 'Special Rates',
      description: 'Discounted pricing for extended stays'
    },
    {
      icon: Home,
      title: 'Fully Furnished',
      description: 'Everything you need for comfortable living'
    },
    {
      icon: Users,
      title: 'Personalized Service',
      description: 'Dedicated support for long-term guests'
    },
    {
      icon: Clock,
      title: 'Flexible Terms',
      description: 'Customizable check-in/check-out times'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-rust-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-rust-500">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">Extended Stays</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
                <span className="block">Perfect for</span>
                <span className="block font-medium">Extended Stays</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Whether you're relocating, on a long business trip, or simply want to immerse yourself in Mumbai's vibrant culture, our extended stay options offer the perfect blend of comfort and convenience.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="space-y-3">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-rust-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={onContactClick}
                className="group flex items-center justify-center space-x-2 px-8 py-4 bg-rust-500 text-white rounded-xl hover:bg-rust-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">Contact for Extended Stay</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-center space-x-2 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-rust-500 hover:text-rust-500 transition-all duration-200">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">View Availability</span>
              </button>
            </div>
          </div>

          {/* Floating Card Section */}
          <div className="relative">
            <div
              className={`relative bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-500 ${
                isHovered ? 'scale-105 rotate-1' : 'scale-100 rotate-0'
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-rust-400 to-rust-600 rounded-xl flex items-center justify-center">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Extended Stay Package</h3>
                    <p className="text-sm text-gray-500">30+ days</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900">4.9</span>
                </div>
              </div>

              {/* Property Preview */}
              <div className="relative mb-6">
                <img
                  src="https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                  alt="Extended Stay Property"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-semibold">The Bandra Cottage</h4>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>Bandra West, Mumbai</span>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Fully furnished with premium amenities</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Weekly housekeeping included</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">24/7 concierge service</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Flexible check-in/check-out</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Starting from</span>
                  <span className="text-2xl font-bold text-gray-900">₹45,000</span>
                </div>
                <p className="text-xs text-gray-500">per month (30+ days)</p>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full shadow-lg"></div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full opacity-20 blur-xl"></div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
            <div className="text-sm text-gray-600">Extended Stay Guests</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">4.9★</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">30+</div>
            <div className="text-sm text-gray-600">Days Minimum</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
            <div className="text-sm text-gray-600">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LongTermBookingSection;