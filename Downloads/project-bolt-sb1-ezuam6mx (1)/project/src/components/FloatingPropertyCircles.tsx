import React, { useState, useEffect } from 'react';
import { MapPin, Star, ArrowRight } from 'lucide-react';

interface PropertyCircle {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  price: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface FloatingPropertyCirclesProps {
  onPropertySelect?: (propertyId: number) => void;
}

const FloatingPropertyCircles: React.FC<FloatingPropertyCirclesProps> = ({ onPropertySelect }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Mock property data for floating circles
  const properties: PropertyCircle[] = [
    {
      id: 1,
      name: "The Bandra Cottage",
      location: "Bandra West",
      image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      rating: 4.9,
      price: 6200,
      x: 20,
      y: 30,
      size: 120,
      delay: 0
    },
    {
      id: 2,
      name: "Sea View Zen Loft",
      location: "Colaba",
      image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      rating: 4.8,
      price: 7800,
      x: 70,
      y: 20,
      size: 100,
      delay: 0.2
    },
    {
      id: 3,
      name: "Heritage Garden Villa",
      location: "Lower Parel",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      rating: 4.7,
      price: 9200,
      x: 15,
      y: 70,
      size: 140,
      delay: 0.4
    },
    {
      id: 4,
      name: "Minimalist Sky Suite",
      location: "Worli",
      image: "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      rating: 4.9,
      price: 8500,
      x: 80,
      y: 60,
      size: 110,
      delay: 0.6
    },
    {
      id: 5,
      name: "Penthouse Sky Lounge",
      location: "Bandra East",
      image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      rating: 4.8,
      price: 11000,
      x: 45,
      y: 15,
      size: 130,
      delay: 0.8
    }
  ];

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="relative h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-rust-200 to-orange-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-gray-900 max-w-4xl mx-auto px-4">
          <div className={`transform transition-all duration-1000 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-6 leading-tight">
              <span className="block">Discover</span>
              <span className="block font-medium">Mumbai's Finest</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 font-light max-w-2xl mx-auto leading-relaxed">
              Explore our curated collection of exceptional properties across Mumbai's most sought-after neighborhoods
            </p>
          </div>
        </div>
      </div>

      {/* Floating Property Circles */}
      <div className="absolute inset-0 pointer-events-none">
        {properties.map((property, index) => (
          <div
            key={property.id}
            className={`absolute transform transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-75'
            }`}
            style={{
              left: `${property.x}%`,
              top: `${property.y}%`,
              transform: `translate(-50%, -50%) translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
              transitionDelay: `${property.delay}s`
            }}
          >
            {/* Floating Circle */}
            <div
              className="relative group cursor-pointer pointer-events-auto"
              onClick={() => onPropertySelect?.(property.id)}
            >
              {/* Main Circle */}
              <div className={`relative w-${property.size} h-${property.size} rounded-full overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-3xl`}>
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Property Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold text-sm mb-1 truncate">{property.name}</h3>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{property.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{property.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Price Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-xs font-semibold text-gray-900">
                    {formatPrice(property.price)}
                  </span>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-rust-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full shadow-lg animate-bounce"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full shadow-lg animate-pulse"></div>

              {/* Connection Lines (subtle) */}
              {index < properties.length - 1 && (
                <div 
                  className="absolute top-1/2 left-1/2 w-px h-20 bg-gradient-to-b from-transparent via-gray-300 to-transparent opacity-30"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`
                  }}
                ></div>
              )}
            </div>

            {/* Pulse Ring */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border-2 border-rust-300/30 animate-ping"></div>
          </div>
        ))}
      </div>

      {/* Interactive CTA */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className={`transform transition-all duration-1000 ease-out delay-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <button className="group flex items-center space-x-3 px-8 py-4 bg-white/90 backdrop-blur-md rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <span className="font-medium text-gray-900">Explore Properties</span>
            <ArrowRight className="w-5 h-5 text-rust-500 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center space-y-2 text-gray-400">
          <span className="text-xs font-medium">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FloatingPropertyCircles;