import { useMemo } from 'react';
import { useSkillTrack } from '../context/SkillTrackContext';
import { Assessment, AssessmentPayload } from '../types';

export const useAssessments = (): {
  assessments: Assessment[];
  addAssessment: (assessment: AssessmentPayload) => Promise<void>;
} => {
  const { assessments, addAssessment } = useSkillTrack();

  const orderedAssessments = useMemo(
    () => [...assessments].sort((a, b) => b.timestamp - a.timestamp),
    [assessments],
  );

  return {
    assessments: orderedAssessments,
    addAssessment,
  };
};
