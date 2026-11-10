import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Sparkles,
} from 'lucide-react';
import { Reminder } from '../types';
import { useReminders } from '../context/RemindersContext';
import { ReminderCard } from '../components/ReminderCard';
import { getKolkataDate, getKolkataDateString } from '../utils/timezone';

interface CalendarPageProps {
  onOpenCreateModalWithDate: (dateStr: string) => void;
  onEditReminder: (reminder: Reminder) => void;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({
  onOpenCreateModalWithDate,
  onEditReminder,
}) => {
  const { reminders } = useReminders();

  const [activeDate, setActiveDate] = useState(() => getKolkataDate());
  const [selectedDayStr, setSelectedDayStr] = useState(() => getKolkataDateString());

  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();

  const monthName = activeDate.toLocaleString('default', { month: 'long' });

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setActiveDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setActiveDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const now = getKolkataDate();
    setActiveDate(now);
    setSelectedDayStr(getKolkataDateString(now));
  };

  const weekDayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Map of reminders grouped by date (YYYY-MM-DD)
  const remindersByDate = useMemo(() => {
    const map = new Map<string, Reminder[]>();
    reminders.forEach((r) => {
      const existing = map.get(r.dueDate) || [];
      existing.push(r);
      map.set(r.dueDate, existing);
    });
    return map;
  }, [reminders]);

  const selectedDayReminders = useMemo(() => {
    return remindersByDate.get(selectedDayStr) || [];
  }, [remindersByDate, selectedDayStr]);

  const todayStr = getKolkataDateString();

  const calendarCells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= totalDays; day++) {
    calendarCells.push(day);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-[26px] font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Monthly Calendar</span>
            <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#F5D76E] border border-[#D4AF37]/40">
              {monthName} {year} (IST)
            </span>
          </h1>
          <p className="text-[14px] text-[#B8B8B8] mt-1">
            Visual roadmap of your upcoming deadlines and schedules in Asia/Kolkata
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] text-[#F5D76E] font-bold text-[14px] border border-[#D4AF37]/35 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center bg-[#151515] p-1 rounded-xl border border-[#D4AF37]/30">
            <button
              onClick={prevMonth}
              className="p-1 rounded-lg text-[#B8B8B8] hover:text-white hover:bg-[#252525]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-[14px] font-bold text-white">
              {monthName.substring(0, 3)} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 rounded-lg text-[#B8B8B8] hover:text-white hover:bg-[#252525]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => onOpenCreateModalWithDate(selectedDayStr)}
            className="py-2 px-3.5 rounded-xl btn-gold text-black font-bold text-[14px] shadow-md shadow-[#D4AF37]/25 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add to Day</span>
          </button>
        </div>
      </div>

      {/* Grid: 2 Cols Calendar Grid on Left, Day Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Full Month Calendar Grid */}
        <div className="lg:col-span-2 rounded-2xl bg-[#191919] p-4 sm:p-6 border border-[#D4AF37]/25 shadow-md">
          {/* Day of Week Row */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center pb-3 border-b border-[#D4AF37]/20">
            {weekDayLabels.map((w, idx) => (
              <span
                key={idx}
                className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider"
              >
                {w}
              </span>
            ))}
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-3">
            {calendarCells.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`blank-${idx}`}
                    className="min-h-[70px] sm:min-h-[90px] rounded-xl bg-[#141414] opacity-25"
                  />
                );
              }

              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = dateStr === selectedDayStr;
              const isCurrentDay = dateStr === todayStr;
              const dayTasks = remindersByDate.get(dateStr) || [];
              const pendingCount = dayTasks.filter((t) => !t.completed).length;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDayStr(dateStr)}
                  className={`min-h-[70px] sm:min-h-[90px] p-2 rounded-xl transition-all cursor-pointer flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-[#222222] border-[#F5D76E] shadow-lg ring-1 ring-[#D4AF37]'
                      : 'bg-[#151515] hover:bg-[#1E1E1E] border-[#D4AF37]/15'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[12px] font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isCurrentDay
                          ? 'bg-[#D4AF37] text-black font-extrabold shadow-sm'
                          : isSelected
                          ? 'text-[#F5D76E]'
                          : 'text-white'
                      }`}
                    >
                      {day}
                    </span>

                    {pendingCount > 0 && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-[#D4AF37]/20 text-[#F5D76E] border border-[#D4AF37]/40">
                        {pendingCount}
                      </span>
                    )}
                  </div>

                  {/* Task preview */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded truncate ${
                          t.completed
                            ? 'line-through text-[#666666] bg-[#121212]'
                            : t.priority === 'high'
                            ? 'bg-red-950 text-red-200 border border-red-800/40'
                            : 'bg-[#222222] text-[#F5D76E] border border-[#D4AF37]/25'
                        }`}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <span className="text-[10px] text-[#D4AF37] font-bold block pl-1">
                        +{dayTasks.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda Drawer */}
        <div className="rounded-2xl bg-[#191919] p-5 border border-[#D4AF37]/25 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20 mb-4">
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  Selected Agenda (IST)
                </span>
                <h3 className="text-[17px] font-bold text-white">
                  {selectedDayStr === todayStr ? 'Today, ' : ''}
                  {selectedDayStr}
                </h3>
              </div>

              <button
                onClick={() => onOpenCreateModalWithDate(selectedDayStr)}
                className="p-2 rounded-xl bg-[#222222] hover:bg-[#2C2C2C] text-[#F5D76E] border border-[#D4AF37]/35 transition-colors"
                title="Add reminder for this date"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            {selectedDayReminders.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-12 h-12 rounded-2xl bg-[#141414] border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto mb-3">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <h4 className="text-[17px] font-bold text-white">
                  No reminders for this date
                </h4>
                <p className="text-[14px] text-[#B8B8B8] mt-1">
                  Schedule a task to lock in your execution plan.
                </p>
                <button
                  onClick={() => onOpenCreateModalWithDate(selectedDayStr)}
                  className="mt-4 px-4 py-2 rounded-xl btn-gold text-black text-[14px] font-bold shadow-md shadow-[#D4AF37]/20 inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Schedule Task</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {selectedDayReminders.map((r) => (
                  <ReminderCard
                    key={r.id}
                    reminder={r}
                    onEdit={onEditReminder}
                    viewMode="list"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
