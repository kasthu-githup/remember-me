import React, { useMemo } from 'react';
import { Reminder } from '../types';
import { TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { getKolkataDateString } from '../utils/timezone';

interface WeeklyChartProps {
  reminders: Reminder[];
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ reminders }) => {
  const chartData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const now = new Date();
    const currentDay = now.getDay();
    const distanceToMonday = (currentDay + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - distanceToMonday);

    return days.map((dayLabel, index) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + index);
      const dateStr = d.toISOString().split('T')[0];

      const dayReminders = reminders.filter((r) => r.dueDate === dateStr);
      const completed = dayReminders.filter((r) => r.completed).length;
      const pending = dayReminders.filter((r) => !r.completed).length;
      const total = completed + pending;

      return {
        label: dayLabel,
        date: dateStr,
        dayNumber: d.getDate(),
        completed,
        pending,
        total,
      };
    });
  }, [reminders]);

  const maxTotal = Math.max(1, ...chartData.map((d) => d.total));
  const todayStr = getKolkataDateString();

  return (
    <div className="rounded-2xl bg-[#191919] p-5 border border-[#D4AF37]/25 shadow-md">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[17px] font-bold text-white flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
            <span>Weekly Activity & Performance (IST)</span>
          </h3>
          <p className="text-[12px] text-[#B8B8B8]">
            Task execution distribution across current week
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[12px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-t from-[#D4AF37] to-[#F5D76E]" />
            <span className="text-[#B8B8B8] font-medium">Done</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#333333]" />
            <span className="text-[#B8B8B8] font-medium">Pending</span>
          </div>
        </div>
      </div>

      {/* Chart Bars Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-44 pt-6 px-1 border-b border-[#D4AF37]/20">
        {chartData.map((item, idx) => {
          const completedHeight = item.total > 0 ? (item.completed / maxTotal) * 100 : 0;
          const pendingHeight = item.total > 0 ? (item.pending / maxTotal) * 100 : 0;
          const isToday = item.date === todayStr;

          return (
            <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
              {/* Tooltip */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black text-[#F5D76E] border border-[#D4AF37]/40 text-[12px] rounded-lg px-2.5 py-1 shadow-xl whitespace-nowrap z-20">
                {item.completed} completed · {item.pending} pending
              </div>

              {/* Bar container */}
              <div className="w-full max-w-[28px] sm:max-w-[36px] flex flex-col justify-end bg-[#141414] rounded-xl overflow-hidden h-full p-1 relative border border-[#D4AF37]/15">
                {item.total === 0 ? (
                  <div className="h-1.5 w-full bg-[#2B2B2B] rounded-full opacity-40 self-end" />
                ) : (
                  <div className="w-full flex flex-col justify-end h-full gap-1">
                    {item.pending > 0 && (
                      <div
                        style={{ height: `${pendingHeight}%` }}
                        className="w-full bg-[#333333] rounded-lg transition-all duration-500"
                        title={`${item.pending} pending`}
                      />
                    )}
                    {item.completed > 0 && (
                      <div
                        style={{ height: `${completedHeight}%` }}
                        className="w-full bg-gradient-to-t from-[#D4AF37] to-[#F5D76E] rounded-lg transition-all duration-500 shadow-sm"
                        title={`${item.completed} completed`}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Label */}
              <div className="mt-2 text-center">
                <span
                  className={`text-[12px] block font-semibold ${
                    isToday ? 'text-[#F5D76E] font-bold' : 'text-[#7A7A7A]'
                  }`}
                >
                  {item.label}
                </span>
                <span
                  className={`text-[12px] block ${
                    isToday
                      ? 'w-5 h-5 mx-auto rounded-full bg-[#D4AF37] text-black font-extrabold leading-5'
                      : 'text-[#B8B8B8]'
                  }`}
                >
                  {item.dayNumber}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-[12px] text-[#B8B8B8]">
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Consistent progress maintains executive momentum.</span>
        </span>
        <span className="flex items-center gap-1 font-semibold text-[#F5D76E]">
          <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Auto-Synced</span>
        </span>
      </div>
    </div>
  );
};
