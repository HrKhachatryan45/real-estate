import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import { ChevronDown } from 'lucide-react-native';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  addStyles?: object;
  placeholder:String
}

export const Select: React.FC<SelectProps> = ({
  selectedValue,
  onValueChange,
  options,
  addStyles = {},
  placeholder
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const color = useColorScheme();
  const theme = Colors[color ?? 'light'];

  const selectedLabel = options.find(opt => opt.value === selectedValue)?.label || placeholder

  return (
    <View style={[styles.container, addStyles,{position:'relative'}]}>
      {/* Selected value button */}
      <TouchableOpacity
        style={[styles.selectedButton, { backgroundColor: theme.background, borderColor: theme.textSecondary }]}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Text style={{ color: theme.text }}>{selectedLabel}</Text>
      </TouchableOpacity>

      <ChevronDown size={18} color={'black'} style={{right:10,position:'absolute',top:10}}/>
      {/* Dropdown list */}
      {showDropdown && (
        <ScrollView style={[styles.dropdown, { backgroundColor: theme.background, borderColor: theme.textSecondary }]}>
          {options.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={styles.dropdownItem}
              onPress={() => {
                onValueChange(opt.value);
                setShowDropdown(false);
              }}
            >
              <Text style={[styles.dropdownText, { color: theme.text }]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    position:'relative'
  },
  selectedButton: {
    borderRadius:8,
    padding: 12,
  },
  dropdown: {
    borderWidth: 1,
    marginTop: 4,
    borderRadius: 8,
    maxHeight: 200, // scrollable if many optionsp
    position:'absolute',
    zIndex:200,
    top:32
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownText: {
    fontSize: 16,
  },
});
