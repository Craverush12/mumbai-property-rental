import React, { useState, useRef, useEffect } from 'react';
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
import ProgressIndicator from '../../components/onboarding/ProgressIndicator';
import SliderInput from '../../components/onboarding/SliderInput';
import NumberInput from '../../components/onboarding/NumberInput';
import OnboardingService from '../../services/OnboardingService';

/**
 * SmokingQuestionsScreen - Comprehensive smoking habits assessment
 * Replaces OnboardingScreen2.js with detailed smoking data collection
 */
const SmokingQuestionsScreen = ({ navigation }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [smokingData, setSmokingData] = useState({
    cigarettesPerDay: 0,
    yearsSmoked: 0,
    smokingReasons: [],
    breathingDifficulties: null,
    quitAttempts: 0,
  });
  const [isValid, setIsValid] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const questions = [
    {
      id: 'cigarettesPerDay',
      title: 'Daily Smoking Habits',
      question: 'How many cigarettes do you smoke daily?',
      type: 'slider',
      required: true,
    },
    {
      id: 'yearsSmoked',
      title: 'Smoking History',
      question: 'For how many years have you been smoking?',
      type: 'number',
      required: true,
    },
    {
      id: 'smokingReasons',
      title: 'Smoking Triggers',
      question: 'Why do you smoke most often?',
      subtitle: 'Select all that apply',
      type: 'multipleChoice',
      options: [
        { id: 'stress', label: 'Stress Relief', icon: '😰' },
        { id: 'habit', label: 'Habit/Routine', icon: '🔄' },
        { id: 'boredom', label: 'Boredom', icon: '😴' },
        { id: 'social', label: 'Social Situations', icon: '👥' },
        { id: 'other', label: 'Other Reasons', icon: '❓' },
      ],
      required: true,
    },
    {
      id: 'breathingDifficulties',
      title: 'Current Health',
      question: 'Do you currently experience breathing difficulties?',
      type: 'yesNo',
      required: true,
    },
    {
      id: 'quitAttempts',
      title: 'Quit History',
      question: 'How many times have you tried to quit smoking?',
      type: 'number',
      required: true,
    },
  ];

  useEffect(() => {
    validateCurrentQuestion();
  }, [smokingData, currentQuestion]);

  // DISABLED: Auto-advance logic - causing premature screen changes
  // Will implement user-controlled navigation instead
  /*
  useEffect(() => {
    if (isValid && currentQuestion < questions.length - 1) {
      // Auto-advance after selection with shorter delay for smoother flow
      const timer = setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 600); // Reduced from 800ms

      return () => clearTimeout(timer);
    } else if (isValid && currentQuestion === questions.length - 1) {
      // Auto-advance to next screen after final question
      const timer = setTimeout(async () => {
        try {
          await OnboardingService.saveStepData('smokingData', smokingData);
          navigation.navigate('ChakraQuestions');
        } catch (error) {
          console.error('Error saving smoking data:', error);
          navigation.navigate('ChakraQuestions');
        }
      }, 1000); // Reduced from 1200ms

      return () => clearTimeout(timer);
    }
  }, [isValid, currentQuestion, smokingData, navigation]);
  */

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
  }, [currentQuestion]);

  const validateCurrentQuestion = () => {
    const question = questions[currentQuestion];
    const value = smokingData[question.id];

    switch (question.type) {
      case 'slider':
      case 'number':
        setIsValid(value !== null && value !== undefined);
        break;
      case 'multipleChoice':
        setIsValid(Array.isArray(value) && value.length > 0);
        break;
      case 'yesNo':
        setIsValid(value !== null);
        break;
      default:
        setIsValid(false);
    }
  };

  const updateSmokingData = (field, value) => {
    setSmokingData(prev => ({
      ...prev,
      [field]: value,
    }));
  };



  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleContinue = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Save data and navigate to next screen
      try {
        await OnboardingService.saveStepData('smokingData', smokingData);
        navigation.navigate('ChakraQuestions');
      } catch (error) {
        console.error('Error saving smoking data:', error);
        navigation.navigate('ChakraQuestions');
      }
    }
  };

  const renderCigaretteIcon = () => (
    <Text style={styles.cigaretteIcon}>🚬</Text>
  );

  const renderSliderQuestion = (question) => (
    <SliderInput
      value={smokingData.cigarettesPerDay}
      onValueChange={(value) => updateSmokingData('cigarettesPerDay', value)}
      minimumValue={0}
      maximumValue={40}
      label={question.question}
      showIcons={true}
      iconComponent={renderCigaretteIcon()}
    />
  );

  const renderNumberQuestion = (question) => {
    const isQuitAttempts = question.id === 'quitAttempts';
    return (
      <NumberInput
        value={smokingData[question.id]}
        onValueChange={(value) => updateSmokingData(question.id, value)}
        label={question.question}
        minValue={0}
        maxValue={isQuitAttempts ? 20 : 60}
        placeholder="0"
        validationMessage={
          isQuitAttempts && smokingData[question.id] > 0
            ? "Each attempt shows your determination to quit!"
            : ""
        }
      />
    );
  };

  const renderMultipleChoiceQuestion = (question) => (
    <View style={styles.multipleChoiceContainer}>
      <Text style={styles.questionText}>{question.question}</Text>
      {question.subtitle && (
        <Text style={styles.questionSubtitle}>{question.subtitle}</Text>
      )}
      
      <View style={styles.optionsContainer}>
        {question.options.map((option) => {
          const isSelected = smokingData.smokingReasons.includes(option.id);
          
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                isSelected && styles.optionCardSelected,
              ]}
              onPress={() => {
                const currentReasons = smokingData.smokingReasons || [];
                const newReasons = isSelected
                  ? currentReasons.filter(id => id !== option.id)
                  : [...currentReasons, option.id];
                updateSmokingData('smokingReasons', newReasons);
              }}
            >
              <Text style={styles.optionIcon}>{option.icon}</Text>
              <Text style={[
                styles.optionLabel,
                isSelected && styles.optionLabelSelected,
              ]}>
                {option.label}
              </Text>
              {isSelected && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderYesNoQuestion = (question) => (
    <View style={styles.yesNoContainer}>
      <Text style={styles.questionText}>{question.question}</Text>
      
      <View style={styles.yesNoButtons}>
        <TouchableOpacity
          style={[
            styles.yesNoButton,
            smokingData.breathingDifficulties === false && styles.yesNoButtonSelected,
          ]}
          onPress={() => updateSmokingData('breathingDifficulties', false)}
        >
          <Text style={styles.yesNoIcon}>😊</Text>
          <Text style={[
            styles.yesNoLabel,
            smokingData.breathingDifficulties === false && styles.yesNoLabelSelected,
          ]}>
            No, I breathe fine
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.yesNoButton,
            smokingData.breathingDifficulties === true && styles.yesNoButtonSelected,
          ]}
          onPress={() => updateSmokingData('breathingDifficulties', true)}
        >
          <Text style={styles.yesNoIcon}>😮‍💨</Text>
          <Text style={[
            styles.yesNoLabel,
            smokingData.breathingDifficulties === true && styles.yesNoLabelSelected,
          ]}>
            Yes, I have difficulties
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCurrentQuestion = () => {
    const question = questions[currentQuestion];
    
    switch (question.type) {
      case 'slider':
        return renderSliderQuestion(question);
      case 'number':
        return renderNumberQuestion(question);
      case 'multipleChoice':
        return renderMultipleChoiceQuestion(question);
      case 'yesNo':
        return renderYesNoQuestion(question);
      default:
        return null;
    }
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress indicator */}
      <ProgressIndicator
        currentStep={1}
        totalSteps={4}
        stepLabels={['Welcome', 'Smoking', 'Chakras', 'Results']}
        showPercentage={false}
      />

      {/* Question header with back indicator */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backIndicator}
          onPress={handleBack}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.questionTitle}>{currentQuestionData.title}</Text>
          <Text style={styles.questionCounter}>
            Question {currentQuestion + 1} of {questions.length}
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

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
          {renderCurrentQuestion()}
        </Animated.View>
      </ScrollView>

      {/* Continue button - only shows when question is answered */}
      {isValid && (
        <View style={styles.continueContainer}>
          <EnhancedButton
            title={currentQuestion === questions.length - 1 ? "Continue to Chakras" : "Continue"}
            onPress={handleContinue}
            variant="primary"
            size="medium"
            style={styles.continueButton}
          />
        </View>
      )}
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },

  backIndicator: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },

  backIcon: {
    fontSize: theme.typography.fontSizes.xl,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeights.bold,
  },

  headerContent: {
    flex: 1,
    alignItems: 'center',
  },

  headerSpacer: {
    width: 44, // Same as backIndicator to center the content
  },

  questionTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },

  questionCounter: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  
  questionContainer: {
    paddingVertical: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl, // Add large bottom padding to prevent overlap
  },
  
  questionText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.lg,
  },
  
  questionSubtitle: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    fontStyle: 'italic',
  },
  
  // Multiple choice styles
  multipleChoiceContainer: {
    alignItems: 'center',
  },
  
  optionsContainer: {
    width: '100%',
  },
  
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  
  optionCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight + '20',
  },
  
  optionIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  
  optionLabel: {
    flex: 1,
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
  },
  
  optionLabelSelected: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  
  checkmark: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.bold,
  },
  
  // Yes/No styles
  yesNoContainer: {
    alignItems: 'center',
  },
  
  yesNoButtons: {
    width: '100%',
    gap: theme.spacing.md,
  },
  
  yesNoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  
  yesNoButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight + '20',
  },
  
  yesNoIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  
  yesNoLabel: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
  },
  
  yesNoLabelSelected: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  
  cigaretteIcon: {
    fontSize: 16,
  },

  // Continue button styles
  continueContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg, // Increased padding
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1, // Add border to separate from content
    borderTopColor: theme.colors.border,
    ...theme.shadows.sm, // Add shadow for better separation
  },

  continueButton: {
    width: '100%',
  },
});

export default SmokingQuestionsScreen;
