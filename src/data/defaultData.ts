import { PeriodDefinition, Subject, Room, Teacher, ClassInfo, TimetableCell, SchoolProfile } from '../types/timetable';

// Exact periods from the principal's official notice image:
export const DEFAULT_PERIODS: PeriodDefinition[] = [
  {
    id: 'p-warning',
    order: 1,
    periodNumber: null,
    nameHindi: 'सूचना घंटी',
    nameEnglish: 'Warning Bell',
    startTime: '09:55 AM',
    endTime: '10:00 AM',
    durationMinutes: 5,
    type: 'warning_bell',
    isBreak: true,
  },
  {
    id: 'p-assembly',
    order: 2,
    periodNumber: null,
    nameHindi: 'प्रार्थना सभा',
    nameEnglish: 'Morning Assembly',
    startTime: '10:00 AM',
    endTime: '10:25 AM',
    durationMinutes: 25,
    type: 'assembly',
    isBreak: true,
  },
  {
    id: 'p-1',
    order: 3,
    periodNumber: 1,
    nameHindi: 'कालांश I',
    nameEnglish: 'Period I',
    startTime: '10:25 AM',
    endTime: '11:05 AM',
    durationMinutes: 40,
    type: 'period',
    isBreak: false,
  },
  {
    id: 'p-2',
    order: 4,
    periodNumber: 2,
    nameHindi: 'कालांश II',
    nameEnglish: 'Period II',
    startTime: '11:05 AM',
    endTime: '11:45 AM',
    durationMinutes: 40,
    type: 'period',
    isBreak: false,
  },
  {
    id: 'p-3',
    order: 5,
    periodNumber: 3,
    nameHindi: 'कालांश III',
    nameEnglish: 'Period III',
    startTime: '11:45 AM',
    endTime: '12:25 PM',
    durationMinutes: 40,
    type: 'period',
    isBreak: false,
  },
  {
    id: 'p-4',
    order: 6,
    periodNumber: 4,
    nameHindi: 'कालांश IV',
    nameEnglish: 'Period IV',
    startTime: '12:25 PM',
    endTime: '01:05 PM',
    durationMinutes: 40,
    type: 'period',
    isBreak: false,
  },
  {
    id: 'p-recess',
    order: 7,
    periodNumber: null,
    nameHindi: 'मध्यावकाश (लंच)',
    nameEnglish: 'Recess (Lunch)',
    startTime: '01:05 PM',
    endTime: '01:30 PM',
    durationMinutes: 25,
    type: 'recess',
    isBreak: true,
  },
  {
    id: 'p-5',
    order: 8,
    periodNumber: 5,
    nameHindi: 'कालांश V',
    nameEnglish: 'Period V',
    startTime: '01:30 PM',
    endTime: '02:10 PM',
    durationMinutes: 40,
    type: 'period',
    isBreak: false,
  },
  {
    id: 'p-6',
    order: 9,
    periodNumber: 6,
    nameHindi: 'कालांश VI',
    nameEnglish: 'Period VI',
    startTime: '02:10 PM',
    endTime: '02:50 PM',
    durationMinutes: 40,
    type: 'period',
    isBreak: false,
  },
  {
    id: 'p-7',
    order: 10,
    periodNumber: 7,
    nameHindi: 'कालांश VII',
    nameEnglish: 'Period VII',
    startTime: '02:50 PM',
    endTime: '03:25 PM',
    durationMinutes: 35,
    type: 'period',
    isBreak: false,
  },
  {
    id: 'p-8',
    order: 11,
    periodNumber: 8,
    nameHindi: 'कालांश VIII',
    nameEnglish: 'Period VIII',
    startTime: '03:25 PM',
    endTime: '04:00 PM',
    durationMinutes: 35,
    type: 'period',
    isBreak: false,
  },
];

