import React, { useState } from 'react';
import { Shield, AlertTriangle, Camera, Lock, Wifi, Phone, ChevronDown, ChevronUp } from 'lucide-react';

interface SafetyFeature {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  status: 'available' | 'not_available' | 'partial';
  description?: string;
}

interface SafetyFeaturesProps {
  className?: string;
}

const safetyFeatures: SafetyFeature[] = [
  {
    id: 'smoke_detector',
    name: 'Smoke detector',
    icon: Shield,
    status: 'available',
    description: 'Smoke detectors are installed in all bedrooms and common areas'
  },
  {
    id: 'carbon_monoxide',
    name: 'Carbon monoxide detector',
    icon: AlertTriangle,
    status: 'available',
    description: 'CO detectors are installed near gas appliances'
  },
  {
    id: 'fire_extinguisher',
    name: 'Fire extinguisher',
    icon: Shield,
    status: 'available',
    description: 'Fire extinguisher available in kitchen area'
  },
  {
    id: 'first_aid',
    name: 'First aid kit',
    icon: Shield,
    status: 'available',
    description: 'Basic first aid supplies available'
  },
  {
    id: 'security_cameras',
    name: 'Security cameras',
    icon: Camera,
    status: 'partial',
    description: 'Exterior security cameras (no interior cameras)'
  },
  {
    id: 'lockbox',
    name: 'Lockbox',
    icon: Lock,
    status: 'available',
    description: 'Secure lockbox for contactless check-in'
  },
  {
    id: 'wifi',
    name: 'WiFi',
    icon: Wifi,
    status: 'available',
    description: 'High-speed internet available throughout property'
  },
  {
    id: 'emergency_contact',
    name: '24/7 emergency contact',
    icon: Phone,
    status: 'available',
    description: 'Host available for emergencies at any time'
  }
];

const thingsToKnow = {
  houseRules: [
    'Check-in: 2:00 PM - 10:00 PM',
    'Check-out: 11:00 AM',
    'No smoking',
    'No pets',
    'No parties or events',
    'Quiet hours: 10:00 PM - 8:00 AM'
  ],
  safetyProperty: [
    'Must climb stairs',
    'Exterior security cameras',
    'Potential for noise',
    'Carbon monoxide detector not required by law but installed'
  ],
  cancellationPolicy: [
    'Free cancellation for 48 hours',
    'Cancel before 2:00 PM on Jan 15 for a partial refund',
    'After that, cancel before check-in and get a 50% refund, minus the service fee'
  ]
};

const SafetyFeatures: React.FC<SafetyFeaturesProps> = ({ className = '' }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600';
      case 'partial':
        return 'text-yellow-600';
      case 'not_available':
        return 'text-gray-400';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return '✓';
      case 'partial':
        return '⚠';
      case 'not_available':
        return '✗';
      default:
        return '';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Safety Features */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Safety features</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safetyFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-lg bg-gray-100 ${getStatusColor(feature.status)}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{feature.name}</span>
                    <span className={`text-sm ${getStatusColor(feature.status)}`}>
                      {getStatusIcon(feature.status)}
                    </span>
                  </div>
                  {feature.description && (
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Things to Know */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Things to know</h3>
        
        <div className="space-y-4">
          {/* House Rules */}
          <div className="border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleSection('houseRules')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900">House rules</span>
              {expandedSection === 'houseRules' ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSection === 'houseRules' && (
              <div className="mt-3 space-y-2">
                {thingsToKnow.houseRules.map((rule, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    • {rule}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Safety & Property */}
          <div className="border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleSection('safety')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900">Safety & property</span>
              {expandedSection === 'safety' ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSection === 'safety' && (
              <div className="mt-3 space-y-2">
                {thingsToKnow.safetyProperty.map((item, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    • {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cancellation Policy */}
          <div className="pb-4">
            <button
              onClick={() => toggleSection('cancellation')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900">Cancellation policy</span>
              {expandedSection === 'cancellation' ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSection === 'cancellation' && (
              <div className="mt-3 space-y-2">
                {thingsToKnow.cancellationPolicy.map((policy, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    • {policy}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyFeatures; 