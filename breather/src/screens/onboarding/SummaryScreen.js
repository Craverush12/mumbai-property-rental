import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { theme } from '../../theme/colors';
import EnhancedButton from '../../components/EnhancedButton';
import EnhancedCard from '../../components/EnhancedCard';
import ScoreDisplay from '../../components/onboarding/ScoreDisplay';
import OnboardingService from '../../services/OnboardingService';
import ScoringService from '../../services/ScoringService';
import { getChakraInfo, getChakrasByScore } from '../../utils/chakraData';

/**
 * SummaryScreen - Results and recommendations screen
 * Replaces OnboardingScreen4.js with comprehensive assessment results
 */
const SummaryScreen = ({ navigation }) => {
  const [assessmentData, setAssessmentData] = useState(null);
  const [scores, setScores] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const celebrationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadAssessmentData();
  }, []);

  useEffect(() => {
    if (assessmentData && scores) {
      startAnimations();
    }
  }, [assessmentData, scores]);

  const loadAssessmentData = async () => {
    try {
      const data = await OnboardingService.getAssessmentData();
      
      if (data && data.smokingData && data.chakraData) {
        // Calculate final scores
        const lungScore = ScoringService.calculateLungScore(data.smokingData);
        const overallWellnessScore = ScoringService.calculateOverallWellnessScore(
          lungScore,
          data.chakraData.calculatedScores
        );
        const improvementPotential = ScoringService.calculateImprovementPotential(
          lungScore,
          data.smokingData
        );

        const calculatedScores = {
          lungHealthScore: lungScore,
          overallWellnessScore,
          improvementPotential,
        };

        // Generate recommendations
        const recs = ScoringService.generateRecommendations(
          lungScore,
          data.chakraData.imbalancedChakras,
          data.smokingData
        );

        // Save final scores
        await OnboardingService.saveStepData('scores', calculatedScores);
        await OnboardingService.markAssessmentComplete();

        setAssessmentData(data);
        setScores(calculatedScores);
        setRecommendations(recs);
      }
    } catch (error) {
      console.error('Error loading assessment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAnimations = () => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Celebration animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(celebrationAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(celebrationAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleStartJourney = () => {
    navigation.navigate('home');
  };

  const handleRetakeAssessment = async () => {
    try {
      await OnboardingService.resetAssessment();
      navigation.navigate('Welcome');
    } catch (error) {
      console.error('Error resetting assessment:', error);
      navigation.navigate('Welcome');
    }
  };

  const renderCelebrationHeader = () => (
    <Animated.View
      style={[
        styles.celebrationContainer,
        {
          opacity: fadeAnim,
          transform: [
            {
              scale: celebrationAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.05],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.celebrationEmoji}>🎉</Text>
      <Text style={styles.celebrationTitle}>Assessment Complete!</Text>
      <Text style={styles.celebrationSubtitle}>
        Here's your personalized wellness profile
      </Text>
    </Animated.View>
  );

  const renderScores = () => {
    if (!scores) return null;

    return (
      <Animated.View
        style={[
          styles.scoresContainer,
          { opacity: fadeAnim },
        ]}
      >
        <ScoreDisplay
          score={scores.lungHealthScore}
          title="Lung Health Score"
          subtitle="Based on your smoking habits"
          description={ScoringService.getScoreInterpretation(scores.lungHealthScore, 'lung').message}
          animationDelay={500}
          size="large"
        />

        <ScoreDisplay
          score={scores.overallWellnessScore}
          title="Overall Wellness"
          subtitle="Combined health assessment"
          description={ScoringService.getScoreInterpretation(scores.overallWellnessScore, 'wellness').message}
          animationDelay={1000}
          size="medium"
        />

        <ScoreDisplay
          score={scores.improvementPotential}
          title="Improvement Potential"
          subtitle="Your projected progress in 3 months"
          description="With consistent practice and healthy choices"
          color={theme.colors.success}
          animationDelay={1500}
          size="medium"
        />
      </Animated.View>
    );
  };

  const renderChakraResults = () => {
    if (!assessmentData?.chakraData) return null;

    const chakrasWithScores = getChakrasByScore(assessmentData.chakraData.calculatedScores);
    const imbalancedChakras = chakrasWithScores.filter(chakra => chakra.needsAttention).slice(0, 3);

    return (
      <Animated.View
        style={[
          styles.chakraResultsContainer,
          { opacity: fadeAnim },
        ]}
      >
        <Text style={styles.sectionTitle}>Chakra Balance Assessment</Text>
        
        {imbalancedChakras.length > 0 ? (
          <>
            <Text style={styles.sectionSubtitle}>
              Areas for focus and healing:
            </Text>
            
            {imbalancedChakras.map((chakra, index) => (
              <EnhancedCard
                key={chakra.key}
                style={[styles.chakraCard, { borderLeftColor: chakra.color }]}
              >
                <View style={styles.chakraCardContent}>
                  <View style={styles.chakraCardHeader}>
                    <Text style={styles.chakraCardSymbol}>{chakra.symbol}</Text>
                    <View style={styles.chakraCardInfo}>
                      <Text style={[styles.chakraCardName, { color: chakra.color }]}>
                        {chakra.name}
                      </Text>
                      <Text style={styles.chakraCardScore}>
                        Score: {chakra.score}/10 - {chakra.balanceLevel.description}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.chakraCardDescription}>
                    {chakra.healingDescription}
                  </Text>
                </View>
              </EnhancedCard>
            ))}
          </>
        ) : (
          <EnhancedCard style={styles.balancedChakrasCard}>
            <Text style={styles.balancedChakrasText}>
              🌟 Excellent! Your chakras are well-balanced. Continue your current practices to maintain this harmony.
            </Text>
          </EnhancedCard>
        )}
      </Animated.View>
    );
  };

  const renderRecommendations = () => {
    if (recommendations.length === 0) return null;

    return (
      <Animated.View
        style={[
          styles.recommendationsContainer,
          { opacity: fadeAnim },
        ]}
      >
        <Text style={styles.sectionTitle}>Your Personalized Plan</Text>
        <Text style={styles.sectionSubtitle}>
          Recommended actions based on your assessment:
        </Text>

        {recommendations.map((rec, index) => (
          <EnhancedCard
            key={index}
            style={[
              styles.recommendationCard,
              rec.priority === 'high' && styles.highPriorityCard,
            ]}
          >
            <View style={styles.recommendationContent}>
              <View style={styles.recommendationHeader}>
                <Text style={styles.recommendationIcon}>{rec.icon}</Text>
                <View style={styles.recommendationInfo}>
                  <Text style={styles.recommendationTitle}>{rec.title}</Text>
                  {rec.priority === 'high' && (
                    <Text style={styles.priorityBadge}>High Priority</Text>
                  )}
                </View>
              </View>
              <Text style={styles.recommendationDescription}>
                {rec.description}
              </Text>
              <Text style={styles.recommendationBenefit}>
                💡 {rec.estimatedBenefit}
              </Text>
            </View>
          </EnhancedCard>
        ))}
      </Animated.View>
    );
  };

  const renderActions = () => (
    <Animated.View
      style={[
        styles.actionsContainer,
        { opacity: fadeAnim },
      ]}
    >
      <EnhancedButton
        title="Start Your Wellness Journey"
        onPress={handleStartJourney}
        variant="primary"
        size="large"
        style={styles.primaryButton}
      />

      <TouchableOpacity
        style={styles.retakeButton}
        onPress={handleRetakeAssessment}
      >
        <Text style={styles.retakeButtonText}>
          Retake Assessment
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Calculating your results...</Text>
      </SafeAreaView>
    );
  }

  if (!assessmentData || !scores) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Unable to load assessment results. Please try again.
        </Text>
        <EnhancedButton
          title="Restart Assessment"
          onPress={() => navigation.navigate('Welcome')}
          variant="primary"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCelebrationHeader()}
        {renderScores()}
        {renderChakraResults()}
        {renderRecommendations()}
      </ScrollView>

      {renderActions()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  
  loadingText: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  
  errorText: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  
  content: {
    flex: 1,
  },
  
  celebrationContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  
  celebrationEmoji: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  
  celebrationTitle: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  
  celebrationSubtitle: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeights.medium,
  },
  
  scoresContainer: {
    paddingVertical: theme.spacing.lg,
  },
  
  sectionTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  
  sectionSubtitle: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  
  // Chakra results styles
  chakraResultsContainer: {
    paddingVertical: theme.spacing.lg,
  },
  
  chakraCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
  },
  
  chakraCardContent: {
    padding: theme.spacing.md,
  },
  
  chakraCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  
  chakraCardSymbol: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  
  chakraCardInfo: {
    flex: 1,
  },
  
  chakraCardName: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing.xs,
  },
  
  chakraCardScore: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  
  chakraCardDescription: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.md,
  },
  
  balancedChakrasCard: {
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.success + '10',
    borderColor: theme.colors.success,
    borderWidth: 1,
  },
  
  balancedChakrasText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.success,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeights.medium,
    padding: theme.spacing.lg,
  },
  
  // Recommendations styles
  recommendationsContainer: {
    paddingVertical: theme.spacing.lg,
  },
  
  recommendationCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  
  highPriorityCard: {
    borderColor: theme.colors.warning,
    borderWidth: 1,
    backgroundColor: theme.colors.warning + '05',
  },
  
  recommendationContent: {
    padding: theme.spacing.md,
  },
  
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  
  recommendationIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  
  recommendationInfo: {
    flex: 1,
  },
  
  recommendationTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  
  priorityBadge: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.warning,
    fontWeight: theme.typography.fontWeights.bold,
    textTransform: 'uppercase',
  },
  
  recommendationDescription: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.md,
    marginBottom: theme.spacing.sm,
  },
  
  recommendationBenefit: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.medium,
    fontStyle: 'italic',
  },
  
  actionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  
  primaryButton: {
    marginBottom: theme.spacing.md,
  },
  
  retakeButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  
  retakeButtonText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeights.medium,
  },
});

export default SummaryScreen;
