import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useSkillTrack } from '../context/SkillTrackContext';
import { COLORS } from '../utils/constants';
import { getStreak } from '../utils/dateUtils';

const formatDateInput = (value?: string) => (value ? value.slice(0, 10) : '');

const ProfileScreen: React.FC = () => {
  const { userProfile, skills, practices, badges, updateProfile, clearAllData } = useSkillTrack();
  const [name, setName] = useState(userProfile.name);
  const [role, setRole] = useState(userProfile.role);
  const [startDate, setStartDate] = useState(formatDateInput(userProfile.startDate));

  const stats = useMemo(() => {
    const totalHours = practices.reduce((acc, item) => acc + Number(item.duration || 0), 0) / 60;
    const strongest = [...skills].sort((a, b) => b.currentLevel - a.currentLevel)[0];
    return {
      totalSkills: skills.length,
      totalHours: totalHours.toFixed(1),
      strongestSkill: strongest?.name || '—',
      streak: getStreak(practices),
    };
  }, [skills, practices]);

  useEffect(() => {
    setName(userProfile.name);
    setRole(userProfile.role);
    setStartDate(formatDateInput(userProfile.startDate));
  }, [userProfile]);

  const handleSave = async () => {
    await updateProfile({
      name,
      role,
      startDate,
    });
    Alert.alert('Perfil', 'Dados atualizados com sucesso!');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Perfil</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Função</Text>
        <TextInput style={styles.input} value={role} onChangeText={setRole} />

        <Text style={styles.label}>Início no app</Text>
        <TextInput style={styles.input} value={startDate} onChangeText={setStartDate} />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityHint="Atualiza seu perfil"
        >
          <Text style={styles.buttonText}>Salvar perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Estatísticas gerais</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Habilidades:</Text>
          <Text style={styles.statValue}>{stats.totalSkills}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Horas totais:</Text>
          <Text style={styles.statValue}>{stats.totalHours}h</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Skill mais forte:</Text>
          <Text style={styles.statValue}>{stats.strongestSkill}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Streak de dias:</Text>
          <Text style={styles.statValue}>{stats.streak}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Badges</Text>
        <View style={styles.badges}>
          {badges.length ? (
            badges.map((badge) => (
              <View key={badge.id} style={styles.badge}>
                <Text style={styles.badgeTitle}>{badge.label}</Text>
                <Text style={styles.badgeDescription}>{badge.description}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.empty}>Conquiste badges praticando continuamente.</Text>
          )}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Configurações</Text>
        <TouchableOpacity
          style={[styles.button, styles.danger]}
          onPress={clearAllData}
          accessibilityRole="button"
          accessibilityHint="Limpa todos os dados armazenados no aplicativo"
        >
          <Text style={styles.buttonText}>Limpar todos os dados</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
  },
  input: {
    backgroundColor: COLORS.cardElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginTop: 4,
    color: COLORS.textDark,
  },
  button: {
    marginTop: 16,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statLabel: {
    color: COLORS.textLight,
  },
  statValue: {
    fontWeight: '600',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badge: {
    width: '48%',
    backgroundColor: COLORS.cardElevated,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badgeTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  badgeDescription: {
    color: COLORS.textDark,
  },
  empty: {
    color: COLORS.textLight,
  },
  secondary: {
    backgroundColor: COLORS.cardElevated,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryText: {
    color: COLORS.primary,
  },
  danger: {
    backgroundColor: COLORS.alert,
  },
});

export default ProfileScreen;
