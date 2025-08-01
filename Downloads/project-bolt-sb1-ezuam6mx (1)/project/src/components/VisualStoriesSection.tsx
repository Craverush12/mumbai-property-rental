import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Users, Heart, ArrowRight, ChevronLeft, ChevronRight, Star, Sparkles } from 'lucide-react';

interface Property {
  id: number;
  name: string;
  location: string;
  description: string;
  price: number;
  guests: number;
  bedrooms: number;
  image: string;
  highlights: string[];
  category: string;
  rating: number;
}

const properties: Property[] = [
  {
    id: 1,
    name: "Bandra Art House",
    location: "Bandra West, Mumbai",
    description: "A contemporary art gallery meets luxury accommodation. Every corner tells a story of Mumbai's vibrant art scene, with rotating exhibitions and artist studio access.",
    price: 12000,
    guests: 4,
    bedrooms: 2,
    image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    highlights: ["Private Art Studio", "Rotating Exhibitions", "Artist Meetups", "Gallery Lighting"],
    category: "Art & Culture",
    rating: 4.9
  },
  {
    id: 2,
    name: "Heritage Garden Cottage",
    location: "Bandra West, Mumbai",
    description: "Step into Mumbai's colonial past with this beautifully restored heritage property. Vintage charm meets modern luxury in a private garden setting.",
    price: 15000,
    guests: 6,
    bedrooms: 3,
    image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    highlights: ["Private Garden", "Vintage Library", "Colonial Architecture", "Heritage Tours"],
    category: "Heritage",
    rating: 4.8
  },
  {
    id: 3,
    name: "Minimalist Sky Suite",
    location: "Lower Parel, Mumbai",
    description: "Urban zen sanctuary in the heart of Mumbai's business district. Find peace and tranquility with panoramic city views and minimalist design.",
    price: 18000,
    guests: 2,
    bedrooms: 1,
    image: "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    highlights: ["Meditation Pavilion", "Zen Garden", "Rooftop Yoga", "City Views"],
    category: "Urban Zen",
    rating: 4.7
  },
  {
    id: 4,
    name: "Studio Loft Creative",
    location: "Worli, Mumbai",
    description: "A creative haven for artists and designers. High ceilings, natural light, and inspiring views make this the perfect space for creative work and relaxation.",
    price: 14000,
    guests: 3,
    bedrooms: 1,
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    highlights: ["Creative Studio", "Natural Light", "Art Supplies", "Inspiring Views"],
    category: "Studio",
    rating: 4.6
  },
  {
    id: 5,
    name: "Luxury Penthouse",
    location: "Worli Sea Face, Mumbai",
    description: "The epitome of luxury living with breathtaking sea views. Premium amenities, private terrace, and exclusive access to Mumbai's finest experiences.",
    price: 25000,
    guests: 8,
    bedrooms: 4,
    image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    highlights: ["Private Terrace", "Sea Views", "Concierge Service", "Premium Amenities"],
    category: "Penthouse",
    rating: 5.0
  }
];

interface VisualStoriesSectionProps {
  onPropertySelect?: (propertyId: number) => void;
}

const VisualStoriesSection: React.FC<VisualStoriesSectionProps> = ({ onPropertySelect }) => {
  const [currentProperty, setCurrentProperty] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  const property = properties[currentProperty];

  useEffect(() => {
    if (!isHovered) {
      autoPlayRef.current = setInterval(() => {
        setCurrentProperty(prev => (prev + 1) % properties.length);
      }, 2000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isHovered]);

  const nextProperty = () => {
    setCurrentProperty(prev => (prev + 1) % properties.length);
  };

  const prevProperty = () => {
    setCurrentProperty(prev => (prev - 1 + properties.length) % properties.length);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Art & Culture': return 'from-purple-500 to-pink-500';
      case 'Heritage': return 'from-amber-500 to-orange-500';
      case 'Urban Zen': return 'from-blue-500 to-cyan-500';
      case 'Studio': return 'from-emerald-500 to-teal-500';
      case 'Penthouse': return 'from-purple-500 via-pink-500 to-blue-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-sage-50 via-cream-50 to-teal-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="glass-orb glass-orb-1 opacity-20"></div>
        <div className="glass-orb glass-orb-2 opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-editorial font-light text-sage-800 mb-3 sm:mb-4 lg:mb-6 tracking-editorial">
            Featured Properties
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-sage-600 max-w-2xl lg:max-w-3xl mx-auto font-body leading-relaxed px-4">
            Discover our curated collection of Mumbai's most unique stays
          </p>
        </div>

        {/* Property Display */}
        <div 
          className="max-w-6xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Property Card */}
          <div className="backdrop-blur-xl bg-white/80 rounded-2xl lg:rounded-3xl overflow-hidden border border-white/50 shadow-2xl">
            <div className="grid lg:grid-cols-2 min-h-[500px] lg:min-h-[600px]">
              {/* Left Side - Content */}
              <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-between">
                {/* Property Info */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Category Badge */}
                  <div className="inline-flex">
                    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-white bg-gradient-to-r ${getCategoryColor(property.category)}`}>
                      {property.category}
                    </span>
                  </div>

                  {/* Property Name & Location */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-editorial font-medium text-sage-800 mb-2 sm:mb-3">
                      {property.name}
                    </h3>
                    <div className="flex items-center text-sage-600 mb-3 sm:mb-4">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span className="text-sm sm:text-base font-body">{property.location}</span>
                    </div>
                    <div className="flex items-center mb-4 sm:mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(property.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                      <span className="ml-2 text-sm sm:text-base text-sage-600 font-medium">{property.rating}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sage-700 text-sm sm:text-base lg:text-lg font-body leading-relaxed">
                    {property.description}
                  </p>

                  {/* Property Details */}
                  <div className="flex items-center space-x-4 sm:space-x-6 text-sm sm:text-base text-sage-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span>{property.guests} guests</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span>{property.bedrooms} bedroom{property.bedrooms > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="text-sm sm:text-base font-medium text-sage-800">Key Highlights</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-editorial font-medium text-sage-800">
                        ₹{property.price.toLocaleString()}
                      </span>
                      <span className="text-sage-600 text-sm sm:text-base font-body"> / night</span>
                    </div>
                    <button
                      onClick={() => onPropertySelect?.(property.id)}
                      className="btn-primary text-sm sm:text-base lg:text-lg touch-manipulation"
                    >
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Book Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Image */}
              <div className="relative lg:h-full h-64 sm:h-80">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover transition-all duration-1000"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                
                {/* Navigation Controls */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={prevProperty}
                    className="backdrop-blur-xl bg-white/20 p-2 sm:p-3 rounded-full border border-white/30 text-white hover:bg-white/30 transition-all touch-manipulation"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={nextProperty}
                    className="backdrop-blur-xl bg-white/20 p-2 sm:p-3 rounded-full border border-white/30 text-white hover:bg-white/30 transition-all touch-manipulation"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center mt-6 lg:mt-8">
            <div className="flex space-x-2 lg:space-x-4">
              {properties.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentProperty(index)}
                  className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-300 touch-manipulation ${
                    index === currentProperty
                      ? 'bg-gradient-to-r from-rust-500 to-coral-500 scale-125'
                      : 'bg-sage-300 hover:bg-sage-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisualStoriesSection; 