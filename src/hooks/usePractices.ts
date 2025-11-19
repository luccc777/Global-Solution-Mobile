import { useMemo } from 'react';
import { useSkillTrack } from '../context/SkillTrackContext';
import { Practice, PracticePayload } from '../types';

export const usePractices = (): {
  practices: Practice[];
  addPractice: (practice: PracticePayload) => Promise<void>;
} => {
  const { practices, addPractice } = useSkillTrack();

  const orderedPractices = useMemo(
    () => [...practices].sort((a, b) => b.timestamp - a.timestamp),
    [practices],
  );

  return {
    practices: orderedPractices,
    addPractice,
  };
};
