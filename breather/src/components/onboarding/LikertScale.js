import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { theme } from '../../theme/colors';

/**
 * LikertScale - 1-5 rating component with visual feedback
 * Used for chakra assessment questions
 */
const LikertScale = ({
  value = null,
  onValueChange,
  labels = [
    'Strongly Disagree',
    'Disagree', 
    'Neutral',
    'Agree',
    'Strongly Agree'
  ],
  colors = [
    '#E74C3C', // Red for strongly disagree
    '#E67E22', // Orange for disagree
    '#F39C12', // Yellow for neutral
    '#27AE60', // Green for agree
    '#2ECC71', // Bright green for strongly agree
  ],
  showLabels = true,
  showNumbers = true,
  animated = true,
  style = {},
  disabled = false,
}) => {
  const [selectedValue, setSelectedValue] = useState(value);
  const scaleAnims = useRef(
    Array.from({ length: 5 }, () => new Animated.Value(1))
  ).current;
  const selectionAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setSelectedValue(value);
    if (animated && value !== null) {
      // Animate selection
      Animated.spring(selectionAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [value]);

  const handlePress = (rating) => {
    if (disabled) return;

    setSelectedValue(rating);
    onValueChange && onValueChange(rating);

    if (animated) {
      // Animate the pressed button
      const pressedAnim = scaleAnims[rating - 1];
      
      Animated.sequence([
        Animated.timing(pressedAnim, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(pressedAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate selection indicator
      Animated.spring(selectionAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  };

  const getButtonStyle = (rating) => {
    const isSelected = selectedValue === rating;
    const baseStyle = [styles.scaleButton];
    
    if (isSelected) {
      baseStyle.push([
        styles.scaleButtonSelected,
        { backgroundColor: colors[rating - 1] }
      ]);
    } else {
      baseStyle.push([
        styles.scaleButtonUnselected,
        { borderColor: colors[rating - 1] }
      ]);
    }
    
    if (disabled) {
      baseStyle.push(styles.scaleButtonDisabled);
    }
    
    return baseStyle;
  };

  const getTextStyle = (rating) => {
    const isSelected = selectedValue === rating;
    const baseStyle = [styles.scaleButtonText];
    
    if (isSelected) {
      baseStyle.push(styles.scaleButtonTextSelected);
    } else {
      baseStyle.push([
        styles.scaleButtonTextUnselected,
        { color: colors[rating - 1] }
      ]);
    }
    
    if (disabled) {
      baseStyle.push(styles.scaleButtonTextDisabled);
    }
    
    return baseStyle;
  };

  const renderScaleButton = (rating) => {
    const isSelected = selectedValue === rating;
    
    return (
      <TouchableOpacity
        key={rating}
        style={styles.scaleButtonContainer}
        onPress={() => handlePress(rating)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Animated.View
          style={[
            getButtonStyle(rating),
            {
              transform: [
                { scale: scaleAnims[rating - 1] },
                ...(isSelected && animated ? [{ scale: selectionAnim }] : []),
              ],
            },
          ]}
        >
          {showNumbers && (
            <Text style={getTextStyle(rating)}>
              {rating}
            </Text>
          )}
        </Animated.View>
        
        {showLabels && (
          <Text style={[
            styles.scaleLabel,
            isSelected && styles.scaleLabelSelected,
            disabled && styles.scaleLabelDisabled,
          ]}>
            {labels[rating - 1]}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.scaleContainer}>
        {[1, 2, 3, 4, 5].map(renderScaleButton)}
      </View>
      
      {/* Selection feedback */}
      {selectedValue !== null && (
        <Animated.View
          style={[
            styles.feedbackContainer,
            {
              opacity: selectionAnim,
              transform: [
                {
                  translateY: selectionAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={[
            styles.feedbackText,
            { color: colors[selectedValue - 1] }
          ]}>
            You selected: {labels[selectedValue - 1]}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.md,
  },
  
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
  },
  
  scaleButtonContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: theme.spacing.xs,
  },
  
  scaleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
  },
  
  scaleButtonSelected: {
    borderColor: 'transparent',
    ...theme.shadows.sm,
  },
  
  scaleButtonUnselected: {
    backgroundColor: 'transparent',
  },
  
  scaleButtonDisabled: {
    opacity: 0.5,
  },
  
  scaleButtonText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
  },
  
  scaleButtonTextSelected: {
    color: theme.colors.textOnPrimary,
  },
  
  scaleButtonTextUnselected: {
    // Color set dynamically based on rating
  },
  
  scaleButtonTextDisabled: {
    color: theme.colors.textLight,
  },
  
  scaleLabel: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.tight * theme.typography.fontSizes.xs,
  },
  
  scaleLabelSelected: {
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  
  scaleLabelDisabled: {
    color: theme.colors.textLight,
  },
  
  feedbackContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  
  feedbackText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    textAlign: 'center',
  },
});

export default LikertScale;
