import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { theme } from '../../theme/colors';

const { width } = Dimensions.get('window');

/**
 * ScoreDisplay - Animated score visualization component
 * Shows scores with progress bars, color coding, and counting animations
 */
const ScoreDisplay = ({
  score = 0,
  maxScore = 100,
  title = 'Score',
  subtitle = '',
  description = '',
  color = theme.colors.primary,
  showProgressBar = true,
  showPercentage = true,
  animationDuration = 2000,
  animationDelay = 0,
  style = {},
  size = 'large', // 'small', 'medium', 'large'
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const countingInterval = useRef(null);

  useEffect(() => {
    // Start animations with delay
    const timer = setTimeout(() => {
      startAnimations();
    }, animationDelay);

    return () => {
      clearTimeout(timer);
      if (countingInterval.current) {
        clearInterval(countingInterval.current);
      }
    };
  }, [score]);

  const startAnimations = () => {
    // Fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: score / maxScore,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();

    // Counting animation
    startCountingAnimation();
  };

  const startCountingAnimation = () => {
    const duration = animationDuration;
    const steps = Math.min(score, 100); // Limit steps for performance
    const stepDuration = duration / steps;
    let currentStep = 0;

    countingInterval.current = setInterval(() => {
      currentStep++;
      const currentScore = Math.round((currentStep / steps) * score);
      setDisplayScore(currentScore);

      if (currentStep >= steps) {
        clearInterval(countingInterval.current);
        setDisplayScore(score); // Ensure final score is exact
      }
    }, stepDuration);
  };

  const getScoreColor = () => {
    if (score >= 80) return theme.colors.success;
    if (score >= 60) return theme.colors.warning;
    if (score >= 40) return '#E67E22';
    if (score >= 20) return theme.colors.error;
    return '#C0392B';
  };

  const getScoreLevel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    if (score >= 20) return 'Poor';
    return 'Critical';
  };

  const getProgressBarScale = () => {
    return progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          scoreText: { fontSize: theme.typography.fontSizes.xl },
          titleText: { fontSize: theme.typography.fontSizes.md },
          container: { padding: theme.spacing.md },
        };
      case 'medium':
        return {
          scoreText: { fontSize: theme.typography.fontSizes.xxl },
          titleText: { fontSize: theme.typography.fontSizes.lg },
          container: { padding: theme.spacing.lg },
        };
      case 'large':
      default:
        return {
          scoreText: { fontSize: 48 },
          titleText: { fontSize: theme.typography.fontSizes.xl },
          container: { padding: theme.spacing.xl },
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const scoreColor = color || getScoreColor();

  return (
    <Animated.View
      style={[
        styles.container,
        sizeStyles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
    >
      {/* Title */}
      <Text style={[styles.title, sizeStyles.titleText]}>
        {title}
      </Text>

      {/* Subtitle */}
      {subtitle && (
        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      )}

      {/* Score circle or display */}
      <View style={styles.scoreContainer}>
        <Text style={[
          styles.score,
          sizeStyles.scoreText,
          { color: scoreColor }
        ]}>
          {displayScore}
        </Text>
        
        {showPercentage && maxScore === 100 && (
          <Text style={[styles.percentage, { color: scoreColor }]}>
            %
          </Text>
        )}
        
        {maxScore !== 100 && (
          <Text style={styles.maxScore}>
            / {maxScore}
          </Text>
        )}
      </View>

      {/* Score level */}
      <Text style={[styles.scoreLevel, { color: scoreColor }]}>
        {getScoreLevel()}
      </Text>

      {/* Progress bar */}
      {showProgressBar && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: scoreColor,
                  transform: [{ scaleX: getProgressBarScale() }],
                },
              ]}
            />
          </View>
          
          {/* Progress markers */}
          <View style={styles.progressMarkers}>
            {[20, 40, 60, 80].map((marker) => (
              <View
                key={marker}
                style={[
                  styles.progressMarker,
                  {
                    left: `${marker}%`,
                    backgroundColor: score >= marker ? scoreColor : theme.colors.border,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      )}

      {/* Description */}
      {description && (
        <Text style={styles.description}>
          {description}
        </Text>
      )}

      {/* Decorative elements */}
      <View style={styles.decorativeContainer}>
        <Animated.View
          style={[
            styles.decorativeRing,
            {
              borderColor: scoreColor,
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.1],
              }),
              transform: [
                {
                  scale: scaleAnim.interpolate({
                    inputRange: [0.8, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    position: 'relative',
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  
  title: {
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  
  subtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontWeight: theme.typography.fontWeights.medium,
  },
  
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  
  score: {
    fontWeight: theme.typography.fontWeights.bold,
    textAlign: 'center',
  },
  
  percentage: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    marginLeft: theme.spacing.xs,
  },
  
  maxScore: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.textLight,
    fontWeight: theme.typography.fontWeights.medium,
    marginLeft: theme.spacing.xs,
  },
  
  scoreLevel: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  
  progressContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  
  progressBackground: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    width: '100%',
    borderRadius: 4,
    transformOrigin: 'left center',
  },
  
  progressMarkers: {
    position: 'absolute',
    top: -2,
    left: 0,
    right: 0,
    height: 12,
  },
  
  progressMarker: {
    position: 'absolute',
    width: 3,
    height: 12,
    borderRadius: 1.5,
    marginLeft: -1.5,
  },
  
  description: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
    paddingHorizontal: theme.spacing.md,
  },
  
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  
  decorativeRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
  },
});

export default ScoreDisplay;
