import React, { useState } from 'react';
import {
  User,
  Shield,
  Save,
  CheckCircle,
  Sparkles,
  Mail,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
  'https://api.dicebear.com/7.x/bottts/svg?seed=gold1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=gold2',
];

export const ProfilePage: React.FC = () => {
  const { user, updateUserBioAndName } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || AVATAR_PRESETS[0]);
  const [bio, setBio] = useState('Executive productivity architect & precision planner.');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserBioAndName(displayName.trim(), photoURL);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="pb-2">
        <h1 className="text-[26px] font-extrabold text-white tracking-tight">
          Member Profile
        </h1>
        <p className="text-[14px] text-[#B8B8B8] mt-1">
          Manage your personal credentials, executive status, and member profile
        </p>
      </div>

      <div className="rounded-2xl bg-[#191919] p-6 sm:p-7 border border-[#D4AF37]/30 shadow-xl space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-[#D4AF37]/20">
          <User className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="text-[21px] font-bold text-white">
            Personal Credentials
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Avatar Selector */}
          <div>
            <label className="block text-[12px] font-semibold text-[#B8B8B8] mb-2">
              Select Luxury Avatar
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <img
                src={photoURL}
                alt="Active Avatar"
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#D4AF37] shadow-lg shadow-[#D4AF37]/20"
              />
              <div className="flex flex-wrap items-center gap-2">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <img
                    key={idx}
                    src={preset}
                    alt={`Preset ${idx}`}
                    onClick={() => setPhotoURL(preset)}
                    className={`w-10 h-10 rounded-xl object-cover cursor-pointer hover:scale-105 transition-transform border-2 ${
                      photoURL === preset
                        ? 'border-[#F5D76E] ring-2 ring-[#D4AF37]'
                        : 'border-transparent opacity-65 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#B8B8B8] mb-1">
                Full Display Name
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full px-3.5 py-2.5 text-[14px] rounded-xl bg-[#141414] border border-[#D4AF37]/30 text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#B8B8B8] mb-1">
                Registered Email Address
              </label>
              <input
                type="text"
                disabled
                value={user?.email || 'alex.gold@rememberme.app'}
                className="w-full px-3.5 py-2.5 text-[14px] rounded-xl bg-[#141414] border border-[#2B2B2B] text-[#7A7A7A] cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#B8B8B8] mb-1">
              Personal Bio / Purpose
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2 text-[14px] rounded-xl bg-[#141414] border border-[#D4AF37]/30 text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37] resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {saveSuccess ? (
              <span className="text-[14px] font-semibold text-[#F5D76E] flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#D4AF37]" /> Profile credentials saved in Firestore!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-6 py-2.5 text-[14px] font-bold rounded-xl btn-gold text-black shadow-lg shadow-[#D4AF37]/25 flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
