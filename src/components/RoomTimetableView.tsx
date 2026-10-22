import React, { useState } from 'react';
import {
  Room,
  PeriodDefinition,
  Subject,
  Teacher,
  ClassInfo,
  TimetableCell,
  DayOfWeek,
} from '../types/timetable';
import { TeacherAvatar } from './TeacherAvatar';
import { DoorOpen, Calendar, Clock, CheckCircle } from 'lucide-react';

interface RoomTimetableViewProps {
  rooms: Room[];
  periods: PeriodDefinition[];
  subjects: Subject[];
  teachers: Teacher[];
  classes: ClassInfo[];
  timetableCells: TimetableCell[];
  lang: 'hi' | 'en';
}

export const RoomTimetableView: React.FC<RoomTimetableViewProps> = ({
  rooms,
  periods,
  subjects,
  teachers,
  classes,
  timetableCells,
  lang,
}) => {
  const isHi = lang === 'hi';
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || '');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Mon');

  const currentRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  const days: { key: DayOfWeek; labelHi: string; labelEn: string }[] = [
    { key: 'Mon', labelHi: 'सोमवार', labelEn: 'Monday' },
    { key: 'Tue', labelHi: 'मंगलवार', labelEn: 'Tuesday' },
    { key: 'Wed', labelHi: 'बुधवार', labelEn: 'Wednesday' },
    { key: 'Thu', labelHi: 'गुरुवार', labelEn: 'Thursday' },
    { key: 'Fri', labelHi: 'शुक्रवार', labelEn: 'Friday' },
    { key: 'Sat', labelHi: 'शनिवार', labelEn: 'Saturday' },
  ];

  return (
    <div className="space-y-4">
      {/* Room Selection */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          {isHi ? 'कक्ष / प्रयोगशाला चुनें (Select Room / Lab):' : 'Select Room:'}
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
          {rooms.map((rm) => {
            const isSelected = rm.id === currentRoom?.id;
            return (
              <button
                key={rm.id}
                onClick={() => setSelectedRoomId(rm.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-700 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <DoorOpen className="w-3.5 h-3.5" />
                <span>{isHi ? rm.hindiName : rm.name}</span>
                <span className="text-[10px] opacity-75">({rm.floor})</span>
              </button>
            );
          })}
        </div>

        {/* Room Info Strip */}
        {currentRoom && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <span>
              <strong className="text-slate-900">{isHi ? 'कक्ष प्रकार: ' : 'Type: '}</strong>
              {currentRoom.type}
            </span>
            <span>·</span>
            <span>
              <strong className="text-slate-900">{isHi ? 'क्षमता: ' : 'Capacity: '}</strong>
              {currentRoom.capacity} विद्यार्थी
            </span>
            <span>·</span>
            <span>
              <strong className="text-slate-900">{isHi ? 'मंजिल / स्थान: ' : 'Location: '}</strong>
              {currentRoom.floor}
            </span>
          </div>
        )}
      </div>

      {/* Room Weekly Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DoorOpen className="w-4 h-4 text-amber-400" />
            <h4 className="font-bold text-sm">
              {isHi
                ? `${currentRoom.hindiName || currentRoom.name} का साप्ताहिक उपयोग चक्र`
                : `Weekly Utilization of ${currentRoom.name}`}
            </h4>
          </div>
          <span className="text-xs text-slate-300">
            {isHi ? 'कक्ष आवंटन विवरण' : 'Room Allotment Details'}
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

                      // Check if any cell is occupying this room
                      const cell = timetableCells.find(
                        (c) => c.day === day.key && c.periodId === period.id && c.roomId === currentRoom.id
                      );

                      if (cell) {
                        const targetClass = classes.find((c) => c.id === cell.classId);
                        const sub = subjects.find((s) => s.id === cell.subjectId);
                        const tch = teachers.find((t) => t.id === cell.teacherId);

                        return (
                          <td key={period.id} className="p-1.5 border-r border-slate-200">
                            <div className="p-2 rounded-lg bg-indigo-50/60 border border-indigo-200 text-xs">
                              <div className="font-bold text-indigo-900 truncate">
                                Class {targetClass?.grade}-{targetClass?.section}
                              </div>
                              <div className="text-[11px] font-medium text-slate-700 truncate">
                                {isHi ? sub?.hindiName : sub?.name}
                              </div>
                              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                {isHi && tch?.hindiName ? tch.hindiName : tch?.name}
                              </div>
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td key={period.id} className="p-2 border-r border-slate-200 text-center">
                          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {isHi ? 'खाली' : 'Vacant'}
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
