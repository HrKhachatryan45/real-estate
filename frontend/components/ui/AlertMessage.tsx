import { Check, CircleX, Info, TriangleAlert } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface AlertMessageProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export const AlertMessage: React.FC<AlertMessageProps> = ({
  type = 'info',
  message,
  onClose,
}) => {
  return (
    <View style={[styles.container, styles[type]]}>
      <Text style={styles.icon}>{getIcon(type)}</Text>
      <Text style={styles.message}>{message}</Text>
      {onClose && (
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return <Check/> ;
    case 'error': return <CircleX/>;
    case 'warning': return <TriangleAlert/>;
    case 'info': return <Info/>;
    default: return <Info/>;
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  success: {
    backgroundColor: '#D1F2EB',
  },
  error: {
    backgroundColor: '#FADBD8',
  },
  warning: {
    backgroundColor: '#FCF3CF',
  },
  info: {
    backgroundColor: '#D6EAF8',
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    color: '#666',
  },
});