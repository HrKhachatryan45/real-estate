// Premium Real Estate App Color Scheme
// Inspired by luxury properties and modern architecture

const brandPrimary = '#1A5F7A'; // Deep teal - trust, stability, premium
const brandSecondary = '#C57B57'; // Warm terracotta - welcoming, home
const brandAccent = '#D4AF37'; // Gold - luxury, prestige

export default {
  light: {
    // Text colors
    text: '#1a1a1a',
    textSecondary: '#666666',
    textMuted: '#999999',
    
    // Backgrounds
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    backgroundTertiary: '#F0F2F5',
    
    // Brand colors
    primary: brandPrimary,
    primaryLight: '#2A7F9F',
    primaryDark: '#0F4A5E',
    
    secondary: brandSecondary,
    secondaryLight: '#D69170',
    
    accent: brandAccent,
    accentLight: '#E0C55B',
    
    // UI Elements
    tint: brandPrimary,
    tabIconDefault: '#BDBDBD',
    tabIconSelected: brandPrimary,
    
    // Card & Components
    card: '#FFFFFF',
    cardBorder: '#E8E8E8',
    divider: '#E0E0E0',
    
    // Status colors
    success: '#059669',
    error: '#DC2626',
    warning: '#F59E0B',
    info: '#3B82F6',
    
    // Splash screen specific
    splashBackground: brandPrimary,
    splashPrimary: '#FFFFFF',
    splashSecondary: brandAccent,
  },
  
  dark: {
    // Text colors
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textMuted: '#808080',
    
    // Backgrounds
    background: '#0F0F0F',
    backgroundSecondary: '#1A1A1A',
    backgroundTertiary: '#242424',
    
    // Brand colors (slightly adjusted for dark mode)
    primary: '#2A94B8',
    primaryLight: '#3AACCC',
    primaryDark: '#1A5F7A',
    
    secondary: '#D69170',
    secondaryLight: '#E0A389',
    
    accent: '#E0C55B',
    accentLight: '#EBD27E',
    
    // UI Elements
    tint: '#2A94B8',
    tabIconDefault: '#666666',
    tabIconSelected: '#2A94B8',
    
    // Card & Components
    card: '#1F1F1F',
    cardBorder: '#333333',
    divider: '#2A2A2A',
    
    // Status colors (adjusted for dark mode)
    success: '#10B981',
    error: '#EF4444',
    warning: '#FBBf24',
    info: '#60A5FA',
    
    // Splash screen specific
    splashBackground: '#0A1F2E', // Darker teal for sophistication
    splashPrimary: '#FFFFFF',
    splashSecondary: '#E0C55B',
  },
};
