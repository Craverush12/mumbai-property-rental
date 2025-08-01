import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Star, MapPin, Calendar } from 'lucide-react';

interface Experience {
  id: number;
  image: string;
  title: string;
  description: string;
  location: string;
  highlight: string;
  stats: string;
}

const experiences: Experience[] = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    title: "Artistic Immersion",
    description: "Live surrounded by Mumbai's vibrant art scene in galleries and creative spaces",
    location: "Bandra West",
    highlight: "Gallery Districts",
    stats: "15+ Art Galleries"
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    title: "Cultural Heritage",
    description: "Experience Mumbai's rich colonial history and architectural marvels",
    location: "Colaba",
    highlight: "Historic Neighborhoods",
    stats: "200+ Years Old"
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    title: "Urban Wellness",
    description: "Find tranquility in the heart of the city with zen spaces and wellness centers",
    location: "Lower Parel",
    highlight: "Zen Spaces",
    stats: "10+ Wellness Centers"
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    title: "Seaside Luxury",
    description: "Wake up to breathtaking ocean views and coastal experiences",
    location: "Worli",
    highlight: "Waterfront Living",
    stats: "2km Beach Access"
  }
];

const UserGuidanceSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
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

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
        setScrollY(scrollProgress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="py-32 bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-20 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-6xl md:text-7xl font-light text-white mb-8 leading-tight">
            <span className="block opacity-90">Experience</span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mumbai
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the soul of Mumbai through curated experiences
          </p>
        </div>

        {/* Overlapping Cards Layout */}
        <div className="relative">
          {experiences.map((experience, index) => {
            const offset = index * 100;
            const parallaxOffset = scrollY * 50 * (index + 1);
            const scale = 1 - (scrollY * 0.1 * index);
            
            return (
              <div
                key={experience.id}
                className={`relative mb-16 transform transition-all duration-1000 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                }`}
                style={{ 
                  transitionDelay: `${index * 200}ms`,
                  transform: `translateY(${offset - parallaxOffset}px) scale(${scale})`,
                  zIndex: experiences.length - index
                }}
              >
                <div className={`relative h-80 rounded-3xl overflow-hidden ${
                  index % 2 === 0 ? 'ml-0 mr-auto max-w-5xl' : 'ml-auto mr-0 max-w-5xl'
                }`}>
                  {/* Background Image */}
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex items-center">
                    <div className={`p-12 text-white max-w-2xl ${
                      index % 2 === 0 ? 'text-left' : 'text-right ml-auto'
                    }`}>
                      {/* Stats Badge */}
                      <div className={`inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 ${
                        index % 2 === 0 ? '' : 'ml-auto'
                      }`}>
                        {experience.stats}
                      </div>
                      
                      <h3 className="text-4xl md:text-5xl font-light mb-4 leading-tight">
                        {experience.title}
                      </h3>
                      
                      <p className="text-lg text-white/90 mb-6 leading-relaxed">
                        {experience.description}
                      </p>
                      
                      <div className={`flex items-center gap-4 mb-8 ${
                        index % 2 === 0 ? '' : 'justify-end'
                      }`}>
                        <div className="flex items-center gap-2 text-white/80">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{experience.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-white/80">4.9</span>
                        </div>
                      </div>
                      
                      <button className="group bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-3">
                        <span>Explore {experience.highlight}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className={`absolute top-8 ${
                    index % 2 === 0 ? 'right-8' : 'left-8'
                  }`}>
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className={`text-center mt-32 transform transition-all duration-1000 delay-800 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">8</div>
              <div className="text-gray-400">Unique Locations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400">Cultural Experiences</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">4.9★</div>
              <div className="text-gray-400">Experience Rating</div>
            </div>
          </div>
          
          <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-5 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-3 mx-auto">
            <Calendar className="w-6 h-6" />
            <span>Start Your Mumbai Journey</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserGuidanceSection; 