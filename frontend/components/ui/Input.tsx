import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, useColorScheme } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  addStyles?: Object;               // TextInput styles
  inputContainerStyle?: Object;     // ⭐ container styles (width, bg, border, etc.)
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  applyFocus?: boolean;
  containerStyle:Object;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  addStyles,
  inputContainerStyle,
  applyFocus = false,
  containerStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const colors = useColorScheme()
  const theme = Colors[colors ?? 'light'];

  const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.backgroundSecondary,
    borderRadius: 8,
    backgroundColor:theme.background,
  },
  focused: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  error: {
    borderColor: '#FF3B30',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: theme.text,
  },
  leftIcon: {
    marginLeft: 12,
  },
  rightIcon: {
    marginRight: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});



  return (
    <View style={[containerStyle,styles.container]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          inputContainerStyle,       // ⭐ now you can set width, background, border
          applyFocus && isFocused && styles.focused,
          error && styles.error,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, addStyles]}  // ⭐ TextInput styles only
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={theme.text}
          {...props}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};


