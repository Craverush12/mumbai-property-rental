import React, { useEffect, useRef } from 'react';
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
 * ProgressIndicator - Visual progress tracking for onboarding assessment
 * Shows current step, progress bar, and step indicators
 */
const ProgressIndicator = ({
  currentStep = 0,
  totalSteps = 4,
  stepLabels = [],
  showLabels = true,
  showPercentage = true,
  animated = true,
  style = {},
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const stepAnims = useRef(
    Array.from({ length: totalSteps }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (animated) {
      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: currentStep / (totalSteps - 1),
        duration: 500,
        useNativeDriver: false,
      }).start();

      // Animate step indicators
      stepAnims.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: index <= currentStep ? 1 : 0,
          duration: 300,
          delay: index * 100,
          useNativeDriver: true,
        }).start();
      });
    } else {
      progressAnim.setValue(currentStep / (totalSteps - 1));
      stepAnims.forEach((anim, index) => {
        anim.setValue(index <= currentStep ? 1 : 0);
      });
    }
  }, [currentStep, totalSteps, animated]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const percentage = Math.round((currentStep / (totalSteps - 1)) * 100);

  return (
    <View style={[styles.container, style]}>
      {/* Progress percentage */}
      {showPercentage && (
        <View style={styles.percentageContainer}>
          <Text style={styles.percentageText}>{percentage}% Complete</Text>
        </View>
      )}

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                transform: [{ scaleX: progressWidth }],
              },
            ]}
          />
        </View>
      </View>

      {/* Step indicators */}
      <View style={styles.stepsContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index <= currentStep;
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          const stepScale = stepAnims[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          });

          const stepOpacity = stepAnims[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1],
          });

          return (
            <View key={index} style={styles.stepContainer}>
              <Animated.View
                style={[
                  styles.stepIndicator,
                  isCompleted && styles.stepCompleted,
                  isCurrent && styles.stepCurrent,
                  {
                    transform: [{ scale: stepScale }],
                    opacity: stepOpacity,
                  },
                ]}
              >
                {isCompleted ? (
                  <Text style={styles.stepCheckmark}>✓</Text>
                ) : (
                  <Text style={[
                    styles.stepNumber,
                    isCurrent && styles.stepNumberCurrent,
                    isCompleted && styles.stepNumberCompleted,
                  ]}>
                    {index + 1}
                  </Text>
                )}
              </Animated.View>

              {/* Step label */}
              {showLabels && stepLabels[index] && (
                <Text style={[
                  styles.stepLabel,
                  isActive && styles.stepLabelActive,
                ]}>
                  {stepLabels[index]}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  
  percentageContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  
  percentageText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textSecondary,
  },
  
  progressBarContainer: {
    marginBottom: theme.spacing.lg,
  },
  
  progressBarBackground: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  
  progressBarFill: {
    height: '100%',
    width: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
    transformOrigin: 'left center',
  },
  
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  
  stepCompleted: {
    backgroundColor: theme.colors.success,
  },
  
  stepCurrent: {
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.primaryLight,
  },
  
  stepNumber: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.textLight,
  },
  
  stepNumberCurrent: {
    color: theme.colors.textOnPrimary,
  },
  
  stepNumberCompleted: {
    color: theme.colors.textOnPrimary,
  },
  
  stepCheckmark: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.textOnPrimary,
  },
  
  stepLabel: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  
  stepLabelActive: {
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeights.semibold,
  },
});

export default ProgressIndicator;
