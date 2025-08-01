import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface PhoneAuthProps {
  onSuccess?: (user: any) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

const countryCodes = [
  { code: '+91', country: 'IN', name: 'India' },
  { code: '+1', country: 'US', name: 'United States' },
  { code: '+44', country: 'GB', name: 'United Kingdom' },
  { code: '+61', country: 'AU', name: 'Australia' },
  { code: '+971', country: 'AE', name: 'UAE' },
  { code: '+65', country: 'SG', name: 'Singapore' },
  { code: '+86', country: 'CN', name: 'China' },
  { code: '+81', country: 'JP', name: 'Japan' },
];

const PhoneAuth: React.FC<PhoneAuthProps> = ({ onSuccess, onClose, isOpen = false }) => {
  const { generateOTP, verifyOTP, resendOTP, loading, error } = useAuth();
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;

    const fullPhone = `${selectedCountry.code}${phone}`;
    const success = await generateOTP(fullPhone);
    
    if (success) {
      setOtpSent(true);
      setStep('otp');
      setCountdown(60); // 60 seconds countdown
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return;

    const fullPhone = `${selectedCountry.code}${phone}`;
    const result = await verifyOTP(fullPhone, otp);
    
    if (result.success) {
      onSuccess?.(result);
    }
  };

  const handleResendOTP = async () => {
    const fullPhone = `${selectedCountry.code}${phone}`;
    const success = await resendOTP(fullPhone);
    
    if (success) {
      setCountdown(60);
    }
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('phone');
      setOtp('');
      setOtpSent(false);
      setCountdown(0);
    } else {
      onClose?.();
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format based on length
    if (digits.length <= 5) {
      return digits;
    } else if (digits.length <= 10) {
      return `${digits.slice(0, 5)} ${digits.slice(5)}`;
    } else {
      return `${digits.slice(0, 5)} ${digits.slice(5, 10)}`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            {step === 'phone' ? 'Sign in with Phone' : 'Verify OTP'}
          </h2>
          <div className="w-9" /> {/* Spacer */}
        </div>

        {/* Phone Step */}
        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              
              {/* Country Code Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCountrySelector(!showCountrySelector)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <span className="text-sm font-medium">{selectedCountry.code}</span>
                  <span className="text-xs">▼</span>
                </button>
                
                <input
                  type="tel"
                  value={formatPhoneNumber(phone)}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter your phone number"
                  className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust-500 focus:border-transparent"
                  maxLength={12}
                />
              </div>

              {/* Country Dropdown */}
              {showCountrySelector && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {countryCodes.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => {
                        setSelectedCountry(country);
                        setShowCountrySelector(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                    >
                      <span className="text-sm font-medium">{country.code}</span>
                      <span className="text-sm text-gray-600">{country.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!phone || phone.length < 10 || loading}
              className="w-full bg-rust-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-rust-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <MessageCircle className="w-5 h-5" />
                  <span>Send OTP via WhatsApp</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              We'll send a verification code to your WhatsApp
            </p>
          </form>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <form onSubmit={handleOTPSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Enter the 6-digit code sent to<br />
                  <span className="font-medium">{selectedCountry.code} {phone}</span>
                </p>
                
                <div className="flex justify-center space-x-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={otp[index] || ''}
                                             onChange={(e) => {
                         const newOtp = otp.split('');
                         newOtp[index] = e.target.value;
                         setOtp(newOtp.join(''));
                         
                         // Auto-focus next input
                         if (e.target.value && index < 5) {
                           const nextInput = (e.target as HTMLInputElement).parentElement?.nextElementSibling?.querySelector('input') as HTMLInputElement;
                           nextInput?.focus();
                         }
                       }}
                       onKeyDown={(e) => {
                         if (e.key === 'Backspace' && !otp[index] && index > 0) {
                           const prevInput = (e.target as HTMLInputElement).parentElement?.previousElementSibling?.querySelector('input') as HTMLInputElement;
                           prevInput?.focus();
                         }
                       }}
                      className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust-500 focus:border-transparent text-lg font-medium"
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={otp.length !== 6 || loading}
              className="w-full bg-rust-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-rust-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Verify & Continue</span>
                </>
              )}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend code in {countdown}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-sm text-rust-500 hover:text-rust-600 font-medium"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {otpSent && step === 'otp' && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-700">OTP sent successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneAuth; 