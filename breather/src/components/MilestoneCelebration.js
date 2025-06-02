import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const MilestoneCelebration = ({ 
  visible, 
  onClose, 
  milestone, 
  type = 'streak' // 'streak', 'sessions', 'minutes'
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Start celebration animation
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      confettiAnim.setValue(0);
    }
  }, [visible]);

  const getMilestoneData = () => {
    switch (type) {
      case 'streak':
        return {
          title: `${milestone} Day Streak!`,
          subtitle: 'Amazing consistency!',
          emoji: milestone >= 30 ? '🏆' : milestone >= 7 ? '🔥' : '⭐',
          color: milestone >= 30 ? theme.colors.warning : milestone >= 7 ? theme.colors.error : theme.colors.success,
          message: milestone >= 30 
            ? 'You\'re a meditation master!' 
            : milestone >= 7 
              ? 'You\'re building an incredible habit!' 
              : 'Great start on your journey!',
        };
      case 'sessions':
        return {
          title: `${milestone} Sessions Complete!`,
          subtitle: 'Keep up the great work!',
          emoji: milestone >= 100 ? '🎯' : milestone >= 50 ? '🌟' : '🎉',
          color: theme.colors.primary,
          message: 'Every session brings you closer to inner peace.',
        };
      case 'minutes':
        return {
          title: `${milestone} Minutes of Mindfulness!`,
          subtitle: 'Time well invested!',
          emoji: '🧘‍♀️',
          color: theme.colors.secondary,
          message: 'You\'ve dedicated precious time to your wellbeing.',
        };
      default:
        return {
          title: 'Milestone Achieved!',
          subtitle: 'Congratulations!',
          emoji: '🎉',
          color: theme.colors.primary,
          message: 'Keep up the amazing work!',
        };
    }
  };

  const milestoneData = getMilestoneData();

  const renderConfetti = () => {
    const confettiPieces = Array.from({ length: 20 }, (_, i) => (
      <Animated.View
        key={i}
        style={[
          styles.confettiPiece,
          {
            left: Math.random() * width,
            backgroundColor: [
              theme.colors.primary,
              theme.colors.secondary,
              theme.colors.warning,
              theme.colors.success,
              theme.colors.info,
            ][Math.floor(Math.random() * 5)],
            transform: [
              {
                translateY: confettiAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, height + 50],
                }),
              },
              {
                rotate: confettiAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      />
    ));

    return <View style={styles.confettiContainer}>{confettiPieces}</View>;
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[milestoneData.color + '20', milestoneData.color + '05']}
            style={styles.content}
          >
            {/* Emoji */}
            <Text style={styles.emoji}>{milestoneData.emoji}</Text>

            {/* Title */}
            <Text style={[styles.title, { color: milestoneData.color }]}>
              {milestoneData.title}
            </Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>{milestoneData.subtitle}</Text>

            {/* Message */}
            <Text style={styles.message}>{milestoneData.message}</Text>

            {/* Achievement Badge */}
            <View style={[styles.badge, { borderColor: milestoneData.color }]}>
              <Text style={[styles.badgeText, { color: milestoneData.color }]}>
                Achievement Unlocked
              </Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: milestoneData.color }]}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Continue</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Confetti Animation */}
        {renderConfetti()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.85,
    maxWidth: 400,
  },
  content: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  emoji: {
    fontSize: 80,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontWeight: theme.typography.fontWeights.medium,
  },
  message: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.md,
    marginBottom: theme.spacing.xl,
  },
  badge: {
    borderWidth: 2,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  badgeText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  closeButton: {
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    minWidth: 120,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.textOnPrimary,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  confettiPiece: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default MilestoneCelebration;
