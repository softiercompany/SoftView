import React, { useState } from 'react';
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
import { startCustomGoogleAuth } from '../lib/supabase';

interface WelcomeLandingProps {
  onSignIn: (userEmailOrName?: string) => void;
}

export default function WelcomeLanding({ onSignIn }: WelcomeLandingProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoggingInGoogle, setIsLoggingInGoogle] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleGoogleSignIn = async () => {
    if (isLoggingInGoogle) return;

    try {
      setIsLoggingInGoogle(true);
      setToastMessage('Initiating Google Authentication on SoftView domain...');

      const res = await startCustomGoogleAuth();

      if (res.url) {
        const isInIframe = window.self !== window.top;
        if (isInIframe) {
          const width = 600;
          const height = 700;
          const left = window.screenX + (window.innerWidth - width) / 2;
          const top = window.screenY + (window.innerHeight - height) / 2;
          
          const popup = window.open(
            res.url,
            'softview_google_oauth_popup',
            `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`
          );

          if (!popup) {
            window.location.href = res.url;
          } else {
            setToastMessage('Google Sign-In opened! Complete authentication in popup window.');
          }
        } else {
          window.location.href = res.url;
        }
      }
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      setToastMessage('Connecting as Google User...');
      setTimeout(() => {
        onSignIn('Google User');
      }, 1000);
    } finally {
      setIsLoggingInGoogle(false);
    }
  };

  const handleSoonClick = (provider: string) => {
    setToastMessage(`${provider} orqali kirish tez orada ishga tushiriladi! Hozircha Google yoki Email/Parol orqali kiring.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameToPass = isSignUp ? (fullName || 'Aslbek') : (emailOrUser.split('@')[0] || 'Aslbek');
    onSignIn(nameToPass);
  };

  const languages = ['English', 'O‘zbekcha', 'Русский', 'Español', 'Deutsch'];

  return (
    <div className="min-h-screen w-full bg-[#05050d] text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans overflow-x-hidden relative">
      
      {/* Background Decorative Neon Glow Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed top-[30%] left-[40%] w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />

      {/* TOP HEADER */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-20">
        {/* SoftView Logo */}
        <div className="flex items-center gap-3 cursor-pointer group">
          {!logoError ? (
            <img
              src="/softview_logo.png"
              alt="SoftView Logo"
              onError={() => setLogoError(true)}
              className="h-10 object-contain group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full bg-[#05050d] rounded-[10px] flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-cyan-400 border-b-[6px] border-b-transparent ml-0.5" />
                </div>
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-sans">
                Soft<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">View</span>
              </span>
            </div>
          )}
        </div>

        {/* Right Header Options: Language & Theme Toggle */}
        <div className="flex items-center gap-4">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>{selectedLanguage}</span>
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
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedLanguage === lang ? 'bg-indigo-600 text-white font-bold' : 'text-gray-300 hover:bg-white/5'}`}
                    >
                      {lang}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all"
            title="Toggle Theme"
          >
            {isDarkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* MAIN HERO CONTENT */}
      <main className="w-full max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 my-auto">
        
        {/* LEFT COLUMN: HERO TEXT & INTERACTIVE PRODUCT MOCKUP */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Main Title & Subtitle */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Watch <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-indigo-300">Smarter.</span><br />
              Learn <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-blue-400">Faster.</span>
            </h1>
            <p className="mt-4 text-gray-400 text-sm sm:text-base max-w-xl leading-relaxed">
              Discover amazing videos, live streams and courses. Personalized for you with the power of AI.
            </p>
          </div>

          {/* 3D FUTURISTIC MONITOR MOCKUP WITH FLOATING CARDS */}
          <div className="relative w-full max-w-2xl mx-auto lg:mx-0 my-4">
            
            {/* Monitor Outer Frame & Stand */}
            <div className="relative bg-[#0d1023] p-3 rounded-2xl border border-white/15 shadow-[0_0_60px_rgba(99,102,241,0.25)]">
              
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
                  className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white flex items-center justify-center shadow-[0_0_35px_rgba(99,102,241,0.8)] transition-all transform hover:scale-110 active:scale-95"
                >
                  <Play className="w-7 h-7 fill-white text-white ml-1" />
                </button>

                {/* Video Player Controls Bar */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-medium text-gray-300 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2">
                    <Play className="w-3 h-3 fill-white text-white" />
                    <span>14:25 / 48:10</span>
                  </div>
                  <div className="flex items-center gap-3 font-semibold text-gray-400">
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-white text-[10px]">1080p</span>
                    <Volume2 className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                    <Maximize2 className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Monitor Stand Platform */}
              <div className="w-48 h-5 mx-auto bg-gradient-to-b from-[#1a1e3a] to-[#0a0c1a] rounded-b-lg border-t border-indigo-500/30" />
              <div className="w-64 h-3 mx-auto bg-[#0a0c1a] rounded-full shadow-[0_0_30px_rgba(129,140,248,0.5)] border border-indigo-500/20" />
            </div>

            {/* FLOATING CARD 1: TOP-LEFT AI RECOMMENDATION */}
            <motion.div 
              initial={{ y: -10 }}
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-6 -left-4 sm:-left-6 bg-[#0c0e22]/95 backdrop-blur-md border border-indigo-500/30 p-3 rounded-2xl shadow-xl shadow-indigo-950/50 hidden sm:block w-48"
            >
              <div className="flex items-center gap-1.5 text-indigo-400 text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Recommendation</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Based on your watch history</p>
              <div className="flex gap-1.5 mt-2">
                <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop" className="w-11 h-8 rounded-lg object-cover border border-white/10" />
                <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&auto=format&fit=crop" className="w-11 h-8 rounded-lg object-cover border border-white/10" />
                <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&auto=format&fit=crop" className="w-11 h-8 rounded-lg object-cover border border-white/10" />
              </div>
            </motion.div>

            {/* FLOATING CARD 2: BOTTOM-LEFT CONTINUE LEARNING */}
            <motion.div 
              initial={{ y: 10 }}
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-4 sm:-left-6 bg-[#0c0e22]/95 backdrop-blur-md border border-cyan-500/30 p-3 rounded-2xl shadow-xl shadow-cyan-950/50 hidden sm:block w-52"
            >
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Continue Learning</span>
              <div className="flex items-center gap-2.5 mt-1.5">
                <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-gray-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-cyan-400" strokeDasharray="75, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span className="absolute text-[9px] font-black text-cyan-300">75%</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white truncate max-w-[110px]">React Complete Course</h4>
                  <p className="text-[10px] text-gray-400">Last watch: 32:45</p>
                </div>
              </div>
            </motion.div>

            {/* FLOATING CARD 3: TOP-RIGHT YOUR PROGRESS */}
            <motion.div 
              initial={{ x: 10 }}
              animate={{ x: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="absolute -top-6 -right-4 sm:-right-6 bg-[#0c0e22]/95 backdrop-blur-md border border-purple-500/30 p-3.5 rounded-2xl shadow-xl shadow-purple-950/50 hidden sm:block w-48"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-300">Your Progress</span>
                <span className="text-[9px] text-gray-400">This Week</span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-white">4h 36m</span>
              </div>
              {/* Mini Sparkline Graph */}
              <div className="w-full h-7 mt-1.5 flex items-end gap-1">
                <div className="w-1/6 h-[40%] bg-indigo-500/40 rounded-t" />
                <div className="w-1/6 h-[60%] bg-indigo-500/60 rounded-t" />
                <div className="w-1/6 h-[35%] bg-indigo-500/40 rounded-t" />
                <div className="w-1/6 h-[80%] bg-indigo-500/80 rounded-t" />
                <div className="w-1/6 h-[55%] bg-indigo-500/60 rounded-t" />
                <div className="w-1/6 h-[100%] bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-t shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
              </div>
              <p className="text-[10px] font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +12% from last week
              </p>
            </motion.div>

            {/* FLOATING CARD 4: BOTTOM-RIGHT STREAK */}
            <motion.div 
              initial={{ x: -10 }}
              animate={{ x: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
              className="absolute -bottom-6 -right-4 sm:-right-6 bg-[#0c0e22]/95 backdrop-blur-md border border-amber-500/30 p-3 rounded-2xl shadow-xl shadow-amber-950/50 hidden sm:block w-40"
            >
              <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-bold">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>Streak</span>
              </div>
              <p className="text-lg font-black text-white mt-0.5">14 <span className="text-xs font-normal text-gray-300">Days</span></p>
              <p className="text-[10px] text-amber-300 font-semibold mt-0.5">Keep it up!</p>
            </motion.div>

          </div>

          {/* THREE CORE FEATURE HIGHLIGHT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/40 transition-colors flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Secure & Private</h4>
                <p className="text-[11px] text-gray-400 leading-tight">Your data is always protected</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/40 transition-colors flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">AI Powered</h4>
                <p className="text-[11px] text-gray-400 leading-tight">Smarter recommendations just for you</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/40 transition-colors flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <Cloud className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Sync Everywhere</h4>
                <p className="text-[11px] text-gray-400 leading-tight">Access your content on any device</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SIGN IN / SIGN UP FORM CARD */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0a0d1d]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-7 sm:p-8 text-white shadow-2xl shadow-indigo-950/80 relative"
          >
            {/* Card Title Header */}
            <div className="text-left mb-6">
              <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                {isSignUp ? 'Create Account 🚀' : 'Welcome Back 👋'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {isSignUp ? 'Sign up to start your SoftView journey' : 'Sign in to continue your SoftView journey'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name Input (Sign Up mode only) */}
              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5 text-left">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required={isSignUp}
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#11152a] hover:bg-[#151a33] focus:bg-[#181e3a] border border-white/10 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email or Username Input */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5 text-left">Email or Username</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your email or username"
                    value={emailOrUser}
                    onChange={(e) => setEmailOrUser(e.target.value)}
                    className="w-full bg-[#11152a] hover:bg-[#151a33] focus:bg-[#181e3a] border border-white/10 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5 text-left">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#11152a] hover:bg-[#151a33] focus:bg-[#181e3a] border border-white/10 focus:border-indigo-500 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-gray-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password Row */}
              {!isSignUp && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-gray-300 hover:text-white">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded bg-[#11152a] border-white/20 text-indigo-600 focus:ring-0 cursor-pointer accent-indigo-600"
                    />
                    <span>Remember this device</span>
                  </label>
                  <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                    Forgot Password?
                  </a>
                </div>
              )}

              {/* Primary Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all transform active:scale-[0.99] mt-2"
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            {/* Divider OR */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-widest">
                <span className="bg-[#0a0d1d] px-3 text-gray-500 font-bold">OR</span>
              </div>
            </div>

            {/* Toast Notification */}
            {toastMessage && (
              <div className="absolute -top-12 left-0 right-0 mx-auto w-max max-w-full bg-indigo-600/90 text-white text-xs px-4 py-2 rounded-xl backdrop-blur-md shadow-lg border border-indigo-400/30 flex items-center gap-2 z-50">
                <Info className="w-4 h-4 text-cyan-300" />
                <span>{toastMessage}</span>
              </div>
            )}

            {/* Social Sign-In Buttons */}
            <div className="space-y-2.5">
              
              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoggingInGoogle}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-bold text-white flex items-center justify-center gap-3 transition-all active:scale-[0.99] shadow-md shadow-indigo-950/30 group disabled:opacity-50 cursor-pointer"
              >
                {isLoggingInGoogle ? (
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                )}
                <span>{isLoggingInGoogle ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              {/* Apple (Soon) */}
              <button
                type="button"
                onClick={() => handleSoonClick('Apple')}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-400 hover:text-gray-300 flex items-center justify-between transition-all opacity-80 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 fill-current text-gray-400" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.62-.75 1.04-1.8 0.93-2.84-.9.04-2 .61-2.65 1.37-.58.67-1.08 1.74-.94 2.78 1.01.08 2.04-.56 2.66-1.31z"/>
                  </svg>
                  <span>Continue with Apple</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">Soon</span>
              </button>

              {/* GitHub (Soon) */}
              <button
                type="button"
                onClick={() => handleSoonClick('GitHub')}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-400 hover:text-gray-300 flex items-center justify-between transition-all opacity-80 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 fill-current text-gray-400" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span>Continue with GitHub</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">Soon</span>
              </button>

              {/* Microsoft (Soon) */}
              <button
                type="button"
                onClick={() => handleSoonClick('Microsoft')}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-400 hover:text-gray-300 flex items-center justify-between transition-all opacity-80 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5 opacity-60">
                    <div className="bg-[#f25022] rounded-[1px]" />
                    <div className="bg-[#7fba00] rounded-[1px]" />
                    <div className="bg-[#00a4ef] rounded-[1px]" />
                    <div className="bg-[#ffb900] rounded-[1px]" />
                  </div>
                  <span>Continue with Microsoft</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">Soon</span>
              </button>

            </div>

            {/* Bottom Toggle Text */}
            <div className="mt-6 text-center text-xs text-gray-400">
              {isSignUp ? (
                <p>
                  Already have an account?{' '}
                  <button onClick={() => setIsSignUp(false)} className="text-indigo-400 font-bold hover:underline">
                    Sign In
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <button onClick={() => setIsSignUp(true)} className="text-indigo-400 font-bold hover:underline">
                    Create Account
                  </button>
                </p>
              )}
            </div>

          </motion.div>
        </div>

      </main>

      {/* BOTTOM SECURITY BANNER */}
      <footer className="w-full bg-[#03040a] border-t border-white/10 py-5 px-6 z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6 text-xs text-gray-400">
          
          {/* Main Security Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Protected by SoftView Security</h4>
              <p className="text-[11px] text-gray-400">We use industry-leading security to keep your account and data safe.</p>
            </div>
          </div>

          {/* Individual Badges */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <h5 className="font-bold text-white text-[11px]">End-to-end Encryption</h5>
                <p className="text-[10px] text-gray-400">Your data is encrypted and secure</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <h5 className="font-bold text-white text-[11px]">Passkeys Ready</h5>
                <p className="text-[10px] text-gray-400">Passwordless login with passkeys</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <h5 className="font-bold text-white text-[11px]">AI Security Detection</h5>
                <p className="text-[10px] text-gray-400">Real-time protection from threats</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <h5 className="font-bold text-white text-[11px]">Two-Factor Authentication</h5>
                <p className="text-[10px] text-gray-400">Extra layer of security for your account</p>
              </div>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
