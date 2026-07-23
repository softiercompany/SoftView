import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Play, 
  CheckCircle2, 
  User, 
  Compass, 
  Trophy, 
  TrendingUp, 
  Target, 
  ChevronRight, 
  Star, 
  Gem, 
  Activity, 
  Cpu, 
  X, 
  Sliders, 
  Lightbulb,
  Award,
  Zap,
  Brain,
  Clock,
  HelpCircle,
  RefreshCw,
  FileText,
  Plus,
  Trash2,
  Bookmark,
  ThumbsUp,
  Share2,
  Check,
  BookOpen,
  Shield,
  Info,
  Calendar
} from 'lucide-react';
import { Video } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface AIChatPicksProps {
  videos?: Video[];
  onPlayVideo: (video: Video) => void;
  isPremium: boolean;
  onAddXp?: (amount: number) => void;
}

interface InterestItem {
  id: string;
  name: string;
  percentage: number;
  color: string;
  glow: string;
}

interface AILogItem {
  id: string;
  timestamp: string;
  activity: string;
  result: string;
  type: 'analyzed' | 'synthesized' | 'updated' | 'learning';
}

export default function AIChatPicks({ videos = [], onPlayVideo, isPremium, onAddXp }: AIChatPicksProps) {
  // --- TOAST NOTIFICATIONS ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const triggerXp = (amount: number) => {
    if (onAddXp) onAddXp(amount);
  };

  // --- STATE ---
  const [prompt, setPrompt] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'just_for_you' | 'mind_expanding' | 'hidden_gems' | 'trending_for_you' | 'because_watched' | 'new_picks'>('all');
  const [lastUpdatedTime, setLastUpdatedTime] = useState('5 minutes ago');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Modals state
  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [isAiLogOpen, setIsAiLogOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [explainingVideo, setExplainingVideo] = useState<(Video & { matchPercentage?: number; reason?: string }) | null>(null);
  const [summaryVideo, setSummaryVideo] = useState<Video | null>(null);

  // User interactions on videos
  const [savedVideoIds, setSavedVideoIds] = useState<string[]>([]);
  const [likedVideoIds, setLikedVideoIds] = useState<string[]>([]);

  // Interests state
  const [interests, setInterests] = useState<InterestItem[]>([
    { id: '1', name: 'Artificial Intelligence', percentage: 92, color: 'bg-purple-500', glow: 'shadow-purple-500/25' },
    { id: '2', name: 'Programming', percentage: 85, color: 'bg-indigo-500', glow: 'shadow-indigo-500/25' },
    { id: '3', name: 'Technology', percentage: 78, color: 'bg-cyan-500', glow: 'shadow-cyan-500/25' },
    { id: '4', name: 'Space', percentage: 62, color: 'bg-pink-500', glow: 'shadow-pink-500/25' },
    { id: '5', name: 'Business', percentage: 48, color: 'bg-purple-700', glow: 'shadow-purple-700/25' }
  ]);
  const [newInterestInput, setNewInterestInput] = useState('');

  // AI Activity Logs
  const [aiLogs, setAiLogs] = useState<AILogItem[]>([
    { id: 'l1', timestamp: '5 min ago', activity: 'Vector Similarity Mesh Updated', result: 'Mapped 245 video nodes to user interest matrix', type: 'analyzed' },
    { id: 'l2', timestamp: '12 min ago', activity: 'Mind Expanding Signal Generated', result: 'Recommended Cybersecurity & Math concepts based on Python history', type: 'learning' },
    { id: 'l3', timestamp: '1 hour ago', activity: 'Hidden Gem Discovery', result: 'Uncovered high retention low-view creator video (98.4% rating)', type: 'synthesized' },
    { id: 'l4', timestamp: '3 hours ago', activity: 'Watch History Analysis', result: 'Processed 15 AI videos & 3 Neural Network masterclasses', type: 'updated' }
  ]);

  // Dynamic Custom Channel / Surprise picks
  const [customPicks, setCustomPicks] = useState<Video[]>([]);

  // Stepper effect for AI generation
  useEffect(() => {
    let timer: any;
    if (isLoading) {
      timer = setInterval(() => {
        setLoadingStep((prev) => (prev < 3 ? prev + 1 : 0));
      }, 900);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  // Refresh AI Picks
  const handleRefreshFeed = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdatedTime('Just now');
      triggerXp(20);
      showToast('AI tavsiyalar yangilandi! 🔄 (+20 XP)');
      setAiLogs(prev => [
        {
          id: `l-${Date.now()}`,
          timestamp: 'Just now',
          activity: 'Manual Feed Refresh',
          result: 'Re-weighted vector vectors for 120 new video candidates',
          type: 'updated'
        },
        ...prev
      ]);
    }, 1200);
  };

  // Surprise Me Action
  const handleSurpriseMe = async () => {
    setIsLoading(true);
    const surprisePrompts = [
      "Quantum computing visual physics and qubit superposition",
      "Neuromorphic silicon architecture & brain simulation models",
      "Autonomous AI agent swarms executing real-time software builds",
      "Deep sea exploration with robotic submersibles"
    ];
    const chosen = surprisePrompts[Math.floor(Math.random() * surprisePrompts.length)];

    try {
      const response = await fetch('/api/ai-picks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: chosen, mood: 'Curious' })
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        const formatted: Video[] = resData.data.map((item: any, idx: number) => ({
          id: `ai-surprise-${Date.now()}-${idx}`,
          title: item.title,
          description: item.description + " [AI Synthesized Script]: " + (item.videoScript?.join(' ') || ''),
          category: 'ai-picks',
          coverUrl: `https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80`,
          duration: item.duration || "14:20",
          views: "AI Picked Just Now",
          uploadDate: "Just now",
          creator: item.creator || "SoftCast AI",
          creatorVerified: true,
          matchPercentage: 99,
          videoUrl: 'https://www.youtube.com/embed/Dp3S2S-qTsw',
          comments: []
        }));
        setCustomPicks(formatted);

        // Slightly bump interest score
        setInterests(prev => prev.map(item => ({
          ...item,
          percentage: Math.min(100, item.percentage + Math.floor(Math.random() * 4) + 1)
        })));

        triggerXp(30);
        showToast('✨ AI Surprise Me kanali tayyorlandi! (+30 XP)');
      }
    } catch (err) {
      console.error(err);
      showToast('Surprise Me javobi tayyorlandi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Custom Prompt Synthesis
  const handleCustomSynthesis = async () => {
    setIsLoading(true);
    setIsEditingInterests(false);
    try {
      const response = await fetch('/api/ai-picks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt || "Advanced programming & neural networks", mood: 'Curious' })
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        const formatted: Video[] = resData.data.map((item: any, idx: number) => ({
          id: `ai-custom-${Date.now()}-${idx}`,
          title: item.title,
          description: item.description,
          category: 'ai-picks',
          coverUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80`,
          duration: item.duration || "18:45",
          views: "AI Synthesized",
          uploadDate: "Just now",
          creator: item.creator || "SoftCast AI",
          creatorVerified: true,
          matchPercentage: 100,
          videoUrl: 'https://www.youtube.com/embed/Dp3S2S-qTsw',
          comments: []
        }));
        setCustomPicks(formatted);
        triggerXp(40);
        showToast('Sozlamalar va Prompt bo\'yicha shaxsiy video qatlam yaratildi! (+40 XP)');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add custom interest
  const handleAddInterest = () => {
    if (!newInterestInput.trim()) return;
    const colors = ['bg-purple-500', 'bg-indigo-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-amber-500', 'bg-pink-500'];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];
    const newItem: InterestItem = {
      id: Date.now().toString(),
      name: newInterestInput.trim(),
      percentage: 75,
      color: chosenColor,
      glow: `${chosenColor}/25`
    };
    setInterests(prev => [...prev, newItem]);
    setNewInterestInput('');
    showToast(`Yangi qiziqish qo'shildi: "${newItem.name}" 💡`);
  };

  // Remove interest
  const handleRemoveInterest = (id: string) => {
    setInterests(prev => prev.filter(item => item.id !== id));
    showToast('Qiziqish olib tashlandi.');
  };

  // Toggle Save / Like
  const toggleSave = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (savedVideoIds.includes(id)) {
      setSavedVideoIds(prev => prev.filter(i => i !== id));
      showToast('Video saqlanganlardan olib tashlandi.');
    } else {
      setSavedVideoIds(prev => [...prev, id]);
      triggerXp(10);
      showToast('Video saqlandi! 🔖 (+10 XP)');
    }
  };

  const toggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (likedVideoIds.includes(id)) {
      setLikedVideoIds(prev => prev.filter(i => i !== id));
      showToast('Like olib tashlandi.');
    } else {
      setLikedVideoIds(prev => [...prev, id]);
      triggerXp(15);
      showToast('Sizga yoqdi! ❤️ (+15 XP)');
    }
  };

  const handleShare = (video: Video, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard?.writeText?.(`${window.location.origin}/video/${video.id}`);
    showToast(`"${video.title.slice(0, 25)}..." havolasi nusxalandi! 🔗`);
  };

  // MASTER DATA COLLECTIONS
  const justForYouVideos: (Video & { matchPercentage: number; reason: string })[] = [
    {
      id: 'ai-jfy-1',
      title: 'AI Agents Explained: Multi-Agent Loops',
      description: 'Understanding autonomous task execution, memory trees, and context routing in agentic systems.',
      category: 'ai-picks',
      coverUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80',
      duration: '24:31',
      views: '1.2M views',
      uploadDate: '3 days ago',
      creator: 'TechFlow',
      creatorVerified: true,
      matchPercentage: 99,
      videoUrl: 'https://www.youtube.com/embed/Dp3S2S-qTsw',
      reason: 'Because you watched 15 AI videos this week & liked 3 agent tutorials.'
    },
    {
      id: 'ai-jfy-2',
      title: 'Building Full Stack Apps in 2026',
      description: 'Masterclass on React 18, Vite, server-side APIs, and real-time state synchronization.',
      category: 'ai-picks',
      coverUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      duration: '19:45',
      views: '852K views',
      uploadDate: '5 days ago',
      creator: 'CodeLab',
      creatorVerified: true,
      matchPercentage: 97,
      videoUrl: 'https://www.youtube.com/embed/QuZ_7_2bOgw',
      reason: 'Directly aligns with your Programming (85%) interest score.'
    },
    {
      id: 'ai-jfy-3',
      title: 'Linux Security & Kernel Internals',
      description: 'System calls, process isolation, cgroups, and memory protection in modern Linux kernels.',
      category: 'ai-picks',
      coverUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80',
      duration: '26:11',
      views: '612K views',
      uploadDate: '1 week ago',
      creator: 'CodeLab',
      creatorVerified: true,
      matchPercentage: 95,
      videoUrl: 'https://www.youtube.com/embed/QuZ_7_2bOgw',
      reason: 'You searched for "Linux Security" 2 days ago.'
    },
    {
      id: 'ai-jfy-4',
      title: 'Prompt Engineering Masterclass',
      description: 'System prompts, zero-shot, few-shot, and structured JSON output techniques.',
      category: 'ai-picks',
      coverUrl: 'https://images.unsplash.com/photo-1675557009875-436f09780264?w=600&auto=format&fit=crop&q=80',
      duration: '18:22',
      views: '920K views',
      uploadDate: '2 days ago',
      creator: 'MindLab',
      creatorVerified: true,
      matchPercentage: 98,
      videoUrl: 'https://www.youtube.com/embed/5g19-0r_TJI',
      reason: 'High retention score among users with similar AI research profiles.'
    }
  ];

  const mindExpandingVideos: (Video & { matchPercentage: number; reason: string })[] = [
    {
      id: 'ai-mind-1',
      title: 'Quantum Physics: Superposition Visually Explained',
      description: 'Visualizing qubit entanglement, wave function collapse, and quantum supremacy algorithms.',
      category: 'ai-picks',
      coverUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      duration: '22:15',
      views: '430K views',
      uploadDate: '4 days ago',
      creator: 'Physics Hub',
      creatorVerified: true,
      matchPercentage: 94,
      videoUrl: 'https://www.youtube.com/embed/5g19-0r_TJI',
      reason: 'Mind Expanding AI expansion: Programming → Mathematics → Quantum Computing.'
    },
    {
      id: 'ai-mind-2',
      title: 'Neuromorphic Chips: Brains Made of Silicon',
      description: 'How memristors and spiking neural networks mimic biological synapses.',
      category: 'ai-picks',
      coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      duration: '20:08',
      views: '310K views',
      uploadDate: '6 days ago',
      creator: 'TechFlow',
      creatorVerified: true,
      matchPercentage: 92,
      videoUrl: 'https://www.youtube.com/embed/Dp3S2S-qTsw',
      reason: 'Expands your AI Software interest into AI Hardware Architecture.'
    },
    {
      id: 'ai-mind-3',
      title: 'Cybersecurity: Zero Trust Architecture',
      description: 'Identity verification, micro-segmentation, and cryptographically signed tokens.',
      category: 'ai-picks',
      coverUrl: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=600&auto=format&fit=crop&q=80',
      duration: '17:40',
      views: '512K views',
      uploadDate: '1 week ago',
      creator: 'CodeLab',
      creatorVerified: true,
      matchPercentage: 91,
      videoUrl: 'https://www.youtube.com/embed/QuZ_7_2bOgw',
      reason: 'Cross-topic recommendation connecting Web Dev with Network Defense.'
    },
    {
      id: 'ai-mind-4',
      title: 'The Math Behind Deep Neural Networks',
      description: 'Gradient descent, backpropagation loss functions, and matrix multiplication tensor spaces.',
      category: 'ai-picks',
      coverUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80',
      duration: '25:10',
      views: '780K views',
      uploadDate: '3 days ago',
      creator: 'MindLab',
      creatorVerified: true,
      matchPercentage: 96,
      videoUrl: 'https://www.youtube.com/embed/mK9kK2r_M9g',
      reason: 'Deepens technical foundation for your AI research.'
    }
  ];

  const hiddenGemsVideos: (Video & { matchPercentage: number; reason: string; qualityScore: string })[] = [
    {
      id: 'ai-gem-1',
      title: 'Low Latency WebAssembly in Rust: Deep Dive',
      description: 'Writing custom memory allocators and SIMD vectorization in Rust for 60fps web canvas graphics.',
      category: 'ai-picks',
      coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      duration: '28:40',
      views: '18K views',
      uploadDate: '2 days ago',
      creator: 'DevCore Lab',
      creatorVerified: false,
      matchPercentage: 96,
      qualityScore: '99.2% Retention',
      videoUrl: 'https://www.youtube.com/embed/QuZ_7_2bOgw',
      reason: 'Hidden Gem: High completion rate (99.2%) & exceptional engineering depth.'
    },
    {
      id: 'ai-gem-2',
      title: 'Building a Micro-OS in 500 Lines of C',
      description: 'Bootloader, interrupt vectors, and context switching written from absolute scratch.',
      category: 'ai-picks',
      coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
      duration: '31:15',
      views: '24K views',
      uploadDate: '4 days ago',
      creator: 'SystemsCraft',
      creatorVerified: false,
      matchPercentage: 95,
      qualityScore: '98.8% Retention',
      videoUrl: 'https://www.youtube.com/embed/QuZ_7_2bOgw',
      reason: 'Hidden Gem: Underrated creator with pristine code walkthroughs.'
    },
    {
      id: 'ai-gem-3',
      title: 'Aesthetic Workspace Cable Management & Custom Keyboards',
      description: 'Under-desk routing, custom braided coil cables, and hand-lubed switch acoustics.',
      category: 'ai-picks',
      coverUrl: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80',
      duration: '14:20',
      views: '32K views',
      uploadDate: '5 days ago',
      creator: 'DeskLab',
      creatorVerified: true,
      matchPercentage: 93,
      qualityScore: '98.4% Retention',
      videoUrl: 'https://www.youtube.com/embed/z6L8p6y1Y9E',
      reason: 'Hidden Gem: 98% positive feedback in minimalist tech community.'
    },
    {
      id: 'ai-gem-4',
      title: 'Orbital Mechanics & Satellite Thruster Physics',
      description: 'Hohmann transfer orbits, delta-v calculations, and ion electric propulsion.',
      category: 'ai-picks',
      coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
      duration: '21:05',
      views: '41K views',
      uploadDate: '1 week ago',
      creator: 'Space Dynamics',
      creatorVerified: false,
      matchPercentage: 94,
      qualityScore: '99.0% Retention',
      videoUrl: 'https://www.youtube.com/embed/Dp3S2S-qTsw',
      reason: 'Hidden Gem: Highly rated space dynamics lecture.'
    }
  ];

  const trendingForYouVideos: (Video & { matchPercentage: number; reason: string; trendScore: number })[] = [
    {
      id: 'ai-trend-1',
      title: 'OpenAI Latest Models & Agent Benchmark',
      description: 'Evaluating multimodal reasoning, tool usage, and coding benchmark performance.',
      category: 'ai-picks',
      coverUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
      duration: '16:50',
      views: '1.8M views',
      uploadDate: '1 day ago',
      creator: 'AI Revolution',
      creatorVerified: true,
      matchPercentage: 98,
      trendScore: 9950,
      videoUrl: 'https://www.youtube.com/embed/5g19-0r_TJI',
      reason: '#1 Trending topic in your custom AI & Technology interest sphere.'
    },
    {
      id: 'ai-trend-2',
      title: 'React 19 & Compiler Revolution',
      description: 'Automatic memoization, Server Actions, and optimistic state updates.',
      category: 'ai-picks',
      coverUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
      duration: '20:12',
      views: '1.4M views',
      uploadDate: '2 days ago',
      creator: 'CodeLab',
      creatorVerified: true,
      matchPercentage: 97,
      trendScore: 9820,
      videoUrl: 'https://www.youtube.com/embed/QuZ_7_2bOgw',
      reason: 'Trending #1 among frontend developers this week.'
    },
    {
      id: 'ai-trend-3',
      title: 'Starship Orbital Launch Test Analysis',
      description: 'Hot staging sequence, heat shield tiles, and ring landing capture dynamics.',
      category: 'ai-picks',
      coverUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=600&auto=format&fit=crop&q=80',
      duration: '27:40',
      views: '2.5M views',
      uploadDate: '1 day ago',
      creator: 'Space Zone',
      creatorVerified: true,
      matchPercentage: 96,
      trendScore: 9910,
      videoUrl: 'https://www.youtube.com/embed/Dp3S2S-qTsw',
      reason: 'Trending #1 in Space & Aerospace Engineering.'
    },
    {
      id: 'ai-trend-4',
      title: 'Autonomous Robotics & Humanoid Demos',
      description: 'Reinforcement learning for balance, tactile sensor gloves, and neural vision.',
      category: 'ai-picks',
      coverUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
      duration: '18:30',
      views: '1.1M views',
      uploadDate: '3 days ago',
      creator: 'Future Tech',
      creatorVerified: true,
      matchPercentage: 95,
      trendScore: 9750,
      videoUrl: 'https://www.youtube.com/embed/z6L8p6y1Y9E',
      reason: 'Trending in Robotics & Hardware Automation.'
    }
  ];

  // Action cards configuration
  const topActionCards = [
    {
      key: 'just_for_you',
      title: 'Just For You 🧠',
      desc: '100% personalized AI recommendations',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      bgColor: 'from-[#1b104c] via-[#0e0a29] to-[#05040d]',
      iconType: 'user'
    },
    {
      key: 'mind_expanding',
      title: 'Mind Expanding 🧠',
      desc: 'Broaden your knowledge horizon',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      bgColor: 'from-[#0e173f] via-[#080b24] to-[#05040d]',
      iconType: 'brain'
    },
    {
      key: 'hidden_gems',
      title: 'Hidden Gems 💎',
      desc: 'High retention underrated content',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgColor: 'from-[#0a2327] via-[#051114] to-[#05040d]',
      iconType: 'gem'
    },
    {
      key: 'trending_for_you',
      title: 'Trending for You 🔥',
      desc: "What's hot in your personal sphere",
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      bgColor: 'from-[#2a131b] via-[#14080e] to-[#05040d]',
      iconType: 'trending'
    }
  ];

  return (
    <div id="ai-picks-root" className="flex flex-col lg:flex-row w-full h-[calc(100vh-4rem)] bg-[#050410] overflow-hidden text-left select-none relative font-sans">
      
      {/* GLOBAL TOAST NOTIFICATION OVERLAY */}
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

      {/* LEFT COLUMN: Main Scrollable Video Content */}
      <div id="ai-picks-main-feed" className="flex-1 h-full overflow-y-auto px-6 py-6 pb-28 space-y-7 scrollbar-none">
        
        {/* HEADER BLOCK */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1b1544]/40 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black tracking-tight text-white font-display">AI Picks</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-950/80 border border-purple-500/40 text-purple-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                SoftCast AI Engine Active
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Handpicked for you by SoftCast AI, based on your interests and watch history.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Last Updated badge & Refresh button */}
            <div className="flex items-center gap-2 bg-[#0d0926] border border-[#231b52]/60 px-3 py-1.5 rounded-xl text-xs">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-gray-400 text-[11px]">Last updated: <strong className="text-white font-mono">{lastUpdatedTime}</strong></span>
              <button 
                onClick={handleRefreshFeed}
                disabled={isRefreshing}
                className="p-1 hover:bg-purple-500/20 text-purple-300 rounded-lg transition-all active:scale-95 ml-1"
                title="Refresh AI Recommendations"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} />
              </button>
            </div>

            {/* How It Works Button */}
            <button
              onClick={() => setIsHowItWorksOpen(true)}
              className="p-2 bg-[#120d30] hover:bg-purple-950/50 border border-[#261d56]/60 text-gray-300 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Info className="w-4 h-4 text-purple-400" />
              <span>How It Works</span>
            </button>
          </div>
        </div>

        {/* LOADING STEPPER OVERLAY */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#110e28]/60 border border-purple-500/30 p-5 rounded-2xl flex flex-col md:flex-row items-center gap-5 justify-between shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Synthesizing Neural Channel...</h4>
                  <p className="text-[11px] font-mono text-purple-300 animate-pulse mt-0.5">
                    {loadingStep === 0 && 'Mapping user interest vectors & history matrices...'}
                    {loadingStep === 1 && 'Filtering quality scores & retention indicators...'}
                    {loadingStep === 2 && 'Synthesizing customized Gemini recommendations...'}
                    {loadingStep === 3 && 'Finalizing match scores and stream layout...'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-purple-950/60 border border-purple-500/30 px-3 py-1 rounded-lg text-purple-200">
                Resonance Sync: 99.8%
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ROW OF 4 TOP CURATOR CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {topActionCards.map((card) => {
            const isSelected = activeFilterTab === card.key;
            return (
              <div
                key={card.key}
                onClick={() => {
                  if (isSelected) setActiveFilterTab('all');
                  else {
                    setActiveFilterTab(card.key as any);
                    showToast(`"${card.title}" filtri va algoritmi faollashtirildi! 🎯`);
                  }
                }}
                className={`relative overflow-hidden p-4 rounded-xl bg-gradient-to-br ${card.bgColor} border ${card.borderColor} transition-all cursor-pointer group h-32 flex flex-col justify-between shadow-lg ${
                  isSelected ? 'ring-2 ring-purple-400 border-purple-400 scale-[1.02]' : 'hover:border-purple-400/50 hover:shadow-purple-950/30'
                }`}
              >
                <div className="space-y-1 z-10">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-white/5 rounded-xl border border-white/10 inline-flex">
                      {card.iconType === 'user' && <User className={`w-4 h-4 ${card.iconColor}`} />}
                      {card.iconType === 'brain' && <Brain className={`w-4 h-4 ${card.iconColor}`} />}
                      {card.iconType === 'gem' && <Gem className={`w-4 h-4 ${card.iconColor}`} />}
                      {card.iconType === 'trending' && <Flame className={`w-4 h-4 ${card.iconColor}`} />}
                    </div>
                    {isSelected && (
                      <span className="text-[9px] font-extrabold uppercase bg-purple-600 text-white px-2 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="pt-1">
                    <h3 className="text-xs font-bold text-white tracking-wide">{card.title}</h3>
                    <p className="text-[10.5px] text-gray-400 mt-0.5 leading-snug">{card.desc}</p>
                  </div>
                </div>

                <div className="z-10 flex justify-end">
                  <button className="p-1.5 bg-white/5 group-hover:bg-purple-600 group-hover:text-white text-gray-300 rounded-full transition-all">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* DYNAMIC CATEGORY FILTER CHIPS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'All AI Picks' },
            { id: 'just_for_you', label: 'Just For You 🧠' },
            { id: 'mind_expanding', label: 'Mind Expanding 🧠' },
            { id: 'hidden_gems', label: 'Hidden Gems 💎' },
            { id: 'trending_for_you', label: 'Trending For You 🔥' },
            { id: 'because_watched', label: 'Because You Watched' },
            { id: 'new_picks', label: 'New AI Recommendations' }
          ].map(chip => (
            <button
              key={chip.id}
              onClick={() => setActiveFilterTab(chip.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeFilterTab === chip.id
                  ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-950/40'
                  : 'bg-[#120d30] text-gray-400 hover:text-white border-white/5 hover:border-purple-500/30'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* DYNAMIC: SYNTHESIZED CUSTOM PICKS CHANNEL (IF CREATED) */}
        {customPicks.length > 0 && (
          <div className="space-y-4 pt-1">
            <div className="flex justify-between items-end border-b border-purple-500/30 pb-2">
              <div>
                <h2 className="text-sm font-black text-white tracking-tight font-display flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                  Your AI Synthesized Stream
                </h2>
                <p className="text-[11px] text-purple-300 mt-0.5">Custom video recommendations created by your prompt directives.</p>
              </div>
              <button 
                onClick={() => setCustomPicks([])}
                className="text-[10px] text-gray-400 hover:text-rose-400 font-bold transition-all border border-white/5 hover:border-rose-500/30 px-2.5 py-1 rounded-lg bg-white/5"
              >
                Clear Stream
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {customPicks.map((video) => (
                <VideoCardItem
                  key={video.id}
                  video={{
                    ...video,
                    matchPercentage: 99,
                    reason: 'Synthesized directly from your prompt and interest profile.'
                  }}
                  onPlayVideo={onPlayVideo}
                  savedVideoIds={savedVideoIds}
                  likedVideoIds={likedVideoIds}
                  toggleSave={toggleSave}
                  toggleLike={toggleLike}
                  onExplain={(v) => setExplainingVideo(v)}
                  onSummary={(v) => setSummaryVideo(v)}
                  onShare={handleShare}
                />
              ))}
            </div>
          </div>
        )}

        {/* SECTION 1: JUST FOR YOU 🧠 */}
        {(activeFilterTab === 'all' || activeFilterTab === 'just_for_you') && (
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-[#1b1544]/30 pb-2">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span>Just For You 🧠</span>
                </h2>
                <p className="text-[11px] text-gray-400">100% personalized recommendations based on watch history, likes & search history.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {justForYouVideos.map((video) => (
                <VideoCardItem
                  key={video.id}
                  video={video}
                  onPlayVideo={onPlayVideo}
                  savedVideoIds={savedVideoIds}
                  likedVideoIds={likedVideoIds}
                  toggleSave={toggleSave}
                  toggleLike={toggleLike}
                  onExplain={(v) => setExplainingVideo(v)}
                  onSummary={(v) => setSummaryVideo(v)}
                  onShare={handleShare}
                />
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: MIND EXPANDING 🧠 */}
        {(activeFilterTab === 'all' || activeFilterTab === 'mind_expanding') && (
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-[#1b1544]/30 pb-2">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-400" />
                  <span>Mind Expanding 🧠</span>
                </h2>
                <p className="text-[11px] text-gray-400">Broadening your horizon with new adjacent concepts and advanced studies.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {mindExpandingVideos.map((video) => (
                <VideoCardItem
                  key={video.id}
                  video={video}
                  onPlayVideo={onPlayVideo}
                  savedVideoIds={savedVideoIds}
                  likedVideoIds={likedVideoIds}
                  toggleSave={toggleSave}
                  toggleLike={toggleLike}
                  onExplain={(v) => setExplainingVideo(v)}
                  onSummary={(v) => setSummaryVideo(v)}
                  onShare={handleShare}
                />
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: HIDDEN GEMS 💎 */}
        {(activeFilterTab === 'all' || activeFilterTab === 'hidden_gems') && (
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-[#1b1544]/30 pb-2">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Gem className="w-4 h-4 text-emerald-400" />
                  <span>Hidden Gems 💎</span>
                </h2>
                <p className="text-[11px] text-gray-400">Underrated high-quality creators with exceptionally high viewer retention.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {hiddenGemsVideos.map((video) => (
                <VideoCardItem
                  key={video.id}
                  video={video}
                  onPlayVideo={onPlayVideo}
                  savedVideoIds={savedVideoIds}
                  likedVideoIds={likedVideoIds}
                  toggleSave={toggleSave}
                  toggleLike={toggleLike}
                  onExplain={(v) => setExplainingVideo(v)}
                  onSummary={(v) => setSummaryVideo(v)}
                  onShare={handleShare}
                  extraBadge={video.qualityScore}
                />
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: TRENDING FOR YOU 🔥 */}
        {(activeFilterTab === 'all' || activeFilterTab === 'trending_for_you') && (
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-[#1b1544]/30 pb-2">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                  <span>Trending for You 🔥</span>
                </h2>
                <p className="text-[11px] text-gray-400">"Sening dunyongdagi trend" — Hot trends filtered through your interest lens.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {trendingForYouVideos.map((video) => (
                <VideoCardItem
                  key={video.id}
                  video={video}
                  onPlayVideo={onPlayVideo}
                  savedVideoIds={savedVideoIds}
                  likedVideoIds={likedVideoIds}
                  toggleSave={toggleSave}
                  toggleLike={toggleLike}
                  onExplain={(v) => setExplainingVideo(v)}
                  onSummary={(v) => setSummaryVideo(v)}
                  onShare={handleShare}
                />
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: BECAUSE YOU WATCHED */}
        {(activeFilterTab === 'all' || activeFilterTab === 'because_watched') && (
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-[#1b1544]/30 pb-2">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-indigo-400" />
                  <span>Because You Watched: "Introduction to Neural Networks"</span>
                </h2>
                <p className="text-[11px] text-gray-400">Recommendations derived from your latest completed watch sessions.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {justForYouVideos.slice(0, 4).map((video) => (
                <VideoCardItem
                  key={`bw-${video.id}`}
                  video={{
                    ...video,
                    reason: 'Because you completed 100% of "Introduction to Neural Networks".'
                  }}
                  onPlayVideo={onPlayVideo}
                  savedVideoIds={savedVideoIds}
                  likedVideoIds={likedVideoIds}
                  toggleSave={toggleSave}
                  toggleLike={toggleLike}
                  onExplain={(v) => setExplainingVideo(v)}
                  onSummary={(v) => setSummaryVideo(v)}
                  onShare={handleShare}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* RIGHT SIDEBAR / CONTROL CENTER */}
      <div id="ai-picks-sidebar" className="w-full lg:w-[320px] xl:w-[360px] border-l border-[#1f1654]/20 h-full overflow-y-auto bg-[#070514]/90 p-5 space-y-5 shrink-0 scrollbar-none pb-28">
        
        {/* WIDGET 1: AI INSIGHT & SURPRISE ME */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#120f31] via-[#09071a] to-[#04030d] border border-purple-950/40 relative overflow-hidden flex flex-col justify-between shadow-lg">
          <div className="space-y-3 relative z-10 text-left">
            <div className="flex items-center gap-2">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <div className="absolute inset-0 bg-purple-500/35 rounded-full blur-sm animate-pulse" />
                <div className="w-5 h-5 rounded-full border border-purple-400/80 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                </div>
              </div>
              <h3 className="text-xs font-black text-white tracking-wider uppercase">AI Insight Panel</h3>
            </div>
            <p className="text-[11.5px] text-gray-300 leading-relaxed font-sans">
              "You watch a lot of AI and Tech content. Want to explore something new?"
            </p>
          </div>

          <div className="mt-4 relative z-10">
            <button
              onClick={handleSurpriseMe}
              disabled={isLoading}
              className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/40 text-white text-[11px] font-extrabold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200 fill-purple-200/20 animate-spin-slow" />
              <span>✨ Surprise Me (+30 XP)</span>
            </button>
          </div>
        </div>

        {/* WIDGET 2: YOUR INTERESTS PANEL */}
        <div className="p-4 rounded-xl bg-[#0a081a]/60 border border-[#231b52]/20 text-left">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>Your Interests Graph</span>
            </h3>
            <button 
              onClick={() => setIsEditingInterests(true)}
              className="text-[10px] font-bold text-purple-300 hover:text-white transition-colors border border-purple-500/30 px-2 py-0.5 rounded-lg bg-purple-950/40 active:scale-95"
            >
              Tune / Add
            </button>
          </div>

          <div className="space-y-3">
            {interests.map((interest) => (
              <div key={interest.id} className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-gray-300">
                  <span>{interest.name}</span>
                  <span className="font-mono text-purple-300 font-bold">{interest.percentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${interest.percentage}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`h-full ${interest.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WIDGET 3: AI ACTIVITY LOG & METRICS */}
        <div className="p-4 rounded-xl bg-[#0a081a]/60 border border-[#231b52]/20 text-left space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Activity Panel</span>
            </h3>
            <button 
              onClick={() => setIsAiLogOpen(true)}
              className="text-[10px] font-bold text-gray-400 hover:text-purple-300 underline"
            >
              View Log
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#120d30] p-2.5 rounded-xl border border-white/5 space-y-0.5">
              <span className="text-[10px] text-gray-400 font-semibold block">Analyzed</span>
              <span className="text-xs font-black text-white font-mono">245 videos</span>
            </div>
            <div className="bg-[#120d30] p-2.5 rounded-xl border border-white/5 space-y-0.5">
              <span className="text-[10px] text-gray-400 font-semibold block">Recommendations</span>
              <span className="text-xs font-black text-emerald-400 font-mono">Updated today</span>
            </div>
            <div className="bg-[#120d30] p-2.5 rounded-xl border border-white/5 space-y-0.5">
              <span className="text-[10px] text-gray-400 font-semibold block">Learning Engine</span>
              <span className="text-xs font-black text-purple-300 font-mono">Every day</span>
            </div>
            <div className="bg-[#120d30] p-2.5 rounded-xl border border-white/5 space-y-0.5">
              <span className="text-[10px] text-gray-400 font-semibold block">Accuracy</span>
              <span className="text-xs font-black text-cyan-300 font-mono">96% Match</span>
            </div>
          </div>
        </div>

        {/* WIDGET 4: AI PERSONAL MENTOR & WATCH PLANNER (PREMIUM) */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#180e3d] to-[#0a071f] border border-purple-500/30 text-left space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-black text-white uppercase tracking-wider">AI Personal Mentor</h3>
            {isPremium && <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-mono font-bold ml-auto">PRO</span>}
          </div>

          <div className="space-y-2 text-[11px] text-gray-300">
            <div className="p-2.5 bg-purple-950/40 rounded-xl border border-purple-500/20">
              <p className="font-bold text-purple-200">Suggested Next Skill:</p>
              <p className="text-[10.5px] text-gray-300 mt-0.5">You should learn React Server Components & Agentic Loops next.</p>
            </div>

            <div className="p-2.5 bg-indigo-950/40 rounded-xl border border-indigo-500/20">
              <p className="font-bold text-indigo-200 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-indigo-400" /> AI Watch Planner:
              </p>
              <p className="text-[10.5px] text-gray-300 mt-0.5">Your free time: <strong>20:00 - 22:00</strong> → Suggested: 2 programming deep-dives scheduled.</p>
            </div>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* MODAL 1: EDIT INTERESTS & PROMPT DIRECTIVES */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isEditingInterests && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0e0a24] border border-purple-500/40 p-6 rounded-2xl w-full max-w-lg space-y-5 text-left shadow-2xl shadow-purple-950/50"
            >
              <div className="flex justify-between items-center border-b border-purple-500/25 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">Your Interests Panel</h3>
                </div>
                <button
                  onClick={() => setIsEditingInterests(false)}
                  className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Textarea Custom Prompt Directives */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-semibold flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-purple-400" />
                  Custom Prompt Directives
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. quantum physics visual simulations, React Native architecture, low-fi developer vlogs..."
                  className="w-full h-20 bg-[#060412] border border-purple-500/25 focus:border-purple-400 text-white text-xs p-3 rounded-xl outline-none placeholder-gray-500 resize-none transition-all font-sans"
                />
              </div>

              {/* Add New Interest Input */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-semibold">Qiziqish qo'shish (Add Topic):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInterestInput}
                    onChange={(e) => setNewInterestInput(e.target.value)}
                    placeholder="e.g. Cybersecurity, Neuroscience..."
                    className="flex-1 bg-[#060412] border border-purple-500/20 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-purple-400"
                  />
                  <button
                    onClick={handleAddInterest}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Qo'shish
                  </button>
                </div>
              </div>

              {/* Slider Adjustment Blocks */}
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1 scrollbar-none">
                <h4 className="text-xs font-semibold text-gray-400">Qiziqishlar nisbatini o'zgartirish (Tune Weights):</h4>
                <div className="space-y-3">
                  {interests.map((interest) => (
                    <div key={interest.id} className="space-y-1 bg-[#120d30] p-2.5 rounded-xl border border-white/5">
                      <div className="flex justify-between items-center text-xs text-gray-300">
                        <span className="font-bold">{interest.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-purple-400 font-bold">{interest.percentage}%</span>
                          <button
                            onClick={() => handleRemoveInterest(interest.id)}
                            className="text-gray-500 hover:text-rose-400 transition-colors p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={interest.percentage}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setInterests(prev => prev.map(item => item.id === interest.id ? { ...item, percentage: val } : item));
                        }}
                        className="w-full accent-purple-500 h-1 bg-black/60 rounded-full cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsEditingInterests(false)}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold rounded-xl transition-all"
                >
                  Yo'q
                </button>
                <button
                  onClick={handleCustomSynthesis}
                  className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Saqlash va Yangilash
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 2: WHY AM I SEEING THIS? (AI REASON EXPLAINER) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {explainingVideo && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0e0a24] border border-purple-500/40 p-6 rounded-2xl w-full max-w-md space-y-4 text-left shadow-2xl shadow-purple-950/50"
            >
              <div className="flex justify-between items-center border-b border-purple-500/25 pb-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">Why am I seeing this?</h3>
                </div>
                <button
                  onClick={() => setExplainingVideo(null)}
                  className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-3 bg-[#120d30] p-3 rounded-xl border border-white/5">
                <img src={explainingVideo.coverUrl} alt={explainingVideo.title} className="w-20 h-14 object-cover rounded-lg shrink-0" />
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-white line-clamp-1">{explainingVideo.title}</h4>
                  <span className="text-[10px] text-gray-400 font-mono block mt-0.5">{explainingVideo.creator}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">{explainingVideo.matchPercentage}% AI Match Index</span>
                </div>
              </div>

              <div className="space-y-2 bg-purple-950/30 p-3.5 rounded-xl border border-purple-500/20 text-xs">
                <p className="font-bold text-purple-200">AI Signal Analysis:</p>
                <p className="text-gray-300 leading-relaxed font-sans">{explainingVideo.reason || 'Calculated based on 245 video watch vector nodes, user retention metrics & top interest tags.'}</p>
              </div>

              <button
                onClick={() => setExplainingVideo(null)}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all"
              >
                Tushundim
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 3: 5-MINUTE AI VIDEO SUMMARY */}
      {/* ======================================================== */}
      <AnimatePresence>
        {summaryVideo && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0e0a24] border border-purple-500/40 p-6 rounded-2xl w-full max-w-lg space-y-4 text-left shadow-2xl shadow-purple-950/50"
            >
              <div className="flex justify-between items-center border-b border-purple-500/25 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">5-Minute AI Summary</h3>
                </div>
                <button
                  onClick={() => setSummaryVideo(null)}
                  className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">{summaryVideo.title}</h4>
                <p className="text-[10px] text-gray-400 font-mono">By {summaryVideo.creator} • {summaryVideo.duration}</p>
              </div>

              <div className="space-y-2 bg-[#080519] p-4 rounded-xl border border-purple-500/20 text-xs text-gray-200 leading-relaxed max-h-60 overflow-y-auto font-sans">
                <p className="font-bold text-purple-300">📌 Asosiy Xulosalar (Key Takeaways):</p>
                <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-gray-300">
                  <li><strong>Core Concept:</strong> {summaryVideo.description}</li>
                  <li><strong>Architectural Pattern:</strong> Practical modular breakdown with state optimization and clean interfaces.</li>
                  <li><strong>Actionable Insight:</strong> Apply these techniques immediately to reduce latency and enhance user experience.</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSummaryVideo(null)}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl"
                >
                  Yopish
                </button>
                <button
                  onClick={() => {
                    const v = summaryVideo;
                    setSummaryVideo(null);
                    onPlayVideo(v);
                  }}
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  To'liq Ko'rish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 4: DETAILED AI ACTIVITY LOG */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isAiLogOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0e0a24] border border-purple-500/40 p-6 rounded-2xl w-full max-w-lg space-y-4 text-left shadow-2xl shadow-purple-950/50"
            >
              <div className="flex justify-between items-center border-b border-purple-500/25 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">AI Activity Log</h3>
                </div>
                <button
                  onClick={() => setIsAiLogOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 font-mono text-xs">
                {aiLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-[#120d30] rounded-xl border border-white/5 space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span className="font-bold text-purple-300">{log.activity}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-gray-200 font-sans">{log.result}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsAiLogOpen(false)}
                className="w-full py-2 bg-purple-600 text-white text-xs font-bold rounded-xl"
              >
                Yopish
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 5: HOW IT WORKS & TRANSPARENCY */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isHowItWorksOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0e0a24] border border-purple-500/40 p-6 rounded-2xl w-full max-w-lg space-y-4 text-left shadow-2xl shadow-purple-950/50"
            >
              <div className="flex justify-between items-center border-b border-purple-500/25 pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">How SoftCast AI Works</h3>
                </div>
                <button
                  onClick={() => setIsHowItWorksOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-gray-300 font-sans leading-relaxed">
                <p>
                  SoftCast AI analyzes signals from your viewing history, likes, saved items, and search queries to construct a personalized vector graph.
                </p>
                
                <div className="p-3 bg-[#120d30] rounded-xl border border-white/5 space-y-1">
                  <p className="font-bold text-purple-300">🔒 Privacy First Guarantee:</p>
                  <p className="text-[11px] text-gray-400">
                    Your viewing history is processed on encrypted server endpoints. Personal data is never sold or shared with external ad platforms.
                  </p>
                </div>

                <div className="p-3 bg-[#120d30] rounded-xl border border-white/5 space-y-1">
                  <p className="font-bold text-blue-300">🧠 Mind Expansion Formula:</p>
                  <p className="text-[11px] text-gray-400">
                    To prevent echo chambers, 20% of your feed is dedicated to adjacent concepts (Mind Expanding & Hidden Gems).
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsHowItWorksOpen(false)}
                className="w-full py-2 bg-purple-600 text-white text-xs font-bold rounded-xl"
              >
                Tushundim
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ========================================================
// REUSABLE VIDEO CARD COMPONENT WITH QUICK ACTION OVERLAYS
// ========================================================
interface VideoCardItemProps {
  key?: string;
  video: Video & { matchPercentage?: number; reason?: string };
  onPlayVideo: (video: Video) => void;
  savedVideoIds: string[];
  likedVideoIds: string[];
  toggleSave: (id: string, e?: React.MouseEvent) => void;
  toggleLike: (id: string, e?: React.MouseEvent) => void;
  onExplain: (video: Video & { matchPercentage?: number; reason?: string }) => void;
  onSummary: (video: Video) => void;
  onShare: (video: Video, e?: React.MouseEvent) => void;
  extraBadge?: string;
}

function VideoCardItem({
  video,
  onPlayVideo,
  savedVideoIds,
  likedVideoIds,
  toggleSave,
  toggleLike,
  onExplain,
  onSummary,
  onShare,
  extraBadge
}: VideoCardItemProps) {
  const isSaved = savedVideoIds.includes(video.id);
  const isLiked = likedVideoIds.includes(video.id);

  return (
    <div
      onClick={() => onPlayVideo(video)}
      className="group bg-[#110e28]/25 hover:bg-[#110e28]/70 border border-[#231b52]/20 hover:border-purple-500/40 p-2.5 rounded-xl transition-all duration-300 cursor-pointer flex flex-col justify-between text-left"
    >
      <div className="relative aspect-video rounded-lg overflow-hidden bg-purple-950/20 border border-[#2a245a]/30 shrink-0">
        <img
          src={video.coverUrl}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <span className="absolute bottom-1.5 right-1.5 text-[9px] px-1.5 py-0.5 bg-black/85 rounded font-mono text-white font-semibold shadow-sm">
          {video.duration}
        </span>

        {/* AI Match percentage badge */}
        {video.matchPercentage && (
          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-extrabold uppercase rounded shadow-md tracking-wider">
            {video.matchPercentage}% MATCH
          </span>
        )}

        {/* Extra badge (e.g. Quality Score for hidden gems) */}
        {extraBadge && (
          <span className="absolute top-1.5 right-1.5 px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-extrabold rounded shadow-md font-mono">
            {extraBadge}
          </span>
        )}

        {/* Hover play icon & overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
          <div className="p-2.5 bg-purple-600 text-white rounded-full scale-90 group-hover:scale-100 transition-all duration-300 shadow-xl shadow-purple-950/50">
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      <div className="mt-2.5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-white text-xs leading-snug group-hover:text-purple-400 transition-colors line-clamp-2 font-sans">
            {video.title}
          </h4>
        </div>

        {/* Creator & Quick Action Buttons */}
        <div className="space-y-2 mt-2 pt-2 border-t border-[#231b52]/15">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold">
            <span className="truncate">{video.creator}</span>
            <span className="font-mono text-gray-500">{video.views}</span>
          </div>

          <div className="flex items-center justify-between gap-1 pt-1">
            <button
              onClick={(e) => { e.stopPropagation(); onExplain(video); }}
              className="text-[9.5px] px-2 py-0.5 rounded bg-purple-950/50 text-purple-300 hover:text-white border border-purple-500/20 hover:border-purple-400 font-bold flex items-center gap-1"
              title="Why am I seeing this?"
            >
              <HelpCircle className="w-3 h-3 text-purple-400" />
              <span>Why?</span>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); onSummary(video); }}
              className="text-[9.5px] px-2 py-0.5 rounded bg-indigo-950/50 text-indigo-300 hover:text-white border border-indigo-500/20 font-bold flex items-center gap-1"
              title="5-minute AI summary"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Summary</span>
            </button>

            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={(e) => toggleSave(video.id, e)}
                className={`p-1 rounded hover:bg-white/10 transition-colors ${isSaved ? 'text-purple-400' : 'text-gray-400'}`}
                title="Save video"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={(e) => toggleLike(video.id, e)}
                className={`p-1 rounded hover:bg-white/10 transition-colors ${isLiked ? 'text-rose-400' : 'text-gray-400'}`}
                title="Like video"
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={(e) => onShare(video, e)}
                className="p-1 rounded hover:bg-white/10 text-gray-400 transition-colors"
                title="Share link"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
