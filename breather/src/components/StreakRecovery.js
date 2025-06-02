import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/colors';
import EnhancedButton from './EnhancedButton';

const { width } = Dimensions.get('window');

const StreakRecovery = ({ 
  visible, 
  currentStreak, 
  onRestart, 
  onGracePeriod, 
  onCancel 
}) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <LinearGradient
            colors={[theme.colors.warning + '20', theme.colors.warning + '05']}
            style={styles.content}
          >
            {/* Icon */}
            <Text style={styles.icon}>💔</Text>

            {/* Title */}
            <Text style={styles.title}>Streak Interrupted</Text>

            {/* Message */}
            <Text style={styles.message}>
              Your {currentStreak}-day streak has been interrupted. Don't worry - 
              setbacks are part of the journey. What would you like to do?
            </Text>

            {/* Options */}
            <View style={styles.optionsContainer}>
              <Text style={styles.optionsTitle}>Choose your next step:</Text>

              {/* Grace Period Option */}
              <TouchableOpacity style={styles.optionCard} onPress={onGracePeriod}>
                <View style={styles.optionHeader}>
                  <Text style={styles.optionIcon}>🛡️</Text>
                  <Text style={styles.optionTitle}>Use Grace Period</Text>
                </View>
                <Text style={styles.optionDescription}>
                  Continue your streak with a one-time grace period. 
                  Everyone deserves a second chance.
                </Text>
              </TouchableOpacity>

              {/* Restart Option */}
              <TouchableOpacity style={styles.optionCard} onPress={onRestart}>
                <View style={styles.optionHeader}>
                  <Text style={styles.optionIcon}>🔄</Text>
                  <Text style={styles.optionTitle}>Start Fresh</Text>
                </View>
                <Text style={styles.optionDescription}>
                  Reset your streak and begin again. Every restart is a new opportunity.
                </Text>
              </TouchableOpacity>
            </View>

            {/* Motivation */}
            <View style={styles.motivationContainer}>
              <Text style={styles.motivationText}>
                "The greatest glory is not in never falling, but in rising every time we fall."
              </Text>
            </View>

            {/* Cancel Button */}
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>I'll decide later</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
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
    width: width * 0.9,
    maxWidth: 400,
  },
  content: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  icon: {
    fontSize: 60,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  message: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.md,
    marginBottom: theme.spacing.xl,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  optionsTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  optionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: theme.spacing.sm,
  },
  optionTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  optionDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },
  motivationContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  motivationText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },
  cancelButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default StreakRecovery;
