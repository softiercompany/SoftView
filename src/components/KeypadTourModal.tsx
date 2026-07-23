import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Sparkles, 
  Download, 
  MessageSquare, 
  Award, 
  Zap, 
  CheckCircle2, 
  Key,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface KeypadTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeypadTourModal({ isOpen, onClose }: KeypadTourModalProps) {
  const [activeKey, setActiveKey] = useState<number>(1);

  if (!isOpen) return null;

  const keypadTools = [
    {
      id: 1,
      keyLabel: '01',
      title: 'Smart Video Player',
      icon: Play,
      color: 'from-blue-600 to-indigo-600',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      description: 'High-definition 1080p player with flexible speed control (0.5x - 2x) and automatic Smart Resume feature.',
      features: ['1080p HD Video Support', 'Top-tier Speed Control', 'Smart Auto-Resume']
    },
    {
      id: 2,
      keyLabel: '02',
      title: 'AI Video Summarizer',
      icon: Sparkles,
      color: 'from-purple-600 to-pink-600',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      description: 'Instant AI analysis for every video, extracting core insights and executive summaries in under 5 seconds.',
      features: ['Multilingual AI Analysis', 'Ready Notes & Key Points', 'Smart Key Takeaway Tags']
    },
    {
      id: 3,
      keyLabel: '03',
      title: 'Offline Video Saver',
      icon: Download,
      color: 'from-cyan-600 to-teal-600',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      description: 'Save videos directly to your device with 1-click and enjoy full playback even without an internet connection.',
      features: ['Fast Smart Download', 'Offline Media Library', 'Data Saver Optimization']
    },
    {
      id: 4,
      keyLabel: '04',
      title: 'AI Chat Assistant',
      icon: MessageSquare,
      color: 'from-emerald-600 to-green-600',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      description: 'Ask the AI Assistant any question at any moment during video playback and receive immediate detailed explanations.',
      features: ['Contextual Q&A Mode', 'Explanations & Real Examples', 'Interactive Learning Context']
    },
    {
      id: 5,
      keyLabel: '05',
      title: 'XP Progress & Level System',
      icon: Award,
      color: 'from-amber-600 to-orange-600',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      description: 'Earn XP experience points for every minute watched, level up your profile, and unlock exclusive platform rewards.',
      features: ['+XP Points for Watch Time', 'Daily & Weekly Streaks', 'Competitive Leagues & Ranks']
    }
  ];

  const currentTool = keypadTools.find(t => t.id === activeKey) || keypadTools[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0c0e22] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-[0_0_80px_rgba(99,102,241,0.25)] overflow-hidden"
        >
          {/* Top Decorative Lights */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Key className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">SoftView Video Tools</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">Activated</span>
                </div>
                <p className="text-xs text-gray-400">All tools unlocked upon uploading your first video!</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Keypad Selector Grid */}
          <div className="mt-6">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
              Tool Keypad Panel (Click to inspect):
            </label>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {keypadTools.map((tool) => {
                const ToolIcon = tool.icon;
                const isActive = activeKey === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveKey(tool.id)}
                    className={`relative p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all transform active:scale-95 ${
                      isActive 
                        ? 'bg-gradient-to-b from-indigo-600/30 to-purple-600/30 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-105' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                    }`}
                  >
                    <span className="text-[10px] font-extrabold font-mono opacity-80">{tool.keyLabel}</span>
                    <ToolIcon className={`w-5 h-5 ${isActive ? 'text-cyan-300' : 'text-gray-400'}`} />
                    <span className="text-[10px] font-bold truncate max-w-[65px]">{tool.title.split(' ')[0]}</span>
                    
                    {isActive && (
                      <motion.div 
                        layoutId="activeKeypadGlow" 
                        className="absolute inset-0 rounded-2xl border-2 border-cyan-400 pointer-events-none" 
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Key Detailed Display Panel */}
          <motion.div 
            key={currentTool.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-6 p-5 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-xl bg-gradient-to-r ${currentTool.color} text-white shadow-md`}>
                  <currentTool.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{currentTool.title}</h4>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border mt-0.5 ${currentTool.badgeColor}`}>
                    Keypad #{currentTool.keyLabel}
                  </span>
                </div>
              </div>

              <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              {currentTool.description}
            </p>

            <div className="space-y-1.5 pt-2 border-t border-white/5">
              {currentTool.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Footer CTA */}
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>All video tools are active & ready to use</span>
            </div>

            <button
              onClick={onClose}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95 flex items-center gap-2"
            >
              <span>Got It, Let's Start!</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
