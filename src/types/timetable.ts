export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

export type PeriodType = 'warning_bell' | 'assembly' | 'period' | 'recess';

export interface PeriodDefinition {
  id: string;
  order: number;
  periodNumber: number | null; // null for warning bell, assembly, recess
  nameHindi: string;
  nameEnglish: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  type: PeriodType;
  isBreak: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  hindiName?: string;
  designation: string; // 'Principal' | 'PGT' | 'TGT' | 'PRT' | 'PTI' | 'Guest'
  photoUrl?: string; // base64 or URL
  gender: 'male' | 'female';
  subjects: string[]; // Subject IDs
  maxPeriodsPerDay: number;
  phone?: string;
  color: string;
  isAbsentToday?: boolean;
}

export interface Subject {
  id: string;
  name: string;
  hindiName: string;
  code: string;
  color: string;
  requiredRoomType?: 'classroom' | 'lab' | 'computer' | 'ground' | 'library';
}

export interface Room {
  id: string;
  name: string;
  hindiName: string;
  type: 'classroom' | 'lab' | 'computer' | 'ground' | 'library';
  capacity: number;
  floor: string;
}

export interface ClassInfo {
  id: string;
  grade: number; // 1 to 12
  section: string; // 'A' | 'B' | 'C'
  stream?: string; // 'General' | 'Science' | 'Commerce' | 'Arts'
  classTeacherId?: string;
  defaultRoomId: string;
}

export interface TimetableCell {
  id: string;
  classId: string;
  day: DayOfWeek;
  periodId: string; // Refers to PeriodDefinition.id
  subjectId: string;
  teacherId: string;
  roomId: string;
  isProxy?: boolean;
  proxyTeacherId?: string;
  notes?: string;
}

export interface SchoolProfile {
  schoolName: string;
  schoolHindiName: string;
  principalName: string;
  udiseCode: string;
  session: string;
  scheduleType: 'winter' | 'summer' | 'custom';
  address: string;
  winterNoticeImage: string;
}

export interface SubstitutionAssignment {
  id: string;
  date: string;
  absentTeacherId: string;
  periodId: string;
  classId: string;
  substituteTeacherId: string;
  subjectId: string;
  status: 'assigned' | 'completed';
}

export interface ConflictResult {
  hasConflict: boolean;
  type?: 'teacher_double_booked' | 'room_double_booked' | 'teacher_absent' | 'teacher_workload_exceeded';
  messageHindi?: string;
  messageEnglish?: string;
  conflictingClass?: string;
}
