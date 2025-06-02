import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * OnboardingService - Manages onboarding assessment data and state
 * Integrates with existing AsyncStorage patterns in the app
 */
class OnboardingService {
  static STORAGE_KEYS = {
    ASSESSMENT_DATA: '@onboarding_assessment',
    ASSESSMENT_COMPLETE: '@assessment_complete',
    ONBOARDING_COMPLETE: '@onboarding_complete', // Legacy key for compatibility
  };

  /**
   * Save complete assessment data to storage
   * @param {Object} data - Complete assessment data object
   */
  static async saveAssessmentData(data) {
    try {
      const assessmentData = {
        ...data,
        completedAt: new Date().toISOString(),
        version: '1.0',
      };
      
      await AsyncStorage.setItem(
        this.STORAGE_KEYS.ASSESSMENT_DATA,
        JSON.stringify(assessmentData)
      );
      
      console.log('Assessment data saved successfully');
      return true;
    } catch (error) {
      console.error('Failed to save assessment data:', error);
      return false;
    }
  }

  /**
   * Get stored assessment data
   * @returns {Object|null} Assessment data or null if not found
   */
  static async getAssessmentData() {
    try {
      const data = await AsyncStorage.getItem(this.STORAGE_KEYS.ASSESSMENT_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get assessment data:', error);
      return null;
    }
  }

  /**
   * Save partial assessment data (for step-by-step completion)
   * @param {string} step - Step identifier (smoking, chakra, etc.)
   * @param {Object} stepData - Data for this specific step
   */
  static async saveStepData(step, stepData) {
    try {
      const existingData = await this.getAssessmentData() || {};
      const updatedData = {
        ...existingData,
        [step]: stepData,
        lastUpdated: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(
        this.STORAGE_KEYS.ASSESSMENT_DATA,
        JSON.stringify(updatedData)
      );
      
      return true;
    } catch (error) {
      console.error(`Failed to save step data for ${step}:`, error);
      return false;
    }
  }

  /**
   * Get data for a specific step
   * @param {string} step - Step identifier
   * @returns {Object|null} Step data or null
   */
  static async getStepData(step) {
    try {
      const data = await this.getAssessmentData();
      return data ? data[step] : null;
    } catch (error) {
      console.error(`Failed to get step data for ${step}:`, error);
      return null;
    }
  }

  /**
   * Mark assessment as complete and update legacy onboarding flag
   */
  static async markAssessmentComplete() {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEYS.ASSESSMENT_COMPLETE, 'true');
      // Also update existing onboarding complete flag for compatibility
      await AsyncStorage.setItem(this.STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
      
      console.log('Assessment marked as complete');
      return true;
    } catch (error) {
      console.error('Failed to mark assessment complete:', error);
      return false;
    }
  }

  /**
   * Check if assessment is complete
   * @returns {boolean} True if assessment is complete
   */
  static async isAssessmentComplete() {
    try {
      const complete = await AsyncStorage.getItem(this.STORAGE_KEYS.ASSESSMENT_COMPLETE);
      return complete === 'true';
    } catch (error) {
      console.error('Failed to check assessment completion:', error);
      return false;
    }
  }

  /**
   * Check if legacy onboarding is complete (for migration)
   * @returns {boolean} True if legacy onboarding is complete
   */
  static async isLegacyOnboardingComplete() {
    try {
      const complete = await AsyncStorage.getItem(this.STORAGE_KEYS.ONBOARDING_COMPLETE);
      return complete === 'true';
    } catch (error) {
      console.error('Failed to check legacy onboarding completion:', error);
      return false;
    }
  }

  /**
   * Determine onboarding state for existing vs new users
   * @returns {string} 'show_full_onboarding' | 'show_optional_assessment' | 'skip_onboarding'
   */
  static async getOnboardingState() {
    try {
      const legacyComplete = await this.isLegacyOnboardingComplete();
      const assessmentComplete = await this.isAssessmentComplete();
      
      if (legacyComplete && !assessmentComplete) {
        // Existing user who completed old onboarding but not new assessment
        return 'show_optional_assessment';
      } else if (!legacyComplete && !assessmentComplete) {
        // New user - show full new onboarding
        return 'show_full_onboarding';
      } else {
        // User has completed new assessment
        return 'skip_onboarding';
      }
    } catch (error) {
      console.error('Failed to determine onboarding state:', error);
      return 'show_full_onboarding'; // Default to full onboarding on error
    }
  }

  /**
   * Reset assessment data (for testing or user request)
   */
  static async resetAssessment() {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEYS.ASSESSMENT_DATA);
      await AsyncStorage.removeItem(this.STORAGE_KEYS.ASSESSMENT_COMPLETE);
      
      console.log('Assessment data reset successfully');
      return true;
    } catch (error) {
      console.error('Failed to reset assessment data:', error);
      return false;
    }
  }

  /**
   * Reset ALL onboarding data (legacy + new assessment) for testing
   */
  static async resetAllOnboardingData() {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEYS.ASSESSMENT_DATA);
      await AsyncStorage.removeItem(this.STORAGE_KEYS.ASSESSMENT_COMPLETE);
      await AsyncStorage.removeItem(this.STORAGE_KEYS.ONBOARDING_COMPLETE);

      console.log('All onboarding data reset successfully');
      return true;
    } catch (error) {
      console.error('Failed to reset all onboarding data:', error);
      return false;
    }
  }

  /**
   * Get assessment progress (percentage complete)
   * @returns {number} Progress percentage (0-100)
   */
  static async getAssessmentProgress() {
    try {
      const data = await this.getAssessmentData();
      if (!data) return 0;

      const requiredSteps = ['userProfile', 'smokingData', 'chakraData', 'scores'];
      const completedSteps = requiredSteps.filter(step => data[step]);

      return Math.round((completedSteps.length / requiredSteps.length) * 100);
    } catch (error) {
      console.error('Failed to calculate assessment progress:', error);
      return 0;
    }
  }

  /**
   * Validate assessment data completeness
   * @param {Object} data - Assessment data to validate
   * @returns {Object} Validation result with isValid and missing fields
   */
  static validateAssessmentData(data) {
    const requiredFields = {
      userProfile: ['language', 'completedAssessment'],
      smokingData: ['cigarettesPerDay', 'yearsSmoked', 'smokingReasons', 'breathingDifficulties', 'quitAttempts'],
      chakraData: ['responses', 'calculatedScores'],
      scores: ['lungHealthScore', 'overallWellnessScore']
    };

    const missing = [];
    let isValid = true;

    Object.keys(requiredFields).forEach(section => {
      if (!data[section]) {
        missing.push(`Missing section: ${section}`);
        isValid = false;
        return;
      }

      requiredFields[section].forEach(field => {
        if (data[section][field] === undefined || data[section][field] === null) {
          missing.push(`Missing field: ${section}.${field}`);
          isValid = false;
        }
      });
    });

    return { isValid, missing };
  }
}

export default OnboardingService;
