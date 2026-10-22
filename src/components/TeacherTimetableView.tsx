import React, { useState } from 'react';
import {
  Teacher,
  PeriodDefinition,
  Subject,
  Room,
  ClassInfo,
  TimetableCell,
  DayOfWeek,
} from '../types/timetable';
import { TeacherAvatar } from './TeacherAvatar';
import {
  User,
  Clock,
  Printer,
  Calendar,
  AlertCircle,
  Phone,
  BookOpen,
  CheckCircle,
  Camera,
} from 'lucide-react';

interface TeacherTimetableViewProps {
  teachers: Teacher[];
  periods: PeriodDefinition[];
  subjects: Subject[];
  rooms: Room[];
  classes: ClassInfo[];
  timetableCells: TimetableCell[];
  onToggleAbsent: (teacherId: string) => void;
  onUpdateTeacherPhoto: (teacherId: string, photoUrl: string) => void;
  onPrintTeacher: (teacherId: string) => void;
  lang: 'hi' | 'en';
}

export const TeacherTimetableView: React.FC<TeacherTimetableViewProps> = ({
  teachers,
  periods,
  subjects,
  rooms,
  classes,
  timetableCells,
  onToggleAbsent,
  onUpdateTeacherPhoto,
  onPrintTeacher,
  lang,
}) => {
  const isHi = lang === 'hi';
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || '');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Mon');

  const currentTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  const days: { key: DayOfWeek; labelHi: string; labelEn: string }[] = [
    { key: 'Mon', labelHi: 'सोमवार', labelEn: 'Monday' },
    { key: 'Tue', labelHi: 'मंगलवार', labelEn: 'Tuesday' },
    { key: 'Wed', labelHi: 'बुधवार', labelEn: 'Wednesday' },
    { key: 'Thu', labelHi: 'गुरुवार', labelEn: 'Thursday' },
    { key: 'Fri', labelHi: 'शुक्रवार', labelEn: 'Friday' },
    { key: 'Sat', labelHi: 'शनिवार', labelEn: 'Saturday' },
  ];

  if (!currentTeacher) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-slate-500">
          {isHi ? 'कोई शिक्षक उपलब्ध नहीं है।' : 'No teachers found.'}
        </p>
      </div>
    );
  }

  // Calculate teacher's workload for the selected day
  const teachingPeriods = periods.filter((p) => !p.isBreak);
  const teacherCellsToday = timetableCells.filter(
    (c) =>
      c.day === selectedDay &&
      (c.teacherId === currentTeacher.id || c.proxyTeacherId === currentTeacher.id)
  );

  const totalAssignedToday = teacherCellsToday.length;
  const freePeriodIds = teachingPeriods
    .map((p) => p.id)
    .filter((pId) => !teacherCellsToday.some((c) => c.periodId === pId));

  const teacherSubjects = subjects.filter((s) => currentTeacher.subjects.includes(s.id));

  // Handle photo file upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateTeacherPhoto(currentTeacher.id, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Teacher Selection Strip & Teacher Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        {/* Top: Teacher Pill Switcher */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {isHi ? 'शिक्षक चुनें (Select Teacher):' : 'Select Teacher:'}
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
            {teachers.map((tch) => {
              const isSelected = tch.id === currentTeacher.id;
              return (
                <button
                  key={tch.id}
                  onClick={() => setSelectedTeacherId(tch.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-700 text-white shadow-xs font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <TeacherAvatar teacher={tch} size="sm" />
                  <span>{isHi && tch.hindiName ? tch.hindiName : tch.name}</span>
                  {tch.isAbsentToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Teacher Profile Card */}
        <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Teacher Photo with Upload Button */}
            <div className="relative group">
              <TeacherAvatar teacher={currentTeacher} size="xl" showBadge />
              <label
                className="absolute inset-0 bg-black/40 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px]"
                title={isHi ? 'फोटो अपलोड करें' : 'Upload Photo'}
              >
                <Camera className="w-4 h-4 mb-0.5" />
                <span>{isHi ? 'फोटो बदलें' : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base md:text-lg text-slate-900">
                  {isHi && currentTeacher.hindiName ? currentTeacher.hindiName : currentTeacher.name}
                </h3>
                <span className="text-xs bg-slate-100 font-medium text-slate-700 px-2 py-0.5 rounded">
                  {currentTeacher.designation}
                </span>
                {currentTeacher.isAbsentToday && (
                  <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded">
                    {isHi ? 'आज अवकाश पर हैं' : 'On Leave Today'}
                  </span>
                )}
              </div>

              {/* Subjects & Contact */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                {currentTeacher.phone && (
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {currentTeacher.phone}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-slate-400" />
                  {teacherSubjects.map((s) => (isHi ? s.hindiName : s.name)).join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Absence Toggle */}
            <button
              onClick={() => onToggleAbsent(currentTeacher.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                currentTeacher.isAbsentToday
                  ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {currentTeacher.isAbsentToday
                ? (isHi ? '✓ अवकाश निरस्त करें (Mark Present)' : 'Mark Present')
                : (isHi ? 'आज अवकाश चिन्हित करें (Mark Leave)' : 'Mark Leave Today')}
            </button>

            {/* Print Teacher Schedule */}
            <button
              onClick={() => onPrintTeacher(currentTeacher.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isHi ? 'शिक्षक शेड्यूल प्रिंट करें' : 'Print Schedule'}</span>
            </button>
          </div>
        </div>

        {/* Workload Meter */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">
              {isHi ? 'आज का कार्यभार (Workload)' : 'Today\'s Workload'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-slate-900">
                {totalAssignedToday} / {currentTeacher.maxPeriodsPerDay}
              </span>
              <span className="text-xs text-slate-500">{isHi ? 'कालांश' : 'periods'}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">
              {isHi ? 'खाली कालांश (Free Periods Today)' : 'Free Periods'}
            </span>
            <div className="flex items-baseline gap-1">
              {freePeriodIds.length > 0 ? (
                <span className="text-xs font-semibold text-emerald-700">
                  {freePeriodIds
                    .map((id) => periods.find((p) => p.id === id)?.nameHindi || id)
                    .join(', ')}
                </span>
              ) : (
                <span className="text-xs text-amber-700 font-medium">
                  {isHi ? 'आज कोई रिक्त कालांश नहीं' : 'No free periods today'}
                </span>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">
              {isHi ? 'सप्ताहिक कुल कालांश' : 'Weekly Assigned'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-indigo-700">
                {timetableCells.filter((c) => c.teacherId === currentTeacher.id).length}
              </span>
              <span className="text-xs text-slate-500">/ 36 periods</span>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher's Full Weekly Schedule Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <h4 className="font-bold text-sm">
              {isHi
                ? `${currentTeacher.hindiName || currentTeacher.name} की साप्ताहिक समय सारणी`
                : `Weekly Timetable of ${currentTeacher.name}`}
            </h4>
          </div>
          <span className="text-xs text-slate-300 font-mono">
            {isHi ? 'समय विभाग चक्र 2026-27' : 'Session 2026-27'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-xs font-semibold">
                <th className="py-2.5 px-3 border-r border-slate-200 w-28 bg-slate-200/70">
                  {isHi ? 'वार (Day)' : 'Day'}
                </th>
                {periods.map((period) => (
                  <th
                    key={period.id}
                    className={`py-2 px-2 text-center border-r border-slate-200 ${
                      period.isBreak ? 'bg-amber-50/70 text-amber-900 w-20' : 'w-32'
                    }`}
                  >
                    <div>{isHi ? period.nameHindi : period.nameEnglish}</div>
                    <div className="text-[10px] text-slate-500 font-mono font-normal">
                      {period.startTime} - {period.endTime}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {days.map((day) => {
                return (
                  <tr key={day.key} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-xs text-slate-900 bg-slate-50/80 border-r border-slate-200">
                      {isHi ? day.labelHi : day.labelEn}
                    </td>

                    {periods.map((period) => {
                      if (period.isBreak) {
                        return (
                          <td
                            key={period.id}
                            className="p-1.5 text-center border-r border-slate-100 bg-amber-50/30 text-amber-800 text-[10px] font-medium"
                          >
                            {isHi ? period.nameHindi : period.nameEnglish}
                          </td>
                        );
                      }

                      const cell = timetableCells.find(
                        (c) =>
                          c.day === day.key &&
                          c.periodId === period.id &&
                          (c.teacherId === currentTeacher.id || c.proxyTeacherId === currentTeacher.id)
                      );

                      if (cell) {
                        const targetClass = classes.find((c) => c.id === cell.classId);
                        const sub = subjects.find((s) => s.id === cell.subjectId);
                        const room = rooms.find((r) => r.id === cell.roomId);

                        return (
                          <td
                            key={period.id}
                            className="p-1.5 border-r border-slate-200"
                          >
                            <div
                              className="p-2 rounded-lg border text-xs"
                              style={{
                                backgroundColor: `${sub?.color || '#3B82F6'}12`,
                                borderColor: `${sub?.color || '#3B82F6'}35`,
                              }}
                            >
                              <div className="font-bold text-slate-900 truncate">
                                Class {targetClass?.grade}-{targetClass?.section}
                              </div>
                              <div
                                className="text-[11px] font-semibold truncate"
                                style={{ color: sub?.color }}
                              >
                                {isHi ? sub?.hindiName : sub?.name}
                              </div>
                              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                {room ? (isHi ? room.hindiName : room.name) : '-'}
                              </div>
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td
                          key={period.id}
                          className="p-2 border-r border-slate-200 text-center"
                        >
                          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block">
                            {isHi ? 'मुक्त (Free)' : 'Free'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
