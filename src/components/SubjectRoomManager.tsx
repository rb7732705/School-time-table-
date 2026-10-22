import React, { useState } from 'react';
import { Subject, Room } from '../types/timetable';
import { BookOpen, DoorOpen, Plus, Trash2, Edit2, X } from 'lucide-react';

interface SubjectRoomManagerProps {
  subjects: Subject[];
  rooms: Room[];
  onAddSubject: (subject: Subject) => void;
  onUpdateSubject: (subject: Subject) => void;
  onDeleteSubject: (subjectId: string) => void;
  onAddRoom: (room: Room) => void;
  onUpdateRoom: (room: Room) => void;
  onDeleteRoom: (roomId: string) => void;
  lang: 'hi' | 'en';
}

export const SubjectRoomManager: React.FC<SubjectRoomManagerProps> = ({
  subjects,
  rooms,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
  onAddRoom,
  onUpdateRoom,
  onDeleteRoom,
  lang,
}) => {
  const isHi = lang === 'hi';
  const [activeSubTab, setActiveSubTab] = useState<'subjects' | 'rooms'>('subjects');

  // Subject Modal States
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subName, setSubName] = useState('');
  const [subHindiName, setSubHindiName] = useState('');
  const [subCode, setSubCode] = useState('');
  const [subColor, setSubColor] = useState('#2563EB');
  const [subRoomType, setSubRoomType] = useState<Subject['requiredRoomType']>('classroom');

  // Room Modal States
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [rmName, setRmName] = useState('');
  const [rmHindiName, setRmHindiName] = useState('');
  const [rmType, setRmType] = useState<Room['type']>('classroom');
  const [rmCapacity, setRmCapacity] = useState<number>(45);
  const [rmFloor, setRmFloor] = useState('Ground Floor');

  const palette = [
    '#DC2626', '#2563EB', '#D97706', '#059669', '#7C3AED',
    '#EA580C', '#0284C7', '#0D9488', '#16A34A', '#4F46E5',
    '#CA8A04', '#DB2777', '#475569',
  ];

  const handleOpenAddSubject = () => {
    setEditingSubject(null);
    setSubName('');
    setSubHindiName('');
    setSubCode('');
    setSubColor(palette[Math.floor(Math.random() * palette.length)]);
    setSubRoomType('classroom');
    setIsSubjectModalOpen(true);
  };

  const handleOpenEditSubject = (sub: Subject) => {
    setEditingSubject(sub);
    setSubName(sub.name);
    setSubHindiName(sub.hindiName);
    setSubCode(sub.code);
    setSubColor(sub.color);
    setSubRoomType(sub.requiredRoomType || 'classroom');
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return;

    const data: Subject = {
      id: editingSubject ? editingSubject.id : `sub-${Date.now()}`,
      name: subName.trim(),
      hindiName: subHindiName.trim() || subName.trim(),
      code: subCode.trim().toUpperCase() || subName.slice(0, 4).toUpperCase(),
      color: subColor,
      requiredRoomType: subRoomType,
    };

    if (editingSubject) {
      onUpdateSubject(data);
    } else {
      onAddSubject(data);
    }
    setIsSubjectModalOpen(false);
  };

  const handleOpenAddRoom = () => {
    setEditingRoom(null);
    setRmName('');
    setRmHindiName('');
    setRmType('classroom');
    setRmCapacity(45);
    setRmFloor('Ground Floor');
    setIsRoomModalOpen(true);
  };

  const handleOpenEditRoom = (rm: Room) => {
    setEditingRoom(rm);
    setRmName(rm.name);
    setRmHindiName(rm.hindiName);
    setRmType(rm.type);
    setRmCapacity(rm.capacity);
    setRmFloor(rm.floor);
    setIsRoomModalOpen(true);
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rmName.trim()) return;

    const data: Room = {
      id: editingRoom ? editingRoom.id : `rm-${Date.now()}`,
      name: rmName.trim(),
      hindiName: rmHindiName.trim() || rmName.trim(),
      type: rmType,
      capacity: Number(rmCapacity) || 45,
      floor: rmFloor,
    };

    if (editingRoom) {
      onUpdateRoom(data);
    } else {
      onAddRoom(data);
    }
    setIsRoomModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Sub tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('subjects')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeSubTab === 'subjects'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isHi ? `विषय सूची (${subjects.length})` : `Subjects (${subjects.length})`}</span>
          </button>
          <button
            onClick={() => setActiveSubTab('rooms')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeSubTab === 'rooms'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>{isHi ? `कक्ष एवं प्रयोगशालाएं (${rooms.length})` : `Rooms & Labs (${rooms.length})`}</span>
          </button>
        </div>

        {activeSubTab === 'subjects' ? (
          <button
            onClick={handleOpenAddSubject}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isHi ? 'नया विषय जोड़ें' : 'Add Subject'}</span>
          </button>
        ) : (
          <button
            onClick={handleOpenAddRoom}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isHi ? 'नया कक्ष / लैब जोड़ें' : 'Add Room'}</span>
          </button>
        )}
      </div>

      {/* Subjects View */}
      {activeSubTab === 'subjects' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-4 h-4 rounded-full shrink-0 shadow-2xs"
                  style={{ backgroundColor: sub.color }}
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs truncate">
                    {isHi ? sub.hindiName : sub.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    {sub.name} · <span className="font-mono">{sub.code}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleOpenEditSubject(sub)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(isHi ? `क्या आप ${sub.name} को हटाना चाहते हैं?` : `Delete subject ${sub.name}?`)) {
                      onDeleteSubject(sub.id);
                    }
                  }}
                  className="p-1 text-slate-400 hover:text-red-600 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rooms View */}
      {activeSubTab === 'rooms' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {rooms.map((rm) => (
            <div
              key={rm.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                  <DoorOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs truncate">
                    {isHi ? rm.hindiName : rm.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    {rm.floor} · {rm.capacity} {isHi ? 'विद्यार्थी' : 'cap'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleOpenEditRoom(rm)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(isHi ? `क्या आप ${rm.name} को हटाना चाहते हैं?` : `Delete room ${rm.name}?`)) {
                      onDeleteRoom(rm.id);
                    }
                  }}
                  className="p-1 text-slate-400 hover:text-red-600 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subject Modal */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingSubject ? (isHi ? 'विषय संपादित करें' : 'Edit Subject') : (isHi ? 'नया विषय जोड़ें' : 'Add Subject')}
              </h3>
              <button onClick={() => setIsSubjectModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveSubject} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHi ? 'विषय का नाम (English) *' : 'Subject Name (English) *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathematics"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHi ? 'विषय का नाम (हिंदी में)' : 'Hindi Name'}
                </label>
                <input
                  type="text"
                  placeholder="उदा. गणित"
                  value={subHindiName}
                  onChange={(e) => setSubHindiName(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHi ? 'शॉर्ट कोड' : 'Subject Code'}
                  </label>
                  <input
                    type="text"
                    placeholder="MATH"
                    value={subCode}
                    onChange={(e) => setSubCode(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 uppercase font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHi ? 'विशिष्ट कक्ष आवश्यकता' : 'Required Room'}
                  </label>
                  <select
                    value={subRoomType}
                    onChange={(e) => setSubRoomType(e.target.value as Subject['requiredRoomType'])}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
                  >
                    <option value="classroom">Classroom</option>
                    <option value="lab">Science Lab</option>
                    <option value="computer">Computer Lab</option>
                    <option value="ground">Sports Ground</option>
                    <option value="library">Library</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHi ? 'विषय का रंग (Color Tag)' : 'Color Tag'}
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {palette.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSubColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        subColor === c ? 'scale-125 ring-2 ring-slate-900 ring-offset-1' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-md shadow-xs"
                >
                  {isHi ? 'सुरक्षित करें' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Room Modal */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingRoom ? (isHi ? 'कक्ष संपादित करें' : 'Edit Room') : (isHi ? 'नया कक्ष जोड़ें' : 'Add Room')}
              </h3>
              <button onClick={() => setIsRoomModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveRoom} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHi ? 'कक्ष का नाम (English) *' : 'Room Name (English) *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Room 105 or Chemistry Lab"
                  value={rmName}
                  onChange={(e) => setRmName(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHi ? 'कक्ष का नाम (हिंदी में)' : 'Hindi Name'}
                </label>
                <input
                  type="text"
                  placeholder="उदा. कक्ष क्र. 105 या रसायन प्रयोगशाला"
                  value={rmHindiName}
                  onChange={(e) => setRmHindiName(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHi ? 'कक्ष का प्रकार' : 'Room Type'}
                  </label>
                  <select
                    value={rmType}
                    onChange={(e) => setRmType(e.target.value as Room['type'])}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
                  >
                    <option value="classroom">Classroom (कक्षा कक्ष)</option>
                    <option value="lab">Science Lab (प्रयोगशाला)</option>
                    <option value="computer">Computer Lab (कंप्यूटर कक्ष)</option>
                    <option value="library">Library (पुस्तकालय)</option>
                    <option value="ground">Playground (खेल मैदान)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHi ? 'विद्यार्थी क्षमता' : 'Capacity'}
                  </label>
                  <input
                    type="number"
                    value={rmCapacity}
                    onChange={(e) => setRmCapacity(Number(e.target.value))}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHi ? 'मंजिल / ब्लॉक' : 'Floor / Wing'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ground Floor, 1st Floor"
                  value={rmFloor}
                  onChange={(e) => setRmFloor(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRoomModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-md shadow-xs"
                >
                  {isHi ? 'सुरक्षित करें' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
