import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Star, ArrowRight, Camera, Coffee, Utensils, ShoppingBag } from 'lucide-react';

interface GuideItem {
  id: number;
  category: 'dining' | 'culture' | 'shopping' | 'nature';
  name: string;
  description: string;
  distance: string;
  rating: number;
  image: string;
  priceRange: string;
}

const guideItems: GuideItem[] = [
  {
    id: 1,
    category: 'dining',
    name: "Trishna",
    description: "Award-winning seafood restaurant with innovative Indian coastal cuisine",
    distance: "5 min walk",
    rating: 4.8,
    image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    priceRange: "₹₹₹₹"
  },
  {
    id: 2,
    category: 'culture',
    name: "Gateway of India",
    description: "Iconic Mumbai monument and historic architectural marvel",
    distance: "10 min walk",
    rating: 4.9,
    image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    priceRange: "Free"
  },
  {
    id: 3,
    category: 'shopping',
    name: "Colaba Causeway",
    description: "Vibrant street market for unique souvenirs and local fashion",
    distance: "8 min walk",
    rating: 4.3,
    image: "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    priceRange: "₹₹"
  },
  {
    id: 4,
    category: 'nature',
    name: "Marine Drive",
    description: "Scenic waterfront promenade perfect for sunset walks",
    distance: "15 min walk",
    rating: 4.7,
    image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    priceRange: "Free"
  }
];

const categoryIcons = {
  dining: Utensils,
  culture: Camera,
  shopping: ShoppingBag,
  nature: MapPin
};

const categoryColors = {
  dining: 'from-rust-400 to-coral-400',
  culture: 'from-sage-400 to-teal-400',
  shopping: 'from-coral-400 to-rust-400',
  nature: 'from-teal-400 to-sage-400'
};

const MumbaiGuidePreview: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('dining');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('mumbai-guide');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const filteredItems = guideItems.filter(item => item.category === activeCategory);

  return (
    <section id="mumbai-guide" className="py-16 sm:py-24 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-12 sm:mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-light text-sage-800 mb-4 sm:mb-6 tracking-editorial">
            Explore Mumbai
          </h2>
          <p className="text-lg sm:text-xl text-sage-600 max-w-2xl mx-auto font-body leading-relaxed mb-8">
            Discover the best of Mumbai with our curated local guide
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {Object.entries(categoryIcons).map(([category, Icon]) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full font-body font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === category
                    ? `bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]} text-white shadow-lg`
                    : 'glass-button text-sage-600 hover:bg-white/60'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="capitalize">{category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Guide Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {filteredItems.map((item, index) => {
            const Icon = categoryIcons[item.category];
            return (
              <div
                key={item.id}
                className={`boutique-card hover-lift group cursor-pointer transform transition-all duration-700 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <div className={`bg-gradient-to-r ${categoryColors[item.category]} p-2 rounded-full shadow-lg`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="absolute top-3 right-3">
                    <div className="glass-button px-2 py-1 rounded-full">
                      <span className="text-xs font-body font-medium text-sage-800">{item.priceRange}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-editorial font-medium text-sage-800 group-hover:text-rust-600 transition-colors duration-300">
                      {item.name}
                    </h3>
                    <div className="flex items-center ml-2">
                      <Star className="w-4 h-4 text-rust-400 fill-current" />
                      <span className="text-sm font-body font-medium text-sage-600 ml-1">{item.rating}</span>
                    </div>
                  </div>

                  <p className="text-sage-600 mb-4 font-body text-sm leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sage-500">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm font-body">{item.distance}</span>
                    </div>
                    <button className="text-rust-600 hover:text-rust-700 transition-colors duration-300 group">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View Full Guide CTA */}
        <div className={`text-center mt-12 sm:mt-16 transform transition-all duration-1000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <button className="btn-primary text-lg">
            View Complete Mumbai Guide
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MumbaiGuidePreview;