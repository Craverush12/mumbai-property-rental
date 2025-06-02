import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { theme } from '../../theme/colors';
import EnhancedButton from '../../components/EnhancedButton';
import OnboardingService from '../../services/OnboardingService';

const { width, height } = Dimensions.get('window');

/**
 * WelcomeScreen - First screen of the comprehensive onboarding assessment
 * Replaces the current OnboardingScreen1.js with assessment-focused content
 */
const WelcomeScreen = ({ navigation }) => {
  const [onboardingState, setOnboardingState] = useState('loading');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkOnboardingState();
    startAnimations();
  }, []);

  // Handle navigation to avoid setState during render
  useEffect(() => {
    if (onboardingState === 'skip_onboarding') {
      // User has already completed assessment, go to home
      navigation.navigate('home');
    }
  }, [onboardingState, navigation]);

  const checkOnboardingState = async () => {
    try {
      // TEMPORARY: Force full onboarding for testing
      console.log('🔄 Forcing full onboarding for testing');
      await OnboardingService.resetAllOnboardingData();
      setOnboardingState('show_full_onboarding');
      return;

      const state = await OnboardingService.getOnboardingState();
      console.log('📋 Onboarding state:', state);
      setOnboardingState(state);
    } catch (error) {
      console.error('Error checking onboarding state:', error);
      setOnboardingState('show_full_onboarding');
    }
  };

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(logoAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  };

  const handleStartAssessment = async () => {
    try {
      console.log('🚀 Starting assessment - navigating to SmokingQuestions');
      // Save initial user profile data
      await OnboardingService.saveStepData('userProfile', {
        language: 'en', // Default to English
        completedAssessment: false,
        assessmentDate: new Date().toISOString(),
        assessmentVersion: '1.0',
      });

      // Navigate to smoking assessment
      navigation.navigate('SmokingQuestions');
    } catch (error) {
      console.error('Error starting assessment:', error);
      // Continue anyway
      navigation.navigate('SmokingQuestions');
    }
  };

  const handleSkipAssessment = () => {
    // For existing users who want to skip
    navigation.navigate('home');
  };



  const renderWelcomeContent = () => {
    const isExistingUser = onboardingState === 'show_optional_assessment';
    
    return (
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* App Logo/Symbol */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [
                {
                  scale: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.logo}>🌬️</Text>
        </Animated.View>

        {/* Welcome text */}
        <Text style={styles.title}>
          {isExistingUser ? 'Welcome Back!' : 'Welcome to Breather'}
        </Text>

        <Text style={styles.subtitle}>
          {isExistingUser 
            ? 'Enhance your experience with a personalized assessment'
            : 'Your journey to better breathing and wellness starts here'
          }
        </Text>

        <Text style={styles.description}>
          {isExistingUser 
            ? 'Take our comprehensive assessment to get personalized breathing exercises and meditation recommendations based on your unique needs.'
            : 'We\'ll assess your lung health and chakra balance to create a personalized wellness plan just for you. This takes about 5 minutes.'
          }
        </Text>

        {/* Assessment benefits */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>You'll discover:</Text>
          <View style={styles.benefitsList}>
            <Text style={styles.benefitItem}>🫁 Your personalized lung health score</Text>
            <Text style={styles.benefitItem}>🧘 Chakra balance assessment</Text>
            <Text style={styles.benefitItem}>💡 Customized meditation recommendations</Text>
            <Text style={styles.benefitItem}>📈 Your improvement potential</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderActions = () => {
    const isExistingUser = onboardingState === 'show_optional_assessment';
    
    return (
      <Animated.View
        style={[
          styles.actionsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <EnhancedButton
          title={isExistingUser ? "Take Assessment" : "Start Assessment"}
          onPress={handleStartAssessment}
          variant="primary"
          size="large"
          style={styles.primaryButton}
        />

        {isExistingUser && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkipAssessment}
          >
            <Text style={styles.skipButtonText}>
              Maybe Later
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.timeEstimate}>
          ⏱️ Takes about 5 minutes
        </Text>
      </Animated.View>
    );
  };

  if (onboardingState === 'loading') {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (onboardingState === 'skip_onboarding') {
    return null; // Will navigate in useEffect above
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderWelcomeContent()}
      {renderActions()}

      {/* Decorative background elements */}
      <View style={styles.backgroundDecoration}>
        <Animated.View
          style={[
            styles.decorativeCircle,
            styles.circle1,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.1],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.decorativeCircle,
            styles.circle2,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.05],
              }),
            },
          ]}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  
  loadingText: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.textSecondary,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    alignItems: 'center',
  },
  
  logoContainer: {
    marginBottom: theme.spacing.xl,
  },
  
  logo: {
    fontSize: 80,
    textAlign: 'center',
  },
  
  title: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  
  subtitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  
  description: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.md,
    marginBottom: theme.spacing.xl,
  },
  
  benefitsContainer: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  
  benefitsTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  
  benefitsList: {
    alignItems: 'flex-start',
  },
  
  benefitItem: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.md,
  },
  
  actionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  
  primaryButton: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  
  skipButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  
  skipButtonText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  
  timeEstimate: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 200,
    backgroundColor: theme.colors.primary,
  },
  
  circle1: {
    width: 300,
    height: 300,
    top: -150,
    right: -150,
  },
  
  circle2: {
    width: 200,
    height: 200,
    bottom: -100,
    left: -100,
  },
});

export default WelcomeScreen;
