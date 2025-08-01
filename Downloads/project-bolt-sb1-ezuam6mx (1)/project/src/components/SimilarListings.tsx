import React from 'react';
import { Star, MapPin, Heart } from 'lucide-react';

interface SimilarProperty {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  isSuperhost?: boolean;
  guests: number;
  bedrooms: number;
  bathrooms: number;
}

interface SimilarListingsProps {
  currentPropertyId: number;
  onPropertySelect?: (propertyId: number) => void;
  className?: string;
}

const similarProperties: SimilarProperty[] = [
  {
    id: 2,
    name: 'Colaba Heritage Loft',
    location: 'Colaba, Mumbai',
    price: 7200,
    rating: 4.8,
    reviews: 67,
    image: 'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    isSuperhost: true,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
  },
  {
    id: 3,
    name: 'Juhu Beach House',
    location: 'Juhu, Mumbai',
    price: 9800,
    rating: 4.9,
    reviews: 89,
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    isSuperhost: false,
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
  },
  {
    id: 4,
    name: 'Worli Sea View Studio',
    location: 'Worli, Mumbai',
    price: 6500,
    rating: 4.7,
    reviews: 34,
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    isSuperhost: true,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    id: 5,
    name: 'Khar Creative Space',
    location: 'Khar West, Mumbai',
    price: 8200,
    rating: 4.6,
    reviews: 45,
    image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    isSuperhost: false,
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
  },
];

const SimilarListings: React.FC<SimilarListingsProps> = ({
  currentPropertyId,
  onPropertySelect,
  className = ''
}) => {
  const filteredProperties = similarProperties.filter(p => p.id !== currentPropertyId);

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Similar listings</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            className="group cursor-pointer transition-transform hover:scale-105"
            onClick={() => onPropertySelect?.(property.id)}
          >
            <div className="relative overflow-hidden rounded-xl mb-3">
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-48 object-cover object-center group-hover:scale-110 transition-transform duration-300"
              />
              <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                <Heart className="w-4 h-4 text-gray-600" />
              </button>
              {property.isSuperhost && (
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <span className="text-xs font-medium text-gray-700">Superhost</span>
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 truncate">{property.name}</h4>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-3 h-3 text-gold-400 fill-current" />
                  <span className="font-medium">{property.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="w-3 h-3" />
                <span>{property.location}</span>
              </div>
              
              <div className="text-sm text-gray-600">
                {property.guests} guests · {property.bedrooms} bedrooms · {property.bathrooms} bathrooms
              </div>
              
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span>{property.reviews} reviews</span>
              </div>
              
              <div className="pt-1">
                <span className="font-semibold text-gray-900">₹{property.price.toLocaleString()}</span>
                <span className="text-sm text-gray-500"> night</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
          Show more similar listings
        </button>
      </div>
    </div>
  );
};

export default SimilarListings; 