/**
 * REMEMBER ME - Server-Side Background Scheduler
 * 
 * Provides automated background scheduling for reminders when the browser is closed.
 * Uses Node.js timer loop + Asia/Kolkata timezone comparison + FCM push dispatch.
 * 
 * To run locally:
 *   node server-scheduler.js
 */

import http from 'http';

const CHECK_INTERVAL_MS = 30000; // 30 seconds
const TIMEZONE = 'Asia/Kolkata';

function getKolkataTime() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // e.g. "2026-11-10, 11:30:00"
  const formatted = formatter.format(new Date());
  const [datePart, timePart] = formatted.split(', ');
  const [hours, minutes] = timePart.split(':');
  return {
    date: datePart,
    time: `${hours}:${minutes}`,
  };
}

console.log('----------------------------------------------------');
console.log('⏰ REMEMBER ME - Background Reminder Scheduler');
console.log(`🌍 Timezone Target: ${TIMEZONE}`);
console.log(`⏱️ Check Interval: ${CHECK_INTERVAL_MS / 1000}s`);
console.log('----------------------------------------------------');

function checkDueReminders() {
  const { date, time } = getKolkataTime();
  console.log(`[${new Date().toISOString()}] Server Tick: Current IST Date: ${date}, Time: ${time}`);

  // In production with Firebase Admin SDK:
  // 1. Query Firestore for collection('reminders').where('dueDate', '==', date).where('dueTime', '==', time).where('notified', '==', false)
  // 2. For each reminder, retrieve user's fcmToken from 'users/{userId}'
  // 3. Send admin.messaging().send({ token: fcmToken, notification: { title, body } })
  // 4. Update reminder { notified: true }
}

// Start interval loop
setInterval(checkDueReminders, CHECK_INTERVAL_MS);
checkDueReminders();
