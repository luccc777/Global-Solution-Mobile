export type SkillCategory = 'Técnica' | 'Comportamental' | 'Idioma' | 'Gestão';

export type ActivityType = 'Estudo teórico' | 'Prática hands-on' | 'Projeto' | 'Curso' | 'Mentoria';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  currentLevel: number;
  targetLevel: number;
  startDate: string;
  createdAt: number;
  lastPractice: number | null;
}

export interface Practice {
  id: string;
  skillId: string;
  skillName: string;
  duration: number;
  activityType: ActivityType | string;
  difficulty: DifficultyLevel | number;
  note?: string;
  date: string;
  timestamp: number;
}

export interface Assessment {
  id: string;
  skillId: string;
  skillName: string;
  previousLevel: number;
  newLevel: number;
  achievements: string;
  challenges: string;
  nextSteps: string;
  date: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  role: string;
  startDate: string;
  photo: string | null;
}

export type SkillPayload = Omit<Skill, 'id' | 'createdAt' | 'lastPractice'>;

export type PracticePayload = {
  skillId: string;
  duration: number;
  activityType: ActivityType | string;
  difficulty: DifficultyLevel | number;
  note?: string;
};

export type AssessmentPayload = {
  skillId: string;
  newLevel: number;
  achievements: string;
  challenges: string;
  nextSteps: string;
  date: string;
};

export interface Badge {
  id: string;
  label: string;
  description: string;
}
