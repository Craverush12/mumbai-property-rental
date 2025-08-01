import React, { useState, useEffect } from 'react';
import { Quote, Users, Compass, Sparkles, ArrowRight } from 'lucide-react';

const MumbaiPhilosophy: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activePhilosophy, setActivePhilosophy] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('about');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const philosophies = [
    {
      title: "Cultural Immersion",
      icon: Compass,
      description: "Every property connects you to Mumbai's authentic cultural heartbeat",
      image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      details: "From art galleries in Bandra to heritage walks in Colaba, experience Mumbai like a local."
    },
    {
      title: "Curated Experiences",
      icon: Sparkles,
      description: "Handpicked properties that tell Mumbai's diverse neighborhood stories",
      image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      details: "Each space is carefully selected for its unique character and connection to local culture."
    },
    {
      title: "Community Connection",
      icon: Users,
      description: "Building bridges between travelers and Mumbai's vibrant communities",
      image: "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      details: "Meet local artists, taste authentic cuisine, and discover hidden neighborhood gems."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhilosophy((prev) => (prev + 1) % philosophies.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="py-16 sm:py-24 bg-gradient-to-br from-warm-gray-50 via-blue-50 to-purple-50 overflow-hidden relative">
      {/* Glassmorphic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-gold-400/10 to-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-12 sm:mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-4 sm:mb-6 tracking-wide">
            Our Mumbai Philosophy
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-light">
            More than accommodation—we create authentic connections to Mumbai's soul
          </p>
        </div>

        {/* Interactive Philosophy Cards */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 sm:mb-16">
          {/* Philosophy Navigation */}
          <div className={`space-y-4 sm:space-y-6 transform transition-all duration-1000 delay-200 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
          }`}>
            {philosophies.map((philosophy, index) => (
              <div
                key={index}
                onClick={() => setActivePhilosophy(index)}
                className={`p-4 sm:p-6 rounded-2xl cursor-pointer transition-all duration-500 transform hover:scale-105 backdrop-blur-xl border ${
                  activePhilosophy === index
                    ? 'bg-white/80 shadow-2xl border-gold-200 border-l-4 border-l-gold-500'
                    : 'bg-white/40 hover:bg-white/60 hover:shadow-xl border-white/30'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-colors duration-300 backdrop-blur-sm ${
                    activePhilosophy === index
                      ? 'bg-gold-500 text-white shadow-lg'
                      : 'bg-white/50 text-gray-600 border border-white/50'
                  }`}>
                    <philosophy.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg sm:text-xl font-medium mb-2 transition-colors duration-300 ${
                      activePhilosophy === index ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {philosophy.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base font-light leading-relaxed">
                      {philosophy.description}
                    </p>
                    {activePhilosophy === index && (
                      <div className="mt-3 pt-3 border-t border-gray-200/50">
                        <p className="text-gray-700 text-sm font-light leading-relaxed">
                          {philosophy.details}
                        </p>
                      </div>
                    )}
                  </div>
                  {activePhilosophy === index && (
                    <ArrowRight className="w-5 h-5 text-gold-500 animate-pulse" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Philosophy Image */}
          <div className={`relative transform transition-all duration-1000 delay-400 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
          }`}>
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden backdrop-blur-sm bg-white/10 border border-white/20">
              {philosophies.map((philosophy, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ${
                    activePhilosophy === index
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-105'
                  }`}
                >
                  <img
                    src={philosophy.image}
                    alt={philosophy.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              ))}
              
              {/* Glassmorphic Floating Quote */}
              <div className="absolute bottom-6 left-6 right-6 backdrop-blur-xl bg-white/90 rounded-2xl p-4 sm:p-6 border border-white/50">
                <Quote className="w-6 h-6 text-gold-500 mb-2" />
                <p className="text-gray-800 font-light italic text-sm sm:text-base leading-relaxed">
                  "Mumbai isn't just a destination—it's a feeling, a rhythm, a way of life. 
                  We don't just offer places to stay; we offer keys to the city's soul."
                </p>
                <div className="mt-3 pt-3 border-t border-gray-200/50">
                  <p className="text-gray-600 text-xs sm:text-sm font-medium">
                    — Infiniti Casa Philosophy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Glassmorphic Values Section */}
        <div className={`transform transition-all duration-1000 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="backdrop-blur-xl bg-white/30 rounded-3xl p-8 sm:p-12 border border-white/40">
            <h3 className="text-2xl sm:text-3xl font-light text-gray-900 mb-8 text-center">
              Our Core Values
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  title: "Authenticity",
                  description: "Every property reflects genuine Mumbai character",
                  gradient: "from-purple-500/20 to-pink-500/20"
                },
                {
                  title: "Quality",
                  description: "Luxury meets comfort in every detail",
                  gradient: "from-blue-500/20 to-cyan-500/20"
                },
                {
                  title: "Connection",
                  description: "Building bridges between cultures and communities",
                  gradient: "from-green-500/20 to-emerald-500/20"
                }
              ].map((value, index) => (
                <div
                  key={index}
                  className="group text-center"
                >
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${value.gradient} backdrop-blur-sm rounded-full mb-4 sm:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 border border-white/30`} />
                  <h4 className="text-lg sm:text-xl font-medium text-gray-900 mb-2 sm:mb-3">
                    {value.title}
                  </h4>
                  <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MumbaiPhilosophy;