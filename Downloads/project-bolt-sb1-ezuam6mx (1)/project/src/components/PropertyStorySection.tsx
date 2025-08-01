import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Quote } from 'lucide-react';

interface PropertyStorySectionProps {
  onPropertySelect?: (propertyId: number) => void;
}

const stories = [
  {
    id: 1,
    title: "Art Meets Soul",
    subtitle: "Where contemporary design meets Mumbai's cultural heart",
    description: "Step into spaces where every corner tells a story of artistic expression and cultural richness.",
    image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    backgroundImage: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    quote: "Every piece of art in our spaces has been carefully chosen to reflect Mumbai's vibrant creative spirit."
  },
  {
    id: 2,
    title: "Heritage Reimagined",
    subtitle: "Colonial charm with modern luxury",
    description: "Experience the perfect blend of Mumbai's rich history and contemporary comfort in thoughtfully restored spaces.",
    image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    backgroundImage: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    quote: "We preserve the architectural heritage while creating modern sanctuaries for today's travelers."
  },
  {
    id: 3,
    title: "Urban Sanctuary",
    subtitle: "Zen in the heart of the city",
    description: "Find peace and tranquility in thoughtfully designed urban retreats that offer respite from city life.",
    image: "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    backgroundImage: "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    quote: "Our spaces are designed to be havens of calm in the bustling energy of Mumbai."
  }
];

const PropertyStorySection: React.FC<PropertyStorySectionProps> = ({ onPropertySelect }) => {
  const [currentStory, setCurrentStory] = useState(0);
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

  // Auto-rotate stories
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % stories.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Background Images */}
      <div className="absolute inset-0">
        {stories.map((story, index) => (
          <div
            key={story.id}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentStory ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={story.backgroundImage}
              alt={story.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-white/85 backdrop-blur-sm"></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-20 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 leading-tight">
            <span className="block text-gray-800">Every stay</span>
            <span className="block text-gray-600 font-normal italic">tells a story</span>
          </h2>
          <div className="w-24 h-px bg-gray-400 mx-auto mb-8"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Discover the unique narrative behind each of our carefully curated properties
          </p>
        </div>

        {/* Current Story Display */}
        <div className={`transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Story Image */}
            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden group shadow-2xl">
                <img
                  src={stories[currentStory].image}
                  alt={stories[currentStory].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:bg-black/5"></div>
              </div>
            </div>

            {/* Story Content */}
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 leading-tight">
                  {stories[currentStory].title}
                </h3>
                <p className="text-xl text-gray-700 font-light mb-6">
                  {stories[currentStory].subtitle}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {stories[currentStory].description}
                </p>
              </div>

              {/* Quote */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
                <Quote className="w-8 h-8 text-gray-400 mb-4" />
                <p className="text-gray-800 italic text-lg leading-relaxed">
                  {stories[currentStory].quote}
                </p>
              </div>

              {/* Story Navigation */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 font-medium">
                  {String(currentStory + 1).padStart(2, '0')} / {String(stories.length).padStart(2, '0')}
                </span>
                <div className="flex gap-2">
                  {stories.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStory(index)}
                      className={`w-12 h-1 rounded-full transition-all duration-300 ${
                        index === currentStory
                          ? 'bg-gray-900'
                          : 'bg-gray-400 hover:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => onPropertySelect?.(stories[currentStory].id)}
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 hover:gap-3 shadow-lg hover:shadow-xl"
              >
                <span>Explore this story</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Story Grid - Show all stories */}
        <div className={`mt-24 transform transition-all duration-1000 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="grid md:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <button
                key={story.id}
                onClick={() => setCurrentStory(index)}
                className={`text-left group transition-all duration-300 ${
                  index === currentStory ? 'opacity-100' : 'opacity-80 hover:opacity-100'
                }`}
              >
                <div className="relative h-48 rounded-xl overflow-hidden mb-4 shadow-lg">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-opacity duration-300"></div>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">{story.title}</h4>
                <p className="text-sm text-gray-700">{story.subtitle}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyStorySection; 