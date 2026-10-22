import {
  PeriodDefinition,
  Subject,
  Room,
  Teacher,
  ClassInfo,
  TimetableCell,
  SchoolProfile,
  SubstitutionAssignment,
} from '../types/timetable';
import {
  DEFAULT_PERIODS,
  DEFAULT_SUBJECTS,
  DEFAULT_ROOMS,
  DEFAULT_TEACHERS,
  DEFAULT_CLASSES,
  DEFAULT_SCHOOL_PROFILE,
  generateInitialTimetable,
} from '../data/defaultData';

const STORAGE_KEYS = {
  PERIODS: 'shala_periods_v1',
  SUBJECTS: 'shala_subjects_v1',
  ROOMS: 'shala_rooms_v1',
  TEACHERS: 'shala_teachers_v1',
  CLASSES: 'shala_classes_v1',
  TIMETABLE: 'shala_timetable_v1',
  PROFILE: 'shala_profile_v1',
  SUBSTITUTIONS: 'shala_substitutions_v1',
  LANG: 'shala_lang_v1',
};

export const loadInitialData = () => {
  try {
    const storedPeriods = localStorage.getItem(STORAGE_KEYS.PERIODS);
    const storedSubjects = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    const storedRooms = localStorage.getItem(STORAGE_KEYS.ROOMS);
    const storedTeachers = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    const storedClasses = localStorage.getItem(STORAGE_KEYS.CLASSES);
    const storedTimetable = localStorage.getItem(STORAGE_KEYS.TIMETABLE);
    const storedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const storedSubs = localStorage.getItem(STORAGE_KEYS.SUBSTITUTIONS);
    const storedLang = (localStorage.getItem(STORAGE_KEYS.LANG) as 'hi' | 'en') || 'hi';

    return {
      periods: storedPeriods ? (JSON.parse(storedPeriods) as PeriodDefinition[]) : DEFAULT_PERIODS,
      subjects: storedSubjects ? (JSON.parse(storedSubjects) as Subject[]) : DEFAULT_SUBJECTS,
      rooms: storedRooms ? (JSON.parse(storedRooms) as Room[]) : DEFAULT_ROOMS,
      teachers: storedTeachers ? (JSON.parse(storedTeachers) as Teacher[]) : DEFAULT_TEACHERS,
      classes: storedClasses ? (JSON.parse(storedClasses) as ClassInfo[]) : DEFAULT_CLASSES,
      timetable: storedTimetable ? (JSON.parse(storedTimetable) as TimetableCell[]) : generateInitialTimetable(),
      profile: storedProfile ? (JSON.parse(storedProfile) as SchoolProfile) : DEFAULT_SCHOOL_PROFILE,
      substitutions: storedSubs ? (JSON.parse(storedSubs) as SubstitutionAssignment[]) : [],
      lang: storedLang,
    };
  } catch (e) {
    console.error('Failed to parse stored timetable data, falling back to defaults:', e);
    return {
      periods: DEFAULT_PERIODS,
      subjects: DEFAULT_SUBJECTS,
      rooms: DEFAULT_ROOMS,
      teachers: DEFAULT_TEACHERS,
      classes: DEFAULT_CLASSES,
      timetable: generateInitialTimetable(),
      profile: DEFAULT_SCHOOL_PROFILE,
      substitutions: [],
      lang: 'hi' as 'hi' | 'en',
    };
  }
};

export const saveToStorage = (key: keyof typeof STORAGE_KEYS, data: unknown) => {
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to storage`, e);
  }
};

export const exportAllDataAsJSON = () => {
  const data = loadInitialData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `shala-timetable-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const resetAllData = () => {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  window.location.reload();
};
