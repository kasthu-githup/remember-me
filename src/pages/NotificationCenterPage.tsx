import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Trash2,
  Sparkles,
  Clock,
  Volume2,
  Send,
  AlertCircle,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useReminders } from '../context/RemindersContext';
import { requestNotificationPermission, getNotificationPermissionStatus } from '../utils/notifications';

export const NotificationCenterPage: React.FC = () => {
  const {
    notifications,
    unreadNotificationCount,
    markAllNotificationsRead,
    clearNotificationHistory,
    triggerTestNotification,
    settings,
    updateSettings,
  } = useReminders();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [testTriggered, setTestTriggered] = useState(false);

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.read : true));

  const notifStatus = getNotificationPermissionStatus();

  const handleRequestPush = async () => {
    const perm = await requestNotificationPermission();
    if (perm === 'granted') {
      updateSettings({ browserNotificationsEnabled: true });
    }
  };

  const handleRunTest = () => {
    triggerTestNotification();
    setTestTriggered(true);
    setTimeout(() => setTestTriggered(false), 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-[26px] font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Notification Center</span>
            <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#F5D76E] border border-[#D4AF37]/40">
              {unreadNotificationCount} Unread
            </span>
          </h1>
          <p className="text-[14px] text-[#B8B8B8] mt-1">
            Audit notification logs, alarm records, and background push events
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunTest}
            className="py-2.5 px-4 rounded-xl btn-gold text-black font-bold text-[14px] shadow-md shadow-[#D4AF37]/25 flex items-center gap-2 transition-all"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
            <span>{testTriggered ? 'Dispatched!' : 'Send Test Notification'}</span>
          </button>

          {notifications.length > 0 && (
            <button
              onClick={clearNotificationHistory}
              className="py-2.5 px-3 rounded-xl bg-[#222222] hover:bg-[#2A2A2A] text-[#B8B8B8] hover:text-red-400 font-semibold text-[14px] border border-[#333333] transition-colors"
              title="Clear all logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Permission & Architecture Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Browser Push Status Card */}
        <div className="p-5 rounded-2xl bg-[#191919] border border-[#D4AF37]/25 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 text-[#F5D76E] flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[17px] font-bold text-white">Browser Push Permission</h4>
              <p className="text-[12px] text-[#B8B8B8]">
                Status: <span className="font-bold uppercase text-[#F5D76E]">{notifStatus}</span>
              </p>
            </div>
          </div>

          {notifStatus !== 'granted' ? (
            <button
              onClick={handleRequestPush}
              className="px-3.5 py-1.5 rounded-xl btn-gold text-black text-[14px] font-bold"
            >
              Allow Push
            </button>
          ) : (
            <span className="px-3 py-1 rounded-xl bg-[#D4AF37]/20 text-[#F5D76E] text-[12px] font-bold border border-[#D4AF37]/40 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 stroke-[3]" /> Enabled
            </span>
          )}
        </div>

        {/* Server & Audio Alarm Status */}
        <div className="p-5 rounded-2xl bg-[#191919] border border-[#D4AF37]/25 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 text-[#F5D76E] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[17px] font-bold text-white">Server & Audio Engine</h4>
              <p className="text-[12px] text-[#B8B8B8]">
                Harmonic chime + Asia/Kolkata loop active
              </p>
            </div>
          </div>

          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`px-3 py-1 rounded-xl text-[12px] font-bold border transition-colors ${
              settings.soundEnabled
                ? 'bg-[#D4AF37]/20 text-[#F5D76E] border-[#D4AF37]/40'
                : 'bg-[#222222] text-[#7A7A7A] border-[#333333]'
            }`}
          >
            {settings.soundEnabled ? 'Chime ON' : 'Chime Muted'}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/20">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-[14px] font-bold transition-all border ${
              filter === 'all'
                ? 'bg-[#D4AF37] text-black border-[#F5D76E]'
                : 'bg-[#191919] text-[#B8B8B8] border-transparent hover:text-white'
            }`}
          >
            All Logs ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3.5 py-1.5 rounded-xl text-[14px] font-bold transition-all border ${
              filter === 'unread'
                ? 'bg-[#D4AF37] text-black border-[#F5D76E]'
                : 'bg-[#191919] text-[#B8B8B8] border-transparent hover:text-white'
            }`}
          >
            Unread ({unreadNotificationCount})
          </button>
        </div>

        {unreadNotificationCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="text-[14px] text-[#F5D76E] hover:underline font-semibold"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-[#191919] p-12 text-center border border-[#D4AF37]/25 shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-[21px] font-bold text-white">
            {filter === 'unread' ? 'No unread notifications' : 'Notification log is clear'}
          </h3>
          <p className="text-[14px] text-[#B8B8B8] mt-1 max-w-sm mx-auto">
            When alarms trigger or reminders are created, they will be logged here with Asia/Kolkata timestamps.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                !item.read
                  ? 'bg-[#201D16] border-[#D4AF37]/50 shadow-md shadow-[#D4AF37]/5'
                  : 'bg-[#191919] border-[#D4AF37]/20 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    item.type === 'alarm'
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-[#252525] text-[#D4AF37]'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-[17px] font-bold text-white leading-tight">
                      {item.title}
                    </h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                    )}
                  </div>
                  <p className="text-[14px] text-[#B8B8B8] mt-0.5">{item.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 text-[12px] text-[#7A7A7A]">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {new Date(item.timestamp).toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  IST
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
