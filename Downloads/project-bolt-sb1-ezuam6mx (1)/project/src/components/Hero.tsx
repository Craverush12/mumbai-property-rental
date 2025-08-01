import React, { useEffect, useState } from 'react';
import { Calendar, ArrowRight, MapPin, Play, Search } from 'lucide-react';

interface HeroProps {
  onSuggestionClick?: () => void;
}

const heroImages = [
  {
    url: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    title: "Sea View Zen Loft",
    location: "Bandra West"
  },
  {
    url: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    title: "Heritage Garden Cottage",
    location: "Colaba"
  },
  {
    url: "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    title: "Minimalist Sky Suite",
    location: "Lower Parel"
  },
  {
    url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    title: "Penthouse Sky Lounge",
    location: "Worli"
  }
];

const Hero: React.FC<HeroProps> = ({ onSuggestionClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white max-w-5xl mx-auto px-4">
          <div className={`transform transition-all duration-1000 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            {/* Main Heading - Inspired by "Deserves a great night" */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-white mb-6 leading-tight">
              <span className="block text-white/90">Deserves</span>
              <span className="block font-normal italic text-white/80">a perfect stay</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/80 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
              Luxuriously curated stays in Mumbai's most sought-after neighborhoods
            </p>

            {/* Elegant Search Widget */}
            <div className={`mb-12 transform transition-all duration-1000 ease-out delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}>
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 max-w-2xl mx-auto shadow-2xl">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 flex items-center gap-3 text-gray-700">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Where would you like to stay?"
                      className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-lg"
                    />
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Check dates</span>
                  </div>
                  <button 
                    onClick={onSuggestionClick}
                    className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors duration-300"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Property Preview Info */}
            <div className={`transform transition-all duration-1000 ease-out delay-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
                <MapPin className="w-4 h-4 text-white/80" />
                <span className="text-white/80 text-sm font-light">
                  Now showing: {heroImages[currentImageIndex].title}, {heroImages[currentImageIndex].location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant Navigation Dots */}
      <div className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <div className="flex gap-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`absolute bottom-8 right-8 transition-all duration-1000 delay-1200 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <div className="flex flex-col items-center text-white/60">
          <span className="text-sm mb-2 writing-mode-vertical-rl font-light">Scroll to explore</span>
          <div className="w-px h-12 bg-white/30 relative">
            <div className="w-px h-6 bg-white/60 absolute top-0 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;