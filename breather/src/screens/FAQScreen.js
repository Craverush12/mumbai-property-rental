import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  SafeAreaView,
} from 'react-native';
import { theme } from '../theme/colors';

const FAQScreen = ({ navigation }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const faqData = [
    {
      id: 1,
      question: "What is breathing meditation?",
      answer: "Breathing meditation is a mindfulness practice that focuses on the breath as an anchor for attention. It helps reduce stress, improve focus, and promote overall wellbeing by training your mind to stay present."
    },
    {
      id: 2,
      question: "How often should I practice?",
      answer: "For beginners, we recommend starting with 5-10 minutes daily. Consistency is more important than duration. As you build the habit, you can gradually increase the time. Even 3-5 minutes of daily practice can provide significant benefits."
    },
    {
      id: 3,
      question: "What are chakras and how do they relate to breathing?",
      answer: "Chakras are energy centers in the body according to ancient traditions. Each chakra is associated with different aspects of physical, emotional, and spiritual wellbeing. Focused breathing can help balance these energy centers and promote overall harmony."
    },
    {
      id: 4,
      question: "What breathing patterns are available?",
      answer: "We offer several patterns:\n\n• Box Breathing (4-4-4-4): Equal inhale, hold, exhale, hold\n• Triangle Breathing (4-0-4-4): Inhale, exhale, hold\n• Simple Breathing (4-0-6-0): Longer exhale for relaxation\n\nEach pattern serves different purposes and can be chosen based on your needs."
    },
    {
      id: 5,
      question: "How does the lung health assessment work?",
      answer: "Our assessment considers your smoking history, frequency, and duration to provide insights into your respiratory health. This helps us recommend appropriate breathing exercises and track your progress as you work toward better lung health."
    },
    {
      id: 6,
      question: "Can I use this app if I'm a beginner?",
      answer: "Absolutely! The app is designed for all levels. We start with a comprehensive onboarding process to understand your needs and provide personalized recommendations. The guided breathing sessions include clear instructions and visual cues."
    },
    {
      id: 7,
      question: "What if I miss a day of practice?",
      answer: "Don't worry! Missing a day doesn't reset your progress. The app tracks your overall journey, and consistency over perfection is what matters. Simply return to your practice when you can, and continue building your mindfulness habit."
    },
    {
      id: 8,
      question: "How do I track my progress?",
      answer: "The app automatically tracks your sessions, streaks, total practice time, and completed exercises. You can view detailed progress in the Progress section, including weekly goals, achievements, and personal milestones."
    },
    {
      id: 9,
      question: "Can I customize my breathing sessions?",
      answer: "Yes! You can choose different session durations (3, 5, 10, or 15 minutes), select breathing patterns that suit your needs, and focus on specific chakras for targeted meditation practices."
    },
    {
      id: 10,
      question: "Is my data private and secure?",
      answer: "Your privacy is our priority. All personal data is stored securely on your device and is never shared with third parties. Your breathing patterns, progress, and assessment results remain completely private."
    }
  ];

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const renderFAQItem = (item) => {
    const isExpanded = expandedItems.has(item.id);
    
    return (
      <View key={item.id} style={styles.faqItem}>
        <TouchableOpacity
          style={styles.questionContainer}
          onPress={() => toggleExpanded(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.questionText}>{item.question}</Text>
          <Text style={[
            styles.expandIcon,
            isExpanded && styles.expandIconRotated
          ]}>
            ▼
          </Text>
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.answerContainer}>
            <Text style={styles.answerText}>{item.answer}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Find answers to common questions about breathing meditation and using the Breather app.
        </Text>

        <View style={styles.faqContainer}>
          {faqData.map(renderFAQItem)}
        </View>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Still have questions?</Text>
          <Text style={styles.contactText}>
            We're here to help! Reach out to us for personalized support with your breathing practice.
          </Text>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Quick Tips</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Start with shorter sessions and gradually increase duration
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Practice at the same time each day to build a habit
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Find a quiet, comfortable space for your practice
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Don't judge your thoughts - simply return focus to your breath
            </Text>
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
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.md,
  },
  faqContainer: {
    marginBottom: theme.spacing.xl,
  },
  faqItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
  },
  questionText: {
    flex: 1,
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginRight: theme.spacing.md,
    lineHeight: theme.typography.lineHeights.normal * theme.typography.fontSizes.md,
  },
  expandIcon: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    transform: [{ rotate: '0deg' }],
  },
  expandIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  answerContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  answerText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.md,
  },
  contactSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  contactTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  contactText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.md,
  },
  contactButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  contactButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.textOnPrimary,
  },
  tipsSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  tipsTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  tipItem: {
    marginBottom: theme.spacing.sm,
  },
  tipText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.md,
  },
});

export default FAQScreen;
