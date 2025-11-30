import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: number;
  addStyles?: Object;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 48,
  addStyles
}) => {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <View style={[styles.avatar,!source && addStyles, { width: size, height: size, borderRadius: size / 2 }]}>
      {source ? (
        <Image source={{ uri: source }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
          {name ? getInitials(name) : '?'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#fff',
    fontWeight: 'bold',
  },
});