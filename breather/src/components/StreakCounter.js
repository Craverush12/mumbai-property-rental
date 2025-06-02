import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { theme } from '../theme/colors';

const StreakCounter = ({
  smokeFreeDate,
  currentStreak = 0,
  animated = true,
  size = 'medium',
  showLabel = true,
  onPress
}) => {
  const [displayStreak, setDisplayStreak] = useState(0);
  const scaleAnim = new Animated.Value(1);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    if (animated && currentStreak !== displayStreak) {
      // Animate the counter change
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0.7,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Update the displayed number with a slight delay for animation
      setTimeout(() => {
        setDisplayStreak(currentStreak);
      }, 200);
    } else {
      setDisplayStreak(currentStreak);
    }
  }, [currentStreak]);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.smallContainer,
          number: styles.smallNumber,
          label: styles.smallLabel,
        };
      case 'large':
        return {
          container: styles.largeContainer,
          number: styles.largeNumber,
          label: styles.largeLabel,
        };
      default:
        return {
          container: styles.mediumContainer,
          number: styles.mediumNumber,
          label: styles.mediumLabel,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const getStreakColor = () => {
    if (displayStreak === 0) return theme.colors.textLight;
    if (displayStreak < 7) return theme.colors.warning;
    if (displayStreak < 30) return theme.colors.success;
    return theme.colors.primary;
  };

  const getStreakEmoji = () => {
    if (displayStreak === 0) return '';
    if (displayStreak < 7) return '🌱';
    if (displayStreak < 30) return '🔥';
    return '⭐';
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.container, sizeStyles.container]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <Animated.View
        style={[
          styles.streakContent,
          {
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.numberContainer}>
          <Text style={styles.emoji}>{getStreakEmoji()}</Text>
          <Text
            style={[
              styles.streakNumber,
              sizeStyles.number,
              { color: getStreakColor() }
            ]}
          >
            {displayStreak}
          </Text>
        </View>

        {showLabel && (
          <Text style={[styles.streakLabel, sizeStyles.label]}>
            {displayStreak === 1 ? 'day streak' : 'day streak'}
          </Text>
        )}
      </Animated.View>

      {displayStreak > 0 && (
        <View style={styles.motivationContainer}>
          <Text style={styles.motivationText}>
            {displayStreak < 7
              ? "Keep it up!"
              : displayStreak < 30
                ? "You're on fire!"
                : "Incredible dedication!"
            }
          </Text>
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Size variants
  smallContainer: {
    padding: theme.spacing.sm,
  },
  mediumContainer: {
    padding: theme.spacing.md,
  },
  largeContainer: {
    padding: theme.spacing.lg,
  },
  
  streakContent: {
    alignItems: 'center',
  },
  
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  emoji: {
    fontSize: 20,
    marginRight: theme.spacing.xs,
  },
  
  streakNumber: {
    fontWeight: theme.typography.fontWeights.bold,
    textAlign: 'center',
  },
  
  // Number sizes
  smallNumber: {
    fontSize: theme.typography.fontSizes.lg,
  },
  mediumNumber: {
    fontSize: theme.typography.fontSizes.xxxl,
  },
  largeNumber: {
    fontSize: theme.typography.fontSizes.xxxl * 1.5,
  },
  
  streakLabel: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  
  // Label sizes
  smallLabel: {
    fontSize: theme.typography.fontSizes.xs,
  },
  mediumLabel: {
    fontSize: theme.typography.fontSizes.sm,
  },
  largeLabel: {
    fontSize: theme.typography.fontSizes.md,
  },
  
  motivationContainer: {
    marginTop: theme.spacing.sm,
  },
  
  motivationText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default StreakCounter;
