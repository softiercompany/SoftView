import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X, Settings2, Check, Sparkles, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [isMinimizedBadge, setIsMinimizedBadge] = useState(false);

  // Cookie Preference Categories
  const [preferences, setPreferences] = useState({
    essential: true, // Always true & disabled
    analytics: true,
    personalization: true,
    marketing: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem('softview_cookie_consent');
    if (!savedConsent) {
      // Show banner after short smooth delay for fresh visitors
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        setPreferences(parsed);
        setIsMinimizedBadge(true); // Keep minimized badge accessible
      } catch {
        setIsVisible(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      personalization: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('softview_cookie_consent', JSON.stringify(allAccepted));
    setIsVisible(false);
    setShowPreferences(false);
    setIsMinimizedBadge(true);
  };

  const handleAcceptEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      personalization: false,
      marketing: false,
    };
    setPreferences(essentialOnly);
    localStorage.setItem('softview_cookie_consent', JSON.stringify(essentialOnly));
    setIsVisible(false);
    setShowPreferences(false);
    setIsMinimizedBadge(true);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('softview_cookie_consent', JSON.stringify(preferences));
    setIsVisible(false);
    setShowPreferences(false);
    setIsMinimizedBadge(true);
  };

  return (
    <>
      {/* Floating Reopen Cookie Badge (Shown when banner is accepted or closed) */}
      {isMinimizedBadge && !isVisible && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsVisible(true);
            setIsMinimizedBadge(false);
          }}
          className="fixed bottom-4 left-4 z-40 bg-[#0d0c1d]/90 backdrop-blur-md border border-purple-500/30 hover:border-purple-400 text-white p-2.5 rounded-full shadow-[0_8px_25px_rgba(147,51,234,0.3)] flex items-center gap-2 group transition-all"
          title="Cookie & Privacy Settings"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-amber-300 shadow-sm">
            <Cookie className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </div>
          <span className="text-xs font-semibold pr-2 hidden sm:inline text-purple-200 group-hover:text-white">
            Cookie Settings
          </span>
        </motion.button>
      )}

      {/* Main Cookie Agreement Banner */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xl z-50 bg-[#0c0b1e]/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-5 shadow-[0_20px_60px_rgba(7,6,16,0.8)] text-white select-none"
          >
            {/* Header / Title */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shrink-0 shadow-md shadow-purple-900/40">
                  <div className="w-full h-full bg-[#0c0b1e] rounded-[10px] flex items-center justify-center">
                    <Cookie className="w-5 h-5 text-amber-400 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    Cookie & Privacy Settings
                    <span className="text-[10px] uppercase font-black tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                      SoftView
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    We value your privacy on our video learning platform.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsVisible(false);
                  setIsMinimizedBadge(true);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description Body */}
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              SoftView uses essential cookies and smart AI telemetry to personalize video recommendations, manage learning progress, and enable seamless Google OAuth sign-in.
            </p>

            {/* Preference Toggles (When opened in Customize Mode) */}
            <AnimatePresence>
              {showPreferences && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-4 border-t border-purple-500/20 pt-3 space-y-2.5 text-xs"
                >
                  {/* Essential */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="pr-2">
                      <p className="font-semibold text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Essential Cookies
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Required for video playback, security, & session storage.</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-md shrink-0">
                      Always Active
                    </span>
                  </div>

                  {/* Analytics */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="pr-2">
                      <p className="font-semibold text-white flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-cyan-400" />
                        Analytics & Performance
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Helps us measure video buffering and platform performance.</p>
                    </div>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                      className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center ${preferences.analytics ? 'bg-purple-600 justify-end' : 'bg-slate-700 justify-start'}`}
                    >
                      <motion.div layout className="w-5 h-5 rounded-full bg-white shadow-md" />
                    </button>
                  </div>

                  {/* AI Personalization */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="pr-2">
                      <p className="font-semibold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        AI & Video Personalization
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Powers Gemini AI Picks and custom video suggestions.</p>
                    </div>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, personalization: !prev.personalization }))}
                      className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center ${preferences.personalization ? 'bg-purple-600 justify-end' : 'bg-slate-700 justify-start'}`}
                    >
                      <motion.div layout className="w-5 h-5 rounded-full bg-white shadow-md" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-purple-500/10">
              <button
                onClick={handleAcceptAll}
                className="flex-1 min-w-[120px] py-2 px-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-purple-900/40 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Accept All
              </button>

              <button
                onClick={handleAcceptEssential}
                className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs border border-white/10 active:scale-95 transition-all"
              >
                Essential Only
              </button>

              <button
                onClick={() => {
                  if (showPreferences) {
                    handleSavePreferences();
                  } else {
                    setShowPreferences(true);
                  }
                }}
                className="py-2 px-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 text-xs font-medium transition-colors flex items-center gap-1 ml-auto"
              >
                <Settings2 className="w-3.5 h-3.5 text-purple-400" />
                {showPreferences ? 'Save Selected' : 'Customize'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
