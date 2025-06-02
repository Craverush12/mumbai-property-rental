import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { theme } from '../../theme/colors';

const { width } = Dimensions.get('window');

/**
 * SliderInput - Custom slider component with visual feedback
 * Used for cigarettes per day input with visual indicators
 */
const SliderInput = ({
  value = 0,
  onValueChange,
  minimumValue = 0,
  maximumValue = 40,
  step = 1,
  label = '',
  showValue = true,
  showIcons = false,
  iconComponent = null,
  trackColor = theme.colors.border,
  thumbColor = theme.colors.primary,
  activeTrackColor = theme.colors.primary,
  style = {},
  disabled = false,
}) => {
  const [sliderValue, setSliderValue] = useState(value);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  const handleValueChange = (newValue) => {
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(minimumValue, Math.min(maximumValue, steppedValue));

    setSliderValue(clampedValue);
    onValueChange && onValueChange(clampedValue);
  };

  const renderIcons = () => {
    if (!showIcons || !iconComponent) return null;

    const iconCount = Math.min(sliderValue, 10); // Show max 10 icons
    const icons = [];

    for (let i = 0; i < iconCount; i++) {
      icons.push(
        <View key={i} style={styles.icon}>
          {iconComponent}
        </View>
      );
    }

    return (
      <View style={styles.iconsContainer}>
        {icons}
        {sliderValue > 10 && (
          <Text style={styles.moreText}>+{sliderValue - 10} more</Text>
        )}
      </View>
    );
  };

  const getValueColor = () => {
    if (sliderValue === 0) return theme.colors.success;
    if (sliderValue <= 5) return theme.colors.warning;
    if (sliderValue <= 15) return theme.colors.error;
    return '#C0392B'; // Critical
  };

  const getValueMessage = () => {
    if (sliderValue === 0) return 'Non-smoker 🎉';
    if (sliderValue <= 5) return 'Light smoker';
    if (sliderValue <= 15) return 'Moderate smoker';
    if (sliderValue <= 25) return 'Heavy smoker';
    return 'Very heavy smoker';
  };

  return (
    <View style={[styles.container, style]}>
      {/* Label */}
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}

      {/* Value display */}
      {showValue && (
        <View style={styles.valueContainer}>
          <Text style={[styles.valueText, { color: getValueColor() }]}>
            {sliderValue}
          </Text>
          <Text style={styles.valueMessage}>
            {getValueMessage()}
          </Text>
        </View>
      )}

      {/* Slider */}
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          value={sliderValue}
          onValueChange={handleValueChange}
          step={step}
          minimumTrackTintColor={activeTrackColor}
          maximumTrackTintColor={trackColor}
          thumbStyle={{ backgroundColor: thumbColor }}
          disabled={disabled}
        />
      </View>

      {/* Min/Max labels */}
      <View style={styles.labelsContainer}>
        <Text style={styles.minMaxLabel}>{minimumValue}</Text>
        <Text style={styles.minMaxLabel}>{maximumValue}+</Text>
      </View>

      {/* Visual icons */}
      {renderIcons()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.md,
  },
  
  label: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  
  valueContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  
  valueText: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
  },
  
  valueMessage: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  
  sliderContainer: {
    marginHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },

  slider: {
    width: '100%',
    height: 40,
  },
  
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  
  minMaxLabel: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textLight,
    fontWeight: theme.typography.fontWeights.medium,
  },
  
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  
  icon: {
    margin: 2,
  },
  
  moreText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeights.medium,
    marginLeft: theme.spacing.sm,
    alignSelf: 'center',
  },
});

export default SliderInput;
