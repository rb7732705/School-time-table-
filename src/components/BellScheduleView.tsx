import React, { useState } from 'react';
import { PeriodDefinition } from '../types/timetable';
import { Bell, Clock, Printer, X, Image as ImageIcon, Check } from 'lucide-react';

interface BellScheduleViewProps {
  isOpen: boolean;
  onClose: () => void;
  periods: PeriodDefinition[];
  onUpdatePeriods: (periods: PeriodDefinition[]) => void;
  lang: 'hi' | 'en';
}

export const BellScheduleView: React.FC<BellScheduleViewProps> = ({
  isOpen,
  onClose,
  periods,
  onUpdatePeriods,
  lang,
}) => {
  const isHi = lang === 'hi';
  const [showOriginalImage, setShowOriginalImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPeriods, setEditedPeriods] = useState<PeriodDefinition[]>(periods);

  if (!isOpen) return null;

  const handlePeriodChange = (
    id: string,
    field: 'startTime' | 'endTime' | 'durationMinutes',
    value: string | number
  ) => {
    setEditedPeriods((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSavePeriods = () => {
    onUpdatePeriods(editedPeriods);
    setIsEditing(false);
  };

  const originalNoticePath = '/assets/aistudio/IMG-20261016-WA0006_3266070b.jpg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-3xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isHi ? 'समय विभाग चक्र (शीतकालीन विद्यालय संचालन)' : 'School Bell Timetable Schedule'}
              </h3>
              <p className="text-xs text-slate-400">
                {isHi ? 'कुल कालांश: 8 शिक्षण कालांश + प्रार्थना सभा + मध्यावकाश' : '8 Teaching Periods + Morning Assembly + Recess'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOriginalImage(!showOriginalImage)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                showOriginalImage
                  ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {showOriginalImage
                  ? (isHi ? 'सारणी देखें' : 'View Table')
                  : (isHi ? 'मूल नोटिस फोटो देखें' : 'View Original Notice Photo')}
              </span>
            </button>

            {!showOriginalImage && (
              <button
                onClick={() => {
                  if (isEditing) handleSavePeriods();
                  else setIsEditing(true);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  isEditing
                    ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {isEditing ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{isHi ? 'समय सुरक्षित करें' : 'Save Timings'}</span>
                  </>
                ) : (
                  <span>{isHi ? 'समय संपादित करें' : 'Edit Timings'}</span>
                )}
              </button>
            )}
          </div>

          <div className="text-slate-600 font-mono text-[11px]">
            {isHi ? 'समय सीमा: 09:55 AM से 04:00 PM' : 'Total duration: 09:55 AM - 04:00 PM'}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {showOriginalImage ? (
            /* Show original uploaded image */
            <div className="flex flex-col items-center justify-center p-2 bg-slate-100 rounded-xl border border-slate-200">
              <img
                src={originalNoticePath}
                alt="समय विभाग चक्र नोटिस"
                className="max-h-[60vh] object-contain rounded-lg shadow-sm border border-slate-200"
              />
              <p className="text-xs text-slate-500 mt-2 font-mono">
                टन् टन् टन्............ (शीतकालीन विद्यालय संचालन)
              </p>
            </div>
          ) : (
            /* Periods table exactly reproducing the official format */
            <div className="border border-slate-900 rounded-lg overflow-hidden shadow-2xs">
              <div className="bg-slate-900 text-white text-center py-2.5">
                <h4 className="text-base font-extrabold tracking-wide">
                  {isHi ? 'समय विभाग चक्र' : 'TIME TABLE SCHEDULE'}
                </h4>
                <p className="text-xs text-slate-300">
                  {isHi ? '(शीतकालीन विद्यालय संचालन)' : '(Winter School Session)'}
                </p>
              </div>

              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-y border-slate-900 font-bold">
                    <th className="py-2.5 px-3 border-r border-slate-900 text-center w-14">
                      {isHi ? 'क्र.सं.' : 'S.No.'}
                    </th>
                    <th className="py-2.5 px-4 border-r border-slate-900 w-44">
                      {isHi ? 'कालांश' : 'Period / Activity'}
                    </th>
                    <th className="py-2.5 px-4 border-r border-slate-900 text-center">
                      {isHi ? 'समय' : 'Timing'}
                    </th>
                    <th className="py-2.5 px-4 text-center w-28">
                      {isHi ? 'समयावधि' : 'Duration'}
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-300">
                  {(isEditing ? editedPeriods : periods).map((period, index) => {
                    const isSpecial = period.isBreak;
                    return (
                      <tr
                        key={period.id}
                        className={isSpecial ? 'bg-amber-50/60 font-semibold' : 'hover:bg-slate-50'}
                      >
                        {/* Serial Number */}
                        <td className="py-2.5 px-3 border-r border-slate-900 text-center font-bold">
                          {index + 1}.
                        </td>

                        {/* Period Name */}
                        <td className="py-2.5 px-4 border-r border-slate-900">
                          <div className="font-bold text-slate-900">
                            {isHi ? period.nameHindi : period.nameEnglish}
                          </div>
                          {!isSpecial && (
                            <div className="text-[10px] text-slate-500 font-normal">
                              {period.nameEnglish}
                            </div>
                          )}
                        </td>

                        {/* Start and End Times */}
                        <td className="py-2.5 px-4 border-r border-slate-900 text-center font-mono">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-1">
                              <input
                                type="text"
                                value={period.startTime}
                                onChange={(e) => handlePeriodChange(period.id, 'startTime', e.target.value)}
                                className="w-20 px-1 py-0.5 border border-slate-300 rounded text-center text-xs"
                              />
                              <span>-</span>
                              <input
                                type="text"
                                value={period.endTime}
                                onChange={(e) => handlePeriodChange(period.id, 'endTime', e.target.value)}
                                className="w-20 px-1 py-0.5 border border-slate-300 rounded text-center text-xs"
                              />
                            </div>
                          ) : (
                            <span className="font-semibold text-slate-800">
                              {period.type === 'warning_bell'
                                ? `प्रातः ${period.startTime} बजे`
                                : `${period.startTime} से ${period.endTime}`}
                            </span>
                          )}
                        </td>

                        {/* Duration */}
                        <td className="py-2.5 px-4 text-center font-mono font-medium">
                          {period.type === 'warning_bell' ? (
                            <span className="text-slate-400">-</span>
                          ) : isEditing ? (
                            <input
                              type="number"
                              value={period.durationMinutes}
                              onChange={(e) => handlePeriodChange(period.id, 'durationMinutes', Number(e.target.value))}
                              className="w-16 px-1 py-0.5 border border-slate-300 rounded text-center text-xs"
                            />
                          ) : (
                            <span>{period.durationMinutes} मिनिट</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="p-3 bg-slate-50 text-center border-t border-slate-900 text-xs font-semibold text-slate-700 tracking-widest font-serif">
                टन् टन् टन्............
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {isHi
              ? 'यह समय चक्र सभी 1 से 12 कक्षाओं के लिए आधिकारिक रूप से मान्य है।'
              : 'Official Bell Timing cycle for Classes 1 to 12.'}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
          >
            {isHi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
