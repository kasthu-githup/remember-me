import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Volume2,
  Database,
  Sparkles,
  Download,
  Upload,
  LogOut,
  Play,
  Globe,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { ChimeTone } from '../types';
import { useAuth } from '../context/AuthContext';
import { useReminders } from '../context/RemindersContext';
import { playChime } from '../utils/audio';
import { requestNotificationPermission, getNotificationPermissionStatus } from '../utils/notifications';
import { APP_TIMEZONE } from '../utils/timezone';

export const SettingsPage: React.FC = () => {
  const { logout, isFirebaseLive } = useAuth();
  const { reminders, settings, updateSettings } = useReminders();

  const [pushStatus, setPushStatus] = useState<NotificationPermission>(
    getNotificationPermissionStatus()
  );

  const handleTestAudio = (tone: ChimeTone) => {
    playChime(tone);
  };

  const handleRequestPush = async () => {
    const perm = await requestNotificationPermission();
    setPushStatus(perm);
    if (perm === 'granted') {
      updateSettings({ browserNotificationsEnabled: true });
    }
  };

  // Export reminders to JSON file
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reminders, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `remember_me_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import reminders from JSON file
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          localStorage.setItem('remember_me_local_reminders', JSON.stringify(parsed));
          window.location.reload();
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="pb-2">
        <h1 className="text-[26px] font-extrabold text-white tracking-tight">
          System Settings & Preferences
        </h1>
        <p className="text-[14px] text-[#B8B8B8] mt-1">
          Configure notification alarms, timezone scheduling, cloud synchronization, and data backups
        </p>
      </div>

      {/* Timezone Configuration Section */}
      <div className="rounded-2xl bg-[#191919] p-6 border border-[#D4AF37]/30 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-[21px] font-bold text-white">
              Application Timezone
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-[#D4AF37]/20 text-[#F5D76E] border border-[#D4AF37]/40">
            Active: {APP_TIMEZONE} (IST)
          </span>
        </div>
        <p className="text-[14px] text-[#B8B8B8] leading-relaxed">
          All reminders, hourly planner blocks, and alarm clocks operate strictly in Indian Standard Time (UTC+05:30).
        </p>
      </div>

      {/* Alarms & Audio Chimes */}
      <div className="rounded-2xl bg-[#191919] p-6 border border-[#D4AF37]/30 shadow-md space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-[#D4AF37]/20">
          <Volume2 className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="text-[21px] font-bold text-white">
            Audio Alarm Chimes
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-[17px] font-bold text-white">
              Enable Sound Alarms
            </h4>
            <p className="text-[12px] text-[#B8B8B8]">
              Plays high-fidelity synthesized chime when a reminder reaches exact due time
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
            className="w-5 h-5 rounded text-[#D4AF37] focus:ring-[#D4AF37] bg-[#141414] border-[#D4AF37]/40"
          />
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-[#B8B8B8] mb-2">
            Select Chime Tone (Click to preview)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(
              [
                { id: 'bell', name: 'Celestial Bell' },
                { id: 'gentle', name: 'Lavender Swell' },
                { id: 'pulse', name: 'Digital Pulse' },
                { id: 'harp', name: 'Harmonic Harp' },
              ] as { id: ChimeTone; name: string }[]
            ).map((tone) => (
              <div
                key={tone.id}
                onClick={() => {
                  updateSettings({ chimeTone: tone.id });
                  handleTestAudio(tone.id);
                }}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  settings.chimeTone === tone.id
                    ? 'bg-[#222222] border-[#F5D76E] text-[#F5D76E] font-bold shadow-md'
                    : 'bg-[#141414] border-[#D4AF37]/20 text-[#B8B8B8] hover:bg-[#1E1E1E]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px]">{tone.name}</span>
                  <Play className="w-3.5 h-3.5 text-[#D4AF37]" />
                </div>
                <span className="text-[12px] text-[#7A7A7A]">Click to test</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[#D4AF37]/20 flex items-center justify-between">
          <div>
            <h4 className="text-[17px] font-bold text-white">
              Desktop Push Notifications
            </h4>
            <p className="text-[12px] text-[#B8B8B8]">
              Status: <span className="font-bold uppercase text-[#F5D76E]">{pushStatus}</span>
            </p>
          </div>
          {pushStatus !== 'granted' ? (
            <button
              onClick={handleRequestPush}
              className="px-4 py-2 rounded-xl btn-gold text-black text-[14px] font-bold shadow-sm"
            >
              Request Permission
            </button>
          ) : (
            <span className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37]/20 text-[#F5D76E] text-[12px] font-bold border border-[#D4AF37]/40">
              ✓ Active
            </span>
          )}
        </div>
      </div>

      {/* Cloud Database Connection Info */}
      <div className="rounded-2xl bg-[#191919] p-6 border border-[#D4AF37]/30 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-[21px] font-bold text-white">
              Cloud Database & FCM Engine
            </h2>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[12px] font-bold ${
              isFirebaseLive
                ? 'bg-[#D4AF37]/20 text-[#F5D76E] border border-[#D4AF37]/40'
                : 'bg-[#222222] text-[#B8B8B8] border border-[#333333]'
            }`}
          >
            {isFirebaseLive ? 'Connected to Cloud Firestore' : 'Sandbox Persistence Store'}
          </span>
        </div>

        <p className="text-[14px] text-[#B8B8B8] leading-relaxed">
          {isFirebaseLive
            ? 'Your application is connected to Google Cloud Firestore with per-user authentication and automatic multi-device synchronization.'
            : 'Running in safe local sandbox mode. Add your Firebase keys to `.env` anytime to enable real-time multi-device cloud replication.'}
        </p>
      </div>

      {/* Data Backup & Sign Out */}
      <div className="rounded-2xl bg-[#191919] p-6 border border-[#D4AF37]/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportData}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#222222] hover:bg-[#2A2A2A] text-[#F5D76E] font-bold text-[14px] border border-[#D4AF37]/30 flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>

          <label className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#222222] hover:bg-[#2A2A2A] text-[#F5D76E] font-bold text-[14px] border border-[#D4AF37]/30 flex items-center justify-center gap-2 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>
        </div>

        <button
          onClick={logout}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 font-bold text-[14px] border border-red-700/50 flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
