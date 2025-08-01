import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const carouselImages = [
  // Use property or Mumbai images
  "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);

  const loadingTexts = [
    "Curating Mumbai's finest properties...",
    "Preparing your luxury experience...",
    "Almost ready to explore..."
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const textInterval = setInterval(() => {
      setCurrentText(prev => (prev + 1) % loadingTexts.length);
      setCurrentImage(prev => (prev + 1) % carouselImages.length);
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Carousel Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {carouselImages.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt="Mumbai property"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              idx === currentImage ? 'opacity-100 z-0' : 'opacity-0 z-0'
            }`}
            style={{ transitionProperty: 'opacity' }}
          />
        ))}
        {/* Optional: subtle dark overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 text-center text-white max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-editorial font-light tracking-editorial mb-2">
            Mumbai
            <span className="block text-rust-300 font-light">Stays</span>
          </h1>
          <div className="flex items-center justify-center mt-4">
            <MapPin className="w-6 h-6 text-rust-300 animate-pulse mr-2" />
            <span className="text-rust-300 font-body font-light tracking-wide">Boutique Collection</span>
            <MapPin className="w-6 h-6 text-rust-300 animate-pulse ml-2" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-rust-400 to-coral-400 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Loading Text */}
        <p className="text-white/80 font-body font-light text-lg transition-all duration-500">
          {loadingTexts[currentText]}
        </p>

        {/* Percentage */}
        <p className="text-rust-300 font-body font-medium mt-4 text-xl">
          {progress}%
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;