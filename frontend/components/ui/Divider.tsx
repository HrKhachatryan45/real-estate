import React from 'react';
import { View, StyleSheet } from 'react-native';

interface DividerProps {
  color?: string;
  thickness?: number;
  marginVertical?: number;
}

export const Divider: React.FC<DividerProps> = ({
  color = '#E5E5EA',
  thickness = 1,
  marginVertical = 16,
}) => {
  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: color, height: thickness, marginVertical },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});