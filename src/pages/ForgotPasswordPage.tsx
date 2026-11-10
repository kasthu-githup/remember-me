import React, { useState } from 'react';
import {
  Sparkles,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { NavigationPage } from '../types';
import { useAuth } from '../context/AuthContext';

interface ForgotPasswordPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const { sendResetEmail, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!email.trim()) {
      setLocalError('Please enter your email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      await sendResetEmail(email);
      setSuccess(true);
    } catch {
      // Handled by auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeError = localError || error;

  return (
    <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <div
            onClick={() => onNavigate('landing')}
            className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F5D76E] items-center justify-center shadow-lg shadow-[#D4AF37]/25 mb-3 hover:scale-105 transition-transform cursor-pointer"
          >
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-[26px] font-extrabold tracking-tight bg-gradient-to-r from-white via-[#F5D76E] to-[#D4AF37] bg-clip-text text-transparent">
            Reset Password
          </h1>
          <p className="text-[14px] text-[#B8B8B8] mt-1">
            Dispatch a secure password recovery link to your inbox
          </p>
        </div>

        <div className="rounded-3xl bg-[#191919] p-6 sm:p-8 border border-[#D4AF37]/30 shadow-2xl">
          {success ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5D76E] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-[21px] font-bold text-white">
                Recovery Link Dispatched
              </h3>
              <p className="text-[14px] text-[#B8B8B8] mt-2 leading-relaxed">
                If an account exists for <span className="font-semibold text-[#F5D76E]">{email}</span>, you will receive password reset instructions within moments.
              </p>
              <button
                onClick={() => onNavigate('login')}
                className="mt-6 w-full py-2.5 px-4 rounded-xl btn-gold text-black text-[14px] font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </button>
            </div>
          ) : (
            <>
              {activeError && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-700/60 text-red-300 text-[12px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{activeError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#B8B8B8] mb-1">
                    Your Registered Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@rememberme.app"
                      className="w-full pl-9 pr-3.5 py-2.5 text-[14px] rounded-xl bg-[#141414] border border-[#D4AF37]/30 text-white placeholder-[#7A7A7A] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl btn-gold text-black text-[14px] font-bold shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Dispatching Link...' : 'Send Recovery Link'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-[#D4AF37]/20 text-center">
                <button
                  onClick={() => onNavigate('login')}
                  className="text-[14px] text-[#F5D76E] font-bold hover:underline inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
