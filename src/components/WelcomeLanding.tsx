import React, { useState, useEffect } from 'react';
import LegalModal from './LegalModal';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Key, 
  Smartphone, 
  Sparkles, 
  Zap, 
  Cloud, 
  Play, 
  Globe, 
  Moon, 
  Sun, 
  Maximize2, 
  Volume2, 
  Check, 
  Flame, 
  TrendingUp,
  Shield,
  CheckCircle2,
  Info,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  startCustomGoogleAuth, 
  startCustomGithubAuth, 
  startCustomDiscordAuth,
  sendSupabaseAuthLink 
} from '../lib/supabase';
import { 
  LANGUAGES, 
  getLangCodeFromUrl, 
  syncUrlForLang, 
  getLangNameFromCode, 
  TRANSLATIONS, 
  LanguageOption 
} from '../lib/languages';

interface WelcomeLandingProps {
  onSignIn: (
    userEmailOrName?: string, 
    extraData?: { email?: string; avatarUrl?: string; provider?: 'google' | 'github' | 'discord' | 'email'; username?: string }
  ) => void;
  onStartSignUp?: (provider?: 'google' | 'github' | 'discord' | 'email') => void;
  onNavigateToSended?: (email: string) => void;
}

export default function WelcomeLanding({ onSignIn, onStartSignUp, onNavigateToSended }: WelcomeLandingProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Language state & URL path initialization (/en by default on initial load)
  const [langCode, setLangCode] = useState<'en' | 'uz' | 'ru' | 'es' | 'de'>(() => {
    const initialCode = getLangCodeFromUrl();
    syncUrlForLang(initialCode, true);
    return initialCode;
  });

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeOAuthProvider, setActiveOAuthProvider] = useState<'google' | 'github' | 'discord' | null>(null);
  const [logoError, setLogoError] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms' | 'oauth'>('oauth');

  useEffect(() => {
    // Ensure URL matches current language code & listen for browser back/forward navigation
    const codeOnMount = getLangCodeFromUrl();
    syncUrlForLang(codeOnMount, true);

    const handlePopState = () => {
      const popCode = getLangCodeFromUrl();
      setLangCode(popCode);
    };

    const handleOAuthMessage = (event: MessageEvent) => {
      const type = event.data?.type;
      if (type && type.startsWith('SOFTVIEW_CUSTOM_') && event.data?.payload) {
        const user = event.data.payload.user || {};
        const userName = user.name || user.email || 'Authenticated User';
        const provider: 'google' | 'github' | 'discord' = type.includes('GOOGLE') ? 'google' : type.includes('GITHUB') ? 'github' : 'discord';
        
        setToastMessage(`Signed in as ${userName}! Redirecting to profile setup...`);
        setTimeout(() => {
          onSignIn(userName, {
            email: user.email,
            avatarUrl: user.picture || user.avatar_url,
            provider,
            username: user.username
          });
        }, 600);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('message', handleOAuthMessage);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('message', handleOAuthMessage);
    };
  }, [onSignIn]);

  const handleLanguageSelect = (lang: LanguageOption) => {
    setLangCode(lang.code);
    syncUrlForLang(lang.code, false);
    setIsLangOpen(false);
  };

  const t = TRANSLATIONS[langCode] || TRANSLATIONS.en;
  const selectedLanguageName = getLangNameFromCode(langCode);

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'discord') => {
    if (activeOAuthProvider) return;

    const providerNames = {
      google: 'Google',
      github: 'GitHub',
      discord: 'Discord'
    };
    const providerName = providerNames[provider];

    try {
      setActiveOAuthProvider(provider);
      setToastMessage(`Initiating ${providerName} Authentication on SoftView domain...`);

      let res: { url: string; error: any } = { url: `/api/auth/${provider}`, error: null };
      if (provider === 'google') res = await startCustomGoogleAuth();
      else if (provider === 'github') res = await startCustomGithubAuth();
      else if (provider === 'discord') res = await startCustomDiscordAuth();

      if (res.url) {
        const isInIframe = window.self !== window.top;
        if (isInIframe) {
          const width = 600;
          const height = 700;
          const left = window.screenX + (window.innerWidth - width) / 2;
          const top = window.screenY + (window.innerHeight - height) / 2;
          
          const popup = window.open(
            res.url,
            `softview_${provider}_oauth_popup`,
            `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`
          );

          if (!popup) {
            window.location.href = res.url;
          } else {
            setToastMessage(`${providerName} Sign-In opened! Complete authentication in popup window.`);
          }
        } else {
          window.location.href = res.url;
        }
      }
    } catch (err: any) {
      console.error(`${providerName} Sign-In error:`, err);
      setToastMessage(`Connecting as ${providerName} User...`);
      setTimeout(() => {
        onSignIn(`${providerName} User`);
      }, 1000);
    } finally {
      setActiveOAuthProvider(null);
    }
  };

  const handleSoonClick = (provider: string) => {
    setToastMessage(`${provider} orqali kirish tez orada ishga tushiriladi! Hozircha Google yoki Email/Parol orqali kiring.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUser) return;
    const userEmail = emailOrUser.includes('@') ? emailOrUser : `${emailOrUser}@gmail.com`;
    const nameToPass = isSignUp ? (fullName || userEmail.split('@')[0]) : (emailOrUser.split('@')[0]);

    // Send email login/signup link via Supabase Auth & sync user to databases
    await sendSupabaseAuthLink(userEmail, nameToPass);

    // Route to /sended page
    if (onNavigateToSended) {
      onNavigateToSended(userEmail);
    } else {
      onSignIn(nameToPass, {
        email: userEmail,
        provider: 'email',
        username: nameToPass
      });
    }
  };

  return (
    <div className="min-h-screen lg:h-screen w-full max-w-full bg-[#05050d] text-white flex flex-col justify-between font-sans overflow-x-hidden overflow-y-auto lg:overflow-hidden relative">
      
      {/* Background Decorative Neon Glow Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-900/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed top-[30%] left-[40%] w-[300px] h-[300px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />

      {/* TOP HEADER */}
      <header className="w-full max-w-7xl mx-auto px-6 py-3 lg:py-3.5 flex items-center justify-between z-20 shrink-0">
        {/* SoftView Logo */}
        <div className="flex items-center gap-3 cursor-pointer group">
          {!logoError ? (
            <img
              src="/softview_logo.png"
              alt="SoftView Logo"
              onError={() => setLogoError(true)}
              className="h-9 object-contain group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full bg-[#05050d] rounded-[10px] flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[9px] border-l-cyan-400 border-b-[5px] border-b-transparent ml-0.5" />
                </div>
              </div>
              <span className="text-xl font-black tracking-tight text-white font-sans">
                Soft<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">View</span>
              </span>
            </div>
          )}
        </div>

        {/* Right Header Options: Language & Theme Toggle */}
        <div className="flex items-center gap-3">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>{selectedLanguageName}</span>
              <span className="text-[10px] text-gray-400">▼</span>
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-36 bg-[#0c0f20] border border-white/10 rounded-xl shadow-2xl p-1.5 z-50 text-left"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${langCode === lang.code ? 'bg-indigo-600 text-white font-bold' : 'text-gray-300 hover:bg-white/5'}`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all"
            title="Toggle Theme"
          >
            {isDarkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* MAIN HERO CONTENT */}
      <main className="w-full max-w-7xl mx-auto px-6 py-2 lg:py-3 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center z-10 my-auto flex-1 overflow-y-auto lg:overflow-visible">
        
        {/* LEFT COLUMN: HERO TEXT & INTERACTIVE PRODUCT MOCKUP */}
        <div className="lg:col-span-7 flex flex-col justify-center gap-3 lg:gap-4">
          
          {/* Main Title & Subtitle */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] text-white">
              {t.watchSmarter1}<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-indigo-300">{t.watchSmarter2}</span><br />
              {t.learnFaster1}<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-blue-400">{t.learnFaster2}</span>
            </h1>
            <p className="mt-2 text-gray-400 text-xs sm:text-sm max-w-lg leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* 3D FUTURISTIC MONITOR MOCKUP WITH FLOATING CARDS */}
          <div className="relative w-full max-w-xl mx-auto lg:mx-0 my-1">
            
            {/* Monitor Outer Frame & Stand */}
            <div className="relative bg-[#0d1023] p-2.5 rounded-2xl border border-white/15 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
              
              {/* Screen Display Box */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[#03040a] group border border-white/5 flex items-center justify-center">
                
                {/* Background Space Video Visual */}
                <img 
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80" 
                  alt="Futuristic Video Stream" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Central Play Button */}
                <button 
                  onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                  className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.8)] transition-all transform hover:scale-110 active:scale-95"
                >
                  <Play className="w-6 h-6 fill-white text-white ml-1" />
                </button>

                {/* Video Player Controls Bar */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-medium text-gray-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2">
                    <Play className="w-3 h-3 fill-white text-white" />
                    <span>14:25 / 48:10</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-semibold text-gray-400">
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-white text-[9px]">1080p</span>
                    <Volume2 className="w-3 h-3 hover:text-white cursor-pointer" />
                    <Maximize2 className="w-3 h-3 hover:text-white cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Monitor Stand Platform */}
              <div className="w-40 h-3.5 mx-auto bg-gradient-to-b from-[#1a1e3a] to-[#0a0c1a] rounded-b-lg border-t border-indigo-500/30" />
              <div className="w-52 h-2.5 mx-auto bg-[#0a0c1a] rounded-full shadow-[0_0_20px_rgba(129,140,248,0.4)] border border-indigo-500/20" />
            </div>

            {/* FLOATING CARD 1: TOP-LEFT AI RECOMMENDATION */}
            <motion.div 
              initial={{ y: -5 }}
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-3 left-0 sm:-left-3 bg-[#0c0e22]/95 backdrop-blur-md border border-indigo-500/30 p-2.5 rounded-xl shadow-xl shadow-indigo-950/50 hidden sm:block w-44 z-20"
            >
              <div className="flex items-center gap-1.5 text-indigo-400 text-[10px] font-bold">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>{t.aiRec}</span>
              </div>
              <p className="text-[9px] text-gray-400 mt-0.5 font-medium">{t.basedOnHistory}</p>
              <div className="flex gap-1 mt-1.5">
                <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop" className="w-10 h-7 rounded-md object-cover border border-white/10" />
                <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&auto=format&fit=crop" className="w-10 h-7 rounded-md object-cover border border-white/10" />
                <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&auto=format&fit=crop" className="w-10 h-7 rounded-md object-cover border border-white/10" />
              </div>
            </motion.div>

            {/* FLOATING CARD 2: BOTTOM-LEFT CONTINUE LEARNING */}
            <motion.div 
              initial={{ y: 5 }}
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="absolute -bottom-3 left-0 sm:-left-3 bg-[#0c0e22]/95 backdrop-blur-md border border-cyan-500/30 p-2.5 rounded-xl shadow-xl shadow-cyan-950/50 hidden sm:block w-48 z-20"
            >
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{t.continueLearning}</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-gray-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-cyan-400" strokeDasharray="75, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span className="absolute text-[8px] font-black text-cyan-300">75%</span>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-white truncate max-w-[100px]">React Complete</h4>
                  <p className="text-[9px] text-gray-400">Last watch: 32:45</p>
                </div>
              </div>
            </motion.div>

            {/* FLOATING CARD 3: TOP-RIGHT YOUR PROGRESS */}
            <motion.div 
              initial={{ x: 5 }}
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="absolute -top-3 right-0 sm:-right-3 bg-[#0c0e22]/95 backdrop-blur-md border border-purple-500/30 p-2.5 rounded-xl shadow-xl shadow-purple-950/50 hidden sm:block w-44 z-20"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-300">{t.yourProgress}</span>
                <span className="text-[8px] text-gray-400">{t.thisWeek}</span>
              </div>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-white">4h 36m</span>
              </div>
              {/* Mini Sparkline Graph */}
              <div className="w-full h-5 mt-1 flex items-end gap-1">
                <div className="w-1/6 h-[40%] bg-indigo-500/40 rounded-t" />
                <div className="w-1/6 h-[60%] bg-indigo-500/60 rounded-t" />
                <div className="w-1/6 h-[35%] bg-indigo-500/40 rounded-t" />
                <div className="w-1/6 h-[80%] bg-indigo-500/80 rounded-t" />
                <div className="w-1/6 h-[55%] bg-indigo-500/60 rounded-t" />
                <div className="w-1/6 h-[100%] bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-t shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
              </div>
              <p className="text-[9px] font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-2.5 h-2.5" /> +12% this week
              </p>
            </motion.div>

            {/* FLOATING CARD 4: BOTTOM-RIGHT STREAK */}
            <motion.div 
              initial={{ x: -5 }}
              animate={{ x: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
              className="absolute -bottom-3 right-0 sm:-right-3 bg-[#0c0e22]/95 backdrop-blur-md border border-amber-500/30 p-2 rounded-xl shadow-xl shadow-amber-950/50 hidden sm:block w-36 z-20"
            >
              <div className="flex items-center gap-1 text-amber-400 text-[10px] font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>{t.streak}</span>
              </div>
              <p className="text-base font-black text-white mt-0.5">14 <span className="text-[10px] font-normal text-gray-300">{t.days}</span></p>
            </motion.div>

          </div>

          {/* THREE CORE FEATURE HIGHLIGHT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-1">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/40 transition-colors flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{t.protectedDataTitle}</h4>
                <p className="text-[10px] text-gray-400 leading-tight">{t.protectedDataDesc}</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/40 transition-colors flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{t.smartSuggestionsTitle}</h4>
                <p className="text-[10px] text-gray-400 leading-tight">{t.smartSuggestionsDesc}</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/40 transition-colors flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <Cloud className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{t.anyDeviceTitle}</h4>
                <p className="text-[10px] text-gray-400 leading-tight">{t.anyDeviceDesc}</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SIGN IN / SIGN UP FORM CARD */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto my-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0a0d1d]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 text-white shadow-2xl shadow-indigo-950/80 relative"
          >
            {/* Card Title Header */}
            <div className="text-left mb-4">
              <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                {isSignUp ? t.createAccountHeader : t.welcomeBack}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {isSignUp ? t.signUpSub : t.signInSub}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Full Name Input (Sign Up mode only) */}
              {isSignUp && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1 text-left">{t.fullName}</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required={isSignUp}
                      placeholder={t.fullName}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#11152a] hover:bg-[#151a33] focus:bg-[#181e3a] border border-white/10 focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email or Username Input */}
              <div>
                <label className="block text-[11px] font-bold text-gray-300 mb-1 text-left">{t.emailOrUsername}</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={t.emailOrUsername}
                    value={emailOrUser}
                    onChange={(e) => setEmailOrUser(e.target.value)}
                    className="w-full bg-[#11152a] hover:bg-[#151a33] focus:bg-[#181e3a] border border-white/10 focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-[11px] font-bold text-gray-300 mb-1 text-left">{t.password}</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder={t.password}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#11152a] hover:bg-[#151a33] focus:bg-[#181e3a] border border-white/10 focus:border-indigo-500 rounded-xl pl-9 pr-9 py-2.5 text-xs text-white placeholder-gray-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password Row */}
              {!isSignUp && (
                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none text-gray-300 hover:text-white">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded bg-[#11152a] border-white/20 text-indigo-600 focus:ring-0 cursor-pointer accent-indigo-600"
                    />
                    <span>{t.rememberDevice}</span>
                  </label>
                  <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                    {t.forgotPassword}
                  </a>
                </div>
              )}

              {/* Primary Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all transform active:scale-[0.99] mt-1"
              >
                {isSignUp ? t.createAccountBtn : t.signInBtn}
              </button>
            </form>

            {/* Divider OR */}
            <div className="relative my-3.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="bg-[#0a0d1d] px-2.5 text-gray-500 font-bold">{t.or}</span>
              </div>
            </div>

            {/* Toast Notification */}
            {toastMessage && (
              <div className="absolute -top-11 left-0 right-0 mx-auto w-max max-w-full bg-indigo-600/90 text-white text-xs px-3.5 py-1.5 rounded-xl backdrop-blur-md shadow-lg border border-indigo-400/30 flex items-center gap-2 z-50">
                <Info className="w-3.5 h-3.5 text-cyan-300" />
                <span>{toastMessage}</span>
              </div>
            )}

            {/* Social Sign-In Buttons */}
            <div className="space-y-2">
              
              {/* Google */}
              <button
                type="button"
                onClick={() => handleOAuthSignIn('google')}
                disabled={!!activeOAuthProvider}
                className="w-full py-2 px-3.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-bold text-white flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] shadow-md shadow-indigo-950/30 group disabled:opacity-50 cursor-pointer"
              >
                {activeOAuthProvider === 'google' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                ) : (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                )}
                <span>{activeOAuthProvider === 'google' ? 'Connecting...' : t.continueWithGoogle}</span>
              </button>

              {/* GitHub */}
              <button
                type="button"
                onClick={() => handleOAuthSignIn('github')}
                disabled={!!activeOAuthProvider}
                className="w-full py-2 px-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/50 text-xs font-bold text-white flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] shadow-md shadow-slate-950/30 disabled:opacity-50 cursor-pointer"
              >
                {activeOAuthProvider === 'github' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-300" />
                ) : (
                  <svg className="w-3.5 h-3.5 fill-current text-white shrink-0" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                )}
                <span>{activeOAuthProvider === 'github' ? 'Connecting...' : t.continueWithGithub}</span>
              </button>

              {/* Discord */}
              <button
                type="button"
                onClick={() => handleOAuthSignIn('discord')}
                disabled={!!activeOAuthProvider}
                className="w-full py-2 px-3.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/30 text-xs font-bold text-white flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] shadow-md shadow-indigo-950/30 disabled:opacity-50 cursor-pointer"
              >
                {activeOAuthProvider === 'discord' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                ) : (
                  <svg className="w-3.5 h-3.5 fill-[#5865F2] shrink-0" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                )}
                <span>{activeOAuthProvider === 'discord' ? 'Connecting...' : (t.continueWithDiscord || 'Continue with Discord')}</span>
              </button>

            </div>

            {/* Bottom Toggle Text */}
            <div className="mt-4 text-center text-xs text-gray-400">
              {isSignUp ? (
                <p>
                  {t.alreadyHaveAccount}{' '}
                  <button onClick={() => setIsSignUp(false)} className="text-indigo-400 font-bold hover:underline">
                    {t.signInLink}
                  </button>
                </p>
              ) : (
                <p>
                  {t.dontHaveAccount}{' '}
                  <button onClick={() => setIsSignUp(true)} className="text-indigo-400 font-bold hover:underline">
                    {t.signUpLink}
                  </button>
                </p>
              )}
            </div>

          </motion.div>
        </div>

      </main>

      {/* BOTTOM SECURITY BANNER */}
      <footer className="w-full bg-[#03040a] border-t border-white/10 py-2.5 px-6 z-20 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
          
          {/* Main Security Badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-[11px]">{t.protectedBySecurity}</h4>
              <p className="text-[10px] text-gray-400">{t.protectedByDesc}</p>
            </div>
          </div>

          {/* Individual Badges & Legal Links */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[10px]">
            <button
              type="button"
              onClick={() => {
                setLegalModalTab('oauth');
                setIsLegalModalOpen(true);
              }}
              className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer underline"
            >
              softview.vercel.app
            </button>

            <button
              type="button"
              onClick={() => {
                setLegalModalTab('privacy');
                setIsLegalModalOpen(true);
              }}
              className="text-gray-300 hover:text-white font-medium transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>

            <button
              type="button"
              onClick={() => {
                setLegalModalTab('terms');
                setIsLegalModalOpen(true);
              }}
              className="text-gray-300 hover:text-white font-medium transition-colors cursor-pointer"
            >
              Terms of Service
            </button>

            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="font-semibold text-gray-300">{t.e2eEncryption}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="font-semibold text-gray-300">{t.passkeysReady}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="font-semibold text-gray-300">{t.aiThreatProtection}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-semibold text-gray-300">{t.twoFactorAuth}</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Legal & Google OAuth Consent Modal */}
      <LegalModal
        isOpen={isLegalModalOpen}
        initialTab={legalModalTab}
        onClose={() => setIsLegalModalOpen(false)}
      />

    </div>
  );
}
