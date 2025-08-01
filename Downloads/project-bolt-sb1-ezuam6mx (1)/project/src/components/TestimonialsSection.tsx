import React, { useState, useEffect, useRef } from 'react';
import { Star, Quote, Heart, MapPin } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  avatar: string;
  propertyImage: string;
  propertyName: string;
  rating: number;
  text: string;
  stayDuration: string;
  size: 'small' | 'medium' | 'large';
  position: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Delhi",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    propertyImage: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    propertyName: "Art Loft Bandra",
    rating: 5,
    text: "Every corner revealed something new—it was like staying in a living gallery where art and life became one.",
    stayDuration: "5 nights",
    size: "large",
    position: "top-left"
  },
  {
    id: 2,
    name: "Raj Patel",
    location: "Bangalore",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    propertyImage: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    propertyName: "Heritage Cottage",
    rating: 5,
    text: "The heritage cottage transported me back in time while providing all modern comforts.",
    stayDuration: "3 nights",
    size: "medium",
    position: "top-right"
  },
  {
    id: 3,
    name: "Sarah Johnson",
    location: "London",
    avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    propertyImage: "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    propertyName: "Zen Suite",
    rating: 5,
    text: "An oasis of calm in the bustling city. The minimalist design was perfect.",
    stayDuration: "7 nights",
    size: "small",
    position: "middle-left"
  },
  {
    id: 4,
    name: "Arjun Mehta",
    location: "Chennai",
    avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    propertyImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    propertyName: "Penthouse Worli",
    rating: 5,
    text: "The views from the penthouse were breathtaking. Every sunset felt like a private show.",
    stayDuration: "4 nights",
    size: "medium",
    position: "middle-right"
  },
  {
    id: 5,
    name: "Emma Wilson",
    location: "New York",
    avatar: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    propertyImage: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    propertyName: "Studio Bandra",
    rating: 5,
    text: "Perfect for a romantic getaway. The attention to detail was incredible.",
    stayDuration: "2 nights",
    size: "small",
    position: "bottom-left"
  },
  {
    id: 6,
    name: "Michael Chen",
    location: "Singapore",
    avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    propertyImage: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    propertyName: "Colonial Manor",
    rating: 5,
    text: "The cultural immersion was beyond expectations. Mumbai's history came alive.",
    stayDuration: "6 nights",
    size: "large",
    position: "bottom-right"
  }
];

const TestimonialsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getCardSize = (size: string) => {
    switch (size) {
      case 'small':
        return 'h-64 md:h-72';
      case 'medium':
        return 'h-80 md:h-96';
      case 'large':
        return 'h-96 md:h-[28rem]';
      default:
        return 'h-80';
    }
  };

  const getGridPosition = (position: string, index: number) => {
    const positions = {
      'top-left': 'md:col-start-1 md:row-start-1',
      'top-right': 'md:col-start-2 md:row-start-1 md:col-span-2',
      'middle-left': 'md:col-start-1 md:row-start-2',
      'middle-right': 'md:col-start-3 md:row-start-2',
      'bottom-left': 'md:col-start-1 md:row-start-3 md:col-span-2',
      'bottom-right': 'md:col-start-3 md:row-start-3'
    };
    return positions[position as keyof typeof positions] || '';
  };

  return (
    <section 
      ref={containerRef}
      className="py-32 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-20 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-6xl md:text-7xl font-light text-gray-900 mb-8 leading-tight">
            <span className="block opacity-90">Guest</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Stories
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real experiences from guests who discovered Mumbai through our properties
          </p>
        </div>

        {/* Masonry Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-min">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`relative ${getCardSize(testimonial.size)} ${getGridPosition(testimonial.position, index)} transform transition-all duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredCard(testimonial.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative h-full bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group cursor-pointer">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={testimonial.propertyImage}
                    alt={testimonial.propertyName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>

                {/* Floating Quote */}
                <div className="absolute top-6 right-6">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center">
                    <Quote className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <div className={`transform transition-all duration-500 ${
                    hoveredCard === testimonial.id ? 'translate-y-0' : 'translate-y-2'
                  }`}>
                    {/* Property Badge */}
                    <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                      {testimonial.propertyName}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-white/80 text-sm ml-2">
                        {testimonial.stayDuration}
                      </span>
                    </div>

                    {/* Testimonial Text */}
                    <blockquote className={`text-white/90 leading-relaxed mb-6 ${
                      testimonial.size === 'large' ? 'text-lg' : 'text-base'
                    }`}>
                      "{testimonial.text}"
                    </blockquote>

                    {/* Guest Info */}
                    <div className="flex items-center gap-3">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                      />
                      <div>
                        <div className="font-semibold text-white">
                          {testimonial.name}
                        </div>
                        <div className="flex items-center gap-1 text-white/70 text-sm">
                          <MapPin className="w-3 h-3" />
                          {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent transition-opacity duration-300 ${
                  hoveredCard === testimonial.id ? 'opacity-100' : 'opacity-0'
                }`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Stats */}
        <div className="relative mt-32">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl"></div>
          <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold text-white mb-2">4.9</div>
                <div className="text-white/80">Average Rating</div>
              </div>
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-white/80">Happy Guests</div>
              </div>
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold text-white mb-2">98%</div>
                <div className="text-white/80">Return Rate</div>
              </div>
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold text-white mb-2">8</div>
                <div className="text-white/80">Properties</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-20 transform transition-all duration-1000 delay-800 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
            <Heart className="w-5 h-5 text-red-500" />
            <span>Share Your Story</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;