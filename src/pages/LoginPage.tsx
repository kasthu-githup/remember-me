import React, { useState } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { NavigationPage } from '../types';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { loginWithEmail, loginWithGoogle, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!email.trim() || !password) {
      setLocalError('Please enter both your email address and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await loginWithEmail(email, password);
      onNavigate('dashboard');
    } catch {
      // Error handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsSubmitting(true);
      await loginWithGoogle();
      onNavigate('dashboard');
    } catch {
      // Handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeError = localError || error;

  return (
    <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Golden luxury ambient backdrops */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div
            onClick={() => onNavigate('landing')}
            className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F5D76E] items-center justify-center shadow-lg shadow-[#D4AF37]/25 mb-3 hover:scale-105 transition-transform cursor-pointer"
          >
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-[26px] font-extrabold tracking-tight bg-gradient-to-r from-white via-[#F5D76E] to-[#D4AF37] bg-clip-text text-transparent">
            REMEMBER ME
          </h1>
          <p className="text-[14px] text-[#B8B8B8] mt-1">
            Sign in to access your luxury smart planner & reminder suite
          </p>
        </div>

        {/* 3D Glassmorphic Form Card */}
        <div className="rounded-3xl bg-[#191919] p-6 sm:p-8 border border-[#D4AF37]/30 shadow-2xl">
          {activeError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-700/60 text-red-300 text-[12px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{activeError}</span>
            </div>
          )}

          {/* Google Sign-in */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] border border-[#333333] text-white text-[14px] font-semibold transition-all flex items-center justify-center gap-3 mb-5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-[#D4AF37]/20 w-full" />
            <span className="bg-[#191919] px-3 text-[12px] uppercase tracking-wider font-semibold text-[#7A7A7A] shrink-0">
              or sign in with email
            </span>
            <div className="border-t border-[#D4AF37]/20 w-full" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div>
              <label className="block text-[12px] font-semibold text-[#B8B8B8] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@rememberme.app"
                  className="w-full pl-9 pr-3.5 py-2.5 text-[14px] rounded-xl bg-[#141414] border border-[#D4AF37]/30 text-white placeholder-[#7A7A7A] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[12px] font-semibold text-[#B8B8B8]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-[12px] font-semibold text-[#F5D76E] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2.5 text-[14px] rounded-xl bg-[#141414] border border-[#D4AF37]/30 text-white placeholder-[#7A7A7A] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7A7A] hover:text-[#F5D76E]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#D4AF37] focus:ring-[#D4AF37] bg-[#141414] border-[#D4AF37]/40"
                />
                <span className="text-[12px] text-[#B8B8B8]">Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl btn-gold text-black text-[14px] font-bold shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 pt-4 border-t border-[#D4AF37]/20 flex items-center justify-between text-[14px]">
            <button
              onClick={() => onNavigate('landing')}
              className="text-[12px] text-[#B8B8B8] hover:text-white"
            >
              ← View Presentation
            </button>
            <p className="text-[14px] text-[#B8B8B8]">
              New here?{' '}
              <button
                onClick={() => onNavigate('signup')}
                className="text-[#F5D76E] font-bold hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
