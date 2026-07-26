import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Settings2, Check, Sparkles, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);

  // Cookie Preference Categories
  const [preferences, setPreferences] = useState({
    essential: true, // Always true & disabled
    analytics: true,
    personalization: true,
    marketing: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem('softview_cookie_consent');
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        setPreferences(parsed);
        setHasAccepted(true);
        setIsVisible(false);
      } catch {
        setIsVisible(true);
        setHasAccepted(false);
      }
    } else {
      setHasAccepted(false);
      // Show sticky footer banner for visitors who haven't accepted cookies
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 300);
      return () => clearTimeout(timer);
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
    setHasAccepted(true);
    setIsVisible(false);
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
    setHasAccepted(true);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('softview_cookie_consent', JSON.stringify(preferences));
    setHasAccepted(true);
    setIsVisible(false);
  };

  // If user has accepted cookies, hide the banner completely with no lingering button
  if (hasAccepted || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#0c0b1e]/98 backdrop-blur-xl border-t border-purple-500/30 p-4 sm:p-5 shadow-[0_-10px_40px_rgba(7,6,16,0.8)] text-white select-none"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Info Section */}
          <div className="flex items-start md:items-center gap-3.5 flex-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shrink-0 shadow-md shadow-purple-900/40">
              <div className="w-full h-full bg-[#0c0b1e] rounded-[10px] flex items-center justify-center">
                <Cookie className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Cookie & Privacy Agreement
                </h3>
                <span className="text-[10px] uppercase font-black tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                  SoftView
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-1">
                SoftView uses cookies and telemetry to personalize video recommendations, manage learning progress, and enable secure authentication.
              </p>
            </div>
          </div>

          {/* Preference Toggles (When opened in Customize Mode) */}
          {showPreferences && (
            <div className="w-full md:w-auto flex flex-col gap-2 text-xs bg-white/5 p-3 rounded-xl border border-white/10">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Essential
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Always On</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  Analytics
                </span>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                  className="rounded border-slate-700 text-purple-600 accent-purple-600 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Personalization
                </span>
                <input
                  type="checkbox"
                  checked={preferences.personalization}
                  onChange={(e) => setPreferences(prev => ({ ...prev, personalization: e.target.checked }))}
                  className="rounded border-slate-700 text-purple-600 accent-purple-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
            <button
              onClick={handleAcceptAll}
              className="flex-1 md:flex-initial py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-purple-900/40 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Accept All
            </button>

            <button
              onClick={handleAcceptEssential}
              className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs border border-white/10 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
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
              className="py-2.5 px-3.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Settings2 className="w-4 h-4 text-purple-400" />
              {showPreferences ? 'Save Selected' : 'Customize'}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
