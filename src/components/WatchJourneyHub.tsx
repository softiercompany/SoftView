import React, { useState, useEffect } from 'react';
import { 
  Clock, Play, Calendar, Flame, ChevronDown, ChevronLeft, ChevronRight, 
  Trophy, Share2, Sparkles, Star, Award, TrendingUp, Compass, Target, 
  Tv, Eye, Bell, ArrowUpRight, Zap, Shield, Lock, Users, Brain, Activity,
  CheckCircle, BarChart2, PieChart, Focus, Bot, Gift, Bookmark, RotateCcw,
  Sliders, UserCheck, Smartphone, Layers, AlertCircle, X, Copy, Check
} from 'lucide-react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface WatchJourneyHubProps {
  user: UserProfile;
}

export default function WatchJourneyHub({ user }: WatchJourneyHubProps) {
  // Navigation Sub-Tabs inside Watch Journey
  const [activeTab, setActiveTab] = useState<'overview' | 'coach_personality' | 'learning_goals' | 'xp_timeline' | 'compare_share' | 'focus_mode'>('overview');

  // Time & Metric filter controls
  const [timeFilter, setTimeFilter] = useState<'This Week' | 'This Month' | 'All Time'>('This Week');
  const [chartMetric, setChartMetric] = useState<'Hours' | 'Minutes' | 'Sessions'>('Hours');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isMetricDropdownOpen, setIsMetricDropdownOpen] = useState(false);
  const [activeDayIdx, setActiveDayIdx] = useState<number>(3); // Thursday default
  const [activeGenreIdx, setActiveGenreIdx] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState('May 2026');

  // Privacy & Share states
  const [privacySetting, setPrivacySetting] = useState<'Private' | 'Friends' | 'Public Profile'>('Public Profile');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [hasCopiedShareLink, setHasCopiedShareLink] = useState(false);

  // Focus Mode State
  const [focusTimeLeft, setFocusTimeLeft] = useState<number>(45 * 60); // 45 mins in seconds
  const [isFocusActive, setIsFocusActive] = useState<boolean>(false);

  // Toast Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Focus Timer countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isFocusActive && focusTimeLeft > 0) {
      timer = setInterval(() => {
        setFocusTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (focusTimeLeft === 0) {
      setIsFocusActive(false);
      triggerToast('🎉 Focus Session completed! Earned +150 XP!');
    }
    return () => clearInterval(timer);
  }, [isFocusActive, focusTimeLeft]);

  const formatFocusTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 1. Overview cards data matching screenshot + 🔥 Watch Score
  const overviewStats = {
    'This Week': [
      { id: 'watch-score', title: 'Watch Score', value: '92 / 100', change: 'Top 15% Viewer 🌟', trend: 'up', subtext: 'Excellent quality', color: 'indigo', icon: Star, sparkline: [75, 80, 82, 88, 90, 91, 92] },
      { id: 'total-watch', title: 'Total Watch Time', value: '48h 36m', change: '+12h 45m', trend: 'up', subtext: 'vs last week', color: 'blue', icon: Clock, sparkline: [12, 18, 15, 38, 22, 28, 42] },
      { id: 'videos-watched', title: 'Videos Watched', value: '128', change: '+28', trend: 'up', subtext: 'vs last week', color: 'purple', icon: Play, sparkline: [15, 20, 24, 45, 30, 35, 52] },
      { id: 'avg-watch', title: 'Average Watch Time', value: '22m 18s', change: '+6m 21s', trend: 'up', subtext: 'vs last week', color: 'emerald', icon: Zap, sparkline: [18, 16, 22, 28, 24, 26, 32] },
      { id: 'completion-rate', title: 'Completion Rate', value: '78%', change: '+8%', trend: 'up', subtext: 'vs last week', color: 'amber', icon: Target, sparkline: [62, 65, 68, 72, 70, 75, 78] }
    ],
    'This Month': [
      { id: 'watch-score', title: 'Watch Score', value: '95 / 100', change: 'Top 10% Viewer 🌟', trend: 'up', subtext: 'Master Learner', color: 'indigo', icon: Star, sparkline: [80, 85, 88, 91, 93, 94, 95] },
      { id: 'total-watch', title: 'Total Watch Time', value: '156h 12m', change: '+34h 15m', trend: 'up', subtext: 'vs last month', color: 'blue', icon: Clock, sparkline: [80, 110, 95, 140, 120, 135, 156] },
      { id: 'videos-watched', title: 'Videos Watched', value: '412', change: '+94', trend: 'up', subtext: 'vs last month', color: 'purple', icon: Play, sparkline: [210, 280, 260, 350, 310, 380, 412] },
      { id: 'avg-watch', title: 'Average Watch Time', value: '24m 45s', change: '+2m 10s', trend: 'up', subtext: 'vs last month', color: 'emerald', icon: Zap, sparkline: [20, 21, 23, 22, 24, 23, 24] },
      { id: 'completion-rate', title: 'Completion Rate', value: '81%', change: '+5%', trend: 'up', subtext: 'vs last month', color: 'amber', icon: Target, sparkline: [74, 76, 75, 78, 79, 80, 81] }
    ],
    'All Time': [
      { id: 'watch-score', title: 'Watch Score', value: '96 / 100', change: 'Top 5% Viewer 👑', trend: 'up', subtext: 'Elite Scholar', color: 'indigo', icon: Star, sparkline: [85, 88, 90, 92, 94, 95, 96] },
      { id: 'total-watch', title: 'Total Watch Time', value: '482h 55m', change: '+48h 20m', trend: 'up', subtext: 'vs last month', color: 'blue', icon: Clock, sparkline: [120, 190, 260, 310, 370, 420, 482] },
      { id: 'videos-watched', title: 'Videos Watched', value: '1,240', change: '+152', trend: 'up', subtext: 'vs last month', color: 'purple', icon: Play, sparkline: [300, 500, 700, 880, 1020, 1150, 1240] },
      { id: 'avg-watch', title: 'Average Watch Time', value: '23m 15s', change: 'Steady average 📈', trend: 'neutral', subtext: '', color: 'emerald', icon: Zap, sparkline: [22, 22, 23, 23, 23, 23, 23] },
      { id: 'completion-rate', title: 'Completion Rate', value: '76%', change: '+2%', trend: 'up', subtext: 'vs last month', color: 'amber', icon: Target, sparkline: [70, 72, 73, 74, 75, 75, 76] }
    ]
  };

  // 2. Daily watch graph values
  const dailyWatchData = {
    Hours: [
      { day: 'Mon', value: 3.1, label: '3h 06m' },
      { day: 'Tue', value: 4.8, label: '4h 48m' },
      { day: 'Wed', value: 2.2, label: '2h 12m' },
      { day: 'Thu', value: 6.75, label: '6h 45m' },
      { day: 'Fri', value: 4.5, label: '4h 30m' },
      { day: 'Sat', value: 5.8, label: '5h 48m' },
      { day: 'Sun', value: 3.5, label: '3h 30m' }
    ],
    Minutes: [
      { day: 'Mon', value: 186, label: '186 mins' },
      { day: 'Tue', value: 288, label: '288 mins' },
      { day: 'Wed', value: 132, label: '132 mins' },
      { day: 'Thu', value: 405, label: '405 mins' },
      { day: 'Fri', value: 270, label: '270 mins' },
      { day: 'Sat', value: 348, label: '348 mins' },
      { day: 'Sun', value: 210, label: '210 mins' }
    ],
    Sessions: [
      { day: 'Mon', value: 4, label: '4 sessions' },
      { day: 'Tue', value: 6, label: '6 sessions' },
      { day: 'Wed', value: 3, label: '3 sessions' },
      { day: 'Thu', value: 9, label: '9 sessions' },
      { day: 'Fri', value: 5, label: '5 sessions' },
      { day: 'Sat', value: 8, label: '8 sessions' },
      { day: 'Sun', value: 4, label: '4 sessions' }
    ]
  };

  // Summaries below watch time graph
  const watchSummaries = {
    Hours: [
      { label: 'Today', value: '3h 25m' },
      { label: 'This Week', value: '48h 36m' },
      { label: 'This Month', value: '156h 12m' },
      { label: 'All Time', value: '482h 55m' }
    ],
    Minutes: [
      { label: 'Today', value: '205m' },
      { label: 'This Week', value: '2,916m' },
      { label: 'This Month', value: '9,372m' },
      { label: 'All Time', value: '28,975m' }
    ],
    Sessions: [
      { label: 'Today', value: '4' },
      { label: 'This Week', value: '39' },
      { label: 'This Month', value: '142' },
      { label: 'All Time', value: '485' }
    ]
  };

  // Calendar Days Data
  const calendarDays = [
    { dayNum: 27, isPrevMonth: true }, { dayNum: 28, isPrevMonth: true }, { dayNum: 29, isPrevMonth: true }, { dayNum: 30, isPrevMonth: true },
    { dayNum: 1, isStreak: true }, { dayNum: 2, isStreak: true }, { dayNum: 3, isStreak: true }, { dayNum: 4, isStreak: true }, { dayNum: 5, isStreak: true },
    { dayNum: 6, isStreak: true }, { dayNum: 7, isStreak: true }, { dayNum: 8, isStreak: true }, { dayNum: 9, isStreak: true }, { dayNum: 10, isStreak: true },
    { dayNum: 11, isStreak: true }, { dayNum: 12, isStreak: true }, { dayNum: 13, isStreak: true }, { dayNum: 14, isStreak: true }, { dayNum: 15, isStreak: true },
    { dayNum: 16, isStreak: true }, { dayNum: 17, isStreak: true }, { dayNum: 18, isStreak: true }, { dayNum: 19, isStreak: true }, { dayNum: 20, isStreak: true },
    { dayNum: 21 }, { dayNum: 22 }, { dayNum: 23, isCircled: true }, { dayNum: 24 }, { dayNum: 25 }, { dayNum: 26 },
    { dayNum: 27 }, { dayNum: 28 }, { dayNum: 29 }, { dayNum: 30 }, { dayNum: 31 }
  ];

  // Category DNA Breakdown Data
  const categoryDna = [
    { name: 'Technology', value: 35, duration: '16h 48m', color: '#6366f1' },
    { name: 'AI & GenAI', value: 28, duration: '13h 25m', color: '#3b82f6' },
    { name: 'Programming', value: 22, duration: '10h 30m', color: '#10b981' },
    { name: 'Gaming', value: 10, duration: '4h 50m', color: '#f59e0b' },
    { name: 'Cinema', value: 5, duration: '2h 25m', color: '#ef4444' }
  ];

  // Learning Progress Topics Data
  const learningProgress = [
    { topic: 'React 19 & Next.js', progress: 80, videosWatched: 38, hours: '18.5h', level: 'Advanced' },
    { topic: 'Python Machine Learning', progress: 60, videosWatched: 24, hours: '12.0h', level: 'Intermediate' },
    { topic: 'Autonomous AI Agents', progress: 40, videosWatched: 15, hours: '8.5h', level: 'Foundational' },
    { topic: 'Docker & Kubernetes', progress: 30, videosWatched: 9, hours: '5.2h', level: 'Beginner' }
  ];

  // Heatmap values
  const heatmapTimes = ['12 AM', '6 AM', '12 PM', '6 PM', '12 AM'];
  const heatmapDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const heatmapMatrix = [
    [1, 1, 2, 1, 1, 3, 2],
    [0, 1, 1, 0, 1, 1, 1],
    [2, 3, 3, 2, 3, 4, 3],
    [4, 5, 4, 6, 5, 6, 5],
    [3, 3, 4, 5, 4, 5, 4]
  ];

  const getHeatmapColorClass = (intensity: number) => {
    switch(intensity) {
      case 0: return 'bg-[#0a0815]';
      case 1: return 'bg-[#1b123e]/40';
      case 2: return 'bg-[#291b5c]/60';
      case 3: return 'bg-[#3b258c]/80';
      case 4: return 'bg-[#5538b5]';
      case 5: return 'bg-[#6d49d9]';
      case 6: return 'bg-[#8c5cf0]';
      default: return 'bg-[#0a0815]';
    }
  };

  // Milestones & Badges
  const milestonesList = [
    { id: 'm-1', name: '40 Hours Watched', date: 'May 20, 2026', icon: Clock, color: 'indigo', badge: 'Knowledge Seeker' },
    { id: 'm-2', name: '100 Videos Watched', date: 'May 18, 2026', icon: Play, color: 'blue', badge: 'Avid Viewer' },
    { id: 'm-3', name: '30 Days Streak', date: 'May 15, 2026', icon: Flame, color: 'amber', badge: 'Consistent Learner (+500 XP)' },
    { id: 'm-4', name: '100 AI Videos Watched', date: 'May 12, 2026', icon: Bot, color: 'purple', badge: 'AI Pioneer Badge' },
    { id: 'm-5', name: 'Night Owl Learner', date: 'May 08, 2026', icon: Star, color: 'emerald', badge: 'Midnight Scholar' }
  ];

  // Life Timeline Story
  const lifeTimeline = [
    { year: '2026 - Jan', title: 'Started Programming Journey', desc: 'Discovered React, JavaScript fundamentals, and full-stack web architecture.', icon: Play },
    { year: '2026 - Feb', title: 'Completed 100 React Tutorials', desc: 'Achieved 80% mastery in Next.js Server Actions & state management.', icon: CheckCircle },
    { year: '2026 - Mar', title: 'Unlocked AI Pioneer Badge', desc: 'Watched 100+ deep-dives on Gemini API, LLM fine-tuning, and neural nets.', icon: Bot },
    { year: '2026 - Apr', title: 'Full Stack Roadmap Master', desc: 'Initiated multi-agent workflows, Docker deployment, and cloud database optimization.', icon: Trophy }
  ];

  // Saved AI Notes History
  const aiNotesHistory = [
    { title: 'React 19 Hooks & Server Actions', duration: '32:10', note: 'Use useEffect with extreme caution. Server actions handle mutation safely without manual API fetchers.', timestamp: '12:35' },
    { title: 'Python Machine Learning Pipelines', duration: '45:00', note: 'Z-score normalization prevents gradient explosion when fine-tuning dense neural layers.', timestamp: '24:18' },
    { title: 'Full Stack OAuth & JWT Flow', duration: '28:15', note: 'Configure HttpOnly cookies with SameSite=Lax for secure cross-site token storage.', timestamp: '08:42' }
  ];

  const activePoints = dailyWatchData[chartMetric];

  return (
    <div 
      id="watch-journey-viewport" 
      className="w-full h-full text-left bg-[#030208] text-white overflow-y-auto max-h-[calc(100vh-4.5rem)] scrollbar-thin scrollbar-thumb-indigo-950/50 select-none pb-24 font-sans relative"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-8 z-50 bg-[#161233] border border-[#503fc2]/60 px-4 py-3 rounded-xl flex items-center gap-3 shadow-2xl text-xs max-w-sm"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
            <p className="text-gray-100 font-medium leading-snug">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 md:p-8 space-y-8 max-w-[1550px] mx-auto">
        
        {/* Header Title Section with Time Selector Dropdown & Privacy Control */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-900/20 pb-6">
          <div id="journey-title-container" className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                SoftView Watch Journey
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-950/80 border border-purple-500/40 text-purple-300">
                  Lvl 12 (8,450 XP)
                </span>
              </h1>
            </div>
            <p className="text-xs md:text-sm text-gray-400 font-medium">
              Your personal watch analytics, AI learning coach, category DNA, and growth milestones.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            
            {/* Privacy Controls Selector */}
            <div className="relative flex items-center bg-[#090714] border border-[#1b1932] rounded-xl px-3 py-1.5 text-xs">
              <Lock className="w-3.5 h-3.5 text-indigo-400 mr-2" />
              <span className="text-gray-400 font-semibold mr-1.5 text-[11px]">Privacy:</span>
              <select 
                value={privacySetting} 
                onChange={(e) => {
                  setPrivacySetting(e.target.value as any);
                  triggerToast(`Watch Privacy set to ${e.target.value}`);
                }}
                className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
              >
                <option value="Private" className="bg-[#0e0b21]">Private</option>
                <option value="Friends" className="bg-[#0e0b21]">Friends Only</option>
                <option value="Public Profile" className="bg-[#0e0b21]">Public Profile</option>
              </select>
            </div>

            {/* Calendar Range Selection Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-[#090714] border border-[#1b1932] hover:border-indigo-500/35 text-xs font-bold text-gray-200 rounded-xl transition-all"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>{timeFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <AnimatePresence>
                {isTimeDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setIsTimeDropdownOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-40 bg-[#0f0b24] border border-[#372a6b] rounded-xl shadow-2xl z-30 overflow-hidden py-1"
                    >
                      {(['This Week', 'This Month', 'All Time'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => {
                            setTimeFilter(filter);
                            setIsTimeDropdownOpen(false);
                            triggerToast(`Display window changed to ${filter}`);
                          }}
                          className={`w-full px-4 py-2 text-left text-xs font-semibold hover:bg-indigo-950/40 transition-colors ${
                            timeFilter === filter ? 'text-indigo-400' : 'text-gray-300'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Share Public Watch Card Button */}
            <button 
              onClick={() => setIsShareModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Stats</span>
            </button>
          </div>
        </div>

        {/* Level & SoftView XP System Bar */}
        <div className="bg-gradient-to-r from-[#110b2d] via-[#1a123d] to-[#0d0824] border border-purple-500/30 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shrink-0">
              ⚡ 12
            </div>
            <div className="space-y-1 text-left flex-1 min-w-0">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-white">SoftView Gamification Level 12</span>
                <span className="text-purple-300">8,450 / 12,000 XP</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-purple-950/80 overflow-hidden border border-purple-500/30">
                <div className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-emerald-400 rounded-full" style={{ width: '70.4%' }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-gray-300 shrink-0">
            <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-emerald-400">
              +50 XP / Video Finished
            </span>
            <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-amber-400">
              +500 XP Streak Reward
            </span>
          </div>
        </div>

        {/* Section Navigation Sub-Tabs */}
        <div className="flex gap-2 border-b border-[#1b1932] pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'overview' ? 'bg-purple-600 text-white shadow-lg' : 'bg-[#090714] text-gray-400 hover:text-white border border-[#1b1932]'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Overview & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('coach_personality')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'coach_personality' ? 'bg-purple-600 text-white shadow-lg' : 'bg-[#090714] text-gray-400 hover:text-white border border-[#1b1932]'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Watch Coach & Personality</span>
          </button>

          <button
            onClick={() => setActiveTab('learning_goals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'learning_goals' ? 'bg-purple-600 text-white shadow-lg' : 'bg-[#090714] text-gray-400 hover:text-white border border-[#1b1932]'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>Learning Progress & Goals</span>
          </button>

          <button
            onClick={() => setActiveTab('xp_timeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'xp_timeline' ? 'bg-purple-600 text-white shadow-lg' : 'bg-[#090714] text-gray-400 hover:text-white border border-[#1b1932]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Achievements & Story Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('compare_share')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'compare_share' ? 'bg-purple-600 text-white shadow-lg' : 'bg-[#090714] text-gray-400 hover:text-white border border-[#1b1932]'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Benchmark & Creator Impact</span>
          </button>

          <button
            onClick={() => setActiveTab('focus_mode')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'focus_mode' ? 'bg-emerald-600 text-white shadow-lg animate-pulse' : 'bg-[#090714] text-emerald-400 hover:text-white border border-emerald-900/40'
            }`}
          >
            <Focus className="w-3.5 h-3.5" />
            <span>Focus Mode (45 min)</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* 1. FIVE OVERVIEW STATS CARDS WITH SPARKLINES & WATCH SCORE */}
            <div id="overview-sparkline-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {overviewStats[timeFilter].map((stat) => {
                const StatIcon = stat.icon;
                const sparkPoints = stat.sparkline;
                const width = 160;
                const height = 40;
                const min = Math.min(...sparkPoints);
                const max = Math.max(...sparkPoints);
                const range = max - min || 1;
                const pathPoints = sparkPoints.map((val, idx) => {
                  const x = (idx / (sparkPoints.length - 1)) * width;
                  const y = height - ((val - min) / range) * (height - 8) - 4;
                  return `${x},${y}`;
                }).join(' L ');

                let strokeColor = '#6366f1';
                let fillColor = 'rgba(99, 102, 241, 0.05)';
                if (stat.color === 'blue') { strokeColor = '#3b82f6'; fillColor = 'rgba(59, 130, 246, 0.05)'; }
                if (stat.color === 'purple') { strokeColor = '#a855f7'; fillColor = 'rgba(168, 85, 247, 0.05)'; }
                if (stat.color === 'emerald') { strokeColor = '#10b981'; fillColor = 'rgba(16, 185, 129, 0.05)'; }
                if (stat.color === 'amber') { strokeColor = '#f59e0b'; fillColor = 'rgba(245, 158, 11, 0.05)'; }

                return (
                  <div 
                    key={stat.id}
                    className="bg-[#090714] border border-[#1b1932] hover:border-purple-500/40 rounded-2xl p-5 space-y-4 shadow-xl text-left flex flex-col justify-between group cursor-pointer hover:bg-[#110e23]/25 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5">
                        <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">{stat.title}</span>
                        <span className="block text-xl md:text-2xl font-extrabold text-white tracking-tight leading-none">
                          {stat.value}
                        </span>
                      </div>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                        stat.color === 'indigo' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white' :
                        stat.color === 'blue' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white' :
                        stat.color === 'purple' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 group-hover:bg-purple-600 group-hover:text-white' :
                        stat.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white' :
                        'bg-amber-500/10 border-amber-500/20 text-amber-400 group-hover:bg-amber-600 group-hover:text-white'
                      }`}>
                        <StatIcon className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="h-10 w-full relative">
                      <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                        <path d={`M 0,${height} L ${pathPoints} L ${width},${height} Z`} fill={fillColor} />
                        <path d={`M ${pathPoints}`} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>

                    <div className="flex items-center gap-1 text-[11px]">
                      <span className={`font-extrabold ${stat.color === 'emerald' ? 'text-emerald-400' : stat.color === 'amber' ? 'text-amber-400' : 'text-indigo-400'}`}>
                        {stat.change}
                      </span>
                      <span className="text-gray-400 font-medium">{stat.subtext}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* WATCH TIME GRAPH (LEFT) & STREAK CALENDAR (RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              <div className="lg:col-span-3 bg-[#090714] border border-[#1b1932] rounded-2xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-base text-white tracking-tight">Your Watch Time Curve</h3>
                    <p className="text-[11px] text-gray-400">Time Intelligence: Peak concentration at 21:15</p>
                  </div>

                  <div className="relative">
                    <button 
                      onClick={() => setIsMetricDropdownOpen(!isMetricDropdownOpen)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#14102c] border border-white/5 rounded-xl text-xs font-bold text-indigo-300 hover:text-white transition-all"
                    >
                      <span>{chartMetric}</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    <AnimatePresence>
                      {isMetricDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setIsMetricDropdownOpen(false)} />
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute right-0 mt-2 w-32 bg-[#0f0b24] border border-[#372a6b] rounded-xl shadow-2xl z-30 py-1"
                          >
                            {(['Hours', 'Minutes', 'Sessions'] as const).map((metric) => (
                              <button
                                key={metric}
                                onClick={() => {
                                  setChartMetric(metric);
                                  setIsMetricDropdownOpen(false);
                                  triggerToast(`Metric plotted: ${metric}`);
                                }}
                                className={`w-full px-4 py-2 text-left text-xs font-semibold hover:bg-indigo-950/40 transition-colors ${
                                  chartMetric === metric ? 'text-indigo-400' : 'text-gray-300'
                                }`}
                              >
                                {metric}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* SVG Curve Plot */}
                <div className="h-48 w-full relative pt-4">
                  <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-semibold text-gray-500 font-mono">
                    <span>{chartMetric === 'Hours' ? '8h' : chartMetric === 'Minutes' ? '480m' : '10s'}</span>
                    <span>{chartMetric === 'Hours' ? '6h' : chartMetric === 'Minutes' ? '360m' : '8s'}</span>
                    <span>{chartMetric === 'Hours' ? '4h' : chartMetric === 'Minutes' ? '240m' : '6s'}</span>
                    <span>{chartMetric === 'Hours' ? '2h' : chartMetric === 'Minutes' ? '120m' : '4s'}</span>
                    <span>0</span>
                  </div>

                  <div className="absolute left-8 right-2 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
                    {[1, 2, 3, 4, 5].map((idx) => (
                      <div key={idx} className="border-b border-white/5 w-full" />
                    ))}
                  </div>

                  <div className="absolute left-8 right-2 top-0 bottom-6">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 600 150" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartFillGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      <path
                        d={`M 0,150 
                           L 10,${150 - (activePoints[0].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135} 
                           L 100,${150 - (activePoints[1].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135} 
                           L 200,${150 - (activePoints[2].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135} 
                           L 300,${150 - (activePoints[3].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135} 
                           L 400,${150 - (activePoints[4].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135} 
                           L 500,${150 - (activePoints[5].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135} 
                           L 590,${150 - (activePoints[6].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135} 
                           L 600,150 Z`}
                        fill="url(#chartFillGrad)"
                      />

                      <path
                        d={`M 10,${150 - (activePoints[0].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135} 
                           C 50,${150 - (activePoints[0].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135}
                             50,${150 - (activePoints[1].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135}
                             100,${150 - (activePoints[1].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135}
                           C 150,${150 - (activePoints[1].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135}
                             150,${150 - (activePoints[2].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135}
                             200,${150 - (activePoints[2].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135}
                           C 250,${150 - (activePoints[2].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135}
                             250,${150 - (activePoints[3].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135}
                             300,${150 - (activePoints[3].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135}
                           C 350,${150 - (activePoints[3].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135}
                             350,${150 - (activePoints[4].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135}
                             400,${150 - (activePoints[4].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135}
                           C 450,${150 - (activePoints[4].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135}
                             450,${150 - (activePoints[5].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135}
                             500,${150 - (activePoints[5].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135}
                           C 550,${150 - (activePoints[5].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135}
                             550,${150 - (activePoints[6].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135}
                             590,${150 - (activePoints[6].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135}`}
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {activePoints.map((p, idx) => {
                        const xPositions = [10, 100, 200, 300, 400, 500, 590];
                        const cx = xPositions[idx];
                        const cy = 150 - (p.value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 135;

                        return (
                          <g key={idx} className="cursor-pointer" onMouseEnter={() => setActiveDayIdx(idx)}>
                            {activeDayIdx === idx && (
                              <>
                                <circle cx={cx} cy={cy} r="10" fill="#a855f7" fillOpacity="0.25" className="animate-pulse" />
                                <circle cx={cx} cy={cy} r="6" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
                              </>
                            )}
                            <circle cx={cx} cy={cy} r="4" fill="#a855f7" fillOpacity={activeDayIdx === idx ? 1 : 0.7} />
                          </g>
                        );
                      })}
                    </svg>

                    <div 
                      className="absolute pointer-events-none transition-all duration-300"
                      style={{
                        left: `${(activeDayIdx / 6) * 94}%`,
                        top: `${40 - (activePoints[activeDayIdx].value / (chartMetric === 'Hours' ? 8 : chartMetric === 'Minutes' ? 480 : 10)) * 40}%`,
                        transform: 'translate(-50%, -100%)',
                        zIndex: 10
                      }}
                    >
                      <div className="bg-[#1c123d] border border-purple-500/55 px-2 py-1 rounded-lg shadow-2xl text-[10px] font-extrabold whitespace-nowrap text-white flex items-center gap-1.5 animate-bounce">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <span>{activePoints[activeDayIdx].label}</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-8 right-2 bottom-0 flex justify-between px-2 text-[10px] font-bold text-gray-400">
                    {activePoints.map((p, idx) => (
                      <span 
                        key={idx} 
                        className={`cursor-pointer transition-colors py-0.5 px-1.5 rounded ${
                          activeDayIdx === idx ? 'bg-indigo-600/20 text-indigo-300' : 'hover:text-white'
                        }`}
                        onMouseEnter={() => setActiveDayIdx(idx)}
                      >
                        {p.day}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/5">
                  {watchSummaries[chartMetric].map((summary, idx) => (
                    <div key={idx} className="space-y-1 text-left cursor-pointer group">
                      <span className="block text-[10px] text-gray-400 group-hover:text-white transition-colors">{summary.label}</span>
                      <span className="block text-sm md:text-base font-extrabold text-white font-sans">{summary.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Streak Calendar */}
              <div className="lg:col-span-2 bg-[#090714] border border-[#1b1932] rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-white tracking-tight">30-Day Watch Streak</h3>
                  <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-xl">
                    🔥 Active
                  </span>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-[#1b103e]/40 to-[#0a0717]/60 border border-purple-500/25 rounded-2xl">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 animate-pulse shrink-0">
                    <Flame className="w-6 h-6 fill-current" />
                  </div>
                  <div className="text-left space-y-0.5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-white">20</span>
                      <span className="text-[11px] font-bold text-gray-400">days active row</span>
                    </div>
                    <span className="block text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                      Reward: "Consistent Learner Badge" Unlocked!
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-500 font-mono">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, cellIdx) => {
                      let cellClass = "aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all ";
                      if (day.isPrevMonth) {
                        cellClass += "text-gray-600 bg-transparent opacity-30";
                      } else if (day.isStreak) {
                        cellClass += "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950/40 cursor-pointer";
                      } else if (day.isCircled) {
                        cellClass += "border-2 border-indigo-500 bg-[#161138]/40 text-white animate-pulse cursor-pointer";
                      } else {
                        cellClass += "text-gray-400 hover:bg-white/5 cursor-pointer";
                      }

                      return (
                        <div key={cellIdx} className={cellClass}>
                          {day.dayNum}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            {/* CATEGORY DNA & TIME OF DAY HEATMAP */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              <div className="lg:col-span-3 bg-[#090714] border border-[#1b1932] rounded-2xl p-6 space-y-5 shadow-xl">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-indigo-400" />
                    Video Category DNA
                  </h3>
                  <p className="text-[11px] text-gray-400">Your viewing profile mapped across content genres.</p>
                </div>

                <div className="space-y-3 pt-2">
                  {categoryDna.map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-200 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                          {cat.name}
                        </span>
                        <span className="text-white font-mono">{cat.value}% ({cat.duration})</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#141029] overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${cat.value}%`, backgroundColor: cat.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Heatmap Grid */}
              <div className="lg:col-span-2 bg-[#090714] border border-[#1b1932] rounded-2xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-base text-white tracking-tight">Watch Time Heatmap</h3>
                  <p className="text-[11px] text-gray-400">Peak concentration: Monday - Thursday (20:00 - 23:00)</p>
                </div>

                <div className="flex gap-3 text-left">
                  <div className="flex flex-col justify-between text-[9px] font-bold text-gray-500 py-3 font-mono shrink-0 select-none">
                    {heatmapTimes.map((t, idx) => <span key={idx}>{t}</span>)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="grid grid-cols-7 gap-1">
                      {heatmapDays.map((d, idx) => (
                        <span key={idx} className="text-[9.5px] font-bold text-gray-400 text-center">{d}</span>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      {heatmapMatrix.map((row, rowIdx) => (
                        <div key={rowIdx} className="grid grid-cols-7 gap-1">
                          {row.map((intensity, colIdx) => (
                            <div key={colIdx} className={`aspect-[2/1] rounded-sm ${getHeatmapColorClass(intensity)}`} />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex justify-between items-center text-xs font-bold text-gray-400">
                  <span>Most active time slot</span>
                  <span className="text-indigo-300 font-mono">21:15 Night Shift</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: AI WATCH COACH & PERSONALITY */}
        {activeTab === 'coach_personality' && (
          <div className="space-y-6">
            
            {/* AI Watch Coach Header Card */}
            <div className="bg-gradient-to-r from-[#170e3d] via-[#120930] to-[#0a051d] border border-indigo-500/40 rounded-2xl p-6 shadow-2xl space-y-5 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0">
                  <Bot className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-white">SoftView AI Watch Coach 🤖</h2>
                  <p className="text-xs text-gray-300 font-medium">Personalized history analysis and optimized learning roadmap suggestions.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-[#090617] border border-[#211a4a] rounded-xl p-4 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">Watched History</span>
                  <p className="text-xs font-bold text-gray-200 leading-relaxed">
                    +14 Programming Videos<br/>
                    +8 Artificial Intelligence Videos<br/>
                    +5 Cybersecurity & OAuth Tutorials
                  </p>
                </div>

                <div className="bg-[#090617] border border-[#211a4a] rounded-xl p-4 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">Coach Suggestion</span>
                  <p className="text-xs font-bold text-white leading-relaxed">
                    "Try Full Stack Security & Zod schema validation roadmap next to consolidate your React 19 knowledge."
                  </p>
                </div>

                <div className="bg-[#090617] border border-[#211a4a] rounded-xl p-4 space-y-2 flex flex-col justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400">Content Balance</span>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>82% Educational Focus</span>
                  </div>
                  <button 
                    onClick={() => triggerToast('AI Learning Plan generated & saved to your profile!')}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all"
                  >
                    Generate Study Plan
                  </button>
                </div>
              </div>
            </div>

            {/* Watch Personality AI */}
            <div className="bg-[#090714] border border-[#1b1932] rounded-2xl p-6 space-y-5 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-400" />
                    Watch Personality AI 🧠
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">AI automatic classification based on content consumption patterns.</p>
                </div>
                <span className="px-3 py-1 bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-extrabold rounded-full">
                  🚀 Explorer Archetype
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0e0a24] border border-purple-500/30 rounded-xl p-4 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-gray-400">Viewer Type</span>
                  <h4 className="text-base font-black text-white">🚀 Explorer</h4>
                  <p className="text-xs text-gray-300 leading-snug">Loves Technology, AI, Science. Relentlessly curious.</p>
                </div>

                <div className="bg-[#0e0a24] border border-purple-500/30 rounded-xl p-4 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-gray-400">Core Strength</span>
                  <h4 className="text-base font-black text-emerald-400">Learning Curiosity</h4>
                  <p className="text-xs text-gray-300 leading-snug">High completion rate on long-form engineering deep-dives.</p>
                </div>

                <div className="bg-[#0e0a24] border border-purple-500/30 rounded-xl p-4 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-gray-400">Recommended Path</span>
                  <h4 className="text-base font-black text-indigo-400">Deep Learning</h4>
                  <p className="text-xs text-gray-300 leading-snug">Transformer models, PyTorch, and AI Agent Swarms.</p>
                </div>

                <div className="bg-[#0e0a24] border border-purple-500/30 rounded-xl p-4 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-gray-400">Distraction Index</span>
                  <h4 className="text-base font-black text-amber-400">Low (12%)</h4>
                  <p className="text-xs text-gray-300 leading-snug">Minimal time spent on short video distractions.</p>
                </div>
              </div>
            </div>

            {/* Distraction Analysis */}
            <div className="bg-[#090714] border border-[#1b1932] rounded-2xl p-6 space-y-4 text-left">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Focus className="w-4 h-4 text-emerald-400" />
                Distraction Analysis & Focus Health
              </h3>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#070512] border border-[#181438] p-4 rounded-xl">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-300">Your Watch Efficiency Ratio:</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-emerald-400">Educational: 72%</span>
                    <span className="text-sm font-black text-amber-400">Entertainment: 28%</span>
                  </div>
                  <p className="text-xs text-gray-400">AI Note: "Great balance! Focus mode keeps retention optimal."</p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('focus_mode');
                    setIsFocusActive(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Start 45-Min Focus Session 🎯
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: LEARNING PROGRESS & GOALS */}
        {activeTab === 'learning_goals' && (
          <div className="space-y-6">
            
            {/* Learning Progress Tracking */}
            <div className="bg-[#090714] border border-[#1b1932] rounded-2xl p-6 space-y-5 text-left">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  Learning Progress Tracking 🎓
                </h3>
                <p className="text-xs text-gray-400 font-medium">Automatic topic mastery calculation derived from finished video logs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {learningProgress.map((item, idx) => (
                  <div key={idx} className="bg-[#070512] border border-[#181438] rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-white">{item.topic}</h4>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        {item.progress}% Mastered
                      </span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-[#14102b] overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" style={{ width: `${item.progress}%` }} />
                    </div>

                    <div className="flex justify-between text-[11px] text-gray-400 font-medium pt-1">
                      <span>{item.videosWatched} videos watched ({item.hours})</span>
                      <span className="text-purple-300 font-bold">{item.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Watch Goals */}
            <div className="bg-[#090714] border border-[#1b1932] rounded-2xl p-6 space-y-4 text-left">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-400" />
                  Active Watch Goals 🎯
                </h3>
                <button 
                  onClick={() => triggerToast('Target goal "Learn Python" updated!')}
                  className="px-3 py-1 bg-amber-600/20 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-lg"
                >
                  + Add New Goal
                </button>
              </div>

              <div className="bg-[#070512] border border-[#181438] p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white">Goal: Learn Python & Data Science</span>
                  <span className="text-amber-400">32 / 50 Hours (64%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#14102b] overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '64%' }} />
                </div>
                <p className="text-[11px] text-gray-400">AI Tracking: "18 hours remaining to unlock Python Developer badge."</p>
              </div>
            </div>

            {/* Smart Resume */}
            <div className="bg-gradient-to-r from-[#130d30] to-[#070512] border border-purple-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-left">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-purple-400">Smart Resume ⏯️</span>
                <h4 className="text-sm font-bold text-white">React 19 Complete Architecture Course</h4>
                <p className="text-xs text-gray-300">Stopped at <span className="text-indigo-300 font-bold font-mono">34:21</span> &bull; AI Summary: "Last lesson covered useEffect cleanup and custom hooks."</p>
              </div>

              <button 
                onClick={() => triggerToast('Resuming React 19 course from 34:21...')}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shrink-0 shadow-lg"
              >
                Continue Learning
              </button>
            </div>

            {/* AI Saved Notes History */}
            <div className="bg-[#090714] border border-[#1b1932] rounded-2xl p-6 space-y-4 text-left">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-indigo-400" />
                AI Notes History 📝
              </h3>

              <div className="space-y-3">
                {aiNotesHistory.map((n, idx) => (
                  <div key={idx} className="bg-[#070512] border border-[#181438] p-3.5 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-white">{n.title}</span>
                      <span className="text-indigo-400 font-mono">Timestamp {n.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{n.note}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: ACHIEVEMENTS & STORY TIMELINE */}
        {activeTab === 'xp_timeline' && (
          <div className="space-y-8">
            
            {/* Milestones Carousel */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Personal Milestones & Badges
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {milestonesList.map((m) => {
                  const IconComp = m.icon;
                  return (
                    <div key={m.id} className="bg-[#090714] border border-[#1b1932] rounded-2xl p-4 space-y-3 text-left">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-white">{m.name}</h4>
                        <span className="inline-block text-[9px] font-extrabold uppercase text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                          {m.badge}
                        </span>
                      </div>
                      <span className="block text-[10px] text-gray-500">{m.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Life Timeline Story */}
            <div className="bg-[#090714] border border-[#1b1932] rounded-2xl p-6 space-y-6 text-left">
              <h3 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                Life Timeline Story 📖
              </h3>

              <div className="relative border-l-2 border-purple-500/30 pl-6 space-y-6 ml-2">
                {lifeTimeline.map((item, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-purple-500 border-2 border-[#090714]" />
                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">{item.year}</span>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: BENCHMARK & CREATOR IMPACT */}
        {activeTab === 'compare_share' && (
          <div className="space-y-6 text-left">
            
            {/* Compare Progress */}
            <div className="bg-[#090714] border border-[#1b1932] rounded-2xl p-6 space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                Compare Progress (Benchmark vs Average User) 📊
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#070512] border border-[#181438] p-4 rounded-xl space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-300">Watch Time (Weekly)</span>
                    <span className="text-indigo-400">You: 48h vs Avg: 21h</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-full h-2 rounded-full bg-indigo-600" style={{ width: '100%' }} />
                    <div className="w-full h-2 rounded-full bg-gray-700" style={{ width: '43.7%' }} />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400">You watch 128% more educational content than average!</span>
                </div>

                <div className="bg-[#070512] border border-[#181438] p-4 rounded-xl space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-300">Completion Rate</span>
                    <span className="text-emerald-400">You: 78% vs Avg: 52%</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-full h-2 rounded-full bg-emerald-500" style={{ width: '78%' }} />
                    <div className="w-full h-2 rounded-full bg-gray-700" style={{ width: '52%' }} />
                  </div>
                  <span className="text-[10px] font-bold text-purple-300">Top 15% in lesson completion index!</span>
                </div>
              </div>
            </div>

            {/* Creator Impact */}
            <div className="bg-gradient-to-r from-[#140b2e] to-[#070512] border border-purple-500/30 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Tv className="w-4 h-4 text-purple-400" />
                Creator Journey & Audience Impact
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#070512] p-3.5 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-gray-400 font-semibold">Your Videos Watched</span>
                  <p className="text-xl font-black text-white">120.4 K</p>
                </div>
                <div className="bg-[#070512] p-3.5 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-gray-400 font-semibold">Audience Retention</span>
                  <p className="text-xl font-black text-emerald-400">84%</p>
                </div>
                <div className="bg-[#070512] p-3.5 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-gray-400 font-semibold">Channel Growth Rate</span>
                  <p className="text-xl font-black text-indigo-400">+15.2%</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: FOCUS MODE */}
        {activeTab === 'focus_mode' && (
          <div className="bg-gradient-to-br from-[#0a1811] via-[#050f0b] to-[#030805] border border-emerald-500/40 rounded-2xl p-8 space-y-6 text-center max-w-2xl mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto animate-pulse">
              <Focus className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">SoftView Focus Session 🎯</h2>
              <p className="text-xs text-gray-300">Zero distractions, zero recommendations. Pure learning absorption.</p>
            </div>

            <div className="text-5xl font-black text-emerald-400 font-mono py-4 tracking-wider">
              {formatFocusTime(focusTimeLeft)}
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsFocusActive(!isFocusActive)}
                className={`px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-xl ${
                  isFocusActive ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isFocusActive ? 'Pause Session' : 'Start Focus Timer'}
              </button>

              <button
                onClick={() => {
                  setIsFocusActive(false);
                  setFocusTimeLeft(45 * 60);
                  triggerToast('Focus timer reset to 45 minutes.');
                }}
                className="px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl"
              >
                Reset
              </button>
            </div>
          </div>
        )}

      </div>

      {/* SHARE PUBLIC WATCH CARD MODAL */}
      <AnimatePresence>
        {isShareModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0e0b21] border border-[#231b4d] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-purple-400" />
                  Public Watch Card (Instagram / X)
                </h3>
                <button onClick={() => setIsShareModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Card preview */}
              <div className="bg-gradient-to-br from-[#1b103e] via-[#0d0724] to-[#050212] border border-purple-500/40 p-5 rounded-2xl space-y-4 shadow-xl">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-xs font-black text-purple-300">Aslbek's 2026 SoftView Journey</span>
                  <span className="text-[9px] font-extrabold uppercase bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                    Verified Learner
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="bg-white/5 p-2.5 rounded-xl">
                    <span className="text-[9px] font-extrabold uppercase text-gray-400">Total Watch</span>
                    <p className="text-sm font-black text-white">250 Hours</p>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl">
                    <span className="text-[9px] font-extrabold uppercase text-gray-400">Badge</span>
                    <p className="text-sm font-black text-purple-300">🤖 AI Explorer</p>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl">
                    <span className="text-[9px] font-extrabold uppercase text-gray-400">Videos</span>
                    <p className="text-sm font-black text-white">120 Educational</p>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl">
                    <span className="text-[9px] font-extrabold uppercase text-gray-400">Score</span>
                    <p className="text-sm font-black text-emerald-400">92 / 100</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText('https://softview.live/u/aslbek-journey-2026');
                    setHasCopiedShareLink(true);
                    setTimeout(() => setHasCopiedShareLink(false), 2500);
                  }}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {hasCopiedShareLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{hasCopiedShareLink ? 'Link Copied!' : 'Copy Share Card Link'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
