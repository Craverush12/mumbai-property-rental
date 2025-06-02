import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { theme } from '../../theme/colors';
import { getChakraColor } from '../../utils/chakraData';

const { width } = Dimensions.get('window');

/**
 * ChakraCard - Themed question display for chakra assessment
 * Shows chakra information with color theming and animations
 */
const ChakraCard = ({
  chakraName,
  chakraInfo,
  question,
  description,
  onLearnMore,
  showLearnMore = true,
  style = {},
  animated = true,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      // Entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
      colorAnim.setValue(1);
    }
  }, [chakraName]);

  const chakraColor = getChakraColor(chakraName);
  
  // Use static colors instead of animated interpolation to avoid driver conflicts
  const backgroundColor = `${chakraColor}15`; // Light opacity
  const borderColor = `${chakraColor}40`; // Medium opacity

  const renderChakraSymbol = () => {
    const symbols = {
      root: '🔴',
      sacral: '🟠', 
      solarPlexus: '🟡',
      heart: '💚',
      throat: '🔵',
      thirdEye: '🟣',
      crown: '🟪',
    };

    return symbols[chakraName] || '⚪';
  };

  const getChakraDisplayName = () => {
    const names = {
      root: 'Root Chakra',
      sacral: 'Sacral Chakra',
      solarPlexus: 'Solar Plexus Chakra',
      heart: 'Heart Chakra',
      throat: 'Throat Chakra',
      thirdEye: 'Third Eye Chakra',
      crown: 'Crown Chakra',
    };

    return names[chakraName] || 'Chakra';
  };

  const getSanskritName = () => {
    const sanskrit = {
      root: 'Muladhara',
      sacral: 'Swadhisthana',
      solarPlexus: 'Manipura',
      heart: 'Anahata',
      throat: 'Vishuddha',
      thirdEye: 'Ajna',
      crown: 'Sahasrara',
    };

    return sanskrit[chakraName] || '';
  };

  const getLocation = () => {
    const locations = {
      root: 'Base of spine',
      sacral: 'Lower abdomen',
      solarPlexus: 'Upper abdomen',
      heart: 'Center of chest',
      throat: 'Throat area',
      thirdEye: 'Between eyebrows',
      crown: 'Top of head',
    };

    return locations[chakraName] || '';
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          backgroundColor: backgroundColor,
          borderColor: borderColor,
        },
        style,
      ]}
    >
      {/* Chakra header */}
      <View style={styles.header}>
        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{renderChakraSymbol()}</Text>
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={[styles.chakraName, { color: chakraColor }]}>
            {getChakraDisplayName()}
          </Text>
          <Text style={styles.sanskritName}>
            {getSanskritName()}
          </Text>
          <Text style={styles.location}>
            {getLocation()}
          </Text>
        </View>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.question}>
          {question}
        </Text>
        
        {description && (
          <Text style={styles.description}>
            {description}
          </Text>
        )}
      </View>

      {/* Learn more button */}
      {showLearnMore && (
        <TouchableOpacity
          style={[styles.learnMoreButton, { borderColor: chakraColor }]}
          onPress={onLearnMore}
          activeOpacity={0.7}
        >
          <Text style={[styles.learnMoreText, { color: chakraColor }]}>
            Learn More About This Chakra
          </Text>
        </TouchableOpacity>
      )}

      {/* Decorative elements */}
      <View style={styles.decorativeContainer}>
        <Animated.View
          style={[
            styles.decorativeCircle,
            styles.decorativeCircle1,
            {
              backgroundColor: `${chakraColor}20`,
              opacity: fadeAnim,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.decorativeCircle,
            styles.decorativeCircle2,
            {
              backgroundColor: `${chakraColor}10`,
              opacity: fadeAnim,
            },
          ]}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    padding: theme.spacing.lg,
    position: 'relative',
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  
  symbolContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    ...theme.shadows.sm,
  },
  
  symbol: {
    fontSize: 32,
  },
  
  titleContainer: {
    flex: 1,
  },
  
  chakraName: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.xs,
  },
  
  sanskritName: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: theme.spacing.xs,
  },
  
  location: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textLight,
    fontWeight: theme.typography.fontWeights.medium,
  },
  
  questionContainer: {
    marginBottom: theme.spacing.lg,
  },
  
  question: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.lg,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  
  description: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  learnMoreButton: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  
  learnMoreText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    textAlign: 'center',
  },
  
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 100,
  },
  
  decorativeCircle1: {
    width: 120,
    height: 120,
    top: -60,
    right: -60,
  },
  
  decorativeCircle2: {
    width: 80,
    height: 80,
    bottom: -40,
    left: -40,
  },
});

export default ChakraCard;
