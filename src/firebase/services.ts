import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { Reminder, DailyPlan, UserProfile, UserSettings, NotificationItem } from '../types';

const REMINDERS_COLLECTION = 'reminders';
const USERS_COLLECTION = 'users';
const NOTIFICATIONS_COLLECTION = 'notifications';
const PLANS_COLLECTION = 'plannerNotes';

const LOCAL_STORAGE_KEY = 'remember_me_local_reminders';
const LOCAL_SETTINGS_KEY = 'remember_me_settings';
const LOCAL_PLANS_KEY = 'remember_me_plans';
const LOCAL_NOTIFICATIONS_KEY = 'remember_me_notifications';

// ---------------- LOCAL STORAGE FALLBACK HELPERS ----------------

function getLocalReminders(): Reminder[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalReminders(reminders: Reminder[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reminders));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

function getLocalNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalNotifications(items: NotificationItem[]): void {
  try {
    localStorage.setItem(LOCAL_NOTIFICATIONS_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

// ---------------- REMINDERS SERVICES ----------------

export async function fetchUserReminders(userId: string): Promise<Reminder[]> {
  if (!isFirebaseConfigured() || !db) {
    return getLocalReminders().filter((r) => r.userId === userId);
  }

  try {
    const q = query(
      collection(db, REMINDERS_COLLECTION),
      where('userId', '==', userId),
      orderBy('dueDate', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Reminder, 'id'>) }));
  } catch (err) {
    console.error('Error fetching reminders from Firestore:', err);
    return getLocalReminders().filter((r) => r.userId === userId);
  }
}

export function subscribeToUserReminders(
  userId: string,
  onData: (reminders: Reminder[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!isFirebaseConfigured() || !db) {
    const local = getLocalReminders().filter((r) => r.userId === userId);
    onData(local);

    const handler = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY) {
        onData(getLocalReminders().filter((r) => r.userId === userId));
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }

  try {
    const q = query(
      collection(db, REMINDERS_COLLECTION),
      where('userId', '==', userId)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const items: Reminder[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Reminder, 'id'>),
        }));
        // Sort in memory by date and time
        items.sort((a, b) => {
          const dateDiff = a.dueDate.localeCompare(b.dueDate);
          if (dateDiff !== 0) return dateDiff;
          return a.dueTime.localeCompare(b.dueTime);
        });
        onData(items);
      },
      (error) => {
        console.error('Firestore snapshot listener error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.error('Failed to setup Firestore listener:', err);
    if (onError && err instanceof Error) onError(err);
    return () => {};
  }
}

export async function createReminder(
  userId: string,
  data: Omit<Reminder, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Reminder> {
  const now = new Date().toISOString();
  const reminderObj: Omit<Reminder, 'id'> = {
    ...data,
    userId,
    timezone: 'Asia/Kolkata',
    notifyBefore: data.notifyBefore !== undefined ? data.notifyBefore : 0,
    createdAt: now,
    updatedAt: now,
  };

  if (!isFirebaseConfigured() || !db) {
    const newId = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const newReminder: Reminder = { id: newId, ...reminderObj };
    const current = getLocalReminders();
    saveLocalReminders([newReminder, ...current]);
    return newReminder;
  }

  const docRef = await addDoc(collection(db, REMINDERS_COLLECTION), {
    ...reminderObj,
    serverTimestamp: serverTimestamp(),
  });

  return { id: docRef.id, ...reminderObj };
}

export async function updateReminder(
  reminderId: string,
  updates: Partial<Reminder>
): Promise<void> {
  const now = new Date().toISOString();

  if (!isFirebaseConfigured() || !db || reminderId.startsWith('local_')) {
    const current = getLocalReminders();
    const updated = current.map((r) =>
      r.id === reminderId ? { ...r, ...updates, updatedAt: now } : r
    );
    saveLocalReminders(updated);
    return;
  }

  const docRef = doc(db, REMINDERS_COLLECTION, reminderId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: now,
  });
}

export async function deleteReminder(reminderId: string): Promise<void> {
  if (!isFirebaseConfigured() || !db || reminderId.startsWith('local_')) {
    const current = getLocalReminders();
    saveLocalReminders(current.filter((r) => r.id !== reminderId));
    return;
  }

  const docRef = doc(db, REMINDERS_COLLECTION, reminderId);
  await deleteDoc(docRef);
}

// ---------------- NOTIFICATIONS SERVICES ----------------

export async function recordNotification(
  userId: string,
  item: Omit<NotificationItem, 'id'>
): Promise<NotificationItem> {
  const newId = 'notif_' + Date.now();
  const fullItem: NotificationItem = { id: newId, ...item };

  if (!isFirebaseConfigured() || !db) {
    const list = getLocalNotifications();
    saveLocalNotifications([fullItem, ...list]);
    return fullItem;
  }

  try {
    const docRef = await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
      ...item,
      userId,
      serverTimestamp: serverTimestamp(),
    });
    return { id: docRef.id, ...item };
  } catch {
    const list = getLocalNotifications();
    saveLocalNotifications([fullItem, ...list]);
    return fullItem;
  }
}

