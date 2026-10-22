import {
  DayOfWeek,
  TimetableCell,
  Teacher,
  Room,
  ClassInfo,
  Subject,
  ConflictResult,
} from '../types/timetable';

export const checkAssignmentConflict = (
  cellToTest: {
    classId: string;
    day: DayOfWeek;
    periodId: string;
    teacherId: string;
    roomId: string;
  },
  existingCells: TimetableCell[],
  teachers: Teacher[],
  rooms: Room[],
  classes: ClassInfo[]
): ConflictResult => {
  // If no teacher or no room chosen yet
  if (!cellToTest.teacherId) {
    return { hasConflict: false };
  }

  // 1. Check if Teacher is double booked in another class in the same day and period
  const teacherClash = existingCells.find(
    (c) =>
      c.day === cellToTest.day &&
      c.periodId === cellToTest.periodId &&
      c.classId !== cellToTest.classId &&
      (c.teacherId === cellToTest.teacherId || c.proxyTeacherId === cellToTest.teacherId)
  );

  if (teacherClash) {
    const clashingClass = classes.find((cls) => cls.id === teacherClash.classId);
    const teacher = teachers.find((t) => t.id === cellToTest.teacherId);
    const classLabel = clashingClass ? `Class ${clashingClass.grade}-${clashingClass.section}` : 'अन्य कक्षा';
    const teacherName = teacher?.name || 'शिक्षक';

    return {
      hasConflict: true,
      type: 'teacher_double_booked',
      conflictingClass: classLabel,
      messageHindi: `चेतावनी: शिक्षक ${teacherName} इस समय ${classLabel} में कक्षा ले रहे हैं!`,
      messageEnglish: `Warning: Teacher ${teacherName} is already assigned to ${classLabel} in this period!`,
    };
  }

  // 2. Check if Room is double booked in the same day and period
  if (cellToTest.roomId) {
    const roomClash = existingCells.find(
      (c) =>
        c.day === cellToTest.day &&
        c.periodId === cellToTest.periodId &&
        c.classId !== cellToTest.classId &&
        c.roomId === cellToTest.roomId
    );

    if (roomClash) {
      const clashingClass = classes.find((cls) => cls.id === roomClash.classId);
      const room = rooms.find((r) => r.id === cellToTest.roomId);
      const classLabel = clashingClass ? `Class ${clashingClass.grade}-${clashingClass.section}` : 'अन्य कक्षा';
      const roomName = room?.name || 'कक्ष';

      return {
        hasConflict: true,
        type: 'room_double_booked',
        conflictingClass: classLabel,
        messageHindi: `चेतावनी: ${roomName} इस समय ${classLabel} द्वारा उपयोग में है!`,
        messageEnglish: `Warning: Room ${roomName} is already occupied by ${classLabel} in this period!`,
      };
    }
  }

  // 3. Check Teacher Daily Workload
  const teacher = teachers.find((t) => t.id === cellToTest.teacherId);
  if (teacher) {
    const teacherPeriodsToday = existingCells.filter(
      (c) =>
        c.day === cellToTest.day &&
        c.classId !== cellToTest.classId &&
        (c.teacherId === cellToTest.teacherId || c.proxyTeacherId === cellToTest.teacherId)
    ).length;

    if (teacherPeriodsToday >= teacher.maxPeriodsPerDay) {
      return {
        hasConflict: true,
        type: 'teacher_workload_exceeded',
        messageHindi: `सावधानी: ${teacher.name} का आज का अधिकतम कार्यभार (${teacher.maxPeriodsPerDay} कालांश) पूर्ण हो चुका है।`,
        messageEnglish: `Caution: ${teacher.name} has already reached maximum workload limit (${teacher.maxPeriodsPerDay} periods today).`,
      };
    }
  }

  return { hasConflict: false };
};

// Find which teachers are available (free) during a specific day & period
export const getAvailableTeachers = (
  day: DayOfWeek,
  periodId: string,
  teachers: Teacher[],
  existingCells: TimetableCell[],
  currentClassId?: string
): { available: Teacher[]; busy: { teacher: Teacher; classLabel: string }[] } => {
  const busyTeacherMap = new Map<string, string>();

  existingCells.forEach((c) => {
    if (c.day === day && c.periodId === periodId && c.classId !== currentClassId) {
      if (c.teacherId) busyTeacherMap.set(c.teacherId, c.classId);
      if (c.proxyTeacherId) busyTeacherMap.set(c.proxyTeacherId, c.classId);
    }
  });

  const available: Teacher[] = [];
  const busy: { teacher: Teacher; classLabel: string }[] = [];

  teachers.forEach((tch) => {
    if (tch.isAbsentToday) {
      return; // Absent teachers are not available
    }

    if (busyTeacherMap.has(tch.id)) {
      busy.push({
        teacher: tch,
        classLabel: busyTeacherMap.get(tch.id) || '',
      });
    } else {
      available.push(tch);
    }
  });

  return { available, busy };
};

