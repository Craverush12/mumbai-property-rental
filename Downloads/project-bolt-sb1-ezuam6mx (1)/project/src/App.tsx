import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import PropertyGrid from './components/PropertyGrid';
import PropertyDetail from './components/PropertyDetail';
import PropertySuggestion from './components/PropertySuggestion';
import VisualStoriesSection from './components/VisualStoriesSection';
import PropertyStorySection from './components/PropertyStorySection';
import MumbaiGuidePreview from './components/MumbaiGuidePreview';
import ContactSection from './components/ContactSection';
import LoadingScreen from './components/LoadingScreen';
import ScrollToTop from './components/ScrollToTop';
import QuickActions from './components/QuickActions';
import NewsletterSignup from './components/NewsletterSignup';
import UserGuidanceSection from './components/UserGuidanceSection';
import TestimonialsSection from './components/TestimonialsSection';
import InstagramTestimonials from './components/InstagramTestimonials';
import LongTermBookingSection from './components/LongTermBookingSection';
import FeaturesShowcase from './components/FeaturesShowcase';
import PhoneAuth from './components/PhoneAuth';
import BookingConfirmation from './components/BookingConfirmation';
import UserBookings from './components/UserBookings';
import UserProfileComponent from './components/UserProfile';
import PropertySearch from './components/PropertySearch';
import PropertyComparison from './components/PropertyComparison';
import SocialSharing from './components/SocialSharing';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

import { useAuth } from './hooks/useAuth';
import type { Database } from './lib/database.types';
import PWAService from './services/pwaService';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

