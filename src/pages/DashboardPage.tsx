import React, { useMemo } from 'react';
import {
  BellRing,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  Sparkles,
  Zap,
  CalendarDays,
  Target,
  Bell,
  User,
} from 'lucide-react';
import { Reminder, NavigationPage } from '../types';
import { useAuth } from '../context/AuthContext';
import { useReminders } from '../context/RemindersContext';
import { StatsCard } from '../components/StatsCard';
import { ReminderCard } from '../components/ReminderCard';
import { WeeklyChart } from '../components/WeeklyChart';
import { MiniCalendar } from '../components/MiniCalendar';
import { getKolkataDateString } from '../utils/timezone';

interface DashboardPageProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenCreateModal: () => void;
  onEditReminder: (reminder: Reminder) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenCreateModal,
  onEditReminder,
}) => {
  const { user } = useAuth();
  const { reminders, notifications, stats } = useReminders();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const todayStr = getKolkataDateString();

  const todayTasks = useMemo(() => {
    return reminders.filter((r) => r.dueDate === todayStr);
  }, [reminders, todayStr]);

  const upcomingReminders = useMemo(() => {
    return reminders
      .filter((r) => !r.completed && r.dueDate > todayStr)
      .slice(0, 4);
  }, [reminders, todayStr]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Banner (Luxury Black & Gold) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#191919] via-[#1F1B12] to-[#151515] text-white p-6 sm:p-8 border-2 border-[#D4AF37]/35 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[12px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5D76E] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                Executive Suite
              </span>
              <span className="text-[12px] text-[#B8B8B8]">
                Asia/Kolkata (IST)
              </span>
            </div>

            <h1 className="text-[26px] font-extrabold tracking-tight bg-gradient-to-r from-white via-[#F5D76E] to-[#D4AF37] bg-clip-text text-transparent">
              {greeting}, {user?.displayName?.split(' ')[0] || 'Member'}! ✨
            </h1>
            <p className="mt-1 text-[14px] text-[#B8B8B8] max-w-xl">
              You have <span className="font-bold text-[#F5D76E]">{stats.todayDue} tasks</span> due today and an overall {stats.completionRate}% completion rate this week.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenCreateModal}
              className="py-3 px-5 rounded-xl btn-gold text-black font-bold text-[14px] shadow-xl shadow-[#D4AF37]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Quick Add Reminder</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatsCard
          title="Today's Reminders"
          value={stats.todayDue}
          subtitle="Scheduled for today (IST)"
          icon={Clock}
          trend={`${stats.todayDue} items`}
          trendPositive={stats.todayDue <= 5}
        />

        <StatsCard
          title="Pending Tasks"
          value={stats.pending}
          subtitle="Awaiting completion"
          icon={BellRing}
          trend="In Progress"
          trendPositive={true}
        />

        <StatsCard
          title="Completed Tasks"
          value={stats.completed}
          subtitle="Accomplished goals"
          icon={CheckCircle2}
          trend={`${stats.completionRate}% rate`}
          trendPositive={true}
        />

        <StatsCard
          title="Urgent / High Priority"
          value={stats.highPriorityPending}
          subtitle="Immediate attention"
          icon={AlertCircle}
          trend={stats.highPriorityPending > 0 ? 'Requires Focus' : 'Clear'}
          trendPositive={stats.highPriorityPending === 0}
        />
      </div>

      {/* Main Grid: Left 2 Columns (Tasks & Chart), Right 1 Column (Calendar, Notifications, Profile) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Today's Tasks Section */}
          <div className="rounded-2xl bg-[#191919] p-5 sm:p-6 border border-[#D4AF37]/25 shadow-md">
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#D4AF37]/15 text-[#F5D76E]">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[21px] font-bold text-white">
                    Today's Priority Reminders
                  </h3>
                  <p className="text-[12px] text-[#B8B8B8]">
                    Reminders scheduled for execution today (Asia/Kolkata)
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('reminders')}
                className="text-[14px] font-bold text-[#F5D76E] hover:underline flex items-center gap-1"
              >
                <span>View All ({reminders.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todayTasks.length === 0 ? (
              <div className="text-center py-10 px-4">
                <div className="w-12 h-12 rounded-2xl bg-[#141414] border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-[17px] font-bold text-white">
                  No reminders scheduled for today
                </h4>
                <p className="text-[14px] text-[#B8B8B8] mt-1 max-w-sm mx-auto">
                  Your agenda is clear for today, or you can create a new reminder to stay ahead.
                </p>
                <button
                  onClick={onOpenCreateModal}
                  className="mt-4 px-4 py-2 rounded-xl btn-gold text-black text-[14px] font-bold shadow-md shadow-[#D4AF37]/20 inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Task</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {todayTasks.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onEdit={onEditReminder}
                    viewMode="list"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Weekly Activity Performance Chart */}
          <WeeklyChart reminders={reminders} />
        </div>

        {/* Right 1 Column (Calendar, Notifications, Profile) */}
        <div className="space-y-6 sm:space-y-8">
          {/* Calendar Widget */}
          <MiniCalendar
            reminders={reminders}
            onSelectDate={(d) => {
              onNavigate('calendar');
            }}
          />

          {/* Recent Notifications Widget (Prompt Section 3 Requirement) */}
          <div className="rounded-2xl bg-[#191919] p-5 border border-[#D4AF37]/25 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20 mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-[17px] font-bold text-white">
                  Recent Notifications
                </h3>
              </div>
              <button
                onClick={() => onNavigate('notifications')}
                className="text-[12px] font-bold text-[#F5D76E] hover:underline"
              >
                Notification Center
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-6 text-[12px] text-[#7A7A7A]">
                No recent notifications recorded.
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.slice(0, 3).map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl bg-[#151515] border border-[#D4AF37]/15 text-[12px]"
                  >
                    <div className="flex items-center justify-between font-bold text-[#F5D76E] mb-0.5">
                      <span className="truncate">{n.title}</span>
                      <span className="text-[10px] text-[#7A7A7A] shrink-0 ml-2">
                        {new Date(n.timestamp).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#B8B8B8] line-clamp-1">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Tasks Widget */}
          <div className="rounded-2xl bg-[#191919] p-5 border border-[#D4AF37]/25 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20 mb-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-[17px] font-bold text-white">
                  Upcoming Tasks
                </h3>
              </div>
              <button
                onClick={() => onNavigate('reminders')}
                className="text-[12px] font-bold text-[#F5D76E] hover:underline"
              >
                More
              </button>
            </div>

            {upcomingReminders.length === 0 ? (
              <div className="text-center py-6 text-[12px] text-[#7A7A7A]">
                No future tasks scheduled.
              </div>
            ) : (
              <div className="space-y-2.5">
                {upcomingReminders.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => onEditReminder(r)}
                    className="p-3 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] border border-[#D4AF37]/20 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span className="font-bold text-[#F5D76E]">{r.dueDate}</span>
                      <span className="text-[#B8B8B8] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#D4AF37]" /> {r.dueTime} IST
                      </span>
                    </div>
                    <p className="text-[14px] font-semibold text-white line-clamp-1">
                      {r.title}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Information Widget (Prompt Section 3 Requirement) */}
          <div className="rounded-2xl p-5 bg-[#191919] border border-[#D4AF37]/25 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={
                  user?.photoURL ||
                  `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.uid || 'vip'}`
                }
                alt="Profile Avatar"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#D4AF37]"
              />
              <div>
                <h4 className="text-[17px] font-bold text-white leading-tight">
                  {user?.displayName || 'VIP Member'}
                </h4>
                <p className="text-[12px] text-[#B8B8B8] truncate">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#F5D76E] border border-[#D4AF37]/30">
                  Active Cloud Member
                </span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('profile')}
              className="p-2 rounded-xl bg-[#222222] hover:bg-[#2A2A2A] text-[#F5D76E] border border-[#D4AF37]/30 transition-colors"
              title="Edit Profile"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
