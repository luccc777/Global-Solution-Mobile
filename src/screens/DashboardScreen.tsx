import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import RadarChart from '../components/RadarChart';
import StatCard from '../components/StatCard';
import RecommendationCard from '../components/RecommendationCard';
import { COLORS } from '../utils/constants';
import { useSkillTrack } from '../context/SkillTrackContext';
import {
  calculateProfessionalLevel,
  calculateWeeklyHours,
  getRiskSkills,
  getRecommendationMessages,
} from '../services/analyticsService';

const DashboardScreen: React.FC = () => {
  const { skills, practices, assessments } = useSkillTrack();

  const professionalLevel = useMemo(() => calculateProfessionalLevel(skills, practices), [skills, practices]);
  const weeklyHours = useMemo(() => calculateWeeklyHours(practices), [practices]);
  const riskSkills = useMemo(() => getRiskSkills(skills, practices), [skills, practices]);
  const recommendations = useMemo(
    () => getRecommendationMessages(skills, practices, assessments),
    [skills, practices, assessments],
  );

  const radarData = useMemo(() => {
    if (!skills.length) return [];
    return [...skills]
      .sort((a, b) => b.currentLevel - a.currentLevel)
      .slice(0, 6)
      .map((skill) => ({
        label: skill.name.substring(0, 8),
        value: Number(skill.currentLevel || 0),
      }));
  }, [skills]);

  const suggestion = useMemo(() => {
    if (!skills.length) return 'Cadastre sua primeira habilidade para começar!';
    const counts = skills.map((skill) => ({
      name: skill.name,
      count: practices.filter((practice) => practice.skillId === skill.id).length,
    }));
    const target = counts.sort((a, b) => a.count - b.count)[0];
    return `Sugestão: Foque em ${target.name}`;
  }, [skills, practices]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} accessibilityRole="scrollbar">
      <Text style={styles.title} accessibilityRole="header">
        Visão Geral
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.flex}>
          <StatCard label="Nível Profissional Atual" value={professionalLevel} icon="⭐" />
        </View>
        <View style={styles.flex}>
          <StatCard label="Horas na semana" value={`${weeklyHours}h`} icon="⏱️" color={COLORS.secondary} />
        </View>
      </View>

      <View style={styles.card} accessibilityRole="summary">
        <Text style={styles.cardTitle}>Radar de Habilidades</Text>
        <RadarChart data={radarData} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Habilidades em Risco</Text>
        {riskSkills.length ? (
          riskSkills.map((skill) => (
            <View key={skill.id} style={styles.riskItem} accessibilityLabel={`${skill.name} requer atenção`}>
              <Text style={styles.riskName}>{skill.name}</Text>
              <Text style={styles.riskBadge}>Requer atenção</Text>
            </View>
          ))
        ) : (
          <Text style={styles.empty}>Nenhuma habilidade crítica no momento.</Text>
        )}
      </View>

      <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={[styles.card, styles.gradient]}>
        <Text style={styles.cardTitle}>{suggestion}</Text>
        <Text style={styles.subtitle}>
          Insights inteligentes analisam sua frequência de práticas para orientar o foco de desenvolvimento.
        </Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recomendações Inteligentes</Text>
        {recommendations.length ? (
          recommendations.map((message, index) => <RecommendationCard key={`${message}-${index}`} message={message} />)
        ) : (
          <Text style={styles.empty}>Sem recomendações no momento. Continue praticando!</Text>
        )}
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
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  flex: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.background,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: COLORS.textDark,
  },
  gradient: {
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  subtitle: {
    color: COLORS.textDark,
    lineHeight: 20,
  },
  riskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  riskName: {
    fontWeight: '600',
    color: COLORS.textDark,
  },
  riskBadge: {
    color: COLORS.alert,
    fontWeight: '700',
  },
  empty: {
    color: COLORS.textLight,
  },
});

export default DashboardScreen;
