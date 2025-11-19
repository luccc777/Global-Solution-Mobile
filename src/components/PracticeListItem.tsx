import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';
import { formatDateTime } from '../utils/dateUtils';
import { Practice } from '../types';

interface PracticeListItemProps {
  practice: Practice;
}

const PracticeListItem: React.FC<PracticeListItemProps> = ({ practice }) => (
  <View
    style={styles.container}
    accessible
    accessibilityLabel={`${practice.skillName}, ${practice.duration} minutos, atividade ${practice.activityType}`}
  >
    <View style={styles.row}>
      <Text style={styles.skill}>{practice.skillName}</Text>
      <Text style={styles.duration}>{practice.duration} min</Text>
    </View>
    <Text style={styles.meta}>
      {practice.activityType} • Dificuldade {practice.difficulty}
    </Text>
    <Text style={styles.meta}>{formatDateTime(practice.timestamp)}</Text>
    {practice.note ? <Text style={styles.note}>{practice.note}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skill: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  duration: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  meta: {
    color: COLORS.textLight,
    marginTop: 2,
  },
  note: {
    marginTop: 6,
    color: COLORS.textDark,
  },
});

export default PracticeListItem;
