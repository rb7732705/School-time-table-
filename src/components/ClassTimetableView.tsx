import React, { useState } from 'react';
import {
  ClassInfo,
  PeriodDefinition,
  Subject,
  Teacher,
  Room,
  TimetableCell,
  DayOfWeek,
} from '../types/timetable';
import { TeacherAvatar } from './TeacherAvatar';
import { checkAssignmentConflict } from '../utils/conflictChecker';
import {
  Calendar,
  Sparkles,
  Copy,
  Printer,
  Trash2,
  Clock,
  Plus,
  AlertTriangle,
  UserCheck,
  DoorOpen,
} from 'lucide-react';

interface ClassTimetableViewProps {
  classes: ClassInfo[];
  periods: PeriodDefinition[];
  subjects: Subject[];
  teachers: Teacher[];
  rooms: Room[];
  timetableCells: TimetableCell[];
  selectedClassId: string;
  onSelectClassId: (id: string) => void;
  onOpenCellModal: (classId: string, day: DayOfWeek, periodId: string) => void;
  onAutoFillClass: (classId: string) => void;
  onCopyMondayToWeek: (classId: string) => void;
  onClearClassSchedule: (classId: string) => void;
  onPrintClass: (classId: string) => void;
  lang: 'hi' | 'en';
}

