import React, { useState, useEffect } from 'react';
import {
  PeriodDefinition,
  Subject,
  Teacher,
  Room,
  ClassInfo,
  TimetableCell,
  DayOfWeek,
  ConflictResult,
} from '../types/timetable';
import { checkAssignmentConflict, getAvailableTeachers, getAvailableRooms } from '../utils/conflictChecker';
import { TeacherAvatar } from './TeacherAvatar';
import { X, AlertTriangle, CheckCircle, Trash2, Clock, BookOpen, User, DoorOpen } from 'lucide-react';

interface PeriodAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  cellData: {
    classId: string;
    day: DayOfWeek;
    periodId: string;
  } | null;
  classes: ClassInfo[];
  periods: PeriodDefinition[];
  subjects: Subject[];
  teachers: Teacher[];
  rooms: Room[];
  timetableCells: TimetableCell[];
  onSaveCell: (cell: Partial<TimetableCell> & { classId: string; day: DayOfWeek; periodId: string }) => void;
  onClearCell: (classId: string, day: DayOfWeek, periodId: string) => void;
  lang: 'hi' | 'en';
}

export const PeriodAssignModal: React.FC<PeriodAssignModalProps> = ({
  isOpen,
  onClose,
  cellData,
  classes,
  periods,
  subjects,
  teachers,
  rooms,
  timetableCells,
  onSaveCell,
  onClearCell,
  lang,
}) => {
  const isHi = lang === 'hi';

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [conflict, setConflict] = useState<ConflictResult>({ hasConflict: false });

  // Current context
  const currentClass = classes.find((c) => c.id === cellData?.classId);
  const currentPeriod = periods.find((p) => p.id === cellData?.periodId);
  const existingCell = timetableCells.find(
    (c) =>
      c.classId === cellData?.classId &&
      c.day === cellData?.day &&
      c.periodId === cellData?.periodId
  );

  useEffect(() => {
    if (cellData && isOpen) {
      const cell = timetableCells.find(
        (c) =>
          c.classId === cellData.classId &&
          c.day === cellData.day &&
          c.periodId === cellData.periodId
      );

      if (cell) {
        setSelectedSubjectId(cell.subjectId || '');
        setSelectedTeacherId(cell.teacherId || '');
        setSelectedRoomId(cell.roomId || currentClass?.defaultRoomId || '');
      } else {
        setSelectedSubjectId('');
        setSelectedTeacherId('');
        setSelectedRoomId(currentClass?.defaultRoomId || '');
      }
    }
  }, [cellData, isOpen, timetableCells, currentClass]);

  // Recheck conflict on selections
  useEffect(() => {
    if (cellData && selectedTeacherId) {
      const res = checkAssignmentConflict(
        {
          classId: cellData.classId,
          day: cellData.day,
          periodId: cellData.periodId,
          teacherId: selectedTeacherId,
          roomId: selectedRoomId,
        },
        timetableCells,
        teachers,
        rooms,
        classes
      );
      setConflict(res);
    } else {
      setConflict({ hasConflict: false });
    }
  }, [selectedTeacherId, selectedRoomId, cellData, timetableCells, teachers, rooms, classes]);

  if (!isOpen || !cellData || !currentClass || !currentPeriod) return null;

  // Day labels
  const dayLabelsHi: Record<DayOfWeek, string> = {
    Mon: 'सोमवार (Monday)',
    Tue: 'मंगलवार (Tuesday)',
    Wed: 'बुधवार (Wednesday)',
    Thu: 'गुरुवार (Thursday)',
    Fri: 'शुक्रवार (Friday)',
    Sat: 'शनिवार (Saturday)',
  };

  const dayLabelsEn: Record<DayOfWeek, string> = {
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
  };

  const { available: freeTeachers, busy: busyTeachers } = getAvailableTeachers(
    cellData.day,
    cellData.periodId,
    teachers,
    timetableCells,
    cellData.classId
  );

  const { available: freeRooms, occupied: busyRooms } = getAvailableRooms(
    cellData.day,
    cellData.periodId,
    rooms,
    timetableCells,
    cellData.classId
  );

  // If user selects a subject, suggest teachers who teach that subject
  const subjectSpecialistTeachers = selectedSubjectId
    ? teachers.filter((t) => t.subjects.includes(selectedSubjectId))
    : [];

  const handleSubjectSelect = (subId: string) => {
    setSelectedSubjectId(subId);
    const sub = subjects.find((s) => s.id === subId);

    // Auto-suggest special room if required
    if (sub?.requiredRoomType === 'lab') {
      const labRoom = rooms.find((r) => r.type === 'lab');
      if (labRoom) setSelectedRoomId(labRoom.id);
    } else if (sub?.requiredRoomType === 'computer') {
      const compRoom = rooms.find((r) => r.type === 'computer');
      if (compRoom) setSelectedRoomId(compRoom.id);
    } else if (sub?.requiredRoomType === 'ground') {
      const ground = rooms.find((r) => r.type === 'ground');
      if (ground) setSelectedRoomId(ground.id);
    } else if (sub?.requiredRoomType === 'library') {
      const lib = rooms.find((r) => r.type === 'library');
      if (lib) setSelectedRoomId(lib.id);
    } else {
      if (!selectedRoomId) setSelectedRoomId(currentClass.defaultRoomId);
    }

    // Auto-suggest available teacher who teaches this subject
    if (!selectedTeacherId) {
      const specialist = freeTeachers.find((t) => t.subjects.includes(subId));
      if (specialist) {
        setSelectedTeacherId(specialist.id);
      }
    }
  };

  const handleSave = () => {
    if (!selectedSubjectId || !selectedTeacherId) {
      alert(isHi ? 'कृपया विषय और शिक्षक दोनों का चयन करें।' : 'Please select both subject and teacher.');
      return;
    }

    onSaveCell({
      classId: cellData.classId,
      day: cellData.day,
      periodId: cellData.periodId,
      subjectId: selectedSubjectId,
      teacherId: selectedTeacherId,
      roomId: selectedRoomId || currentClass.defaultRoomId,
    });
    onClose();
  };

  const handleClear = () => {
    onClearCell(cellData.classId, cellData.day, cellData.periodId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg">
                {isHi ? 'कालांश आवंटन' : 'Period Assignment'}
              </span>
              <span className="text-xs bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 px-2 py-0.5 rounded-sm">
                Class {currentClass.grade}-{currentClass.section}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300 mt-0.5">
              <span>{isHi ? dayLabelsHi[cellData.day] : dayLabelsEn[cellData.day]}</span>
              <span>·</span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-amber-400" />
                {isHi ? currentPeriod.nameHindi : currentPeriod.nameEnglish} ({currentPeriod.startTime} - {currentPeriod.endTime}, {currentPeriod.durationMinutes} min)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Step 1: Subject Selection */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              1. {isHi ? 'विषय चुनें (Select Subject)' : 'Select Subject'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {subjects.map((sub) => {
                const isSelected = selectedSubjectId === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleSubjectSelect(sub.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-left border transition-all text-xs font-medium ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: sub.color }}
                    />
                    <div className="truncate">
                      <div className="font-semibold truncate">{isHi ? sub.hindiName : sub.name}</div>
                      <div className="text-[10px] text-slate-500">{sub.code}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Teacher Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <User className="w-4 h-4 text-indigo-600" />
                2. {isHi ? 'शिक्षक चुनें (Select Teacher)' : 'Select Teacher'}
              </label>
              {subjectSpecialistTeachers.length > 0 && (
                <span className="text-[11px] text-indigo-600 font-medium">
                  {isHi ? 'विषय विशेषज्ञ सुझाए गए' : 'Subject specialists recommended'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
              {/* Available teachers */}
              {teachers.map((tch) => {
                const isSelected = selectedTeacherId === tch.id;
                const isSpecialist = selectedSubjectId && tch.subjects.includes(selectedSubjectId);
                const busyInfo = busyTeachers.find((b) => b.teacher.id === tch.id);
                const isBusy = !!busyInfo;
                const isAbsent = tch.isAbsentToday;

                return (
                  <button
                    key={tch.id}
                    type="button"
                    onClick={() => setSelectedTeacherId(tch.id)}
                    className={`flex items-center justify-between p-2 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                        : isBusy
                        ? 'border-red-200 bg-red-50/30 hover:border-red-300'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <TeacherAvatar teacher={tch} size="sm" showBadge />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 truncate flex items-center gap-1">
                          <span>{isHi && tch.hindiName ? tch.hindiName : tch.name}</span>
                          {isSpecialist && (
                            <span className="text-[10px] text-emerald-600 font-medium shrink-0">★</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {tch.designation} · Max {tch.maxPeriodsPerDay} कालांश
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      {isAbsent ? (
                        <span className="text-[10px] text-red-600 font-semibold bg-red-50 px-1.5 py-0.5 rounded">
                          {isHi ? 'अवकाश पर' : 'Absent'}
                        </span>
                      ) : isBusy ? (
                        <span className="text-[10px] text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          {isHi ? 'अन्य कक्षा में' : 'Busy'}
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                          {isHi ? 'उपलब्ध' : 'Free'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Room Selection */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              <DoorOpen className="w-4 h-4 text-indigo-600" />
              3. {isHi ? 'कक्ष / लैब आवंटन (Select Room / Lab)' : 'Select Room'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {rooms.map((rm) => {
                const isSelected = selectedRoomId === rm.id;
                const isOccupied = busyRooms.some((b) => b.room.id === rm.id);
                return (
                  <button
                    key={rm.id}
                    type="button"
                    onClick={() => setSelectedRoomId(rm.id)}
                    className={`p-2 rounded-lg border text-left transition-all text-xs ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-medium ring-1 ring-indigo-600'
                        : isOccupied
                        ? 'border-amber-200 bg-amber-50/40 text-slate-700'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="font-semibold truncate">{isHi ? rm.hindiName : rm.name}</div>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between">
                      <span>{rm.floor}</span>
                      {isOccupied && <span className="text-amber-700 font-medium">व्यस्त</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conflict Warning Alert Box */}
          {conflict.hasConflict && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">
                  {isHi ? conflict.messageHindi : conflict.messageEnglish}
                </p>
                <p className="text-amber-700 mt-0.5 text-[11px]">
                  {isHi
                    ? 'कृपया टकराव दूर करने के लिए दूसरा शिक्षक या समय चुनें।'
                    : 'Please select an alternate available teacher or room to avoid conflict.'}
                </p>
              </div>
            </div>
          )}

          {!conflict.hasConflict && selectedSubjectId && selectedTeacherId && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {isHi
                  ? 'यह कालांश पूर्णतया टकराव-मुक्त (Conflict Free) है। सुरक्षित करने के लिए तैयार है।'
                  : 'Valid allocation with zero clashes. Ready to assign.'}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <div>
            {existingCell && (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isHi ? 'कालांश हटाएं' : 'Clear Slot'}</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
            >
              {isHi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-md shadow-xs transition-colors"
            >
              {isHi ? 'कालांश सुरक्षित करें' : 'Save Assignment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
