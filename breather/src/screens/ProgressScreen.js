import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/colors';
import EnhancedButton from '../components/EnhancedButton';

const { width } = Dimensions.get('window');

const ProgressScreen = ({ navigation }) => {
  const [streakData, setStreakData] = useState({
    currentStreak: 7,
    longestStreak: 15,
    totalSessions: 42,
    totalMinutes: 210,
    weeklyGoal: 5,
    weeklyProgress: 3,
  });

  const [weeklyData] = useState([
    { day: 'Mon', completed: true, sessions: 2 },
    { day: 'Tue', completed: true, sessions: 1 },
    { day: 'Wed', completed: true, sessions: 1 },
    { day: 'Thu', completed: false, sessions: 0 },
    { day: 'Fri', completed: false, sessions: 0 },
    { day: 'Sat', completed: false, sessions: 0 },
    { day: 'Sun', completed: false, sessions: 0 },
  ]);

  const renderStatCard = (title, value, subtitle, color = theme.colors.primary) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderWeeklyProgress = () => (
    <View style={styles.weeklyContainer}>
      <Text style={styles.sectionTitle}>This Week</Text>
      <View style={styles.weeklyGrid}>
        {weeklyData.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <Text style={styles.dayLabel}>{day.day}</Text>
            <View style={[
              styles.dayCircle,
              day.completed && styles.dayCompleted
            ]}>
              <Text style={[
                styles.dayText,
                day.completed && styles.dayTextCompleted
              ]}>
                {day.sessions}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.progressBar}>
        <View style={[
          styles.progressFill,
          { width: `${(streakData.weeklyProgress / streakData.weeklyGoal) * 100}%` }
        ]} />
      </View>
      <Text style={styles.progressText}>
        {streakData.weeklyProgress} of {streakData.weeklyGoal} sessions this week
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Progress</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Streak Section */}
        <LinearGradient
          colors={[theme.colors.primary + '20', theme.colors.primary + '05']}
          style={styles.streakContainer}
        >
          <Text style={styles.streakTitle}>Current Streak</Text>
          <Text style={styles.streakNumber}>{streakData.currentStreak}</Text>
          <Text style={styles.streakLabel}>days</Text>
          <Text style={styles.streakSubtext}>
            Keep it up! Your longest streak is {streakData.longestStreak} days.
          </Text>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            {renderStatCard(
              'Total Sessions',
              streakData.totalSessions,
              'All time',
              theme.colors.success
            )}
            {renderStatCard(
              'Total Minutes',
              streakData.totalMinutes,
              'Breathing time',
              theme.colors.info
            )}
          </View>
          <View style={styles.statsRow}>
            {renderStatCard(
              'Longest Streak',
              `${streakData.longestStreak} days`,
              'Personal best',
              theme.colors.warning
            )}
            {renderStatCard(
              'This Week',
              `${streakData.weeklyProgress}/${streakData.weeklyGoal}`,
              'Sessions',
              theme.colors.secondary
            )}
          </View>
        </View>

        {/* Weekly Progress */}
        {renderWeeklyProgress()}

        {/* Achievements Section */}
        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>🔥</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>Week Warrior</Text>
              <Text style={styles.achievementDesc}>Completed 5 sessions this week</Text>
            </View>
          </View>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>🧘</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>Mindful Moments</Text>
              <Text style={styles.achievementDesc}>Reached 200 total minutes</Text>
            </View>
          </View>
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
  streakContainer: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.md,
  },
  streakTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  streakNumber: {
    fontSize: theme.typography.fontSizes.xxxl * 2,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
    lineHeight: theme.typography.fontSizes.xxxl * 2,
  },
  streakLabel: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  streakSubtext: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.md,
  },
  statsContainer: {
    marginBottom: theme.spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderLeftWidth: 4,
    ...theme.shadows.sm,
  },
  statValue: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
  },
  statSubtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  weeklyContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  weeklyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCompleted: {
    backgroundColor: theme.colors.success,
  },
  dayText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textSecondary,
  },
  dayTextCompleted: {
    color: theme.colors.textOnPrimary,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.borderLight,
    borderRadius: 3,
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: 3,
  },
  progressText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  achievementsContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  achievementDesc: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
});

export default ProgressScreen;
