import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY, DEFAULT_PROFILE } from '../utils/constants';
import { Assessment, Practice, Skill, UserProfile } from '../types';

type PersistedData = {
  skills: Skill[];
  practices: Practice[];
  assessments: Assessment[];
  profile: UserProfile;
};

const getEmptyState = (): PersistedData => ({
  skills: [],
  practices: [],
  assessments: [],
  profile: { ...DEFAULT_PROFILE },
});

const asArray = <T>(value?: T[] | null): T[] => (Array.isArray(value) ? value : []);

const normalizeState = (state?: Partial<PersistedData> | null): PersistedData => ({
  skills: asArray(state?.skills),
  practices: asArray(state?.practices),
  assessments: asArray(state?.assessments),
  profile: state?.profile ? { ...DEFAULT_PROFILE, ...state.profile } : { ...DEFAULT_PROFILE },
});

const readState = async (): Promise<PersistedData> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getEmptyState();
    }
    const parsed = JSON.parse(stored) as Partial<PersistedData>;
    return normalizeState(parsed);
  } catch (error) {
    console.warn('Storage read error', error);
    return getEmptyState();
  }
};

const writeState = async (state: PersistedData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Storage write error', error);
  }
};

const mergeState = async (patch: Partial<PersistedData>): Promise<PersistedData> => {
  const current = await readState();
  const next = normalizeState({ ...current, ...patch });
  await writeState(next);
  return next;
};

export const storageService = {
  getState: readState,
  saveState: writeState,

  getSkills: async (): Promise<Skill[]> => (await readState()).skills,
  saveSkills: async (skills: Skill[]): Promise<void> => {
    await mergeState({ skills });
  },

  getPractices: async (): Promise<Practice[]> => (await readState()).practices,
  savePractices: async (practices: Practice[]): Promise<void> => {
    await mergeState({ practices });
  },

  getAssessments: async (): Promise<Assessment[]> => (await readState()).assessments,
  saveAssessments: async (assessments: Assessment[]): Promise<void> => {
    await mergeState({ assessments });
  },

  getProfile: async (): Promise<UserProfile> => (await readState()).profile,
  saveProfile: async (profile: UserProfile): Promise<void> => {
    await mergeState({ profile });
  },

  clearAll: async (): Promise<PersistedData> => {
    const empty = getEmptyState();
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      await writeState(empty);
    } catch (error) {
      console.warn('Storage clear error', error);
    }
    return empty;
  },
};