export const TEACHING_PERIODS = DEFAULT_PERIODS.filter((p) => !p.isBreak);

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'sub-hindi', name: 'Hindi', hindiName: 'हिन्दी', code: 'HIN', color: '#DC2626' }, // red
  { id: 'sub-english', name: 'English', hindiName: 'अंग्रेजी', code: 'ENG', color: '#2563EB' }, // blue
  { id: 'sub-maths', name: 'Mathematics', hindiName: 'गणित', code: 'MATH', color: '#D97706' }, // amber
  { id: 'sub-science', name: 'Science', hindiName: 'विज्ञान', code: 'SCI', color: '#059669', requiredRoomType: 'lab' }, // emerald
  { id: 'sub-sst', name: 'Social Studies', hindiName: 'सामाजिक विज्ञान', code: 'SST', color: '#7C3AED' }, // purple
  { id: 'sub-sanskrit', name: 'Sanskrit', hindiName: 'संस्कृत', code: 'SKT', color: '#EA580C' }, // orange
  { id: 'sub-physics', name: 'Physics', hindiName: 'भौतिक विज्ञान', code: 'PHY', color: '#0284C7', requiredRoomType: 'lab' }, // sky
  { id: 'sub-chemistry', name: 'Chemistry', hindiName: 'रसायन विज्ञान', code: 'CHEM', color: '#0D9488', requiredRoomType: 'lab' }, // teal
  { id: 'sub-biology', name: 'Biology', hindiName: 'जीव विज्ञान', code: 'BIO', color: '#16A34A', requiredRoomType: 'lab' }, // green
  { id: 'sub-computer', name: 'Computer Science', hindiName: 'कम्प्यूटर', code: 'COMP', color: '#4F46E5', requiredRoomType: 'computer' }, // indigo
  { id: 'sub-sports', name: 'Physical Ed. / Sports', hindiName: 'शारीरिक शिक्षा / खेल', code: 'PET', color: '#CA8A04', requiredRoomType: 'ground' }, // yellow
  { id: 'sub-drawing', name: 'Art & Craft', hindiName: 'चित्रकला', code: 'ART', color: '#DB2777' }, // pink
  { id: 'sub-library', name: 'Library', hindiName: 'पुस्तकालय', code: 'LIB', color: '#475569', requiredRoomType: 'library' }, // slate
];

export const DEFAULT_ROOMS: Room[] = [
  { id: 'rm-101', name: 'Room 101', hindiName: 'कक्ष क्र. 101', type: 'classroom', capacity: 45, floor: 'Ground Floor' },
  { id: 'rm-102', name: 'Room 102', hindiName: 'कक्ष क्र. 102', type: 'classroom', capacity: 45, floor: 'Ground Floor' },
  { id: 'rm-103', name: 'Room 103', hindiName: 'कक्ष क्र. 103', type: 'classroom', capacity: 45, floor: 'Ground Floor' },
  { id: 'rm-104', name: 'Room 104', hindiName: 'कक्ष क्र. 104', type: 'classroom', capacity: 45, floor: 'Ground Floor' },
  { id: 'rm-201', name: 'Room 201', hindiName: 'कक्ष क्र. 201', type: 'classroom', capacity: 50, floor: '1st Floor' },
  { id: 'rm-202', name: 'Room 202', hindiName: 'कक्ष क्र. 202', type: 'classroom', capacity: 50, floor: '1st Floor' },
  { id: 'rm-203', name: 'Room 203', hindiName: 'कक्ष क्र. 203', type: 'classroom', capacity: 50, floor: '1st Floor' },
  { id: 'rm-204', name: 'Room 204', hindiName: 'कक्ष क्र. 204', type: 'classroom', capacity: 50, floor: '1st Floor' },
  { id: 'rm-301', name: 'Room 301', hindiName: 'कक्ष क्र. 301', type: 'classroom', capacity: 50, floor: '2nd Floor' },
  { id: 'rm-302', name: 'Room 302', hindiName: 'कक्ष क्र. 302', type: 'classroom', capacity: 50, floor: '2nd Floor' },
  { id: 'rm-303', name: 'Room 303', hindiName: 'कक्ष क्र. 303', type: 'classroom', capacity: 50, floor: '2nd Floor' },
  { id: 'rm-304', name: 'Room 304', hindiName: 'कक्ष क्र. 304', type: 'classroom', capacity: 50, floor: '2nd Floor' },
  { id: 'rm-scilab', name: 'Composite Science Lab', hindiName: 'विज्ञान प्रयोगशाला', type: 'lab', capacity: 40, floor: '1st Floor' },
  { id: 'rm-comptlab', name: 'Computer Lab (ICT)', hindiName: 'कम्प्यूटर लैब', type: 'computer', capacity: 40, floor: '2nd Floor' },
  { id: 'rm-lib', name: 'Central Library', hindiName: 'पुस्तकालय कक्ष', type: 'library', capacity: 60, floor: 'Ground Floor' },
  { id: 'rm-ground', name: 'School Sports Ground', hindiName: 'खेल मैदान', type: 'ground', capacity: 100, floor: 'Campus' },
];

