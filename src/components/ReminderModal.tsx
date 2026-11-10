import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Tag,
  AlertCircle,
  Repeat,
  Briefcase,
  User,
  Heart,
  DollarSign,
  GraduationCap,
  Users,
  Sparkles,
  Bell,
} from 'lucide-react';
import { Reminder, Priority, Category, Recurrence } from '../types';
import { useReminders } from '../context/RemindersContext';
import { getKolkataDateString } from '../utils/timezone';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminderToEdit?: Reminder | null;
  initialDate?: string;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  reminderToEdit,
  initialDate,
}) => {
  const { addNewReminder, updateExistingReminder } = useReminders();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('10:00');
  const [notifyBefore, setNotifyBefore] = useState<number>(0);
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('work');
  const [recurrence, setRecurrence] = useState<Recurrence>('none');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (reminderToEdit) {
      setTitle(reminderToEdit.title);
      setDescription(reminderToEdit.description || '');
      setDueDate(reminderToEdit.dueDate);
      setDueTime(reminderToEdit.dueTime);
      setNotifyBefore(reminderToEdit.notifyBefore !== undefined ? reminderToEdit.notifyBefore : 0);
      setPriority(reminderToEdit.priority);
      setCategory(reminderToEdit.category);
      setRecurrence(reminderToEdit.recurrence || 'none');
      setTags(reminderToEdit.tags || []);
    } else {
      const today = getKolkataDateString();
      setTitle('');
      setDescription('');
      setDueDate(initialDate || today);
      setDueTime('10:00');
      setNotifyBefore(0);
      setPriority('medium');
      setCategory('work');
      setRecurrence('none');
      setTags([]);
    }
    setError(null);
  }, [reminderToEdit, initialDate, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '');
      if (!tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const setDatePreset = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setDueDate(getKolkataDateString(d));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Reminder title is required.');
      return;
    }
    if (!dueDate) {
      setError('Please select a due date.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      if (reminderToEdit) {
        await updateExistingReminder(reminderToEdit.id, {
          title: title.trim(),
          description: description.trim(),
          dueDate,
          dueTime,
          notifyBefore,
          priority,
          category,
          recurrence,
          tags,
          notified: false,
        });
      } else {
        await addNewReminder({
          title: title.trim(),
          description: description.trim(),
          dueDate,
          dueTime,
          notifyBefore,
          priority,
          category,
          completed: false,
          recurrence,
          tags,
          notified: false,
        });
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save reminder');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoriesList: { id: Category; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'work', label: 'Work', icon: Briefcase },
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'study', label: 'Study', icon: GraduationCap },
    { id: 'family', label: 'Family', icon: Users },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#161616] shadow-2xl border border-[#D4AF37]/35 p-6 sm:p-7 overflow-hidden text-white">
        {/* Glow backdrop accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20 relative">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#D4AF37]/15 text-[#F5D76E]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[21px] font-bold text-white">
                {reminderToEdit ? 'Edit Luxury Reminder' : 'Create Luxury Reminder'}
              </h3>
              <p className="text-[12px] text-[#B8B8B8]">
                Schedule in Asia/Kolkata (IST) with exact alarm triggering
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#B8B8B8] hover:text-white hover:bg-[#202020] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-[12px] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Title */}
          <div>
            <label className="block text-[12px] font-semibold text-[#B8B8B8] mb-1">
              Reminder Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. VIP Client Portfolio Briefing"
              className="w-full px-3.5 py-2.5 text-[14px] rounded-xl bg-[#191919] border border-[#D4AF37]/30 text-white placeholder-[#7A7A7A] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[12px] font-semibold text-[#B8B8B8] mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key notes, talking points, location or agenda..."
              className="w-full px-3.5 py-2 text-[14px] rounded-xl bg-[#191919] border border-[#D4AF37]/30 text-white placeholder-[#7A7A7A] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] resize-none"
            />
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[12px] font-semibold text-[#B8B8B8] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> Due Date *
                </label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setDatePreset(0)}
                    className="text-[12px] text-[#F5D76E] hover:underline font-medium"
                  >
                    Today
                  </button>
                  <span className="text-[#7A7A7A]">·</span>
                  <button
                    type="button"
                    onClick={() => setDatePreset(1)}
                    className="text-[12px] text-[#F5D76E] hover:underline font-medium"
                  >
                    Tomorrow
                  </button>
                </div>
              </div>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-[14px] rounded-xl bg-[#191919] border border-[#D4AF37]/30 text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[12px] font-semibold text-[#B8B8B8] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> Exact Time (IST) *
                </label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setDueTime('10:00')}
                    className="text-[12px] text-[#F5D76E] hover:underline font-medium"
                  >
                    10:00
                  </button>
                  <span className="text-[#7A7A7A]">·</span>
                  <button
                    type="button"
                    onClick={() => setDueTime('14:30')}
                    className="text-[12px] text-[#F5D76E] hover:underline font-medium"
                  >
                    14:30
                  </button>
                </div>
              </div>
              <input
                type="time"
                required
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3 py-2 text-[14px] rounded-xl bg-[#191919] border border-[#D4AF37]/30 text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          {/* Notification Alert Timing (Offset) */}
          <div>
            <label className="block text-[12px] font-semibold text-[#B8B8B8] mb-1 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-[#D4AF37]" /> Notification Trigger Timing
            </label>
            <select
              value={notifyBefore}
              onChange={(e) => setNotifyBefore(Number(e.target.value))}
              className="w-full px-3 py-2 text-[14px] rounded-xl bg-[#191919] border border-[#D4AF37]/30 text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
            >
              <option value={0}>At exact scheduled time</option>
              <option value={5}>5 minutes before</option>
              <option value={15}>15 minutes before</option>
              <option value={30}>30 minutes before</option>
              <option value={60}>1 hour before</option>
            </select>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-[12px] font-semibold text-[#B8B8B8] mb-1.5">
              Priority Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                const isSelected = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 px-3 rounded-xl text-[14px] font-bold capitalize transition-all border ${
                      isSelected
                        ? p === 'high'
                          ? 'bg-red-950/80 text-red-200 border-red-500 shadow-md shadow-red-900/30'
                          : p === 'medium'
                          ? 'bg-[#D4AF37] text-black border-[#F5D76E] shadow-md shadow-[#D4AF37]/30 font-extrabold'
                          : 'bg-[#222222] text-[#F5D76E] border-[#D4AF37]/60 shadow-md'
                        : 'bg-[#191919] border-[#D4AF37]/20 text-[#B8B8B8] hover:bg-[#222222]'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-[12px] font-semibold text-[#B8B8B8] mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {categoriesList.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`py-1.5 px-2 rounded-xl text-[12px] font-medium flex flex-col items-center gap-1 transition-all border ${
                      isSelected
                        ? 'bg-[#D4AF37] text-black border-[#F5D76E] font-bold shadow-sm'
                        : 'bg-[#191919] border-[#D4AF37]/20 text-[#B8B8B8] hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recurrence & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#B8B8B8] mb-1 flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5 text-[#D4AF37]" /> Repeat Frequency
              </label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as Recurrence)}
                className="w-full px-3 py-2 text-[14px] rounded-xl bg-[#191919] border border-[#D4AF37]/30 text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              >
                <option value="none">Does not repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#B8B8B8] mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#D4AF37]" /> Tags (Press Enter)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="e.g. VIP, Strategy"
                className="w-full px-3 py-2 text-[14px] rounded-xl bg-[#191919] border border-[#D4AF37]/30 text-white placeholder-[#7A7A7A] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          {/* Tags Chips Display */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#D4AF37]/15 text-[#F5D76E] text-[12px] font-medium border border-[#D4AF37]/30"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#D4AF37]/20 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[14px] font-semibold rounded-xl text-[#B8B8B8] hover:bg-[#202020] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-[14px] font-bold rounded-xl btn-gold text-black shadow-lg shadow-[#D4AF37]/25 flex items-center gap-1.5 transition-all"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>{reminderToEdit ? 'Save Changes' : 'Confirm Reminder'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
