import React, { useState } from 'react';
import { Mail, ArrowLeft, RefreshCw, CheckCircle2, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface SendedPageProps {
  email: string;
  onBackToSignIn: () => void;
  onResendLink?: (email: string) => void;
}

export interface EmailProviderInfo {
  providerName: string;
  url: string;
}

export function getEmailProviderInfo(email: string): EmailProviderInfo {
  const domain = email && email.includes('@') ? email.split('@')[1].toLowerCase().trim() : '';

  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    return { providerName: 'Gmail', url: 'https://mail.google.com' };
  }
  if (['outlook.com', 'hotmail.com', 'live.com', 'msn.com', 'passport.com'].includes(domain)) {
    return { providerName: 'Outlook', url: 'https://outlook.live.com' };
  }
  if (['yahoo.com', 'ymail.com', 'rocketmail.com'].includes(domain)) {
    return { providerName: 'Yahoo Mail', url: 'https://mail.yahoo.com' };
  }
  if (['icloud.com', 'me.com', 'mac.com'].includes(domain)) {
    return { providerName: 'iCloud Mail', url: 'https://www.icloud.com/mail' };
  }
  if (['proton.me', 'protonmail.com', 'pm.me'].includes(domain)) {
    return { providerName: 'ProtonMail', url: 'https://mail.proton.me' };
  }
  if (['zoho.com', 'zohomail.com'].includes(domain)) {
    return { providerName: 'Zoho Mail', url: 'https://mail.zoho.com' };
  }
  if (['yandex.ru', 'yandex.com', 'ya.ru'].includes(domain)) {
    return { providerName: 'Yandex Mail', url: 'https://mail.yandex.com' };
  }
  if (['mail.ru', 'inbox.ru', 'list.ru', 'bk.ru'].includes(domain)) {
    return { providerName: 'Mail.ru', url: 'https://e.mail.ru' };
  }
  if (domain === 'aol.com') {
    return { providerName: 'AOL Mail', url: 'https://mail.aol.com' };
  }

  // Fallback for custom or enterprise domain names
  if (domain) {
    const brandName = domain.split('.')[0];
    const capitalized = brandName.charAt(0).toUpperCase() + brandName.slice(1);
    return { providerName: `${capitalized} Mail`, url: `https://mail.${domain}` };
  }

  return { providerName: 'Gmail', url: 'https://mail.google.com' };
}

export default function SendedPage({ email, onBackToSignIn, onResendLink }: SendedPageProps) {
  const [resent, setResent] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const displayEmail = email || 'your email';
  const { providerName, url } = getEmailProviderInfo(displayEmail);

  const handleResend = async () => {
    setIsResending(true);
    if (onResendLink) {
      await onResendLink(displayEmail);
    }
    setTimeout(() => {
      setIsResending(false);
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-[#05050d] text-white flex flex-col justify-between items-center font-sans relative overflow-hidden p-4 sm:p-6">
      
      {/* Background Decorative Glow Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[450px] h-[450px] bg-purple-900/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-indigo-900/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed top-[30%] left-[40%] w-[350px] h-[350px] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none" />

      {/* TOP BRAND HEADER */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between py-4 z-20">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onBackToSignIn}>
          <img
            src="/softview_logo.png"
            alt="SoftView Logo"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
            className="h-9 object-contain"
          />
          <span className="text-xl font-black tracking-tight text-white font-sans">
            Soft<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">View</span>
          </span>
        </div>

        <button
          onClick={onBackToSignIn}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </button>
      </header>

      {/* CENTER CONTENT CARD */}
      <main className="w-full max-w-md my-auto z-20 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="bg-[#0a0d1d]/90 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(79,70,229,0.2)] backdrop-blur-2xl text-center relative"
        >
          {/* Animated Mail Icon Pulse Ring */}
          <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-indigo-600/20 rounded-2xl animate-ping opacity-40" />
            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 rounded-2xl p-0.5 shadow-xl shadow-indigo-600/30 flex items-center justify-center">
              <div className="w-full h-full bg-[#0a0d1d] rounded-[14px] flex items-center justify-center">
                <Mail className="w-9 h-9 text-cyan-400" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-[#0a0d1d]">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-black tracking-tight text-white mb-2">
            Check your Inbox
          </h1>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate max-w-[240px] sm:max-w-[280px]">{displayEmail}</span>
          </div>

          {/* Main Requested Message */}
          <p className="text-sm text-gray-300 leading-relaxed font-medium mb-6 px-1 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
            We send an email with Sign Up link. Press the button in the mail. If it is not visible, also check for "Spam" panel.
          </p>

          {/* Open {email_provider} Button */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2.5 mb-4 group cursor-pointer"
          >
            <Mail className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
            <span>Open {providerName}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* Resend Link & Back Actions */}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/10 text-xs text-gray-400">
            <div className="flex items-center justify-between px-1">
              <span>Didn't get the email?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                <span>{resent ? 'Link Resent!' : 'Resend Email'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onBackToSignIn}
              className="mt-2 text-gray-400 hover:text-white transition-colors text-center text-xs font-medium"
            >
              Entered wrong email? <span className="text-indigo-400 font-bold underline">Change email address</span>
            </button>
          </div>
        </motion.div>
      </main>

      {/* FOOTER BADGE */}
      <footer className="w-full max-w-4xl mx-auto py-4 text-center z-20">
        <div className="inline-flex items-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Secured by SoftView & Supabase Authentication</span>
        </div>
      </footer>

    </div>
  );
}
