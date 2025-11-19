import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { storageService } from '../services/storageService';
import { BADGE_DEFINITIONS, DEFAULT_PROFILE } from '../utils/constants';
import { getStreak } from '../utils/dateUtils';
import {
  Assessment,
  AssessmentPayload,
  Badge,
  Practice,
  PracticePayload,
  Skill,
  SkillPayload,
  UserProfile,
} from '../types';

interface SkillTrackContextValue {
  loading: boolean;
  skills: Skill[];
  practices: Practice[];
  assessments: Assessment[];
  userProfile: UserProfile;
  badges: Badge[];
  addSkill: (skill: SkillPayload) => Promise<void>;
  updateSkill: (skillId: string, data: Partial<Skill>) => Promise<void>;
  deleteSkill: (skillId: string) => void;
  addPractice: (practice: PracticePayload) => Promise<void>;
  addAssessment: (assessment: AssessmentPayload) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  clearAllData: () => void;
  refresh: () => Promise<void>;
}

const SkillTrackContext = createContext<SkillTrackContextValue | undefined>(undefined);

const computeBadges = (skills: Skill[] = [], practices: Practice[] = []): Badge[] => {
  const earned = new Set<string>();
  if (practices.length >= 1) earned.add('first_practice');
  const streak = getStreak(practices);
  if (streak >= 7) earned.add('weekly_streak');
  if (skills.length >= 5) earned.add('polymath');
  const totalHours = practices.reduce((acc, curr) => acc + Number(curr.duration || 0), 0) / 60;
  if (totalHours >= 100) earned.add('dedicated');
  if (skills.some((skill) => Number(skill.currentLevel || 0) >= 10)) earned.add('expert');
  return BADGE_DEFINITIONS.filter((badge) => earned.has(badge.id));
};

export const SkillTrackProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const state = await storageService.getState();
        setSkills(state.skills);
        setPractices(state.practices);
        setAssessments(state.assessments);
        setUserProfile(state.profile);
      } catch (error) {
        console.warn('Load data error', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const persistSkills = async (nextSkills: Skill[]): Promise<void> => {
    setSkills(nextSkills);
    await storageService.saveSkills(nextSkills);
  };

  const persistPractices = async (nextPractices: Practice[]): Promise<void> => {
    setPractices(nextPractices);
    await storageService.savePractices(nextPractices);
  };

  const persistAssessments = async (nextAssessments: Assessment[]): Promise<void> => {
    setAssessments(nextAssessments);
    await storageService.saveAssessments(nextAssessments);
  };

  const addSkill = async (skillPayload: SkillPayload): Promise<void> => {
    const newSkill: Skill = {
      id: uuidv4(),
      createdAt: Date.now(),
      lastPractice: null,
      ...skillPayload,
    };
    await persistSkills([newSkill, ...skills]);
  };

  const updateSkill = async (skillId: string, data: Partial<Skill>): Promise<void> => {
    const updated = skills.map((skill) => (skill.id === skillId ? { ...skill, ...data } : skill));
    await persistSkills(updated);
  };

  const deleteSkill = (skillId: string): void => {
    Alert.alert('Confirmação', 'Deseja remover esta habilidade?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          await persistSkills(skills.filter((skill) => skill.id !== skillId));
          await persistPractices(practices.filter((practice) => practice.skillId !== skillId));
          await persistAssessments(assessments.filter((assessment) => assessment.skillId !== skillId));
        },
      },
    ]);
  };

  const addPractice = async (practicePayload: PracticePayload): Promise<void> => {
    const selectedSkill = skills.find((skill) => skill.id === practicePayload.skillId);
    if (!selectedSkill) return;
    const timestamp = Date.now();
    const newPractice: Practice = {
      id: uuidv4(),
      timestamp,
      date: new Date(timestamp).toISOString(),
      skillName: selectedSkill.name,
      ...practicePayload,
    };
    const updatedPractices = [newPractice, ...practices];
    await persistPractices(updatedPractices);
    await updateSkill(practicePayload.skillId, { lastPractice: timestamp });
  };

  const addAssessment = async (payload: AssessmentPayload): Promise<void> => {
    const skill = skills.find((item) => item.id === payload.skillId);
    if (!skill) return;
    const timestamp = Date.now();
    const assessment: Assessment = {
      id: uuidv4(),
      timestamp,
      skillName: skill.name,
      previousLevel: skill.currentLevel,
      ...payload,
    };
    await persistAssessments([assessment, ...assessments]);
    await updateSkill(skill.id, { currentLevel: payload.newLevel });
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<void> => {
    const nextProfile = { ...userProfile, ...data };
    setUserProfile(nextProfile);
    await storageService.saveProfile(nextProfile);
  };

  const clearAllData = (): void => {
    const performClear = async () => {
      try {
        const state = await storageService.clearAll();
        setSkills(state.skills);
        setPractices(state.practices);
        setAssessments(state.assessments);
        setUserProfile(state.profile);
        Alert.alert('Sucesso', 'Todos os dados foram removidos.');
      } catch (error) {
        console.error('Erro ao limpar dados:', error);
        Alert.alert('Erro', 'Ocorreu um problema ao limpar os dados. Tente novamente.');
      }
    };

    void performClear();
  };

  const badges = useMemo(() => computeBadges(skills, practices), [skills, practices]);

  const value: SkillTrackContextValue = {
    loading,
    skills,
    practices,
    assessments,
    userProfile,
    badges,
    addSkill,
    updateSkill,
    deleteSkill,
    addPractice,
    addAssessment,
    updateProfile,
    clearAllData,
    refresh: async () => {
      const latest = await storageService.getState();
      setSkills(latest.skills);
      setPractices(latest.practices);
      setAssessments(latest.assessments);
      setUserProfile(latest.profile);
    },
  };

  return <SkillTrackContext.Provider value={value}>{children}</SkillTrackContext.Provider>;
};

export const useSkillTrack = (): SkillTrackContextValue => {
  const context = useContext(SkillTrackContext);
  if (!context) {
    throw new Error('useSkillTrack must be used within SkillTrackProvider');
  }
  return context;
};
