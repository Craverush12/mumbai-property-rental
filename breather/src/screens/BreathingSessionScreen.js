import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  SafeAreaView,
} from 'react-native';
import { theme, getChakraColor } from '../theme/colors';
import BreathingOrb from '../components/BreathingOrb';

const { width, height } = Dimensions.get('window');

const BreathingSessionScreen = ({ navigation, route }) => {
  const { duration = 5, pattern = 'box', chakra = 'heart' } = route?.params || {};

  const [isSessionActive, setIsSessionActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // Convert to seconds
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [sessionPhase, setSessionPhase] = useState('preparation'); // preparation, active, completed
  const [fadeAnim] = useState(new Animated.Value(0));

  // Get chakra color for theming
  const chakraColor = getChakraColor(chakra);
  const chakraBackgroundColor = chakraColor + '15'; // Very light tint

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    let timer;
    if (isSessionActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setSessionPhase('completed');
            setIsSessionActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSessionActive, timeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = () => {
    setIsSessionActive(true);
    setSessionPhase('active');
  };

  const pauseSession = () => {
    setIsSessionActive(false);
  };

  const resumeSession = () => {
    setIsSessionActive(true);
  };

  const endSession = () => {
    setIsSessionActive(false);
    setSessionPhase('completed');
  };

  const onCycleComplete = (cycles) => {
    setCyclesCompleted(cycles);
  };

  const PreparationPhase = () => (
    <View style={styles.preparationContainer}>
      <Text style={styles.preparationTitle}>Ready for {chakra} chakra breathing?</Text>

      <View style={[styles.sessionPreview, { borderColor: chakraColor }]}>
        <View style={styles.previewItem}>
          <Text style={[styles.durationText, { color: chakraColor }]}>{duration}</Text>
          <Text style={styles.durationLabel}>min</Text>
        </View>
        <View style={[styles.previewDivider, { backgroundColor: chakraColor }]} />
        <View style={styles.previewItem}>
          <Text style={styles.patternText}>{pattern.toUpperCase()}</Text>
          <Text style={styles.patternLabel}>breathing</Text>
        </View>
      </View>

      <Text style={styles.preparationSubtext}>
        Find a comfortable position and focus on your {chakra} chakra energy
      </Text>

      <TouchableOpacity style={[styles.startButton, { backgroundColor: chakraColor }]} onPress={startSession}>
        <Text style={styles.startButtonText}>Begin</Text>
      </TouchableOpacity>
    </View>
  );

  const ActivePhase = () => (
    <View style={styles.activeContainer}>
      <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>

      <View style={styles.orbContainer}>
        <BreathingOrb
          size={280} // Larger for better focus
          isActive={isSessionActive}
          breathingPattern={pattern}
          showInstructions={true}
          onCycleComplete={onCycleComplete}
        />
      </View>

      {/* Controls - pause/resume and end session */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, isSessionActive ? styles.pauseButton : styles.resumeButton]}
          onPress={isSessionActive ? pauseSession : resumeSession}
        >
          <Text style={styles.controlButtonText}>
            {isSessionActive ? 'Pause' : 'Resume'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.endButton]}
          onPress={endSession}
        >
          <Text style={styles.controlButtonText}>End Session</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const CompletedPhase = () => (
    <View style={styles.completedContainer}>
      <Text style={styles.completedTitle}>Session Complete!</Text>
      <Text style={styles.completedSubtitle}>Well done on completing your breathing practice</Text>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{duration}</Text>
          <Text style={styles.summaryLabel}>Minutes</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{cyclesCompleted}</Text>
          <Text style={styles.summaryLabel}>Cycles</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{pattern.toUpperCase()}</Text>
          <Text style={styles.summaryLabel}>Pattern</Text>
        </View>
      </View>

      <Text style={styles.completedMessage}>
        You've taken another step towards freedom. How do you feel?
      </Text>

      <View style={styles.completedActions}>
        <TouchableOpacity style={styles.againButton} onPress={() => {
          setSessionPhase('preparation');
          setTimeRemaining(duration * 60);
          setCyclesCompleted(0);
        }}>
          <Text style={styles.againButtonText}>Practice Again</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.homeButtonText}>Return Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: chakraBackgroundColor }]}>
      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{chakra.charAt(0).toUpperCase() + chakra.slice(1)} Breathing</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content based on session phase */}
      <View style={styles.content}>
        {sessionPhase === 'preparation' && <PreparationPhase />}
        {sessionPhase === 'active' && <ActivePhase />}
        {sessionPhase === 'completed' && <CompletedPhase />}
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  headerTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  placeholder: {
    width: 50, // To balance the header
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  
  // Preparation Phase Styles - Simplified and cleaner
  preparationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  preparationTitle: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  sessionPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border, // Will be overridden by chakra color
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.md,
  },
  previewItem: {
    flex: 1,
    alignItems: 'center',
  },
  previewDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.lg,
  },
  durationText: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  durationLabel: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  patternText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  patternLabel: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  preparationSubtext: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.md,
    marginBottom: theme.spacing.xxl,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    ...theme.shadows.md,
  },
  startButtonText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.textOnPrimary,
  },
  
  // Active Phase Styles - Simplified and focused
  activeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  timerText: {
    fontSize: theme.typography.fontSizes.xxxl * 1.8, // Larger for better visibility
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  orbContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    minWidth: 100,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  pauseButton: {
    backgroundColor: theme.colors.warning,
  },
  resumeButton: {
    backgroundColor: theme.colors.success,
  },
  endButton: {
    backgroundColor: theme.colors.error,
  },
  controlButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textOnPrimary,
  },
  
  // Completed Phase Styles
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedTitle: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.success,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  completedSubtitle: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  summaryLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  completedMessage: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  completedActions: {
    width: '100%',
    gap: theme.spacing.md,
  },
  againButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  againButtonText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.textOnPrimary,
    textAlign: 'center',
  },
  homeButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  homeButtonText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.primary,
    textAlign: 'center',
  },
});

export default BreathingSessionScreen;
