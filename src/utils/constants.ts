import { ActivityType, Badge, DifficultyLevel, SkillCategory, UserProfile } from '../types';

export const COLORS = {
  primary: '#3B82F6', // Azul vibrante (blue-500)
  secondary: '#10B981', // Verde esmeralda (emerald-500)
  alert: '#F59E0B', // Amarelo/laranja (amber-500)
  success: '#22C55E', // Verde sucesso (green-500)
  background: '#0F172A', // Azul muito escuro (slate-900)
  textDark: '#FFFFFF', // Texto branco para máximo contraste
  textLight: '#CBD5E1', // Texto cinza claro (slate-300)
  card: '#1E293B', // Card escuro (slate-800)
  border: '#475569', // Borda mais visível (slate-600)
  cardElevated: '#334155', // Card elevado (slate-700)
  gradientStart: '#1E293B',
  gradientEnd: '#0F172A',
  headerBackground: '#1E293B', // Background do header
} as const;

export const SKILL_CATEGORIES: SkillCategory[] = ['Técnica', 'Comportamental', 'Idioma', 'Gestão'];

export const ACTIVITY_TYPES: ActivityType[] = [
  'Estudo teórico',
  'Prática hands-on',
  'Projeto',
  'Curso',
  'Mentoria',
];

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [1, 2, 3, 4, 5];

export const STORAGE_KEY = '@skilltrack:data';

export const BADGE_DEFINITIONS: Badge[] = [
  { id: 'first_practice', label: 'Primeiro Passo', description: 'Primeira prática registrada' },
  { id: 'weekly_streak', label: 'Consistente', description: '7 dias consecutivos praticando' },
  { id: 'polymath', label: 'Polímata', description: '5+ habilidades cadastradas' },
  { id: 'dedicated', label: 'Dedicado', description: '100 horas totais de prática' },
  { id: 'expert', label: 'Expert', description: 'Alguma habilidade chegou ao nível 10' },
];

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  role: '',
  startDate: '',
  photo: null,
};
