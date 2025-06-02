import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ScreenTransition = ({ children, type = 'fade', duration = 300 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const animations = [];

    switch (type) {
      case 'fade':
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          })
        );
        break;

      case 'slideFromRight':
        slideAnim.setValue(screenWidth);
        animations.push(
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'slideFromBottom':
        slideAnim.setValue(screenHeight);
        animations.push(
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'scaleAndFade':
        animations.push(
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      default:
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          })
        );
    }

    Animated.sequence(animations).start();
  }, [type, duration]);

  const getTransformStyle = () => {
    const transforms = [];

    if (type === 'slideFromRight') {
      transforms.push({ translateX: slideAnim });
    } else if (type === 'slideFromBottom') {
      transforms.push({ translateY: slideAnim });
    }

    if (type === 'scaleAndFade') {
      transforms.push({ scale: scaleAnim });
    }

    return transforms;
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: fadeAnim,
        transform: getTransformStyle(),
      }}
    >
      {children}
    </Animated.View>
  );
};

export default ScreenTransition;
