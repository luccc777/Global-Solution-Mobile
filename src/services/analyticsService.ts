import dayjs from 'dayjs';
import { Assessment, Practice, Skill } from '../types';
import { linearlyEstimateWeeks } from '../utils/dateUtils';
import { SKILL_CATEGORIES } from '../utils/constants';

type LineDataset = {
  data: number[];
  color?: (opacity?: number) => string;
  strokeWidth?: number;
};

export type LineChartData = {
  labels: string[];
  datasets: LineDataset[];
};

export type BarChartData = {
  labels: string[];
  datasets: { data: number[] }[];
};

export type PieSlice = {
  name: string;
  minutes: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

const sumPracticesMinutes = (items: Practice[] = []): number =>
  items.reduce((acc, curr) => acc + Number(curr.duration || 0), 0);

const filterByDays = (items: Practice[] = [], days = 30): Practice[] =>
  items.filter((item) => dayjs(item.timestamp).isAfter(dayjs().subtract(days, 'day')));

export const calculateProfessionalLevel = (skills: Skill[] = [], practices: Practice[] = []): number => {
  if (!skills.length) return 0;
  const weightMap = practices.reduce<Record<string, number>>((acc, practice) => {
    acc[practice.skillId] = (acc[practice.skillId] || 0) + 1;
    return acc;
  }, {});

  const { totalWeighted, totalWeight } = skills.reduce(
    (totals, skill) => {
      const weight = (weightMap[skill.id] || 0) + 1;
      totals.totalWeighted += weight * Number(skill.currentLevel || 0);
      totals.totalWeight += weight;
      return totals;
    },
    { totalWeighted: 0, totalWeight: 0 },
  );

  return totalWeight ? Number((totalWeighted / totalWeight).toFixed(1)) : 0;
};

export const calculateWeeklyHours = (practices: Practice[] = []): number => {
  const startOfWeek = dayjs().startOf('week');
  const totalMinutes = practices
    .filter((practice) => dayjs(practice.timestamp).isAfter(startOfWeek))
    .reduce((acc, curr) => acc + Number(curr.duration || 0), 0);

  return Number((totalMinutes / 60).toFixed(1));
};

export const getSkillPracticeCount = (skillId: string, practices: Practice[] = [], days = 30): number =>
  practices.filter(
    (practice) => practice.skillId === skillId && dayjs(practice.timestamp).isAfter(dayjs().subtract(days, 'day')),
  ).length;

export const getRiskSkills = (skills: Skill[] = [], practices: Practice[] = []): Skill[] =>
  skills.filter((skill) => getSkillPracticeCount(skill.id, practices, 30) < 3);

export const getMostPracticedSkill = (skills: Skill[] = [], practices: Practice[] = []): Skill | null => {
  if (!skills.length || !practices.length) return null;
  const totals = practices.reduce<Record<string, number>>((acc, item) => {
    acc[item.skillId] = (acc[item.skillId] || 0) + Number(item.duration || 0);
    return acc;
  }, {});
  const skillId = Object.keys(totals).sort((a, b) => totals[b] - totals[a])[0];
  return skills.find((skill) => skill.id === skillId) || null;
};

export const getHoursBySkill = (skills: Skill[] = [], practices: Practice[] = []): { labels: string[]; data: number[] } => {
  void skills; // skills list used only for context; keep signature for future evolution
  const last30Days = filterByDays(practices, 30);
  const grouped = last30Days.reduce<Record<string, number>>((acc, practice) => {
    acc[practice.skillName] = (acc[practice.skillName] || 0) + Number(practice.duration || 0);
    return acc;
  }, {});

  const labels = Object.keys(grouped);
  const data = labels.map((label) => Number((grouped[label] / 60).toFixed(1)));

  return { labels, data };
};

export const getCategoryDistribution = (skills: Skill[] = [], practices: Practice[] = []): PieSlice[] => {
  const totals = SKILL_CATEGORIES.reduce<Record<string, number>>((acc, category) => {
    acc[category] = 0;
    return acc;
  }, {});

  practices.forEach((practice) => {
    const skill = skills.find((item) => item.id === practice.skillId);
    if (skill) {
      totals[skill.category] += Number(practice.duration || 0);
    }
  });

  const colors = [
    'rgba(59, 130, 246, 0.8)', // primary blue
    'rgba(16, 185, 129, 0.8)', // secondary green
    'rgba(245, 158, 11, 0.8)', // alert amber
    'rgba(34, 197, 94, 0.8)', // success green
    'rgba(139, 92, 246, 0.8)', // purple
    'rgba(236, 72, 153, 0.8)', // pink
  ];
  
  return Object.keys(totals)
    .filter((label) => totals[label] > 0)
    .map((label, index) => ({
      name: label,
      minutes: totals[label],
      color: colors[index % colors.length],
      legendFontColor: '#FFFFFF', // white text for dark theme
      legendFontSize: 12,
    }));
};

export const getAssessmentLineData = (assessments: Assessment[] = []): LineChartData => {
  const sorted = [...assessments].sort((a, b) => a.timestamp - b.timestamp);
  return {
    labels: sorted.map((item) => dayjs(item.date).format('DD/MM')),
    datasets: [
      {
        data: sorted.map((item) => Number(item.newLevel || 0)),
        color: (opacity = 1) => `rgba(37,99,235,${opacity})`,
        strokeWidth: 2,
      },
    ],
  };
};

export const getGoalCompletionRate = (skills: Skill[] = []): number => {
  if (!skills.length) return 0;
  const completed = skills.filter((skill) => Number(skill.currentLevel || 0) >= Number(skill.targetLevel || 0)).length;
  return Math.round((completed / skills.length) * 100);
};

export const getSkillProgression = (
  assessments: Assessment[] = [],
): { skillName: string; diff: number } | null => {
  if (!assessments.length) return null;
  const grouped = assessments.reduce<Record<string, Assessment[]>>((acc, item) => {
    if (!acc[item.skillId]) {
      acc[item.skillId] = [];
    }
    acc[item.skillId].push(item);
    return acc;
  }, {});

  let maxDiff = -Infinity;
  let targetSkill: string | null = null;

  Object.keys(grouped).forEach((skillId) => {
    const sorted = grouped[skillId].sort((a, b) => a.timestamp - b.timestamp);
    const diff = sorted[sorted.length - 1].newLevel - sorted[0].previousLevel;
    if (diff > maxDiff) {
      maxDiff = diff;
      targetSkill = sorted[sorted.length - 1].skillName;
    }
  });

  return targetSkill
    ? {
        skillName: targetSkill,
        diff: maxDiff,
      }
    : null;
};

export const calculateAvgGrowth = (assessments: Assessment[] = [], skillId: string): number | null => {
  const skillAssessments = assessments.filter((item) => item.skillId === skillId);
  if (skillAssessments.length < 2) return null;
  const totalDelta = skillAssessments.reduce(
    (acc, item) => acc + Number(item.newLevel || 0) - Number(item.previousLevel || 0),
    0,
  );
  return totalDelta / skillAssessments.length;
};

export const getPredictiveInsight = (
  skills: Skill[] = [],
  assessments: Assessment[] = [],
  practices: Practice[] = [],
): { skillName: string; weeklyHours: number; weeks: number } | null => {
  if (!skills.length || !assessments.length) return null;
  const targetSkill = [...skills].sort(
    (a, b) => b.targetLevel - b.currentLevel - (a.targetLevel - a.currentLevel),
  )[0];
  const avgGrowth = calculateAvgGrowth(assessments, targetSkill.id);
  const estimatedWeeks = linearlyEstimateWeeks(targetSkill.currentLevel, targetSkill.targetLevel, avgGrowth);
  if (estimatedWeeks === null) return null;

  const weeklyHours = calculateWeeklyHours(practices);

  return {
    skillName: targetSkill.name,
    weeklyHours,
    weeks: estimatedWeeks,
  };
};

export const getRecommendationMessages = (
  skills: Skill[] = [],
  practices: Practice[] = [],
  assessments: Assessment[] = [],
): string[] => {
  const messages: string[] = [];
  const now = dayjs();
  const totalMinutes = sumPracticesMinutes(practices);
  const technicalMinutes = practices
    .filter((practice) => {
      const skill = skills.find((item) => item.id === practice.skillId);
      return skill?.category === 'Técnica';
    })
    .reduce((acc, item) => acc + Number(item.duration || 0), 0);

  skills.forEach((skill) => {
    const skillPractices = practices.filter((practice) => practice.skillId === skill.id);
    if (!skillPractices.length) {
      messages.push(`⚠️ ${skill.name} precisa de atenção! Ainda não há práticas.`);
      return;
    }

    const lastPractice = skillPractices.sort((a, b) => b.timestamp - a.timestamp)[0];
    if (now.diff(dayjs(lastPractice.timestamp), 'day') > 14) {
      messages.push(`⚠️ ${skill.name} precisa de atenção! Já se passaram 14 dias sem prática.`);
    }

    if (Number(skill.currentLevel || 0) >= Number(skill.targetLevel || 0)) {
      messages.push(`🎉 Você atingiu sua meta em ${skill.name}! Defina um novo objetivo.`);
    }

    const assessmentsForSkill = assessments.filter((item) => item.skillId === skill.id);
    if (skillPractices.length > 5 && assessmentsForSkill.length < 2) {
      messages.push(`📊 Faça uma autoavaliação de ${skill.name} para medir sua evolução.`);
    }
  });

  if (totalMinutes && technicalMinutes / totalMinutes < 0.3) {
    messages.push('💡 Considere equilibrar habilidades técnicas com mais práticas.');
  }

  if (!practices.length || dayjs().diff(dayjs(practices[0]?.timestamp), 'day') >= 3) {
    messages.push('⏰ Você está há mais de 3 dias sem praticar. Que tal registrar um estudo hoje?');
  }

  const lastAssessment = assessments[0];
  if (!lastAssessment || dayjs().diff(dayjs(lastAssessment.timestamp), 'day') > 30) {
    messages.push('📝 Realize uma autoavaliação para atualizar seus níveis mensais.');
  }

  return messages;
};

export const getHoursSummary = (practices: Practice[] = []): { totalHours: string; weeklyAverage: string } => {
  const totalHours = sumPracticesMinutes(practices) / 60;
  const referenceDate = practices.length ? practices[practices.length - 1].timestamp : Date.now();
  const weeks = Math.max(dayjs().diff(dayjs(referenceDate), 'week'), 1);
  return {
    totalHours: totalHours.toFixed(1),
    weeklyAverage: (totalHours / weeks).toFixed(1),
  };
};
