/**
 * ScoringService - Handles all scoring calculations for the onboarding assessment
 * Includes lung health scoring, chakra balance scoring, and recommendation generation
 */
class ScoringService {
  
  /**
   * Calculate lung health score based on smoking habits
   * @param {Object} smokingData - User's smoking data
   * @returns {number} Lung health score (0-100)
   */
  static calculateLungScore(smokingData) {
    const {
      cigarettesPerDay = 0,
      yearsSmoked = 0,
      breathingDifficulties = false,
      quitAttempts = 0
    } = smokingData;

    let score = 100;

    // Cigarettes per day impact (0-60 points deduction)
    // More cigarettes = exponentially worse impact
    const dailyImpact = Math.min(cigarettesPerDay * 1.5, 60);
    score -= dailyImpact;

    // Years smoking impact (0-30 points deduction)
    // Long-term smoking has cumulative effects
    const yearsImpact = Math.min(yearsSmoked * 1.5, 30);
    score -= yearsImpact;

    // Breathing difficulties penalty (15 points)
    // Indicates existing lung damage
    if (breathingDifficulties) {
      score -= 15;
    }

    // Quit attempts bonus (shows motivation and awareness)
    // Each attempt shows learning and determination
    const quitBonus = Math.min(quitAttempts * 2, 10);
    score += quitBonus;

    // Ensure score stays within valid bounds
    return Math.max(Math.min(Math.round(score), 100), 5);
  }

  /**
   * Calculate chakra scores from Likert scale responses
   * @param {Object} responses - Chakra responses (1-5 scale)
   * @returns {Object} Calculated chakra scores (0-10 scale)
   */
  static calculateChakraScores(responses) {
    const scores = {};

    Object.keys(responses).forEach(chakra => {
      const response = responses[chakra];
      
      // Convert 1-5 Likert scale to 0-10 scale
      // Lower response (1-2) = more imbalanced = lower score
      // Higher response (4-5) = more balanced = higher score
      let score;
      
      switch (response) {
        case 1: score = 1; break;  // Strongly disagree - very imbalanced
        case 2: score = 3; break;  // Disagree - imbalanced
        case 3: score = 5; break;  // Neutral - moderately balanced
        case 4: score = 7; break;  // Agree - balanced
        case 5: score = 9; break;  // Strongly agree - very balanced
        default: score = 5; break; // Default to neutral
      }
      
      scores[chakra] = score;
    });

    return scores;
  }

  /**
   * Identify the most imbalanced chakras that need attention
   * @param {Object} scores - Calculated chakra scores
   * @returns {Array} Array of chakra names sorted by imbalance (most imbalanced first)
   */
  static getImbalancedChakras(scores) {
    return Object.entries(scores)
      .filter(([chakra, score]) => score < 6) // Below 6/10 considered imbalanced
      .sort((a, b) => a[1] - b[1]) // Sort by lowest score first
      .slice(0, 3) // Top 3 most imbalanced
      .map(([chakra]) => chakra);
  }

  /**
   * Calculate overall wellness score combining lung health and chakra balance
   * @param {number} lungScore - Lung health score (0-100)
   * @param {Object} chakraScores - Individual chakra scores
   * @returns {number} Overall wellness score (0-100)
   */
  static calculateOverallWellnessScore(lungScore, chakraScores) {
    // Calculate average chakra score
    const chakraValues = Object.values(chakraScores);
    const avgChakraScore = chakraValues.reduce((sum, score) => sum + score, 0) / chakraValues.length;
    
    // Convert chakra score from 0-10 to 0-100 scale
    const chakraScoreNormalized = (avgChakraScore / 10) * 100;
    
    // Weight: 60% lung health, 40% chakra balance
    // Lung health has more immediate physical impact
    const overallScore = (lungScore * 0.6) + (chakraScoreNormalized * 0.4);
    
    return Math.round(overallScore);
  }

  /**
   * Calculate improvement potential score
   * @param {number} lungScore - Current lung health score
   * @param {Object} smokingData - Smoking data for context
   * @returns {number} Projected improvement score after 3 months
   */
  static calculateImprovementPotential(lungScore, smokingData) {
    const { cigarettesPerDay, yearsSmoked, quitAttempts } = smokingData;
    
    let improvementPotential = lungScore;
    
    // Base improvement from quitting smoking
    if (cigarettesPerDay > 0) {
      // More cigarettes = more potential for improvement
      const quitBenefit = Math.min(cigarettesPerDay * 2, 40);
      improvementPotential += quitBenefit;
    }
    
    // Age factor - younger people recover faster
    // Assume less years smoking = better recovery potential
    if (yearsSmoked < 5) {
      improvementPotential += 15; // Young smokers recover quickly
    } else if (yearsSmoked < 15) {
      improvementPotential += 10; // Moderate recovery
    } else {
      improvementPotential += 5;  // Slower but still meaningful recovery
    }
    
    // Previous quit attempts show determination
    if (quitAttempts > 0) {
      improvementPotential += Math.min(quitAttempts * 3, 10);
    }
    
    // Cap at 95 to be realistic
    return Math.min(Math.round(improvementPotential), 95);
  }

