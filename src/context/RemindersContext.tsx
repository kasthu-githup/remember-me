import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Reminder, Category, Priority, UserSettings, NotificationItem } from '../types';
import { useAuth } from './AuthContext';
import {
  subscribeToUserReminders,
  createReminder,
  updateReminder,
  deleteReminder as removeReminderService,
  getLocalSettings,
  saveLocalSettings,
  recordNotification,
  fetchNotifications,
  clearAllNotifications as clearNotificationsService,
} from '../firebase/services';
import { getInitialDemoReminders } from '../utils/demoData';
import { playChime } from '../utils/audio';
import { showBrowserNotification } from '../utils/notifications';
import { getKolkataDateString, getKolkataTimeString, isOverdueKolkata } from '../utils/timezone';

interface RemindersContextType {
  reminders: Reminder[];
  filteredReminders: Reminder[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  selectedPriority: Priority | 'all';
  setSelectedPriority: (priority: Priority | 'all') => void;
  statusFilter: 'all' | 'pending' | 'completed' | 'overdue';
  setStatusFilter: (status: 'all' | 'pending' | 'completed' | 'overdue') => void;
  sortBy: 'date-asc' | 'date-desc' | 'priority-desc' | 'title';
  setSortBy: (sort: 'date-asc' | 'date-desc' | 'priority-desc' | 'title') => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  activeAlarm: Reminder | null;
  dismissAlarm: () => void;
  addNewReminder: (data: Omit<Reminder, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<Reminder>;
  updateExistingReminder: (id: string, updates: Partial<Reminder>) => Promise<void>;
  deleteExistingReminder: (id: string) => Promise<void>;
  toggleReminderComplete: (id: string) => Promise<void>;
  snoozeReminder: (id: string, minutes: number) => Promise<void>;
  clearCompletedReminders: () => Promise<void>;
  markAllNotificationsRead: () => void;
  clearNotificationHistory: () => Promise<void>;
  triggerTestNotification: () => void;
  stats: {
    total: number;
    completed: number;
    pending: number;
    todayDue: number;
    completionRate: number;
    highPriorityPending: number;
  };
}

const RemindersContext = createContext<RemindersContextType | undefined>(undefined);

export const RemindersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & display preferences
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc' | 'priority-desc' | 'title'>('date-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // User Settings
  const [settings, setSettings] = useState<UserSettings>(getLocalSettings());

  // Real-time alarm trigger
  const [activeAlarm, setActiveAlarm] = useState<Reminder | null>(null);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      saveLocalSettings(merged);
      return merged;
    });
  };

  // Subscribe to reminders & notifications for active user
  useEffect(() => {
    if (!user) {
      setReminders([]);
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Fetch notifications
    fetchNotifications(user.uid).then((items) => setNotifications(items));

    const unsub = subscribeToUserReminders(
      user.uid,
      (items) => {
        if (items.length === 0 && (user.isDemo || user.uid.startsWith('demo_'))) {
          const initial = getInitialDemoReminders(user.uid);
          setReminders(initial);
          localStorage.setItem('remember_me_local_reminders', JSON.stringify(initial));
        } else {
          setReminders(items);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Subscription error in context:', err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  // Real-time Alarm Notification Clock: checks every 10 seconds in Asia/Kolkata
  useEffect(() => {
    const checkUpcomingReminders = () => {
      if (!reminders || reminders.length === 0 || !user) return;

      const currentYMD = getKolkataDateString();
      const currentTime = getKolkataTimeString();

      reminders.forEach((r) => {
        if (!r.completed && !r.notified) {
          // Check if due exact time or offset
          if (r.dueDate === currentYMD && r.dueTime === currentTime) {
            // Trigger alarm!
            setActiveAlarm(r);

            if (settings.soundEnabled) {
              playChime(settings.chimeTone);
            }

            if (settings.browserNotificationsEnabled) {
              showBrowserNotification(`🔔 Luxury Alert: ${r.title}`, {
                body: r.description || `Priority: ${r.priority.toUpperCase()} - Due right now (IST)!`,
              });
            }

            // Record into Notification History Center
            const notifItem: Omit<NotificationItem, 'id'> = {
              reminderId: r.id,
              title: `Reminder Alert: ${r.title}`,
              message: r.description || `Priority: ${r.priority.toUpperCase()} · Scheduled for ${r.dueTime} IST`,
              timestamp: new Date().toISOString(),
              read: false,
              type: 'alarm',
              priority: r.priority,
            };

            recordNotification(user.uid, notifItem).then((saved) => {
              setNotifications((prev) => [saved, ...prev]);
            });

            // Mark notified so it never rings duplicate times
            updateReminder(r.id, { notified: true }).catch(() => {});
          }
        }
      });
    };

    const intervalId = setInterval(checkUpcomingReminders, 10000);
    return () => clearInterval(intervalId);
  }, [reminders, settings, user]);

  const dismissAlarm = useCallback(() => {
    setActiveAlarm(null);
  }, []);

  // CRUD Methods
  const addNewReminder = async (data: Omit<Reminder, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('You must be signed in to add reminders');
    const created = await createReminder(user.uid, data);
    setReminders((prev) => [created, ...prev]);

    // Record system notification
    const notifItem: Omit<NotificationItem, 'id'> = {
      reminderId: created.id,
      title: `Reminder Created: ${created.title}`,
      message: `Scheduled for ${created.dueDate} at ${created.dueTime} IST`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'reminder',
      priority: created.priority,
    };
    recordNotification(user.uid, notifItem).then((saved) => {
      setNotifications((prev) => [saved, ...prev]);
    });

    return created;
  };

  const updateExistingReminder = async (id: string, updates: Partial<Reminder>) => {
    await updateReminder(id, updates);
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r))
    );
  };

  const deleteExistingReminder = async (id: string) => {
    await removeReminderService(id);
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleReminderComplete = async (id: string) => {
    const target = reminders.find((r) => r.id === id);
    if (!target) return;

    const nextCompleted = !target.completed;
    const updates: Partial<Reminder> = {
      completed: nextCompleted,
      completedAt: nextCompleted ? new Date().toISOString() : null,
    };

    // Confetti celebration & gentle audio ping on completion
    if (nextCompleted) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#D4AF37', '#F5D76E', '#FFFFFF', '#AA820A'],
        });
        if (settings.soundEnabled) {
          playChime('pulse');
        }
      } catch (e) {
        console.warn('Confetti effect failed', e);
      }
    }

    await updateReminder(id, updates);
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const snoozeReminder = async (id: string, minutes: number) => {
    const target = reminders.find((r) => r.id === id);
    if (!target) return;

    const [hours, mins] = target.dueTime.split(':').map(Number);
    const dateObj = new Date(`${target.dueDate}T${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`);
    dateObj.setMinutes(dateObj.getMinutes() + minutes);

    const newDueDate = dateObj.toISOString().split('T')[0];
    const newDueTime = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

    const updates: Partial<Reminder> = {
      dueDate: newDueDate,
      dueTime: newDueTime,
      notified: false,
    };

    await updateReminder(id, updates);
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    if (activeAlarm?.id === id) {
      setActiveAlarm(null);
    }
  };

  const clearCompletedReminders = async () => {
    const completedItems = reminders.filter((r) => r.completed);
    for (const item of completedItems) {
      await removeReminderService(item.id);
    }
    setReminders((prev) => prev.filter((r) => !r.completed));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotificationHistory = async () => {
    if (user) {
      await clearNotificationsService(user.uid);
      setNotifications([]);
    }
  };

  const triggerTestNotification = () => {
    if (settings.soundEnabled) {
      playChime(settings.chimeTone);
    }
    showBrowserNotification('🔔 Luxury Gold Alert', {
      body: 'This is a test notification from REMEMBER ME – Smart Reminder & Personal Planner.',
    });

    if (user) {
      const testItem: Omit<NotificationItem, 'id'> = {
        title: 'System Test Notification',
        message: 'Audio chime and push trigger successfully dispatched in Asia/Kolkata timezone.',
        timestamp: new Date().toISOString(),
        read: false,
        type: 'system',
        priority: 'high',
      };
      recordNotification(user.uid, testItem).then((saved) => {
        setNotifications((prev) => [saved, ...prev]);
      });
    }
  };

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Filtered & Sorted Reminders calculation
  const filteredReminders = useMemo(() => {
    return reminders.filter((r) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(query);
        const matchDesc = r.description?.toLowerCase().includes(query);
        const matchTags = r.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchTags) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && r.category !== selectedCategory) {
        return false;
      }

      // Priority filter
      if (selectedPriority !== 'all' && r.priority !== selectedPriority) {
        return false;
      }

      // Status filter
      if (statusFilter === 'pending' && r.completed) return false;
      if (statusFilter === 'completed' && !r.completed) return false;
      if (statusFilter === 'overdue') {
        const overdue = isOverdueKolkata(r.dueDate, r.dueTime);
        if (r.completed || !overdue) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-asc') {
        const dateDiff = a.dueDate.localeCompare(b.dueDate);
        if (dateDiff !== 0) return dateDiff;
        return a.dueTime.localeCompare(b.dueTime);
      }
      if (sortBy === 'date-desc') {
        const dateDiff = b.dueDate.localeCompare(a.dueDate);
        if (dateDiff !== 0) return dateDiff;
        return b.dueTime.localeCompare(a.dueTime);
      }
      if (sortBy === 'priority-desc') {
        const pWeight: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
        return pWeight[b.priority] - pWeight[a.priority];
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [reminders, searchQuery, selectedCategory, selectedPriority, statusFilter, sortBy]);

  // Statistics calculation in Asia/Kolkata
  const stats = useMemo(() => {
    const todayStr = getKolkataDateString();
    const total = reminders.length;
    const completed = reminders.filter((r) => r.completed).length;
    const pending = total - completed;
    const todayDue = reminders.filter((r) => !r.completed && r.dueDate === todayStr).length;
    const highPriorityPending = reminders.filter((r) => !r.completed && r.priority === 'high').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      todayDue,
      completionRate,
      highPriorityPending,
    };
  }, [reminders]);

  return (
    <RemindersContext.Provider
      value={{
        reminders,
        filteredReminders,
        notifications,
        unreadNotificationCount,
        loading,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedPriority,
        setSelectedPriority,
        statusFilter,
        setStatusFilter,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        settings,
        updateSettings,
        activeAlarm,
        dismissAlarm,
        addNewReminder,
        updateExistingReminder,
        deleteExistingReminder,
        toggleReminderComplete,
        snoozeReminder,
        clearCompletedReminders,
        markAllNotificationsRead,
        clearNotificationHistory,
        triggerTestNotification,
        stats,
      }}
    >
      {children}
    </RemindersContext.Provider>
  );
};

export const useReminders = (): RemindersContextType => {
  const context = useContext(RemindersContext);
  if (!context) {
    throw new Error('useReminders must be used within a RemindersProvider');
  }
  return context;
};
