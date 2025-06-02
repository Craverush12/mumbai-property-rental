import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  QUIT_DATE: 'quit_date',
  STREAK_DATA: 'streak_data',
  MILESTONES: 'milestones',
  GRACE_PERIOD_USED: 'grace_period_used',
  LAST_CHECK_DATE: 'last_check_date',
};

class StreakService {
  // Initialize streak with quit date
  static async initializeStreak(quitDate) {
    try {
      const streakData = {
        quitDate: quitDate.toISOString(),
        startDate: quitDate.toISOString(),
        currentStreak: 0,
        longestStreak: 0,
        totalRelapses: 0,
        gracePeriodUsed: false,
        lastCheckDate: new Date().toISOString(),
      };

      await AsyncStorage.setItem(STORAGE_KEYS.QUIT_DATE, quitDate.toISOString());
      await AsyncStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(streakData));
      await AsyncStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify([]));
      
      return streakData;
    } catch (error) {
      console.error('Error initializing streak:', error);
      throw error;
    }
  }

  // Check if user has an active streak
  static async hasActiveStreak() {
    try {
      const quitDate = await AsyncStorage.getItem(STORAGE_KEYS.QUIT_DATE);
      return quitDate !== null;
    } catch (error) {
      console.error('Error checking active streak:', error);
      return false;
    }
  }

  // Get quit date
  static async getQuitDate() {
    try {
      const quitDateString = await AsyncStorage.getItem(STORAGE_KEYS.QUIT_DATE);
      return quitDateString ? new Date(quitDateString) : null;
    } catch (error) {
      console.error('Error getting quit date:', error);
      return null;
    }
  }

  // Get current streak data
  static async getStreakData() {
    try {
      const streakDataString = await AsyncStorage.getItem(STORAGE_KEYS.STREAK_DATA);
      if (!streakDataString) return null;

      const streakData = JSON.parse(streakDataString);
      
      // Update current streak based on time passed
      const updatedData = await this.updateCurrentStreak(streakData);
      
      return updatedData;
    } catch (error) {
      console.error('Error getting streak data:', error);
      return null;
    }
  }

  // Update current streak based on time passed
  static async updateCurrentStreak(streakData) {
    try {
      const now = new Date();
      const quitDate = new Date(streakData.quitDate);
      
      // Calculate days since quit
      const daysSinceQuit = Math.floor((now - quitDate) / (1000 * 60 * 60 * 24));
      
      // Update current streak
      streakData.currentStreak = Math.max(0, daysSinceQuit);
      
      // Update longest streak if current is higher
      if (streakData.currentStreak > streakData.longestStreak) {
        streakData.longestStreak = streakData.currentStreak;
      }
      
      // Update last check date
      streakData.lastCheckDate = now.toISOString();
      
      // Save updated data
      await AsyncStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(streakData));
      
      return streakData;
    } catch (error) {
      console.error('Error updating current streak:', error);
      return streakData;
    }
  }

  // Get current streak number
  static async getCurrentStreak() {
    try {
      const streakData = await this.getStreakData();
      return streakData ? streakData.currentStreak : 0;
    } catch (error) {
      console.error('Error getting current streak:', error);
      return 0;
    }
  }

  // Check for new milestones
  static async checkMilestones() {
    try {
      const streakData = await this.getStreakData();
      if (!streakData) return [];

      const currentStreak = streakData.currentStreak;
      const existingMilestonesString = await AsyncStorage.getItem(STORAGE_KEYS.MILESTONES);
      const existingMilestones = existingMilestonesString ? JSON.parse(existingMilestonesString) : [];

      // Define milestone thresholds
      const milestoneThresholds = [1, 3, 7, 14, 30, 60, 90, 180, 365];
      
      const newMilestones = [];
      
      for (const threshold of milestoneThresholds) {
        if (currentStreak >= threshold && !existingMilestones.includes(threshold)) {
          newMilestones.push({
            type: 'streak',
            value: threshold,
            achievedDate: new Date().toISOString(),
          });
          existingMilestones.push(threshold);
        }
      }

      // Save updated milestones
      if (newMilestones.length > 0) {
        await AsyncStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(existingMilestones));
      }

      return newMilestones;
    } catch (error) {
      console.error('Error checking milestones:', error);
      return [];
    }
  }

  // Handle relapse - restart streak
  static async handleRelapse() {
    try {
      const streakData = await this.getStreakData();
      if (!streakData) return null;

      // Reset streak but keep historical data
      const newQuitDate = new Date();
      streakData.quitDate = newQuitDate.toISOString();
      streakData.currentStreak = 0;
      streakData.totalRelapses += 1;
      streakData.gracePeriodUsed = false; // Reset grace period
      streakData.lastCheckDate = newQuitDate.toISOString();

      // Save updated data
      await AsyncStorage.setItem(STORAGE_KEYS.QUIT_DATE, newQuitDate.toISOString());
      await AsyncStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(streakData));

      return streakData;
    } catch (error) {
      console.error('Error handling relapse:', error);
      throw error;
    }
  }

  // Use grace period (one-time forgiveness)
  static async useGracePeriod() {
    try {
      const streakData = await this.getStreakData();
      if (!streakData) throw new Error('No streak data found');

      if (streakData.gracePeriodUsed) {
        throw new Error('Grace period already used');
      }

      // Mark grace period as used but don't reset streak
      streakData.gracePeriodUsed = true;
      streakData.lastCheckDate = new Date().toISOString();

      // Save updated data
      await AsyncStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(streakData));

      return streakData;
    } catch (error) {
      console.error('Error using grace period:', error);
      throw error;
    }
  }

  // Get milestone achievements
  static async getMilestones() {
    try {
      const milestonesString = await AsyncStorage.getItem(STORAGE_KEYS.MILESTONES);
      return milestonesString ? JSON.parse(milestonesString) : [];
    } catch (error) {
      console.error('Error getting milestones:', error);
      return [];
    }
  }

  // Calculate money saved (assuming $10 per pack, 1 pack per day)
  static async getMoneySaved(pricePerPack = 10, packsPerDay = 1) {
    try {
      const currentStreak = await this.getCurrentStreak();
      return currentStreak * pricePerPack * packsPerDay;
    } catch (error) {
      console.error('Error calculating money saved:', error);
      return 0;
    }
  }

  // Calculate health improvements (simplified)
  static async getHealthImprovements() {
    try {
      const currentStreak = await this.getCurrentStreak();
      
      const improvements = [];
      
      if (currentStreak >= 1) {
        improvements.push({
          title: 'Oxygen levels normalizing',
          description: 'Your blood oxygen levels are improving',
          icon: '🫁',
        });
      }
      
      if (currentStreak >= 3) {
        improvements.push({
          title: 'Taste and smell improving',
          description: 'Your senses are becoming sharper',
          icon: '👃',
        });
      }
      
      if (currentStreak >= 7) {
        improvements.push({
          title: 'Circulation improving',
          description: 'Blood flow is getting better',
          icon: '❤️',
        });
      }
      
      if (currentStreak >= 30) {
        improvements.push({
          title: 'Lung function improving',
          description: 'Your breathing capacity is increasing',
          icon: '💪',
        });
      }

      return improvements;
    } catch (error) {
      console.error('Error getting health improvements:', error);
      return [];
    }
  }

  // Reset all streak data (for testing or complete reset)
  static async resetAllData() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.QUIT_DATE,
        STORAGE_KEYS.STREAK_DATA,
        STORAGE_KEYS.MILESTONES,
        STORAGE_KEYS.GRACE_PERIOD_USED,
        STORAGE_KEYS.LAST_CHECK_DATE,
      ]);
    } catch (error) {
      console.error('Error resetting streak data:', error);
      throw error;
    }
  }
}

export default StreakService;