export const DEFAULT_TEACHERS: Teacher[] = [
  {
    id: 'tch-principal',
    name: 'Dr. R. K. Sharma',
    hindiName: 'डॉ. आर. के. शर्मा',
    designation: 'Principal',
    gender: 'male',
    subjects: ['sub-physics', 'sub-maths'],
    maxPeriodsPerDay: 3,
    phone: '9829012345',
    color: '#0F172A',
    photoUrl: '', // Can be uploaded by principal
  },
  {
    id: 'tch-verma',
    name: 'Sh. Rajesh Verma',
    hindiName: 'श्री राजेश वर्मा',
    designation: 'PGT Maths',
    gender: 'male',
    subjects: ['sub-maths', 'sub-physics'],
    maxPeriodsPerDay: 6,
    phone: '9414023456',
    color: '#D97706',
    photoUrl: '',
  },
  {
    id: 'tch-sunita',
    name: 'Smt. Sunita Gupta',
    hindiName: 'श्रीमती सुनीता गुप्ता',
    designation: 'PGT Hindi',
    gender: 'female',
    subjects: ['sub-hindi', 'sub-sanskrit'],
    maxPeriodsPerDay: 6,
    phone: '9784034567',
    color: '#DC2626',
    photoUrl: '',
  },
  {
    id: 'tch-anand',
    name: 'Sh. Anand Singh',
    hindiName: 'श्री आनंद सिंह',
    designation: 'PGT English',
    gender: 'male',
    subjects: ['sub-english'],
    maxPeriodsPerDay: 6,
    phone: '9650045678',
    color: '#2563EB',
    photoUrl: '',
  },
  {
    id: 'tch-priya',
    name: 'Dr. Priya Meena',
    hindiName: 'डॉ. प्रिया मीना',
    designation: 'PGT Chemistry',
    gender: 'female',
    subjects: ['sub-chemistry', 'sub-science'],
    maxPeriodsPerDay: 6,
    phone: '9460056789',
    color: '#0D9488',
    photoUrl: '',
  },
  {
    id: 'tch-mahesh',
    name: 'Sh. Mahesh Chand',
    hindiName: 'श्री महेश चंद',
    designation: 'PGT Biology',
    gender: 'male',
    subjects: ['sub-biology', 'sub-science'],
    maxPeriodsPerDay: 6,
    phone: '9828067890',
    color: '#16A34A',
    photoUrl: '',
  },
  {
    id: 'tch-kavita',
    name: 'Smt. Kavita Joshi',
    hindiName: 'श्रीमती कविता जोशी',
    designation: 'TGT Social Science',
    gender: 'female',
    subjects: ['sub-sst', 'sub-hindi'],
    maxPeriodsPerDay: 6,
    phone: '9887078901',
    color: '#7C3AED',
    photoUrl: '',
  },
  {
    id: 'tch-vikram',
    name: 'Sh. Vikram Rathore',
    hindiName: 'श्री विक्रम राठौड़',
    designation: 'PTI / Physical Ed.',
    gender: 'male',
    subjects: ['sub-sports'],
    maxPeriodsPerDay: 6,
    phone: '9929089012',
    color: '#CA8A04',
    photoUrl: '',
  },
  {
    id: 'tch-neha',
    name: 'Ms. Neha Sharma',
    hindiName: 'सुश्री नेहा शर्मा',
    designation: 'Computer Teacher',
    gender: 'female',
    subjects: ['sub-computer', 'sub-maths'],
    maxPeriodsPerDay: 6,
    phone: '9783090123',
    color: '#4F46E5',
    photoUrl: '',
  },
  {
    id: 'tch-suresh',
    name: 'Sh. Suresh Kumar',
    hindiName: 'श्री सुरेश कुमार',
    designation: 'TGT Sanskrit',
    gender: 'male',
    subjects: ['sub-sanskrit', 'sub-hindi'],
    maxPeriodsPerDay: 6,
    phone: '9413101234',
    color: '#EA580C',
    photoUrl: '',
  },
  {
    id: 'tch-geeta',
    name: 'Smt. Geeta Devi',
    hindiName: 'श्रीमती गीता देवी',
    designation: 'PRT Primary Incharge',
    gender: 'female',
    subjects: ['sub-hindi', 'sub-english', 'sub-maths', 'sub-drawing'],
    maxPeriodsPerDay: 6,
    phone: '9829112345',
    color: '#DB2777',
    photoUrl: '',
  },
  {
    id: 'tch-rampal',
    name: 'Sh. Rampal Yadav',
    hindiName: 'श्री रामपाल यादव',
    designation: 'PRT Teacher',
    gender: 'male',
    subjects: ['sub-maths', 'sub-science', 'sub-library'],
    maxPeriodsPerDay: 6,
    phone: '9982123456',
    color: '#0891B2',
    photoUrl: '',
  },
];

