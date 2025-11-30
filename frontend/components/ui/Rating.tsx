import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface RatingProps {
  value: number;
  maxRating?: number;
  onRate?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  maxRating = 5,
  onRate,
  size = 24,
  readonly = false,
}) => {
  return (
    <View style={styles.container}>
      {[...Array(maxRating)].map((_, index) => {
        const rating = index + 1;
        return (
          <TouchableOpacity
            key={index}
            onPress={() => !readonly && onRate && onRate(rating)}
            disabled={readonly}
          >
            <Text style={[styles.star, { fontSize: size }]}>
              {rating <= value ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  star: {
    color: '#FFD700',
    marginHorizontal: 2,
  },
});