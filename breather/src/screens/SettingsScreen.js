import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
} from 'react-native';
import { theme } from '../theme/colors';
import EnhancedButton from '../components/EnhancedButton';
import OnboardingService from '../services/OnboardingService';

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    dailyReminders: true,
    soundEffects: true,
    hapticFeedback: true,
    darkMode: false,
    autoAdvance: true,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const resetOnboarding = () => {
    Alert.alert(
      'Reset Onboarding',
      'This will clear all your assessment data and restart the onboarding process. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await OnboardingService.resetAllOnboardingData();
              Alert.alert('Success', 'Onboarding data has been reset. Please restart the app.');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset onboarding data.');
            }
          }
        }
      ]
    );
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your progress, streaks, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'All data has been cleared.');
          }
        }
      ]
    );
  };

  const renderSettingItem = (title, subtitle, value, onToggle, type = 'switch') => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary + '40' }}
          thumbColor={value ? theme.colors.primary : theme.colors.textLight}
        />
      )}
    </View>
  );

  const renderSection = (title, children) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notifications */}
        {renderSection('Notifications', [
          renderSettingItem(
            'Push Notifications',
            'Receive breathing reminders and progress updates',
            settings.notifications,
            () => toggleSetting('notifications')
          ),
          renderSettingItem(
            'Daily Reminders',
            'Get reminded to practice breathing exercises',
            settings.dailyReminders,
            () => toggleSetting('dailyReminders')
          ),
        ])}

        {/* Experience */}
        {renderSection('Experience', [
          renderSettingItem(
            'Sound Effects',
            'Play audio cues during breathing sessions',
            settings.soundEffects,
            () => toggleSetting('soundEffects')
          ),
          renderSettingItem(
            'Haptic Feedback',
            'Feel vibrations during breathing guidance',
            settings.hapticFeedback,
            () => toggleSetting('hapticFeedback')
          ),
          renderSettingItem(
            'Auto-advance',
            'Automatically move to next onboarding step',
            settings.autoAdvance,
            () => toggleSetting('autoAdvance')
          ),
        ])}

        {/* Appearance */}
        {renderSection('Appearance', [
          renderSettingItem(
            'Dark Mode',
            'Use dark theme throughout the app',
            settings.darkMode,
            () => toggleSetting('darkMode')
          ),
        ])}

        {/* Data Management */}
        {renderSection('Data Management', [
          <TouchableOpacity key="reset" style={styles.actionItem} onPress={resetOnboarding}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.colors.warning }]}>
                Reset Onboarding
              </Text>
              <Text style={styles.settingSubtitle}>
                Clear assessment data and restart onboarding
              </Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>,
          
          <TouchableOpacity key="clear" style={styles.actionItem} onPress={clearAllData}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.colors.error }]}>
                Clear All Data
              </Text>
              <Text style={styles.settingSubtitle}>
                Permanently delete all progress and settings
              </Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>,
        ])}

        {/* About */}
        {renderSection('About', [
          <View key="version" style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Version</Text>
              <Text style={styles.settingSubtitle}>Breather v1.0.0</Text>
            </View>
          </View>,
          
          <TouchableOpacity key="privacy" style={styles.actionItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
              <Text style={styles.settingSubtitle}>Learn how we protect your data</Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>,
          
          <TouchableOpacity key="terms" style={styles.actionItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Terms of Service</Text>
              <Text style={styles.settingSubtitle}>Read our terms and conditions</Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>,
        ])}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for your wellbeing
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    width: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  sectionContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  settingSubtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },
  actionArrow: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.md,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  footerText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default SettingsScreen;
