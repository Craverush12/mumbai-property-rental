import React, { useState } from 'react';
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
import { theme, getChakraColor } from '../theme/colors';
import EnhancedButton from '../components/EnhancedButton';

const { width } = Dimensions.get('window');

const ChakraExplorationScreen = ({ navigation }) => {
  const [selectedChakra, setSelectedChakra] = useState(null);

  const chakras = [
    {
      name: 'root',
      title: 'Root Chakra',
      sanskrit: 'Muladhara',
      location: 'Base of spine',
      description: 'Foundation, grounding, survival, stability',
      meditation: 'Focus on feeling grounded and secure',
    },
    {
      name: 'sacral',
      title: 'Sacral Chakra',
      sanskrit: 'Svadhisthana',
      location: 'Lower abdomen',
      description: 'Creativity, sexuality, emotions, pleasure',
      meditation: 'Embrace your creative and emotional flow',
    },
    {
      name: 'solar',
      title: 'Solar Plexus Chakra',
      sanskrit: 'Manipura',
      location: 'Upper abdomen',
      description: 'Personal power, confidence, control',
      meditation: 'Feel your inner strength and confidence',
    },
    {
      name: 'heart',
      title: 'Heart Chakra',
      sanskrit: 'Anahata',
      location: 'Center of chest',
      description: 'Love, compassion, connection, healing',
      meditation: 'Open your heart to love and compassion',
    },
    {
      name: 'throat',
      title: 'Throat Chakra',
      sanskrit: 'Vishuddha',
      location: 'Throat',
      description: 'Communication, truth, expression',
      meditation: 'Speak your truth with clarity and kindness',
    },
    {
      name: 'third_eye',
      title: 'Third Eye Chakra',
      sanskrit: 'Ajna',
      location: 'Between eyebrows',
      description: 'Intuition, wisdom, spiritual insight',
      meditation: 'Trust your inner wisdom and intuition',
    },
    {
      name: 'crown',
      title: 'Crown Chakra',
      sanskrit: 'Sahasrara',
      location: 'Top of head',
      description: 'Spirituality, enlightenment, connection to divine',
      meditation: 'Connect with your highest spiritual self',
    },
  ];

  const handleChakraSelect = (chakra) => {
    setSelectedChakra(chakra);
  };

  const startBreathingSession = () => {
    if (selectedChakra) {
      navigation.navigate('BreathingSession', {
        duration: 5,
        pattern: 'box',
        chakra: selectedChakra.name,
      });
    }
  };

  const renderChakraCard = (chakra, index) => {
    const chakraColor = getChakraColor(chakra.name);
    const isSelected = selectedChakra?.name === chakra.name;
    
    return (
      <TouchableOpacity
        key={chakra.name}
        style={[
          styles.chakraCard,
          isSelected && { borderColor: chakraColor, borderWidth: 3 }
        ]}
        onPress={() => handleChakraSelect(chakra)}
      >
        <LinearGradient
          colors={[chakraColor + '20', chakraColor + '05']}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.chakraDot, { backgroundColor: chakraColor }]} />
            <View style={styles.chakraInfo}>
              <Text style={[styles.chakraTitle, { color: chakraColor }]}>
                {chakra.title}
              </Text>
              <Text style={styles.sanskrit}>{chakra.sanskrit}</Text>
              <Text style={styles.location}>{chakra.location}</Text>
            </View>
          </View>
          
          <Text style={styles.description}>{chakra.description}</Text>
          
          {isSelected && (
            <View style={styles.meditationContainer}>
              <Text style={styles.meditationLabel}>Meditation Focus:</Text>
              <Text style={styles.meditation}>{chakra.meditation}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chakra Meditation</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Choose a chakra to focus your breathing meditation
        </Text>

        <View style={styles.chakraList}>
          {chakras.map((chakra, index) => renderChakraCard(chakra, index))}
        </View>
      </ScrollView>

      {/* Start Button */}
      {selectedChakra && (
        <View style={styles.startContainer}>
          <EnhancedButton
            title={`Start ${selectedChakra.title} Meditation`}
            onPress={startBreathingSession}
            variant="primary"
            size="large"
            style={[
              styles.startButton,
              { backgroundColor: getChakraColor(selectedChakra.name) }
            ]}
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
  chakraList: {
    gap: theme.spacing.md,
  },
  chakraCard: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  cardGradient: {
    padding: theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  chakraDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: theme.spacing.md,
  },
  chakraInfo: {
    flex: 1,
  },
  chakraTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.xs,
  },
  sanskrit: {
    fontSize: theme.typography.fontSizes.sm,
    fontStyle: 'italic',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  location: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  description: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.md,
  },
  meditationContainer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  meditationLabel: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  meditation: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },
  startContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  startButton: {
    width: '100%',
  },
});

export default ChakraExplorationScreen;
