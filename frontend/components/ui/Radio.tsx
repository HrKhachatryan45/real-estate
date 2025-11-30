import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioProps {
  options: RadioOption[];
  selected: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export const Radio: React.FC<RadioProps> = ({
  options,
  selected,
  onSelect,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.option}
          onPress={() => onSelect(option.value)}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <View style={styles.radio}>
            {selected === option.value && <View style={styles.selected} />}
          </View>
          <Text style={styles.label}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  selected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  label: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
});