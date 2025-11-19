import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import type { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import ChartContainer from '../components/ChartContainer';
import StatCard from '../components/StatCard';
import { COLORS } from '../utils/constants';
import { useSkillTrack } from '../context/SkillTrackContext';
import {
  getAssessmentLineData,
  getHoursBySkill,
  getCategoryDistribution,
  getSkillProgression,
  getGoalCompletionRate,
  getMostPracticedSkill,
  getHoursSummary,
  getPredictiveInsight,
} from '../services/analyticsService';

const chartConfig: AbstractChartConfig = {
  backgroundColor: COLORS.card,
  backgroundGradientFrom: COLORS.card,
  backgroundGradientTo: COLORS.cardElevated,
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(59,130,246, ${opacity})`, // COLORS.primary com opacidade
  labelColor: (opacity = 1) => `rgba(255,255,255, ${opacity})`, // COLORS.textDark com opacidade
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: COLORS.primary,
  },
  propsForBackgroundLines: {
    strokeDasharray: '',
    stroke: COLORS.border,
    strokeOpacity: 0.3,
  },
  fillShadowGradient: COLORS.primary,
  fillShadowGradientOpacity: 0.1,
};

const screenWidth = Dimensions.get('window').width - 48;

const AnalyticsScreen: React.FC = () => {
  const { skills, practices, assessments } = useSkillTrack();

  const summary = useMemo(() => getHoursSummary(practices), [practices]);
  const lineData = useMemo(() => getAssessmentLineData(assessments), [assessments]);
  const hoursBySkill = useMemo(() => getHoursBySkill(skills, practices), [skills, practices]);
  const categoryDistribution = useMemo(
    () => getCategoryDistribution(skills, practices),
    [skills, practices],
  );
  const progression = useMemo(() => getSkillProgression(assessments), [assessments]);
  const goalRate = useMemo(() => getGoalCompletionRate(skills), [skills]);
  const mostPracticed = useMemo(() => getMostPracticedSkill(skills, practices), [skills, practices]);
  const predictive = useMemo(
    () => getPredictiveInsight(skills, assessments, practices),
    [skills, assessments, practices],
  );

  const comparison = useMemo(
    () =>
      skills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        current: Number(skill.currentLevel || 0),
        target: Number(skill.targetLevel || 0),
      })),
    [skills],
  );

  const hasHoursData = hoursBySkill.labels.length > 0;
  const hasAssessments = Boolean(assessments.length);
  const safeWidth = Math.max(screenWidth, 320);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      accessibilityRole="scrollbar"
      alwaysBounceVertical={false}
    >
      <Text style={styles.title} accessibilityRole="header">
        Analytics & Insights
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.flex}>
          <StatCard label="Horas totais" value={`${summary.totalHours}h`} icon="🕒" />
        </View>
        <View style={styles.flex}>
          <StatCard label="Média semanal" value={`${summary.weeklyAverage}h`} icon="📈" color={COLORS.secondary} />
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.flex}>
          <StatCard label="Skill mais praticada" value={mostPracticed?.name || '—'} icon="🏆" color={COLORS.alert} />
        </View>
        <View style={styles.flex}>
          <StatCard label="Maior evolução" value={progression?.skillName || '—'} icon="🚀" color={COLORS.success} />
        </View>
      </View>

      <View style={styles.card} accessible accessibilityLabel={`Taxa de alcance de metas ${goalRate}%`}>
        <Text style={styles.cardTitle}>Taxa de alcance de metas</Text>
        <Text style={styles.goalRate}>{goalRate}% das habilidades atingiram a meta</Text>
      </View>

      {predictive ? (
        <View style={[styles.card, styles.predictive]} accessible accessibilityLabel="Análise preditiva">
          <Text style={styles.cardTitle}>Análise preditiva</Text>
          <Text style={styles.predictiveText}>
            Com base no seu ritmo atual de {predictive.weeklyHours}h/semana, você alcançará o nível meta de{' '}
            {predictive.skillName} em aproximadamente {predictive.weeks} semanas.
          </Text>
        </View>
      ) : null}

      <ChartContainer title="Evolução de níveis">
        {hasAssessments ? (
          <LineChart data={lineData} width={safeWidth} height={220} chartConfig={chartConfig} bezier />
        ) : (
          <Text style={styles.empty}>Registre autoavaliações para visualizar esta curva.</Text>
        )}
      </ChartContainer>

      <ChartContainer title="Horas dedicadas por habilidade (30 dias)">
        {hasHoursData ? (
          <BarChart
            width={safeWidth}
            height={220}
            data={{ labels: hoursBySkill.labels, datasets: [{ data: hoursBySkill.data }] }}
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
            yAxisLabel=""
            yAxisSuffix="h"
          />
        ) : (
          <Text style={styles.empty}>Ainda não há dados suficientes.</Text>
        )}
      </ChartContainer>

      <ChartContainer title="Distribuição de tempo por categoria">
        {categoryDistribution.length ? (
          <PieChart
            data={categoryDistribution.map((item) => ({
              name: item.name,
              population: item.minutes,
              color: item.color,
              legendFontColor: item.legendFontColor,
              legendFontSize: item.legendFontSize,
            }))}
            width={safeWidth}
            height={220}
            accessor="population"
            backgroundColor={COLORS.card}
            paddingLeft="16"
            absolute
            chartConfig={chartConfig}
          />
        ) : (
          <Text style={styles.empty}>Cadastre práticas para visualizar este gráfico.</Text>
        )}
      </ChartContainer>

      <ChartContainer title="Comparativo nível atual x meta">
        {comparison.length ? (
          <View style={styles.compareList}>
            {comparison.map((item) => {
              const currentPerc = (item.current / 10) * 100;
              const targetPerc = (item.target / 10) * 100;
              return (
                <View key={item.id} style={styles.compareItem} accessible accessibilityLabel={`Situação da skill ${item.name}`}>
                  <Text style={styles.compareLabel}>{item.name}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.targetBar, { width: `${Math.min(targetPerc, 100)}%` }]} />
                    <View style={[styles.currentBar, { width: `${Math.min(currentPerc, 100)}%` }]} />
                  </View>
                  <Text style={styles.compareMeta}>
                    Atual {item.current} • Meta {item.target}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={styles.empty}>Crie habilidades para acompanhar suas metas.</Text>
        )}
      </ChartContainer>
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
    marginBottom: 12,
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
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: COLORS.textDark,
  },
  goalRate: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  predictive: {
    backgroundColor: COLORS.cardElevated,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  predictiveText: {
    color: COLORS.textDark,
    lineHeight: 20,
  },
  empty: {
    color: COLORS.textLight,
    textAlign: 'center',
  },
  compareList: {
    width: '100%',
  },
  compareItem: {
    marginBottom: 16,
  },
  compareLabel: {
    fontWeight: '600',
    marginBottom: 6,
    color: COLORS.textDark,
  },
  barTrack: {
    backgroundColor: COLORS.border,
    borderRadius: 12,
    height: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  targetBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(16,185,129,0.35)',
  },
  currentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
  },
  compareMeta: {
    marginTop: 4,
    color: COLORS.textLight,
  },
});

export default AnalyticsScreen;
