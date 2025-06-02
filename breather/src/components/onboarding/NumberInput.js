import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { theme } from '../../theme/colors';

/**
 * NumberInput - Validated number input component
 * Used for years smoking and quit attempts questions
 */
const NumberInput = ({
  value = '',
  onValueChange,
  placeholder = 'Enter number',
  label = '',
  minValue = 0,
  maxValue = 100,
  showButtons = true,
  showValidation = true,
  validationMessage = '',
  style = {},
  disabled = false,
  autoFocus = false,
}) => {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  const inputRef = useRef(null);
  const borderColorAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setInputValue(value.toString());
    validateInput(value.toString());
  }, [value]);

  useEffect(() => {
    // Animate border color based on focus and validation
    Animated.timing(borderColorAnim, {
      toValue: isFocused ? 1 : (isValid ? 0 : -1),
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, isValid]);

  const validateInput = (text) => {
    const numValue = parseInt(text, 10);
    
    if (text === '') {
      setIsValid(true);
      setErrorMessage('');
      return true;
    }
    
    if (isNaN(numValue)) {
      setIsValid(false);
      setErrorMessage('Please enter a valid number');
      return false;
    }
    
    if (numValue < minValue) {
      setIsValid(false);
      setErrorMessage(`Minimum value is ${minValue}`);
      return false;
    }
    
    if (numValue > maxValue) {
      setIsValid(false);
      setErrorMessage(`Maximum value is ${maxValue}`);
      return false;
    }
    
    // Custom validation message
    if (validationMessage && numValue > 0) {
      setErrorMessage(validationMessage);
    } else {
      setErrorMessage('');
    }
    
    setIsValid(true);
    return true;
  };

  const handleTextChange = (text) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    setInputValue(numericText);
    
    const isValidInput = validateInput(numericText);
    
    if (isValidInput && numericText !== '') {
      onValueChange && onValueChange(parseInt(numericText, 10));
    } else if (numericText === '') {
      onValueChange && onValueChange(0);
    }
  };

  const handleIncrement = () => {
    const currentValue = parseInt(inputValue, 10) || 0;
    const newValue = Math.min(currentValue + 1, maxValue);
    handleTextChange(newValue.toString());
  };

  const handleDecrement = () => {
    const currentValue = parseInt(inputValue, 10) || 0;
    const newValue = Math.max(currentValue - 1, minValue);
    handleTextChange(newValue.toString());
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    
    // Validate on blur
    if (!validateInput(inputValue)) {
      // Shake animation for invalid input
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const getBorderColor = () => {
    return borderColorAnim.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [theme.colors.error, theme.colors.border, theme.colors.primary],
    });
  };

  const getValueMessage = () => {
    const numValue = parseInt(inputValue, 10) || 0;
    
    if (label.toLowerCase().includes('year')) {
      if (numValue === 0) return 'Non-smoker';
      if (numValue < 2) return 'Recent smoker';
      if (numValue < 5) return 'Short-term smoker';
      if (numValue < 15) return 'Long-term smoker';
      return 'Very long-term smoker';
    }
    
    if (label.toLowerCase().includes('quit')) {
      if (numValue === 0) return 'First attempt';
      if (numValue === 1) return 'Second attempt';
      if (numValue < 5) return 'Multiple attempts';
      return 'Many attempts - shows determination!';
    }
    
    return '';
  };

  return (
    <View style={[styles.container, style]}>
      {/* Label */}
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}

      {/* Input container */}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            transform: [{ translateX: shakeAnim }],
          },
          disabled && styles.inputContainerDisabled,
        ]}
      >
        {/* Decrement button */}
        {showButtons && (
          <TouchableOpacity
            style={[styles.button, styles.decrementButton]}
            onPress={handleDecrement}
            disabled={disabled || parseInt(inputValue, 10) <= minValue}
          >
            <Text style={[
              styles.buttonText,
              (disabled || parseInt(inputValue, 10) <= minValue) && styles.buttonTextDisabled
            ]}>
              −
            </Text>
          </TouchableOpacity>
        )}

        {/* Text input */}
        <TextInput
          ref={inputRef}
          style={[
            styles.textInput,
            !showButtons && styles.textInputFullWidth,
            disabled && styles.textInputDisabled,
          ]}
          value={inputValue}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textLight}
          keyboardType="numeric"
          maxLength={3}
          editable={!disabled}
          autoFocus={autoFocus}
          selectTextOnFocus
        />

        {/* Increment button */}
        {showButtons && (
          <TouchableOpacity
            style={[styles.button, styles.incrementButton]}
            onPress={handleIncrement}
            disabled={disabled || parseInt(inputValue, 10) >= maxValue}
          >
            <Text style={[
              styles.buttonText,
              (disabled || parseInt(inputValue, 10) >= maxValue) && styles.buttonTextDisabled
            ]}>
              +
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Value message */}
      {inputValue && getValueMessage() && (
        <Text style={styles.valueMessage}>
          {getValueMessage()}
        </Text>
      )}

      {/* Error message */}
      {showValidation && !isValid && errorMessage && (
        <Text style={styles.errorMessage}>
          {errorMessage}
        </Text>
      )}

      {/* Range indicator */}
      <Text style={styles.rangeText}>
        Range: {minValue} - {maxValue}
      </Text>
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
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
  },
  
  inputContainerDisabled: {
    backgroundColor: theme.colors.borderLight,
    opacity: 0.6,
  },
  
  textInput: {
    flex: 1,
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    textAlign: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  
  textInputFullWidth: {
    paddingHorizontal: theme.spacing.lg,
  },
  
  textInputDisabled: {
    color: theme.colors.textLight,
  },
  
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.borderLight,
  },
  
  decrementButton: {
    borderTopLeftRadius: theme.borderRadius.md - 2,
    borderBottomLeftRadius: theme.borderRadius.md - 2,
  },
  
  incrementButton: {
    borderTopRightRadius: theme.borderRadius.md - 2,
    borderBottomRightRadius: theme.borderRadius.md - 2,
  },
  
  buttonText: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
  },
  
  buttonTextDisabled: {
    color: theme.colors.textLight,
  },
  
  valueMessage: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    fontWeight: theme.typography.fontWeights.medium,
  },
  
  errorMessage: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    fontWeight: theme.typography.fontWeights.medium,
  },
  
  rangeText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
});

export default NumberInput;