// Classes 1 to 12
export const DEFAULT_CLASSES: ClassInfo[] = [
  { id: 'cls-1', grade: 1, section: 'A', defaultRoomId: 'rm-101', classTeacherId: 'tch-geeta' },
  { id: 'cls-2', grade: 2, section: 'A', defaultRoomId: 'rm-102', classTeacherId: 'tch-rampal' },
  { id: 'cls-3', grade: 3, section: 'A', defaultRoomId: 'rm-103', classTeacherId: 'tch-geeta' },
  { id: 'cls-4', grade: 4, section: 'A', defaultRoomId: 'rm-104', classTeacherId: 'tch-rampal' },
  { id: 'cls-5', grade: 5, section: 'A', defaultRoomId: 'rm-201', classTeacherId: 'tch-kavita' },
  { id: 'cls-6', grade: 6, section: 'A', defaultRoomId: 'rm-202', classTeacherId: 'tch-suresh' },
  { id: 'cls-7', grade: 7, section: 'A', defaultRoomId: 'rm-203', classTeacherId: 'tch-kavita' },
  { id: 'cls-8', grade: 8, section: 'A', defaultRoomId: 'rm-204', classTeacherId: 'tch-suresh' },
  { id: 'cls-9', grade: 9, section: 'A', defaultRoomId: 'rm-301', classTeacherId: 'tch-anand' },
  { id: 'cls-10', grade: 10, section: 'A', defaultRoomId: 'rm-302', classTeacherId: 'tch-sunita' },
  { id: 'cls-11', grade: 11, section: 'A', stream: 'Science', defaultRoomId: 'rm-303', classTeacherId: 'tch-priya' },
  { id: 'cls-12', grade: 12, section: 'A', stream: 'Science', defaultRoomId: 'rm-304', classTeacherId: 'tch-verma' },
];

export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  schoolName: 'Govt. Model Senior Secondary School',
  schoolHindiName: 'राजकीय आदर्श उच्च माध्यमिक विद्यालय',
  principalName: 'Dr. R. K. Sharma',
  udiseCode: '08120504101',
  session: '2026-2027',
  scheduleType: 'winter',
  address: 'Civil Lines, Jaipur, Rajasthan',
  winterNoticeImage: '/assets/aistudio/IMG-20261016-WA0006_3266070b.jpg',
};

