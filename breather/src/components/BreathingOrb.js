import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { theme } from '../theme/colors';

const BreathingOrb = ({ 
  size = 200, 
  isActive = false, 
  breathingPattern = 'box',
  showInstructions = true,
  onCycleComplete = () => {},
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;
  const instructionOpacity = useRef(new Animated.Value(1)).current;
  const cycleCount = useRef(0);
  const currentPhase = useRef('inhale');

  const breathingPatterns = {
    box: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    triangle: { inhale: 4, hold1: 0, exhale: 4, hold2: 4 },
    simple: { inhale: 4, hold1: 0, exhale: 6, hold2: 0 },
  };

  const pattern = breathingPatterns[breathingPattern] || breathingPatterns.box;

  const getPhaseInstruction = (phase) => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold1': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'hold2': return 'Hold';
      default: return 'Breathe';
    }
  };

  const animatePhase = (phase, duration) => {
    currentPhase.current = phase;
    
    const scaleValue = phase === 'inhale' ? 1.3 : phase === 'exhale' ? 0.7 : 1;
    const opacityValue = phase === 'inhale' ? 0.9 : phase === 'exhale' ? 0.3 : 0.6;

    // Animate instruction text
    if (showInstructions) {
      Animated.sequence([
        Animated.timing(instructionOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(instructionOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Animate orb
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: scaleValue,
        duration: duration * 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: opacityValue,
        duration: duration * 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const runBreathingCycle = () => {
    if (!isActive) return;

    const phases = [
      { name: 'inhale', duration: pattern.inhale },
      ...(pattern.hold1 > 0 ? [{ name: 'hold1', duration: pattern.hold1 }] : []),
      { name: 'exhale', duration: pattern.exhale },
      ...(pattern.hold2 > 0 ? [{ name: 'hold2', duration: pattern.hold2 }] : []),
    ];

    let currentPhaseIndex = 0;

    const nextPhase = () => {
      if (!isActive) return;

      const phase = phases[currentPhaseIndex];
      animatePhase(phase.name, phase.duration);

      setTimeout(() => {
        currentPhaseIndex++;
        if (currentPhaseIndex >= phases.length) {
          currentPhaseIndex = 0;
          cycleCount.current++;
          onCycleComplete(cycleCount.current);
        }
        nextPhase();
      }, phase.duration * 1000);
    };

    nextPhase();
  };

  useEffect(() => {
    if (isActive) {
      cycleCount.current = 0;
      runBreathingCycle();
    } else {
      // Reset to neutral state
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.6,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.orb,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      />
      
      {showInstructions && (
        <Animated.View 
          style={[
            styles.instructionContainer,
            { opacity: instructionOpacity }
          ]}
        >
          <Text style={styles.instructionText}>
            {isActive ? getPhaseInstruction(currentPhase.current) : 'Ready to breathe?'}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    backgroundColor: theme.colors.primary,
    position: 'absolute',
    ...theme.shadows.lg,
  },
  instructionContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.textOnPrimary,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default BreathingOrb;
