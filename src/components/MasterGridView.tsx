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
  AlertTriangle,
  Download,
  Printer,
  Filter,
  Search,
} from 'lucide-react';

interface MasterGridViewProps {
  classes: ClassInfo[];
  periods: PeriodDefinition[];
  subjects: Subject[];
  teachers: Teacher[];
  rooms: Room[];
  timetableCells: TimetableCell[];
  onOpenCellModal: (classId: string, day: DayOfWeek, periodId: string) => void;
  onPrintMaster: (day: DayOfWeek) => void;
  lang: 'hi' | 'en';
}

export const MasterGridView: React.FC<MasterGridViewProps> = ({
  classes,
  periods,
  subjects,
  teachers,
  rooms,
  timetableCells,
  onOpenCellModal,
  onPrintMaster,
  lang,
}) => {
  const isHi = lang === 'hi';
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Mon');
  const [filterTeacherId, setFilterTeacherId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const days: { key: DayOfWeek; labelHi: string; labelEn: string }[] = [
    { key: 'Mon', labelHi: 'सोमवार', labelEn: 'Monday' },
    { key: 'Tue', labelHi: 'मंगलवार', labelEn: 'Tuesday' },
    { key: 'Wed', labelHi: 'बुधवार', labelEn: 'Wednesday' },
    { key: 'Thu', labelHi: 'गुरुवार', labelEn: 'Thursday' },
    { key: 'Fri', labelHi: 'शुक्रवार', labelEn: 'Friday' },
    { key: 'Sat', labelHi: 'शनिवार', labelEn: 'Saturday' },
  ];

  // Export current day matrix as CSV
  const handleExportCSV = () => {
    const teachingPeriods = periods.filter((p) => !p.isBreak);
    const headers = ['Class', 'Section', ...teachingPeriods.map((p) => `${p.nameEnglish} (${p.startTime}-${p.endTime})`)];
    const rows = classes.map((cls) => {
      const row = [`Class ${cls.grade}`, cls.section];
      teachingPeriods.forEach((period) => {
        const cell = timetableCells.find(
          (c) => c.classId === cls.id && c.day === selectedDay && c.periodId === period.id
        );
        if (cell) {
          const sub = subjects.find((s) => s.id === cell.subjectId);
          const tch = teachers.find((t) => t.id === cell.teacherId);
          const rm = rooms.find((r) => r.id === cell.roomId);
          row.push(`"${sub?.name || ''} - ${tch?.name || ''} (${rm?.name || ''})"`);
        } else {
          row.push('""');
        }
      });
      return row.join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Master_Timetable_${selectedDay}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter classes if searched
  const filteredClasses = classes.filter((cls) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchGrade = cls.grade.toString().includes(q) || `class ${cls.grade}`.toLowerCase().includes(q);
      const matchStream = cls.stream?.toLowerCase().includes(q);
      return matchGrade || matchStream;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Day Selector */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              {isHi ? 'दिन चुनें:' : 'Day:'}
            </span>
            <div className="flex items-center gap-1">
              {days.map((d) => {
                const isSelected = selectedDay === d.key;
                return (
                  <button
                    key={d.key}
                    onClick={() => setSelectedDay(d.key)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      isSelected
                        ? 'bg-indigo-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isHi ? d.labelHi : d.labelEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search, Filter & Export */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter by Teacher */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={filterTeacherId}
                onChange={(e) => setFilterTeacherId(e.target.value)}
                className="bg-transparent text-slate-700 font-medium focus:outline-none"
              >
                <option value="all">{isHi ? 'सभी शिक्षक (All Teachers)' : 'All Teachers'}</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {isHi && t.hindiName ? t.hindiName : t.name} ({t.designation})
                  </option>
                ))}
              </select>
            </div>

            {/* Class Search input */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={isHi ? 'कक्षा खोजें...' : 'Search class...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-slate-700 focus:outline-none w-24 sm:w-32"
              />
            </div>

            {/* CSV export */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs"
              title={isHi ? 'CSV फॉर्मेट में डाउनलोड करें' : 'Export as CSV'}
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>CSV</span>
            </button>

            {/* Print Master Sheet */}
            <button
              onClick={() => onPrintMaster(selectedDay)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isHi ? 'मास्टर ग्रिड प्रिंट करें' : 'Print Grid'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* The Master Matrix Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            {/* Header */}
            <thead>
              <tr className="bg-slate-900 text-white border-b border-slate-800">
                <th className="py-3 px-3 text-xs font-bold uppercase tracking-wider border-r border-slate-800 w-32 sticky left-0 bg-slate-950 z-10">
                  {isHi ? 'कक्षा (Class)' : 'Class'}
                </th>
                {periods.map((period) => {
                  return (
                    <th
                      key={period.id}
                      className={`py-2 px-2 text-center text-xs border-r border-slate-800 font-medium ${
                        period.isBreak ? 'bg-slate-800/80 text-amber-300 w-20' : 'w-36'
                      }`}
                    >
                      <div className="font-bold whitespace-nowrap">
                        {isHi ? period.nameHindi : period.nameEnglish}
                      </div>
                      <div className="text-[10px] text-slate-300 font-mono tracking-tight mt-0.5 whitespace-nowrap">
                        {period.startTime} - {period.endTime}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Body: Each Class is a row */}
            <tbody className="divide-y divide-slate-200">
              {filteredClasses.map((cls) => {
                const classCells = timetableCells.filter(
                  (c) => c.classId === cls.id && c.day === selectedDay
                );

                return (
                  <tr key={cls.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Class Column (Sticky Left) */}
                    <td className="py-2.5 px-3 font-bold text-xs text-slate-900 bg-slate-50/95 border-r border-slate-200 sticky left-0 z-10 shadow-2xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                        <div>
                          <div className="whitespace-nowrap">
                            Class {cls.grade}-{cls.section}
                          </div>
                          {cls.stream && (
                            <span className="text-[10px] text-slate-500 font-normal">
                              ({cls.stream})
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Periods */}
                    {periods.map((period) => {
                      if (period.isBreak) {
                        return (
                          <td
                            key={period.id}
                            className="p-1.5 text-center border-r border-slate-100 bg-amber-50/40 text-amber-800 text-[10px] font-medium"
                          >
                            {isHi ? period.nameHindi : period.nameEnglish}
                          </td>
                        );
                      }

                      const cell = classCells.find((c) => c.periodId === period.id);
                      const subject = cell ? subjects.find((s) => s.id === cell.subjectId) : null;
                      const teacher = cell ? teachers.find((t) => t.id === cell.teacherId) : null;
                      const room = cell ? rooms.find((r) => r.id === cell.roomId) : null;

                      // Teacher filter check
                      const matchesTeacherFilter =
                        filterTeacherId === 'all' || (cell && cell.teacherId === filterTeacherId);

                      // Conflict check
                      let hasConflict = false;
                      if (cell && cell.teacherId) {
                        const clash = checkAssignmentConflict(
                          {
                            classId: cls.id,
                            day: selectedDay,
                            periodId: period.id,
                            teacherId: cell.teacherId,
                            roomId: cell.roomId,
                          },
                          timetableCells,
                          teachers,
                          rooms,
                          classes
                        );
                        hasConflict = clash.hasConflict;
                      }

                      return (
                        <td
                          key={period.id}
                          onClick={() => onOpenCellModal(cls.id, selectedDay, period.id)}
                          className={`p-1.5 border-r border-slate-200 cursor-pointer transition-all hover:bg-indigo-50/50 ${
                            !matchesTeacherFilter ? 'opacity-20' : ''
                          } ${hasConflict ? 'bg-red-50' : ''}`}
                        >
                          {subject && teacher ? (
                            <div
                              className={`p-1.5 rounded-md border text-xs transition-shadow ${
                                hasConflict ? 'border-red-400 bg-red-50' : ''
                              }`}
                              style={{
                                backgroundColor: !hasConflict ? `${subject.color}12` : undefined,
                                borderColor: !hasConflict ? `${subject.color}35` : undefined,
                              }}
                            >
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span
                                  className="font-bold truncate text-[11px]"
                                  style={{ color: subject.color }}
                                >
                                  {isHi ? subject.hindiName : subject.name}
                                </span>
                                {hasConflict && (
                                  <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-slate-800 truncate">
                                <TeacherAvatar teacher={teacher} size="sm" showBadge />
                                <span className="truncate">
                                  {isHi && teacher.hindiName ? teacher.hindiName : teacher.name}
                                </span>
                              </div>
                              <div className="text-[9px] text-slate-500 truncate mt-0.5">
                                {room ? (isHi ? room.hindiName : room.name) : ''}
                              </div>
                            </div>
                          ) : (
                            <div className="h-12 border border-dashed border-slate-200 rounded flex items-center justify-center text-[10px] text-slate-300 hover:text-slate-500 hover:border-slate-300">
                              -
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

        {/* Master Grid legend */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-900">
              {isHi ? 'दिन: ' : 'Day: '} {selectedDay}
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              {isHi ? 'कुल कक्षाएं: ' : 'Total Classes: '} {classes.length}
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              {isHi ? 'सक्रिय शिक्षक: ' : 'Active Teachers: '} {teachers.length}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>{isHi ? 'किसी भी कक्ष पर क्लिक करके बदलाव करें' : 'Click any cell to edit assignment'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
