/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  PeriodDefinition,
  Subject,
  Room,
  Teacher,
  ClassInfo,
  TimetableCell,
  SchoolProfile,
  SubstitutionAssignment,
  DayOfWeek,
} from './types/timetable';
import { loadInitialData, saveToStorage } from './utils/storage';
import { checkAssignmentConflict, autoGenerateSchedule } from './utils/conflictChecker';
import { Navbar } from './components/Navbar';
import { ClassTimetableView } from './components/ClassTimetableView';
import { MasterGridView } from './components/MasterGridView';
import { TeacherTimetableView } from './components/TeacherTimetableView';
import { RoomTimetableView } from './components/RoomTimetableView';
import { SubstitutionView } from './components/SubstitutionView';
import { TeacherManager } from './components/TeacherManager';
import { SubjectRoomManager } from './components/SubjectRoomManager';
import { BellScheduleView } from './components/BellScheduleView';
import { PeriodAssignModal } from './components/PeriodAssignModal';
import { PrintViewModal } from './components/PrintViewModal';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';

export default function App() {
  const initial = useMemo(() => loadInitialData(), []);

  const [periods, setPeriods] = useState<PeriodDefinition[]>(initial.periods);
  const [subjects, setSubjects] = useState<Subject[]>(initial.subjects);
  const [rooms, setRooms] = useState<Room[]>(initial.rooms);
  const [teachers, setTeachers] = useState<Teacher[]>(initial.teachers);
  const [classes, setClasses] = useState<ClassInfo[]>(initial.classes);
  const [timetableCells, setTimetableCells] = useState<TimetableCell[]>(initial.timetable);
  const [profile, setProfile] = useState<SchoolProfile>(initial.profile);
  const [substitutions, setSubstitutions] = useState<SubstitutionAssignment[]>(initial.substitutions);
  const [lang, setLang] = useState<'hi' | 'en'>(initial.lang);

  // Active navigation
  const [activeTab, setActiveTab] = useState<string>('class');
  const [selectedClassId, setSelectedClassId] = useState<string>(initial.classes[0]?.id || 'cls-10');

  // Modal controls
  const [isCellModalOpen, setIsCellModalOpen] = useState(false);
  const [activeCellData, setActiveCellData] = useState<{
    classId: string;
    day: DayOfWeek;
    periodId: string;
  } | null>(null);

  const [isBellModalOpen, setIsBellModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printConfig, setPrintConfig] = useState<{
    type: 'class' | 'teacher' | 'master';
    targetId?: string;
  }>({ type: 'class' });

  // Sync state to local storage
  useEffect(() => {
    saveToStorage('PERIODS', periods);
  }, [periods]);

  useEffect(() => {
    saveToStorage('SUBJECTS', subjects);
  }, [subjects]);

  useEffect(() => {
    saveToStorage('ROOMS', rooms);
  }, [rooms]);

  useEffect(() => {
    saveToStorage('TEACHERS', teachers);
  }, [teachers]);

  useEffect(() => {
    saveToStorage('CLASSES', classes);
  }, [classes]);

  useEffect(() => {
    saveToStorage('TIMETABLE', timetableCells);
  }, [timetableCells]);

  useEffect(() => {
    saveToStorage('PROFILE', profile);
  }, [profile]);

  useEffect(() => {
    saveToStorage('SUBSTITUTIONS', substitutions);
  }, [substitutions]);

  useEffect(() => {
    saveToStorage('LANG', lang);
  }, [lang]);

  // Real-time conflict count
  const totalConflicts = useMemo(() => {
    let count = 0;
    timetableCells.forEach((c) => {
      if (c.teacherId) {
        const res = checkAssignmentConflict(
          {
            classId: c.classId,
            day: c.day,
            periodId: c.periodId,
            teacherId: c.teacherId,
            roomId: c.roomId,
          },
          timetableCells,
          teachers,
          rooms,
          classes
        );
        if (res.hasConflict) count++;
      }
    });
    return Math.floor(count / 2); // divide by 2 since each clash involves pairs
  }, [timetableCells, teachers, rooms, classes]);

  // Handlers for cell editing
  const handleOpenCellModal = (classId: string, day: DayOfWeek, periodId: string) => {
    setActiveCellData({ classId, day, periodId });
    setIsCellModalOpen(true);
  };

  const handleSaveCell = (newCellData: Partial<TimetableCell> & { classId: string; day: DayOfWeek; periodId: string }) => {
    setTimetableCells((prev) => {
      const idx = prev.findIndex(
        (c) =>
          c.classId === newCellData.classId &&
          c.day === newCellData.day &&
          c.periodId === newCellData.periodId
      );

      const cell: TimetableCell = {
        id: `${newCellData.classId}-${newCellData.day}-${newCellData.periodId}`,
        classId: newCellData.classId,
        day: newCellData.day,
        periodId: newCellData.periodId,
        subjectId: newCellData.subjectId || '',
        teacherId: newCellData.teacherId || '',
        roomId: newCellData.roomId || '',
      };

      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = cell;
        return updated;
      }
      return [...prev, cell];
    });
  };

  const handleClearCell = (classId: string, day: DayOfWeek, periodId: string) => {
    setTimetableCells((prev) =>
      prev.filter(
        (c) => !(c.classId === classId && c.day === day && c.periodId === periodId)
      )
    );
  };

  // Auto fill vacant periods for a class
  const handleAutoFillClass = (classId: string) => {
    const targetClass = classes.find((c) => c.id === classId);
    if (!targetClass) return;

    const teachingPeriodIds = periods.filter((p) => !p.isBreak).map((p) => p.id);
    const updated = autoGenerateSchedule(
      [targetClass],
      teachers,
      subjects,
      rooms,
      teachingPeriodIds,
      timetableCells
    );

    setTimetableCells(updated);
  };

  // Copy Monday's periods to Tuesday-Saturday
  const handleCopyMondayToWeek = (classId: string) => {
    const mondayCells = timetableCells.filter((c) => c.classId === classId && c.day === 'Mon');
    if (mondayCells.length === 0) {
      alert(lang === 'hi' ? 'सोमवार के लिए कोई कालांश निर्धारित नहीं है।' : 'No periods assigned for Monday to copy.');
      return;
    }

    const restDays: DayOfWeek[] = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    setTimetableCells((prev) => {
      // Remove existing for this class on other days
      const filtered = prev.filter(
        (c) => !(c.classId === classId && restDays.includes(c.day))
      );

      const newCells: TimetableCell[] = [];
      restDays.forEach((day) => {
        mondayCells.forEach((m) => {
          newCells.push({
            ...m,
            id: `${classId}-${day}-${m.periodId}`,
            day,
          });
        });
      });

      return [...filtered, ...newCells];
    });
  };

  const handleClearClassSchedule = (classId: string) => {
    setTimetableCells((prev) => prev.filter((c) => c.classId !== classId));
  };

  // Teacher absence toggle
  const handleToggleAbsent = (teacherId: string) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, isAbsentToday: !t.isAbsentToday } : t))
    );
  };

  // Update teacher photo
  const handleUpdateTeacherPhoto = (teacherId: string, photoUrl: string) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, photoUrl } : t))
    );
  };

  // Print handlers
  const handleOpenPrint = (type: 'class' | 'teacher' | 'master' = 'class', targetId?: string) => {
    setPrintConfig({ type, targetId });
    setIsPrintModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        profile={profile}
        lang={lang}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onToggleLang={() => setLang((l) => (l === 'hi' ? 'en' : 'hi'))}
        onOpenBellSchedule={() => setIsBellModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenPrint={() => handleOpenPrint('class', selectedClassId)}
        totalConflicts={totalConflicts}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {activeTab === 'class' && (
          <ClassTimetableView
            classes={classes}
            periods={periods}
            subjects={subjects}
            teachers={teachers}
            rooms={rooms}
            timetableCells={timetableCells}
            selectedClassId={selectedClassId}
            onSelectClassId={setSelectedClassId}
            onOpenCellModal={handleOpenCellModal}
            onAutoFillClass={handleAutoFillClass}
            onCopyMondayToWeek={handleCopyMondayToWeek}
            onClearClassSchedule={handleClearClassSchedule}
            onPrintClass={(clsId) => handleOpenPrint('class', clsId)}
            lang={lang}
          />
        )}

        {activeTab === 'master' && (
          <MasterGridView
            classes={classes}
            periods={periods}
            subjects={subjects}
            teachers={teachers}
            rooms={rooms}
            timetableCells={timetableCells}
            onOpenCellModal={handleOpenCellModal}
            onPrintMaster={() => handleOpenPrint('master')}
            lang={lang}
          />
        )}

        {activeTab === 'teacher' && (
          <TeacherTimetableView
            teachers={teachers}
            periods={periods}
            subjects={subjects}
            rooms={rooms}
            classes={classes}
            timetableCells={timetableCells}
            onToggleAbsent={handleToggleAbsent}
            onUpdateTeacherPhoto={handleUpdateTeacherPhoto}
            onPrintTeacher={(tchId) => handleOpenPrint('teacher', tchId)}
            lang={lang}
          />
        )}

        {activeTab === 'room' && (
          <RoomTimetableView
            rooms={rooms}
            periods={periods}
            subjects={subjects}
            teachers={teachers}
            classes={classes}
            timetableCells={timetableCells}
            lang={lang}
          />
        )}

        {activeTab === 'substitute' && (
          <SubstitutionView
            teachers={teachers}
            periods={periods}
            subjects={subjects}
            classes={classes}
            timetableCells={timetableCells}
            substitutions={substitutions}
            onToggleAbsent={handleToggleAbsent}
            onAssignSubstitution={(assignment) => {
              const newSub: SubstitutionAssignment = {
                ...assignment,
                id: `sub-${Date.now()}`,
              };
              setSubstitutions((prev) => [...prev, newSub]);
            }}
            onRemoveSubstitution={(subId) => {
              setSubstitutions((prev) => prev.filter((s) => s.id !== subId));
            }}
            lang={lang}
          />
        )}

        {activeTab === 'manage-teachers' && (
          <TeacherManager
            teachers={teachers}
            subjects={subjects}
            onAddTeacher={(newTch) => setTeachers((prev) => [...prev, newTch])}
            onUpdateTeacher={(updTch) =>
              setTeachers((prev) => prev.map((t) => (t.id === updTch.id ? updTch : t)))
            }
            onDeleteTeacher={(tchId) => {
              setTeachers((prev) => prev.filter((t) => t.id !== tchId));
              setTimetableCells((prev) =>
                prev.map((c) => (c.teacherId === tchId ? { ...c, teacherId: '' } : c))
              );
            }}
            lang={lang}
          />
        )}

        {activeTab === 'manage-subjects' && (
          <SubjectRoomManager
            subjects={subjects}
            rooms={rooms}
            onAddSubject={(s) => setSubjects((prev) => [...prev, s])}
            onUpdateSubject={(s) =>
              setSubjects((prev) => prev.map((sub) => (sub.id === s.id ? s : sub)))
            }
            onDeleteSubject={(id) => setSubjects((prev) => prev.filter((s) => s.id !== id))}
            onAddRoom={(r) => setRooms((prev) => [...prev, r])}
            onUpdateRoom={(r) => setRooms((prev) => prev.map((rm) => (rm.id === r.id ? r : rm)))}
            onDeleteRoom={(id) => setRooms((prev) => prev.filter((r) => r.id !== id))}
            lang={lang}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-xs text-slate-500 text-center print:hidden">
        <p>
          {profile.schoolHindiName} ({profile.session}) · {profile.address} · UDISE: {profile.udiseCode}
        </p>
      </footer>

      {/* Modals */}
      <PeriodAssignModal
        isOpen={isCellModalOpen}
        onClose={() => setIsCellModalOpen(false)}
        cellData={activeCellData}
        classes={classes}
        periods={periods}
        subjects={subjects}
        teachers={teachers}
        rooms={rooms}
        timetableCells={timetableCells}
        onSaveCell={handleSaveCell}
        onClearCell={handleClearCell}
        lang={lang}
      />

      <BellScheduleView
        isOpen={isBellModalOpen}
        onClose={() => setIsBellModalOpen(false)}
        periods={periods}
        onUpdatePeriods={setPeriods}
        lang={lang}
      />

      <SchoolSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        profile={profile}
        onUpdateProfile={setProfile}
        lang={lang}
      />

      <PrintViewModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        classes={classes}
        periods={periods}
        subjects={subjects}
        teachers={teachers}
        rooms={rooms}
        timetableCells={timetableCells}
        profile={profile}
        defaultType={printConfig.type}
        initialId={printConfig.targetId}
        lang={lang}
      />
    </div>
  );
}
