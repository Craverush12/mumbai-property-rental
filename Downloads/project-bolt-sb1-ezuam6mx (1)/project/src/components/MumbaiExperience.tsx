import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

const MumbaiExperience: React.FC = () => {
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

  const experiences = [
    {
      title: "Bandra West",
      subtitle: "Where creativity meets the sea",
      image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      description: "Mumbai's artistic heart, where street art galleries and seaside cafes create the perfect backdrop for your stay.",
      features: ["Art Districts", "Seaside Promenades", "Cultural Cafes"]
    },
    {
      title: "Colaba", 
      subtitle: "Historic charm meets modern luxury",
      image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      description: "Heritage architecture and colonial grandeur in Mumbai's most prestigious neighborhood.",
      features: ["Heritage Buildings", "Gateway of India", "Luxury Shopping"]
    },
    {
      title: "Lower Parel",
      subtitle: "Mumbai's modern business district",
      image: "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      description: "Sky-high living with panoramic city views and world-class dining experiences.",
      features: ["Business Hub", "Fine Dining", "City Skyline"]
    }
  ];

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
            <span className="block text-gray-800">Experience</span>
            <span className="block text-gray-600 font-normal italic">Mumbai's finest neighborhoods</span>
          </h2>
          <div className="w-24 h-px bg-gray-300 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Each location offers a unique perspective on Mumbai living, from heritage charm to modern luxury
          </p>
        </div>

        {/* Experiences Grid */}
        <div className="space-y-20">
          {experiences.map((experience, index) => (
            <div 
              key={index}
              className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center transform transition-all duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              } ${index % 2 === 1 ? 'lg:grid-flow-row-dense' : ''}`}
              style={{ transitionDelay: `${index * 300}ms` }}
            >
              {/* Image */}
              <div className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="relative h-96 rounded-2xl overflow-hidden group">
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/10"></div>
                </div>
              </div>

              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600 font-medium">{experience.title}</span>
                </div>

                <div>
                  <h3 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 leading-tight">
                    {experience.subtitle}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {experience.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 mb-8">
                  {experience.features.map((feature, featureIndex) => (
                    <span 
                      key={featureIndex}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <button className="inline-flex items-center gap-2 text-gray-900 font-medium hover:gap-3 transition-all duration-300">
                  <span>Explore {experience.title}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className={`mt-24 text-center transform transition-all duration-1000 delay-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-600 leading-relaxed mb-8 italic">
              "Each neighborhood tells a different story of Mumbai—from the artistic soul of Bandra 
              to the colonial grandeur of Colaba. Every stay connects you to the authentic spirit of this magnificent city."
            </p>
            <div className="w-32 h-px bg-gray-300 mx-auto mb-8"></div>
            <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors duration-300">
              View All Locations
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MumbaiExperience;