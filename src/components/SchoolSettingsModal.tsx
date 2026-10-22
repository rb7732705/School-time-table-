import React, { useState } from 'react';
import { SchoolProfile } from '../types/timetable';
import { exportAllDataAsJSON, resetAllData } from '../utils/storage';
import { Settings, Download, Upload, RotateCcw, X, Building, Check } from 'lucide-react';

interface SchoolSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: SchoolProfile;
  onUpdateProfile: (profile: SchoolProfile) => void;
  lang: 'hi' | 'en';
}

export const SchoolSettingsModal: React.FC<SchoolSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  lang,
}) => {
  const isHi = lang === 'hi';
  const [schoolHindiName, setSchoolHindiName] = useState(profile.schoolHindiName);
  const [schoolName, setSchoolName] = useState(profile.schoolName);
  const [principalName, setPrincipalName] = useState(profile.principalName);
  const [udiseCode, setUdiseCode] = useState(profile.udiseCode);
  const [session, setSession] = useState(profile.session);
  const [address, setAddress] = useState(profile.address);
  const [scheduleType, setScheduleType] = useState(profile.scheduleType);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      schoolHindiName,
      schoolName,
      principalName,
      udiseCode,
      session,
      address,
      scheduleType,
    });
    onClose();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.profile) {
            localStorage.setItem('shala_profile_v1', JSON.stringify(parsed.profile));
          }
          if (parsed.periods) {
            localStorage.setItem('shala_periods_v1', JSON.stringify(parsed.periods));
          }
          if (parsed.teachers) {
            localStorage.setItem('shala_teachers_v1', JSON.stringify(parsed.teachers));
          }
          if (parsed.subjects) {
            localStorage.setItem('shala_subjects_v1', JSON.stringify(parsed.subjects));
          }
          if (parsed.rooms) {
            localStorage.setItem('shala_rooms_v1', JSON.stringify(parsed.rooms));
          }
          if (parsed.classes) {
            localStorage.setItem('shala_classes_v1', JSON.stringify(parsed.classes));
          }
          if (parsed.timetable) {
            localStorage.setItem('shala_timetable_v1', JSON.stringify(parsed.timetable));
          }
          alert(isHi ? 'बैकअप सफलतापूर्वक लोड हो गया है।' : 'Backup imported successfully.');
          window.location.reload();
        } catch (err) {
          alert(isHi ? 'अमान्य बैकअप फाइल!' : 'Invalid backup file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden my-6">
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-base">
              {isHi ? 'विद्यालय विवरण एवं सेटिंग्स' : 'School Profile & Settings'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isHi ? 'विद्यालय का नाम (हिंदी में) *' : 'School Name (Hindi) *'}
            </label>
            <input
              type="text"
              required
              value={schoolHindiName}
              onChange={(e) => setSchoolHindiName(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isHi ? 'विद्यालय का नाम (English)' : 'School Name (English)'}
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isHi ? 'संस्था प्रधान / प्रिंसिपल का नाम' : 'Principal Name'}
              </label>
              <input
                type="text"
                value={principalName}
                onChange={(e) => setPrincipalName(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isHi ? 'UDISE कोड / मान्यता क्र.' : 'UDISE Code'}
              </label>
              <input
                type="text"
                value={udiseCode}
                onChange={(e) => setUdiseCode(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isHi ? 'शैक्षणिक सत्र' : 'Academic Session'}
              </label>
              <input
                type="text"
                value={session}
                onChange={(e) => setSession(e.target.value)}
                placeholder="2026-2027"
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isHi ? 'संचालन समय प्रकार' : 'Schedule Type'}
              </label>
              <select
                value={scheduleType}
                onChange={(e) => setScheduleType(e.target.value as 'winter' | 'summer' | 'custom')}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
              >
                <option value="winter">शीतकालीन (Winter: 09:55 AM - 04:00 PM)</option>
                <option value="summer">ग्रीष्मकालीन (Summer: 07:30 AM - 01:30 PM)</option>
                <option value="custom">कस्टम समय (Custom Timing)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isHi ? 'विद्यालय का पता' : 'School Address'}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            />
          </div>

          {/* Backup & Restore section */}
          <div className="pt-3 border-t border-slate-200">
            <span className="block text-xs font-semibold text-slate-700 mb-2">
              {isHi ? 'डेटा बैकअप एवं रीसेट (Backup & Reset):' : 'Data Management:'}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={exportAllDataAsJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isHi ? 'बैकअप डाउनलोड करें (JSON)' : 'Export Backup'}</span>
              </button>

              <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{isHi ? 'बैकअप लोड करें' : 'Import Backup'}</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  if (confirm(isHi ? 'क्या आप सारा डेटा रीसेट करना चाहते हैं?' : 'Reset all data to defaults?')) {
                    resetAllData();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isHi ? 'रीसेट करें' : 'Reset'}</span>
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md"
            >
              {isHi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-md shadow-xs"
            >
              {isHi ? 'सुरक्षित करें' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
