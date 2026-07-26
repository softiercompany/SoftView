import React, { useState } from 'react';
import { 
  User, 
  Upload, 
  Check, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Lock, 
  X, 
  Sparkles,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import LegalModal from './LegalModal';

export interface SignUpOnboardingProps {
  provider: 'google' | 'github' | 'discord' | 'email';
  email: string;
  rawName: string;
  initialUsername?: string;
  initialAvatar?: string;
  onComplete: (data: {
    displayName: string;
    username: string;
    avatarUrl: string;
    agreedToTerms: boolean;
    email: string;
    provider: string;
  }) => void;
  onCancel?: () => void;
}

export default function SignUpOnboarding({
  provider,
  email,
  rawName,
  initialUsername,
  initialAvatar,
  onComplete,
  onCancel
}: SignUpOnboardingProps) {
  // Utility function to strip @gmail.com or any email domain
  const cleanHandle = (str?: string) => {
    if (!str) return '';
    return str.includes('@') ? str.split('@')[0] : str;
  };

  // 1. Initial setup:
  // Display Name default: rawName or clean email prefix
  const cleanEmail = cleanHandle(email);
  const defaultDisplayName = (rawName && rawName !== 'User' && !rawName.includes('@')) 
    ? rawName 
    : (cleanEmail ? cleanEmail : 'SoftView User');

  // Username default: Clean handle without @gmail.com or domain suffix
  const defaultUsername = cleanHandle(initialUsername) || (
    provider === 'github' 
      ? (rawName || 'aslbek').toLowerCase().replace(/\s+/g, '_')
      : cleanEmail || 'softview_user'
  );

  const [displayName, setDisplayName] = useState<string>(defaultDisplayName);
  const [username, setUsername] = useState<string>(defaultUsername);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    initialAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop'
  );
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileSuccess, setFileSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Legal Modal popup states
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms' | 'oauth'>('terms');

  // Photo Upload Handler with MAX 1 MB Limit
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    setFileSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size: 1 MB = 1024 * 1024 = 1,048,576 bytes
    const MAX_SIZE_BYTES = 1 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setFileError(`Profile photo must be up to 1 MB. Your selected file is ${sizeMb} MB. Please upload a smaller image.`);
      e.target.value = ''; // Reset file input
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result as string);
        const sizeKb = (file.size / 1024).toFixed(0);
        setFileSuccess(`Photo uploaded successfully (${sizeKb} KB)`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Clean username from any accidental email domain suffix like @gmail.com
    let sanitizedUsername = username.trim();
    if (sanitizedUsername.includes('@')) {
      sanitizedUsername = sanitizedUsername.split('@')[0];
    }

    if (!displayName.trim()) {
      setFormError('Please enter a display name.');
      return;
    }

    if (!sanitizedUsername) {
      setFormError('Please enter a valid username handle.');
      return;
    }

    if (!agreedToTerms) {
      setFormError('You must agree to the Terms of Service and Privacy Policy to complete sign up.');
      return;
    }

    onComplete({
      displayName: displayName.trim(),
      username: sanitizedUsername,
      avatarUrl,
      agreedToTerms: true,
      email,
      provider
    });
  };

  const getProviderBadge = () => {
    if (provider === 'google') {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Signed up via Google</span>
        </div>
      );
    }
    if (provider === 'github') {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold">
          <svg className="w-3.5 h-3.5 fill-current text-white shrink-0" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span>Signed up via GitHub</span>
        </div>
      );
    }
    if (provider === 'discord') {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-600/40 text-indigo-300 text-xs font-semibold">
          <svg className="w-3.5 h-3.5 fill-[#5865F2] shrink-0" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          <span>Signed up via Discord</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>Creating SoftView Account</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background glow graphics */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-lg bg-[#0f172a]/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl p-6 sm:p-8 relative z-10"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          {getProviderBadge()}
          {onCancel && (
            <button 
              onClick={onCancel}
              className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              title="Cancel"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Complete Sign Up
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Set up your display name, username handle, profile photo, and terms to join SoftView.
          </p>
        </div>

        {/* Form Error Message */}
        {formError && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* SECTION 1: DISPLAY NAME */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Display Name</span>
              <span className="text-[11px] text-slate-400 font-normal lowercase">
                (shown publicly on your profile)
              </span>
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4 text-indigo-400" />
              </div>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Aslbek or Alex Smith"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* SECTION 2: USERNAME (No @gmail.com) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Username Handle</span>
              <span className="text-[11px] text-indigo-400 lowercase font-normal">
                {provider === 'google' ? '(clean handle without @gmail.com)' : provider === 'github' ? '(github handle)' : ''}
              </span>
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                @
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  let val = e.target.value;
                  // Automatically strip @gmail.com or @domain if pasted or typed
                  if (val.includes('@')) {
                    val = val.split('@')[0];
                  }
                  setUsername(val);
                }}
                placeholder="username"
                className="w-full pl-8 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Unique handle without domain extensions (e.g. <span className="text-indigo-300 font-medium">softiercompany</span>). Editable anytime in Settings.
            </p>
          </div>

          {/* SECTION 2: PROFILE PHOTO & MAX 1 MB FILE UPLOAD */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Profile Photo</span>
              <span className="text-[11px] text-amber-400 font-normal lowercase">
                (max size: 1.0 MB)
              </span>
            </label>

            <div className="flex items-center gap-4 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              {/* Photo Preview Circle */}
              <div className="relative shrink-0">
                <img 
                  src={avatarUrl} 
                  alt="Avatar Preview" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/50 shadow-md"
                  onError={() => setAvatarUrl('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop')}
                />
                <div className="absolute bottom-0 right-0 bg-indigo-600 p-1 rounded-full text-white shadow-md">
                  <Camera className="w-3 h-3" />
                </div>
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-1.5">
                <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-xs font-bold text-indigo-300 cursor-pointer transition-colors active:scale-[0.98]">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Photo...</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload} 
                    className="hidden" 
                  />
                </label>

                <p className="text-[10px] text-slate-400">
                  Upload JPEG, PNG or GIF up to 1 MB.
                </p>
              </div>
            </div>

            {/* Photo Error Banner */}
            {fileError && (
              <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {/* Photo Success Banner */}
            {fileSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{fileSuccess}</span>
              </div>
            )}
          </div>

          {/* SECTION 3: TERMS OF SERVICE & PRIVACY POLICY CHECKBOX */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-start gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <input
                type="checkbox"
                id="terms_checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer accent-indigo-600"
              />
              <label htmlFor="terms_checkbox" className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setLegalModalTab('terms');
                    setIsLegalModalOpen(true);
                  }}
                  className="text-indigo-400 font-semibold hover:underline"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setLegalModalTab('privacy');
                    setIsLegalModalOpen(true);
                  }}
                  className="text-indigo-400 font-semibold hover:underline"
                >
                  Privacy Policy
                </button>
                .
              </label>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>Complete Sign Up & Go to Homepage</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

        {/* Security badge footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Encrypted connection • Privacy protected by SoftView Security</span>
        </div>
      </motion.div>

      {/* Legal Modal Popup */}
      <LegalModal 
        isOpen={isLegalModalOpen} 
        onClose={() => setIsLegalModalOpen(false)} 
        initialTab={legalModalTab} 
      />
    </div>
  );
}
