import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Trash2,
  RotateCcw,
  Sparkles,
  Calendar,
  Clock,
  Search,
  AlertTriangle,
} from 'lucide-react';
import { useReminders } from '../context/RemindersContext';

export const CompletedPage: React.FC = () => {
  const { reminders, toggleReminderComplete, clearCompletedReminders, deleteExistingReminder } = useReminders();
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const completedReminders = useMemo(() => {
    return reminders.filter((r) => r.completed);
  }, [reminders]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return completedReminders;
    const q = searchQuery.toLowerCase();
    return completedReminders.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }, [completedReminders, searchQuery]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-[26px] font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Completed Tasks</span>
            <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#F5D76E] border border-[#D4AF37]/40">
              {completedReminders.length} Accomplished
            </span>
          </h1>
          <p className="text-[14px] text-[#B8B8B8] mt-1">
            Review your accomplishments, celebrate victories, or restore archived tasks
          </p>
        </div>

        {completedReminders.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 font-bold text-[14px] border border-red-700/50 flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Completed History</span>
          </button>
        )}
      </div>

      {/* Gold Celebration Trophy Card */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-[#1E190E] via-[#151515] to-[#1E190E] border border-[#D4AF37]/35 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] text-black flex items-center justify-center shadow-md shadow-[#D4AF37]/30 shrink-0 font-extrabold">
            <CheckCircle2 className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <h3 className="text-[17px] font-bold text-white flex items-center gap-1.5">
              <span>Executive Momentum Achieved!</span>
              <Sparkles className="w-4 h-4 text-[#F5D76E]" />
            </h3>
            <p className="text-[14px] text-[#B8B8B8] mt-0.5">
              You have successfully completed {completedReminders.length} scheduled reminders. Checked goals free up executive bandwidth for high-impact priorities.
            </p>
          </div>
        </div>
      </div>

      {/* Search Input for Archive */}
      {completedReminders.length > 0 && (
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search completed archive..."
            className="w-full pl-10 pr-4 py-2 text-[14px] rounded-xl bg-[#141414] border border-[#D4AF37]/30 text-white placeholder-[#7A7A7A] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          />
        </div>
      )}

      {/* Completed Tasks List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-[#191919] p-12 text-center border border-[#D4AF37]/25 shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-[21px] font-bold text-white">
            {completedReminders.length === 0
              ? 'No completed tasks yet'
              : 'No matching completed tasks found'}
          </h3>
          <p className="text-[14px] text-[#B8B8B8] mt-1 max-w-sm mx-auto">
            {completedReminders.length === 0
              ? 'When you check off reminders on the dashboard or my reminders page, they are preserved in this archive.'
              : 'Try searching with a different keyword.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((reminder) => (
            <div
              key={reminder.id}
              className="p-4 rounded-2xl bg-[#191919] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-[#D4AF37] text-black flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[17px] font-semibold text-[#888888] line-through">
                    {reminder.title}
                  </h4>
                  {reminder.description && (
                    <p className="text-[14px] text-[#666666] line-clamp-1 mt-0.5">
                      {reminder.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[12px] text-[#7A7A7A]">
                    <span className="capitalize px-2 py-0.5 rounded bg-[#141414] text-[#D4AF37] border border-[#D4AF37]/25 font-medium">
                      {reminder.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#D4AF37]" /> Due {reminder.dueDate}
                    </span>
                    {reminder.completedAt && (
                      <span className="flex items-center gap-1 text-[#F5D76E] font-medium">
                        <Clock className="w-3 h-3 text-[#D4AF37]" /> Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => toggleReminderComplete(reminder.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#222222] hover:bg-[#2A2A2A] text-[#F5D76E] font-bold text-[14px] border border-[#D4AF37]/35 flex items-center gap-1.5 transition-colors"
                  title="Move back to active reminders"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore</span>
                </button>
                <button
                  onClick={() => deleteExistingReminder(reminder.id)}
                  className="p-2 rounded-xl text-[#B8B8B8] hover:text-red-400 hover:bg-red-950/30 transition-colors"
                  title="Delete permanently"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-[#191919] p-6 shadow-2xl border border-[#D4AF37]/40 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-950/70 text-red-400 border border-red-700/50 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-[21px] font-bold text-white">
              Clear Completed History?
            </h3>
            <p className="text-[14px] text-[#B8B8B8] mt-2">
              This will permanently remove {completedReminders.length} completed tasks from your archive.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2.5">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-[14px] font-semibold text-[#B8B8B8] hover:bg-[#252525]"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await clearCompletedReminders();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-[14px] font-bold bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