export const ClassTimetableView: React.FC<ClassTimetableViewProps> = ({
  classes,
  periods,
  subjects,
  teachers,
  rooms,
  timetableCells,
  selectedClassId,
  onSelectClassId,
  onOpenCellModal,
  onAutoFillClass,
  onCopyMondayToWeek,
  onClearClassSchedule,
  onPrintClass,
  lang,
}) => {
  const isHi = lang === 'hi';
  const [activeDayFilter, setActiveDayFilter] = useState<string>('all');

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classTeacher = teachers.find((t) => t.id === currentClass?.classTeacherId);
  const defaultRoom = rooms.find((r) => r.id === currentClass?.defaultRoomId);

  const days: { key: DayOfWeek; labelHi: string; labelEn: string; short: string }[] = [
    { key: 'Mon', labelHi: 'सोमवार', labelEn: 'Monday', short: 'सोम' },
    { key: 'Tue', labelHi: 'मंगलवार', labelEn: 'Tuesday', short: 'मंगल' },
    { key: 'Wed', labelHi: 'बुधवार', labelEn: 'Wednesday', short: 'बुध' },
    { key: 'Thu', labelHi: 'गुरुवार', labelEn: 'Thursday', short: 'गुरु' },
    { key: 'Fri', labelHi: 'शुक्रवार', labelEn: 'Friday', short: 'शुक्र' },
    { key: 'Sat', labelHi: 'शनिवार', labelEn: 'Saturday', short: 'शनि' },
  ];

  const filteredDays = activeDayFilter === 'all'
    ? days
    : days.filter((d) => d.key === activeDayFilter);

  // Teaching periods vs breaks
  const teachingPeriods = periods.filter((p) => !p.isBreak);

  // Calculate stats for current class
  const classCells = timetableCells.filter((c) => c.classId === currentClass.id);
  const totalAssignedPeriods = classCells.filter((c) => c.subjectId && c.teacherId).length;
  const maxWeeklyPeriods = teachingPeriods.length * 6;

  return (
    <div className="space-y-4">
      {/* Top Banner: Class Selection & Class Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Class Tabs (Class 1 to 12) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {isHi ? 'कक्षा चुनें (1 से 12):' : 'Select Class (1 to 12):'}
              </span>
              <span className="text-xs text-indigo-700 font-medium">
                {isHi ? `कक्षा ${currentClass.grade}-${currentClass.section}` : `Class ${currentClass.grade}-${currentClass.section}`}
                {currentClass.stream && ` (${currentClass.stream})`}
              </span>
            </div>

            {/* Class Pill Strip */}
            <div className="flex flex-wrap gap-1.5">
              {classes.map((cls) => {
                const isSelected = cls.id === currentClass.id;
                return (
                  <button
                    key={cls.id}
                    onClick={() => onSelectClassId(cls.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      isSelected
                        ? 'bg-indigo-700 text-white shadow-xs font-semibold ring-2 ring-indigo-700/20'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {isHi ? `कक्षा ${cls.grade}-${cls.section}` : `Cls ${cls.grade}-${cls.section}`}
                    {cls.stream ? ` (${cls.stream[0]})` : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Class Meta & Actions */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>
                <strong className="font-semibold text-slate-900">{isHi ? 'कक्षाध्यापक: ' : 'Class Teacher: '}</strong>
                {classTeacher ? (isHi && classTeacher.hindiName ? classTeacher.hindiName : classTeacher.name) : 'नियुक्त नहीं'}
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
              <DoorOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>
                <strong className="font-semibold text-slate-900">{isHi ? 'कक्ष: ' : 'Room: '}</strong>
                {defaultRoom ? (isHi ? defaultRoom.hindiName : defaultRoom.name) : '-'}
              </span>
            </div>

            <button
              onClick={() => onPrintClass(currentClass.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>{isHi ? 'प्रिंट' : 'Print'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Toolbar & Day Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
        {/* Day Filters */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveDayFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeDayFilter === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {isHi ? 'पूरा सप्ताह (All Days)' : 'Full Week'}
          </button>
          {days.map((d) => (
            <button
              key={d.key}
              onClick={() => setActiveDayFilter(d.key)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                activeDayFilter === d.key
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {isHi ? d.short : d.key}
            </button>
          ))}
        </div>

        {/* Smart Tools for Principal */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAutoFillClass(currentClass.id)}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200/60 rounded-md hover:bg-indigo-100 transition-colors"
            title={isHi ? 'रिक्त कालांशों को स्वतः भरें' : 'Auto Fill Vacant Periods'}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isHi ? 'ऑटो-शेड्यूल' : 'Auto-Fill'}</span>
          </button>

          <button
            onClick={() => onCopyMondayToWeek(currentClass.id)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors"
            title={isHi ? 'सोमवार का शेड्यूल पूरे सप्ताह में लागू करें' : 'Copy Monday to rest of week'}
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">{isHi ? 'सोमवार कॉपी करें' : 'Copy Mon'}</span>
          </button>

          <button
            onClick={() => {
              if (confirm(isHi ? 'क्या आप इस कक्षा का संपूर्ण टाइम टेबल खाली करना चाहते हैं?' : 'Clear timetable for this class?')) {
                onClearClassSchedule(currentClass.id);
              }
            }}
            className="p-1 text-slate-400 hover:text-red-600 rounded-md transition-colors"
            title={isHi ? 'कक्षा शेड्यूल साफ करें' : 'Clear Class'}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Timetable Matrix View */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[980px]">
            {/* Header: Periods with exact start and end times */}
            <thead>
              <tr className="bg-slate-900 text-white border-b border-slate-800">
                <th className="py-3 px-3 text-xs font-semibold tracking-wider uppercase border-r border-slate-800 w-28 bg-slate-950">
                  {isHi ? 'दिन / वार' : 'Day / Period'}
                </th>
                {periods.map((period) => {
                  const isBreak = period.isBreak;
                  return (
                    <th
                      key={period.id}
                      className={`py-2 px-2 text-center text-xs border-r border-slate-800 font-medium ${
                        isBreak ? 'bg-slate-800/80 text-amber-300 w-24' : 'w-36'
                      }`}
                    >
                      <div className="font-bold whitespace-nowrap">
                        {isHi ? period.nameHindi : period.nameEnglish}
                      </div>
                      <div className="text-[10px] text-slate-300 font-mono tracking-tight whitespace-nowrap flex items-center justify-center gap-1 mt-0.5">
                        <Clock className="w-2.5 h-2.5 opacity-70" />
                        {period.startTime} - {period.endTime}
                      </div>
                      <div className="text-[9px] text-slate-400">
                        {period.durationMinutes} min
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Body: Days x Periods */}
            <tbody className="divide-y divide-slate-200">
              {filteredDays.map((day) => {
                return (
                  <tr key={day.key} className="hover:bg-slate-50/70 transition-colors">
                    {/* Day Column */}
                    <td className="py-3 px-3 font-semibold text-xs text-slate-900 bg-slate-50/90 border-r border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{isHi ? day.labelHi : day.labelEn}</span>
                      </div>
                    </td>

                    {/* Periods */}
                    {periods.map((period) => {
                      if (period.isBreak) {
                        return (
                          <td
                            key={period.id}
                            className="p-2 text-center border-r border-slate-100 bg-amber-50/50 text-slate-500 font-medium text-[11px]"
                          >
                            <div className="font-semibold text-amber-900 leading-tight">
                              {isHi ? period.nameHindi : period.nameEnglish}
                            </div>
                            <span className="text-[10px] text-amber-700/80">
                              {period.durationMinutes} min
                            </span>
                          </td>
                        );
                      }

                      // Teaching Period Cell
                      const cell = classCells.find(
                        (c) => c.day === day.key && c.periodId === period.id
                      );

                      const subject = cell ? subjects.find((s) => s.id === cell.subjectId) : null;
                      const teacher = cell ? teachers.find((t) => t.id === cell.teacherId) : null;
                      const room = cell ? rooms.find((r) => r.id === cell.roomId) : null;

                      // Check if this cell currently has a conflict
                      let hasConflict = false;
                      if (cell && cell.teacherId) {
                        const conflictRes = checkAssignmentConflict(
                          {
                            classId: currentClass.id,
                            day: day.key,
                            periodId: period.id,
                            teacherId: cell.teacherId,
                            roomId: cell.roomId,
                          },
                          timetableCells,
                          teachers,
                          rooms,
                          classes
                        );
                        hasConflict = conflictRes.hasConflict;
                      }

                      return (
                        <td
                          key={period.id}
                          onClick={() => onOpenCellModal(currentClass.id, day.key, period.id)}
                          className={`p-2 border-r border-slate-200 cursor-pointer transition-all hover:ring-2 hover:ring-indigo-500 hover:ring-inset ${
                            hasConflict ? 'bg-amber-50/70' : ''
                          }`}
                        >
                          {subject && teacher ? (
                            <div
                              className="rounded-lg p-2 border transition-shadow shadow-2xs"
                              style={{
                                backgroundColor: `${subject.color}10`,
                                borderColor: `${subject.color}35`,
                              }}
                            >
                              {/* Subject title & conflict badge */}
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span
                                  className="text-xs font-bold truncate"
                                  style={{ color: subject.color }}
                                >
                                  {isHi ? subject.hindiName : subject.name}
                                </span>
                                {hasConflict && (
                                  <span title={isHi ? 'इस कालांश में टकराव है!' : 'Conflict detected!'}>
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                  </span>
                                )}
                              </div>

                              {/* Teacher info with photo / avatar */}
                              <div className="flex items-center gap-1.5 mb-1">
                                <TeacherAvatar teacher={teacher} size="sm" showBadge />
                                <span className="text-[11px] font-medium text-slate-800 truncate">
                                  {isHi && teacher.hindiName ? teacher.hindiName : teacher.name}
                                </span>
                              </div>

                              {/* Room pill */}
                              <div className="text-[10px] text-slate-500 flex items-center justify-between">
                                <span className="truncate">
                                  {room ? (isHi ? room.hindiName : room.name) : '-'}
                                </span>
                                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">
                                  {subject.code}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-16 border border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/40 transition-colors p-1 text-center">
                              <Plus className="w-4 h-4 mb-0.5" />
                              <span className="text-[10px] font-medium">
                                {isHi ? 'कालांश जोड़ें' : 'Assign'}
                              </span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Summary Bar */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <span>
              {isHi ? 'कुल आवंटित कालांश:' : 'Allocated Periods:'}{' '}
              <strong className="text-slate-900 font-mono tabular-nums">
                {totalAssignedPeriods} / {maxWeeklyPeriods}
              </strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              {isHi ? 'क्लिक करके कालांश बदलें' : 'Click any slot to edit'}
            </span>
          </div>

          <div className="text-slate-500 text-[11px]">
            {isHi ? 'समय विभाग चक्र (शीतकालीन विद्यालय संचालन)' : 'Official School Time Table Cycle'}
          </div>
        </div>
      </div>
    </div>
  );
};
