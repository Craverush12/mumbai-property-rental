import React, { useState } from 'react';
import { MapPin, Coffee, Utensils, ShoppingBag, Camera, Star, Clock, Navigation } from 'lucide-react';

interface NeighborhoodPlace {
  id: number;
  name: string;
  category: 'restaurant' | 'cafe' | 'shopping' | 'attraction' | 'nightlife';
  description: string;
  rating: number;
  distance: string;
  walkTime: string;
  image: string;
  priceRange?: string;
}

interface NeighborhoodGuideProps {
  location: string;
  className?: string;
}

const neighborhoodPlaces: NeighborhoodPlace[] = [
  {
    id: 1,
    name: 'Linking Road',
    category: 'shopping',
    description: 'Famous street shopping destination with trendy clothes, accessories, and street food.',
    rating: 4.5,
    distance: '0.3 km',
    walkTime: '4 min',
    image: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    priceRange: '₹₹'
  },
  {
    id: 2,
    name: 'Bandra Bandstand',
    category: 'attraction',
    description: 'Scenic promenade with sea views, perfect for evening walks and sunset photography.',
    rating: 4.7,
    distance: '1.2 km',
    walkTime: '15 min',
    image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
  },
  {
    id: 3,
    name: 'Olive Bar & Kitchen',
    category: 'restaurant',
    description: 'Upscale Mediterranean restaurant with beautiful ambiance and excellent food.',
    rating: 4.3,
    distance: '0.8 km',
    walkTime: '10 min',
    image: 'https://images.pexels.com/photos/2696064/pexels-photo-2696064.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    priceRange: '₹₹₹₹'
  },
  {
    id: 4,
    name: 'Elbow Room',
    category: 'cafe',
    description: 'Cozy cafe known for excellent coffee, breakfast, and relaxed atmosphere.',
    rating: 4.4,
    distance: '0.5 km',
    walkTime: '6 min',
    image: 'https://images.pexels.com/photos/1833306/pexels-photo-1833306.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    priceRange: '₹₹'
  },
  {
    id: 5,
    name: 'Toto\'s Garage',
    category: 'nightlife',
    description: 'Popular pub with live music, great cocktails, and vibrant nightlife scene.',
    rating: 4.2,
    distance: '0.7 km',
    walkTime: '9 min',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    priceRange: '₹₹₹'
  },
  {
    id: 6,
    name: 'Bandra Fort',
    category: 'attraction',
    description: 'Historic Portuguese fort with panoramic views of the Bandra-Worli Sea Link.',
    rating: 4.1,
    distance: '1.5 km',
    walkTime: '18 min',
    image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
  }
];

const categoryIcons = {
  restaurant: Utensils,
  cafe: Coffee,
  shopping: ShoppingBag,
  attraction: Camera,
  nightlife: Clock
};

const categoryColors = {
  restaurant: 'bg-red-100 text-red-600',
  cafe: 'bg-amber-100 text-amber-600',
  shopping: 'bg-purple-100 text-purple-600',
  attraction: 'bg-green-100 text-green-600',
  nightlife: 'bg-blue-100 text-blue-600'
};

const NeighborhoodGuide: React.FC<NeighborhoodGuideProps> = ({
  location,
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'restaurant', label: 'Restaurants' },
    { id: 'cafe', label: 'Cafes' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'attraction', label: 'Attractions' },
    { id: 'nightlife', label: 'Nightlife' }
  ];
  
  const filteredPlaces = selectedCategory === 'all' 
    ? neighborhoodPlaces 
    : neighborhoodPlaces.filter(place => place.category === selectedCategory);

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Explore the neighborhood</h3>
      </div>
      
      <p className="text-gray-600 mb-6">
        Discover what makes {location} special with these local favorites within walking distance.
      </p>
      
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
      
      {/* Places Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlaces.map((place) => {
          const IconComponent = categoryIcons[place.category];
          const categoryColor = categoryColors[place.category];
          
          return (
            <div
              key={place.id}
              className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className={`absolute top-3 left-3 p-2 rounded-full ${categoryColor}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {place.name}
                  </h4>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-3 h-3 text-gold-400 fill-current" />
                    <span className="font-medium">{place.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {place.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Navigation className="w-3 h-3" />
                    <span>{place.distance} · {place.walkTime} walk</span>
                  </div>
                  {place.priceRange && (
                    <span className="font-medium">{place.priceRange}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
          View more places on map
        </button>
      </div>
    </div>
  );
};

export default NeighborhoodGuide; 