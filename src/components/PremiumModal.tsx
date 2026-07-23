import { motion } from 'motion/react';
import { X, Sparkles, Check, Flame, Shield, Award } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivate: () => void;
}

export default function PremiumModal({ isOpen, onClose, onActivate }: PremiumModalProps) {
  if (!isOpen) return null;

  return (
    <div id="premium-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        id="premium-modal"
        className="relative w-full max-w-lg overflow-hidden bg-gradient-to-b from-[#16132b] to-[#0a0914] border border-[#3b2f8a]/50 rounded-2xl shadow-2xl shadow-purple-950/40 p-6 text-white"
      >
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <button
          id="close-premium-modal"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mt-4">
          <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 mb-4">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <h2 id="premium-title" className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            Upgrade to SoftView Premium
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
            Unlock the absolute peak experience of SoftView. Fully ad-free, ultra-personalized Gemini AI recommendations, and interactive learning companion tools.
          </p>
        </div>

        <div className="my-6 space-y-4">
          <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
            <Flame className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">Infinite AI Generation</h4>
              <p className="text-xs text-gray-400">Generate limitless personalized streaming channels using our custom server-side Gemini 3.5 AI picks.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
            <Shield className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">Full Ad-Free Experience</h4>
              <p className="text-xs text-gray-400">Stream smoothly without visual interruptions, overlays, or commercial segments.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
            <Award className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">Double Experience Booster</h4>
              <p className="text-xs text-gray-400">Earn double XP on all learning path quiz completions to level up your profile faster.</p>
            </div>
          </div>
        </div>

        <div className="bg-[#241c52]/30 border border-[#4e3dbb]/30 rounded-xl p-4 mb-6 text-center">
          <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Premium Annual Pass</div>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="text-3xl font-extrabold text-white">$4.99</span>
            <span className="text-gray-400 text-sm">/ month</span>
          </div>
          <div className="text-xs text-purple-300 mt-1 font-medium">Billed annually • Save 40%</div>
        </div>

        <button
          id="activate-premium-btn"
          onClick={onActivate}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.98] text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Activate Premium Now
        </button>

        <p className="text-center text-[10px] text-gray-500 mt-3">
          Instant activation • Cancel anytime in billing settings
        </p>
      </motion.div>
    </div>
  );
}
