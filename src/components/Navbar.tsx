import React from 'react';
import { SchoolProfile } from '../types/timetable';
import { Printer, Bell, Settings, Languages, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  profile: SchoolProfile;
  lang: 'hi' | 'en';
  activeTab: string;
  onTabChange: (tab: string) => void;
  onToggleLang: () => void;
  onOpenBellSchedule: () => void;
  onOpenSettings: () => void;
  onOpenPrint: () => void;
  totalConflicts: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  lang,
  activeTab,
  onTabChange,
  onToggleLang,
  onOpenBellSchedule,
  onOpenSettings,
  onOpenPrint,
  totalConflicts,
}) => {
  const isHi = lang === 'hi';

  const navTabs = [
    { id: 'class', labelHi: 'कक्षा समय सारणी', labelEn: 'Class Schedule' },
    { id: 'master', labelHi: 'सम्पूर्ण मास्टर ग्रिड', labelEn: 'Master Grid' },
    { id: 'teacher', labelHi: 'शिक्षक समय सारणी', labelEn: 'Teacher Schedule' },
    { id: 'room', labelHi: 'कक्ष आवंटन', labelEn: 'Rooms' },
    { id: 'substitute', labelHi: 'प्रतिनियुक्ति (Proxy)', labelEn: 'Substitution' },
    { id: 'manage-teachers', labelHi: 'शिक्षक प्रबंधन', labelEn: 'Teachers' },
    { id: 'manage-subjects', labelHi: 'विषय व कक्ष', labelEn: 'Subjects & Rooms' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Brand & School Details */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-indigo-700 text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
              शा
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base md:text-lg tracking-tight whitespace-nowrap">
                  {isHi ? 'समय विभाग चक्र' : 'Shala Time Table'}
                </span>
                <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-medium px-2 py-0.5 rounded-sm">
                  {profile.session}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-[280px] sm:max-w-md">
                {isHi ? profile.schoolHindiName : profile.schoolName}
              </p>
            </div>
          </div>

          {/* Quick Actions (Right zone) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Conflict Alert indicator if any conflicts */}
            {totalConflicts > 0 && (
              <button
                onClick={() => onTabChange('master')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-300 rounded-md hover:bg-amber-100 transition-colors"
                title={`${totalConflicts} conflicts detected`}
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="hidden sm:inline">
                  {totalConflicts} {isHi ? 'टकराव मिले' : 'Conflicts'}
                </span>
                <span className="sm:hidden font-mono">{totalConflicts}</span>
              </button>
            )}

            {/* Bell Schedule button */}
            <button
              onClick={onOpenBellSchedule}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
              title={isHi ? 'घंटी समय विभाग चक्र देखें' : 'View Bell Schedule'}
            >
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">{isHi ? 'घंटी समय चक्र' : 'Bell Schedule'}</span>
            </button>

            {/* Print Timetable button */}
            <button
              onClick={onOpenPrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-md shadow-xs transition-colors whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isHi ? 'प्रिंट टाइम टेबल' : 'Print Timetable'}</span>
            </button>

            {/* School Profile Settings */}
            <button
              onClick={onOpenSettings}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              title={isHi ? 'विद्यालय सेटिंग्स' : 'School Settings'}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Language Switch */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md transition-colors"
              title={isHi ? 'Switch to English' : 'हिंदी में बदलें'}
            >
              <Languages className="w-3.5 h-3.5 text-slate-500" />
              <span>{isHi ? 'English' : 'हिंदी'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nav Tabs Bar */}
      <div className="border-t border-slate-100 bg-slate-50/60 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-3 py-1.5">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {isHi ? tab.labelHi : tab.labelEn}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
