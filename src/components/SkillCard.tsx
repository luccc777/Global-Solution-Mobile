import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { COLORS } from '../utils/constants';
import { formatDate } from '../utils/dateUtils';
import { Skill } from '../types';

interface SkillCardProps {
  skill: Skill;
  onPress?: (event: GestureResponderEvent) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, onPress, onEdit, onDelete }) => (
  <TouchableOpacity
    style={styles.container}
    onPress={onPress}
    activeOpacity={0.85}
    accessible
    accessibilityRole="button"
    accessibilityLabel={`Habilidade ${skill.name} nível ${skill.currentLevel}`}
    accessibilityHint="Toque para visualizar ou editar detalhes"
  >
    <View style={styles.header}>
      <View>
        <Text style={styles.name}>{skill.name}</Text>
        <Text style={styles.category}>{skill.category}</Text>
      </View>
      <Text style={styles.level}>{skill.currentLevel}/10</Text>
    </View>
    <View style={styles.progress}>
      <Text style={styles.meta}>Meta: {skill.targetLevel}</Text>
      <Text style={styles.meta}>Início: {formatDate(skill.startDate)}</Text>
      <Text style={styles.meta}>Última prática: {skill.lastPractice ? formatDate(skill.lastPractice) : '—'}</Text>
    </View>
    {(onEdit || onDelete) && (
      <View style={styles.actions}>
        {onEdit ? (
          <Text style={styles.action} onPress={onEdit} accessibilityRole="button">
            Editar
          </Text>
        ) : null}
        {onDelete ? (
          <Text style={styles.actionDelete} onPress={onDelete} accessibilityRole="button">
            Excluir
          </Text>
        ) : null}
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#111827',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  category: {
    color: COLORS.textLight,
  },
  level: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  progress: {
    marginTop: 12,
  },
  meta: {
    color: COLORS.textLight,
    marginBottom: 4,
  },
  actions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  action: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  actionDelete: {
    color: COLORS.alert,
    fontWeight: '600',
  },
});

export default SkillCard;
