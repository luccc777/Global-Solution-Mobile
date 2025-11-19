import { useMemo } from 'react';
import { useSkillTrack } from '../context/SkillTrackContext';
import { Skill, SkillPayload } from '../types';

export const useSkills = (): {
  skills: Skill[];
  addSkill: (skill: SkillPayload) => Promise<void>;
  updateSkill: (skillId: string, data: Partial<Skill>) => Promise<void>;
  deleteSkill: (skillId: string) => void;
} => {
  const { skills, addSkill, updateSkill, deleteSkill } = useSkillTrack();

  const sortedSkills = useMemo(
    () => [...skills].sort((a, b) => b.createdAt - a.createdAt),
    [skills],
  );

  return {
    skills: sortedSkills,
    addSkill,
    updateSkill,
    deleteSkill,
  };
};
