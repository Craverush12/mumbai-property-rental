import React, { useState, useEffect } from 'react';
import { ChevronUp, ArrowUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-white rounded-full shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300 transform hover:scale-110 active:scale-95 touch-manipulation group relative ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-16 opacity-0 scale-75'
      }`}
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 mx-auto transition-transform duration-300 group-hover:-translate-y-0.5" />
      
      {/* Tooltip */}
      <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="backdrop-blur-xl bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Back to top
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-t-4 border-t-black/80 border-l-2 border-l-transparent border-r-2 border-r-transparent"></div>
      </div>

      {/* Mobile Pulse Effect */}
      <div className="lg:hidden absolute inset-0 rounded-full bg-gold-400/30 animate-ping"></div>
    </button>
  );
};

export default ScrollToTop;