export async function fetchNotifications(userId: string): Promise<NotificationItem[]> {
  if (!isFirebaseConfigured() || !db) {
    return getLocalNotifications();
  }

  try {
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<NotificationItem, 'id'>) }));
  } catch {
    return getLocalNotifications();
  }
}

export async function clearAllNotifications(userId: string): Promise<void> {
  saveLocalNotifications([]);

  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, NOTIFICATIONS_COLLECTION), where('userId', '==', userId));
      const snap = await getDocs(q);
      const deletes = snap.docs.map((d) => deleteDoc(doc(db, NOTIFICATIONS_COLLECTION, d.id)));
      await Promise.all(deletes);
    } catch (e) {
      console.warn('Clear notifications failed:', e);
    }
  }
}

// ---------------- USER PROFILE & SETTINGS ----------------

export async function saveUserProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
  const now = new Date().toISOString();
  const data = { ...profile, updatedAt: now };

  localStorage.setItem(`remember_me_user_${userId}`, JSON.stringify(data));

  if (isFirebaseConfigured() && db) {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(userRef, data, { merge: true });
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (isFirebaseConfigured() && db) {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const snap = await getDoc(userRef);
      if (snap.exists()) return snap.data() as UserProfile;
    } catch {
      // fallback to local
    }
  }

  const raw = localStorage.getItem(`remember_me_user_${userId}`);
  return raw ? JSON.parse(raw) : null;
}

export function saveLocalSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Could not save settings locally', e);
  }
}

export function getLocalSettings(): UserSettings {
  const defaultSettings: UserSettings = {
    soundEnabled: true,
    chimeTone: 'bell',
    browserNotificationsEnabled: false,
    theme: 'luxury-gold',
    timezone: 'Asia/Kolkata',
    dailyDigestTime: '08:00',
    fcmRegistered: false,
  };

  try {
    const raw = localStorage.getItem(LOCAL_SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

// ---------------- DAILY PLANNER SERVICES ----------------

export async function saveDailyPlanData(userId: string, plan: DailyPlan): Promise<void> {
  const key = `${userId}_${plan.date}`;

  try {
    const allPlans = JSON.parse(localStorage.getItem(LOCAL_PLANS_KEY) || '{}');
    allPlans[key] = plan;
    localStorage.setItem(LOCAL_PLANS_KEY, JSON.stringify(allPlans));
  } catch (e) {
    console.warn('Failed to save daily plan to storage', e);
  }

  if (isFirebaseConfigured() && db) {
    const planRef = doc(db, PLANS_COLLECTION, key);
    await setDoc(planRef, { ...plan, userId, updatedAt: new Date().toISOString() }, { merge: true });
  }
}

export async function fetchDailyPlanData(userId: string, date: string): Promise<DailyPlan | null> {
  const key = `${userId}_${date}`;

  if (isFirebaseConfigured() && db) {
    try {
      const planRef = doc(db, PLANS_COLLECTION, key);
      const snap = await getDoc(planRef);
      if (snap.exists()) return snap.data() as DailyPlan;
    } catch {
      // fallback to local
    }
  }

  try {
    const allPlans = JSON.parse(localStorage.getItem(LOCAL_PLANS_KEY) || '{}');
    return allPlans[key] || null;
  } catch {
    return null;
  }
}
