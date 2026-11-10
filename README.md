# ✨ REMEMBER ME – Smart Reminder & Personal Planner (Black & Gold Luxury Edition)

A complete, production-ready web application built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Firebase (Auth, Cloud Firestore & Cloud Messaging)**.

Crafted with a luxury **Black & Gold** aesthetic featuring `#080808` obsidian backgrounds, `#191919` glassmorphic cards, `#D4AF37` imperial gold accents, exact medium typography, **Asia/Kolkata (IST)** timezone scheduling, and synthesized Web Audio alarms.

---

## 🎨 Luxury Black & Gold Design Specifications

| Element | Color / Value | Description |
|---|---|---|
| **Main Background** | `#080808` | Deep luxury obsidian |
| **Secondary Background** | `#151515` | Elevated dark contrast |
| **Card Background** | `#191919` | Refined glassmorphism cards with `backdrop-filter: blur(16px)` |
| **Primary Gold** | `#D4AF37` | Imperial gold for badges, borders, icons, and buttons |
| **Light Gold** | `#F5D76E` | Highlight gold for active states and typography |
| **Subtle Borders** | `rgba(212, 175, 55, 0.25)` | Elegant gold lining |
| **Main Text** | `#FFFFFF` | Crisp white for maximum legibility |
| **Secondary Text** | `#B8B8B8` | Subdued platinum for secondary notes |
| **Buttons** | Gold Gradient | `#F5D76E` to `#D4AF37` with pitch black text (`#080808`) |

---

## 📐 Strict Equal Medium Typography System

| Typography Level | Size | Usage |
|---|---|---|
| **Main Headings** | `26px` | Page titles & hero headers |
| **Section Headings** | `21px` | Section headers & modal titles |
| **Card Headings** | `17px` | Reminder card titles & widget headers |
| **Body Text** | `14px` | Descriptions & long-form content |
| **Navigation** | `14px` | Sidebar & menu labels |
| **Buttons** | `14px` | Call-to-action & button text |
| **Input Fields** | `14px` | Form fields & textareas |
| **Small Labels** | `12px` | Timestamps, priority badges & metadata |

*Font Family: Inter & Plus Jakarta Sans with geometric consistency.*

---

## 🚀 Live Launch Options

### Option 1: Instant Zero-Install Browser Launch (Recommended)
Open **[`standalone.html`](./standalone.html)** directly in any modern browser:
- ⚡ **Zero installation or build step needed**
- 🔒 **Login page opens first** by default
- 🔔 12 pages, audio chimes, reminders, calendar, and daily planner work immediately in the browser
- 💾 Persistent client storage via `localStorage` in `Asia/Kolkata` timezone

### Option 2: Built-in Local HTTP Server
```bash
node server.js
```
Then visit: **[http://localhost:3000](http://localhost:3000)**

### Option 3: Full Vite + TypeScript Build
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

---

## 📱 12 Complete Pages & Views

1. **Login Page**: Opens first when visiting unauthenticated. Features email/password login, Google Sign-In, Show/Hide password toggle, Forgot Password link, Create Account link, and **1-Click VIP Demo Access**.
2. **Signup Page**: Full name, email, password, confirm password, Google Sign-Up, Firestore user profile registration, and redirection to login.
3. **Landing Page**: Executive Black & Gold presentation showcase with 3D floating reminder card mockups, feature matrix, audio chime preview, testimonials, social proof, and CTA.
4. **Forgot Password Page**: Password recovery link dispatcher via Firebase Auth with confirmation feedback and Return to Sign In.
5. **Dashboard**: Greeting in IST (*Good Morning / Good Afternoon / Good Evening, [Name]*), Today's Priority Reminders, Upcoming Tasks, Completed Tasks, Pending Tasks, 4 Metric Stat Cards, Weekly Performance Bar Chart, Mini Calendar Widget, Quick Add button, and Recent Notifications feed.
6. **My Reminders**: Search bar, Category tabs (Work, Personal, Health, Finance, Study, Family), Priority filters (High, Medium, Low), Status filters (Pending, Completed, Overdue), Sort selector (Date, Priority, Title), Grid & List view toggles, Snooze menu (+15m, +1h, +1d), Edit, and Delete.
7. **Calendar**: Full-month interactive visual calendar grid, previous/next month navigation, Today button, priority indicator dots, selected day agenda drawer, and single-click "Add to Day".
8. **Daily Planner**: Hourly time-blocking schedule (06:00 AM to 10:00 PM), Top 3 Daily Focus Goals, Daily Habit Rituals checklist, and Evening Reflection & Notes textarea.
9. **Completed Tasks**: Historical accomplishment archive, completion timestamp tracking, Restore Task button, gold confetti celebration, and Clear History with modal confirmation.
10. **Notification Center**: Dedicated page for notification history logs, unread notification counter, mark all as read, clear history, and instant test notification trigger.
11. **Profile**: Member credentials, avatar selection (presets + custom URL), display name editor, bio textarea, and account status.
12. **Settings**: Alarms toggle, chime tone selection with live audio test (Celestial Bell, Lavender Swell, Digital Pulse, Harmonic Harp), desktop push notification permission manager, Asia/Kolkata timezone status, JSON Export & Import backup, and Sign Out.

---

## 🌍 Timezone & Background Scheduling Architecture

- **Timezone**: Strict **`Asia/Kolkata` (IST - UTC+05:30)** alignment across all reminder comparisons and date formatting.
- **Service Worker (`public/firebase-messaging-sw.js`)**: Listens for background push events and displays notifications even when the browser tab is closed.
- **Server-Side Scheduler (`server-scheduler.js`)**: Continuous Node.js background process comparing reminders in Asia/Kolkata timezone and dispatching FCM push notifications when due.

---

## 🌐 Netlify Deployment

Pre-configured with **[`netlify.toml`](./netlify.toml)** for SPA routing and security headers.
Deploy via GitHub or publish directory `dist`.
