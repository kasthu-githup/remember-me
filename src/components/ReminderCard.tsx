import React, { useState } from 'react';
import {
  Check,
  Clock,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  TimerReset,
  Tag,
  Repeat,
  AlertTriangle,
  Briefcase,
  User,
  Heart,
  DollarSign,
  GraduationCap,
  Users,
} from 'lucide-react';
import { Reminder, Category } from '../types';
import { useReminders } from '../context/RemindersContext';
import { getKolkataDateString, isOverdueKolkata, formatKolkataDisplay } from '../utils/timezone';

interface ReminderCardProps {
  reminder: Reminder;
  onEdit: (reminder: Reminder) => void;
  viewMode?: 'grid' | 'list';
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onEdit,
  viewMode = 'grid',
}) => {
  const { toggleReminderComplete, deleteExistingReminder, snoozeReminder } = useReminders();
  const [menuOpen, setMenuOpen] = useState(false);
  const [snoozeOpen, setSnoozeOpen] = useState(false);

  const todayStr = getKolkataDateString();
  const isOverdue = !reminder.completed && isOverdueKolkata(reminder.dueDate, reminder.dueTime);
  const isToday = reminder.dueDate === todayStr;

  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case 'work':
        return Briefcase;
      case 'personal':
        return User;
      case 'health':
        return Heart;
      case 'finance':
        return DollarSign;
      case 'study':
        return GraduationCap;
      case 'family':
        return Users;
      default:
        return Tag;
    }
  };

  const CategoryIcon = getCategoryIcon(reminder.category);

  return (
    <div
      className={`group relative rounded-2xl transition-all duration-200 border ${
        reminder.completed
          ? 'bg-[#151515] border-[#D4AF37]/15 opacity-65'
          : isOverdue
          ? 'bg-[#181212] border-red-500/50 hover:border-red-400 hover:shadow-lg hover:shadow-red-900/20'
          : 'bg-[#191919] hover:bg-[#202020] border-[#D4AF37]/25 hover:border-[#D4AF37]/60 shadow-md hover:shadow-xl hover:shadow-[#D4AF37]/10 hover:-translate-y-0.5'
      } ${
        viewMode === 'list'
          ? 'p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'
          : 'p-4 sm:p-5 flex flex-col justify-between'
      }`}
    >
      {/* Content */}
      <div className={`flex items-start gap-3 w-full ${viewMode === 'list' ? 'sm:flex-1' : ''}`}>
        {/* Checkbox with Gold Tick */}
        <button
          onClick={() => toggleReminderComplete(reminder.id)}
          className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 border ${
            reminder.completed
              ? 'bg-[#D4AF37] border-[#F5D76E] text-black shadow-md shadow-[#D4AF37]/30'
              : 'border-[#D4AF37]/40 hover:border-[#F5D76E] bg-[#121212]'
          }`}
          aria-label={reminder.completed ? 'Mark uncompleted' : 'Mark completed'}
        >
          {reminder.completed && <Check className="w-4 h-4 stroke-[3] text-black" />}
        </button>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            {/* Priority Pill */}
            <span
              className={`text-[12px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                reminder.priority === 'high'
                  ? 'bg-red-950/70 text-red-300 border border-red-700/50'
                  : reminder.priority === 'medium'
                  ? 'bg-[#D4AF37]/20 text-[#F5D76E] border border-[#D4AF37]/40 font-extrabold'
                  : 'bg-[#222222] text-[#B8B8B8] border border-[#333333]'
              }`}
            >
              {reminder.priority}
            </span>

            {/* Category Pill */}
            <span className="inline-flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded-md bg-[#141414] text-[#D4AF37] capitalize border border-[#D4AF37]/20">
              <CategoryIcon className="w-3 h-3 text-[#D4AF37]" />
              <span>{reminder.category}</span>
            </span>

            {/* Overdue Badge */}
            {isOverdue && (
              <span className="inline-flex items-center gap-1 text-[12px] font-bold px-2 py-0.5 rounded-md bg-red-600 text-white animate-pulse">
                <AlertTriangle className="w-3 h-3" /> Overdue
              </span>
            )}

            {/* Recurrence Badge */}
            {reminder.recurrence && reminder.recurrence !== 'none' && (
              <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#B8B8B8]">
                <Repeat className="w-3 h-3 text-[#D4AF37]" />
                <span className="capitalize">{reminder.recurrence}</span>
              </span>
            )}
          </div>

          <h4
            className={`text-[17px] font-semibold text-white leading-snug break-words ${
              reminder.completed ? 'line-through text-[#7A7A7A]' : ''
            }`}
          >
            {reminder.title}
          </h4>

          {reminder.description && (
            <p
              className={`text-[14px] mt-1 text-[#B8B8B8] line-clamp-2 ${
                reminder.completed ? 'line-through text-[#666666]' : ''
              }`}
            >
              {reminder.description}
            </p>
          )}

          {/* Tags */}
          {reminder.tags && reminder.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {reminder.tags.map((t) => (
                <span
                  key={t}
                  className="text-[12px] text-[#F5D76E] bg-[#121212] border border-[#D4AF37]/25 px-1.5 py-0.5 rounded font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Meta & Actions */}
      <div
        className={`flex items-center justify-between gap-3 w-full ${
          viewMode === 'list'
            ? 'sm:w-auto sm:justify-end sm:border-l sm:border-[#D4AF37]/20 sm:pl-4 mt-2 sm:mt-0'
            : 'pt-3 mt-3 border-t border-[#D4AF37]/15'
        }`}
      >
        {/* Date and Time Badge (IST) */}
        <div className="flex items-center gap-2 text-[12px] font-semibold text-[#B8B8B8]">
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg ${
              isToday
                ? 'bg-[#D4AF37]/20 text-[#F5D76E] border border-[#D4AF37]/40'
                : 'bg-[#151515] text-[#B8B8B8] border border-[#2B2B2B]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{isToday ? 'Today' : reminder.dueDate}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#151515] text-[#B8B8B8] border border-[#2B2B2B]">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{reminder.dueTime} IST</span>
          </div>
        </div>

        {/* Card Actions Menu */}
        <div className="relative">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(reminder)}
              className="p-1.5 rounded-lg text-[#B8B8B8] hover:text-[#F5D76E] hover:bg-[#222222] transition-colors"
              title="Edit Reminder"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-[#B8B8B8] hover:text-white hover:bg-[#222222] transition-colors"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Context Menu Dropdown */}
          {menuOpen && (
            <div
              className="absolute right-0 bottom-full mb-1 sm:bottom-auto sm:top-full sm:mt-1 w-36 rounded-xl bg-[#161616] shadow-2xl border border-[#D4AF37]/30 p-1.5 z-20 animate-in fade-in zoom-in-95 duration-150"
              onMouseLeave={() => {
                setMenuOpen(false);
                setSnoozeOpen(false);
              }}
            >
              {!reminder.completed && (
                <div className="relative">
                  <button
                    onClick={() => setSnoozeOpen(!snoozeOpen)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-[14px] font-medium text-white rounded-lg hover:bg-[#222222]"
                  >
                    <span className="flex items-center gap-2">
                      <TimerReset className="w-3.5 h-3.5 text-[#D4AF37]" /> Snooze
                    </span>
                    <span>›</span>
                  </button>

                  {snoozeOpen && (
                    <div className="absolute right-full top-0 mr-1 w-28 rounded-xl bg-[#1A1A1A] shadow-xl border border-[#D4AF37]/30 p-1">
                      <button
                        onClick={() => {
                          snoozeReminder(reminder.id, 15);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-2 py-1 text-[12px] text-[#B8B8B8] hover:text-white hover:bg-[#252525] rounded"
                      >
                        +15 mins
                      </button>
                      <button
                        onClick={() => {
                          snoozeReminder(reminder.id, 60);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-2 py-1 text-[12px] text-[#B8B8B8] hover:text-white hover:bg-[#252525] rounded"
                      >
                        +1 hour
                      </button>
                      <button
                        onClick={() => {
                          snoozeReminder(reminder.id, 1440);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-2 py-1 text-[12px] text-[#B8B8B8] hover:text-white hover:bg-[#252525] rounded"
                      >
                        +1 day
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => {
                  deleteExistingReminder(reminder.id);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[14px] font-medium text-red-400 rounded-lg hover:bg-red-950/40"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
