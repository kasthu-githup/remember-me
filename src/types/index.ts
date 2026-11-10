export type Priority = 'low' | 'medium' | 'high';

export type Category = 'all' | 'work' | 'personal' | 'health' | 'finance' | 'study' | 'family';

export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD (Asia/Kolkata)
  dueTime: string; // HH:mm (24-hour format)
  priority: Priority;
  category: Category;
  completed: boolean;
  completedAt?: string | null;
  recurrence?: Recurrence;
  tags?: string[];
  notified?: boolean;
  notifyBefore?: number; // 0 (exact), 5, 15, 30, 60 minutes before
  timezone?: string; // 'Asia/Kolkata'
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  reminderId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'alarm' | 'system' | 'reminder';
  priority?: Priority;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt?: string;
  bio?: string;
  fcmToken?: string;
}

export type ChimeTone = 'bell' | 'gentle' | 'pulse' | 'harp';

export interface UserSettings {
  soundEnabled: boolean;
  chimeTone: ChimeTone;
  browserNotificationsEnabled: boolean;
  theme: 'dark' | 'luxury-gold';
  timezone: string; // Asia/Kolkata
  dailyDigestTime: string;
  fcmRegistered: boolean;
}

export interface DailyTimeSlot {
  id: string;
  time: string; // e.g. "08:00 AM"
  activity: string;
  completed: boolean;
  reminderId?: string;
}

export interface DailyPlan {
  date: string; // YYYY-MM-DD
  topPriorities: [string, string, string];
  notes: string;
  habits: { id: string; label: string; done: boolean }[];
  timeSlots: DailyTimeSlot[];
}

export type NavigationPage =
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'landing'
  | 'dashboard'
  | 'reminders'
  | 'calendar'
  | 'daily-planner'
  | 'completed'
  | 'notifications'
  | 'profile'
  | 'settings';
