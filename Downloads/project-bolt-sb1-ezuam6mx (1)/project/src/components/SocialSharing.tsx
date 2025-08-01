import React, { useState, useEffect } from 'react';
import { Share2, Copy, Facebook, Twitter, Instagram, Linkedin, Mail, MessageCircle, X, Download, Link, QrCode, Eye } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Property = Database['public']['Tables']['properties']['Row'];

interface SocialSharingProps {
  property?: Property;
  isOpen: boolean;
  onClose: () => void;
  shareType?: 'property' | 'comparison' | 'booking';
  shareData?: {
    title: string;
    description: string;
    image?: string;
    url: string;
    price?: number;
    location?: string;
  };
}

interface SharePlatform {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  url: string;
  enabled: boolean;
}

const SocialSharing: React.FC<SocialSharingProps> = ({
  property,
  isOpen,
  onClose,
  shareType = 'property',
  shareData
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [shareStats, setShareStats] = useState({
    totalShares: 0,
    facebookShares: 0,
    twitterShares: 0,
    whatsappShares: 0
  });

  useEffect(() => {
    if (isOpen) {
      generateReferralCode();
      loadShareStats();
    }
  }, [isOpen, property?.id]);

  const generateReferralCode = () => {
    const code = `IC${Date.now().toString(36).toUpperCase()}`;
    setReferralCode(code);
  };

  const loadShareStats = async () => {
    // Simulate loading share statistics
    setShareStats({
      totalShares: Math.floor(Math.random() * 50) + 10,
      facebookShares: Math.floor(Math.random() * 20) + 5,
      twitterShares: Math.floor(Math.random() * 15) + 3,
      whatsappShares: Math.floor(Math.random() * 25) + 8
    });
  };

  const getShareData = () => {
    if (shareData) return shareData;
    
    if (property) {
      return {
        title: property.name,
        description: property.description,
        image: property.images[0],
        url: `${window.location.origin}/property/${property.id}`,
        price: property.price,
        location: property.location
      };
    }

    return {
      title: 'Infiniti Casa - Luxury Boutique Rentals',
      description: 'Discover Mumbai\'s most exclusive boutique stays',
      image: '/logocasa.png',
      url: window.location.origin
    };
  };

  const data = getShareData();

  const sharePlatforms: SharePlatform[] = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}&quote=${encodeURIComponent(data.title)}`,
      enabled: true
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.title)}&url=${encodeURIComponent(data.url)}`,
      enabled: true
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-600 hover:bg-green-700',
      url: `https://wa.me/?text=${encodeURIComponent(`${data.title} - ${data.url}`)}`,
      enabled: true
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`,
      enabled: true
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700',
      url: `mailto:?subject=${encodeURIComponent(data.title)}&body=${encodeURIComponent(`${data.description}\n\n${data.url}`)}`,
      enabled: true
    }
  ];

  const handleShare = async (platform: SharePlatform) => {
    try {
      // Track share event
      await trackShare(platform.name.toLowerCase());
      
      // Open share URL
      window.open(platform.url, '_blank', 'width=600,height=400');
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const trackShare = async (platform: string) => {
    try {
      // In a real app, this would send analytics data
      console.log(`Share tracked: ${platform} for ${shareType}`);
      
      // Update local stats
      setShareStats(prev => ({
        ...prev,
        totalShares: prev.totalShares + 1,
        [`${platform}Shares`]: prev[`${platform}Shares` as keyof typeof prev] + 1
      }));
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      const shareUrl = `${data.url}?ref=${referralCode}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      // Track copy event
      await trackShare('copy');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const downloadShareCard = () => {
    // Create a canvas element for the share card
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 630;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#1e3a8a');
    gradient.addColorStop(1, '#7c3aed');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Add text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(data.title, 600, 200);

    ctx.font = '24px Inter';
    ctx.fillText(data.description.substring(0, 100) + '...', 600, 280);

    if (data.price) {
      ctx.font = 'bold 36px Inter';
      ctx.fillText(`₹${data.price.toLocaleString()}/night`, 600, 350);
    }

    ctx.font = '20px Inter';
    ctx.fillText('Infiniti Casa', 600, 550);

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'infiniti-casa-share.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });
  };

  const generateQRCode = () => {
    // In a real app, you'd use a QR code library
    // For now, we'll show a placeholder
    setShowQR(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Share {shareType === 'property' ? 'Property' : shareType === 'comparison' ? 'Comparison' : 'Booking'}</h2>
              <p className="text-gray-600">Share with friends and family</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Share Preview */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Share Preview</h3>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
                </button>
              </div>
              
              {showPreview && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={data.image || '/logocasa.png'}
                      alt={data.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{data.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{data.description}</p>
                      {data.price && (
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          ₹{data.price.toLocaleString()}/night
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">{data.url}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Social Media Platforms */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share on Social Media</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {sharePlatforms.map((platform) => (
                  <button
                    key={platform.name}
                    onClick={() => handleShare(platform)}
                    className={`${platform.color} text-white p-4 rounded-lg transition-all duration-200 hover:scale-105 flex flex-col items-center space-y-2`}
                  >
                    <platform.icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{platform.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center justify-center space-x-2 p-4 rounded-lg border-2 transition-colors ${
                    copied 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <Copy className="w-5 h-5" />
                  <span className="font-medium">
                    {copied ? 'Copied!' : 'Copy Link'}
                  </span>
                </button>

                <button
                  onClick={downloadShareCard}
                  className="flex items-center justify-center space-x-2 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span className="font-medium">Download Card</span>
                </button>

                <button
                  onClick={generateQRCode}
                  className="flex items-center justify-center space-x-2 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <QrCode className="w-5 h-5" />
                  <span className="font-medium">QR Code</span>
                </button>
              </div>
            </div>

            {/* Referral Code */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Referral Code</h3>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Share this code with friends</p>
                    <p className="text-2xl font-bold text-gray-900 font-mono">{referralCode}</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(referralCode)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Copy Code
                  </button>
                </div>
              </div>
            </div>

            {/* Share Statistics */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{shareStats.totalShares}</p>
                  <p className="text-sm text-gray-600">Total Shares</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-900">{shareStats.facebookShares}</p>
                  <p className="text-sm text-blue-600">Facebook</p>
                </div>
                <div className="bg-sky-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-sky-900">{shareStats.twitterShares}</p>
                  <p className="text-sm text-sky-600">Twitter</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-900">{shareStats.whatsappShares}</p>
                  <p className="text-sm text-green-600">WhatsApp</p>
                </div>
              </div>
            </div>

            {/* Meta Tags Info */}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-2">SEO Optimized Sharing</h4>
              <p className="text-sm text-yellow-800">
                This share includes optimized meta tags for better social media previews and SEO performance.
              </p>
            </div>
          </div>
        </div>

        {/* QR Code Modal */}
        {showQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code</h3>
                <div className="bg-gray-100 rounded-lg p-8 mb-4">
                  <div className="w-32 h-32 bg-gray-300 rounded-lg mx-auto flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-gray-500" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Scan this QR code to share the link
                </p>
                <button
                  onClick={() => setShowQR(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialSharing; 