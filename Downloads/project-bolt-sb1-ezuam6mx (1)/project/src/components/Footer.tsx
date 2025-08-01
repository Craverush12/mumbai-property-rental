import React from 'react';
import { MapPin, Phone, Mail, MessageCircle, Instagram, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Our Story', href: '#story' },
      { name: 'Careers', href: '#careers' },
      { name: 'Press', href: '#press' }
    ],
    properties: [
      { name: 'All Properties', href: '#properties' },
      { name: 'Bandra West', href: '#bandra' },
      { name: 'Colaba', href: '#colaba' },
      { name: 'Lower Parel', href: '#parel' }
    ],
    support: [
      { name: 'Help Center', href: '#help' },
      { name: 'Contact Us', href: '#contact' },
      { name: 'Safety', href: '#safety' },
      { name: 'Cancellation', href: '#cancellation' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'Accessibility', href: '#accessibility' }
    ]
  };

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/infiniticasa' },
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/infiniticasa' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/infiniticasa' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/infiniticasa' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-light text-white mb-4">Infiniti Casa</h3>
              <p className="text-white/70 leading-relaxed mb-6">
                Curated luxury stays in Mumbai's most desirable neighborhoods. Experience the perfect blend of heritage charm and modern comfort.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-white/70">
                <MapPin className="w-4 h-4 mr-3 text-rust-400" />
                <span>Bandra West, Mumbai, Maharashtra</span>
              </div>
              <div className="flex items-center text-white/70">
                <Phone className="w-4 h-4 mr-3 text-rust-400" />
                <span>+91-98765-43210</span>
              </div>
              <div className="flex items-center text-white/70">
                <Mail className="w-4 h-4 mr-3 text-rust-400" />
                <span>hello@infiniti-casa.com</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h4 className="text-lg font-medium text-white mb-3">Stay Updated</h4>
              <p className="text-white/70 text-sm mb-4">Get exclusive offers and property updates</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-rust-400 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-rust-500 text-white rounded-r-lg hover:bg-rust-600 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Properties Links */}
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Properties</h4>
            <ul className="space-y-3">
              {footerLinks.properties.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-white/20 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5 text-white" />
                </a>
              ))}
            </div>

            <div className="flex space-x-6">
              {footerLinks.legal.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white/50 hover:text-white/70 transition-colors text-sm"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/50 text-sm mb-2 md:mb-0">
              © {currentYear} Infiniti Casa. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-white/50 text-sm">
              <span>Made with ❤️ in Mumbai</span>
              <span>•</span>
              <span>Luxury Redefined</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 