function App() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'property' | 'booking-confirmation' | 'user-bookings' | 'user-profile'>('home');
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonProperties, setComparisonProperties] = useState<number[]>([]);
  const [showSocialSharing, setShowSocialSharing] = useState(false);
  const [socialSharingData, setSocialSharingData] = useState<any>(null);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showDatabaseTest, setShowDatabaseTest] = useState(false); // Database test completed

  // Show newsletter popup after 45 seconds on first visit
  useEffect(() => {
    const hasSeenNewsletter = localStorage.getItem('hasSeenNewsletter');
    if (!hasSeenNewsletter && !isLoading && !authLoading) {
      const timer = setTimeout(() => {
        setShowNewsletter(true);
        localStorage.setItem('hasSeenNewsletter', 'true');
      }, 45000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, authLoading]);

  // Show auth modal for new users after 10 seconds
  useEffect(() => {
    if (!isLoading && !authLoading && !isAuthenticated) {
      const hasSeenAuth = localStorage.getItem('hasSeenAuth');
      if (!hasSeenAuth) {
        const timer = setTimeout(() => {
          setShowAuth(true);
          localStorage.setItem('hasSeenAuth', 'true');
        }, 10000);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, authLoading, isAuthenticated]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handlePropertySelect = (propertyId: number) => {
    setSelectedProperty(propertyId);
    setCurrentView('property');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedProperty(null);
  };

  const handleSuggestionClick = () => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    setShowSuggestion(true);
  };

  const handleCloseSuggestion = () => {
    setShowSuggestion(false);
  };

  const handleContactClick = () => {
    document.getElementById('contact')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleAuthSuccess = (result: { user: UserProfile; isNewUser: boolean }) => {
    setShowAuth(false);
    if (result.isNewUser) {
      // Show welcome message or onboarding
      console.log('Welcome new user!', result.user);
    }
  };

  const handleBookingSuccess = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setCurrentView('booking-confirmation');
  };

  const handleViewUserBookings = () => {
    setCurrentView('user-bookings');
  };

  const handleViewUserProfile = () => {
    setCurrentView('user-profile');
  };

  const handleViewBooking = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setCurrentView('booking-confirmation');
  };

  const handleAuthClose = () => {
    setShowAuth(false);
  };

  const handleShowAuth = () => {
    setShowAuth(true);
  };

  const handleShowSearch = () => {
    setShowSearch(true);
  };

  const handleShowComparison = (propertyIds?: number[]) => {
    if (propertyIds) {
      setComparisonProperties(propertyIds);
    }
    setShowComparison(true);
  };

  const handleShowSocialSharing = (data?: any) => {
    if (data) {
      setSocialSharingData(data);
    }
    setShowSocialSharing(true);
  };

  const handleShowAdminDashboard = () => {
    setShowAdminDashboard(true);
  };

  // Initialize PWA
  useEffect(() => {
    PWAService.injectManifest();
  }, []);

  // Show loading screen while auth is initializing
  if (authLoading || isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-dynamic-gradient">
      {/* Hide Navigation when viewing property detail to avoid duplicate navbars */}
      {currentView !== 'property' && (
        <Navigation
          onSuggestionClick={handleSuggestionClick}
          user={user}
          onShowAuth={handleShowAuth}
          isAuthenticated={isAuthenticated}
          onViewUserProfile={handleViewUserProfile}
          onShowSearch={handleShowSearch}
          onShowAdminDashboard={handleShowAdminDashboard}
        />
      )}
      
      {currentView === 'home' && (
        <>
          <Hero onSuggestionClick={handleSuggestionClick} />
          <LongTermBookingSection onContactClick={handleContactClick} />
          <PropertyStorySection onPropertySelect={handlePropertySelect} />

          {/* <VisualStoriesSection onPropertySelect={handlePropertySelect} /> */}
          <FeaturesShowcase />
          {/* <PropertyStorySection onPropertySelect={handlePropertySelect} /> */}

          {/* <UserGuidanceSection /> */}

                                {/* <PropertyGrid 
                        onPropertySelect={handlePropertySelect}
                        onShowComparison={handleShowComparison}
                      /> */}
          <TestimonialsSection />
          {/* <MumbaiGuidePreview /> */}
          <ContactSection />
          <Footer />
        </>
      )}

                        {currentView === 'property' && (
                    <PropertyDetail
                      propertyId={selectedProperty!}
                      onBackToHome={handleBackToHome}
                      user={user}
                      isAuthenticated={isAuthenticated}
                      onBookingSuccess={handleBookingSuccess}
                      onShowSocialSharing={handleShowSocialSharing}
                    />
                  )}

      {currentView === 'booking-confirmation' && selectedBookingId && (
        <BookingConfirmation
          bookingId={selectedBookingId}
          onBackToHome={handleBackToHome}
          onViewBooking={handleViewBooking}
        />
      )}

      {currentView === 'user-bookings' && (
        <UserBookings
          onBackToHome={handleBackToHome}
          onViewBooking={handleViewBooking}
        />
      )}

      {currentView === 'user-profile' && (
        <UserProfileComponent
          onBackToHome={handleBackToHome}
          onViewBooking={handleViewBooking}
        />
      )}

      {/* Enhanced UI Components */}
      <ScrollToTop />
      <QuickActions 
        onSuggestionClick={handleSuggestionClick}
        onContactClick={handleContactClick}
        user={user}
        isAuthenticated={isAuthenticated}
        onShowAuth={handleShowAuth}
      />

      {/* Modals */}
      {showSuggestion && (
        <PropertySuggestion 
          onPropertySelect={handlePropertySelect}
          onClose={handleCloseSuggestion}
          user={user}
        />
      )}

      {showNewsletter && (
        <NewsletterSignup 
          onClose={() => setShowNewsletter(false)}
          user={user}
        />
      )}

                        {/* Authentication Modal */}
                  <PhoneAuth
                    isOpen={showAuth}
                    onSuccess={handleAuthSuccess}
                    onClose={handleAuthClose}
                  />

                  {/* Property Search Modal */}
                  {showSearch && (
                    <PropertySearch
                      onSearch={(filters) => {
                        console.log('Search filters:', filters);
                        // Handle search logic here
                      }}
                      onClear={() => {
                        console.log('Search cleared');
                        // Handle clear logic here
                      }}
                      properties={[]}
                      isLoading={false}
                    />
                  )}

                  {/* Property Comparison Modal */}
                  <PropertyComparison
                    isOpen={showComparison}
                    initialProperties={comparisonProperties}
                    onPropertySelect={handlePropertySelect}
                    onClose={() => setShowComparison(false)}
                  />

                  {/* Social Sharing Modal */}
                  <SocialSharing
                    isOpen={showSocialSharing}
                    shareData={socialSharingData}
                    onClose={() => setShowSocialSharing(false)}
                  />

                  {/* Admin Dashboard Modal */}
                  <AdminDashboard
                    isOpen={showAdminDashboard}
                    onClose={() => setShowAdminDashboard(false)}
                  />

                  {/* Database Test Component - Removed since connection is successful */}
    </div>
  );
}

export default App;