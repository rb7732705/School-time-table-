import React, { useState } from 'react';
import { Teacher, Subject } from '../types/timetable';
import { TeacherAvatar } from './TeacherAvatar';
import {
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Camera,
  X,
  Phone,
  BookOpen,
  Award,
  Check,
} from 'lucide-react';

interface TeacherManagerProps {
  teachers: Teacher[];
  subjects: Subject[];
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (teacherId: string) => void;
  lang: 'hi' | 'en';
}

export const TeacherManager: React.FC<TeacherManagerProps> = ({
  teachers,
  subjects,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  lang,
}) => {
  const isHi = lang === 'hi';
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [hindiName, setHindiName] = useState('');
  const [designation, setDesignation] = useState('PGT Teacher');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [phone, setPhone] = useState('');
  const [maxPeriods, setMaxPeriods] = useState<number>(6);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [color, setColor] = useState('#2563EB');

  const colorOptions = [
    '#2563EB', '#DC2626', '#059669', '#D97706', '#7C3AED',
    '#0D9488', '#EA580C', '#4F46E5', '#DB2777', '#0F172A',
  ];

  const designations = [
    'Principal',
    'Vice Principal',
    'PGT Physics',
    'PGT Chemistry',
    'PGT Biology',
    'PGT Maths',
    'PGT Hindi',
    'PGT English',
    'TGT Science',
    'TGT Mathematics',
    'TGT Social Science',
    'TGT Sanskrit',
    'TGT English',
    'TGT Hindi',
    'PRT Primary Teacher',
    'PTI / Physical Ed.',
    'Computer Teacher (ICT)',
    'Art & Craft Teacher',
    'Librarian',
  ];

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setName('');
    setHindiName('');
    setDesignation('PGT Teacher');
    setGender('male');
    setPhone('');
    setMaxPeriods(6);
    setSelectedSubjects([]);
    setPhotoUrl('');
    setColor(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tch: Teacher) => {
    setEditingTeacher(tch);
    setName(tch.name);
    setHindiName(tch.hindiName || '');
    setDesignation(tch.designation);
    setGender(tch.gender);
    setPhone(tch.phone || '');
    setMaxPeriods(tch.maxPeriodsPerDay);
    setSelectedSubjects(tch.subjects);
    setPhotoUrl(tch.photoUrl || '');
    setColor(tch.color || '#2563EB');
    setIsModalOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleSubject = (subId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subId) ? prev.filter((id) => id !== subId) : [...prev, subId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert(isHi ? 'कृपया शिक्षक का नाम दर्ज करें' : 'Please enter teacher name');
      return;
    }

    const teacherData: Teacher = {
      id: editingTeacher ? editingTeacher.id : `tch-${Date.now()}`,
      name: name.trim(),
      hindiName: hindiName.trim() || undefined,
      designation,
      gender,
      phone: phone.trim() || undefined,
      maxPeriodsPerDay: Number(maxPeriods) || 6,
      subjects: selectedSubjects,
      photoUrl: photoUrl || undefined,
      color,
    };

    if (editingTeacher) {
      onUpdateTeacher(teacherData);
    } else {
      onAddTeacher(teacherData);
    }

    setIsModalOpen(false);
  };

  const filteredTeachers = teachers.filter((tch) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchName = tch.name.toLowerCase().includes(q) || (tch.hindiName && tch.hindiName.includes(q));
    const matchDesig = tch.designation.toLowerCase().includes(q);
    return matchName || matchDesig;
  });

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isHi ? 'शिक्षक का नाम खोजें...' : 'Search teacher...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 w-48 sm:w-64"
            />
          </div>
          <span className="text-xs text-slate-500">
            {isHi ? `कुल शिक्षक: ${teachers.length}` : `Total: ${teachers.length}`}
          </span>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>{isHi ? 'नया शिक्षक जोड़ें' : 'Add Teacher'}</span>
        </button>
      </div>

      {/* Teachers Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredTeachers.map((tch) => {
          const tchSubjects = subjects.filter((s) => tch.subjects.includes(s.id));
          return (
            <div
              key={tch.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <TeacherAvatar teacher={tch} size="lg" showBadge />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {isHi && tch.hindiName ? tch.hindiName : tch.name}
                      </h4>
                      <p className="text-xs text-indigo-700 font-medium">{tch.designation}</p>
                      {isHi && tch.hindiName && (
                        <p className="text-[11px] text-slate-400">{tch.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(tch)}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                      title={isHi ? 'संपादित करें' : 'Edit'}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(isHi ? `क्या आप ${tch.name} को हटाना चाहते हैं?` : `Delete ${tch.name}?`)) {
                          onDeleteTeacher(tch.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title={isHi ? 'हटाएं' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subjects Badges */}
                <div className="mb-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    {isHi ? 'पढ़ाए जाने वाले विषय:' : 'Subjects:'}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {tchSubjects.length > 0 ? (
                      tchSubjects.map((s) => (
                        <span
                          key={s.id}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: `${s.color}15`,
                            color: s.color,
                          }}
                        >
                          {isHi ? s.hindiName : s.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">
                        {isHi ? 'कोई विषय आवंटित नहीं' : 'No subjects assigned'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Meta stats */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono">
                  {tch.phone || 'फोन: -'}
                </span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                  {isHi ? `अधिकतम: ${tch.maxPeriodsPerDay} कालांश/दिन` : `Max: ${tch.maxPeriodsPerDay} per day`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden my-6">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingTeacher
                  ? (isHi ? 'शिक्षक विवरण संपादित करें' : 'Edit Teacher Profile')
                  : (isHi ? 'नया शिक्षक जोड़ें' : 'Add New Teacher')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Photo Upload & Preview */}
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="relative">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Teacher"
                      className="w-16 h-16 rounded-full object-cover border border-slate-300"
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-xl"
                      style={{ backgroundColor: color }}
                    >
                      {name ? name[0].toUpperCase() : 'T'}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHi ? 'शिक्षक की फोटो (Photo Upload)' : 'Teacher Photo'}
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-md text-xs font-medium text-slate-700 cursor-pointer shadow-2xs">
                    <Camera className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isHi ? 'फोटो चुनें (Browse Photo)' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="text-xs text-red-600 hover:underline block mt-1"
                    >
                      {isHi ? 'फोटो हटाएं' : 'Remove Photo'}
                    </button>
                  )}
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {isHi ? 'पासपोर्ट साइज या सामान्य फोटो अपलोड करें' : 'PNG or JPG image supported'}
                  </p>
                </div>
              </div>

              {/* Name (English & Hindi) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHi ? 'शिक्षक का नाम (English) *' : 'Teacher Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sh. Rajesh Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHi ? 'शिक्षक का नाम (हिंदी में)' : 'Hindi Name'}
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. श्री राजेश वर्मा"
                    value={hindiName}
                    onChange={(e) => setHindiName(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Designation & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHi ? 'पदनाम (Designation)' : 'Designation'}
                  </label>
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600 focus:outline-none bg-white"
                  >
                    {designations.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHi ? 'मोबाइल नंबर' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    placeholder="94140XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Max Periods per day */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHi ? 'प्रतिदिन अधिकतम कालांश' : 'Max Periods Per Day'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={maxPeriods}
                    onChange={(e) => setMaxPeriods(Number(e.target.value))}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHi ? 'कलर कोड (Visual Tag)' : 'Color Tag'}
                  </label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {colorOptions.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          color === c ? 'scale-125 ring-2 ring-slate-900 ring-offset-1' : ''
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Subjects Specialization */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  {isHi ? 'शिक्षक द्वारा पढ़ाए जाने वाले विषय (Subjects Taught):' : 'Subjects Specialization:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
                  {subjects.map((sub) => {
                    const isChecked = selectedSubjects.includes(sub.id);
                    return (
                      <label
                        key={sub.id}
                        className={`flex items-center gap-2 p-1.5 rounded cursor-pointer text-xs transition-colors ${
                          isChecked ? 'bg-indigo-50 text-indigo-900 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSubject(sub.id)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="truncate">{isHi ? sub.hindiName : sub.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-md shadow-xs"
                >
                  {isHi ? 'सुरक्षित करें' : 'Save Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