  /**
   * Generate personalized recommendations based on scores
   * @param {number} lungScore - Lung health score
   * @param {Array} imbalancedChakras - List of imbalanced chakras
   * @param {Object} smokingData - Smoking data for context
   * @returns {Array} Array of recommendation objects
   */
  static generateRecommendations(lungScore, imbalancedChakras, smokingData) {
    const recommendations = [];

    // Lung health recommendations
    if (lungScore < 50) {
      recommendations.push({
        type: 'breathing',
        priority: 'high',
        title: 'Focus on Lung Recovery',
        description: 'Daily breathing exercises can significantly improve lung function and capacity',
        action: 'Start Breathing Session',
        icon: '🫁',
        estimatedBenefit: 'Improve lung capacity by 15-25% in 3 months'
      });
    } else if (lungScore < 75) {
      recommendations.push({
        type: 'breathing',
        priority: 'medium',
        title: 'Maintain Lung Health',
        description: 'Regular breathing practice will help maintain and improve your lung health',
        action: 'Start Breathing Session',
        icon: '🌬️',
        estimatedBenefit: 'Maintain current health and prevent decline'
      });
    }

    // Smoking cessation recommendations
    if (smokingData.cigarettesPerDay > 0) {
      recommendations.push({
        type: 'cessation',
        priority: 'high',
        title: 'Quit Smoking Support',
        description: 'Every cigarette you don\'t smoke is a victory for your health',
        action: 'View Quit Plan',
        icon: '🚭',
        estimatedBenefit: 'Reduce health risks by 50% within 1 year'
      });
    }

    // Chakra recommendations (top 2 most imbalanced)
    imbalancedChakras.slice(0, 2).forEach(chakra => {
      const chakraInfo = this.getChakraRecommendation(chakra);
      recommendations.push({
        type: 'chakra',
        priority: 'medium',
        chakra: chakra,
        title: `${chakraInfo.name} Healing`,
        description: chakraInfo.healingDescription,
        action: `Start ${chakraInfo.name} Meditation`,
        icon: chakraInfo.icon,
        estimatedBenefit: chakraInfo.benefit
      });
    });

    // Sort by priority (high first)
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return recommendations.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  }

  /**
   * Get chakra-specific recommendation information
   * @param {string} chakra - Chakra name
   * @returns {Object} Chakra recommendation details
   */
  static getChakraRecommendation(chakra) {
    const chakraRecommendations = {
      root: {
        name: 'Root Chakra',
        healingDescription: 'Focus on grounding exercises to feel more secure and stable',
        icon: '🔴',
        benefit: 'Reduce anxiety and feel more grounded'
      },
      sacral: {
        name: 'Sacral Chakra',
        healingDescription: 'Reconnect with creativity and emotional flow',
        icon: '🟠',
        benefit: 'Enhance creativity and emotional balance'
      },
      solarPlexus: {
        name: 'Solar Plexus Chakra',
        healingDescription: 'Build confidence and reclaim your personal power',
        icon: '🟡',
        benefit: 'Boost self-confidence and decision-making'
      },
      heart: {
        name: 'Heart Chakra',
        healingDescription: 'Open to love, compassion, and emotional healing',
        icon: '💚',
        benefit: 'Improve relationships and self-compassion'
      },
      throat: {
        name: 'Throat Chakra',
        healingDescription: 'Find your voice and express your truth clearly',
        icon: '🔵',
        benefit: 'Enhance communication and self-expression'
      },
      thirdEye: {
        name: 'Third Eye Chakra',
        healingDescription: 'Develop intuition and inner wisdom',
        icon: '🟣',
        benefit: 'Strengthen intuition and mental clarity'
      },
      crown: {
        name: 'Crown Chakra',
        healingDescription: 'Connect with higher consciousness and purpose',
        icon: '🟪',
        benefit: 'Deepen spiritual connection and purpose'
      }
    };

    return chakraRecommendations[chakra] || {
      name: 'Unknown Chakra',
      healingDescription: 'Focus on balance and harmony',
      icon: '⚪',
      benefit: 'Improve overall balance'
    };
  }

  /**
   * Get score interpretation message
   * @param {number} score - Score to interpret (0-100)
   * @param {string} type - Type of score ('lung' or 'wellness')
   * @returns {Object} Interpretation with message and color
   */
  static getScoreInterpretation(score, type = 'lung') {
    const interpretations = {
      lung: {
        excellent: { min: 80, message: 'Excellent lung health! Keep up the great work.', color: '#27AE60' },
        good: { min: 60, message: 'Good lung health with room for improvement.', color: '#F39C12' },
        fair: { min: 40, message: 'Fair lung health. Focus on breathing exercises.', color: '#E67E22' },
        poor: { min: 20, message: 'Poor lung health. Immediate action recommended.', color: '#E74C3C' },
        critical: { min: 0, message: 'Critical lung health. Seek medical advice.', color: '#C0392B' }
      },
      wellness: {
        excellent: { min: 80, message: 'Excellent overall wellness! You\'re thriving.', color: '#27AE60' },
        good: { min: 60, message: 'Good wellness with some areas to focus on.', color: '#F39C12' },
        fair: { min: 40, message: 'Fair wellness. Regular practice will help.', color: '#E67E22' },
        poor: { min: 20, message: 'Wellness needs attention. Start with basics.', color: '#E74C3C' },
        critical: { min: 0, message: 'Wellness requires immediate focus.', color: '#C0392B' }
      }
    };

    const scoreType = interpretations[type];
    
    for (const [level, data] of Object.entries(scoreType)) {
      if (score >= data.min) {
        return { level, message: data.message, color: data.color };
      }
    }
    
    return scoreType.critical;
  }
}

export default ScoringService;
