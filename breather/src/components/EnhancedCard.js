import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Pressable 
} from 'react-native';
import { theme } from '../theme/colors';

const EnhancedCard = ({ 
  children, 
  style, 
  variant = 'default', 
  interactive = false,
  onPress,
  disabled = false,
  ...props 
}) => {
  // Animation for press feedback
  const scaleAnim = new Animated.Value(1);
  
  const handlePressIn = () => {
    if (interactive && !disabled) {
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  };
  
  const handlePressOut = () => {
    if (interactive && !disabled) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const getCardStyle = () => {
    const baseStyle = [styles.card];
    
    // Add variant-specific styles
    switch (variant) {
      case 'elevated':
        baseStyle.push(styles.elevatedCard);
        break;
      case 'outlined':
        baseStyle.push(styles.outlinedCard);
        break;
      case 'filled':
        baseStyle.push(styles.filledCard);
        break;
      default:
        baseStyle.push(styles.defaultCard);
    }
    
    // Add disabled style if needed
    if (disabled) {
      baseStyle.push(styles.disabledCard);
    }
    
    // Add custom styles
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  // Render as touchable if interactive
  if (interactive) {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        <Animated.View 
          style={[
            getCardStyle(),
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          {children}
        </Animated.View>
      </TouchableOpacity>
    );
  }
  
  // Render as regular view if not interactive
  return (
    <View style={getCardStyle()} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.xs,
  },
  
  // Variant styles
  defaultCard: {
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  elevatedCard: {
    backgroundColor: theme.colors.surface,
    ...theme.shadows.md,
  },
  outlinedCard: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filledCard: {
    backgroundColor: theme.colors.primaryLight,
  },
  
  // Disabled state
  disabledCard: {
    opacity: 0.6,
  },
});

export default EnhancedCard;
