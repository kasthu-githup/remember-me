/**
 * Timezone Utility for Asia/Kolkata (IST - UTC+05:30)
 */

export const APP_TIMEZONE = 'Asia/Kolkata';

export function getKolkataDate(): Date {
  // Returns current date adjusted to Asia/Kolkata
  const now = new Date();
  const kolkataStr = now.toLocaleString('en-US', { timeZone: APP_TIMEZONE });
  return new Date(kolkataStr);
}

export function getKolkataDateString(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: APP_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date); // Returns YYYY-MM-DD
}

export function getKolkataTimeString(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: APP_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return formatter.format(date); // Returns HH:mm
}

export function formatKolkataDisplay(dateStr: string, timeStr?: string): string {
  try {
    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const d = new Date(year, month, day);
    const dateFormatted = d.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    if (!timeStr) return dateFormatted;

    // Convert 24h HH:mm to 12h AM/PM
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    const minutePad = String(m).padStart(2, '0');

    return `${dateFormatted}, ${hour12}:${minutePad} ${ampm} IST`;
  } catch {
    return `${dateStr} ${timeStr || ''}`;
  }
}

export function isOverdueKolkata(dateStr: string, timeStr: string): boolean {
  const today = getKolkataDateString();
  const currentTime = getKolkataTimeString();

  if (dateStr < today) return true;
  if (dateStr === today && timeStr < currentTime) return true;
  return false;
}
