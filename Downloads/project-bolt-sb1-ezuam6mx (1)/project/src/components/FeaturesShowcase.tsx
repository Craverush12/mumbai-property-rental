import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Car, Coffee, Utensils, Home, Shield, Clock, Star, Users, Heart } from 'lucide-react';

interface Amenity {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const amenities: Amenity[] = [
  {
    id: 1,
    icon: <Wifi className="w-8 h-8 text-gray-700" />,
    title: "High-speed Wi-Fi",
    description: "Complimentary high-speed internet throughout your stay"
  },
  {
    id: 2,
    icon: <Car className="w-8 h-8 text-gray-700" />,
    title: "Private Parking",
    description: "Secure parking spaces available for all guests"
  },
  {
    id: 3,
    icon: <Coffee className="w-8 h-8 text-gray-700" />,
    title: "Welcome Breakfast",
    description: "Complimentary breakfast served daily from 7-11 AM"
  },
  {
    id: 4,
    icon: <Utensils className="w-8 h-8 text-gray-700" />,
    title: "Fully Equipped Kitchen",
    description: "Complete kitchen facilities with premium appliances"
  },
  {
    id: 5,
    icon: <Home className="w-8 h-8 text-gray-700" />,
    title: "Heated Floors",
    description: "Underfloor heating for ultimate comfort"
  },
  {
    id: 6,
    icon: <Shield className="w-8 h-8 text-gray-700" />,
    title: "24/7 Security",
    description: "Round-the-clock security and concierge service"
  },
  {
    id: 7,
    icon: <Clock className="w-8 h-8 text-gray-700" />,
    title: "Flexible Check-in",
    description: "Self check-in available anytime after 3 PM"
  },
  {
    id: 8,
    icon: <Star className="w-8 h-8 text-gray-700" />,
    title: "Luxury Amenities",
    description: "Premium toiletries and high-quality linens"
  },
  {
    id: 9,
    icon: <Users className="w-8 h-8 text-gray-700" />,
    title: "Personalized Service",
    description: "Dedicated concierge for local recommendations"
  },
  {
    id: 10,
    icon: <Heart className="w-8 h-8 text-gray-700" />,
    title: "Wellness Focused",
    description: "Air purifiers and wellness amenities in every room"
  }
];

const FeaturesShowcase: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
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

  return (
    <section 
      ref={containerRef}
      className="py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-20 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 leading-tight">
            <span className="block text-gray-800">You become part</span>
            <span className="block text-gray-600 font-normal italic">of our Mumbai story</span>
          </h2>
          <div className="w-24 h-px bg-gray-300 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            All properties meet these exacting standards about safety, service, and hospitality.
            We hand-pick every amenity to ensure your stay is nothing short of extraordinary.
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {amenities.map((amenity, index) => (
            <div 
              key={amenity.id}
              className={`text-center group transform transition-all duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-gray-100 transition-colors duration-300">
                  {amenity.icon}
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {amenity.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {amenity.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Story Section */}
        <div className={`mt-24 transform transition-all duration-1000 delay-800 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              But there's more such as: All properties meet these exacting standards about 
              safety, service, and hospitality. We hand-pick every property to ensure your 
              stay is nothing short of extraordinary. From the moment you arrive, you'll 
              feel at home with our thoughtfully curated amenities.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Many of our properties include special features like rooftop gardens, 
              private balconies, and locally sourced artwork. Each stay supports the 
              local community and gives you an authentic Mumbai experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase; 