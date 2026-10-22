import React, { useState } from 'react';
import {
  Teacher,
  PeriodDefinition,
  Subject,
  ClassInfo,
  TimetableCell,
  DayOfWeek,
  SubstitutionAssignment,
} from '../types/timetable';
import { TeacherAvatar } from './TeacherAvatar';
import { getAvailableTeachers } from '../utils/conflictChecker';
import {
  UserX,
  UserCheck,
  Calendar,
  Clock,
  Printer,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface SubstitutionViewProps {
  teachers: Teacher[];
  periods: PeriodDefinition[];
  subjects: Subject[];
  classes: ClassInfo[];
  timetableCells: TimetableCell[];
  substitutions: SubstitutionAssignment[];
  onToggleAbsent: (teacherId: string) => void;
  onAssignSubstitution: (assignment: Omit<SubstitutionAssignment, 'id'>) => void;
  onRemoveSubstitution: (id: string) => void;
  lang: 'hi' | 'en';
}

export const SubstitutionView: React.FC<SubstitutionViewProps> = ({
  teachers,
  periods,
  subjects,
  classes,
  timetableCells,
  substitutions,
  onToggleAbsent,
  onAssignSubstitution,
  onRemoveSubstitution,
  lang,
}) => {
  const isHi = lang === 'hi';
  const today: DayOfWeek = 'Mon'; // Defaulting to school working day
  const formattedDate = new Date().toLocaleDateString('hi-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const [activeTeacherId, setActiveTeacherId] = useState<string>('');

  const absentTeachers = teachers.filter((t) => t.isAbsentToday);
  const presentTeachers = teachers.filter((t) => !t.isAbsentToday);

  // Periods that need coverage today due to absent teachers
  const periodsToCover: {
    teacher: Teacher;
    cell: TimetableCell;
    classInfo: ClassInfo;
    period: PeriodDefinition;
    subject: Subject;
    assignedSub?: SubstitutionAssignment;
    substituteTeacher?: Teacher;
  }[] = [];

  absentTeachers.forEach((tch) => {
    const cellsToday = timetableCells.filter((c) => c.day === today && c.teacherId === tch.id);
    cellsToday.forEach((c) => {
      const cls = classes.find((cl) => cl.id === c.classId);
      const per = periods.find((p) => p.id === c.periodId);
      const sub = subjects.find((s) => s.id === c.subjectId);
      const assigned = substitutions.find(
        (s) => s.absentTeacherId === tch.id && s.periodId === c.periodId && s.classId === c.classId
      );
      const subTeacher = assigned ? teachers.find((t) => t.id === assigned.substituteTeacherId) : undefined;

      if (cls && per && sub) {
        periodsToCover.push({
          teacher: tch,
          cell: c,
          classInfo: cls,
          period: per,
          subject: sub,
          assignedSub: assigned,
          substituteTeacher: subTeacher,
        });
      }
    });
  });

  // Print substitution register / slip
  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Top Banner: Date & Attendance Management */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {isHi ? 'दैनिक प्रतिनियुक्ति (सब्स्टीट्यूशन / प्रॉक्सी) रजिस्टर' : 'Daily Substitution (Proxy) Register'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedDate}</span>
              <span>·</span>
              <span>{isHi ? 'सोमवार' : 'Monday'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintSlip}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>{isHi ? 'प्रतिनियुक्ति पर्ची प्रिंट करें' : 'Print Proxy Slip'}</span>
            </button>
          </div>
        </div>

        {/* Quick Absence Marker Strip */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {isHi ? 'शिक्षक उपस्थिति स्थिति (क्लिक करके अवकाश चिन्हित करें):' : 'Mark Teacher Attendance / Leave:'}
          </label>
          <div className="flex flex-wrap gap-2">
            {teachers.map((tch) => {
              const isAbsent = tch.isAbsentToday;
              return (
                <button
                  key={tch.id}
                  onClick={() => onToggleAbsent(tch.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isAbsent
                      ? 'bg-red-50 text-red-700 border-red-300 ring-1 ring-red-300 font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  title={isAbsent ? 'क्लिक करके उपस्थित करें' : 'क्लिक करके अवकाश चिन्हित करें'}
                >
                  <TeacherAvatar teacher={tch} size="sm" showBadge />
                  <span>{isHi && tch.hindiName ? tch.hindiName : tch.name}</span>
                  {isAbsent ? (
                    <UserX className="w-3.5 h-3.5 text-red-600 ml-1" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600 ml-1 opacity-40 hover:opacity-100" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Substitution Board */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm">
              {isHi ? 'अवकाश पर शिक्षकों के रिक्त कालांश एवं प्रतिनियुक्ति' : 'Pending Periods & Proxy Allocation'}
            </h3>
          </div>
          <span className="text-xs text-amber-300 font-mono">
            {absentTeachers.length} {isHi ? 'शिक्षक अवकाश पर' : 'teachers on leave'}
          </span>
        </div>

        {periodsToCover.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <p className="font-semibold text-slate-800 text-sm">
              {isHi
                ? 'आज विद्यालय में सभी शिक्षक उपस्थित हैं अथवा सभी कालांश व्यवस्थित हैं!'
                : 'All teachers are present today or all periods are covered!'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {isHi
                ? 'यदि कोई शिक्षक अवकाश पर हैं, तो ऊपर सूची में से उनके नाम पर क्लिक करके अवकाश चिन्हित करें।'
                : 'To assign substitution, mark an absent teacher from the top list.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {periodsToCover.map((item, idx) => {
              // Find free teachers for this period
              const { available: freeTeachers } = getAvailableTeachers(
                today,
                item.period.id,
                teachers,
                timetableCells,
                item.classInfo.id
              );

              return (
                <div key={`${item.teacher.id}-${item.period.id}-${idx}`} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Absent Teacher & Period Info */}
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600 font-bold text-sm shrink-0">
                        {item.period.periodNumber || 'P'}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {isHi ? item.period.nameHindi : item.period.nameEnglish} ({item.period.startTime} - {item.period.endTime})
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Class {item.classInfo.grade}-{item.classInfo.section}
                          </span>
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: `${item.subject.color}15`,
                              color: item.subject.color,
                            }}
                          >
                            {isHi ? item.subject.hindiName : item.subject.name}
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                          <span>{isHi ? 'अनुपस्थित शिक्षक: ' : 'Absent Teacher: '}</span>
                          <span className="font-semibold text-red-700">
                            {isHi && item.teacher.hindiName ? item.teacher.hindiName : item.teacher.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Assigned Substitute or Dropdown to Assign */}
                    <div className="flex items-center gap-3 shrink-0">
                      {item.assignedSub && item.substituteTeacher ? (
                        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-300 rounded-lg p-2.5">
                          <div className="flex items-center gap-2">
                            <TeacherAvatar teacher={item.substituteTeacher} size="sm" />
                            <div>
                              <div className="text-xs font-bold text-emerald-900">
                                {isHi && item.substituteTeacher.hindiName
                                  ? item.substituteTeacher.hindiName
                                  : item.substituteTeacher.name}
                              </div>
                              <div className="text-[10px] text-emerald-700">
                                {isHi ? 'प्रतिनियुक्त (Assigned Proxy)' : 'Substitute Assigned'}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => onRemoveSubstitution(item.assignedSub!.id)}
                            className="text-xs text-red-600 hover:text-red-800 font-medium ml-2 px-1.5 py-0.5 hover:bg-white rounded"
                            title={isHi ? 'प्रतिनियुक्ति हटाएं' : 'Remove Proxy'}
                          >
                            {isHi ? 'बदलें' : 'Change'}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                onAssignSubstitution({
                                  date: new Date().toISOString().split('T')[0],
                                  absentTeacherId: item.teacher.id,
                                  periodId: item.period.id,
                                  classId: item.classInfo.id,
                                  substituteTeacherId: e.target.value,
                                  subjectId: item.subject.id,
                                  status: 'assigned',
                                });
                              }
                            }}
                            defaultValue=""
                            className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                          >
                            <option value="" disabled>
                              {isHi ? '-- रिक्त शिक्षक में से चुनें --' : '-- Choose Free Teacher --'}
                            </option>
                            {freeTeachers.map((ft) => (
                              <option key={ft.id} value={ft.id}>
                                {isHi && ft.hindiName ? ft.hindiName : ft.name} ({ft.designation})
                              </option>
                            ))}
                          </select>

                          {freeTeachers.length === 0 && (
                            <span className="text-xs text-amber-600 font-medium">
                              {isHi ? 'कोई शिक्षक खाली नहीं' : 'No free teacher'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
