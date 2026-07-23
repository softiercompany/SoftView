import React, { useState, useRef } from 'react';
import { 
  GraduationCap, ClipboardList, Award, Flame, 
  ChevronRight, Play, CheckCircle2, Circle, 
  ArrowLeft, HelpCircle, Check, X, Star,
  Code2, Database, Smartphone, Infinity,
  Terminal, Palette, Briefcase, Megaphone,
  Sparkles, Globe, Search, ShieldAlert,
  Bot, GitBranch, Compass, RefreshCw, Send,
  FileText, Share2, ExternalLink, Calendar,
  TrendingUp, Zap, Target, BookOpen, Layers
} from 'lucide-react';
import { Video, LearningPath, LearningStep } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface LearningJourneyProps {
  onPlayVideo: (video: Video) => void;
  onAddXp: (amount: number) => void;
  isPremium: boolean;
  learningPathsData: LearningPath[];
  setLearningPathsData: (data: LearningPath[]) => void;
}

interface Certificate {
  id: string;
  courseTitle: string;
  issuedDate: string;
  verificationCode: string;
  grade: string;
  certificateUrl: string;
  skills: string[];
}

interface SkillNode {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  percentage: number;
  unlocked: boolean;
  color: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
}

export default function LearningJourney({ 
  onPlayVideo, 
  onAddXp, 
  isPremium, 
  learningPathsData, 
  setLearningPathsData 
}: LearningJourneyProps) {
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // State & Filters
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [activeStepForQuiz, setActiveStepForQuiz] = useState<LearningStep | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState<string>('all');
  const [selectedSubTopic, setSelectedSubTopic] = useState<string | null>(null);

  // Modals state
  const [isCertificatesOpen, setIsCertificatesOpen] = useState(false);
  const [isSkillTreeOpen, setIsSkillTreeOpen] = useState(false);
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [isCareerRoadmapOpen, setIsCareerRoadmapOpen] = useState(false);
  const [isQuizGeneratorOpen, setIsQuizGeneratorOpen] = useState(false);
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);

  // AI Mentor Chat
  const [mentorInput, setMentorInput] = useState('');
  const [mentorLoading, setMentorLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'mentor',
      text: "Salom! Men SoftCast AI Learning Mentoriman. Qaysi sohani o'rganmoqchisiz yoki qanday karyera maqsadiga erishmoqchisiz? Menga yozing!",
      timestamp: 'Just now'
    }
  ]);

  // AI Career Roadmap Builder
  const [careerGoal, setCareerGoal] = useState('Senior Full Stack Web Developer');
  const [timeframeMonths, setTimeframeMonths] = useState(6);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState<any | null>(null);

  // AI Custom Quiz Generator
  const [quizTopicInput, setQuizTopicInput] = useState('');
  const [quizLevelInput, setQuizLevelInput] = useState('Intermediate');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [customGeneratedQuiz, setCustomGeneratedQuiz] = useState<any[] | null>(null);

  // User Certificates
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: 'cert-1',
      courseTitle: 'React.js Complete Developer Certificate',
      issuedDate: 'July 2026',
      verificationCode: 'SC-829291',
      grade: 'Grade A+ (98%)',
      certificateUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=600&auto=format&fit=crop',
      skills: ['React 18', 'TypeScript', 'JSX', 'Hooks', 'Vite']
    },
    {
      id: 'cert-2',
      courseTitle: 'Node.js & Express API Architect Certificate',
      issuedDate: 'June 2026',
      verificationCode: 'SC-712049',
      grade: 'Grade A (95%)',
      certificateUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop',
      skills: ['Node.js', 'Express', 'REST APIs', 'JWT Auth']
    },
    {
      id: 'cert-3',
      courseTitle: 'Python Data Science Essentials',
      issuedDate: 'May 2026',
      verificationCode: 'SC-554192',
      grade: 'Grade A+ (99%)',
      certificateUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop',
      skills: ['Python', 'Pandas', 'NumPy', 'Data Visualization']
    }
  ]);

  // User Skill Tree Nodes
  const [skills, setSkills] = useState<SkillNode[]>([
    { id: 's1', name: 'React.js & Frontend', category: 'Web', level: 'Advanced', percentage: 88, unlocked: true, color: 'from-blue-500 to-indigo-500' },
    { id: 's2', name: 'JavaScript ES6+', category: 'Core', level: 'Master', percentage: 95, unlocked: true, color: 'from-amber-400 to-orange-500' },
    { id: 's3', name: 'Node.js & Express', category: 'Backend', level: 'Advanced', percentage: 82, unlocked: true, color: 'from-emerald-500 to-teal-500' },
    { id: 's4', name: 'TypeScript', category: 'Core', level: 'Intermediate', percentage: 74, unlocked: true, color: 'from-cyan-500 to-blue-500' },
    { id: 's5', name: 'Python & AI Fundamentals', category: 'Data & AI', level: 'Intermediate', percentage: 65, unlocked: true, color: 'from-purple-500 to-indigo-500' },
    { id: 's6', name: 'SQL & Firestore Databases', category: 'Database', level: 'Intermediate', percentage: 58, unlocked: true, color: 'from-fuchsia-500 to-pink-500' },
    { id: 's7', name: 'System Architecture & Docker', category: 'DevOps', level: 'Beginner', percentage: 38, unlocked: false, color: 'from-rose-500 to-amber-500' }
  ]);

  const selectedPath = learningPathsData.find(p => p.id === selectedPathId);

  // References for horizontal scrolling of sections
  const continueLearningRef = useRef<HTMLDivElement>(null);
  const recommendedPathsRef = useRef<HTMLDivElement>(null);
  const topCoursesRef = useRef<HTMLDivElement>(null);
  const topicsRef = useRef<HTMLDivElement>(null);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, offset: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Start lesson
  const startLesson = (step: LearningStep) => {
    const videoObj: Video = {
      id: `learn-${step.id}`,
      title: `${selectedPath?.title || 'Course'} - ${step.title}`,
      description: `Comprehensive video lecture belonging to ${selectedPath?.title || 'Course'}.`,
      category: 'learn',
      coverUrl: step.coverUrl,
      duration: step.duration,
      views: "185K views",
      uploadDate: "3 weeks ago",
      creator: "SoftCast Academy",
      creatorVerified: true,
      videoUrl: step.videoUrl,
      comments: [
        { 
          id: `lc-1`, 
          userName: 'Aslbek', 
          userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop', 
          text: 'Watching this step now. Love the pacing!', 
          likes: 4, 
          timestamp: 'Just now' 
        }
      ]
    };

    onPlayVideo(videoObj);

    if (step.quiz && !step.completed) {
      setActiveStepForQuiz(step);
      setSelectedOption(null);
      setQuizSubmitted(false);
      setQuizSuccess(false);
    }
  };

  // Submit step quiz
  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption === null || !activeStepForQuiz?.quiz) return;

    setQuizSubmitted(true);
    const isCorrect = selectedOption === activeStepForQuiz.quiz.correctIndex;
    setQuizSuccess(isCorrect);

    if (isCorrect) {
      const xpToEarn = isPremium ? 100 : 50;
      onAddXp(xpToEarn);
      showToast(`To'g'ri javob! +${xpToEarn} XP qo'shildi 🏆`);

      if (selectedPathId) {
        const updatedPaths = learningPathsData.map((p) => {
          if (p.id === selectedPathId) {
            return {
              ...p,
              steps: p.steps.map((s) => {
                if (s.id === activeStepForQuiz.id) {
                  return { ...s, completed: true };
                }
                return s;
              })
            };
          }
          return p;
        });
        setLearningPathsData(updatedPaths);
      }
    } else {
      showToast("Afsuski, javob noto'g'ri. Dars materialini qayta ko'rib chiqing.");
    }
  };

  // Mentor Chat Send
  const handleSendMentorMessage = async () => {
    if (!mentorInput.trim()) return;
    const userMsgText = mentorInput.trim();
    setMentorInput('');

    const newMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userMsgText,
      timestamp: 'Just now'
    };
    setChatMessages(prev => [...prev, newMsg]);
    setMentorLoading(true);

    try {
      const res = await fetch('/api/ai-learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'mentor_chat', prompt: userMsgText, goal: careerGoal })
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setChatMessages(prev => [
          ...prev,
          {
            id: `m-${Date.now()}`,
            sender: 'mentor',
            text: data.reply,
            timestamp: 'Just now'
          }
        ]);
      }
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          sender: 'mentor',
          text: `Zavqli o'rganish! "${userMsgText}" bo'yicha eng ma'qul darslarni Continue Learning bo'limida topishingiz mumkin.`,
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setMentorLoading(false);
    }
  };

  // Generate Career Roadmap
  const handleGenerateCareerRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    try {
      const res = await fetch('/api/ai-learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'roadmap_generator', goal: careerGoal, timeframe: timeframeMonths })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedRoadmap(data.data);
        onAddXp(30);
        showToast('🚀 AI Career Roadmap muvaffaqiyatli tayyorlandi! (+30 XP)');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  // Generate Custom AI Quiz
  const handleGenerateCustomQuiz = async () => {
    if (!quizTopicInput.trim()) return;
    setIsGeneratingQuiz(true);
    try {
      const res = await fetch('/api/ai-learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'quiz_generator', topic: quizTopicInput, level: quizLevelInput })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCustomGeneratedQuiz(data.data);
        showToast(`"${quizTopicInput}" mavzusi bo'yicha AI test tayyorlandi! 📝`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const getCompletedCount = (path: LearningPath) => path.steps.filter((s) => s.completed).length;

  // Render Circular Progress
  const renderCircularProgress = (percentage: number, colorStart: string, colorEnd: string, uniqueId: string) => {
    const radius = 24;
    const strokeWidth = 3.5;
    const normalizedRadius = radius - strokeWidth;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
        <svg className="w-14 h-14 transform -rotate-90">
          <circle
            className="text-white/5"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            stroke={`url(#grad-${uniqueId})`}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <defs>
            <linearGradient id={`grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorStart} />
              <stop offset="100%" stopColor={colorEnd} />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute text-[10px] font-extrabold text-white">{percentage}%</span>
      </div>
    );
  };

  // Subtopics data for Browse Topics
  const topicSubCategories: Record<string, string[]> = {
    Programming: ['Frontend Development', 'Backend Engineering', 'Mobile Apps', 'AI & Machine Learning', 'Game Development'],
    'Data Science': ['Python for Data', 'Machine Learning', 'Deep Learning', 'Data Visualization', 'SQL & Databases'],
    Design: ['UI/UX Design', 'Figma Mastery', 'Graphic Design', 'Motion Design', 'Product Design'],
    Business: ['Entrepreneurship', 'Product Management', 'Startup Growth', 'Finance', 'Leadership'],
    Marketing: ['Digital Marketing', 'SEO Optimization', 'Content Creation', 'Social Media Ads', 'Brand Strategy'],
    'Personal Development': ['Productivity', 'Time Management', 'Public Speaking', 'Critical Thinking', 'Mindfulness'],
    Languages: ['English Speaking', 'Business English', 'Spanish', 'German', 'Japanese']
  };

  return (
    <div 
      id="learn-page-main-container" 
      className="w-full h-full text-left bg-[#05040d] text-white overflow-y-auto max-h-[calc(100vh-4.5rem)] scrollbar-thin scrollbar-thumb-purple-900/40 select-none pb-28 relative font-sans"
    >
      {/* GLOBAL TOAST OVERLAY */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            className="fixed top-20 right-8 z-50 bg-[#160f3d] border border-[#5341cb]/80 px-4 py-3 rounded-xl flex items-center gap-3 shadow-2xl text-xs max-w-sm"
          >
            <Sparkles className="w-4.5 h-4.5 text-purple-400 shrink-0 animate-pulse" />
            <p className="text-gray-100 font-medium leading-snug">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!selectedPathId ? (
          /* DASHBOARD VIEW */
          <motion.div
            key="learn-dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-6 md:p-8 space-y-8 max-w-[1300px] mx-auto"
          >
            {/* HEADER BLOCK WITH SEARCH */}
            <div id="learn-page-hero-title" className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1b1544]/40 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white font-display">Learn</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-950/80 border border-purple-500/40 text-purple-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    AI-Powered Academy
                  </span>
                </div>
                <p className="text-xs md:text-sm text-gray-400 font-medium">Build skills, expand knowledge and grow every day.</p>
              </div>

              {/* ACTION BUTTONS & SEARCH BAR */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for courses, skills, topics..."
                    className="w-full bg-[#0d0926] border border-[#261d56]/80 focus:border-purple-500 text-white pl-9 pr-3 py-2 rounded-xl text-xs placeholder:text-gray-500 outline-none transition-all"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* KILLER FEATURE BUTTON 1: AI MENTOR */}
                <button
                  onClick={() => setIsMentorOpen(true)}
                  className="w-full sm:w-auto px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
                >
                  <Bot className="w-4 h-4 text-purple-200 animate-pulse" />
                  <span>AI Mentor 🤖</span>
                </button>

                {/* KILLER FEATURE BUTTON 2: SKILL TREE */}
                <button
                  onClick={() => setIsSkillTreeOpen(true)}
                  className="w-full sm:w-auto px-3 py-2 bg-[#120d30] hover:bg-purple-950/60 border border-[#2d226b] text-purple-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 whitespace-nowrap"
                >
                  <GitBranch className="w-4 h-4 text-cyan-400" />
                  <span>Skill Tree 🌳</span>
                </button>
              </div>
            </div>

            {/* SEARCH RESULTS OVERLAY (IF TYPING) */}
            {searchQuery.trim() && (
              <div className="p-4 bg-[#0a081a] border border-purple-500/30 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <p className="text-xs font-bold text-purple-300">
                    Search results for: <strong className="text-white">"{searchQuery}"</strong>
                  </p>
                  <span className="text-[10px] text-gray-400 font-mono">Courses, Topics, Skills</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {learningPathsData
                    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(path => (
                      <div 
                        key={path.id}
                        onClick={() => {
                          setSelectedPathId(path.id);
                          setSearchQuery('');
                        }}
                        className="p-3 bg-[#120d30] border border-white/5 hover:border-purple-500/40 rounded-xl cursor-pointer flex items-center gap-3"
                      >
                        <div className="p-2 bg-purple-500/20 text-purple-300 rounded-lg shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 text-left">
                          <h5 className="text-xs font-bold text-white truncate">{path.title}</h5>
                          <p className="text-[10px] text-gray-400 truncate">{path.category} • {path.steps.length} Steps</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* TOP ROW KPI GRID (4 CARDS) */}
            <div id="learn-kpi-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              
              {/* Card 1: My Learning Path */}
              <div 
                className="relative p-5 bg-gradient-to-br from-[#120f2b] to-[#080718] border border-[#221c4e] rounded-2xl flex flex-col justify-between overflow-hidden group hover:border-[#3d2f83]/80 transition-all duration-300 shadow-md h-36"
              >
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-600/10 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-600/15 transition-all" />
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-[13px] font-bold text-white tracking-wide">My Learning Path</h3>
                    <p className="text-[10.5px] text-gray-400">Continue where you left off</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-950/20">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#1e1742]/40">
                  <div className="flex flex-col gap-1 w-full max-w-[70%]">
                    <span className="text-[11px] font-bold text-purple-400">3/7 Courses Active</span>
                    <div className="w-full bg-[#171430] h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full w-[43%]" />
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedPathId('learn-path-webdev')}
                    className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-purple-600 hover:border-purple-500 flex items-center justify-center text-white active:scale-90 transition-all shrink-0"
                    title="Open Learning Path"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card 2: Skill Quizzes */}
              <div 
                className="relative p-5 bg-gradient-to-br from-[#0c142b] to-[#040918] border border-[#142347] rounded-2xl flex flex-col justify-between overflow-hidden group hover:border-[#1e346c]/80 transition-all duration-300 shadow-md h-36"
              >
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-600/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-600/15 transition-all" />
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-[13px] font-bold text-white tracking-wide">Skill Quizzes</h3>
                    <p className="text-[10.5px] text-gray-400">Test knowledge & level up</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/20">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#122244]/40">
                  <span className="text-[11px] font-bold text-cyan-400">12 Quizzes Ready</span>
                  <button 
                    onClick={() => setIsQuizGeneratorOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-600 hover:text-white text-[10px] font-bold transition-all active:scale-90"
                  >
                    AI Test Yarat ✨
                  </button>
                </div>
              </div>

              {/* Card 3: Certificates */}
              <div 
                className="relative p-5 bg-gradient-to-br from-[#1b0d2d] to-[#0b0515] border border-[#30164e] rounded-2xl flex flex-col justify-between overflow-hidden group hover:border-[#4d247c]/80 transition-all duration-300 shadow-md h-36"
              >
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-fuchsia-600/10 rounded-full blur-2xl pointer-events-none group-hover:bg-fuchsia-600/15 transition-all" />
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-[13px] font-bold text-white tracking-wide">Certificates</h3>
                    <p className="text-[10.5px] text-gray-400">Showcase verified credentials</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 shadow-lg shadow-fuchsia-950/20">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#26123f]/40">
                  <span className="text-[11px] font-bold text-fuchsia-400">{certificates.length} Earned</span>
                  <button 
                    onClick={() => setIsCertificatesOpen(true)}
                    className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-fuchsia-600 hover:border-fuchsia-500 flex items-center justify-center text-white active:scale-90 transition-all shrink-0"
                    title="View Certificates"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card 4: Learning Streak */}
              <div 
                className="relative p-5 bg-gradient-to-br from-[#1e0a1a] to-[#0b040a] border border-[#391531] rounded-2xl flex flex-col justify-between overflow-hidden group hover:border-[#5a214d]/80 transition-all duration-300 shadow-md h-36"
              >
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-rose-600/10 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-600/15 transition-all" />
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-[13px] font-bold text-white tracking-wide">Learning Streak</h3>
                    <p className="text-[10.5px] text-gray-400">Daily habit progress</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-950/20">
                    <Flame className="w-5 h-5 animate-bounce" style={{ animationDuration: '3s' }} />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#2b1025]/40">
                  <div className="flex flex-col gap-1 w-full max-w-[70%]">
                    <span className="text-[11px] font-bold text-rose-400">🔥 7 Days Streak</span>
                    <div className="w-full bg-[#1c0c19] h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full w-[70%]" />
                    </div>
                  </div>
                  <button 
                    onClick={() => showToast('🔥 7 kunlik uzluksiz ta\'lim! Kunlik maqsad: 20 daqiqa.')}
                    className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-rose-600 hover:border-rose-500 flex items-center justify-center text-white active:scale-90 transition-all shrink-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* CAREER ROADMAP GENERATOR BANNER */}
            <div className="p-5 bg-gradient-to-r from-[#170e3b] via-[#0d0928] to-[#060412] border border-purple-500/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                  <Compass className="w-6 h-6 animate-spin-slow" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm md:text-base font-bold text-white tracking-tight flex items-center gap-2">
                    AI Career Roadmap Builder 🚀
                    <span className="text-[9px] bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono px-2 py-0.5 rounded font-bold">SMART</span>
                  </h3>
                  <p className="text-xs text-gray-300">
                    Target a dream role (e.g., "Full Stack Web Developer in 6 months") and let SoftCast AI synthesize your custom curriculum.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCareerRoadmapOpen(true)}
                className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all shrink-0 active:scale-95 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-purple-200" />
                <span>Build Career Path</span>
              </button>
            </div>

            {/* CONTINUE LEARNING SECTION */}
            <div id="section-continue-learning" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Continue Learning</h2>
                  <p className="text-[11px] text-gray-400">Pick up where you left off.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-[11px] font-bold text-purple-400 hover:text-purple-300 transition-colors">See all</button>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => scrollContainer(continueLearningRef, -280)}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
                    >
                      &larr;
                    </button>
                    <button 
                      onClick={() => scrollContainer(continueLearningRef, 280)}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>
              </div>

              {/* Horizontal Scroll Containers */}
              <div 
                ref={continueLearningRef}
                className="flex gap-4 md:gap-5 overflow-x-auto pb-2 scrollbar-none scroll-smooth snap-x"
              >
                {/* Card 1: React.js Complete Guide */}
                <div className="min-w-[250px] md:min-w-[270px] flex-1 bg-[#0f0e20]/50 border border-[#232049]/40 rounded-xl p-3.5 space-y-3 shrink-0 snap-start group hover:border-purple-500/30 hover:bg-[#0f0e20]/80 transition-all">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-[#181142] flex items-center justify-center border border-[#2b2762]">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute border border-blue-400/30 rounded-full w-14 h-6 animate-spin" style={{ animationDuration: '8s' }} />
                      <div className="absolute border border-blue-400/30 rounded-full w-14 h-6 rotate-60 animate-spin" style={{ animationDuration: '11s' }} />
                      <div className="absolute border border-blue-400/30 rounded-full w-14 h-6 -rotate-60 animate-spin" style={{ animationDuration: '14s' }} />
                      <div className="w-2.5 h-2.5 bg-blue-400 rounded-full shadow-lg shadow-blue-400" />
                    </div>
                    <button 
                      onClick={() => setSelectedPathId('learn-path-webdev')}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-full bg-purple-600 hover:scale-105 active:scale-95 flex items-center justify-center text-white shadow-md">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </button>
                    <span className="absolute bottom-1.5 right-1.5 text-[9.5px] px-1.5 py-0.5 bg-black/80 text-white rounded font-mono font-bold">32:45</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10.5px]">
                      <div className="w-[82%] bg-[#1a1738] h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" style={{ width: '65%' }} />
                      </div>
                      <span className="text-gray-400 font-bold">65%</span>
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-[13px] text-white tracking-wide line-clamp-1">React.js Complete Guide</h4>
                      <p className="text-[10.5px] text-purple-400 font-semibold flex items-center gap-1 mt-0.5">
                        CodeLab
                        <span className="w-3 h-3 rounded-full bg-purple-500/25 flex items-center justify-center text-[7px] text-purple-300">✓</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 2: Python for Beginners */}
                <div className="min-w-[250px] md:min-w-[270px] flex-1 bg-[#0f0e20]/50 border border-[#232049]/40 rounded-xl p-3.5 space-y-3 shrink-0 snap-start group hover:border-purple-500/30 hover:bg-[#0f0e20]/80 transition-all">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-[#1d1e2e] flex items-center justify-center border border-[#3b3d56]">
                    <div className="relative w-14 h-14 flex flex-col items-center justify-center">
                      <div className="w-8 h-8 rounded-t-lg rounded-l-lg border-2 border-indigo-400/60 bg-indigo-500/10 relative -right-1 -top-1 flex items-start justify-start p-1">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                      </div>
                      <div className="w-8 h-8 rounded-b-lg rounded-r-lg border-2 border-amber-400/60 bg-amber-500/10 relative -left-1 -bottom-5 flex items-end justify-end p-1 absolute">
                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedPathId('learn-path-datascience')}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-full bg-purple-600 hover:scale-105 active:scale-95 flex items-center justify-center text-white shadow-md">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </button>
                    <span className="absolute bottom-1.5 right-1.5 text-[9.5px] px-1.5 py-0.5 bg-black/80 text-white rounded font-mono font-bold">28:12</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10.5px]">
                      <div className="w-[82%] bg-[#1a1738] h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" style={{ width: '47%' }} />
                      </div>
                      <span className="text-gray-400 font-bold">47%</span>
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-[13px] text-white tracking-wide line-clamp-1">Python for Beginners</h4>
                      <p className="text-[10.5px] text-purple-400 font-semibold flex items-center gap-1 mt-0.5">
                        TechFlow
                        <span className="w-3 h-3 rounded-full bg-purple-500/25 flex items-center justify-center text-[7px] text-purple-300">✓</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 3: UI/UX Design Principles */}
                <div className="min-w-[250px] md:min-w-[270px] flex-1 bg-[#0f0e20]/50 border border-[#232049]/40 rounded-xl p-3.5 space-y-3 shrink-0 snap-start group hover:border-purple-500/30 hover:bg-[#0f0e20]/80 transition-all">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-[#241328] flex items-center justify-center border border-[#482850]">
                    <div className="relative flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-pink-500/15 border border-pink-400/50 flex items-center justify-center text-[9px] font-extrabold text-pink-300 shadow">UI</div>
                      <div className="w-6 h-6 rounded-lg bg-fuchsia-500/15 border border-fuchsia-400/50 flex items-center justify-center text-[9px] font-extrabold text-fuchsia-300 shadow">UX</div>
                    </div>
                    <button 
                      onClick={() => setSelectedPathId('learn-path-mobile')}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-full bg-purple-600 hover:scale-105 active:scale-95 flex items-center justify-center text-white shadow-md">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </button>
                    <span className="absolute bottom-1.5 right-1.5 text-[9.5px] px-1.5 py-0.5 bg-black/80 text-white rounded font-mono font-bold">21:30</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10.5px]">
                      <div className="w-[82%] bg-[#1a1738] h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" style={{ width: '80%' }} />
                      </div>
                      <span className="text-gray-400 font-bold">80%</span>
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-[13px] text-white tracking-wide line-clamp-1">UI/UX Design Principles</h4>
                      <p className="text-[10.5px] text-purple-400 font-semibold flex items-center gap-1 mt-0.5">
                        DesignHub
                        <span className="w-3 h-3 rounded-full bg-purple-500/25 flex items-center justify-center text-[7px] text-purple-300">✓</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 4: Cybersecurity Essentials */}
                <div className="min-w-[250px] md:min-w-[270px] flex-1 bg-[#0f0e20]/50 border border-[#232049]/40 rounded-xl p-3.5 space-y-3 shrink-0 snap-start group hover:border-purple-500/30 hover:bg-[#0f0e20]/80 transition-all">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-[#0c2225] flex items-center justify-center border border-[#19454b]">
                    <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shadow-inner">
                      <Terminal className="w-5 h-5 animate-pulse" />
                    </div>
                    <button 
                      onClick={() => setSelectedPathId('learn-path-devops')}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-full bg-purple-600 hover:scale-105 active:scale-95 flex items-center justify-center text-white shadow-md">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </button>
                    <span className="absolute bottom-1.5 right-1.5 text-[9.5px] px-1.5 py-0.5 bg-black/80 text-white rounded font-mono font-bold">34:18</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10.5px]">
                      <div className="w-[82%] bg-[#1a1738] h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" style={{ width: '30%' }} />
                      </div>
                      <span className="text-gray-400 font-bold">30%</span>
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-[13px] text-white tracking-wide line-clamp-1">Cybersecurity Essentials</h4>
                      <p className="text-[10.5px] text-purple-400 font-semibold flex items-center gap-1 mt-0.5">
                        CyberSec
                        <span className="w-3 h-3 rounded-full bg-purple-500/25 flex items-center justify-center text-[7px] text-purple-300">✓</span>
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* RECOMMENDED LEARNING PATHS */}
            <div id="section-recommended-paths" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Recommended Learning Paths</h2>
                  <p className="text-[11px] text-gray-400">Curated paths to help you achieve your goals.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-[11px] font-bold text-purple-400 hover:text-purple-300 transition-colors">See all</button>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => scrollContainer(recommendedPathsRef, -280)}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
                    >
                      &larr;
                    </button>
                    <button 
                      onClick={() => scrollContainer(recommendedPathsRef, 280)}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>
              </div>

              <div 
                ref={recommendedPathsRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
              >
                {/* Path 1: Full Stack Web Developer */}
                <div 
                  onClick={() => setSelectedPathId('learn-path-webdev')}
                  className="p-5 bg-gradient-to-b from-[#110e28]/70 to-[#070614]/80 border border-[#231b52]/40 rounded-2xl flex flex-col justify-between group hover:border-purple-500/50 hover:from-[#110e28]/90 hover:to-[#070614]/90 transition-all duration-300 shadow-md h-56 cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl shrink-0">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">Full Stack Web Developer</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-extrabold bg-white/5 w-fit px-2 py-0.5 rounded-md">
                      <span>12 Courses</span>
                      <span className="w-1 h-1 rounded-full bg-gray-500" />
                      <span>48 Hours</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">Become a full stack developer from scratch with this complete path.</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#1e1647]/50">
                    <span className="text-[10px] text-purple-300 font-bold group-hover:underline">Explore Road &rarr;</span>
                    {renderCircularProgress(72, '#3b82f6', '#ec4899', 'webdev')}
                  </div>
                </div>

                {/* Path 2: Data Science Roadmap */}
                <div 
                  onClick={() => setSelectedPathId('learn-path-datascience')}
                  className="p-5 bg-gradient-to-b from-[#110e28]/70 to-[#070614]/80 border border-[#231b52]/40 rounded-2xl flex flex-col justify-between group hover:border-purple-500/50 hover:from-[#110e28]/90 hover:to-[#070614]/90 transition-all duration-300 shadow-md h-56 cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl shrink-0">
                        <Database className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">Data Science Roadmap</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-extrabold bg-white/5 w-fit px-2 py-0.5 rounded-md">
                      <span>10 Courses</span>
                      <span className="w-1 h-1 rounded-full bg-gray-500" />
                      <span>36 Hours</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">Learn data science from basics to advanced machine learning.</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#1e1647]/50">
                    <span className="text-[10px] text-purple-300 font-bold group-hover:underline">Explore Road &rarr;</span>
                    {renderCircularProgress(45, '#06b6d4', '#3b82f6', 'datasci')}
                  </div>
                </div>

                {/* Path 3: Mobile App Development */}
                <div 
                  onClick={() => setSelectedPathId('learn-path-mobile')}
                  className="p-5 bg-gradient-to-b from-[#110e28]/70 to-[#070614]/80 border border-[#231b52]/40 rounded-2xl flex flex-col justify-between group hover:border-purple-500/50 hover:from-[#110e28]/90 hover:to-[#070614]/90 transition-all duration-300 shadow-md h-56 cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl shrink-0">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">Mobile App Development</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-extrabold bg-white/5 w-fit px-2 py-0.5 rounded-md">
                      <span>9 Courses</span>
                      <span className="w-1 h-1 rounded-full bg-gray-500" />
                      <span>32 Hours</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">Build Android & iOS apps and publish to the stores.</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#1e1647]/50">
                    <span className="text-[10px] text-purple-300 font-bold group-hover:underline">Explore Road &rarr;</span>
                    {renderCircularProgress(60, '#8b5cf6', '#d946ef', 'mobile')}
                  </div>
                </div>

                {/* Path 4: DevOps Engineer */}
                <div 
                  onClick={() => setSelectedPathId('learn-path-devops')}
                  className="p-5 bg-gradient-to-b from-[#110e28]/70 to-[#070614]/80 border border-[#231b52]/40 rounded-2xl flex flex-col justify-between group hover:border-purple-500/50 hover:from-[#110e28]/90 hover:to-[#070614]/90 transition-all duration-300 shadow-md h-56 cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 rounded-xl shrink-0">
                        <Infinity className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">DevOps Engineer</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-extrabold bg-white/5 w-fit px-2 py-0.5 rounded-md">
                      <span>8 Courses</span>
                      <span className="w-1 h-1 rounded-full bg-gray-500" />
                      <span>28 Hours</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">Master DevOps tools, CI/CD and cloud deployment.</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#1e1647]/50">
                    <span className="text-[10px] text-purple-300 font-bold group-hover:underline">Explore Road &rarr;</span>
                    {renderCircularProgress(35, '#a21caf', '#3b82f6', 'devops')}
                  </div>
                </div>

              </div>
            </div>

            {/* TOP COURSES FOR YOU */}
            <div id="section-top-courses" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Top Courses For You</h2>
                  <p className="text-[11px] text-gray-400">AI recommended courses based on your interests.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-[11px] font-bold text-purple-400 hover:text-purple-300 transition-colors">See all</button>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => scrollContainer(topCoursesRef, -280)}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
                    >
                      &larr;
                    </button>
                    <button 
                      onClick={() => scrollContainer(topCoursesRef, 280)}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>
              </div>

              <div 
                ref={topCoursesRef}
                className="flex gap-4 md:gap-5 overflow-x-auto pb-2 scrollbar-none scroll-smooth snap-x"
              >
                {/* Course 1: Machine Learning A-Z */}
                <div className="min-w-[210px] flex-1 bg-[#09071c]/60 border border-[#201944]/40 rounded-2xl p-3 space-y-3 shrink-0 snap-start group hover:border-purple-500/30 transition-all">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1f0d3c] flex items-center justify-center border border-[#3e1b78]">
                    <span className="absolute top-2 left-2 z-10 text-[9px] px-2 py-0.5 bg-indigo-600 text-white font-extrabold rounded-full shadow tracking-wider uppercase">New</span>
                    <div className="relative w-14 h-14 text-purple-400 flex items-center justify-center">
                      <Terminal className="w-7 h-7 animate-pulse" />
                    </div>
                    <button 
                      onClick={() => setSelectedPathId('learn-path-ai')}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"
                    >
                      <div className="w-9 h-9 rounded-full bg-purple-600 hover:scale-105 active:scale-95 flex items-center justify-center text-white shadow">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </button>
                    <span className="absolute bottom-1.5 right-1.5 text-[9px] px-1 bg-black/80 rounded font-mono text-white font-bold">19:45</span>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <h4 className="font-bold text-[12.5px] text-white tracking-wide line-clamp-1">Machine Learning A-Z</h4>
                    <p className="text-[10px] text-purple-400 font-semibold flex items-center gap-1">
                      AI Revolution
                      <span className="w-3 h-3 rounded-full bg-purple-500/20 flex items-center justify-center text-[7px] text-purple-300">✓</span>
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold pt-1">
                      <span className="text-amber-400">★ 4.8</span>
                      <span>12K students</span>
                    </div>
                  </div>
                </div>

                {/* Course 2: Node.js Crash Course */}
                <div className="min-w-[210px] flex-1 bg-[#09071c]/60 border border-[#201944]/40 rounded-2xl p-3 space-y-3 shrink-0 snap-start group hover:border-purple-500/30 transition-all">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0a1e12] flex items-center justify-center border border-[#143d25]">
                    <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xs">JS</div>
                    <button 
                      onClick={() => setSelectedPathId('learn-path-webdev')}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"
                    >
                      <div className="w-9 h-9 rounded-full bg-purple-600 hover:scale-105 active:scale-95 flex items-center justify-center text-white shadow">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </button>
                    <span className="absolute bottom-1.5 right-1.5 text-[9px] px-1 bg-black/80 rounded font-mono text-white font-bold">16:30</span>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <h4 className="font-bold text-[12.5px] text-white tracking-wide line-clamp-1">Node.js Crash Course</h4>
                    <p className="text-[10px] text-purple-400 font-semibold flex items-center gap-1">
                      CodeLab
                      <span className="w-3 h-3 rounded-full bg-purple-500/20 flex items-center justify-center text-[7px] text-purple-300">✓</span>
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold pt-1">
                      <span className="text-amber-400">★ 4.7</span>
                      <span>8.6K students</span>
                    </div>
                  </div>
                </div>

                {/* Course 3: Docker for Beginners */}
                <div className="min-w-[210px] flex-1 bg-[#09071c]/60 border border-[#201944]/40 rounded-2xl p-3 space-y-3 shrink-0 snap-start group hover:border-purple-500/30 transition-all">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0d1c3c] flex items-center justify-center border border-[#1a3878]">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-blue-500/25 border border-blue-400/40 rounded shadow-md" />
                      <div className="w-3 h-3 bg-blue-500/45 border border-blue-400/50 rounded shadow-md" />
                      <div className="w-3 h-3 bg-blue-500/25 border border-blue-400/40 rounded shadow-md" />
                    </div>
                    <button 
                      onClick={() => setSelectedPathId('learn-path-devops')}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"
                    >
                      <div className="w-9 h-9 rounded-full bg-purple-600 hover:scale-105 active:scale-95 flex items-center justify-center text-white shadow">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </button>
                    <span className="absolute bottom-1.5 right-1.5 text-[9px] px-1 bg-black/80 rounded font-mono text-white font-bold">14:22</span>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <h4 className="font-bold text-[12.5px] text-white tracking-wide line-clamp-1">Docker for Beginners</h4>
                    <p className="text-[10px] text-purple-400 font-semibold flex items-center gap-1">
                      TechFlow
                      <span className="w-3 h-3 rounded-full bg-purple-500/20 flex items-center justify-center text-[7px] text-purple-300">✓</span>
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold pt-1">
                      <span className="text-amber-400">★ 4.9</span>
                      <span>7.1K students</span>
                    </div>
                  </div>
                </div>

                {/* Course 4: AWS Cloud Practitioner */}
                <div className="min-w-[210px] flex-1 bg-[#09071c]/60 border border-[#201944]/40 rounded-2xl p-3 space-y-3 shrink-0 snap-start group hover:border-purple-500/30 transition-all">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-[#2d1b0d] flex items-center justify-center border border-[#5b361a]">
                    <span className="text-[10px] font-black tracking-widest text-orange-400 uppercase bg-orange-400/5 px-2 py-1 rounded border border-orange-400/20">aws</span>
                    <button 
                      onClick={() => setSelectedPathId('learn-path-devops')}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"
                    >
                      <div className="w-9 h-9 rounded-full bg-purple-600 hover:scale-105 active:scale-95 flex items-center justify-center text-white shadow">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </button>
                    <span className="absolute bottom-1.5 right-1.5 text-[9px] px-1 bg-black/80 rounded font-mono text-white font-bold">22:10</span>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <h4 className="font-bold text-[12.5px] text-white tracking-wide line-clamp-1">AWS Cloud Practitioner</h4>
                    <p className="text-[10px] text-purple-400 font-semibold flex items-center gap-1">
                      CloudZone
                      <span className="w-3 h-3 rounded-full bg-purple-500/20 flex items-center justify-center text-[7px] text-purple-300">✓</span>
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold pt-1">
                      <span className="text-amber-400">★ 4.6</span>
                      <span>6.2K students</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* BROWSE TOPICS */}
            <div id="section-browse-topics" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Browse Topics</h2>
                  <p className="text-[11px] text-gray-400">Find topics you want to learn.</p>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => scrollContainer(topicsRef, -180)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
                  >
                    &larr;
                  </button>
                  <button 
                    onClick={() => scrollContainer(topicsRef, 180)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
                  >
                    &rarr;
                  </button>
                </div>
              </div>

              <div 
                ref={topicsRef}
                className="flex gap-3 overflow-x-auto pb-4 scrollbar-none scroll-smooth snap-x"
              >
                {[
                  { name: 'Programming', count: '128K videos', icon: Terminal, color: 'text-blue-400' },
                  { name: 'Data Science', count: '86K videos', icon: Database, color: 'text-indigo-400' },
                  { name: 'Design', count: '64K videos', icon: Palette, color: 'text-pink-400' },
                  { name: 'Business', count: '53K videos', icon: Briefcase, color: 'text-emerald-400' },
                  { name: 'Marketing', count: '42K videos', icon: Megaphone, color: 'text-amber-400' },
                  { name: 'Personal Development', count: '38K videos', icon: Sparkles, color: 'text-cyan-400' },
                  { name: 'Languages', count: '29K videos', icon: Globe, color: 'text-purple-400' }
                ].map((top) => {
                  const Icon = top.icon;
                  const isSelected = activeTopic === top.name;
                  return (
                    <button 
                      key={top.name}
                      onClick={() => {
                        if (isSelected) {
                          setActiveTopic('all');
                          setSelectedSubTopic(null);
                        } else {
                          setActiveTopic(top.name);
                          setSelectedSubTopic(null);
                        }
                      }}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all shrink-0 text-left snap-start ${
                        isSelected 
                          ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-950/40' 
                          : 'bg-[#120d30] border-white/5 hover:border-purple-500/40 text-gray-300'
                      }`}
                    >
                      <div className="p-1.5 bg-white/10 rounded-lg">
                        <Icon className={`w-4 h-4 ${top.color}`} />
                      </div>
                      <div>
                        <h5 className="text-[12px] font-bold leading-none">{top.name}</h5>
                        <span className="text-[10px] opacity-70 font-bold mt-1 inline-block">{top.count}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* SUB-TOPICS BREAKDOWN DRAWER IF TOPIC SELECTED */}
              {activeTopic !== 'all' && topicSubCategories[activeTopic] && (
                <div className="p-4 bg-[#0d0926] border border-purple-500/30 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-purple-300 flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      Sub-topics in {activeTopic}:
                    </h4>
                    <button onClick={() => setActiveTopic('all')} className="text-[10px] text-gray-400 hover:text-white">Close</button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {topicSubCategories[activeTopic].map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          setSelectedSubTopic(sub);
                          showToast(`Sub-topic filtri: "${sub}"`);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          selectedSubTopic === sub
                            ? 'bg-purple-600 border-purple-400 text-white'
                            : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-300'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </motion.div>
        ) : (
          /* DETAILED COURSE EXPLORE VIEW */
          <motion.div
            key="course-explore"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="p-6 md:p-8 space-y-6 max-w-[1200px] mx-auto"
          >
            <button
              onClick={() => {
                setSelectedPathId(null);
                setActiveStepForQuiz(null);
              }}
              className="inline-flex items-center gap-2 text-xs md:text-sm text-purple-400 hover:text-purple-300 font-bold transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Learning Hub
            </button>

            <div className="relative p-6 bg-gradient-to-r from-[#171342] via-[#09071c] to-[#04030d] border border-[#2b226e]/40 rounded-2xl overflow-hidden shadow-lg">
              <div className="absolute top-1/2 -right-12 -translate-y-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-[75%]">
                  <span className="text-[10px] px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 font-bold rounded-full uppercase tracking-wider">
                    {selectedPath?.category || 'Roadmap'}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">{selectedPath?.title}</h2>
                  <p className="text-xs md:text-sm text-gray-400 leading-normal">{selectedPath?.description}</p>
                </div>
                <div className="shrink-0 flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 font-bold">Progress Status</p>
                    <p className="text-xs font-black text-white">{getCompletedCount(selectedPath!)} / {selectedPath?.steps.length} Steps Completed</p>
                  </div>
                  {renderCircularProgress(
                    selectedPath ? Math.round((getCompletedCount(selectedPath) / selectedPath.steps.length) * 100) : 0, 
                    '#3b82f6', '#ec4899', 'explore-progress'
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse" />
                    Interactive Syllabus Sequence
                  </h3>
                  <span className="text-[11px] text-purple-400 font-bold">+{selectedPath?.xpReward} total XP reward</span>
                </div>

                <div className="space-y-3.5">
                  {selectedPath?.steps.map((step, idx) => {
                    const isNextToWatch = idx === 0 || selectedPath.steps[idx - 1].completed;
                    return (
                      <div
                        key={step.id}
                        className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                          step.completed
                            ? 'bg-[#0f211c]/40 border-emerald-500/20 hover:border-emerald-500/30'
                            : isNextToWatch
                            ? 'bg-[#181142]/40 border-purple-500/20 hover:border-purple-500/30'
                            : 'bg-white/5 border-white/5 opacity-55'
                        }`}
                      >
                        <div className="shrink-0 mt-1 sm:mt-0">
                          {step.completed ? (
                            <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-purple-400/60">
                              <Circle className="w-4 h-4" />
                            </div>
                          )}
                        </div>

                        <div className="relative aspect-video w-32 bg-purple-950/20 rounded-xl overflow-hidden shrink-0 border border-white/5">
                          <img src={step.coverUrl} alt={step.title} className="w-full h-full object-cover" />
                          <span className="absolute bottom-1.5 right-1.5 text-[9px] px-1 bg-black/85 rounded font-mono text-white font-bold">
                            {step.duration}
                          </span>
                        </div>

                        <div className="flex-1 text-left min-w-0 space-y-0.5">
                          <span className="text-[9px] text-purple-400 font-extrabold tracking-widest uppercase">Step {idx + 1}</span>
                          <h4 className="font-bold text-white text-sm line-clamp-1">{step.title}</h4>
                          <p className="text-[11px] text-gray-400 font-semibold flex items-center gap-1.5 pt-0.5">
                            {step.quiz ? (
                              <span className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-md text-[9px] font-extrabold flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" /> Interactive Quiz
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md text-[9px] font-extrabold">
                                Video Lecture
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                          <button
                            id={`launch-step-${step.id}`}
                            disabled={!isNextToWatch && !step.completed}
                            onClick={() => startLesson(step)}
                            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                              step.completed
                                ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                                : isNextToWatch
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white active:scale-95 shadow-md'
                                : 'bg-white/5 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            {step.completed ? 'Review Lesson' : 'Start Lesson'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-1">
                <AnimatePresence mode="wait">
                  {activeStepForQuiz && activeStepForQuiz.quiz ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-5 bg-gradient-to-b from-[#16123a] to-[#08061a] border border-[#31276a] rounded-2xl space-y-4 shadow-lg sticky top-4"
                    >
                      <div className="flex items-center gap-2 pb-3 border-b border-[#231b52]">
                        <HelpCircle className="w-5 h-5 text-purple-400 animate-bounce" style={{ animationDuration: '3s' }} />
                        <h4 className="font-extrabold text-sm text-white">Active Step Quiz</h4>
                      </div>

                      <p className="text-xs text-gray-300 font-bold text-left leading-relaxed">
                        {activeStepForQuiz.quiz.question}
                      </p>

                      <form onSubmit={handleQuizSubmit} className="space-y-2 text-left pt-2">
                        {activeStepForQuiz.quiz.options.map((option, oIdx) => (
                          <label
                            key={oIdx}
                            className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                              selectedOption === oIdx
                                ? 'bg-purple-600/20 border-purple-500 text-white font-semibold shadow-inner shadow-purple-950/40'
                                : 'bg-black/20 border-white/5 hover:bg-black/30 text-gray-400 hover:text-white'
                            }`}
                          >
                            <input
                              type="radio"
                              name="quiz-option"
                              checked={selectedOption === oIdx}
                              onChange={() => !quizSubmitted && setSelectedOption(oIdx)}
                              disabled={quizSubmitted}
                              className="hidden"
                            />
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                              selectedOption === oIdx ? 'border-purple-500' : 'border-gray-600'
                            }`}>
                              {selectedOption === oIdx && <div className="w-2.5 h-2.5 bg-purple-500 rounded-full" />}
                            </div>
                            <span className="leading-tight">{option}</span>
                          </label>
                        ))}

                        {!quizSubmitted ? (
                          <button
                            id="submit-quiz-btn"
                            type="submit"
                            disabled={selectedOption === null}
                            className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                          >
                            Submit Answer
                          </button>
                        ) : (
                          <div className="mt-4 space-y-3">
                            <div className={`p-3.5 rounded-xl flex items-center gap-2 text-xs font-bold ${
                              quizSuccess 
                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                                : 'bg-red-500/10 border border-red-500/20 text-red-400'
                            }`}>
                              {quizSuccess ? <Check className="w-4.5 h-4.5 shrink-0 text-emerald-400" /> : <X className="w-4.5 h-4.5 shrink-0 text-red-400" />}
                              <span>{quizSuccess ? 'Correct Answer!' : 'Incorrect. Try reviewing the lesson material.'}</span>
                            </div>

                            {quizSuccess && (
                              <div className="flex items-center gap-1 text-xs text-amber-400 font-extrabold bg-amber-400/5 p-2.5 rounded-lg border border-amber-400/10 justify-center">
                                <Star className="w-4 h-4 fill-current shrink-0 text-amber-400" />
                                <span>+{isPremium ? 100 : 50} XP Awarded!</span>
                              </div>
                            )}

                            <button
                              id="dismiss-quiz-btn"
                              type="button"
                              onClick={() => {
                                setActiveStepForQuiz(null);
                                setSelectedOption(null);
                                setQuizSubmitted(false);
                              }}
                              className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                            >
                              Close Quiz
                            </button>
                          </div>
                        )}
                      </form>
                    </motion.div>
                  ) : (
                    <div className="p-6 border border-[#231b52]/30 bg-[#0b081a]/40 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 shadow-md sticky top-4">
                      <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl">
                        <HelpCircle className="w-7 h-7 text-purple-400" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">Interactive Quiz Hub</h4>
                        <p className="text-[11px] text-gray-400 leading-normal">
                          Quizzes populate dynamically as you watch or finish courses. Reach milestones to earn verified certificates and boost your overall XP.
                        </p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 1: AI MENTOR DRAWER 🤖 */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isMentorOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-end z-50">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-[#0b081a] border-l border-purple-500/30 h-full flex flex-col justify-between p-5 text-left shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                    <Bot className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">AI Learning Mentor 🤖</h3>
                    <p className="text-[10px] text-purple-300 font-mono">Personalized Career Guide</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMentorOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-1 scrollbar-thin">
                {chatMessages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                        msg.sender === 'user' 
                          ? 'bg-purple-600 text-white rounded-br-none' 
                          : 'bg-[#161138] border border-purple-500/30 text-gray-200 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-gray-500 mt-1 font-mono">{msg.timestamp}</span>
                  </div>
                ))}

                {mentorLoading && (
                  <div className="flex items-center gap-2 p-3 bg-[#161138] rounded-2xl text-xs text-purple-300 animate-pulse w-fit">
                    <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
                    <span>AI Mentor answers...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="pt-2 border-t border-purple-500/20 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={mentorInput}
                    onChange={(e) => setMentorInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMentorMessage()}
                    placeholder="E.g., Men 6 oyda frontend developer bo'lishni xohlayman..."
                    className="flex-1 bg-[#151030] border border-purple-500/30 text-white px-3.5 py-2.5 rounded-xl text-xs placeholder:text-gray-500 outline-none focus:border-purple-400"
                  />
                  <button
                    onClick={handleSendMentorMessage}
                    disabled={mentorLoading}
                    className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 2: SKILL TREE MODAL 🌳 */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isSkillTreeOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b081a] border border-purple-500/40 p-6 rounded-2xl w-full max-w-2xl space-y-5 text-left shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-purple-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Your Skill Tree 🌳</h3>
                </div>
                <button 
                  onClick={() => setIsSkillTreeOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-gray-300">
                Visual breakdown of your current technical skills unlocked through course completions & quiz performance.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                {skills.map((skill) => (
                  <div 
                    key={skill.id}
                    className="p-3.5 bg-[#120d30] border border-white/5 rounded-xl space-y-2 hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">{skill.name}</span>
                      <span className="px-2 py-0.5 rounded text-[9.5px] font-extrabold bg-purple-950 text-purple-300 border border-purple-500/30">
                        {skill.level}
                      </span>
                    </div>

                    <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                        style={{ width: `${skill.percentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                      <span>{skill.category}</span>
                      <span className="font-bold text-white">{skill.percentage}% Mastery</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-purple-500/20 flex justify-end">
                <button
                  onClick={() => {
                    setIsSkillTreeOpen(false);
                    setIsQuizGeneratorOpen(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-xl active:scale-95"
                >
                  Test & Upgrade Skills &rarr;
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 3: CERTIFICATES MODAL 🏆 */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isCertificatesOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b081a] border border-fuchsia-500/40 p-6 rounded-2xl w-full max-w-3xl space-y-5 text-left shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-fuchsia-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-fuchsia-400" />
                  <h3 className="text-base font-bold text-white">Your Earned Certificates 🏆</h3>
                </div>
                <button 
                  onClick={() => setIsCertificatesOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div 
                    key={cert.id}
                    className="p-4 bg-[#140b26] border border-fuchsia-500/30 rounded-2xl space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono font-bold text-fuchsia-300 bg-fuchsia-950 px-2 py-0.5 rounded border border-fuchsia-500/30">
                          ID: {cert.verificationCode}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400">{cert.grade}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white leading-snug">{cert.courseTitle}</h4>
                      <p className="text-[10.5px] text-gray-400">Issued: {cert.issuedDate} by SoftCast Academy</p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {cert.skills.map((s) => (
                          <span key={s} className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-gray-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setPreviewCert(cert)}
                      className="w-full py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View & Download Certificate</span>
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PREVIEW CERTIFICATE OVERLAY */}
      <AnimatePresence>
        {previewCert && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#120926] border-2 border-fuchsia-500/60 p-8 rounded-3xl w-full max-w-xl text-center space-y-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setPreviewCert(null)}
                className="absolute top-4 right-4 p-1.5 bg-white/10 rounded-full text-gray-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-400/40 flex items-center justify-center text-fuchsia-300 mx-auto">
                  <Award className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-black text-white font-display tracking-wide">CERTIFICATE OF ACHIEVEMENT</h2>
                <p className="text-xs text-fuchsia-300 font-mono">SoftCast AI Learning Platform</p>
              </div>

              <div className="p-4 bg-[#090414] border border-fuchsia-500/20 rounded-2xl space-y-2 text-left">
                <p className="text-[11px] text-gray-400">This is to certify that</p>
                <h3 className="text-lg font-bold text-white">Aslbek Qoziboyev</h3>
                <p className="text-[11px] text-gray-300">has successfully completed all modules and examinations for:</p>
                <p className="text-sm font-extrabold text-fuchsia-300 leading-snug">{previewCert.courseTitle}</p>
                <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono pt-3 border-t border-white/10">
                  <span>Issued: {previewCert.issuedDate}</span>
                  <span>Code: {previewCert.verificationCode}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    showToast('Sertifikat PDF fayl sifatida yuklab olindi! 📄');
                  }}
                  className="flex-1 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-xs rounded-xl"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText?.(`https://softcast.ai/cert/${previewCert.verificationCode}`);
                    showToast('Sertifikat havolasi buferga nusxalandi! 🔗');
                  }}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl"
                >
                  LinkedIn-ga Ulash 🔗
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 4: AI CAREER ROADMAP BUILDER 🚀 */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isCareerRoadmapOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b081a] border border-purple-500/40 p-6 rounded-2xl w-full max-w-2xl space-y-5 text-left shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-purple-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">AI Career Roadmap Builder 🚀</h3>
                </div>
                <button 
                  onClick={() => setIsCareerRoadmapOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Your Target Career Goal:</label>
                  <input
                    type="text"
                    value={careerGoal}
                    onChange={(e) => setCareerGoal(e.target.value)}
                    placeholder="E.g., Senior Full Stack Web Developer in 6 months..."
                    className="w-full bg-[#130d30] border border-purple-500/30 text-white px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-purple-400"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300">Timeframe Goal:</span>
                  <div className="flex gap-2">
                    {[3, 6, 12].map(m => (
                      <button
                        key={m}
                        onClick={() => setTimeframeMonths(m)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          timeframeMonths === m ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400'
                        }`}
                      >
                        {m} Months
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateCareerRoadmap}
                  disabled={isGeneratingRoadmap}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {isGeneratingRoadmap ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-purple-200" />
                  )}
                  <span>{isGeneratingRoadmap ? 'Synthesizing Roadmap...' : 'Generate Roadmap with SoftCast AI'}</span>
                </button>

                {generatedRoadmap && (
                  <div className="p-4 bg-[#120c2e] border border-purple-500/30 rounded-2xl space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-white">{generatedRoadmap.title}</h4>
                      <p className="text-xs text-purple-300 mt-0.5">{generatedRoadmap.description}</p>
                    </div>

                    <div className="space-y-3">
                      {generatedRoadmap.steps.map((st: any, idx: number) => (
                        <div key={idx} className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1 text-xs">
                          <div className="flex justify-between items-center text-purple-400 font-bold">
                            <span>Step {idx + 1}: {st.title}</span>
                            <span className="text-[10px] bg-purple-950 px-2 py-0.5 rounded">{st.duration}</span>
                          </div>
                          <p className="text-gray-300">{st.description}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {st.skillsCovered?.map((sk: string) => (
                              <span key={sk} className="text-[9px] bg-purple-500/20 text-purple-200 px-1.5 py-0.2 rounded font-mono">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 5: AI QUIZ GENERATOR MODAL 📝 */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isQuizGeneratorOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b081a] border border-cyan-500/40 p-6 rounded-2xl w-full max-w-lg space-y-5 text-left shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-cyan-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">AI Skill Quiz Generator 📝</h3>
                </div>
                <button 
                  onClick={() => setIsQuizGeneratorOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Topic to test:</label>
                  <input
                    type="text"
                    value={quizTopicInput}
                    onChange={(e) => setQuizTopicInput(e.target.value)}
                    placeholder="E.g., React Hooks, Docker Networking, Python AsyncIO..."
                    className="w-full bg-[#100d2b] border border-cyan-500/30 text-white px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-300">Difficulty Level:</span>
                  <div className="flex gap-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setQuizLevelInput(lvl)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          quizLevelInput === lvl ? 'bg-cyan-600 text-white' : 'bg-white/5 text-gray-400'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateCustomQuiz}
                  disabled={isGeneratingQuiz || !quizTopicInput.trim()}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {isGeneratingQuiz ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
                  <span>{isGeneratingQuiz ? 'Generating Questions...' : 'Generate AI Quiz'}</span>
                </button>

                {customGeneratedQuiz && (
                  <div className="p-4 bg-[#0a1426] border border-cyan-500/30 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold text-cyan-300">Generated Questions:</h4>
                    {customGeneratedQuiz.map((q: any, qIdx: number) => (
                      <div key={qIdx} className="space-y-2 p-3 bg-black/40 rounded-xl text-xs">
                        <p className="font-bold text-white">{qIdx + 1}. {q.question}</p>
                        <div className="space-y-1">
                          {q.options?.map((opt: string, oIdx: number) => (
                            <div 
                              key={oIdx} 
                              className={`p-2 rounded text-[11px] ${
                                oIdx === q.correctIndex ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'bg-white/5 text-gray-300'
                              }`}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
