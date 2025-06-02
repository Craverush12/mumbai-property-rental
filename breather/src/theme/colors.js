// Color theme for the Breather app
export const theme = {
  colors: {
    // Primary colors
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    
    // Secondary colors
    secondary: '#10B981',
    secondaryLight: '#34D399',
    secondaryDark: '#059669',
    
    // Background colors
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F5F9',
    
    // Text colors
    text: '#1E293B',
    textSecondary: '#64748B',
    textLight: '#94A3B8',
    textOnPrimary: '#FFFFFF',
    textOnSecondary: '#FFFFFF',
    
    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Border colors
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    
    // Chakra colors
    chakra: {
      root: '#DC2626',      // Red
      sacral: '#EA580C',    // Orange
      solar: '#D97706',     // Yellow
      heart: '#059669',     // Green
      throat: '#0284C7',    // Blue
      third_eye: '#7C3AED', // Indigo
      crown: '#9333EA',     // Purple
    },

    // Breathing colors
    breathe: {
      inhale: '#10B981',
      exhale: '#3B82F6',
    },

    // Additional colors
    accent: '#F59E0B',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  
  typography: {
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    }
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    }
  }
};

// Helper function to get chakra color
export const getChakraColor = (chakraName) => {
  const chakraColors = {
    root: theme.colors.chakra.root,
    sacral: theme.colors.chakra.sacral,
    solar: theme.colors.chakra.solar,
    heart: theme.colors.chakra.heart,
    throat: theme.colors.chakra.throat,
    third_eye: theme.colors.chakra.third_eye,
    crown: theme.colors.chakra.crown,
  };
  
  return chakraColors[chakraName] || theme.colors.primary;
};
