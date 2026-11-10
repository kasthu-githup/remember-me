import React from 'react';
import {
  Sparkles,
  BellRing,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Volume2,
  Layers,
  Star,
  Heart,
} from 'lucide-react';
import { NavigationPage } from '../types';
import { playChime } from '../utils/audio';

interface LandingPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 w-full bg-[#121212]/90 backdrop-blur-xl border-b border-[#D4AF37]/25 px-6 sm:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F5D76E] flex items-center justify-center shadow-lg shadow-[#D4AF37]/25">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="text-[17px] font-extrabold tracking-tight bg-gradient-to-r from-white via-[#F5D76E] to-[#D4AF37] bg-clip-text text-transparent">
              REMEMBER ME
            </span>
            <span className="hidden sm:inline-block ml-2 text-[12px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#F5D76E] border border-[#D4AF37]/35">
              Luxury 3D Suite
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => onNavigate('login')}
            className="text-[14px] font-semibold text-[#B8B8B8] hover:text-[#F5D76E] transition-colors px-3 py-2"
          >
            Sign In
          </button>
          <button
            onClick={() => onNavigate('signup')}
            className="text-[14px] font-bold px-5 py-2.5 rounded-xl btn-gold text-black shadow-lg shadow-[#D4AF37]/20 hover:-translate-y-0.5 transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-6 sm:px-12 max-w-7xl mx-auto overflow-hidden">
        {/* Golden lighting ambient glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1A1A] text-[#F5D76E] text-[12px] font-bold border border-[#D4AF37]/40 mb-6 shadow-md">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Black & Gold Executive Reminder & Productivity Suite</span>
          </div>

          <h1 className="text-[26px] sm:text-[34px] font-extrabold tracking-tight text-white leading-tight">
            Never Forget What Matters. <br />
            <span className="bg-gradient-to-r from-white via-[#F5D76E] to-[#D4AF37] bg-clip-text text-transparent">
              Master Your Executive Time in Luxury.
            </span>
          </h1>

          <p className="mt-5 text-[14px] text-[#B8B8B8] leading-relaxed max-w-2xl mx-auto font-normal">
            REMEMBER ME combines an aesthetic black and gold glassmorphic design, real-time Firebase Cloud sync, harmonic synthesized chime alarms, and structured daily time-blocking into one executive productivity suite.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('signup')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl btn-gold text-black font-bold text-[14px] shadow-xl shadow-[#D4AF37]/25 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('login')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#191919] hover:bg-[#222222] text-[#F5D76E] font-bold text-[14px] border border-[#D4AF37]/40 shadow-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In to Portal</span>
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-[12px] text-[#B8B8B8] font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Firebase Cloud Sync
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#D4AF37]" /> Asia/Kolkata (IST)
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Luxury Black & Gold
            </span>
          </div>
        </div>

        {/* 3D Glassmorphism Showcase Card Mockup */}
        <div className="mt-14 relative z-10 max-w-4xl mx-auto rounded-3xl p-1 bg-gradient-to-br from-[#D4AF37]/40 via-[#F5D76E]/20 to-[#D4AF37]/40 shadow-2xl">
          <div className="rounded-[22px] bg-[#141414] p-6 sm:p-8 border border-[#D4AF37]/30">
            {/* Top Bar Mockup */}
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-[#D4AF37]" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-[12px] font-semibold text-[#7A7A7A]">rememberme.app/dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => playChime('bell')}
                  className="px-3 py-1 rounded-lg bg-[#222222] text-[#F5D76E] text-[12px] font-bold flex items-center gap-1 hover:scale-105 transition-transform border border-[#D4AF37]/35"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" /> Sample Chime
                </button>
              </div>
            </div>

            {/* Simulated 3D Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#191919] border border-[#D4AF37]/30 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-extrabold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-700/50">
                    HIGH PRIORITY
                  </span>
                  <span className="text-[12px] text-[#7A7A7A] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#D4AF37]" /> Today 11:30
                  </span>
                </div>
                <h4 className="font-bold text-[17px] text-white">
                  Executive Strategy Review
                </h4>
                <p className="text-[14px] text-[#B8B8B8] mt-1">
                  Validate financial projections & finalize Q4 metrics.
                </p>
                <div className="mt-3 pt-3 border-t border-[#D4AF37]/15 flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#F5D76E]">
                    #Strategy #VIP
                  </span>
                  <span className="w-6 h-6 rounded-lg bg-[#D4AF37]/20 text-[#F5D76E] flex items-center justify-center text-[12px] font-bold">
                    ✓
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#191919] border border-[#D4AF37]/30 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-extrabold px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#F5D76E] border border-[#D4AF37]/40">
                    MEDIUM
                  </span>
                  <span className="text-[12px] text-[#7A7A7A] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#D4AF37]" /> 14:00
                  </span>
                </div>
                <h4 className="font-bold text-[17px] text-white">
                  Posture & Hydration Reset
                </h4>
                <p className="text-[14px] text-[#B8B8B8] mt-1">
                  Drink 500ml water and complete 5-minute thoracic stretch.
                </p>
                <div className="mt-3 pt-3 border-t border-[#D4AF37]/15 flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#F5D76E]">
                    #Health #Daily
                  </span>
                  <span className="text-[12px] font-bold text-[#F5D76E]">
                    Due in 45m
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#191919] border border-[#D4AF37]/30 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-extrabold px-2 py-0.5 rounded bg-[#222222] text-[#B8B8B8] border border-[#333333]">
                    LOW PRIORITY
                  </span>
                  <span className="text-[12px] text-[#7A7A7A] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#D4AF37]" /> 18:30
                  </span>
                </div>
                <h4 className="font-bold text-[17px] text-white">
                  Evening Reading & Reflection
                </h4>
                <p className="text-[14px] text-[#B8B8B8] mt-1">
                  Review chapters on mental clarity and high-leverage habits.
                </p>
                <div className="mt-3 pt-3 border-t border-[#D4AF37]/15 flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#F5D76E]">
                    #Learning
                  </span>
                  <span className="w-6 h-6 rounded-lg bg-[#222222] text-[#F5D76E] flex items-center justify-center text-[12px]">
                    🔔
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto border-t border-[#D4AF37]/20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-[26px] font-extrabold text-white">
            Designed for Clarity, Built for Momentum
          </h2>
          <p className="mt-2 text-[14px] text-[#B8B8B8]">
            Every feature is crafted to eliminate cognitive overload and keep your most ambitious goals front and center.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl bg-[#191919] border border-[#D4AF37]/25 shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 text-[#F5D76E] flex items-center justify-center mb-5">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-[21px] font-bold text-white mb-2">
              Luxury Black & Gold UI
            </h3>
            <p className="text-[14px] text-[#B8B8B8] leading-relaxed">
              Carefully calibrated `#080808` obsidian backgrounds, gold accents, and subtle borders provide a prestigious workspace.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#191919] border border-[#D4AF37]/25 shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 text-[#F5D76E] flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-[21px] font-bold text-white mb-2">
              Private Firebase Cloud Sync
            </h3>
            <p className="text-[14px] text-[#B8B8B8] leading-relaxed">
              Google Cloud Firestore ensures your reminders, planner notes, and completions sync instantly with per-user authorization rules.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#191919] border border-[#D4AF37]/25 shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 text-[#F5D76E] flex items-center justify-center mb-5">
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="text-[21px] font-bold text-white mb-2">
              Synthesized Harmonic Chimes
            </h3>
            <p className="text-[14px] text-[#B8B8B8] leading-relaxed">
              Crystal-clear harmonic frequencies (Tibetan bell, lavender swell, digital pulse, harp) that play on schedule without broken files.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#D4AF37]/20 py-8 px-6 text-center text-[12px] text-[#7A7A7A]">
        <div className="flex items-center justify-center gap-2 mb-2 font-bold text-[#F5D76E]">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>REMEMBER ME – Smart Reminder & Personal Planner</span>
        </div>
        <p>© 2026 Remember Me Application. All rights reserved. Luxury Black & Gold Edition.</p>
      </footer>
    </div>
  );
};
