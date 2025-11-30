import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface BadgeProps {
  count?: number;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  style?: ViewStyle;
  maxCount?: number;
}

export const Badge: React.FC<BadgeProps> = ({
  count = 0,
  variant = 'danger',
  style,
  maxCount = 99,
}) => {
  if (count === 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count;

  return (
    <View style={[styles.badge, styles[variant], style]}>
      <Text style={styles.text}>{displayCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  success: {
    backgroundColor: '#34C759',
  },
  warning: {
    backgroundColor: '#FF9500',
  },
  danger: {
    backgroundColor: '#FF3B30',
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});