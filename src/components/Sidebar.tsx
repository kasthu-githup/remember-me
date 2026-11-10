import React from 'react';
import {
  LayoutDashboard,
  BellRing,
  CalendarDays,
  Clock,
  CheckCircle2,
  User,
  Settings,
  LogOut,
  Sparkles,
  Plus,
  X,
  Bell,
} from 'lucide-react';
import { NavigationPage } from '../types';
import { useAuth } from '../context/AuthContext';
import { useReminders } from '../context/RemindersContext';

interface SidebarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
  onOpenCreateModal,
}) => {
  const { user, logout } = useAuth();
  const { stats, unreadNotificationCount } = useReminders();

  const navItems = [
    {
      id: 'dashboard' as NavigationPage,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'reminders' as NavigationPage,
      label: 'My Reminders',
      icon: BellRing,
      badge: stats.pending > 0 ? stats.pending : null,
      badgeColor: 'bg-[#D4AF37] text-black font-bold',
    },
    {
      id: 'calendar' as NavigationPage,
      label: 'Calendar',
      icon: CalendarDays,
      badge: null,
    },
    {
      id: 'daily-planner' as NavigationPage,
      label: 'Daily Planner',
      icon: Clock,
      badge: null,
    },
    {
      id: 'completed' as NavigationPage,
      label: 'Completed Tasks',
      icon: CheckCircle2,
      badge: stats.completed > 0 ? stats.completed : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 font-bold',
    },
    {
      id: 'notifications' as NavigationPage,
      label: 'Notification Center',
      icon: Bell,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : null,
      badgeColor: 'bg-[#F5D76E] text-black font-bold',
    },
    {
      id: 'profile' as NavigationPage,
      label: 'Profile',
      icon: User,
      badge: null,
    },
    {
      id: 'settings' as NavigationPage,
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 flex flex-col bg-[#121212] backdrop-blur-2xl border-r border-[#D4AF37]/25 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-[#D4AF37]/20">
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F5D76E] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-[17px] font-extrabold tracking-tight bg-gradient-to-r from-[#FFFFFF] via-[#F5D76E] to-[#D4AF37] bg-clip-text text-transparent">
                REMEMBER ME
              </h1>
              <p className="text-[12px] uppercase tracking-wider font-semibold text-[#D4AF37]">
                Smart Luxury Planner
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#B8B8B8] hover:text-white hover:bg-[#1A1A1A] lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Add Action Button (Gold with Black Text) */}
        <div className="px-5 pt-5 pb-3">
          <button
            onClick={() => {
              onOpenCreateModal();
              onClose();
            }}
            className="w-full py-3 px-4 rounded-xl btn-gold text-black text-[14px] font-bold shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 group transition-all"
          >
            <div className="w-5 h-5 rounded-lg bg-black/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
              <Plus className="w-4 h-4 text-black stroke-[3]" />
            </div>
            <span>New Reminder</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            const IconComponent = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#1D1D1D] text-[#F5D76E] font-semibold border border-[#D4AF37]/50 shadow-md shadow-[#D4AF37]/10'
                    : 'text-[#B8B8B8] hover:text-[#FFFFFF] hover:bg-[#181818]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#D4AF37] text-black shadow-sm'
                        : 'text-[#B8B8B8] group-hover:text-[#F5D76E]'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span
                    className={`px-2 py-0.5 text-[12px] font-bold rounded-full ${
                      item.badgeColor || 'bg-[#D4AF37]/20 text-[#F5D76E]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Card & Sign Out */}
        <div className="p-4 border-t border-[#D4AF37]/20 bg-[#161616]">
          <div className="flex items-center justify-between">
            <div
              onClick={() => {
                onNavigate('profile');
                onClose();
              }}
              className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0 pr-2"
            >
              <img
                src={
                  user?.photoURL ||
                  `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.uid || 'vip'}`
                }
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#D4AF37] group-hover:scale-105 transition-transform"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-white truncate group-hover:text-[#F5D76E] transition-colors">
                  {user?.displayName || 'VIP Member'}
                </p>
                <p className="text-[12px] text-[#B8B8B8] truncate">
                  {user?.email || 'Guest Mode'}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-xl text-[#B8B8B8] hover:text-red-400 hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
