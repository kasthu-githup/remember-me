import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Reminder } from '../types';
import { getKolkataDateString, getKolkataDate } from '../utils/timezone';

interface MiniCalendarProps {
  reminders: Reminder[];
  onSelectDate?: (dateStr: string) => void;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({
  reminders,
  onSelectDate,
}) => {
  const [currentDate, setCurrentDate] = useState(() => getKolkataDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayStr = getKolkataDateString();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const weekDayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  return (
    <div className="rounded-2xl bg-[#191919] p-5 border border-[#D4AF37]/25 shadow-md">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#D4AF37]/15 text-[#F5D76E]">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <span className="font-bold text-[17px] text-white">
            {monthName} {year}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded-lg text-[#B8B8B8] hover:text-white hover:bg-[#222222] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 rounded-lg text-[#B8B8B8] hover:text-white hover:bg-[#222222] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Week Day Header */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {weekDayLabels.map((day, i) => (
          <span key={i} className="text-[12px] font-bold text-[#7A7A7A]">
            {day}
          </span>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarCells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-8" />;
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = dateStr === todayStr;

          const dayReminders = reminders.filter((r) => r.dueDate === dateStr && !r.completed);
          const hasHigh = dayReminders.some((r) => r.priority === 'high');
          const hasPending = dayReminders.length > 0;

          return (
            <button
              key={day}
              onClick={() => onSelectDate && onSelectDate(dateStr)}
              className={`h-8 w-full rounded-lg text-[12px] font-semibold flex flex-col items-center justify-center relative transition-all ${
                isToday
                  ? 'bg-[#D4AF37] text-black font-extrabold shadow-md shadow-[#D4AF37]/30'
                  : 'text-[#B8B8B8] hover:bg-[#222222] hover:text-white'
              }`}
            >
              <span>{day}</span>
              {hasPending && !isToday && (
                <span
                  className={`w-1 h-1 rounded-full absolute bottom-1 ${
                    hasHigh ? 'bg-red-400' : 'bg-[#D4AF37]'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
