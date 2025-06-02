import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  SafeAreaView,
} from 'react-native';
import { theme } from '../theme/colors';
import BreathingOrb from '../components/BreathingOrb';
import StreakCounter from '../components/StreakCounter';
import MilestoneCelebration from '../components/MilestoneCelebration';
import StreakRecovery from '../components/StreakRecovery';
import EnhancedButton from '../components/EnhancedButton';
import EnhancedCard from '../components/EnhancedCard';
import StreakService from '../services/StreakService';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [breathingOrbScale] = useState(new Animated.Value(1));
  const [quitDate, setQuitDate] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(null);
  const [motivationQuote] = useState("Every breath is a new beginning");

  // Modal states
  const [showMilestone, setShowMilestone] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(null);
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Breathing orb pulse animation
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(breathingOrbScale, {
          toValue: 1.1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(breathingOrbScale, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    breathingAnimation.start();

    // Initialize streak data
    initializeStreakData();

    return () => {
      breathingAnimation.stop();
    };
  }, []);

  const initializeStreakData = async () => {
    try {
      const hasStreak = await StreakService.hasActiveStreak();

      if (!hasStreak) {
        // For demo purposes, set quit date to 3 days ago
        const demQuitDate = new Date();
        demQuitDate.setDate(demQuitDate.getDate() - 3);
        await StreakService.initializeStreak(demQuitDate);
      }

      const quitDate = await StreakService.getQuitDate();
      const streakData = await StreakService.getStreakData();
      const currentStreak = await StreakService.getCurrentStreak();

      setQuitDate(quitDate);
      setStreakData(streakData);
      setCurrentStreak(currentStreak);

      // Check for new milestones
      const newMilestones = await StreakService.checkMilestones();

      // Show milestone celebration if there are new achievements
      if (newMilestones.length > 0) {
        // Show the most recent milestone
        const latestMilestone = newMilestones[newMilestones.length - 1];
        setCurrentMilestone(latestMilestone);
        setShowMilestone(true);
      }
    } catch (error) {
      console.error('Error initializing streak data:', error);
    }
  };

  // Streak recovery handlers
  const handleStreakRestart = async () => {
    try {
      await StreakService.handleRelapse();
      await initializeStreakData(); // Refresh data
      setShowRecovery(false);
    } catch (error) {
      console.error('Error restarting streak:', error);
    }
  };

  const handleGracePeriod = async () => {
    try {
      await StreakService.useGracePeriod();
      await initializeStreakData(); // Refresh data
      setShowRecovery(false);
    } catch (error) {
      console.error('Error using grace period:', error);
      // If grace period fails, show error or handle appropriately
    }
  };

  const handleRecoveryCancel = () => {
    setShowRecovery(false);
  };

  // Milestone handlers
  const handleMilestoneClose = () => {
    setShowMilestone(false);
    setCurrentMilestone(null);
  };

  // Function to trigger streak recovery modal (for testing or manual trigger)
  const triggerStreakRecovery = () => {
    setShowRecovery(true);
  };

  const MotivationCard = () => (
    <EnhancedCard style={styles.motivationCard} variant="elevated">
      <Text style={styles.motivationQuote}>"{motivationQuote}"</Text>
      <Text style={styles.motivationAuthor}>- Your Inner Wisdom</Text>
    </EnhancedCard>
  );

  const QuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <View style={styles.actionsRow}>
        <EnhancedCard
          style={styles.actionButton}
          interactive
          onPress={() => navigation.navigate('breathing', { duration: 2, pattern: 'simple' })}
        >
          <View style={[styles.actionIcon, { backgroundColor: theme.colors.breathe.inhale }]}>
            <Text style={styles.actionIconText}>🫁</Text>
          </View>
          <Text style={styles.actionText}>Quick Breathe</Text>
        </EnhancedCard>

        <EnhancedCard
          style={styles.actionButton}
          interactive
          onPress={() => navigation.navigate('progress')}
        >
          <View style={[styles.actionIcon, { backgroundColor: theme.colors.secondary }]}>
            <Text style={styles.actionIconText}>📊</Text>
          </View>
          <Text style={styles.actionText}>Progress</Text>
        </EnhancedCard>

        <EnhancedCard
          style={styles.actionButton}
          interactive
          onPress={() => navigation.navigate('faq')}
        >
          <View style={[styles.actionIcon, { backgroundColor: theme.colors.accent }]}>
            <Text style={styles.actionIconText}>❓</Text>
          </View>
          <Text style={styles.actionText}>FAQ</Text>
        </EnhancedCard>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with greeting */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.subGreeting}>Ready to breathe free?</Text>
          </View>
        </View>

        {/* Prominent Streak Counter */}
        <StreakCounter
          smokeFreeDate={quitDate}
          onPress={() => navigation.navigate('progress')}
        />

        {/* Hero Breathing Section */}
        <View style={styles.heroBreathingSection}>
          <Text style={styles.heroTitle}>Take a Deep Breath</Text>
          <Text style={styles.heroSubtitle}>Your moment of peace awaits</Text>

          <Animated.View
            style={[
              styles.heroOrbContainer,
              {
                transform: [{ scale: breathingOrbScale }],
              },
            ]}
          >
            <BreathingOrb
              size={140} // Further reduced size to prevent overlap
              isActive={false}
              showInstructions={false}
            />
          </Animated.View>

          <View style={styles.breathingButtons}>
            <EnhancedButton
              title="Start 5-Min Session"
              variant="primary"
              size="medium"
              onPress={() => navigation.navigate('breathing', { duration: 5, pattern: 'box' })}
              style={styles.primaryBreathingButton}
            />

            <EnhancedButton
              title="Quick 2-Min Breathe"
              variant="outline"
              size="small"
              onPress={() => navigation.navigate('breathing', { duration: 2, pattern: 'simple' })}
              style={styles.secondaryBreathingButton}
            />
          </View>
        </View>

        {/* Chakra Breathing Section */}
        <View style={styles.chakraBreathingSection}>
          <Text style={styles.chakraTitle}>Chakra Breathing</Text>
          <Text style={styles.chakraSubtitle}>Balance your energy centers</Text>

          <EnhancedButton
            title="Explore Chakra Meditations"
            variant="secondary"
            size="medium"
            onPress={() => navigation.navigate('chakra')}
            style={styles.chakraButton}
          />
        </View>

        {/* Motivation quote */}
        <MotivationCard />

        {/* Minimal Quick actions */}
        <QuickActions />
      </ScrollView>

      {/* Milestone Celebration Modal */}
      <MilestoneCelebration
        visible={showMilestone}
        milestone={currentMilestone?.value}
        type={currentMilestone?.type}
        onClose={handleMilestoneClose}
      />

      {/* Streak Recovery Modal */}
      <StreakRecovery
        visible={showRecovery}
        currentStreak={currentStreak}
        onRestart={handleStreakRestart}
        onGracePeriod={handleGracePeriod}
        onCancel={handleRecoveryCancel}
      />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  animatedContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  headerContent: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subGreeting: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },

  // Hero breathing section
  heroBreathingSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  heroTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  heroOrbContainer: {
    marginBottom: theme.spacing.xxl, // Much larger spacing to prevent overlap
    paddingVertical: theme.spacing.lg, // Increased padding around orb
    paddingHorizontal: theme.spacing.md, // Add horizontal padding too
  },
  breathingButtons: {
    width: '100%',
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xl, // Increased top margin for more separation
  },
  primaryBreathingButton: {
    marginBottom: theme.spacing.sm,
    maxHeight: 50, // Constrain button height
  },
  secondaryBreathingButton: {
    maxHeight: 40, // Constrain button height
  },

  // Chakra breathing section
  chakraBreathingSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  chakraTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  chakraSubtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  chakraButton: {
    width: '80%',
  },

  // Motivation card
  motivationCard: {
    backgroundColor: theme.colors.primaryLight,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  motivationQuote: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textOnPrimary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: theme.spacing.xs,
  },
  motivationAuthor: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textOnPrimary,
    textAlign: 'center',
    opacity: 0.8,
  },

  // Quick actions - Improved alignment and spacing
  quickActionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // Changed from space-between for better alignment
    alignItems: 'stretch', // Make all buttons same height
    gap: theme.spacing.sm, // Add consistent gap between buttons
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0, // Remove individual margins
    padding: theme.spacing.md, // Increased padding for better touch targets
    minHeight: 88, // Ensure consistent height and larger touch target
    borderRadius: theme.borderRadius.lg, // Larger border radius for modern look
  },
  actionIcon: {
    width: 48, // Larger icons for better visibility
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionIconText: {
    fontSize: 24, // Larger emoji/icons for better visibility
  },
  actionText: {
    fontSize: theme.typography.fontSizes.sm, // Increased from xs for better readability
    fontWeight: theme.typography.fontWeights.semibold, // Increased weight for better hierarchy
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.tight * theme.typography.fontSizes.sm,
  },
});

export default HomeScreen;
