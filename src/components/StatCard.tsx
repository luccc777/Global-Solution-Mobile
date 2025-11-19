import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color = COLORS.primary }) => (
  <View
    style={[styles.card, { borderColor: color }]}
    accessible
    accessibilityRole="summary"
    accessibilityLabel={`${label}: ${value}`}
  >
    <Text style={styles.icon}>{icon}</Text>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, { color }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
    shadowColor: COLORS.background,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  icon: {
    fontSize: 18,
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
});

export default StatCard;
