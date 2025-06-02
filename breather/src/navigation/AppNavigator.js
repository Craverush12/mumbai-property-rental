import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import BreathingSessionScreen from '../screens/BreathingSessionScreen';
import ChakraExplorationScreen from '../screens/ChakraExplorationScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FAQScreen from '../screens/FAQScreen';

// Import onboarding screens
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import SmokingQuestionsScreen from '../screens/onboarding/SmokingQuestionsScreen';
import ChakraQuestionsScreen from '../screens/onboarding/ChakraQuestionsScreen';
import SummaryScreen from '../screens/onboarding/SummaryScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        {/* Onboarding Flow */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SmokingQuestions" component={SmokingQuestionsScreen} />
        <Stack.Screen name="ChakraQuestions" component={ChakraQuestionsScreen} />
        <Stack.Screen name="Results" component={SummaryScreen} />
        
        {/* Main App */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="BreathingSession" component={BreathingSessionScreen} />
        <Stack.Screen name="breathing" component={BreathingSessionScreen} />
        <Stack.Screen name="ChakraExploration" component={ChakraExplorationScreen} />
        <Stack.Screen name="chakra" component={ChakraExplorationScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen name="progress" component={ProgressScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="settings" component={SettingsScreen} />
        <Stack.Screen name="FAQ" component={FAQScreen} />
        <Stack.Screen name="faq" component={FAQScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
