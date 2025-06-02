import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { theme } from '../../theme/colors';
import EnhancedButton from '../../components/EnhancedButton';
import ProgressIndicator from '../../components/onboarding/ProgressIndicator';
import LikertScale from '../../components/onboarding/LikertScale';
import ChakraCard from '../../components/onboarding/ChakraCard';
import OnboardingService from '../../services/OnboardingService';
import ScoringService from '../../services/ScoringService';
import { getChakraQuestions, getChakraOrder, getChakraInfo } from '../../utils/chakraData';

/**
 * ChakraQuestionsScreen - Chakra alignment assessment
 * Replaces OnboardingScreen3.js with comprehensive chakra evaluation
 */
const ChakraQuestionsScreen = ({ navigation }) => {
  const [currentChakra, setCurrentChakra] = useState(0);
  const [chakraResponses, setChakraResponses] = useState({});
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedChakraInfo, setSelectedChakraInfo] = useState(null);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const chakraOrder = getChakraOrder();
  const chakraQuestions = getChakraQuestions();
  const currentChakraName = chakraOrder[currentChakra];
  const currentQuestionData = chakraQuestions[currentChakraName];

  useEffect(() => {
    // Animate question transition
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [currentChakra]);

  const getBackgroundColor = () => {
    const currentChakraInfo = getChakraInfo(currentChakraName);
    return currentChakraInfo ? currentChakraInfo.color + '10' : theme.colors.background;
  };

  const handleChakraResponse = (rating) => {
    setChakraResponses(prev => ({
      ...prev,
      [currentChakraName]: rating,
    }));
  };

  // Auto-advance logic when chakra question is answered
  useEffect(() => {
    const isCurrentQuestionAnswered = chakraResponses[currentChakraName] !== undefined;

    if (isCurrentQuestionAnswered && currentChakra < chakraOrder.length - 1) {
      // Auto-advance after selection with delay for user feedback
      const timer = setTimeout(() => {
        setCurrentChakra(currentChakra + 1);
      }, 1200); // Slightly longer delay for better UX

      return () => clearTimeout(timer);
    } else if (isCurrentQuestionAnswered && currentChakra === chakraOrder.length - 1) {
      // Auto-advance to results screen after final chakra
      const timer = setTimeout(async () => {
        try {
          const calculatedScores = ScoringService.calculateChakraScores(chakraResponses);
          const imbalancedChakras = ScoringService.getImbalancedChakras(calculatedScores);

          const chakraData = {
            responses: chakraResponses,
            calculatedScores,
            imbalancedChakras,
            recommendedMeditations: imbalancedChakras.slice(0, 3),
          };

          await OnboardingService.saveStepData('chakraData', chakraData);
          navigation.navigate('Results');
        } catch (error) {
          console.error('Error saving chakra data:', error);
          navigation.navigate('Results');
        }
      }, 1800); // Longer delay for final chakra

      return () => clearTimeout(timer);
    }
  }, [chakraResponses, currentChakra, currentChakraName, chakraOrder.length, navigation]);



  const handleBack = () => {
    if (currentChakra > 0) {
      setCurrentChakra(currentChakra - 1);
    } else {
      navigation.goBack();
    }
  };



  const handleLearnMore = () => {
    const chakraInfo = getChakraInfo(currentChakraName);
    setSelectedChakraInfo(chakraInfo);
    setShowInfoModal(true);
  };



  const renderChakraInfoModal = () => {
    if (!selectedChakraInfo) return null;

    return (
      <Modal
        visible={showInfoModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: selectedChakraInfo.color }]}>
              {selectedChakraInfo.name}
            </Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowInfoModal(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Sanskrit Name</Text>
              <Text style={styles.modalSectionText}>{selectedChakraInfo.sanskrit}</Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Location</Text>
              <Text style={styles.modalSectionText}>{selectedChakraInfo.location}</Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Element</Text>
              <Text style={styles.modalSectionText}>{selectedChakraInfo.element}</Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Qualities</Text>
              <Text style={styles.modalSectionText}>
                {selectedChakraInfo.qualities.join(', ')}
              </Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>When Balanced</Text>
              <Text style={styles.modalSectionText}>
                {selectedChakraInfo.balanceSymptoms.join(', ')}
              </Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>When Imbalanced</Text>
              <Text style={styles.modalSectionText}>
                {selectedChakraInfo.imbalanceSymptoms.join(', ')}
              </Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Healing Activities</Text>
              <Text style={styles.modalSectionText}>
                {selectedChakraInfo.healingActivities.join(', ')}
              </Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Affirmation</Text>
              <Text style={[styles.modalAffirmation, { color: selectedChakraInfo.color }]}>
                "{selectedChakraInfo.affirmation}"
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  const renderProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <ProgressIndicator
        currentStep={2}
        totalSteps={4}
        stepLabels={['Welcome', 'Smoking', 'Chakras', 'Results']}
        showPercentage={false}
      />
      
      {/* Chakra-specific progress */}
      <View style={styles.chakraProgress}>
        <Text style={styles.chakraProgressText}>
          Chakra {currentChakra + 1} of {chakraOrder.length}
        </Text>
        <View style={styles.chakraProgressBar}>
          {chakraOrder.map((chakra, index) => {
            const isCompleted = chakraResponses[chakra] !== undefined;
            const isCurrent = index === currentChakra;
            const chakraInfo = getChakraInfo(chakra);
            
            return (
              <View
                key={chakra}
                style={[
                  styles.chakraProgressDot,
                  {
                    backgroundColor: isCompleted 
                      ? chakraInfo.color 
                      : isCurrent 
                        ? chakraInfo.color + '50'
                        : theme.colors.border,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
        },
      ]}
    >
      {/* Progress indicators */}
      {renderProgressIndicator()}

      {/* Question content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.questionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ChakraCard
            chakraName={currentChakraName}
            question={currentQuestionData.question}
            description={currentQuestionData.description}
            onLearnMore={handleLearnMore}
            showLearnMore={true}
            animated={true}
          />

          <View style={styles.ratingContainer}>
            <Text style={styles.ratingInstructions}>
              Rate how much you agree with this statement:
            </Text>
            
            <LikertScale
              value={chakraResponses[currentChakraName]}
              onValueChange={handleChakraResponse}
              labels={[
                'Strongly\nDisagree',
                'Disagree',
                'Neutral',
                'Agree',
                'Strongly\nAgree'
              ]}
              animated={true}
            />
          </View>
        </Animated.View>
      </ScrollView>



      {/* Chakra info modal */}
      {renderChakraInfoModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  progressContainer: {
    paddingTop: theme.spacing.md,
  },
  
  chakraProgress: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  
  chakraProgressText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: theme.spacing.sm,
  },
  
  chakraProgressBar: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  
  chakraProgressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  
  content: {
    flex: 1,
  },
  
  questionContainer: {
    paddingVertical: theme.spacing.lg,
  },
  
  ratingContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl, // Add large bottom padding to prevent overlap
  },

  ratingInstructions: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },




  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  
  modalTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
  },
  
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  modalCloseText: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeights.bold,
  },
  
  modalContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  
  modalSection: {
    marginVertical: theme.spacing.md,
  },
  
  modalSectionTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  
  modalSectionText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.md,
  },
  
  modalAffirmation: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.medium,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.lg,
  },
});

export default ChakraQuestionsScreen;
