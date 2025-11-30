import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TagProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
}

export const Tag: React.FC<TagProps> = ({
  label,
  variant = 'default',
}) => {
  return (
    <View style={[styles.tag, styles[variant]]}>
      <Text style={[styles.text, styles[`${variant}Text`]]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  default: {
    backgroundColor: '#E5E5EA',
  },
  primary: {
    backgroundColor: '#D6EAF8',
  },
  success: {
    backgroundColor: '#D1F2EB',
  },
  warning: {
    backgroundColor: '#FCF3CF',
  },
  danger: {
    backgroundColor: '#FADBD8',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  defaultText: {
    color: '#666',
  },
  primaryText: {
    color: '#007AFF',
  },
  successText: {
    color: '#34C759',
  },
  warningText: {
    color: '#FF9500',
  },
  dangerText: {
    color: '#FF3B30',
  },
});