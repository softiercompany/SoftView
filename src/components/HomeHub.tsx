import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, Sparkles, Award, Radio, CheckCircle2, ChevronRight, 
  GraduationCap, ChevronLeft, Heart, FolderPlus, MoreVertical, 
  Download, Trash2, Volume2, RefreshCw, FileText, Smartphone, 
  Check, CheckSquare, ArrowRight, Search, Share2, X, Clock, 
  Flame, Zap, TrendingUp, ThumbsUp, Compass, CheckCircle, Info, HelpCircle,
  Plus, Upload, Link
} from 'lucide-react';
import { Video, UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HomeHubProps {
  videos: Video[];
  searchQuery?: string;
  onPlayVideo: (video: Video) => void;
  setActiveTab: (tab: string) => void;
  user?: UserProfile;
  onUpdateUser?: (updated: UserProfile) => void;
  onAddXp?: (amount: number) => void;
  onAddCustomVideo?: (newVideo: Video) => void;
}

export default function HomeHub({ 
  videos, 
  searchQuery = '',
  onPlayVideo, 
  setActiveTab, 
  user, 
  onUpdateUser, 
  onAddXp,
  onAddCustomVideo
}: HomeHubProps) {
  
  // --- USER PERSISTENCE FALLBACK ---
  const activeUser = user || {
    name: 'Aslbek',
    level: 12,
    xp: 620,
    xpNextLevel: 1000,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop',
    isPremium: false
  };

  const triggerAddXp = (amount: number) => {
    if (onAddXp) {
      onAddXp(amount);
    }
  };

  // --- DYNAMIC TOAST / NOTIFICATION MESSAGES ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- STATEFUL PERSISTENCE FOR ENTIRE HOME VIEW ---
  const [challengeProgress, setChallengeProgress] = useState(3.2); // e.g. 3.2 / 5 hours studied
  const [isChallengeClaimed, setIsChallengeClaimed] = useState(false);
  const [liveViewerCount, setLiveViewerCount] = useState(1420);
  const [likedVideoIds, setLikedVideoIds] = useState<string[]>([]);
  const [savedVideoIds, setSavedVideoIds] = useState<string[]>([]);
  const [notInterestedIds, setNotInterestedIds] = useState<string[]>([]);
  
  // --- AI PICKS DYNAMIC RE-ANALYSIS ---
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [reanalysisStep, setReanalysisStep] = useState(0);
  const [aiPickList, setAiPickList] = useState<Video[]>([]);
  
  // --- SEARCH VIEW CONTROLS ---
  const [searchCategory, setSearchCategory] = useState<'all' | 'videos' | 'courses' | 'live' | 'playlists'>('all');

  // --- MORE ACTIONS MODAL / DROPDOWN STATES ---
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [activeSummaryVideo, setActiveSummaryVideo] = useState<Video | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  // --- INLINE UPLOAD MODAL STATES ---
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoCreator, setNewVideoCreator] = useState('Aslbek');
  const [newVideoCategory, setNewVideoCategory] = useState('technology');
  const [newVideoDesc, setNewVideoDesc] = useState('');

  const formatVideoSource = (url: string) => {
    let videoUrl = url;
    let coverUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      if (id) {
        videoUrl = `https://www.youtube.com/embed/${id}`;
        coverUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      }
    } else if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      if (id) {
        videoUrl = `https://www.youtube.com/embed/${id}`;
        coverUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      }
    }

    return { videoUrl, coverUrl };
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl.trim() || !newVideoTitle.trim()) {
      showToast('Please enter video title and URL!');
      return;
    }

    const { videoUrl, coverUrl } = formatVideoSource(newVideoUrl);

    const customVid: Video = {
      id: `custom-vid-${Date.now()}`,
      title: newVideoTitle,
      description: newVideoDesc || 'Uploaded video darslik & educational content.',
      category: newVideoCategory,
      coverUrl: coverUrl,
      duration: '18:45',
      views: '1 view',
      uploadDate: 'Just now',
      creator: newVideoCreator || 'Aslbek',
      creatorVerified: true,
      videoUrl: videoUrl,
      matchPercentage: 99
    };

    if (onAddCustomVideo) {
      onAddCustomVideo(customVid);
    }

    setIsUploadModalOpen(false);
    setNewVideoTitle('');
    setNewVideoUrl('');
    setNewVideoDesc('');
    showToast('Video uploaded successfully! 🚀');
  };

  // --- EXTRA RECOMMENDATIONS (AI INFINITE SCROLL) ---
  const [additionalVideos, setAdditionalVideos] = useState<Video[]>([]);
  const [isScrollingMore, setIsScrollingMore] = useState(false);
  const [activeFilterTag, setActiveFilterTag] = useState<string>('All');

  // --- EXTRACT CORE VIDEOS FOR HOMEPAGE MODULES ---
  const continueWatchingVideo = useMemo(() => {
    return videos.find(v => v.id === 'continue-watching-1') || videos[0] || null;
  }, [videos]);

  const liveVideo = useMemo(() => {
    return videos.find(v => v.isLive) || videos[videos.length - 1] || null;
  }, [videos]);

  // Initial AI picks from incoming videos
  useEffect(() => {
    if (aiPickList.length === 0) {
      const initialPicks = videos.filter(v => v.category === 'ai-picks' || v.id.startsWith('recommended-')).slice(0, 4);
      setAiPickList(initialPicks);
    }
  }, [videos]);

  // Filter out any video that's flagged as "Not Interested" or has category tag mismatch
  const recommendedVideos = useMemo(() => {
    let filtered = videos.filter(
      (v) => (v.id.startsWith('recommended-') || v.id.startsWith('rec')) && !notInterestedIds.includes(v.id)
    );

    // Apply category tag filter if active
    if (activeFilterTag !== 'All') {
      const tagLower = activeFilterTag.toLowerCase();
      filtered = filtered.filter(v => 
        v.category.toLowerCase().includes(tagLower) || 
        v.title.toLowerCase().includes(tagLower) ||
        v.description.toLowerCase().includes(tagLower)
      );
    }

    return [...filtered, ...additionalVideos.filter(v => !notInterestedIds.includes(v.id))];
  }, [videos, additionalVideos, notInterestedIds, activeFilterTag]);

  // Simulated live viewers fluctuation to look truly dynamic
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewerCount(prev => {
        const delta = Math.floor(Math.random() * 7) - 3; // fluctuate by -3 to +3
        const newVal = prev + delta;
        return newVal > 1400 && newVal < 1450 ? newVal : prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // --- DAILY AI BRIEFING TIMED GREETING ---
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return `Xayrli tong, ${activeUser.name}! 🌅`;
    if (hours < 18) return `Xayrli kun, ${activeUser.name}! ☀️`;
    return `Xayrli kech, ${activeUser.name}! 🌌`;
  };

  // --- PROCESS WEEKLY CHALLENGE REWARD ---
  const handleClaimChallenge = () => {
    if (challengeProgress >= 5.0 && !isChallengeClaimed) {
      triggerAddXp(500);
      setIsChallengeClaimed(true);
      showToast('Ajoyib! Haftalik maqsad uchun +500 XP muvaffaqiyatli topshirildi! 🎉');
    }
  };

  const handleSimulateStudy = () => {
    if (challengeProgress < 5.0) {
      setChallengeProgress(prev => {
        const next = Math.min(5.0, Number((prev + 0.6).toFixed(1)));
        if (next >= 5.0) {
          showToast('Tabriklaymiz! Haftalik 5 soatlik maqsadga erishdingiz! Mukofotni oling.');
        } else {
          showToast('1 soat dars ko\'rish simulyatsiya qilindi! Progress yangilandi.');
        }
        return next;
      });
    }
  };

  // --- PROCESS SMART RESUME DIRECT ACTION ---
  const handleSmartResumeCompleted = () => {
    triggerAddXp(120);
    showToast('Ajoyib! Videoni 100% tugatdingiz va +120 XP oldingiz!');
  };

  // --- RE-ANALYZE AI INTERESTS SEQUENTIAL SIMULATION ---
  const triggerReanalysis = () => {
    setIsReanalyzing(true);
    setReanalysisStep(1);
    
    setTimeout(() => setReanalysisStep(2), 600);
    setTimeout(() => setReanalysisStep(3), 1200);
    setTimeout(() => setReanalysisStep(4), 1800);
    
    setTimeout(() => {
      // Shuffle the AI picks list and assign mock matching percentages to simulate personalized AI model calculations
      const shuffled = [...videos]
        .filter(v => v.id !== continueWatchingVideo.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
        .map(v => ({
          ...v,
          matchPercentage: Math.floor(Math.random() * 15) + 85 // 85% to 99% match
        }));
      
      setAiPickList(shuffled);
      setIsReanalyzing(false);
      setReanalysisStep(0);
      showToast('AI Shaxsiy tavsiyalar muvaffaqiyatli qayta hisoblandi! ⚡');
    }, 2400);
  };

  // --- ACCORDION LIST OF AI REANALYSIS STATEMENTS ---
  const analysisStatements = [
    '',
    '🔍 Tomosha qilingan videolar tarixi va vaqtlari tekshirilmoqda...',
    '🧠 Foydalanuvchi qiziqish teglari (#react, #ai, #startup) o\'lchanmoqda...',
    '⚡ Collaborative Filtering & Trend algoritmlari ishga tushirilmoqda...',
    '✨ Siz uchun 4 ta eng yuqori darajada mos keluvchi videolar saralandi!'
  ];

  // --- BOOKMARK / LIKE / DISMISS INTERACTION HANDLERS ---
  const toggleLikeVideo = (id: string) => {
    if (likedVideoIds.includes(id)) {
      setLikedVideoIds(prev => prev.filter(item => item !== id));
      showToast('Likelar ro\'yxatidan olib tashlandi.');
    } else {
      setLikedVideoIds(prev => [...prev, id]);
      showToast('Video yoqdi! Sevimlilar ro\'yxatiga qo\'shildi. ❤️');
    }
  };

  const toggleSaveVideo = (id: string) => {
    if (savedVideoIds.includes(id)) {
      setSavedVideoIds(prev => prev.filter(item => item !== id));
      showToast('Kutubxonadan olib tashlandi.');
    } else {
      setSavedVideoIds(prev => [...prev, id]);
      showToast('Video kutubxonangizga saqlandi! 📁');
    }
  };

  const dismissVideo = (id: string) => {
    setNotInterestedIds(prev => [...prev, id]);
    showToast('Ushbu video endi ko\'rsatilmaydi. AI tavsiyalari tozalandi.');
  };

  // --- SIMULATED SMART OFFLINE DOWNLOAD SEQUENCE ---
  const startSmartDownload = (id: string) => {
    if (downloadedIds.includes(id)) {
      showToast('Ushbu video allaqachon offline saqlangan!');
      return;
    }
    setDownloadingId(id);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadedIds(d => [...d, id]);
          setDownloadingId(null);
          showToast('Smart yuklash yakunlandi! 📥 Offline rejimda ko\'rish mumkin.');
          // Fire a simulated system notification inside our app context
          triggerAddXp(40);
          return 100;
        }
        return prev + 20;
      });
    }, 250);
  };

  // --- GENERATE AI SUMMARY TEXT POPUP ---
  const showAISummary = (video: Video) => {
    setActiveSummaryVideo(video);
    setActiveDropdownId(null);
  };

  // --- AI INFINITE SCROLL / LOAD MORE RECOMMENDATIONS ---
  const handleLoadMore = () => {
    setIsScrollingMore(true);
    setTimeout(() => {
      const extra: Video[] = [
        {
          id: `rec-extra-${Date.now()}-1`,
          title: 'Docker & Kubernetes Mastery Course 2026',
          description: 'A premium system architecture masterclass designed to build resilient multi-container platforms on modern cloud configurations.',
          category: 'technology',
          coverUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=80',
          duration: '32:15',
          views: '112K views',
          uploadDate: 'Just now',
          creator: 'DevOps Academy',
          creatorVerified: true,
          matchPercentage: 97
        },
        {
          id: `rec-extra-${Date.now()}-2`,
          title: 'Building a Startup from Scratch without VC Capital',
          description: 'A realistic, direct talk with elite bootstrap creators on validating ideas, early pricing, building lean code, and hitting $10K MRR.',
          category: 'ai-picks',
          coverUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
          duration: '21:04',
          views: '45K views',
          uploadDate: '10m ago',
          creator: 'Founder Tales',
          creatorVerified: false,
          matchPercentage: 91
        }
      ];
      setAdditionalVideos(prev => [...prev, ...extra]);
      setIsScrollingMore(false);
      showToast('AI yangi tavsiyalarni yukladi! 🚀');
    }, 1200);
  };

  // --- SEARCH PORTAL RESULTS FILTERING ---
  const hasActiveSearch = Boolean(searchQuery && searchQuery.trim().length > 0);

  const searchFilteredResults = useMemo(() => {
    if (!hasActiveSearch) return [];
    
    // Categorize elements to feel like a high-grade intelligence portal
    const matched = videos;
    const courses = matched.filter(v => v.category === 'learn');
    const lives = matched.filter(v => v.isLive);
    const regular = matched.filter(v => v.category !== 'learn' && !v.isLive);

    return {
      all: matched,
      videos: regular,
      courses: courses,
      live: lives,
      playlists: courses.slice(0, 1) // mock playlists
    };
  }, [videos, hasActiveSearch]);

  const scrollRight = () => {
    const el = document.getElementById('recommended-scroller');
    if (el) el.scrollBy({ left: 340, behavior: 'smooth' });
  };

  const scrollLeft = () => {
    const el = document.getElementById('recommended-scroller');
    if (el) el.scrollBy({ left: -340, behavior: 'smooth' });
  };

  return (
    <div 
      id="home-hub-workspace" 
      className="p-6 md:p-8 space-y-8 overflow-y-auto h-[calc(100vh-4rem)] scrollbar-thin scrollbar-thumb-indigo-950/40 select-none text-left bg-[#05040d]"
    >
      {/* GLOBAL TOAST NOTIFICATION OVERLAY */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            className="fixed top-20 right-8 z-50 bg-[#150f38] border border-[#5241cb]/70 px-4 py-3 rounded-xl flex items-center gap-3 shadow-2xl text-xs max-w-sm font-sans"
          >
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 animate-pulse" />
            <p className="text-gray-100 font-medium">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UPLOAD VIDEO MODAL */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0e0c22] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Upload New Video</h3>
                    <p className="text-xs text-gray-400">Enter YouTube URL or video media link</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    placeholder="e.g. Fullstack Web Development 2026..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Video URL / YouTube Link *
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      required
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                    <Link className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Creator / Author</label>
                    <input
                      type="text"
                      value={newVideoCreator}
                      onChange={(e) => setNewVideoCreator(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Category</label>
                    <select
                      value={newVideoCategory}
                      onChange={(e) => setNewVideoCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#14122d] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="technology">Technology & Code</option>
                      <option value="learn">Education & Courses</option>
                      <option value="ai-picks">AI Picks</option>
                      <option value="cinema">Movies & Cinema</option>
                      <option value="gaming">Gaming</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Short Description</label>
                  <textarea
                    rows={2}
                    value={newVideoDesc}
                    onChange={(e) => setNewVideoDesc(e.target.value)}
                    placeholder="Short summary about the video..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all active:scale-98 mt-2"
                >
                  Save Video & Unlock Tools 🚀
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- EMPTY STATE WHEN NO VIDEOS IN DATABASE --- */}
      {videos.length === 0 && !hasActiveSearch ? (
        <div className="py-12 md:py-20 px-4 max-w-3xl mx-auto flex flex-col items-center justify-center text-center space-y-8">
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur-3xl opacity-25 animate-pulse" />
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#120e30] to-[#0a071d] border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-2xl relative">
              <FolderPlus className="w-12 h-12 text-indigo-400" />
            </div>
          </div>

          <div className="space-y-3 max-w-lg">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              No any videos yet-upload first video to open magic tools!
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Upload your first video to unlock 1080p player, AI summarizer, offline downloads, and magic video tools.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 max-w-md w-full space-y-3 text-left">
            <h4 className="text-xs font-extrabold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Tools unlocked after uploading a video:</span>
            </h4>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1080p Smart Player & Speed Control</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant AI Summary & Key Takeaways</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Offline Video Downloads & Storage</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>SoftView 5-Keypad Tour Panel</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="py-4 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs sm:text-sm shadow-[0_0_35px_rgba(99,102,241,0.4)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Upload First Video</span>
          </button>
        </div>
      ) : (

      /* --- NORMAL VIEW OR SEARCH PORTAL CONDITIONAL ROUTER --- */
      hasActiveSearch ? (
        /* INTERACTIVE SEARCH INSIGHTS PORTAL IF SEARCH IS ACTIVE */
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* AI Intelligence Suggestion Header */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#170e44]/90 via-[#0a071c] to-[#04030d] border border-indigo-500/20">
            <div className="flex items-center gap-3 text-indigo-400 mb-2">
              <Sparkles className="w-5 h-5 animate-spin" />
              <h3 className="text-sm font-extrabold tracking-wider uppercase">AI Search Assistant</h3>
            </div>
            <p className="text-sm text-gray-200">
              Siz buni qidiryapsizmi? (Did you mean): <span className="text-indigo-300 font-bold hover:underline cursor-pointer">React Native Essentials</span> yoki <span className="text-indigo-300 font-bold hover:underline cursor-pointer">Linux Bash Scripting</span>?
            </p>
            <div className="flex flex-wrap gap-2.5 mt-4">
              <span className="text-xs px-3 py-1.5 rounded-xl bg-white/5 text-gray-300 border border-white/5">Qidiruv kaliti: <strong className="text-white">"{searchQuery}"</strong></span>
              <span className="text-xs px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/10">Moslik darajasi: 99.8%</span>
            </div>
          </div>

          {/* Search Category Tabs */}
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            {(['all', 'videos', 'courses', 'live', 'playlists'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSearchCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  searchCategory === cat 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchFilteredResults[searchCategory]?.map((video) => (
              <div 
                key={video.id}
                className="bg-[#110e28]/40 border border-[#231b52]/30 p-3 rounded-2xl flex flex-col justify-between group hover:border-purple-500/40 hover:bg-[#110e28]/60 transition-all duration-300"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-purple-950/20">
                  <img src={video.coverUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute bottom-2 right-2 text-[10px] font-mono font-bold bg-black/80 px-1.5 py-0.5 rounded text-white">{video.duration}</span>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onPlayVideo(video)}
                      className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
                    >
                      <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3.5 space-y-1.5 text-left flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-white line-clamp-2 leading-snug group-hover:text-purple-400 transition-colors">{video.title}</h4>
                    <p className="text-[11px] text-gray-400 line-clamp-1 mt-1">{video.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-2">
                    <span className="text-[10px] text-gray-400 font-bold">{video.creator}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{video.views}</span>
                  </div>
                </div>
              </div>
            ))}
            {searchFilteredResults[searchCategory]?.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-500 text-xs">
                Ushbu ruknda qidiruv natijalari topilmadi.
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        /* STANDARD PREMIUM HOME PAGE ROADMAP */
        <div className="space-y-8">
          
          {/* ======================================================== */}
          {/* SECTION A: PREMIUM WIDGETS SECTION (BRIEFING, WEEKLY GOAL, SMART RESUME) */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            
            {/* 1. Daily AI Briefing (Span 3 Columns) */}
            <div className="lg:col-span-3 p-6 rounded-2xl bg-gradient-to-br from-[#1b114d] via-[#0b0821] to-[#04030c] border border-indigo-500/25 flex flex-col justify-between relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-2 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Daily AI Briefing</h3>
                </div>
                
                <h2 className="text-lg md:text-xl font-black text-white tracking-tight">{getGreeting()}</h2>
                <p className="text-xs text-gray-300 leading-relaxed font-medium">
                  Bugun biz sizning shaxsiy qiziqishlaringiz tahlilidan kelib chiqib platformada <strong className="text-purple-300 font-bold">14 ta yangi AI videosi</strong>, <strong className="text-indigo-300 font-bold">3 ta React darsi</strong> va <strong className="text-rose-400 font-bold">2 ta jonli efirni</strong> saraladik.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 mt-5 pt-3 border-t border-white/5 relative z-10">
                <button 
                  onClick={() => {
                    setActiveTab('ai-picks');
                    triggerAddXp(15);
                  }}
                  className="px-3.5 py-2 text-[10.5px] font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Picks (+15 XP)</span>
                </button>
                <button 
                  onClick={() => {
                    setActiveTab('learn');
                    triggerAddXp(20);
                  }}
                  className="px-3.5 py-2 text-[10.5px] font-bold rounded-xl bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/20 text-indigo-300 hover:text-white transition-all"
                >
                  <span>Learn Path (+20 XP)</span>
                </button>
                <button 
                  onClick={() => setActiveTab('live')}
                  className="px-3.5 py-2 text-[10.5px] font-bold rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/20 text-rose-300 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  <span>Jonli efirlar</span>
                </button>
              </div>
            </div>

            {/* 2. Weekly Challenge Card (Span 2 Columns) */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#090714] border border-[#1b1932] flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <Flame className="w-4 h-4 animate-bounce" />
                    </div>
                    <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Haftalik Maqsad</span>
                  </div>
                  <span className="text-[11px] text-purple-300 font-bold bg-purple-950/30 px-2 py-0.5 rounded-lg border border-purple-500/10">+500 XP</span>
                </div>

                <div className="text-left">
                  <h4 className="text-sm font-extrabold text-white">Programming tomosha qilish</h4>
                  <p className="text-[11.5px] text-gray-400 mt-1">Ushbu haftada jami 5 soatlik darslik va texnik loyihalarni tomosha qiling.</p>
                </div>

                {/* Progress bar stateful container */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                    <span>Progress:</span>
                    <span className="text-amber-400 font-mono">{challengeProgress} / 5.0 soat</span>
                  </div>
                  <div className="w-full bg-[#1b1544]/30 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-amber-500 via-orange-500 to-purple-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${(challengeProgress / 5.0) * 100}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Stateful interactive claim panel */}
              <div className="mt-4 flex gap-2">
                {isChallengeClaimed ? (
                  <div className="w-full py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center text-[11px] font-bold flex items-center justify-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Muvaffaqiyatli topshirildi</span>
                  </div>
                ) : challengeProgress >= 5.0 ? (
                  <button 
                    onClick={handleClaimChallenge}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all active:scale-95 shadow-lg shadow-purple-950/20 animate-pulse"
                  >
                    Claim 500 XP Reward! 🏆
                  </button>
                ) : (
                  <button 
                    onClick={handleSimulateStudy}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition-all"
                  >
                    Simulate 1 Hour Study (+0.6h)
                  </button>
                )}
              </div>
            </div>

            {/* 3. Smart Resume (Span 1 Column) */}
            <div className="lg:col-span-1 p-5 rounded-2xl bg-[#090714] border border-[#1b1932] flex flex-col justify-between relative group">
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-gray-400">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Smart Resume</span>
                </div>
                <span className="inline-block text-[9.5px] font-extrabold text-indigo-300 bg-indigo-950/40 border border-indigo-500/15 px-2 py-0.5 rounded">
                  {continueWatchingVideo ? 'Faqat 4 daqiqa qoldi!' : 'Kutubxona bo\'sh'}
                </span>
                <h5 className="text-xs font-bold text-white line-clamp-2 leading-snug mt-1.5">
                  {continueWatchingVideo?.title || 'Video darsliklar topilmadi'}
                </h5>
              </div>

              <div className="mt-4 space-y-2">
                {continueWatchingVideo ? (
                  <button 
                    onClick={() => onPlayVideo(continueWatchingVideo)}
                    className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                    <span>Resume</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setActiveTab('library')}
                    className="w-full py-2 rounded-xl bg-indigo-600/50 hover:bg-indigo-500 text-white text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1"
                  >
                    <span>+ Video Qo'shish</span>
                  </button>
                )}
                <button 
                  onClick={handleSmartResumeCompleted}
                  className="w-full py-1.5 rounded-xl bg-[#1b1544]/10 hover:bg-[#1b1544]/30 text-[10px] text-gray-400 hover:text-white transition-all font-medium"
                >
                  Mark Done (+120 XP)
                </button>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* SECTION B: CORE 4 HUBS ROW (STATEFUL CONTINUED & AI REANALYSIS) */}
          {/* ======================================================== */}
          <div id="top-four-hubs-grid" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {/* Hub 1: Continue Watching */}
            <div id="hub-continue-watching" className="bg-[#110e28]/50 border border-[#231b52]/40 rounded-2xl p-4.5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-500/10 border border-purple-500/15 rounded-xl text-purple-400">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">Continue Watching</h4>
                    <p className="text-[10px] text-gray-400">Pick up where you left off</p>
                  </div>
                </div>
              </div>

              {continueWatchingVideo ? (
                <div className="relative group aspect-video rounded-xl overflow-hidden border border-[#2a245a]/50">
                  <img
                    src={continueWatchingVideo.coverUrl}
                    alt={continueWatchingVideo.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                    <button
                      onClick={() => onPlayVideo(continueWatchingVideo)}
                      className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all transform group-hover:scale-110 active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-3 right-3 text-left">
                    <h5 className="text-[11px] font-bold text-white truncate">{continueWatchingVideo.title}</h5>
                  </div>
                </div>
              ) : (
                <div className="aspect-video rounded-xl bg-[#130f33]/40 border border-dashed border-purple-500/20 p-4 flex flex-col items-center justify-center text-center">
                  <p className="text-[11px] text-gray-400 font-medium">Baza bo'sh. Demo videolar olib tashlangan.</p>
                  <button 
                    onClick={() => setActiveTab('library')} 
                    className="mt-2 text-[10px] font-bold text-purple-400 hover:underline"
                  >
                    + Yangi video qo'shish
                  </button>
                </div>
              )}

              {/* Controls Grid */}
              <div className="mt-3.5 space-y-2">
                <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold">
                  <span>Resume from 30:15</span>
                  <span className="text-purple-400">42%</span>
                </div>
                <div className="w-full bg-[#1b1544]/60 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full" style={{ width: '42%' }} />
                </div>
                
                {/* State Controls */}
                <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-white/5">
                  <button 
                    onClick={() => {
                      showToast('Video darslik boshidan boshlanmoqda...');
                      onPlayVideo({ ...continueWatchingVideo, progress: 0 });
                    }}
                    className="text-[9px] font-bold text-gray-400 hover:text-white py-1 bg-white/5 hover:bg-white/10 rounded-lg text-center transition-colors"
                  >
                    Restart
                  </button>
                  <button 
                    onClick={() => {
                      showToast('Ushbu video tomosha qilish tarixidan o\'chirildi.');
                    }}
                    className="text-[9px] font-bold text-gray-400 hover:text-red-400 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-center transition-colors"
                  >
                    Clear
                  </button>
                  <button 
                    onClick={() => {
                      showToast('MacBook-dagi oqim iPad Air-ga muvaffaqiyatli uzatildi! 📱');
                    }}
                    className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 py-1 bg-indigo-500/5 hover:bg-indigo-500/10 rounded-lg text-center transition-colors truncate"
                    title="iPad-ga yo'naltirish"
                  >
                    iPad
                  </button>
                </div>
              </div>
            </div>

            {/* Hub 2: AI Picks For You */}
            <div id="hub-ai-picks" className="bg-[#110e28]/50 border border-[#231b52]/40 rounded-2xl p-4.5 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 border border-blue-500/15 rounded-xl text-blue-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">AI Picks For You</h4>
                    <p className="text-[10px] text-gray-400">Custom matching index</p>
                  </div>
                </div>
                <button 
                  onClick={triggerReanalysis}
                  disabled={isReanalyzing}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                  title="Re-analyze Interests"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isReanalyzing ? 'animate-spin text-purple-400' : ''}`} />
                </button>
              </div>

              {/* Animated Reanalyzing State Display */}
              <AnimatePresence mode="wait">
                {isReanalyzing ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="aspect-video bg-[#0c0920] border border-indigo-500/20 rounded-xl p-3 flex flex-col justify-center items-center text-center space-y-2.5"
                  >
                    <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
                    <div className="space-y-1">
                      <span className="block text-[10px] font-extrabold text-purple-400 uppercase tracking-widest animate-pulse">Running AI Model</span>
                      <span className="block text-[9px] text-gray-400 font-medium leading-relaxed font-mono px-2">
                        {analysisStatements[reanalysisStep]}
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2"
                  >
                    {/* Render first AI Pick from stateful list with calculated Match Index */}
                    {aiPickList.length > 0 && (
                      <div className="relative group aspect-video rounded-xl overflow-hidden border border-[#2a245a]/50">
                        <img
                          src={aiPickList[0].coverUrl}
                          alt={aiPickList[0].title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                          <button
                            onClick={() => onPlayVideo(aiPickList[0])}
                            className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all"
                          >
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </button>
                        </div>
                        <span className="absolute top-2 left-2 text-[9px] font-extrabold px-2 py-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded shadow-lg">
                          {aiPickList[0].matchPercentage || 98}% Match
                        </span>
                        <div className="absolute bottom-2 left-3 text-left">
                          <h5 className="text-[11px] font-bold text-white truncate">{aiPickList[0].title}</h5>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setActiveTab('ai-picks')}
                className="w-full mt-3.5 py-1.5 bg-[#1b1544]/40 hover:bg-[#1b1544]/80 text-[10px] text-purple-300 font-bold rounded-xl border border-purple-500/15 text-center transition-colors flex items-center justify-center gap-1"
              >
                <span>Qiziqishlarni o'rganish</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Hub 3: Learning Path */}
            <div id="hub-learning-path" className="bg-[#110e28]/50 border border-[#231b52]/40 rounded-2xl p-4.5 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/15 rounded-xl text-indigo-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">Learning Path</h4>
                  <p className="text-[10px] text-gray-400">Progress: Frontend (32%)</p>
                </div>
              </div>

              {/* Progressive Roadmap Steps */}
              <div className="bg-[#1a1542]/20 border border-[#2a245a]/50 rounded-xl p-3 text-left space-y-2.5">
                <div className="flex items-center justify-between text-[10px] border-b border-white/5 pb-1.5">
                  <span className="text-gray-400 font-medium">Roadmap Stage</span>
                  <span className="text-indigo-400 font-bold">Step 3 of 6</span>
                </div>
                
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-medium text-[11px]">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="line-through text-gray-500">1. HTML & CSS Basics</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 font-medium text-[11px]">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="line-through text-gray-500">2. JavaScript Core Fundamentals</span>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-300 font-bold text-[11px]">
                    <span className="w-3.5 h-3.5 rounded bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-[8px] font-black text-indigo-300">★</span>
                    <span>3. React Components & Hooks</span>
                  </div>
                </div>
              </div>

              {/* Recommendation trigger box */}
              <div className="mt-3 bg-indigo-950/20 border border-indigo-500/10 rounded-xl p-2.5 text-left text-[10px]">
                <span className="text-indigo-400 font-bold block mb-0.5">AI Tavsiyasi:</span>
                <p className="text-gray-300 leading-normal">Navbatdagi dars: <strong className="text-white hover:underline cursor-pointer" onClick={() => setActiveTab('learn')}>State management darsligi (+50 XP)</strong></p>
              </div>
            </div>

            {/* Hub 4: Live Now */}
            <div id="hub-live-now" className="bg-[#110e28]/50 border border-[#231b52]/40 rounded-2xl p-4.5 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-red-500/10 border border-red-500/15 rounded-xl text-red-500">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">Live Now</h4>
                  <p className="text-[10px] text-gray-400">Join live conversations</p>
                </div>
              </div>

              {liveVideo ? (
                <div className="relative group aspect-video rounded-xl overflow-hidden border border-[#ef4444]/20">
                  <img
                    src={liveVideo.coverUrl}
                    alt={liveVideo.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-red-600 rounded-md text-white text-[8px] font-extrabold uppercase tracking-wider shadow">
                    <Radio className="w-2.5 h-2.5" />
                    Live
                  </span>
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-white text-[8.5px] font-mono font-bold tracking-tight">
                    {liveViewerCount.toLocaleString()} tomoshabin
                  </span>
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                    <button
                      onClick={() => setActiveTab('live')}
                      className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all transform group-hover:scale-110 active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-3 right-3 text-left">
                    <h5 className="text-[11px] font-bold text-white truncate">{liveVideo.title}</h5>
                  </div>
                </div>
              ) : (
                <div className="aspect-video rounded-xl bg-[#1a0f1d]/40 border border-dashed border-red-500/20 p-4 flex flex-col items-center justify-center text-center">
                  <p className="text-[11px] text-gray-400 font-medium">Faol jonli efir yo'q.</p>
                  <button 
                    onClick={() => setActiveTab('live')} 
                    className="mt-2 text-[10px] font-bold text-rose-400 hover:underline"
                  >
                    Efir rejasini ko'rish
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mt-3.5">
                <span className="text-[10px] text-gray-400 font-semibold truncate max-w-[130px]">
                  Mavzu: {liveVideo?.creator || 'SoftView Live'}
                </span>
                <button
                  onClick={() => setActiveTab('live')}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-xl text-white text-[10px] font-bold transition-all active:scale-95 shadow-md shadow-red-950/20"
                >
                  Join Live
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION C: RECOMMANDED GRID WITH COMPREHENSIVE FILTER TAGS */}
          {/* ======================================================== */}
          <div id="recommended-section" className="space-y-5 text-left relative pt-4">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <h2 className="text-lg font-black text-white tracking-tight">Recommended for you</h2>
                <p className="text-xs text-gray-400 mt-0.5">Sizning qiziqishlaringiz, like va tomosha qilish tarixingizga moslangan.</p>
              </div>
              
              {/* Category Filters row */}
              <div className="flex flex-wrap items-center gap-1.5">
                {['All', 'AI', 'React', 'Technology', 'Gaming', 'Cinema'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveFilterTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                      activeFilterTag === tag
                        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                        : 'bg-[#110e28]/40 text-gray-400 border border-transparent hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('discover')}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors pr-2"
                >
                  Hammasi &rarr;
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={scrollLeft}
                    className="p-1.5 bg-[#110e28] hover:bg-[#1a153a] border border-[#2c245c]/50 text-gray-400 hover:text-white rounded-lg transition-all active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={scrollRight}
                    className="p-1.5 bg-[#110e28] hover:bg-[#1a153a] border border-[#2c245c]/50 text-gray-400 hover:text-white rounded-lg transition-all active:scale-95"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scroll/Grid layout */}
            <div
              id="recommended-scroller"
              className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-none pr-6"
            >
              {recommendedVideos.map((video) => (
                <div
                  key={video.id}
                  className="w-72 shrink-0 snap-start bg-[#110e28]/30 hover:bg-[#110e28]/70 border border-[#231b52]/35 hover:border-purple-500/40 p-4.5 rounded-2xl transition-all duration-300 group flex flex-col justify-between relative"
                >
                  {/* Thumbnail Card with Hover actions */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-purple-950/20 border border-[#2a245a]/50">
                    <img
                      src={video.coverUrl}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute bottom-2 right-2 text-[9px] px-1 bg-black/80 rounded font-mono text-white font-bold">
                      {video.duration}
                    </span>
                    
                    {/* Floating Match index for simulated recommender system */}
                    {video.matchPercentage && (
                      <span className="absolute top-2 left-2 text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-purple-900/80 border border-purple-500/20 text-purple-200">
                        {video.matchPercentage}% AI Score
                      </span>
                    )}

                    {/* Interactive hover overlay */}
                    <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-3.5 transition-all duration-300">
                      
                      {/* Top quick bookmark button */}
                      <div className="flex items-center justify-between">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveVideo(video.id);
                          }}
                          className={`p-1.5 rounded-lg bg-black/60 border hover:scale-105 active:scale-95 transition-transform ${
                            savedVideoIds.includes(video.id) ? 'border-purple-500 text-purple-400' : 'border-white/10 text-white'
                          }`}
                          title="Save to Library"
                        >
                          <FolderPlus className="w-3.5 h-3.5" />
                        </button>
                        
                        {/* More vertical dot menu trigger */}
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdownId(activeDropdownId === video.id ? null : video.id);
                            }}
                            className="p-1.5 rounded-lg bg-black/60 border border-white/10 text-white hover:scale-105 active:scale-95 transition-transform"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {/* Dropdown Menu Overlay */}
                          <AnimatePresence>
                            {activeDropdownId === video.id && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 mt-1.5 w-44 bg-[#0a0718] border border-purple-500/25 rounded-xl py-1.5 shadow-2xl z-20 text-left font-sans"
                              >
                                <button 
                                  onClick={() => showAISummary(video)}
                                  className="w-full px-3 py-2 text-[11px] font-bold text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                                >
                                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>📄 AI Video Summary</span>
                                </button>
                                <button 
                                  onClick={() => startSmartDownload(video.id)}
                                  className="w-full px-3 py-2 text-[11px] font-bold text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                                >
                                  <Download className="w-3.5 h-3.5 text-purple-400" />
                                  <span>⬇ Download Offline</span>
                                </button>
                                <button 
                                  onClick={() => dismissVideo(video.id)}
                                  className="w-full px-3 py-2 text-[11px] font-bold text-gray-300 hover:text-red-400 hover:bg-red-500/5 flex items-center gap-2 border-t border-white/5"
                                >
                                  <X className="w-3.5 h-3.5 text-red-500" />
                                  <span>❌ Not Interested</span>
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Center big Play button */}
                      <div className="flex justify-center items-center">
                        <button
                          onClick={() => onPlayVideo(video)}
                          className="p-3 bg-purple-600 hover:bg-purple-500 rounded-full text-white transform hover:scale-115 active:scale-90 transition-all shadow-xl shadow-purple-950/40"
                        >
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </button>
                      </div>

                      {/* Bottom Quick Like */}
                      <div className="flex justify-start">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLikeVideo(video.id);
                          }}
                          className={`p-1.5 rounded-lg bg-black/60 border hover:scale-105 active:scale-95 transition-transform ${
                            likedVideoIds.includes(video.id) ? 'border-rose-500 text-rose-500' : 'border-white/10 text-white'
                          }`}
                          title="Like Video"
                        >
                          <Heart className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Text Metadata */}
                  <div className="mt-3.5 space-y-1 text-left flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-white text-xs leading-snug group-hover:text-purple-400 transition-colors line-clamp-2">
                        {video.title}
                      </h4>
                      <p className="text-[10.5px] text-gray-400 line-clamp-1 mt-1 font-medium">{video.description}</p>
                    </div>

                    {/* Simulating active download progress inside card */}
                    {downloadingId === video.id && (
                      <div className="mt-2.5 p-1 bg-purple-950/10 border border-purple-500/10 rounded-lg">
                        <div className="flex justify-between items-center text-[8.5px] font-bold text-gray-400 mb-1">
                          <span>Downloading offline...</span>
                          <span>{downloadProgress}%</span>
                        </div>
                        <div className="w-full bg-[#1b1544]/30 h-1 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full rounded-full transition-all duration-300" style={{ width: `${downloadProgress}%` }} />
                        </div>
                      </div>
                    )}

                    {downloadedIds.includes(video.id) && (
                      <div className="mt-2 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 py-0.5 px-2 rounded-lg inline-flex items-center gap-1 max-w-max">
                        <Check className="w-3 h-3" />
                        <span>Saved Offline</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2.5 border-t border-[#231b52]/30 mt-2.5">
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold truncate max-w-[140px]">
                        <span>{video.creator}</span>
                        {video.creatorVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/5 shrink-0" />}
                      </div>
                      <span className="text-[9.5px] text-gray-500 font-mono shrink-0">{video.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Infinite scroll action triggers */}
            <div className="pt-6 text-center border-t border-white/5">
              <button 
                onClick={handleLoadMore}
                disabled={isScrollingMore}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 hover:from-purple-600/25 hover:to-indigo-600/25 border border-purple-500/20 hover:border-purple-500/40 rounded-xl text-purple-300 font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isScrollingMore ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>AI is loading tailored recommendations...</span>
                  </>
                ) : (
                  <>
                    <span>Load More Recommendations (AI Infinite Scroll)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

          </div>

          {/* ======================================================== */}
          {/* SECTION D: AI ENGINE MONITOR TERMINAL (SLOT INDENTATION) */}
          {/* ======================================================== */}
          <div className="p-6 rounded-2xl bg-[#080614] border border-[#201a45]/30 mt-8 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-purple-400 animate-spin" />
                  <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Active AI Engine Diagnostics</h3>
                </div>
                <h4 className="text-sm font-black text-white">SoftCast Machine Learning Agent Modules</h4>
                <p className="text-[11.5px] text-gray-400">These server-side ML pipelines track, analyze, and optimize your overall watch and study loops.</p>
              </div>

              {/* Status active banner */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold rounded-full max-w-max">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All pipelines calibrated and active</span>
              </span>
            </div>

            {/* Grid of AI modules */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { name: 'Recommendation AI', desc: 'Predicts favorite tags' },
                { name: 'Learning AI', desc: 'Maps technical roadmap' },
                { name: 'Trend AI', desc: 'Locates hot live events' },
                { name: 'Interest AI', desc: 'Scores content matches' },
                { name: 'Smart Search AI', desc: 'Recommends correct syntax' },
                { name: 'Watch Pattern AI', desc: 'Saves exact timestamp' },
                { name: 'Language AI', desc: 'Tracks preferred dialects' },
                { name: 'Smart Download AI', desc: 'Pre-caches next lessons' },
              ].map((mod, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-purple-950/5 border border-[#211a45] hover:border-purple-500/35 transition-colors">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-bold text-white truncate">{mod.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium font-mono block">{mod.desc}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      ))}

      {/* PREVIEW VERSION BADGE */}
      <div className="mt-12 mb-6 pt-6 border-t border-white/5 flex flex-col items-center justify-center text-center space-y-2 max-w-xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold tracking-wide shadow-sm">
          <span>🚧 Preview Version</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed max-w-md">
          SoftView is currently in active development. Features, design, and functionality may change as we continue building the platform.
        </p>
      </div>

      {/* ======================================================== */}
      {/* OVERLAY MODAL: EXECUTIVE AI SUMMARIZATION */}
      {/* ======================================================== */}
      <AnimatePresence>
        {activeSummaryVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              onClick={() => setActiveSummaryVideo(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#0e0a24] border border-[#2b245c] rounded-2xl p-6 shadow-2xl text-left space-y-6 z-10"
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span>AI Video Summarizer Engine</span>
                </h3>
                <button onClick={() => setActiveSummaryVideo(null)} className="text-gray-400 hover:text-white transition-all cursor-pointer">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-20 aspect-video rounded-lg overflow-hidden shrink-0 border border-white/5">
                    <img src={activeSummaryVideo.coverUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-white line-clamp-1">{activeSummaryVideo.title}</h4>
                    <span className="text-[10px] text-indigo-400">Yaratuvchi: {activeSummaryVideo.creator}</span>
                  </div>
                </div>

                {/* AI Bullets */}
                <div className="space-y-3 bg-[#05040d]/80 p-4.5 rounded-xl border border-[#201a45]">
                  <h5 className="text-[10.5px] font-extrabold text-purple-400 uppercase tracking-wider mb-2">Asosiy Texnik Xulosalar (Executive Summary):</h5>
                  <ul className="space-y-2.5 text-xs text-gray-300 list-disc pl-4.5 leading-relaxed font-medium">
                    <li>
                      <strong className="text-white">Arxitektura tahlili:</strong> Ushbu video darsda asosiy e'tibor bugungi kunda qo'llanilayotgan yuqori darajada samarali va barqaror tizimli yechimlarni loyihalashga qaratilgan.
                    </li>
                    <li>
                      <strong className="text-white">Amaliy ko'nikmalar:</strong> Ishlab chiquvchilar uchun eng yaxshi amaliyotlar (Best Practices) va dasturiy ta'minotni integratsiya qilish jarayonidagi xatoliklarni bartaraf etish usullari ko'rsatilgan.
                    </li>
                    <li>
                      <strong className="text-white">AI tavsiyasi:</strong> Olingan nazariy bilimlarni mustahkamlash uchun dars yakunidagi test sinovlaridan o'tish va platformadagi shaxsiy amaliy laboratoriya ishini bajarish tavsiya etiladi.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2 border-t border-white/5">
                <button 
                  onClick={() => setActiveSummaryVideo(null)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl transition-all"
                >
                  Yopish (Close)
                </button>
                <button 
                  onClick={() => {
                    onPlayVideo(activeSummaryVideo);
                    setActiveSummaryVideo(null);
                  }}
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  <span>Darsni ko'rish</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
