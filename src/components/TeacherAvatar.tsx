import React from 'react';
import { Teacher } from '../types/timetable';
import { User } from 'lucide-react';

interface TeacherAvatarProps {
  teacher?: Teacher;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBadge?: boolean;
}

export const TeacherAvatar: React.FC<TeacherAvatarProps> = ({
  teacher,
  size = 'md',
  className = '',
  showBadge = false,
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = (name?: string) => {
    if (!name) return 'टी';
    const parts = name.replace(/^(Dr\.|Sh\.|Smt\.|Ms\.|Shri|Shrimati|डॉ\.|श्री|श्रीमती)\s+/i, '').trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (name[0] || 'T').toUpperCase();
  };

  if (!teacher) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-medium shrink-0 ${className}`}
      >
        <User className="w-1/2 h-1/2" />
      </div>
    );
  }

  return (
    <div className="relative inline-block shrink-0">
      {teacher.photoUrl ? (
        <img
          src={teacher.photoUrl}
          alt={teacher.name}
          referrerPolicy="no-referrer"
          className={`${sizeClasses[size]} rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs ${className}`}
          onError={(e) => {
            // Fallback gracefully on broken URL
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.parentElement) {
              const fallback = document.createElement('div');
              fallback.className = `${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white shadow-xs`;
              fallback.style.backgroundColor = teacher.color || '#3B82F6';
              fallback.innerText = getInitials(teacher.name);
              target.parentElement.appendChild(fallback);
            }
          }}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white shadow-xs ${className}`}
          style={{ backgroundColor: teacher.color || '#3B82F6' }}
          title={teacher.name}
        >
          {getInitials(teacher.name)}
        </div>
      )}

      {showBadge && teacher.isAbsentToday && (
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-500 border-2 border-white rounded-full"
          title="आज अवकाश पर हैं (Absent Today)"
        />
      )}
    </div>
  );
};
