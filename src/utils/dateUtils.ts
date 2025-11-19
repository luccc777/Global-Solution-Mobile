import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import duration from 'dayjs/plugin/duration';
import { Practice } from '../types';

dayjs.extend(isoWeek);
dayjs.extend(duration);

export const formatDate = (value?: string | number | Date | null): string => {
  if (!value) return '—';
  return dayjs(value).format('DD/MM/YYYY');
};

export const formatDateTime = (value?: string | number | Date | null): string => {
  if (!value) return '—';
  return dayjs(value).format('DD/MM/YYYY HH:mm');
};

export const withinLastDays = (date?: string | number | Date | null, days = 30): boolean => {
  if (!date) return false;
  return dayjs(date).isAfter(dayjs().subtract(days, 'day'));
};

export const getWeekHours = (practices: Practice[] = []): string => {
  const startOfWeek = dayjs().startOf('week');
  const totalMinutes = practices
    .filter((item) => dayjs(item.timestamp).isAfter(startOfWeek))
    .reduce((acc, curr) => acc + Number(curr.duration || 0), 0);
  return (totalMinutes / 60).toFixed(1);
};

export const getMonthPractices = (practices: Practice[] = [], skillId: string): Practice[] => {
  const start = dayjs().subtract(30, 'day');
  return practices.filter(
    (practice) => practice.skillId === skillId && dayjs(practice.timestamp).isAfter(start),
  );
};

export const getStreak = (practices: Practice[] = []): number => {
  const sorted = [...practices].sort((a, b) => b.timestamp - a.timestamp);
  if (!sorted.length) return 0;
  let streak = 0;
  let currentDay = dayjs().startOf('day');

  sorted.forEach((item) => {
    const practiceDay = dayjs(item.timestamp).startOf('day');
    if (practiceDay.isSame(currentDay)) {
      streak += 1;
      currentDay = currentDay.subtract(1, 'day');
    } else if (practiceDay.isSame(currentDay.subtract(1, 'day'))) {
      streak += 1;
      currentDay = currentDay.subtract(1, 'day');
    }
  });

  return streak;
};

export const daysSince = (date?: string | number | Date | null): number => {
  if (!date) return Number.POSITIVE_INFINITY;
  return dayjs().diff(dayjs(date), 'day');
};

export const linearlyEstimateWeeks = (
  currentLevel: number,
  targetLevel: number,
  avgGrowthPerAssessment: number | null,
): number | null => {
  if (!avgGrowthPerAssessment || avgGrowthPerAssessment <= 0) return null;
  const delta = targetLevel - currentLevel;
  if (delta <= 0) return 0;
  const estimatedDays = (delta / avgGrowthPerAssessment) * 30;
  return Math.ceil(estimatedDays / 7);
};
