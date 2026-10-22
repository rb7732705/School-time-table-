import React, { useState } from 'react';
import {
  ClassInfo,
  PeriodDefinition,
  Subject,
  Teacher,
  Room,
  TimetableCell,
  SchoolProfile,
  DayOfWeek,
} from '../types/timetable';
import { TeacherAvatar } from './TeacherAvatar';
import { Printer, X, FileText, Check } from 'lucide-react';

interface PrintViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassInfo[];
  periods: PeriodDefinition[];
  subjects: Subject[];
  teachers: Teacher[];
  rooms: Room[];
  timetableCells: TimetableCell[];
  profile: SchoolProfile;
  defaultType?: 'class' | 'teacher' | 'master';
  initialId?: string;
  lang: 'hi' | 'en';
}

export const PrintViewModal: React.FC<PrintViewModalProps> = ({
  isOpen,
  onClose,
  classes,
  periods,
  subjects,
  teachers,
  rooms,
  timetableCells,
  profile,
  defaultType = 'class',
  initialId,
  lang,
}) => {
  const isHi = lang === 'hi';
  const [printType, setPrintType] = useState<'class' | 'teacher' | 'master'>(defaultType);
  const [selectedClassId, setSelectedClassId] = useState<string>(initialId || classes[0]?.id || '');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || '');
  const [selectedMasterDay, setSelectedMasterDay] = useState<DayOfWeek>('Mon');

  if (!isOpen) return null;

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const currentClassTeacher = teachers.find((t) => t.id === currentClass?.classTeacherId);
  const currentRoom = rooms.find((r) => r.id === currentClass?.defaultRoomId);

  const currentTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  const days: { key: DayOfWeek; labelHi: string; labelEn: string }[] = [
    { key: 'Mon', labelHi: 'सोमवार', labelEn: 'Monday' },
    { key: 'Tue', labelHi: 'मंगलवार', labelEn: 'Tuesday' },
    { key: 'Wed', labelHi: 'बुधवार', labelEn: 'Wednesday' },
    { key: 'Thu', labelHi: 'गुरुवार', labelEn: 'Thursday' },
    { key: 'Fri', labelHi: 'शुक्रवार', labelEn: 'Friday' },
    { key: 'Sat', labelHi: 'शनिवार', labelEn: 'Saturday' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden my-4">
        {/* Top bar (Hidden during print) */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <Printer className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                {isHi ? 'टाइम टेबल प्रिंट पूर्वावलोकन' : 'Print Timetable Preview'}
              </h3>
              <p className="text-xs text-slate-400">
                {isHi ? 'आधिकारिक विद्यालय फॉर्मेट (Official School Format)' : 'Official School Board Format'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>{isHi ? 'प्रिंट करें (Ctrl+P)' : 'Print Now'}</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Options Toolbar (Hidden during print) */}
        <div className="px-5 py-2.5 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPrintType('class')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                printType === 'class' ? 'bg-indigo-700 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isHi ? 'कक्षा समय सारणी' : 'Class Timetable'}
            </button>
            <button
              onClick={() => setPrintType('teacher')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                printType === 'teacher' ? 'bg-indigo-700 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isHi ? 'शिक्षक समय सारणी' : 'Teacher Timetable'}
            </button>
            <button
              onClick={() => setPrintType('master')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                printType === 'master' ? 'bg-indigo-700 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isHi ? 'मास्टर ग्रिड (सम्पूर्ण विद्यालय)' : 'Master School Grid'}
            </button>
          </div>

          <div>
            {printType === 'class' && (
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-medium text-slate-800"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    Class {cls.grade}-{cls.section} {cls.stream ? `(${cls.stream})` : ''}
                  </option>
                ))}
              </select>
            )}

            {printType === 'teacher' && (
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-medium text-slate-800"
              >
                {teachers.map((tch) => (
                  <option key={tch.id} value={tch.id}>
                    {tch.name} ({tch.designation})
                  </option>
                ))}
              </select>
            )}

            {printType === 'master' && (
              <select
                value={selectedMasterDay}
                onChange={(e) => setSelectedMasterDay(e.target.value as DayOfWeek)}
                className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-medium text-slate-800"
              >
                {days.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.labelHi} ({d.labelEn})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Printable Paper Area (Styled like official Indian Government / Board School Certificate Timetable) */}
        <div id="printable-area" className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto bg-white print:p-0 print:max-h-none print:overflow-visible">
          {/* Official School Header */}
          <div className="text-center pb-4 border-b-2 border-slate-900 mb-4">
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight uppercase">
              {profile.schoolHindiName}
            </h1>
            <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide">
              {profile.schoolName}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {profile.address} · UDISE कोड: <span className="font-mono">{profile.udiseCode}</span>
            </p>
            <div className="mt-2 inline-block bg-slate-900 text-white font-bold text-xs uppercase px-4 py-1 rounded">
              {printType === 'class' && `कक्षा समय विभाग चक्र — सत्र: ${profile.session}`}
              {printType === 'teacher' && `शिक्षक व्यक्तिगत समय सारणी — सत्र: ${profile.session}`}
              {printType === 'master' && `सम्पूर्ण विद्यालय समय विभाग चक्र (मास्टर ग्रिड) — सत्र: ${profile.session}`}
            </div>
          </div>

          {/* Type 1: Class Printout */}
          {printType === 'class' && (
            <div>
              {/* Class Subheader */}
              <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-slate-800 mb-3 bg-slate-50 p-2.5 border border-slate-300 rounded">
                <div>
                  <span className="text-slate-500">कक्षा एवं वर्ग:</span>{' '}
                  <strong className="text-slate-900 text-sm">
                    कक्षा {currentClass.grade} '{currentClass.section}' {currentClass.stream ? `(${currentClass.stream})` : ''}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">कक्षाध्यापक:</span>{' '}
                  <strong className="text-slate-900">
                    {currentClassTeacher ? (currentClassTeacher.hindiName || currentClassTeacher.name) : '-'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">कक्ष संख्या:</span>{' '}
                  <strong className="text-slate-900">
                    {currentRoom ? (currentRoom.hindiName || currentRoom.name) : '-'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">विद्यालय संचालन:</span>{' '}
                  <strong className="text-slate-900">शीतकालीन (09:55 AM - 04:00 PM)</strong>
                </div>
              </div>

              {/* Table */}
              <table className="w-full border-collapse border border-slate-900 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 border-b border-slate-900 font-bold">
                    <th className="border border-slate-900 py-2 px-2 text-center w-24">वार</th>
                    {periods.map((p) => (
                      <th
                        key={p.id}
                        className={`border border-slate-900 py-2 px-1 text-center ${
                          p.isBreak ? 'bg-slate-200/70 w-16' : ''
                        }`}
                      >
                        <div className="font-extrabold">{p.nameHindi}</div>
                        <div className="text-[9px] font-mono font-normal">
                          {p.startTime}-{p.endTime}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {days.map((day) => (
                    <tr key={day.key} className="border-b border-slate-900">
                      <td className="border border-slate-900 py-2.5 px-2 font-bold text-center bg-slate-50">
                        {day.labelHi}
                      </td>

                      {periods.map((period) => {
                        if (period.isBreak) {
                          return (
                            <td
                              key={period.id}
                              className="border border-slate-900 p-1 text-center bg-slate-100 text-[10px] font-bold text-slate-600"
                            >
                              {period.nameHindi}
                            </td>
                          );
                        }

                        const cell = timetableCells.find(
                          (c) => c.classId === currentClass.id && c.day === day.key && c.periodId === period.id
                        );
                        const sub = cell ? subjects.find((s) => s.id === cell.subjectId) : null;
                        const tch = cell ? teachers.find((t) => t.id === cell.teacherId) : null;
                        const rm = cell ? rooms.find((r) => r.id === cell.roomId) : null;

                        return (
                          <td
                            key={period.id}
                            className="border border-slate-900 p-1.5 text-center align-middle"
                          >
                            {sub && tch ? (
                              <div>
                                <div className="font-bold text-slate-950 text-[11px]">
                                  {sub.hindiName || sub.name}
                                </div>
                                <div className="text-[10px] text-slate-700 font-medium">
                                  {tch.hindiName || tch.name}
                                </div>
                                <div className="text-[9px] text-slate-500 font-mono">
                                  {rm?.name}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Type 2: Teacher Printout */}
          {printType === 'teacher' && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-3 bg-slate-50 p-3 border border-slate-300 rounded">
                <div className="flex items-center gap-3">
                  <TeacherAvatar teacher={currentTeacher} size="lg" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {currentTeacher.hindiName || currentTeacher.name}
                    </h3>
                    <p className="text-slate-600">{currentTeacher.designation}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p>
                    <span className="text-slate-500">अधिकतम कालांश/दिन:</span>{' '}
                    <strong className="text-slate-900 font-mono">{currentTeacher.maxPeriodsPerDay}</strong>
                  </p>
                  <p>
                    <span className="text-slate-500">संपर्क:</span>{' '}
                    <strong className="text-slate-900 font-mono">{currentTeacher.phone || '-'}</strong>
                  </p>
                </div>
              </div>

              <table className="w-full border-collapse border border-slate-900 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 border-b border-slate-900 font-bold">
                    <th className="border border-slate-900 py-2 px-2 text-center w-24">वार</th>
                    {periods.map((p) => (
                      <th
                        key={p.id}
                        className={`border border-slate-900 py-2 px-1 text-center ${
                          p.isBreak ? 'bg-slate-200/70 w-16' : ''
                        }`}
                      >
                        <div className="font-extrabold">{p.nameHindi}</div>
                        <div className="text-[9px] font-mono font-normal">
                          {p.startTime}-{p.endTime}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {days.map((day) => (
                    <tr key={day.key} className="border-b border-slate-900">
                      <td className="border border-slate-900 py-2.5 px-2 font-bold text-center bg-slate-50">
                        {day.labelHi}
                      </td>

                      {periods.map((period) => {
                        if (period.isBreak) {
                          return (
                            <td
                              key={period.id}
                              className="border border-slate-900 p-1 text-center bg-slate-100 text-[10px] font-bold text-slate-600"
                            >
                              {period.nameHindi}
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
                          const cls = classes.find((c) => c.id === cell.classId);
                          const sub = subjects.find((s) => s.id === cell.subjectId);
                          const rm = rooms.find((r) => r.id === cell.roomId);

                          return (
                            <td key={period.id} className="border border-slate-900 p-1.5 text-center">
                              <div className="font-extrabold text-slate-950 text-[11px]">
                                Class {cls?.grade}-{cls?.section}
                              </div>
                              <div className="text-[10px] text-slate-700">
                                {sub?.hindiName || sub?.name}
                              </div>
                              <div className="text-[9px] text-slate-500 font-mono">
                                {rm?.name}
                              </div>
                            </td>
                          );
                        }

                        return (
                          <td
                            key={period.id}
                            className="border border-slate-900 p-1.5 text-center text-[10px] text-slate-400 italic"
                          >
                            मुक्त (Free)
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Type 3: Master Sheet Printout */}
          {printType === 'master' && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-3 bg-slate-50 p-2.5 border border-slate-300 rounded">
                <div>
                  <span className="text-slate-500">दिन (वार):</span>{' '}
                  <strong className="text-slate-900 text-sm">
                    {days.find((d) => d.key === selectedMasterDay)?.labelHi} ({selectedMasterDay})
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">कुल कक्षाएं:</span>{' '}
                  <strong className="text-slate-900">{classes.length} (1 से 12)</strong>
                </div>
              </div>

              <table className="w-full border-collapse border border-slate-900 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 border-b border-slate-900 font-bold">
                    <th className="border border-slate-900 py-1.5 px-2 text-center w-24">कक्षा</th>
                    {periods.map((p) => (
                      <th
                        key={p.id}
                        className={`border border-slate-900 py-1.5 px-1 text-center ${
                          p.isBreak ? 'bg-slate-200/70 w-14' : ''
                        }`}
                      >
                        <div className="font-extrabold">{p.nameHindi}</div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {classes.map((cls) => {
                    const classCells = timetableCells.filter(
                      (c) => c.classId === cls.id && c.day === selectedMasterDay
                    );

                    return (
                      <tr key={cls.id} className="border-b border-slate-900">
                        <td className="border border-slate-900 py-1 px-2 font-bold bg-slate-50 text-center">
                          Class {cls.grade}-{cls.section}
                        </td>

                        {periods.map((period) => {
                          if (period.isBreak) {
                            return (
                              <td
                                key={period.id}
                                className="border border-slate-900 p-0.5 text-center bg-slate-100 text-[9px] text-slate-500"
                              >
                                {period.nameHindi}
                              </td>
                            );
                          }

                          const cell = classCells.find((c) => c.periodId === period.id);
                          const sub = cell ? subjects.find((s) => s.id === cell.subjectId) : null;
                          const tch = cell ? teachers.find((t) => t.id === cell.teacherId) : null;

                          return (
                            <td key={period.id} className="border border-slate-900 p-1 text-center">
                              {sub && tch ? (
                                <div className="leading-tight">
                                  <div className="font-bold text-[10px] text-slate-900">
                                    {sub.code || sub.name.slice(0, 4)}
                                  </div>
                                  <div className="text-[9px] text-slate-600 truncate">
                                    {tch.name.split(' ').pop()}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-300">-</span>
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
          )}

          {/* Official Footer with Principal Signature Seal Block */}
          <div className="mt-10 pt-4 flex items-end justify-between text-xs text-slate-800">
            <div>
              <p className="font-mono text-[10px] text-slate-500">
                दिनांक: {new Date().toLocaleDateString('hi-IN')}
              </p>
              <p className="text-[10px] text-slate-500">
                सत्यापित प्रति · समय विभाग चक्र प्रभारी
              </p>
            </div>

            <div className="text-center w-52">
              <div className="h-14 border-b border-dashed border-slate-800 flex items-center justify-center text-slate-400 italic text-[11px]">
                {/* Space for Seal / Signature */}
                (हस्ताक्षर एवं सील)
              </div>
              <p className="font-bold text-slate-950 mt-1">
                {profile.principalName}
              </p>
              <p className="text-[10px] text-slate-600">
                संस्था प्रधान (Principal)
              </p>
              <p className="text-[9px] text-slate-500">
                {profile.schoolHindiName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