// Find free rooms during a specific day & period
export const getAvailableRooms = (
  day: DayOfWeek,
  periodId: string,
  rooms: Room[],
  existingCells: TimetableCell[],
  currentClassId?: string
): { available: Room[]; occupied: { room: Room; classLabel: string }[] } => {
  const busyRoomMap = new Map<string, string>();

  existingCells.forEach((c) => {
    if (c.day === day && c.periodId === periodId && c.classId !== currentClassId && c.roomId) {
      busyRoomMap.set(c.roomId, c.classId);
    }
  });

  const available: Room[] = [];
  const occupied: { room: Room; classLabel: string }[] = [];

  rooms.forEach((rm) => {
    if (busyRoomMap.has(rm.id)) {
      occupied.push({ room: rm, classLabel: busyRoomMap.get(rm.id) || '' });
    } else {
      available.push(rm);
    }
  });

  return { available, occupied };
};

// Smart Auto-Generator algorithm to fill unassigned periods for a class or all classes
export const autoGenerateSchedule = (
  classes: ClassInfo[],
  teachers: Teacher[],
  subjects: Subject[],
  rooms: Room[],
  teachingPeriodIds: string[],
  existingCells: TimetableCell[]
): TimetableCell[] => {
  const days: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const newCells = [...existingCells];

  // Helper map for teacher subjects
  const teachersBySubject: Record<string, Teacher[]> = {};
  teachers.forEach((t) => {
    t.subjects.forEach((sId) => {
      if (!teachersBySubject[sId]) teachersBySubject[sId] = [];
      teachersBySubject[sId].push(t);
    });
  });

  days.forEach((day) => {
    classes.forEach((cls) => {
      // Pick subject rotation suitable for class grade
      let subjectPool: Subject[] = [];
      if (cls.grade <= 5) {
        subjectPool = subjects.filter((s) => ['sub-hindi', 'sub-english', 'sub-maths', 'sub-drawing', 'sub-sports', 'sub-library'].includes(s.id));
      } else if (cls.grade <= 10) {
        subjectPool = subjects.filter((s) => ['sub-maths', 'sub-science', 'sub-english', 'sub-hindi', 'sub-sst', 'sub-sanskrit', 'sub-computer', 'sub-sports'].includes(s.id));
      } else {
        // 11 and 12 Science
        subjectPool = subjects.filter((s) => ['sub-physics', 'sub-chemistry', 'sub-maths', 'sub-biology', 'sub-english', 'sub-hindi', 'sub-computer', 'sub-sports'].includes(s.id));
      }

      if (subjectPool.length === 0) subjectPool = subjects;

      teachingPeriodIds.forEach((periodId, pIdx) => {
        const existingIdx = newCells.findIndex(
          (c) => c.classId === cls.id && c.day === day && c.periodId === periodId
        );

        // If already filled, skip
        if (existingIdx !== -1 && newCells[existingIdx].teacherId && newCells[existingIdx].subjectId) {
          return;
        }

        // Try to select a subject
        const targetSub = subjectPool[pIdx % subjectPool.length];
        const candidateTeachers = teachersBySubject[targetSub.id] || [];

        // Find teacher who is free right now
        let chosenTeacher: Teacher | null = null;
        for (const tch of candidateTeachers) {
          if (tch.isAbsentToday) continue;
          // check if free in this period and day
          const isBusy = newCells.some(
            (c) => c.day === day && c.periodId === periodId && c.teacherId === tch.id
          );
          if (!isBusy) {
            chosenTeacher = tch;
            break;
          }
        }

        // Fallback to any teacher free who teaches anything if primary busy
        if (!chosenTeacher) {
          for (const tch of teachers) {
            if (tch.isAbsentToday) continue;
            const isBusy = newCells.some(
              (c) => c.day === day && c.periodId === periodId && c.teacherId === tch.id
            );
            if (!isBusy) {
              chosenTeacher = tch;
              break;
            }
          }
        }

        if (!chosenTeacher) return;

        // Choose room
        let roomId = cls.defaultRoomId;
        if (targetSub.requiredRoomType === 'lab') roomId = 'rm-scilab';
        else if (targetSub.requiredRoomType === 'computer') roomId = 'rm-comptlab';
        else if (targetSub.requiredRoomType === 'ground') roomId = 'rm-ground';
        else if (targetSub.requiredRoomType === 'library') roomId = 'rm-lib';

        // Check if room free, else default room
        const isRoomBusy = newCells.some(
          (c) => c.day === day && c.periodId === periodId && c.roomId === roomId
        );
        if (isRoomBusy) {
          roomId = cls.defaultRoomId;
        }

        const newCell: TimetableCell = {
          id: `${cls.id}-${day}-${periodId}`,
          classId: cls.id,
          day,
          periodId,
          subjectId: targetSub.id,
          teacherId: chosenTeacher.id,
          roomId,
        };

        if (existingIdx !== -1) {
          newCells[existingIdx] = newCell;
        } else {
          newCells.push(newCell);
        }
      });
    });
  });

  return newCells;
};
