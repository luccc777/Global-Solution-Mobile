import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

interface RecommendationCardProps {
  message: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ message }) => (
  <View style={styles.container} accessible accessibilityRole="text" accessibilityLabel={message}>
    <Text style={styles.icon}>🤖</Text>
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardElevated,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.background,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  text: {
    flex: 1,
    color: COLORS.textDark,
  },
});

export default RecommendationCard;
