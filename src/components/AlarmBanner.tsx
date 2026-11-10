import React from 'react';
import { Bell, Check, Clock, X, Sparkles } from 'lucide-react';
import { Reminder } from '../types';
import { useReminders } from '../context/RemindersContext';

interface AlarmBannerProps {
  alarm: Reminder | null;
  onDismiss: () => void;
}

export const AlarmBanner: React.FC<AlarmBannerProps> = ({ alarm, onDismiss }) => {
  const { toggleReminderComplete, snoozeReminder } = useReminders();

  if (!alarm) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] animate-bounce shadow-2xl rounded-2xl bg-[#191919] text-white p-5 border-2 border-[#D4AF37] shadow-[#D4AF37]/30 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center animate-pulse">
            <Bell className="w-5 h-5 text-[#F5D76E] animate-wiggle" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[#F5D76E]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Luxury Reminder Alert</span>
            </div>
            <h4 className="font-bold text-[17px] text-white mt-0.5 line-clamp-1">
              {alarm.title}
            </h4>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="p-1 rounded-lg text-[#B8B8B8] hover:text-white hover:bg-[#252525] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {alarm.description && (
        <p className="mt-2 text-[14px] text-[#B8B8B8] line-clamp-2">
          {alarm.description}
        </p>
      )}

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[12px] text-[#B8B8B8]">
          <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Scheduled: {alarm.dueTime} IST</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => snoozeReminder(alarm.id, 15)}
            className="px-3 py-1.5 rounded-xl bg-[#252525] hover:bg-[#303030] text-[14px] font-semibold text-[#B8B8B8] hover:text-white border border-[#D4AF37]/20 transition-colors"
          >
            Snooze 15m
          </button>
          <button
            onClick={() => {
              toggleReminderComplete(alarm.id);
              onDismiss();
            }}
            className="px-3.5 py-1.5 rounded-xl btn-gold text-black text-[14px] font-bold shadow-md shadow-[#D4AF37]/30 flex items-center gap-1 transition-all"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Complete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
