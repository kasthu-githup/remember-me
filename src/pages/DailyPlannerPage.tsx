import React, { useState, useEffect } from 'react';
import {
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Save,
  Target,
  Edit3,
  Calendar,
  Heart,
} from 'lucide-react';
import { DailyPlan, DailyTimeSlot } from '../types';
import { useAuth } from '../context/AuthContext';
import { fetchDailyPlanData, saveDailyPlanData } from '../firebase/services';
import { getKolkataDateString } from '../utils/timezone';

const DEFAULT_HOURS = [
  '06:00 AM',
  '07:00 AM',
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM',
  '09:00 PM',
  '10:00 PM',
];

const DEFAULT_HABITS = [
  { id: 'h1', label: 'Hydration 2.5L Pure Water', done: true },
  { id: 'h2', label: '30-Min High-Intensity Workout / Gym', done: false },
  { id: 'h3', label: '30-Min Executive Strategy & Learning', done: true },
  { id: 'h4', label: 'Mindful Meditation & Posture Alignment', done: false },
];

export const DailyPlannerPage: React.FC = () => {
  const { user } = useAuth();
  const [currentDateStr, setCurrentDateStr] = useState(() => getKolkataDateString());

  const [topPriorities, setTopPriorities] = useState<[string, string, string]>([
    'Complete and verify REMEMBER ME luxury Black & Gold deployment',
    'Review Asia/Kolkata timezone scheduled notification loops',
    'Finalize executive client roadmap and milestones',
  ]);

  const [notes, setNotes] = useState(
    'Early morning deep focus blocks generated excellent progress. Prioritize uninterrupted blocks tomorrow.'
  );

  const [habits, setHabits] = useState(DEFAULT_HABITS);

  const [timeSlots, setTimeSlots] = useState<DailyTimeSlot[]>(() =>
    DEFAULT_HOURS.map((h, idx) => ({
      id: `slot_${idx}`,
      time: h,
      activity:
        idx === 2
          ? 'Executive Standup & Milestone Alignment'
          : idx === 4
          ? 'Deep Work: Core Architecture Implementation'
          : idx === 6
          ? 'Nutritional Lunch & Re-energize Walk'
          : idx === 8
          ? 'Stakeholder Briefing & Architecture Review'
          : '',
      completed: idx < 6,
    }))
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    fetchDailyPlanData(user.uid, currentDateStr).then((data) => {
      if (isMounted && data) {
        if (data.topPriorities) setTopPriorities(data.topPriorities);
        if (data.notes !== undefined) setNotes(data.notes);
        if (data.habits) setHabits(data.habits);
        if (data.timeSlots) setTimeSlots(data.timeSlots);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [user, currentDateStr]);

  const handleSave = async () => {
    if (!user) return;
    try {
      setIsSaving(true);
      const plan: DailyPlan = {
        date: currentDateStr,
        topPriorities,
        notes,
        habits,
        timeSlots,
      };
      await saveDailyPlanData(user.uid, plan);
      setSaveStatus('Saved in Firestore!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error('Failed to save daily plan:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const shiftDay = (days: number) => {
    const d = new Date(currentDateStr + 'T00:00:00');
    d.setDate(d.getDate() + days);
    setCurrentDateStr(d.toISOString().split('T')[0]);
  };

  const handleSlotChange = (index: number, text: string) => {
    const updated = [...timeSlots];
    updated[index].activity = text;
    setTimeSlots(updated);
  };

  const toggleSlotComplete = (index: number) => {
    const updated = [...timeSlots];
    updated[index].completed = !updated[index].completed;
    setTimeSlots(updated);
  };

  const toggleHabit = (id: string) => {
    setHabits(
      habits.map((h) => (h.id === id ? { ...h, done: !h.done } : h))
    );
  };

  const isToday = currentDateStr === getKolkataDateString();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-[26px] font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Daily Time-Block Planner</span>
            {isToday && (
              <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#F5D76E] border border-[#D4AF37]/40">
                Today (IST)
              </span>
            )}
          </h1>
          <p className="text-[14px] text-[#B8B8B8] mt-1">
            Focus zones, priority alignment, and hourly time-blocking
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center bg-[#151515] p-1 rounded-xl border border-[#D4AF37]/30">
            <button
              onClick={() => shiftDay(-1)}
              className="p-1.5 rounded-lg text-[#B8B8B8] hover:text-white hover:bg-[#252525]"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-[14px] font-bold text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{currentDateStr}</span>
            </span>
            <button
              onClick={() => shiftDay(1)}
              className="p-1.5 rounded-lg text-[#B8B8B8] hover:text-white hover:bg-[#252525]"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="py-2.5 px-4 rounded-xl btn-gold text-black font-bold text-[14px] shadow-md shadow-[#D4AF37]/25 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>{isSaving ? 'Saving...' : saveStatus || 'Save Agenda'}</span>
          </button>
        </div>
      </div>

      {/* Grid: 2 Cols Hourly Slots + 1 Col Right Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Hourly Blocks */}
        <div className="lg:col-span-2 rounded-2xl bg-[#191919] p-5 sm:p-6 border border-[#D4AF37]/25 shadow-md">
          <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="text-[21px] font-bold text-white">
                Hourly Time Blocks (Asia/Kolkata)
              </h3>
            </div>
            <span className="text-[12px] text-[#7A7A7A]">
              Click check to toggle completion
            </span>
          </div>

          <div className="space-y-2">
            {timeSlots.map((slot, idx) => (
              <div
                key={slot.id}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all border ${
                  slot.completed
                    ? 'bg-[#151515] border-[#D4AF37]/15 opacity-60'
                    : 'bg-[#141414] border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleSlotComplete(idx)}
                  className="text-[#D4AF37] hover:scale-110 transition-transform shrink-0"
                >
                  {slot.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#444444]" />
                  )}
                </button>

                <div className="w-20 text-[12px] font-bold text-[#F5D76E] shrink-0">
                  {slot.time}
                </div>

                <input
                  type="text"
                  value={slot.activity}
                  onChange={(e) => handleSlotChange(idx, e.target.value)}
                  placeholder="Plan focus task, meeting, or deep work slot..."
                  className={`flex-1 text-[14px] px-3 py-1.5 rounded-lg bg-transparent focus:bg-[#202020] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-white placeholder-[#7A7A7A] ${
                    slot.completed ? 'line-through text-[#7A7A7A]' : ''
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Top 3 Goals, Habit Tracker, Reflection */}
        <div className="space-y-6">
          {/* Top 3 Priorities */}
          <div className="rounded-2xl bg-[#191919] p-5 border border-[#D4AF37]/25 shadow-md">
            <div className="flex items-center gap-2 pb-3 border-b border-[#D4AF37]/20 mb-3">
              <Target className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-[17px] font-bold text-white">
                Top 3 Daily Focus Goals
              </h3>
            </div>

            <div className="space-y-2.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-lg bg-gradient-to-tr from-[#D4AF37] to-[#F5D76E] text-black font-extrabold text-[12px] flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    value={topPriorities[i]}
                    onChange={(e) => {
                      const updated = [...topPriorities] as [string, string, string];
                      updated[i] = e.target.value;
                      setTopPriorities(updated);
                    }}
                    placeholder={`Goal #${i + 1}`}
                    className="w-full text-[14px] px-3 py-2 rounded-xl bg-[#141414] border border-[#D4AF37]/25 text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Daily Habit Rituals */}
          <div className="rounded-2xl bg-[#191919] p-5 border border-[#D4AF37]/25 shadow-md">
            <div className="flex items-center gap-2 pb-3 border-b border-[#D4AF37]/20 mb-3">
              <Heart className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-[17px] font-bold text-white">
                Daily Habit Rituals
              </h3>
            </div>

            <div className="space-y-2">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all border ${
                    habit.done
                      ? 'bg-[#151515] border-[#D4AF37]/30 text-[#D4AF37]'
                      : 'bg-[#141414] border-[#D4AF37]/15 hover:bg-[#1E1E1E] text-white'
                  }`}
                >
                  <button type="button" className="shrink-0">
                    {habit.done ? (
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#444444]" />
                    )}
                  </button>
                  <span
                    className={`text-[14px] font-medium ${
                      habit.done
                        ? 'line-through text-[#7A7A7A]'
                        : 'text-white'
                    }`}
                  >
                    {habit.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Notes & Evening Reflection */}
          <div className="rounded-2xl bg-[#191919] p-5 border border-[#D4AF37]/25 shadow-md">
            <div className="flex items-center gap-2 pb-3 border-b border-[#D4AF37]/20 mb-3">
              <Edit3 className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-[17px] font-bold text-white">
                Evening Reflection & Notes
              </h3>
            </div>

            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What went exceptionally well today? What can be optimized tomorrow?"
              className="w-full text-[14px] p-3 rounded-xl bg-[#141414] border border-[#D4AF37]/25 text-white placeholder-[#7A7A7A] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
