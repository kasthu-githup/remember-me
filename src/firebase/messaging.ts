import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { app, isFirebaseConfigured } from './config';

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/',
    });
    return registration;
  } catch (err) {
    console.warn('Service Worker registration skipped or failed:', err);
    return null;
  }
}

export async function requestFCMToken(vapidKey?: string): Promise<string | null> {
  if (!isFirebaseConfigured() || !app) {
    console.info('Firebase is in demo/local mode. FCM token generation deferred.');
    return null;
  }

  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn('FCM messaging is not supported in this browser context.');
      return null;
    }

    const swReg = await registerServiceWorker();
    if (!swReg) return null;

    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      serviceWorkerRegistration: swReg,
      vapidKey: vapidKey || import.meta.env.VITE_FIREBASE_VAPID_KEY || undefined,
    });

    return token;
  } catch (err) {
    console.warn('Error fetching FCM token:', err);
    return null;
  }
}

export function subscribeToForegroundFCM(
  onPayload: (payload: unknown) => void
): (() => void) | null {
  if (!isFirebaseConfigured() || !app) return null;

  try {
    const messaging = getMessaging(app);
    return onMessage(messaging, (payload) => {
      onPayload(payload);
    });
  } catch (err) {
    console.warn('Foreground FCM subscription failed:', err);
    return null;
  }
}
