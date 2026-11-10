import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  Search,
  Volume2,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useReminders } from '../context/RemindersContext';
import { playChime } from '../utils/audio';
import { requestNotificationPermission, getNotificationPermissionStatus } from '../utils/notifications';
import { NavigationPage } from '../types';

interface HeaderProps {
  onOpenSidebar: () => void;
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSidebar,
  currentPage,
  onNavigate,
}) => {
  const {
    reminders,
    notifications,
    unreadNotificationCount,
    markAllNotificationsRead,
    searchQuery,
    setSearchQuery,
    settings,
    updateSettings,
    stats,
  } = useReminders();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = (page: NavigationPage): { title: string; subtitle: string } => {
    switch (page) {
      case 'dashboard':
        return { title: 'Executive Dashboard', subtitle: 'Real-time productivity & daily agenda' };
      case 'reminders':
        return { title: 'My Reminders', subtitle: 'Precision scheduling & priorities' };
      case 'calendar':
        return { title: 'Monthly Calendar', subtitle: 'Visual deadline overview (Asia/Kolkata)' };
      case 'daily-planner':
        return { title: 'Daily Time-Block Planner', subtitle: 'Hourly structure, habits & focus zones' };
      case 'completed':
        return { title: 'Completed Archive', subtitle: 'Archived accomplishments & victories' };
      case 'notifications':
        return { title: 'Notification Center', subtitle: 'Alert logs, system messages & history' };
      case 'profile':
        return { title: 'Member Profile', subtitle: 'Personal credentials & member status' };
      case 'settings':
        return { title: 'System Settings', subtitle: 'Alarms, timezone, FCM push & cloud sync' };
      default:
        return { title: 'Remember Me', subtitle: 'Smart personal reminder system' };
    }
  };

  const { title, subtitle } = getPageTitle(currentPage);

  const handleTestSound = () => {
    playChime(settings.chimeTone);
  };

  const handleEnablePush = async () => {
    const perm = await requestNotificationPermission();
    if (perm === 'granted') {
      updateSettings({ browserNotificationsEnabled: true });
    }
  };

  const notifStatus = getNotificationPermissionStatus();

  return (
    <header className="sticky top-0 z-30 w-full bg-[#121212]/90 backdrop-blur-xl border-b border-[#D4AF37]/25 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Mobile hamburger & Page Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl text-[#B8B8B8] hover:text-white hover:bg-[#1C1C1C] lg:hidden"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-[21px] font-bold text-white flex items-center gap-2">
            <span>{title}</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#F5D76E] border border-[#D4AF37]/35">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Asia/Kolkata (IST)
            </span>
          </h2>
          <p className="text-[12px] text-[#B8B8B8] hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentPage !== 'reminders' && e.target.value.trim().length > 0) {
                onNavigate('reminders');
              }
            }}
            placeholder="Search reminders, tags, keywords..."
            className="w-full pl-10 pr-4 py-2 text-[14px] bg-[#191919] border border-[#D4AF37]/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#F5D76E] text-white placeholder-[#7A7A7A] transition-all"
          />
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Audio Test Chime Button */}
        <button
          onClick={handleTestSound}
          title="Play reminder chime sound"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] text-[#F5D76E] text-[14px] font-medium border border-[#D4AF37]/30 transition-all"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Test Sound</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2.5 rounded-xl text-[#B8B8B8] hover:text-[#F5D76E] hover:bg-[#1A1A1A] transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#D4AF37] ring-2 ring-[#080808] animate-pulse" />
            )}
          </button>

          {/* Notifications Panel */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#161616] shadow-2xl border border-[#D4AF37]/30 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-bold text-[14px] text-white">
                    Notification Feed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      markAllNotificationsRead();
                    }}
                    className="text-[12px] text-[#D4AF37] hover:underline"
                  >
                    Mark read
                  </button>
                  <span className="text-[12px] px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#F5D76E] font-bold">
                    {unreadNotificationCount} New
                  </span>
                </div>
              </div>

              {/* Push permission banner */}
              {notifStatus !== 'granted' && (
                <div className="my-3 p-2.5 rounded-xl bg-[#1F1B12] border border-[#D4AF37]/30 flex items-center justify-between text-[12px]">
                  <span className="text-[#B8B8B8]">
                    Enable desktop alerts for alarms:
                  </span>
                  <button
                    onClick={handleEnablePush}
                    className="px-2.5 py-1 rounded-lg btn-gold text-black text-[12px] font-bold"
                  >
                    Enable
                  </button>
                </div>
              )}

              {/* Feed List */}
              <div className="mt-2 max-h-64 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-[12px] text-[#7A7A7A]">
                    <CheckCircle className="w-7 h-7 text-[#D4AF37] mx-auto mb-1.5 opacity-60" />
                    All clear! No recent alerts.
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onNavigate('notifications');
                        setNotificationsOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-[#1C1C1C] hover:bg-[#242424] cursor-pointer transition-colors border border-[#D4AF37]/15"
                    >
                      <div className="flex items-center justify-between text-[12px] mb-1">
                        <span className="font-bold text-[#F5D76E]">{n.title}</span>
                        <span className="text-[#7A7A7A]">
                          {new Date(n.timestamp).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#B8B8B8] line-clamp-1">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 mt-2 border-t border-[#D4AF37]/20 flex justify-between">
                <button
                  onClick={() => {
                    onNavigate('notifications');
                    setNotificationsOpen(false);
                  }}
                  className="text-[12px] text-[#D4AF37] hover:underline font-bold flex items-center gap-1"
                >
                  <span>Open Notification Center</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    onNavigate('reminders');
                    setNotificationsOpen(false);
                  }}
                  className="text-[12px] text-[#B8B8B8] hover:text-white"
                >
                  View Tasks ({stats.pending})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