// Seed schedule for classes to showcase full timetable right away
export const generateInitialTimetable = (): TimetableCell[] => {
  const cells: TimetableCell[] = [];
  const days: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat')[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Template assignments for classes
  const classSchedules: Record<string, { periodId: string; sub: string; tch: string }[]> = {
    'cls-10': [
      { periodId: 'p-1', sub: 'sub-maths', tch: 'tch-verma' },
      { periodId: 'p-2', sub: 'sub-science', tch: 'tch-priya' },
      { periodId: 'p-3', sub: 'sub-hindi', tch: 'tch-sunita' },
      { periodId: 'p-4', sub: 'sub-english', tch: 'tch-anand' },
      { periodId: 'p-5', sub: 'sub-sst', tch: 'tch-kavita' },
      { periodId: 'p-6', sub: 'sub-sanskrit', tch: 'tch-suresh' },
      { periodId: 'p-7', sub: 'sub-computer', tch: 'tch-neha' },
      { periodId: 'p-8', sub: 'sub-sports', tch: 'tch-vikram' },
    ],
    'cls-9': [
      { periodId: 'p-1', sub: 'sub-english', tch: 'tch-anand' },
      { periodId: 'p-2', sub: 'sub-hindi', tch: 'tch-sunita' },
      { periodId: 'p-3', sub: 'sub-science', tch: 'tch-mahesh' },
      { periodId: 'p-4', sub: 'sub-maths', tch: 'tch-verma' },
      { periodId: 'p-5', sub: 'sub-computer', tch: 'tch-neha' },
      { periodId: 'p-6', sub: 'sub-sst', tch: 'tch-kavita' },
      { periodId: 'p-7', sub: 'sub-sports', tch: 'tch-vikram' },
      { periodId: 'p-8', sub: 'sub-library', tch: 'tch-rampal' },
    ],
    'cls-12': [
      { periodId: 'p-1', sub: 'sub-physics', tch: 'tch-principal' },
      { periodId: 'p-2', sub: 'sub-maths', tch: 'tch-verma' },
      { periodId: 'p-3', sub: 'sub-chemistry', tch: 'tch-priya' },
      { periodId: 'p-4', sub: 'sub-biology', tch: 'tch-mahesh' },
      { periodId: 'p-5', sub: 'sub-english', tch: 'tch-anand' },
      { periodId: 'p-6', sub: 'sub-hindi', tch: 'tch-sunita' },
      { periodId: 'p-7', sub: 'sub-computer', tch: 'tch-neha' },
      { periodId: 'p-8', sub: 'sub-sports', tch: 'tch-vikram' },
    ],
    'cls-11': [
      { periodId: 'p-1', sub: 'sub-chemistry', tch: 'tch-priya' },
      { periodId: 'p-2', sub: 'sub-physics', tch: 'tch-principal' },
      { periodId: 'p-3', sub: 'sub-maths', tch: 'tch-verma' },
      { periodId: 'p-4', sub: 'sub-hindi', tch: 'tch-sunita' },
      { periodId: 'p-5', sub: 'sub-biology', tch: 'tch-mahesh' },
      { periodId: 'p-6', sub: 'sub-english', tch: 'tch-anand' },
      { periodId: 'p-7', sub: 'sub-library', tch: 'tch-rampal' },
      { periodId: 'p-8', sub: 'sub-sports', tch: 'tch-vikram' },
    ],
    'cls-8': [
      { periodId: 'p-1', sub: 'sub-science', tch: 'tch-mahesh' },
      { periodId: 'p-2', sub: 'sub-english', tch: 'tch-anand' },
      { periodId: 'p-3', sub: 'sub-sst', tch: 'tch-kavita' },
      { periodId: 'p-4', sub: 'sub-sanskrit', tch: 'tch-suresh' },
      { periodId: 'p-5', sub: 'sub-maths', tch: 'tch-rampal' },
      { periodId: 'p-6', sub: 'sub-computer', tch: 'tch-neha' },
      { periodId: 'p-7', sub: 'sub-hindi', tch: 'tch-geeta' },
      { periodId: 'p-8', sub: 'sub-drawing', tch: 'tch-geeta' },
    ],
    'cls-7': [
      { periodId: 'p-1', sub: 'sub-hindi', tch: 'tch-suresh' },
      { periodId: 'p-2', sub: 'sub-sst', tch: 'tch-kavita' },
      { periodId: 'p-3', sub: 'sub-english', tch: 'tch-anand' },
      { periodId: 'p-4', sub: 'sub-science', tch: 'tch-mahesh' },
      { periodId: 'p-5', sub: 'sub-maths', tch: 'tch-rampal' },
      { periodId: 'p-6', sub: 'sub-drawing', tch: 'tch-geeta' },
      { periodId: 'p-7', sub: 'sub-sanskrit', tch: 'tch-suresh' },
      { periodId: 'p-8', sub: 'sub-computer', tch: 'tch-neha' },
    ],
  };

  // Populate for days
  days.forEach((day) => {
    DEFAULT_CLASSES.forEach((cls) => {
      const schedule = classSchedules[cls.id] || [
        { periodId: 'p-1', sub: 'sub-hindi', tch: 'tch-geeta' },
        { periodId: 'p-2', sub: 'sub-english', tch: 'tch-geeta' },
        { periodId: 'p-3', sub: 'sub-maths', tch: 'tch-rampal' },
        { periodId: 'p-4', sub: 'sub-science', tch: 'tch-rampal' },
        { periodId: 'p-5', sub: 'sub-sst', tch: 'tch-kavita' },
        { periodId: 'p-6', sub: 'sub-drawing', tch: 'tch-geeta' },
        { periodId: 'p-7', sub: 'sub-sports', tch: 'tch-vikram' },
        { periodId: 'p-8', sub: 'sub-library', tch: 'tch-rampal' },
      ];

      schedule.forEach((item) => {
        // determine room
        let roomId = cls.defaultRoomId;
        if (item.sub === 'sub-computer') roomId = 'rm-comptlab';
        else if (item.sub === 'sub-sports') roomId = 'rm-ground';
        else if (item.sub === 'sub-library') roomId = 'rm-lib';
        else if (item.sub === 'sub-science' && (cls.grade >= 9)) roomId = 'rm-scilab';

        cells.push({
          id: `${cls.id}-${day}-${item.periodId}`,
          classId: cls.id,
          day,
          periodId: item.periodId,
          subjectId: item.sub,
          teacherId: item.tch,
          roomId,
        });
      });
    });
  });

  return cells;
};
