import React, { useState, useMemo } from 'react';
import { 
  Flame, Star, Trophy, Brain, Cpu, Globe, Play, CheckCircle2, 
  ArrowRight, Compass, Beaker, History, Plane, Mic, Search, 
  Sparkles, Filter, X, Bookmark, Share2, Eye, UserPlus, Check, 
  HelpCircle, FileText, Download, FolderPlus, Radio, Layers, 
  TrendingUp, Zap, Clock, Tag, ChevronRight, Award, ThumbsUp, Volume2
} from 'lucide-react';
import { Video, Creator } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface DiscoverHubProps {
  videos?: Video[];
  onPlayVideo: (video: Video) => void;
  searchQuery?: string;
  onAddXp?: (amount: number) => void;
}

export default function DiscoverHub({ videos = [], onPlayVideo, searchQuery = '', onAddXp }: DiscoverHubProps) {
  // --- TOAST NOTIFICATIONS ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const triggerXp = (amount: number) => {
    if (onAddXp) onAddXp(amount);
  };

  // --- LOCAL SEARCH & VOICE SEARCH STATE ---
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState<'all' | 'videos' | 'creators' | 'topics' | 'courses'>('all');

  // --- SMART FILTERS STATE ---
  const [selectedDuration, setSelectedDuration] = useState<'all' | 'short' | 'medium' | 'long'>('all');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'en' | 'uz' | 'ru'>('all');
  const [selectedWorld, setSelectedWorld] = useState<string | null>(null);

  // --- ACTIVE MODALS & OVERLAYS ---
  const [activeTabSection, setActiveTabSection] = useState<'all' | 'trending' | 'editors' | 'ai' | 'worlds'>('all');
  const [explainingVideo, setExplainingVideo] = useState<Video | null>(null);
  const [summaryVideo, setSummaryVideo] = useState<Video | null>(null);
  const [playlistVideo, setPlaylistVideo] = useState<Video | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // --- USER INTERACTION STATES ---
  const [savedVideoIds, setSavedVideoIds] = useState<string[]>([]);
  const [likedVideoIds, setLikedVideoIds] = useState<string[]>([]);
  const [notInterestedIds, setNotInterestedIds] = useState<string[]>([]);
  const [subscribedCreatorIds, setSubscribedCreatorIds] = useState<string[]>(['c1', 'c3']);

  // Voice Search Simulation
  const handleToggleVoiceSearch = () => {
    if (!isVoiceListening) {
      setIsVoiceListening(true);
      showToast('Ovozli qidiruv eshitilmoqda... "Artificial Intelligence" yoki "React" deng.');
      setTimeout(() => {
        setLocalSearch('Artificial Intelligence');
        setIsVoiceListening(false);
        showToast('Ovoz tanindi: "Artificial Intelligence" 🎙️');
      }, 2500);
    } else {
      setIsVoiceListening(false);
    }
  };

  // --- CREATORS DATA ---
  const [creatorsList, setCreatorsList] = useState<Creator[]>([
    {
      id: 'c1',
      name: 'AI Revolution',
      handle: '@airevolution',
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop',
      subscribers: '1.2M',
      category: 'AI & Deep Tech',
      verified: true,
      bio: 'Exploring AGI, neural architectures, autonomous agents, and deep tech breakdowns.',
      isSubscribed: true
    },
    {
      id: 'c2',
      name: 'CodeLab',
      handle: '@codelab_official',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
      subscribers: '890K',
      category: 'Programming & Web',
      verified: true,
      bio: 'Full-stack engineering tutorials, Linux internals, and architecture masterclasses.',
      isSubscribed: false
    },
    {
      id: 'c3',
      name: 'Space Zone',
      handle: '@spacezone',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
      subscribers: '2.4M',
      category: 'Astronomy & Physics',
      verified: true,
      bio: 'Documenting SpaceX missions, orbital mechanics, and humanity\'s multiplanetary future.',
      isSubscribed: true
    },
    {
      id: 'c4',
      name: 'TechFlow',
      handle: '@techflow',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
      subscribers: '650K',
      category: 'Gadgets & Setup',
      verified: true,
      bio: 'Clean desk ergonomics, hardware benchmarks, and minimalist developer tech.',
      isSubscribed: false
    }
  ]);

  const toggleSubscribeCreator = (creatorId: string) => {
    if (subscribedCreatorIds.includes(creatorId)) {
      setSubscribedCreatorIds(prev => prev.filter(id => id !== creatorId));
      showToast('Kanal obunasi bekor qilindi.');
    } else {
      setSubscribedCreatorIds(prev => [...prev, creatorId]);
      triggerXp(50);
      showToast('Kanalga obuna bo\'lindi! (+50 XP) 🎉');
    }
  };

  // --- MASTER VIDEO COLLECTIONS ---
  const exploreVideos: (Video & { level?: string; language?: string; trendingScore?: number; editorReason?: string; aiReason?: string })[] = useMemo(() => {
    if (videos && videos.length > 0) {
      return videos.map((v, i) => ({
        ...v,
        level: v.category === 'technology' ? 'intermediate' : 'beginner',
        language: (v as any).language || 'uz',
        trendingScore: 9800 - i * 100,
        editorReason: v.description || 'Foydalanuvchi va baza orqali qo\'shilgan haqiqiy video.',
        aiReason: 'Tavsiya etilgan ma\'lumotlar bazasi video kontenti.'
      }));
    }
    return [];
  }, [videos]);

  const aiVideos: (Video & { level?: string; language?: string; trendingScore?: number; editorReason?: string; aiReason?: string })[] = [
    {
      id: 'disc-ai-1',
      title: 'The Rise of Artificial Intelligence',
      description: 'Tracing the breakthrough moments of artificial general intelligence from deep learning milestones to futuristic cognitive reasoning.',
      category: 'discover',
      coverUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
      duration: '21:34',
      views: '1.5M views',
      uploadDate: '1 week ago',
      creator: 'AI Revolution',
      creatorVerified: true,
      videoUrl: 'https://www.youtube.com/embed/5g19-0r_TJI',
      matchPercentage: 99,
      level: 'intermediate',
      language: 'en',
      aiReason: 'Directly aligned with your #AI and #NeuralNetworks watch history.'
    },
    {
      id: 'disc-ai-2',
      title: 'Neural Networks in Simple Words',
      description: 'A simplified visual explanation of perceptrons, hidden layers, feedforward activation, and neural training mechanisms.',
      category: 'discover',
      coverUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80',
      duration: '19:27',
      views: '892K views',
      uploadDate: '2 weeks ago',
      creator: 'MindLab',
      creatorVerified: true,
      videoUrl: 'https://www.youtube.com/embed/mK9kK2r_M9g',
      matchPercentage: 96,
      level: 'beginner',
      language: 'uz',
      aiReason: 'High engagement among learners studying Machine Learning basics.'
    },
    {
      id: 'disc-ai-3',
      title: 'AI Tools That Will Blow Your Mind',
      description: 'Check out the top game-changing AI platforms and productivity tools that will completely automate your development workflow.',
      category: 'discover',
      coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      duration: '16:45',
      views: '754K views',
      uploadDate: '3 days ago',
      creator: 'Future Tech',
      creatorVerified: true,
      videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
      matchPercentage: 94,
      level: 'intermediate',
      language: 'en',
      aiReason: 'Recommended because you frequently search for productivity tools.'
    },
    {
      id: 'disc-ai-4',
      title: 'ChatGPT Advanced Guide',
      description: 'Mastering system prompts, prompt chaining, contextual routing, and custom GPT models to build production grade agents.',
      category: 'discover',
      coverUrl: 'https://images.unsplash.com/photo-1675557009875-436f09780264?w=600&auto=format&fit=crop&q=80',
      duration: '23:10',
      views: '2.2M views',
      uploadDate: '6 days ago',
      creator: 'SoftLab',
      creatorVerified: true,
      videoUrl: 'https://www.youtube.com/embed/5g19-0r_TJI',
      matchPercentage: 98,
      level: 'advanced',
      language: 'ru',
      aiReason: 'Matches your top saved topics in Prompt Engineering & AI Agents.'
    }
  ];

  const recentVideos: (Video & { level?: string; language?: string; trendingScore?: number; editorReason?: string; aiReason?: string })[] = [
    {
      id: 'disc-recent-1',
      title: 'The Hidden Kingdoms',
      description: 'A breathtaking cinematic nature exploration of Earth\'s most remote untouched forests and hidden wildlife habitats.',
      category: 'discover',
      coverUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&auto=format&fit=crop&q=80',
      duration: '17:22',
      views: '12K views',
      uploadDate: '2 hours ago',
      creator: 'CineWorld',
      creatorVerified: true,
      videoUrl: 'https://www.youtube.com/embed/S_8q9Z4t8k8',
      level: 'beginner',
      language: 'en'
    },
    {
      id: 'disc-recent-2',
      title: 'Minimal Desk Setup 2026',
      description: 'An aesthetic tour of a highly ergonomic, clean desk space utilizing premium materials, desk shelves, and custom linear switches.',
      category: 'discover',
      coverUrl: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80',
      duration: '15:48',
      views: '18K views',
      uploadDate: '4 hours ago',
      creator: 'TechFlow',
      creatorVerified: true,
      videoUrl: 'https://www.youtube.com/embed/z6L8p6y1Y9E',
      level: 'beginner',
      language: 'en'
    },
    {
      id: 'disc-recent-3',
      title: 'Solo Hiking the Alps',
      description: 'Documenting a single climber\'s multi-day trek through the scenic, freezing altitude trails of the Swiss and Italian Alps.',
      category: 'discover',
      coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
      duration: '20:15',
      views: '9K views',
      uploadDate: '6 hours ago',
      creator: 'Travel Base',
      creatorVerified: true,
      videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
      level: 'intermediate',
      language: 'en'
    },
    {
      id: 'disc-recent-4',
      title: 'Cyberpunk 2077 Secrets',
      description: 'Uncovering the hidden references, easter eggs, lore tidbits, and optimized performance setups hidden inside the latest DLC updates.',
      category: 'discover',
      coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
      duration: '22:33',
      views: '25K views',
      uploadDate: '8 hours ago',
      creator: 'GameByte',
      creatorVerified: true,
      videoUrl: 'https://www.youtube.com/embed/8X2kIfS6fb8',
      level: 'beginner',
      language: 'uz'
    }
  ];

  const hotVideos: (Video & { level?: string; language?: string; trendingScore?: number; editorReason?: string; aiReason?: string })[] = [
    {
      id: 'disc-hot-1',
      title: 'Why Space Will Save Humanity',
      description: 'An in-depth analysis of space habitats, orbital manufacturing, asteroid mining, and human expansion into the solar system.',
      category: 'discover',
      coverUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=80',
      duration: '24:19',
      views: '3.2M views',
      uploadDate: '1 day ago',
      creator: 'Space Zone',
      creatorVerified: true,
      videoUrl: 'https://www.youtube.com/embed/Dp3S2S-qTsw',
      trendingScore: 9980,
      level: 'intermediate',
      language: 'en'
    },
    {
      id: 'disc-hot-2',
      title: 'Elon Musk: The Real Interview',
      description: 'A rare candid discussion concerning Neuralink, SpaceX Mars colonization timelines, Tesla AI, and the evolution of social networking.',
      category: 'discover',
      coverUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=600&auto=format&fit=crop&q=80',
      duration: '18:07',
      views: '2.7M views',
      uploadDate: '2 days ago',
      creator: 'Business Core',
      creatorVerified: true,
      videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
      trendingScore: 9650,
      level: 'advanced',
      language: 'en'
    },
    {
      id: 'disc-hot-3',
      title: 'Top 10 AI Breakthroughs',
      description: 'Reviewing the top revolutionary advancements of the year in robotics, protein folding, generative soundscapes, and logic-chained agents.',
      category: 'discover',
      coverUrl: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=600&auto=format&fit=crop&q=80',
      duration: '16:31',
      views: '2.4M views',
      uploadDate: '3 days ago',
      creator: 'AI Revolution',
      creatorVerified: true,
      videoUrl: 'https://www.youtube.com/embed/5g19-0r_TJI',
      trendingScore: 9420,
      level: 'intermediate',
      language: 'en'
    },
    {
      id: 'disc-hot-4',
      title: 'Deep Ocean Mysteries',
      description: 'Diving thousands of meters down into the abyssal zones of the Pacific to find glowing deep-sea organisms and extreme hydrothermal vents.',
      category: 'discover',
      coverUrl: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=600&auto=format&fit=crop&q=80',
      duration: '21:44',
      views: '2.1M views',
      uploadDate: '4 days ago',
      creator: 'Nature Docs',
      creatorVerified: true,
      videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
      trendingScore: 9100,
      level: 'beginner',
      language: 'en'
    }
  ];

  // Combine all for master filtering
  const allMasterVideos = useMemo(() => {
    return [...exploreVideos, ...aiVideos, ...recentVideos, ...hotVideos].filter(
      v => !notInterestedIds.includes(v.id)
    );
  }, [notInterestedIds]);

  // Apply Search, Duration, Level, Language, Category/World Filters
  const filteredVideos = useMemo(() => {
    return allMasterVideos.filter(v => {
      // Query match
      const query = localSearch.trim().toLowerCase();
      if (query) {
        const matchesTitle = v.title.toLowerCase().includes(query);
        const matchesDesc = v.description.toLowerCase().includes(query);
        const matchesCreator = v.creator.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCreator) return false;
      }

      // World match
      if (selectedWorld) {
        const w = selectedWorld.toLowerCase();
        const matches = v.title.toLowerCase().includes(w) || 
                        v.description.toLowerCase().includes(w) || 
                        v.creator.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Duration filter
      if (selectedDuration !== 'all') {
        const mins = parseInt(v.duration.split(':')[0], 10) || 15;
        if (selectedDuration === 'short' && mins >= 10) return false;
        if (selectedDuration === 'medium' && (mins < 10 || mins > 30)) return false;
        if (selectedDuration === 'long' && mins <= 30) return false;
      }

      // Level filter
      if (selectedLevel !== 'all' && v.level && v.level !== selectedLevel) {
        return false;
      }

      // Language filter
      if (selectedLanguage !== 'all' && v.language && v.language !== selectedLanguage) {
        return false;
      }

      return true;
    });
  }, [allMasterVideos, localSearch, selectedWorld, selectedDuration, selectedLevel, selectedLanguage]);

  // CATEGORIES / WORLDS LIST
  const worldsList = [
    { name: 'Technology', icon: Cpu, color: 'from-blue-600 to-indigo-600', tag: 'Technology' },
    { name: 'Science', icon: Beaker, color: 'from-emerald-600 to-teal-600', tag: 'Science' },
    { name: 'Business', icon: TrendingUp, color: 'from-amber-600 to-orange-600', tag: 'Business' },
    { name: 'Gaming', icon: Radio, color: 'from-purple-600 to-pink-600', tag: 'Gaming' },
    { name: 'Cinema', icon: Star, color: 'from-rose-600 to-red-600', tag: 'Cinema' },
    { name: 'Education', icon: Award, color: 'from-cyan-600 to-blue-600', tag: 'Education' },
    { name: 'Space', icon: Globe, color: 'from-indigo-600 to-purple-800', tag: 'Space' },
    { name: 'Travel', icon: Plane, color: 'from-sky-600 to-cyan-600', tag: 'Travel' }
  ];

  // ACTION HANDLERS
  const toggleSaveVideo = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (savedVideoIds.includes(id)) {
      setSavedVideoIds(prev => prev.filter(i => i !== id));
      showToast('Video kutubxonadan olib tashlandi.');
    } else {
      setSavedVideoIds(prev => [...prev, id]);
      triggerXp(10);
      showToast('Video kutubxonangizga saqlandi! 📁 (+10 XP)');
    }
  };

  const toggleLikeVideo = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (likedVideoIds.includes(id)) {
      setLikedVideoIds(prev => prev.filter(i => i !== id));
      showToast('Like olib tashlandi.');
    } else {
      setLikedVideoIds(prev => [...prev, id]);
      triggerXp(15);
      showToast('Sizga video yoqdi! ❤️ (+15 XP)');
    }
  };

  const handleDismiss = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotInterestedIds(prev => [...prev, id]);
    showToast('Video olib tashlandi. AI tavsiyalar tozalandi.');
  };

  const handleShare = (video: Video, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard?.writeText?.(`${window.location.origin}/video/${video.id}`);
    showToast(`"${video.title.slice(0, 25)}..." havolasi nusxalandi! 🔗`);
  };

  const startDownload = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDownloadingId(id);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadingId(null);
          triggerXp(30);
          showToast('Smart yuklab olish yakunlandi! 📥 Offline rejimda ko\'rishingiz mumkin (+30 XP).');
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  return (
    <div id="discover-hub-workspace" className="p-6 md:p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)] text-left select-none scrollbar-none bg-[#05040d]">
      
      {/* GLOBAL TOAST NOTIFICATION OVERLAY */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            className="fixed top-20 right-8 z-50 bg-[#160f3d] border border-[#5341cb]/80 px-4 py-3 rounded-xl flex items-center gap-3 shadow-2xl text-xs max-w-sm font-sans"
          >
            <Sparkles className="w-4.5 h-4.5 text-purple-400 shrink-0 animate-pulse" />
            <p className="text-gray-100 font-medium leading-snug">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 1. HEADER & SEARCH INTEGRATION */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white font-display flex items-center gap-2.5">
              <span>Discover</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300">
                AI Discovery Engine
              </span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">Yangi g'oyalar, trenddagi darslar va yetakchi creatorlarni AI bilan kashf eting.</p>
          </div>

          {/* Integrated Search Box + Voice Search */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="AI, React, Space, Linux..."
                className="w-full pl-9 pr-8 py-2 bg-[#120d30]/80 border border-[#261d56]/50 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 transition-all font-sans"
              />
              {localSearch && (
                <button onClick={() => setLocalSearch('')} className="absolute right-3 top-3 text-gray-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Voice Search Button */}
            <button
              onClick={handleToggleVoiceSearch}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
                isVoiceListening 
                  ? 'bg-rose-600 border-rose-500 text-white animate-pulse shadow-lg shadow-rose-950/50' 
                  : 'bg-[#120d30] border-[#261d56]/50 text-gray-400 hover:text-white hover:border-purple-500/40'
              }`}
              title="Voice Search"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI SEARCH SUGGESTIONS CHIPS */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-gray-500 font-bold flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-purple-400" /> AI Suggestions:
          </span>
          {['Python beginner course', 'Python AI projects', 'AI Agents', 'React Native', 'Linux Kernel'].map((sug) => (
            <button
              key={sug}
              onClick={() => setLocalSearch(sug)}
              className="text-[10.5px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-950/40 border border-white/5 hover:border-purple-500/30 text-gray-300 hover:text-purple-300 transition-all font-mono"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* SMART FILTERS ROW */}
        <div className="p-3.5 rounded-2xl bg-[#0b081e]/80 border border-[#1d1746]/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-bold text-gray-300">Smart Filters:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Duration selector */}
            <div className="flex items-center gap-1 bg-[#120d30] p-1 rounded-xl border border-white/5">
              <span className="text-[10px] text-gray-500 font-bold px-1.5">Vaqt:</span>
              {(['all', 'short', 'medium', 'long'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDuration(d)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold capitalize transition-all ${
                    selectedDuration === d ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {d === 'all' ? 'Barchasi' : d === 'short' ? '<10m' : d === 'medium' ? '10-30m' : '1h+'}
                </button>
              ))}
            </div>

            {/* Level selector */}
            <div className="flex items-center gap-1 bg-[#120d30] p-1 rounded-xl border border-white/5">
              <span className="text-[10px] text-gray-500 font-bold px-1.5">Daraja:</span>
              {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold capitalize transition-all ${
                    selectedLevel === lvl ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {lvl === 'all' ? 'Barchasi' : lvl === 'beginner' ? 'Boshlang\'ich' : lvl === 'intermediate' ? 'O\'rta' : 'Yuqori'}
                </button>
              ))}
            </div>

            {/* Language selector */}
            <div className="flex items-center gap-1 bg-[#120d30] p-1 rounded-xl border border-white/5">
              <span className="text-[10px] text-gray-500 font-bold px-1.5">Til:</span>
              {(['all', 'en', 'uz', 'ru'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    selectedLanguage === lang ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {lang === 'all' ? 'Barchasi' : lang}
                </button>
              ))}
            </div>

            {/* Reset Filter Button */}
            {(selectedDuration !== 'all' || selectedLevel !== 'all' || selectedLanguage !== 'all' || selectedWorld) && (
              <button 
                onClick={() => {
                  setSelectedDuration('all');
                  setSelectedLevel('all');
                  setSelectedLanguage('all');
                  setSelectedWorld(null);
                  showToast('Filtrlar tozalandi.');
                }}
                className="px-2.5 py-1 text-[10px] font-bold text-rose-400 hover:text-rose-300 bg-rose-950/30 rounded-lg border border-rose-500/20"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TOP 4 FEATURE CARDS (CLICKABLE INTERACTIVE HUBS) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        
        {/* Card 1: Trending Now */}
        <div 
          onClick={() => {
            setActiveTabSection(activeTabSection === 'trending' ? 'all' : 'trending');
            showToast('Trending Leaderboard rejimi va formulasi faollashtirildi 🔥');
          }}
          className={`relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-[#1b104c] via-[#0e0a29] to-[#05040d] border transition-all cursor-pointer group shadow-lg ${
            activeTabSection === 'trending' ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-purple-900/30 hover:border-purple-500/40'
          }`}
        >
          <div className="absolute right-3 bottom-3 w-40 h-24 opacity-30 group-hover:opacity-55 transition-opacity pointer-events-none">
            <svg viewBox="0 0 100 60" className="w-full h-full">
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <rect x="5" y="45" width="8" height="15" rx="1.5" fill="url(#barGrad)" />
              <rect x="20" y="35" width="8" height="25" rx="1.5" fill="url(#barGrad)" />
              <rect x="35" y="28" width="8" height="32" rx="1.5" fill="url(#barGrad)" />
              <rect x="50" y="22" width="8" height="38" rx="1.5" fill="url(#barGrad)" />
              <rect x="65" y="14" width="8" height="46" rx="1.5" fill="url(#barGrad)" />
              <rect x="80" y="5" width="8" height="55" rx="1.5" fill="url(#barGrad)" />
              <path d="M9,45 L24,35 L39,28 L54,22 L69,14 L84,5" fill="none" stroke="#d946ef" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="space-y-1.5 relative z-10">
            <div className="inline-flex p-2 bg-[#ea580c]/10 border border-[#ea580c]/20 text-[#f97316] rounded-xl">
              <Flame className="w-5 h-5 fill-current animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Trending Now 🔥</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Viral Score = Views + WatchTime + Likes</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between relative z-10">
            <span className="text-[10px] font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">+184% Growth</span>
            <button className="p-2 bg-white/5 group-hover:bg-amber-500 group-hover:text-black text-white rounded-full transition-all">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 2: Editor's Choice */}
        <div 
          onClick={() => {
            setActiveTabSection(activeTabSection === 'editors' ? 'all' : 'editors');
            showToast('Editor\'s Choice saralangan premium kontentlar 👑');
          }}
          className={`relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-[#121c42] via-[#0a0f2b] to-[#05040d] border transition-all cursor-pointer group shadow-lg ${
            activeTabSection === 'editors' ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-blue-900/30 hover:border-blue-500/40'
          }`}
        >
          <div className="absolute right-4 bottom-3 w-28 h-28 opacity-25 group-hover:opacity-45 transition-opacity pointer-events-none flex items-center justify-center">
            <Trophy className="w-20 h-20 text-blue-400 stroke-[1.2]" />
          </div>

          <div className="space-y-1.5 relative z-10">
            <div className="inline-flex p-2 bg-[#d97706]/10 border border-[#d97706]/20 text-[#fbbf24] rounded-xl">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Editor's Choice ⭐</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Selected by SoftCast Team</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between relative z-10">
            <span className="text-[10px] font-bold text-blue-300 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-500/20">Handpicked Quality</span>
            <button className="p-2 bg-white/5 group-hover:bg-blue-500 group-hover:text-white text-white rounded-full transition-all">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 3: AI Discoveries */}
        <div 
          onClick={() => {
            setActiveTabSection(activeTabSection === 'ai' ? 'all' : 'ai');
            showToast('AI Shaxsiy tavsiyalar ro\'yxati 🤖');
          }}
          className={`relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-[#0c223c] via-[#071329] to-[#05040d] border transition-all cursor-pointer group shadow-lg ${
            activeTabSection === 'ai' ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-indigo-950 hover:border-indigo-500/40'
          }`}
        >
          <div className="absolute right-2 bottom-2 w-32 h-28 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
            <Brain className="w-24 h-24 text-purple-400" />
          </div>

          <div className="space-y-1.5 relative z-10">
            <div className="inline-flex p-2 bg-[#2563eb]/10 border border-[#2563eb]/20 text-[#3b82f6] rounded-xl">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">AI Discoveries 🤖</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Personalized Interest Graph</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between relative z-10">
            <span className="text-[10px] font-bold text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/20">98% Match Index</span>
            <button className="p-2 bg-white/5 group-hover:bg-purple-600 group-hover:text-white text-white rounded-full transition-all">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 4: Explore Worlds */}
        <div 
          onClick={() => {
            setActiveTabSection(activeTabSection === 'worlds' ? 'all' : 'worlds');
            showToast('Explore Worlds: Kategoriyalar dunyosi 🌍');
          }}
          className={`relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-[#0c2e35] via-[#06181b] to-[#05040d] border transition-all cursor-pointer group shadow-lg ${
            activeTabSection === 'worlds' ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-cyan-950 hover:border-cyan-500/40'
          }`}
        >
          <div className="space-y-2 text-left z-10 relative">
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Explore Worlds 🌍</h3>
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-gray-300 font-semibold">
              <span>💻 Technology</span>
              <span>🧪 Science</span>
              <span>💼 Business</span>
              <span>🚀 Space</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between relative z-10">
            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">8 Category Hubs</span>
            <button className="p-2 bg-white/5 group-hover:bg-cyan-500 group-hover:text-black text-white rounded-full transition-all">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. EXPLORE WORLDS INTERACTIVE GRID (EXPANDED IF WORLDS ACTIVE) */}
      {/* ======================================================== */}
      {(activeTabSection === 'worlds' || activeTabSection === 'all') && (
        <div className="p-5 rounded-2xl bg-[#0a071d]/90 border border-[#1e174c]/60 space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-extrabold text-white">Explore Worlds (Kategoriyalar)</h3>
            </div>
            {selectedWorld && (
              <button 
                onClick={() => setSelectedWorld(null)}
                className="text-xs text-purple-400 hover:underline font-bold"
              >
                Clear Category ({selectedWorld})
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {worldsList.map((world) => {
              const IconComp = world.icon;
              const isSelected = selectedWorld === world.name;
              return (
                <button
                  key={world.name}
                  onClick={() => {
                    if (isSelected) setSelectedWorld(null);
                    else {
                      setSelectedWorld(world.name);
                      showToast(`"${world.name}" darsliklari va roliklari filtri tanlandi! 🌍`);
                    }
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all group ${
                    isSelected 
                      ? 'bg-gradient-to-b ' + world.color + ' border-white text-white shadow-lg scale-105' 
                      : 'bg-[#120d30]/60 border-white/5 hover:border-purple-500/40 text-gray-300 hover:text-white'
                  }`}
                >
                  <IconComp className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="text-[11px] font-bold">{world.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. CREATOR DISCOVERY ROW (SUBSCRIBE & FOLLOW) */}
      {/* ======================================================== */}
      <div className="p-5 rounded-2xl bg-[#090717] border border-[#1b1540] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-white tracking-wide flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-purple-400" />
              <span>Top Creator Discovery</span>
            </h3>
            <p className="text-[11px] text-gray-400">AI tomonidan tanlangan yetakchi mualliflarni kuzatib boring.</p>
          </div>
          <span className="text-[10px] text-purple-300 bg-purple-950/40 border border-purple-500/20 px-2.5 py-1 rounded-lg font-bold">
            Obuna = +50 XP
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {creatorsList.map((creator) => {
            const isSub = subscribedCreatorIds.includes(creator.id);
            return (
              <div 
                key={creator.id}
                className="bg-[#120e33]/50 border border-[#231a5b]/40 p-4 rounded-xl flex flex-col justify-between space-y-3 group hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <img src={creator.avatarUrl} alt={creator.name} className="w-10 h-10 rounded-full object-cover border border-purple-500/30 shrink-0" />
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-bold text-white truncate">{creator.name}</h4>
                      {creator.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/10 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono block truncate">{creator.handle} • {creator.subscribers}</span>
                  </div>
                </div>

                <p className="text-[10.5px] text-gray-300 line-clamp-2 leading-snug font-sans">{creator.bio}</p>

                <button
                  onClick={() => toggleSubscribeCreator(creator.id)}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                    isSub 
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950/20'
                  }`}
                >
                  {isSub ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Obuna bo'lindingiz</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Obuna bo'lish (+50 XP)</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. MAIN VIDEO SECTIONS FEED */}
      {/* ======================================================== */}
      <div className="space-y-8 pt-2">
        
        {/* EXPLORE VIDEOS SECTION */}
        {(activeTabSection === 'all' || activeTabSection === 'worlds') && (
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-[#1b1544]/30 pb-2">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Explore Videos</span>
                </h2>
                <p className="text-[11px] text-gray-400">Discover something new today in high quality.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredVideos.slice(0, 4).map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onPlayVideo={onPlayVideo}
                  savedVideoIds={savedVideoIds}
                  likedVideoIds={likedVideoIds}
                  toggleSaveVideo={toggleSaveVideo}
                  toggleLikeVideo={toggleLikeVideo}
                  onExplain={(v) => setExplainingVideo(v)}
                  onSummary={(v) => setSummaryVideo(v)}
                  onPlaylist={(v) => setPlaylistVideo(v)}
                  onShare={handleShare}
                  onDismiss={handleDismiss}
                  onDownload={startDownload}
                  downloadingId={downloadingId}
                  downloadProgress={downloadProgress}
                />
              ))}
            </div>
          </div>
        )}

        {/* AI DISCOVERIES SECTION */}
        {(activeTabSection === 'all' || activeTabSection === 'ai') && (
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-[#1b1544]/30 pb-2">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span>Because You Like AI 🤖</span>
                </h2>
                <p className="text-[11px] text-gray-400">AI tomonidan sizning qiziqishingiz asosida tavsiya qilindi.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {aiVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onPlayVideo={onPlayVideo}
                  savedVideoIds={savedVideoIds}
                  likedVideoIds={likedVideoIds}
                  toggleSaveVideo={toggleSaveVideo}
                  toggleLikeVideo={toggleLikeVideo}
                  onExplain={(v) => setExplainingVideo(v)}
                  onSummary={(v) => setSummaryVideo(v)}
                  onPlaylist={(v) => setPlaylistVideo(v)}
                  onShare={handleShare}
                  onDismiss={handleDismiss}
                  onDownload={startDownload}
                  downloadingId={downloadingId}
                  downloadProgress={downloadProgress}
                  showMatchIndex
                />
              ))}
            </div>
          </div>
        )}

        {/* RECENTLY UPLOADED SECTION */}
        {(activeTabSection === 'all' || activeTabSection === 'trending') && (
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-[#1b1544]/30 pb-2">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>Recently Uploaded</span>
                </h2>
                <p className="text-[11px] text-gray-400">So'nggi 24 soat ichida yuklangan eng so'nggi roliklar.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {recentVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onPlayVideo={onPlayVideo}
                  savedVideoIds={savedVideoIds}
                  likedVideoIds={likedVideoIds}
                  toggleSaveVideo={toggleSaveVideo}
                  toggleLikeVideo={toggleLikeVideo}
                  onExplain={(v) => setExplainingVideo(v)}
                  onSummary={(v) => setSummaryVideo(v)}
                  onPlaylist={(v) => setPlaylistVideo(v)}
                  onShare={handleShare}
                  onDismiss={handleDismiss}
                  onDownload={startDownload}
                  downloadingId={downloadingId}
                  downloadProgress={downloadProgress}
                  isRecent
                />
              ))}
            </div>
          </div>
        )}

        {/* MOST WATCHED TODAY (TRENDING LEADERBOARD) */}
        {(activeTabSection === 'all' || activeTabSection === 'trending') && (
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-[#1b1544]/30 pb-2">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400 fill-current" />
                  <span>Most Watched Today 🔥</span>
                </h2>
                <p className="text-[11px] text-gray-400">Kunlik ko'rishlar, uzluksizlik va ulashishlar bo'yicha reyting.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {hotVideos.map((video, idx) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onPlayVideo={onPlayVideo}
                  savedVideoIds={savedVideoIds}
                  likedVideoIds={likedVideoIds}
                  toggleSaveVideo={toggleSaveVideo}
                  toggleLikeVideo={toggleLikeVideo}
                  onExplain={(v) => setExplainingVideo(v)}
                  onSummary={(v) => setSummaryVideo(v)}
                  onPlaylist={(v) => setPlaylistVideo(v)}
                  onShare={handleShare}
                  onDismiss={handleDismiss}
                  onDownload={startDownload}
                  downloadingId={downloadingId}
                  downloadProgress={downloadProgress}
                  isHot
                  hotRank={idx + 1}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL 1: AI EXPLAIN MODAL ("Why Recommended?") */}
      {/* ======================================================== */}
      <AnimatePresence>
        {explainingVideo && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0e0a29] border border-purple-500/30 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2 text-purple-400 font-extrabold text-sm">
                  <Brain className="w-5 h-5" />
                  <span>AI Recommendation Reasoning</span>
                </div>
                <button onClick={() => setExplainingVideo(null)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white line-clamp-2">{explainingVideo.title}</h4>
                <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-500/20 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Check className="w-4 h-4" />
                    <span>Match Score: {explainingVideo.matchPercentage || 97}%</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed font-sans">
                    {explainingVideo.aiReason || 'Siz ushbu mavzudagi 5 ta videoni oxirigacha tomosha qilgansiz hamda ushbu video texnologiya ixlosmandlari orasida eng yuqori darajada baholangan.'}
                  </p>
                </div>

                <div className="space-y-1.5 text-[11px] text-gray-400 font-mono">
                  <div className="flex justify-between">
                    <span>Watch history similarity:</span>
                    <span className="text-purple-300 font-bold">99.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Region affinity:</span>
                    <span className="text-indigo-300 font-bold">High</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setExplainingVideo(null);
                  onPlayVideo(explainingVideo);
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Videoni Tomosha Qilish</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 2: AI SUMMARY POPUP MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {summaryVideo && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0821] border border-indigo-500/30 p-6 rounded-2xl max-w-lg w-full space-y-4 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-sm">
                  <FileText className="w-5 h-5" />
                  <span>Instant AI Summary</span>
                </div>
                <button onClick={() => setSummaryVideo(null)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white">{summaryVideo.title}</h4>
                <div className="bg-[#130f36] p-4 rounded-xl border border-indigo-500/20 text-xs space-y-2 text-gray-200">
                  <p className="font-semibold text-purple-300">📌 Asosiy Xulosalar (Key Takeaways):</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-300 font-sans">
                    <li>Ushbu videoda {summaryVideo.creator} tomonidan asosiy nazariy hamda amaliy tushunchalar ochib berilgan.</li>
                    <li>Arxitektura, xavfsizlik hamda zamonaviy Cloud infratuzilmasini sozlash tartibi.</li>
                    <li>Boshlovchilar hamda tajribali mutaxassislar uchun eng muhim tavsiyalar majmuasi.</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSummaryVideo(null);
                    onPlayVideo(summaryVideo);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play Video</span>
                </button>
                <button
                  onClick={() => {
                    setSummaryVideo(null);
                    showToast('Xulosa matni nusxalandi! 📋');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold transition-all"
                >
                  Copy Notes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 3: ADD TO PLAYLIST MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {playlistVideo && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0821] border border-purple-500/30 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2 text-purple-400 font-extrabold text-sm">
                  <FolderPlus className="w-5 h-5" />
                  <span>Playlistga Qo'shish</span>
                </div>
                <button onClick={() => setPlaylistVideo(null)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-400">"{playlistVideo.title.slice(0, 30)}..." videoni saqlang:</p>
                {['🤖 My AI Watchlist', '⚡ React & Web Mastery', '🌌 Night Study Chill'].map((pl) => (
                  <button
                    key={pl}
                    onClick={() => {
                      setPlaylistVideo(null);
                      triggerXp(10);
                      showToast(`"${pl}" pleylistiga muvaffaqiyatli qo'shildi! (+10 XP)`);
                    }}
                    className="w-full p-3 rounded-xl bg-[#140f3b] hover:bg-[#1f175a] border border-white/5 text-xs text-gray-200 font-bold text-left transition-all flex items-center justify-between"
                  >
                    <span>{pl}</span>
                    <Check className="w-4 h-4 text-purple-400" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ========================================================
// REUSABLE COMPREHENSIVE VIDEO CARD COMPONENT
// ========================================================
interface VideoCardProps {
  key?: string;
  video: Video & { level?: string; language?: string; trendingScore?: number; editorReason?: string; aiReason?: string };
  onPlayVideo: (video: Video) => void;
  savedVideoIds: string[];
  likedVideoIds: string[];
  toggleSaveVideo: (id: string, e?: React.MouseEvent) => void;
  toggleLikeVideo: (id: string, e?: React.MouseEvent) => void;
  onExplain: (video: Video) => void;
  onSummary: (video: Video) => void;
  onPlaylist: (video: Video) => void;
  onShare: (video: Video, e?: React.MouseEvent) => void;
  onDismiss: (id: string, e?: React.MouseEvent) => void;
  onDownload: (id: string, e?: React.MouseEvent) => void;
  downloadingId: string | null;
  downloadProgress: number;
  isRecent?: boolean;
  isHot?: boolean;
  hotRank?: number;
  showMatchIndex?: boolean;
}

function VideoCard({
  video,
  onPlayVideo,
  savedVideoIds,
  likedVideoIds,
  toggleSaveVideo,
  toggleLikeVideo,
  onExplain,
  onSummary,
  onPlaylist,
  onShare,
  onDismiss,
  onDownload,
  downloadingId,
  downloadProgress,
  isRecent,
  isHot,
  hotRank,
  showMatchIndex
}: VideoCardProps) {
  const isSaved = savedVideoIds.includes(video.id);
  const isLiked = likedVideoIds.includes(video.id);
  const isDownloading = downloadingId === video.id;

  return (
    <div
      onClick={() => onPlayVideo(video)}
      className="group bg-[#110e28]/30 hover:bg-[#110e28]/70 border border-[#231b52]/30 hover:border-purple-500/40 p-3 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between relative"
    >
      {/* THUMBNAIL CONTAINER */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-purple-950/20 border border-[#2a245a]/40 shrink-0">
        <img
          src={video.coverUrl}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* DURATION BADGE */}
        <span className="absolute bottom-2 right-2 text-[9px] px-1.5 py-0.5 bg-black/85 rounded font-mono text-white font-semibold">
          {video.duration}
        </span>

        {/* RECENT NEW BADGE */}
        {isRecent && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#4c1d95] text-white text-[9px] font-extrabold uppercase rounded tracking-wider shadow">
            NEW
          </span>
        )}

        {/* HOT RANK BADGE */}
        {isHot && hotRank && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-extrabold rounded shadow flex items-center gap-1">
            <Flame className="w-3 h-3 fill-current" /> #{hotRank}
          </span>
        )}

        {/* MATCH INDEX BADGE */}
        {showMatchIndex && (
          <span className="absolute top-2 left-2 text-[9px] font-extrabold px-2 py-0.5 rounded bg-purple-900/90 text-purple-200 border border-purple-500/30">
            {video.matchPercentage || 98}% Match
          </span>
        )}

        {/* PLAY HOVER OVERLAY WITH DIRECT AI ACTIONS */}
        <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-2.5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <button
              onClick={(e) => toggleSaveVideo(video.id, e)}
              className={`p-1.5 rounded-lg bg-black/70 border ${isSaved ? 'border-purple-500 text-purple-400' : 'border-white/10 text-white'}`}
              title="Save to Library"
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={(e) => toggleLikeVideo(video.id, e)}
              className={`p-1.5 rounded-lg bg-black/70 border ${isLiked ? 'border-rose-500 text-rose-400' : 'border-white/10 text-white'}`}
              title="Like Video"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-center">
            <div className="p-3 bg-purple-600 text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-transform">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
          </div>

          {/* Quick AI Action Bar */}
          <div className="flex items-center justify-around bg-black/80 p-1 rounded-lg border border-white/10 text-[9px] font-bold text-gray-300">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onExplain(video);
              }}
              className="hover:text-purple-300 flex items-center gap-1"
            >
              <Brain className="w-3 h-3 text-purple-400" /> Explain
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSummary(video);
              }}
              className="hover:text-indigo-300 flex items-center gap-1"
            >
              <FileText className="w-3 h-3 text-indigo-400" /> Summary
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onPlaylist(video);
              }}
              className="hover:text-purple-300 flex items-center gap-1"
            >
              <FolderPlus className="w-3 h-3 text-purple-400" /> Add
            </button>
          </div>
        </div>
      </div>

      {/* DETAILS AREA */}
      <div className="mt-3 text-left flex-1 flex flex-col justify-between space-y-2">
        <div>
          <h4 className="font-bold text-white text-[12.5px] leading-snug group-hover:text-purple-400 transition-colors line-clamp-2">
            {video.title}
          </h4>
          <p className="text-[10.5px] text-gray-400 line-clamp-1 mt-1">{video.description}</p>
        </div>

        {/* DOWNLOAD PROGRESS DISPLAY */}
        {isDownloading && (
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] text-purple-300 font-bold font-mono">
              <span>Yuklanmoqda...</span>
              <span>{downloadProgress}%</span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full transition-all duration-200" style={{ width: `${downloadProgress}%` }} />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold truncate">
            <span>{video.creator}</span>
            {video.creatorVerified && <CheckCircle2 className="w-3 h-3 text-blue-400 fill-blue-400/10 shrink-0" />}
          </div>
          <span className="text-[10px] text-gray-500 font-mono shrink-0">{video.views}</span>
        </div>
      </div>
    </div>
  );
}
