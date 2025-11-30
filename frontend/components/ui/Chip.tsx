import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ChipProps {
  label: string;
  onRemove?: () => void;
  variant?: 'primary' | 'default';
}

export const Chip: React.FC<ChipProps> = ({
  label,
  onRemove,
  variant = 'default',
}) => {
  return (
    <View style={[styles.chip, styles[variant]]}>
      <Text style={[styles.text, styles[`${variant}Text`]]}>{label}</Text>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
          <Text style={styles.removeIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  default: {
    backgroundColor: '#E5E5EA',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  defaultText: {
    color: '#333',
  },
  primaryText: {
    color: '#fff',
  },
  removeButton: {
    marginLeft: 4,
    padding: 2,
  },
  removeIcon: {
    fontSize: 16,
    color: '#666',
  },
});