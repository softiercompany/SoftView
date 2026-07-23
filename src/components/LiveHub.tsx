import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, Users, CheckCircle2, Flame, Cpu, GraduationCap, Music, Briefcase, 
  Heart, Globe, Calendar, ChevronLeft, ChevronRight, Play, Volume2, VolumeX, 
  Settings, Maximize, Bell, Plus, Search, Compass, Sparkles, Clock, Check, 
  Gamepad2, ArrowRight, Info, AlertCircle, Bot, Send, MessageSquare, ThumbsUp, 
  DollarSign, Video, ShieldCheck, Share2, HelpCircle, FileText, Layers, Scissors, 
  History, Lock, RefreshCw, X, SlidersHorizontal, UserPlus
} from 'lucide-react';
import { Video as VideoType } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface LiveHubProps {
  videos?: VideoType[];
  onAddXp: (amount: number) => void;
  onPlayVideo?: (video: VideoType) => void;
  isPremium?: boolean;
}

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  isSuperMsg?: boolean;
  amount?: string;
  tier?: 'highlighted' | 'pinned' | 'voice' | 'sticker';
  isModerated?: boolean;
}

interface Question {
  id: string;
  user: string;
  question: string;
  upvotes: number;
  hasUpvoted: boolean;
  isAnswered: boolean;
}

export default function LiveHub({ videos = [], onAddXp, onPlayVideo, isPremium = false }: LiveHubProps) {
  // Global Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // State for search and category filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [followedStreamers, setFollowedStreamers] = useState<Record<string, boolean>>({
    'CodeLab': true
  });
  const [reminders, setReminders] = useState<Record<string, boolean>>({});

  // Active Live Player Modal / Drawer State
  const [selectedStreamForPlayer, setSelectedStreamForPlayer] = useState<any | null>(null);
  const [streamQuality, setStreamQuality] = useState<'Auto' | '1080p' | '720p' | '480p'>('1080p');
  const [chatMode, setChatMode] = useState<'Everyone' | 'Subscribers' | 'Members' | 'AI Moderated'>('AI Moderated');
  const [isMultiGuestView, setIsMultiGuestView] = useState(false);

  // Live Player Interactive Modules
  const [playerTab, setPlayerTab] = useState<'chat' | 'qna' | 'ai_summary' | 'notes' | 'polls'>('chat');
  const [liveStreamLikes, setLiveStreamLikes] = useState(4280);
  const [hasLikedLive, setHasLikedLive] = useState(false);

  // Reactions Animation Counters
  const [reactionCounts, setReactionCounts] = useState({
    like: 1240,
    fire: 890,
    clap: 450,
    rocket: 670,
    wow: 310
  });

  // Floating Particles
  const [floatingParticles, setFloatingParticles] = useState<{ id: string; emoji: string; left: number }[]>([]);

  const triggerReaction = (emoji: string, key: keyof typeof reactionCounts) => {
    setReactionCounts(prev => ({ ...prev, [key]: prev[key] + 1 }));
    const id = Date.now().toString() + Math.random();
    const left = Math.floor(Math.random() * 80) + 10;
    setFloatingParticles(prev => [...prev.slice(-15), { id, emoji, left }]);
    setTimeout(() => {
      setFloatingParticles(prev => prev.filter(p => p.id !== id));
    }, 2000);
  };

  // Live Chat System
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'm1', user: 'DevSardor', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop', text: 'Hey everyone! Excited for today’s Next.js and AI deployment session!', time: '15:02' },
    { id: 'm2', user: 'Elena_K', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop', text: 'Is the WebSocket setup covered in this live?', time: '15:03' },
    { id: 'm3', user: 'TechPro99', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop', text: 'FREE BITCOIN GIVEAWAY CLICK HERE', time: '15:04', isModerated: true },
    { id: 'm4', user: 'Bobur_Uz', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop', text: '🚀 Super Message: SoftCast Live player is blazing fast!', time: '15:05', isSuperMsg: true, amount: '$10.00', tier: 'pinned' }
  ]);

  // Super Message / Donation Modal State
  const [isSuperMsgOpen, setIsSuperMsgOpen] = useState(false);
  const [superMsgAmount, setSuperMsgAmount] = useState('5.00');
  const [superMsgText, setSuperMsgText] = useState('');

  // Live Q&A System
  const [questionsList, setQuestionsList] = useState<Question[]>([
    { id: 'q1', user: 'Malika_Dev', question: 'How do you handle real-time database schema migrations without downtime?', upvotes: 24, hasUpvoted: false, isAnswered: true },
    { id: 'q2', user: 'Rustacean_X', question: 'What is the performance difference between Actix-web and Express for 50k concurrent WebSockets?', upvotes: 18, hasUpvoted: false, isAnswered: false },
    { id: 'q3', user: 'Javohir_88', question: 'Will you share the GitHub repository link after the live stream finishes?', upvotes: 12, hasUpvoted: false, isAnswered: false }
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');

  // Live Poll System
  const [livePoll, setLivePoll] = useState({
    id: 'p1',
    question: 'Which backend stack should we deploy for the upcoming microservice?',
    options: [
      { id: 'opt1', text: 'Node.js (Express / Fastify)', votes: 142 },
      { id: 'opt2', text: 'Go (Gin / Fiber)', votes: 215 },
      { id: 'opt3', text: 'Rust (Actix / Axum)', votes: 98 }
    ],
    userVotedOptionId: null as string | null
  });

  // Live AI Translator State
  const [targetLang, setTargetLang] = useState<'Uzbek' | 'Russian' | 'Spanish'>('Uzbek');
  const [liveTranslation, setLiveTranslation] = useState<string>('Translyatsiya nutqi uzbek tiliga avtomatik tarjima qilinmoqda...');
  const [isTranslating, setIsTranslating] = useState(false);

  // Live AI Summary & Notes State
  const [aiLiveSummary, setAiLiveSummary] = useState<string | null>(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiNotes, setAiNotes] = useState<string | null>(null);
  const [aiNotesLoading, setAiNotesLoading] = useState(false);

  // AI Assistant Drawer / Input State
  const [aiAssistantPrompt, setAiAssistantPrompt] = useState('');
  const [aiAssistantReply, setAiAssistantReply] = useState<string | null>(null);
  const [aiAssistantLoading, setAiAssistantLoading] = useState(false);

  // Creator Live Studio Modal State
  const [isCreatorStudioOpen, setIsCreatorStudioOpen] = useState(false);
  const [isStreamLiveNow, setIsStreamLiveNow] = useState(false);
  const [studioStreamTitle, setStudioStreamTitle] = useState('Building Next-Gen Full-Stack Apps in Uzbek');
  const [studioCategory, setStudioCategory] = useState('technology');

  // Recently Watched / Live History Drawer State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [liveHistory] = useState([
    { id: 'hist-1', title: 'React 19 Server Actions Deep Dive', creator: 'DevMaster', date: 'Yesterday', duration: '1:45:20', views: '14.2K' },
    { id: 'hist-2', title: 'Cybersecurity Threat Analysis 2026', creator: 'CyberSecPro', date: '3 days ago', duration: '2:12:00', views: '9.8K' },
    { id: 'hist-3', title: 'Building SaaS in Public (Day 11)', creator: 'CodeLab', date: '5 days ago', duration: '3:05:40', views: '22.1K' }
  ]);

  // Spotlight streams
  const featuredSpotlights = [
    {
      id: 'feat-1',
      title: 'Building SaaS in Public (Day 12)',
      description: 'Building a real-time analytics dashboard with Next.js & Supabase.',
      creator: 'CodeLab',
      category: 'technology',
      views: '12.4K',
      viewerVelocity: '+534 last 5 min',
      subtext: 'Tech • Software Development',
      coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop',
      video: {
        id: 'live-feat-1',
        title: 'Building SaaS in Public (Day 12) - SoftCast Live',
        description: 'Building a real-time analytics dashboard with Next.js & Supabase.',
        category: 'live' as const,
        coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop',
        duration: 'LIVE',
        views: '12.4K watching',
        uploadDate: 'Started 2 hours ago',
        creator: 'CodeLab',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/Way9Dexny3w'
      }
    },
    {
      id: 'feat-2',
      title: 'AI Revolution & Advanced Agentic Design',
      description: 'Deep-dive into building custom routing agents with Gemini models and WebSockets.',
      creator: 'AIArchitect',
      category: 'technology',
      views: '8.2K',
      viewerVelocity: '+312 last 5 min',
      subtext: 'Tech • Artificial Intelligence',
      coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
      video: {
        id: 'live-feat-2',
        title: 'AI Revolution & Advanced Agentic Design - SoftCast Live',
        description: 'Deep-dive into building custom routing agents with Gemini models and WebSockets.',
        category: 'live' as const,
        coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
        duration: 'LIVE',
        views: '8.2K watching',
        uploadDate: 'Started 1 hour ago',
        creator: 'AIArchitect',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY'
      }
    },
    {
      id: 'feat-3',
      title: 'Full-Stack Rust Web Development Masterclass',
      description: 'Writing blazingly fast APIs using Actix-web and SQLx with complete safety.',
      creator: 'Rustacean',
      category: 'technology',
      views: '5.6K',
      viewerVelocity: '+189 last 5 min',
      subtext: 'Tech • System Programming',
      coverUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop',
      video: {
        id: 'live-feat-3',
        title: 'Full-Stack Rust Web Development Masterclass - SoftCast Live',
        description: 'Writing blazingly fast APIs using Actix-web and SQLx with complete safety.',
        category: 'live' as const,
        coverUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop',
        duration: 'LIVE',
        views: '5.6K watching',
        uploadDate: 'Started 30 mins ago',
        creator: 'Rustacean',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E'
      }
    }
  ];

  const secondaryLiveStreams = [
    {
      id: 'sec-1',
      title: 'React Q&A Session',
      creator: 'DevMaster',
      category: 'technology',
      views: '4.8K',
      coverUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&auto=format&fit=crop',
      video: {
        id: 'live-sec-1',
        title: 'React Q&A Session - SoftCast Live',
        description: 'Answering all your burning React, Next.js, and compiler optimization questions live.',
        category: 'live' as const,
        coverUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop',
        duration: 'LIVE',
        views: '4.8K watching',
        uploadDate: 'Started 4 hours ago',
        creator: 'DevMaster',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/YoHD9XEInc0'
      }
    },
    {
      id: 'sec-2',
      title: 'Cybersecurity Threats in 2026',
      creator: 'CyberSecPro',
      category: 'technology',
      views: '3.1K',
      coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&auto=format&fit=crop',
      video: {
        id: 'live-sec-2',
        title: 'Cybersecurity Threats in 2026 - SoftCast Live',
        description: 'Analyzing real-world zero-day threats, mitigation tactics, and penetration strategies live.',
        category: 'live' as const,
        coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop',
        duration: 'LIVE',
        views: '3.1K watching',
        uploadDate: 'Started 2 hours ago',
        creator: 'CyberSecPro',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/s7EgWkyY_lU'
      }
    },
    {
      id: 'sec-3',
      title: 'Lo-Fi Beats Live Radio 24/7',
      creator: 'LoFi Girl',
      category: 'music',
      views: '11.2K',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop',
      video: {
        id: 'live-sec-3',
        title: 'Lo-Fi Beats Live Radio 24/7 - SoftCast Live',
        description: 'Relaxing, ambient lo-fi beats perfect for studying, working, or coding safely.',
        category: 'live' as const,
        coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop',
        duration: 'LIVE',
        views: '11.2K watching',
        uploadDate: '24/7 Stream',
        creator: 'LoFi Girl',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk'
      }
    }
  ];

  // Browse categories with AI categories
  const categoriesList = [
    { id: 'all', name: 'All Live', count: 32, icon: Radio },
    { id: 'ai_coding', name: '🔥 AI Coding Streams', count: 14, icon: Bot },
    { id: 'robotics', name: '🤖 Robotics Live', count: 6, icon: Cpu },
    { id: 'startups', name: '🚀 Startup Building', count: 9, icon: Flame },
    { id: 'gaming', name: 'Gaming', count: 12, icon: Gamepad2 },
    { id: 'technology', name: 'Technology', count: 8, icon: Cpu },
    { id: 'education', name: 'Education', count: 5, icon: GraduationCap },
    { id: 'music', name: 'Music', count: 4, icon: Music },
    { id: 'business', name: 'Business', count: 3, icon: Briefcase }
  ];

  // Following Live Now
  const followingLiveNow = [
    {
      id: 'f-1',
      title: 'Coding a Chrome Extension with AI',
      creator: 'JavaScript Mastery',
      creatorVerified: true,
      category: 'technology',
      views: '2.3K',
      coverUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop',
      video: {
        id: 'live-f-1',
        title: 'Coding a Chrome Extension - Live Build',
        description: 'Building a fully featured chrome extension for custom developer workflows from scratch.',
        category: 'live' as const,
        coverUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop',
        duration: 'LIVE',
        views: '2.3K watching',
        uploadDate: 'Started 1 hour ago',
        creator: 'JavaScript Mastery',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY'
      }
    },
    {
      id: 'f-2',
      title: 'Study With Me - Ambient Focus Room',
      creator: 'FocusFlow',
      creatorVerified: true,
      category: 'education',
      views: '1.8K',
      coverUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop',
      video: {
        id: 'live-f-2',
        title: 'Study With Me - Lo-Fi Study Room',
        description: 'Focus blocks with beautiful visual overlays and relaxing music to study alongside thousands of students.',
        category: 'live' as const,
        coverUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
        duration: 'LIVE',
        views: '1.8K watching',
        uploadDate: 'Started 3 hours ago',
        creator: 'FocusFlow',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/s7EgWkyY_lU'
      }
    },
    {
      id: 'f-3',
      title: 'Crypto Market Analysis & Live Trading',
      creator: 'TraderMax',
      creatorVerified: true,
      category: 'business',
      views: '950',
      coverUrl: 'https://images.unsplash.com/photo-1642390091151-246df1db7e01?w=500&auto=format&fit=crop',
      video: {
        id: 'live-f-3',
        title: 'Trading Live: Crypto Market Analysis',
        description: 'Analyzing bitcoin, ethereum, and major tokens during this high-volatility session.',
        category: 'live' as const,
        coverUrl: 'https://images.unsplash.com/photo-1642390091151-246df1db7e01?w=800&auto=format&fit=crop',
        duration: 'LIVE',
        views: '950 watching',
        uploadDate: 'Started 5 hours ago',
        creator: 'TraderMax',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/V75dMMBU2K0'
      }
    }
  ];

  // Explore Live Events
  const exploreLiveEvents = [
    {
      id: 'ev-1',
      date: 'MAY 24',
      time: '16:00',
      title: 'Google I/O 2026 Keynote & AI Models',
      creator: 'Google Developers',
      creatorVerified: true,
      interested: '15K interested',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop'
    },
    {
      id: 'ev-2',
      date: 'MAY 25',
      time: '18:00',
      title: 'Apple WWDC 2026 Keynote',
      creator: 'Apple Developer',
      creatorVerified: true,
      interested: '21K interested',
      imageUrl: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&auto=format&fit=crop'
    },
    {
      id: 'ev-3',
      date: 'MAY 26',
      time: '20:00',
      title: 'The Future of Agentic AI Summit',
      creator: 'AI Summit',
      creatorVerified: true,
      interested: '8.7K interested',
      imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&auto=format&fit=crop'
    }
  ];

  // Live Schedule sidebar
  const liveSchedule = [
    {
      id: 'sch-1',
      time: '15:00',
      status: 'LIVE NOW',
      title: 'Build a SaaS in Public',
      creator: 'CodeLab',
      stat: '12.4K watching',
      coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop'
    },
    {
      id: 'sch-2',
      time: '17:00',
      status: 'UP NEXT',
      title: 'AI Agent Architecture',
      creator: 'AICreator',
      stat: '2.1K waiting',
      coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop'
    },
    {
      id: 'sch-3',
      time: '18:30',
      status: 'SCHEDULED',
      title: 'Design Systems 101',
      creator: 'DesignHub',
      stat: '1.3K waiting',
      coverUrl: 'https://images.unsplash.com/photo-1581291518655-9523c932dedf?w=200&auto=format&fit=crop'
    }
  ];

  // Top Live Streamers
  const topLiveStreamers = [
    { id: 'st-1', rank: 1, name: 'CodeLab', stats: '12.4K watching', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop' },
    { id: 'st-2', rank: 2, name: 'DevMaster', stats: '8.7K watching', avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop' },
    { id: 'st-3', rank: 3, name: 'CyberSecPro', stats: '5.3K watching', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop' },
    { id: 'st-4', rank: 4, name: 'LoFi Girl', stats: '3.2K watching', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop' }
  ];

  // Send Live Chat Message
  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    const text = chatInput.trim();

    // AI Moderation check
    if (text.toLowerCase().includes('free money') || text.toLowerCase().includes('spam') || text.toLowerCase().includes('http')) {
      const modMsg: ChatMessage = {
        id: Date.now().toString(),
        user: 'Aslbek_User',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop',
        text: 'Message removed by AI Moderation (Spam / Suspicious link)',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isModerated: true
      };
      setChatMessages(prev => [...prev, modMsg]);
      setChatInput('');
      showToast('🛡️ Message blocked by SoftCast AI Moderation');
      return;
    }

    const msg: ChatMessage = {
      id: Date.now().toString(),
      user: 'Aslbek_User',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, msg]);
    setChatInput('');
    onAddXp(5);
  };

  // Submit Super Message
  const handleSubmitSuperMsg = () => {
    if (!superMsgText.trim()) return;
    const superMsg: ChatMessage = {
      id: Date.now().toString(),
      user: 'Aslbek_User',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop',
      text: superMsgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSuperMsg: true,
      amount: `$${superMsgAmount}`,
      tier: 'pinned'
    };
    setChatMessages(prev => [...prev, superMsg]);
    setIsSuperMsgOpen(false);
    setSuperMsgText('');
    onAddXp(100);
    showToast(`🚀 Super Message sent ($${superMsgAmount})! Streamer notified!`);
  };

  // Ask Question
  const handleAskQuestion = () => {
    if (!newQuestionText.trim()) return;
    const q: Question = {
      id: Date.now().toString(),
      user: 'Aslbek_User',
      question: newQuestionText.trim(),
      upvotes: 1,
      hasUpvoted: true,
      isAnswered: false
    };
    setQuestionsList(prev => [q, ...prev]);
    setNewQuestionText('');
    showToast('💬 Question submitted to streamer Q&A queue!');
  };

  // Upvote Question
  const toggleUpvoteQuestion = (id: string) => {
    setQuestionsList(prev =>
      prev.map(q => {
        if (q.id === id) {
          const hasUp = !q.hasUpvoted;
          return {
            ...q,
            hasUpvoted: hasUp,
            upvotes: hasUp ? q.upvotes + 1 : q.upvotes - 1
          };
        }
        return q;
      })
    );
  };

  // Vote on Live Poll
  const handleVotePoll = (optionId: string) => {
    if (livePoll.userVotedOptionId) return;
    setLivePoll(prev => ({
      ...prev,
      userVotedOptionId: optionId,
      options: prev.options.map(opt =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      )
    }));
    showToast('📊 Vote submitted! Real-time results updated.');
  };

  // Fetch AI Live Summary
  const handleFetchAiSummary = async () => {
    setAiSummaryLoading(true);
    try {
      const res = await fetch('/api/ai-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'summary', streamTitle: selectedStreamForPlayer?.title })
      });
      const data = await res.json();
      if (data.success) {
        setAiLiveSummary(data.summary);
      }
    } catch (err) {
      setAiLiveSummary(`📌 **Live Summary**:
• **00:00 - 12:30**: Introduction & Architecture Setup
• **12:35 - 28:10**: Building schema & real-time WebSocket server
• **28:10 - 45:20**: Deploying Cloud Run containers
• **45:20 - Live**: Community Q&A session`);
    } finally {
      setAiSummaryLoading(false);
    }
  };

  // Fetch AI Live Notes
  const handleFetchAiNotes = async () => {
    setAiNotesLoading(true);
    try {
      const res = await fetch('/api/ai-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'notes', streamTitle: selectedStreamForPlayer?.title })
      });
      const data = await res.json();
      if (data.success) {
        setAiNotes(data.notes);
      }
    } catch (err) {
      setAiNotes(`📝 **Smart Study Notes**:
1. Keep WebSocket connections multiplexed for performance.
2. Use indexed keys for live queries.
3. Verify environment variables in Cloud deployment.`);
    } finally {
      setAiNotesLoading(false);
    }
  };

  // Run AI Live Translator
  const handleTranslateLive = async (lang: 'Uzbek' | 'Russian' | 'Spanish') => {
    setTargetLang(lang);
    setIsTranslating(true);
    try {
      const res = await fetch('/api/ai-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'translate',
          targetLang: lang,
          prompt: 'In today\'s stream we are building real-time Next.js and Supabase features live.'
        })
      });
      const data = await res.json();
      if (data.success) {
        setLiveTranslation(data.translation);
      }
    } catch (err) {
      setLiveTranslation(`[${lang}] Translyatsiya nutqi uzbek tiliga avtomatik tarjima qilinmoqda...`);
    } finally {
      setIsTranslating(false);
    }
  };

  // Ask AI Live Assistant
  const handleAskAssistant = async () => {
    if (!aiAssistantPrompt.trim()) return;
    setAiAssistantLoading(true);
    try {
      const res = await fetch('/api/ai-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'assistant',
          streamTitle: selectedStreamForPlayer?.title,
          prompt: aiAssistantPrompt
        })
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setAiAssistantReply(data.reply);
      }
    } catch (err) {
      setAiAssistantReply(`🤖 The streamer is currently explaining React server actions with WebSocket push subscriptions.`);
    } finally {
      setAiAssistantLoading(false);
    }
  };

  // AI Clip Generator
  const handleCreateClip = () => {
    showToast('✂️ AI Clip Created! Highlight saved: "45:20 - 46:10 Key Moment Detected"');
  };

  // Follow Streamer
  const handleFollowToggle = (creator: string) => {
    const isNowFollowed = !followedStreamers[creator];
    setFollowedStreamers(prev => ({ ...prev, [creator]: isNowFollowed }));
    showToast(isNowFollowed ? `✅ You are now following ${creator}! +25 XP` : `Unfollowed ${creator}`);
    if (isNowFollowed) onAddXp(25);
  };

  // Remind Event
  const handleRemindToggle = (eventId: string, eventTitle: string) => {
    const isRemindSet = !reminders[eventId];
    setReminders(prev => ({ ...prev, [eventId]: isRemindSet }));
    showToast(isRemindSet ? `🔔 Reminder set for ${eventTitle}! +15 XP` : `Reminder cleared`);
    if (isRemindSet) onAddXp(15);
  };

  const activeSpotlight = featuredSpotlights[activeFeatureIndex] || featuredSpotlights[0];

  return (
    <div 
      id="live-page-main-container" 
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

      <div className="p-6 md:p-8 space-y-8 max-w-[1550px] mx-auto grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN (xl:col-span-3) */}
        <div id="live-page-left-main-section" className="xl:col-span-3 space-y-8">
          
          {/* Header & Control HUD */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-900/20 pb-5">
            <div id="live-header-text" className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 shadow-md">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
                  SoftCast Live
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-950/80 border border-red-500/40 text-red-400">
                    4K Ultra HD
                  </span>
                </h1>
              </div>
              <p className="text-xs md:text-sm text-gray-400 font-medium">Real-time streams, AI moderation, live Q&A, and interactive community chats.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsCreatorStudioOpen(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center gap-1.5 active:scale-95"
              >
                <Video className="w-4 h-4" />
                <span>Creator Live Studio 🎙️</span>
              </button>

              <button
                onClick={() => setIsHistoryOpen(true)}
                className="px-3.5 py-2 bg-[#120f2c] hover:bg-indigo-950/80 border border-[#2b255e] text-indigo-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
              >
                <History className="w-4 h-4 text-indigo-400" />
                <span>Live History 🕒</span>
              </button>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search live streams, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0a0814] border border-[#1b1932] focus:border-indigo-500 text-white placeholder-gray-400 text-xs pl-9 pr-3 py-2 rounded-xl outline-none transition-all shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Section 1: Live Right Now Spotlight */}
          <div id="live-right-now-wrapper" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <h2 className="text-base font-bold text-white tracking-wide">Live Right Now</h2>
                <span className="text-xs text-gray-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full font-semibold">
                  32 live streams active
                </span>
              </div>
            </div>

            {/* Spotlight Banner + Secondary Live list */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              
              {/* Massive highlight banner card */}
              <div 
                className="lg:col-span-2 relative aspect-video rounded-2xl overflow-hidden border border-[#20183f]/60 bg-[#090714] group flex flex-col justify-end p-5 shadow-2xl h-[360px]"
              >
                {/* Background image */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <img 
                    src={activeSpotlight.coverUrl} 
                    alt={activeSpotlight.title} 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-102 transition-transform duration-[10000ms] ease-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030208] via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                </div>

                {/* Badges in top row */}
                <div className="absolute top-4 inset-x-4 flex justify-between items-center z-10 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-red-600 rounded-full text-white text-[9.5px] font-extrabold uppercase tracking-widest animate-pulse shadow-lg shadow-red-900/35">
                      <Radio className="w-3 h-3" />
                      Live
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-[9.5px] font-bold border border-white/5 shadow-lg">
                      <Users className="w-3 h-3 text-red-400" />
                      {activeSpotlight.views} watching
                    </span>
                    <span className="hidden sm:inline-block px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[9px] font-bold rounded-full">
                      🔥 {activeSpotlight.viewerVelocity}
                    </span>
                  </div>
                  
                  <span className="px-2.5 py-1 bg-indigo-950/70 border border-indigo-500/20 backdrop-blur-md rounded-lg text-[9px] font-bold text-indigo-300 uppercase tracking-widest">
                    1080p 60fps
                  </span>
                </div>

                {/* Content info overlays */}
                <div className="z-10 space-y-3 max-w-xl text-left">
                  <div className="space-y-1.5">
                    <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
                      {activeSpotlight.title}
                    </h3>
                    <p className="text-xs md:text-[13px] text-gray-300 font-medium leading-relaxed drop-shadow-sm">
                      {activeSpotlight.description}
                    </p>
                  </div>

                  {/* Creator info */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/25 border border-indigo-500/40 flex items-center justify-center font-bold text-xs text-indigo-200">
                      {activeSpotlight.creator.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{activeSpotlight.creator}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">{activeSpotlight.subtext}</span>
                    </div>
                  </div>

                  {/* Stream Action Controllers */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedStreamForPlayer(activeSpotlight)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-red-950/50"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Watch Live Player</span>
                      </button>

                      <button 
                        onClick={() => onPlayVideo && onPlayVideo(activeSpotlight.video)}
                        className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold rounded-xl transition-all border border-white/10"
                      >
                        <Maximize className="w-3.5 h-3.5" />
                        <span>Full App Video</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setIsMuted(!isMuted);
                          showToast(isMuted ? 'Volume Unmuted' : 'Volume Muted');
                        }}
                        className="w-8 h-8 rounded-lg bg-black/40 hover:bg-black/60 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side secondary live stream cards */}
              <div className="flex flex-col gap-3 justify-between">
                {secondaryLiveStreams.map((stream) => (
                  <div 
                    key={stream.id}
                    onClick={() => setSelectedStreamForPlayer(stream)}
                    className="flex-1 bg-[#090714] border border-[#1b1932] hover:border-indigo-500/30 rounded-xl p-3 flex items-center gap-3.5 group cursor-pointer hover:bg-[#110e23]/30 transition-all duration-300"
                  >
                    <div className="relative w-[110px] aspect-video rounded-lg overflow-hidden shrink-0 bg-indigo-950 border border-white/5">
                      <img 
                        src={stream.coverUrl} 
                        alt={stream.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <span className="absolute top-1.5 left-1.5 flex items-center px-1.5 py-0.5 bg-red-600 rounded text-white text-[7.5px] font-extrabold uppercase tracking-wider">
                        LIVE
                      </span>
                    </div>

                    <div className="flex-1 text-left min-w-0 pr-1 space-y-0.5">
                      <h4 className="font-bold text-[12.5px] text-white tracking-wide line-clamp-1 group-hover:text-indigo-400 transition-colors">
                        {stream.title}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold">
                        <span className="truncate">{stream.creator}</span>
                        <CheckCircle2 className="w-3 h-3 text-blue-400 shrink-0" />
                      </div>
                      <span className="block text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                        {stream.category} &bull; {stream.views}
                      </span>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-red-600 flex items-center justify-center text-gray-400 group-hover:text-white transition-all shrink-0">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Pagination dots */}
            <div className="flex justify-start gap-1.5 pt-1">
              {featuredSpotlights.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setActiveFeatureIndex(dotIdx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeFeatureIndex === dotIdx 
                      ? 'w-4 bg-indigo-600' 
                      : 'w-2 bg-[#231b52] hover:bg-[#342978]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Section 2: Browse Live Categories */}
          <div id="browse-live-categories-section" className="space-y-4">
            <h3 className="text-sm md:text-base font-bold text-white tracking-tight">Browse Live Categories</h3>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none snap-x">
              {categoriesList.map((cat) => {
                const CatIcon = cat.icon;
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border snap-start shrink-0 min-w-[155px] text-left transition-all duration-300 ${
                      isSelected 
                        ? 'bg-indigo-950/30 border-indigo-500/70 shadow-lg text-white' 
                        : 'bg-[#090714] border-[#1b1932] hover:border-indigo-500/20 text-gray-300 hover:text-white'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-white/5 border border-white/10 text-indigo-400'
                    }`}>
                      <CatIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-bold tracking-wide truncate">{cat.name}</span>
                      <span className="block text-[10px] text-gray-400 font-medium">{cat.count} live</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Following Live Now */}
          <div id="following-live-now-section" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm md:text-base font-bold text-white tracking-tight">Following Live Now</h3>
                <p className="text-[11px] text-gray-400 font-medium">Creators you follow are live right now.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {followingLiveNow.map((stream) => (
                <div 
                  key={stream.id}
                  onClick={() => setSelectedStreamForPlayer(stream)}
                  className="bg-[#090714] border border-[#1b1932] hover:border-indigo-500/30 rounded-xl p-3 shrink-0 group cursor-pointer hover:bg-[#110e23]/20 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-indigo-950 border border-white/5">
                      <img 
                        src={stream.coverUrl} 
                        alt={stream.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <span className="absolute top-2 left-2 flex items-center px-1.5 py-0.5 bg-red-600 rounded text-white text-[7.5px] font-extrabold uppercase tracking-wider shadow-md">
                        LIVE
                      </span>
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/75 rounded text-white text-[7.5px] font-bold font-mono">
                        {stream.views}
                      </span>
                    </div>

                    <div className="text-left space-y-1">
                      <h4 className="font-bold text-[12px] text-white tracking-wide line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors">
                        {stream.title}
                      </h4>
                      <div className="flex items-center gap-1">
                        <span className="text-[10.5px] text-gray-400 font-semibold truncate max-w-[120px]">
                          {stream.creator}
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-blue-400 shrink-0" />
                      </div>
                    </div>
                  </div>

                  <span className="block text-[9.5px] text-gray-500 font-bold uppercase tracking-wider pt-2 mt-2 border-t border-white/5">
                    {stream.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Explore Live Events */}
          <div id="explore-live-events-section" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm md:text-base font-bold text-white tracking-tight">Explore Live Events</h3>
                <p className="text-[11px] text-gray-400 font-medium">Don't miss these big global tech & streaming events.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exploreLiveEvents.map((ev) => {
                const isRemind = reminders[ev.id];
                return (
                  <div 
                    key={ev.id}
                    className="bg-[#090714] border border-[#1b1932] rounded-xl p-3.5 space-y-3.5 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-indigo-950 border border-white/5">
                        <img src={ev.imageUrl} alt="" className="w-full h-full object-cover opacity-80" />
                        
                        <div className="absolute top-2 left-2 bg-[#090714]/90 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-center shrink-0">
                          <span className="block text-[8px] font-extrabold text-indigo-400 leading-none">{ev.date.split(' ')[0]}</span>
                          <span className="block text-[11px] font-extrabold text-white leading-none mt-0.5">{ev.date.split(' ')[1]}</span>
                        </div>

                        <div className="absolute top-2 right-2 bg-indigo-600 px-1.5 py-0.5 rounded font-bold text-[8.5px] text-white tracking-wide shadow-md uppercase">
                          {ev.time}
                        </div>
                      </div>

                      <div className="text-left space-y-1">
                        <h4 className="font-bold text-[12.5px] text-white tracking-wide line-clamp-1">
                          {ev.title}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-indigo-300 font-semibold">
                          <span>{ev.creator}</span>
                          <CheckCircle2 className="w-3 h-3 text-blue-400 shrink-0" />
                        </div>
                        <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 pt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {ev.interested}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleRemindToggle(ev.id, ev.title)}
                      className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-bold transition-all active:scale-95 border ${
                        isRemind 
                          ? 'bg-emerald-600 border-emerald-500 text-white' 
                          : 'bg-[#18153c]/70 border-[#382b95]/40 hover:bg-[#1f1a4a]/85 text-indigo-300 hover:text-white'
                      }`}
                    >
                      <Bell className={`w-3.5 h-3.5 ${isRemind ? 'fill-current' : ''}`} />
                      <span>{isRemind ? 'Reminded' : 'Remind Me'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (xl:col-span-1) */}
        <div id="live-page-right-sidebar" className="xl:col-span-1 space-y-6">
          
          {/* Section 5: Live Schedule widget */}
          <div className="bg-[#090714] border border-[#1b1932] rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="font-bold text-sm text-white tracking-wide flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Live Schedule
              </h3>
            </div>

            <div className="space-y-3.5 text-left">
              {liveSchedule.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-2 bg-white/2 hover:bg-white/5 rounded-xl transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-center w-12 shrink-0">
                      <span className="block text-xs font-bold text-gray-200">{item.time}</span>
                      <span className={`block text-[7.5px] font-extrabold uppercase mt-0.5 tracking-wider ${
                        item.status === 'LIVE NOW' 
                          ? 'text-red-500' 
                          : 'text-indigo-400'
                      }`}>
                        {item.status.split(' ')[0]}
                      </span>
                    </div>

                    <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-indigo-950 border border-white/5">
                      <img src={item.coverUrl} alt="" className="w-full h-full object-cover" />
                    </div>

                    <div className="min-w-0 text-left">
                      <h4 className="font-bold text-[12px] text-white truncate group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </h4>
                      <span className="block text-[10.5px] text-gray-400 truncate">{item.creator}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Top Live Streamers */}
          <div className="bg-[#090714] border border-[#1b1932] rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="font-bold text-sm text-white tracking-wide flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Top Live Streamers
              </h3>
            </div>

            <div className="space-y-3.5 text-left">
              {topLiveStreamers.map((streamer) => {
                const isFollowed = followedStreamers[streamer.name];
                return (
                  <div 
                    key={streamer.id}
                    className="flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-4 text-center text-xs font-bold text-indigo-400">
                        {streamer.rank}
                      </span>

                      <div className="relative shrink-0">
                        <img 
                          src={streamer.avatarUrl} 
                          alt={streamer.name} 
                          className="w-9 h-9 rounded-full object-cover border border-white/10" 
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-[#090714] rounded-full animate-pulse" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-white truncate max-w-[90px]">{streamer.name}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        </div>
                        <span className="block text-[10px] text-gray-400 font-medium">{streamer.stats}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleFollowToggle(streamer.name)}
                      className={`text-[10.5px] px-3 py-1.5 font-bold rounded-lg transition-all active:scale-95 shrink-0 ${
                        isFollowed 
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
                          : 'bg-white text-[#100c30] hover:bg-gray-100'
                      }`}
                    >
                      {isFollowed ? 'Following' : 'Follow'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* MODAL 1: LIVE VIDEO PLAYER & INTERACTIVE CHAT / QA / AI */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedStreamForPlayer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6"
          >
            <div className="bg-[#0b0819] border border-indigo-500/30 rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col lg:flex-row overflow-hidden shadow-2xl relative">
              
              {/* Close Modal Button */}
              <button 
                onClick={() => setSelectedStreamForPlayer(null)}
                className="absolute top-3 right-3 z-30 p-2 bg-black/60 hover:bg-red-600 rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* LEFT PLAYER COLUMN */}
              <div className="flex-1 flex flex-col bg-black relative min-w-0">
                
                {/* VIDEO DISPLAY AREA */}
                <div className="relative w-full aspect-video bg-black flex items-center justify-center border-b border-indigo-900/30 overflow-hidden">
                  
                  {isMultiGuestView ? (
                    /* Multi Guest 4-split grid layout */
                    <div className="w-full h-full grid grid-cols-2 gap-1 p-1 bg-[#090714]">
                      <div className="relative bg-indigo-950/60 rounded-lg overflow-hidden border border-red-500/40 flex items-center justify-center">
                        <img src={selectedStreamForPlayer.coverUrl} className="w-full h-full object-cover opacity-80" />
                        <span className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white font-bold">Host: {selectedStreamForPlayer.creator}</span>
                      </div>
                      <div className="relative bg-indigo-950/60 rounded-lg overflow-hidden border border-indigo-500/30 flex items-center justify-center">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" />
                        <span className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white font-bold">Guest 1: Malika</span>
                      </div>
                      <div className="relative bg-indigo-950/60 rounded-lg overflow-hidden border border-indigo-500/30 flex items-center justify-center">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" />
                        <span className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white font-bold">Guest 2: Bobur</span>
                      </div>
                      <div className="relative bg-indigo-950/60 rounded-lg overflow-hidden border border-indigo-500/30 flex items-center justify-center">
                        <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" />
                        <span className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white font-bold">Guest 3: Aziza</span>
                      </div>
                    </div>
                  ) : (
                    /* Standard Stream Video Frame */
                    <iframe 
                      src={selectedStreamForPlayer.video?.videoUrl || 'https://www.youtube.com/embed/Way9Dexny3w'} 
                      title={selectedStreamForPlayer.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    />
                  )}

                  {/* FLOATING REACTION PARTICLES */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                    {floatingParticles.map(p => (
                      <motion.div
                        key={p.id}
                        initial={{ y: 220, opacity: 1, scale: 0.8 }}
                        animate={{ y: -50, opacity: 0, scale: 1.5 }}
                        transition={{ duration: 1.8, ease: 'easeOut' }}
                        style={{ left: `${p.left}%` }}
                        className="absolute bottom-10 text-2xl"
                      >
                        {p.emoji}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* CONTROLS & STREAM INFO BAR */}
                <div className="p-4 space-y-3 bg-[#0c091f] overflow-y-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="text-left space-y-1">
                      <h2 className="text-sm md:text-base font-bold text-white tracking-wide">
                        {selectedStreamForPlayer.title}
                      </h2>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1 font-bold text-red-400">
                          <Radio className="w-3.5 h-3.5 animate-pulse" /> 12.4K Watching
                        </span>
                        <span>•</span>
                        <span className="text-emerald-400 font-mono">+534 last 5 min</span>
                        <span>•</span>
                        <span className="text-indigo-300 font-bold">{streamQuality}</span>
                      </div>
                    </div>

                    {/* Stream Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button 
                        onClick={() => {
                          setLiveStreamLikes(prev => prev + 1);
                          setHasLikedLive(true);
                          showToast('❤️ Stream Liked!');
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                          hasLikedLive ? 'bg-red-600 border-red-500 text-white' : 'bg-white/5 border-white/10 text-gray-200 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${hasLikedLive ? 'fill-current' : ''}`} />
                        <span>{liveStreamLikes}</span>
                      </button>

                      {/* Quality Selector */}
                      <select 
                        value={streamQuality}
                        onChange={(e: any) => setStreamQuality(e.target.value)}
                        className="bg-[#171338] border border-indigo-500/40 text-xs font-bold text-indigo-200 px-2.5 py-1.5 rounded-xl outline-none"
                      >
                        <option value="Auto">Auto Quality</option>
                        <option value="1080p">1080p 60fps</option>
                        <option value="720p">720p</option>
                        <option value="480p">480p</option>
                      </select>

                      {/* Multi Guest View Toggle */}
                      <button 
                        onClick={() => setIsMultiGuestView(!isMultiGuestView)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                          isMultiGuestView ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-indigo-300'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{isMultiGuestView ? 'Solo View' : 'Multi-Guest (4)'}</span>
                      </button>

                      {/* AI Clip Button */}
                      <button 
                        onClick={handleCreateClip}
                        className="px-3 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 text-xs font-bold rounded-xl flex items-center gap-1.5"
                      >
                        <Scissors className="w-3.5 h-3.5 text-indigo-400" />
                        <span>AI Clip ✂️</span>
                      </button>
                    </div>
                  </div>

                  {/* REAL-TIME REACTION EMOJI BAR */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Live Reactions:</span>
                    <button onClick={() => triggerReaction('❤️', 'like')} className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold flex items-center gap-1 border border-white/5 active:scale-90">
                      ❤️ {reactionCounts.like}
                    </button>
                    <button onClick={() => triggerReaction('🔥', 'fire')} className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold flex items-center gap-1 border border-white/5 active:scale-90">
                      🔥 {reactionCounts.fire}
                    </button>
                    <button onClick={() => triggerReaction('👏', 'clap')} className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold flex items-center gap-1 border border-white/5 active:scale-90">
                      👏 {reactionCounts.clap}
                    </button>
                    <button onClick={() => triggerReaction('🚀', 'rocket')} className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold flex items-center gap-1 border border-white/5 active:scale-90">
                      🚀 {reactionCounts.rocket}
                    </button>
                    <button onClick={() => triggerReaction('🎯', 'wow')} className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold flex items-center gap-1 border border-white/5 active:scale-90">
                      🎯 {reactionCounts.wow}
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDEBAR COLUMN: CHAT, Q&A, AI SUMMARY & POLLS */}
              <div className="w-full lg:w-96 bg-[#090715] border-l border-indigo-900/30 flex flex-col h-full overflow-hidden">
                
                {/* TAB SWITCHER */}
                <div className="flex items-center justify-between border-b border-white/10 p-2 bg-[#0d0a21]">
                  <button 
                    onClick={() => setPlayerTab('chat')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${playerTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Live Chat
                  </button>
                  <button 
                    onClick={() => setPlayerTab('qna')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${playerTab === 'qna' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Q&A 🔥
                  </button>
                  <button 
                    onClick={() => {
                      setPlayerTab('ai_summary');
                      if (!aiLiveSummary) handleFetchAiSummary();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${playerTab === 'ai_summary' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    AI Summary 🤖
                  </button>
                  <button 
                    onClick={() => setPlayerTab('polls')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${playerTab === 'polls' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Poll 📊
                  </button>
                </div>

                {/* TAB CONTENT 1: LIVE CHAT */}
                {playerTab === 'chat' && (
                  <div className="flex-1 flex flex-col h-full overflow-hidden p-3 space-y-3">
                    {/* Chat Mode Status Bar */}
                    <div className="flex items-center justify-between bg-indigo-950/40 p-2 rounded-xl border border-indigo-500/20 text-[10.5px]">
                      <span className="text-indigo-300 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Mode: {chatMode}
                      </span>
                      <button onClick={() => setIsSuperMsgOpen(true)} className="text-amber-400 font-bold hover:underline flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> Super Message
                      </button>
                    </div>

                    {/* Chat Message Stream */}
                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-indigo-900/40 text-left">
                      {chatMessages.map(msg => (
                        <div key={msg.id} className={`p-2.5 rounded-xl border ${
                          msg.isSuperMsg 
                            ? 'bg-amber-950/60 border-amber-500/50 shadow-md' 
                            : msg.isModerated 
                              ? 'bg-red-950/30 border-red-500/30' 
                              : 'bg-white/2 border-white/5'
                        }`}>
                          <div className="flex items-center justify-between text-[10.5px] text-gray-400 pb-1">
                            <span className="font-bold text-indigo-300 flex items-center gap-1">
                              <img src={msg.avatar} alt="" className="w-3.5 h-3.5 rounded-full" /> {msg.user}
                            </span>
                            <span>{msg.time}</span>
                          </div>
                          <p className={`text-xs ${msg.isModerated ? 'text-red-400 italic line-through' : 'text-gray-200'}`}>
                            {msg.text}
                          </p>
                          {msg.isSuperMsg && (
                            <span className="mt-1 inline-block px-2 py-0.5 bg-amber-500 text-black font-extrabold text-[10px] rounded-md">
                              PINNED SUPER MSG {msg.amount}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Live AI Translator Strip */}
                    <div className="p-2 bg-[#120e2e] border border-indigo-500/30 rounded-xl text-[10.5px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-indigo-300 font-bold">🌐 Live AI Translator ({targetLang}):</span>
                        <div className="flex gap-1">
                          {(['Uzbek', 'Russian', 'Spanish'] as const).map(lang => (
                            <button key={lang} onClick={() => handleTranslateLive(lang)} className="px-1.5 py-0.5 bg-white/5 hover:bg-indigo-600 rounded text-[9px] font-bold">
                              {lang.slice(0, 2)}
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 italic">{isTranslating ? 'Translating...' : liveTranslation}</p>
                    </div>

                    {/* Chat Input Bar */}
                    <div className="flex items-center gap-2 pt-1">
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                        placeholder="Say something in live chat..."
                        className="flex-1 bg-[#120e29] border border-indigo-500/30 focus:border-indigo-500 text-white text-xs px-3 py-2 rounded-xl outline-none"
                      />
                      <button 
                        onClick={handleSendChatMessage}
                        className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white transition-all active:scale-90"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT 2: Q&A */}
                {playerTab === 'qna' && (
                  <div className="flex-1 flex flex-col h-full overflow-hidden p-3 space-y-3 text-left">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">🔥 Trending Stream Questions</h4>
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          value={newQuestionText}
                          onChange={(e) => setNewQuestionText(e.target.value)}
                          placeholder="Ask streamer a question..."
                          className="flex-1 bg-[#120e29] border border-indigo-500/30 text-white text-xs px-3 py-2 rounded-xl outline-none"
                        />
                        <button onClick={handleAskQuestion} className="px-3 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl">
                          Ask
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-indigo-900/40">
                      {questionsList.map(q => (
                        <div key={q.id} className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-indigo-300">{q.user}</span>
                            {q.isAnswered && <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">Answered</span>}
                          </div>
                          <p className="text-xs text-gray-200">{q.question}</p>
                          <button 
                            onClick={() => toggleUpvoteQuestion(q.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1 border transition-all ${
                              q.hasUpvoted ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" /> {q.upvotes} Upvotes
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT 3: AI SUMMARY & NOTES */}
                {playerTab === 'ai_summary' && (
                  <div className="flex-1 overflow-y-auto p-3 space-y-4 text-left text-xs text-gray-200">
                    <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-300 flex items-center gap-1">
                          <Bot className="w-4 h-4" /> AI Live Summary & Chapters
                        </span>
                        <button onClick={handleFetchAiSummary} className="p-1 bg-white/5 rounded hover:bg-white/10">
                          <RefreshCw className={`w-3.5 h-3.5 text-indigo-300 ${aiSummaryLoading ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed text-[11.5px]">
                        {aiSummaryLoading ? 'Generating AI live chapters...' : aiLiveSummary || 'Click refresh to generate AI stream summary.'}
                      </div>
                    </div>

                    <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-300 flex items-center gap-1">
                          <FileText className="w-4 h-4" /> AI Smart Study Notes
                        </span>
                        <button onClick={handleFetchAiNotes} className="px-2 py-1 bg-indigo-600 text-white font-bold rounded text-[10px]">
                          Generate Notes
                        </button>
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed text-[11.5px]">
                        {aiNotesLoading ? 'Extracting smart key points...' : aiNotes || 'Generate smart notes from current stream transcript.'}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT 4: POLLS */}
                {playerTab === 'polls' && (
                  <div className="p-4 space-y-4 text-left">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">📊 Streamer Active Poll</h4>
                    <div className="p-3 bg-white/2 border border-white/10 rounded-xl space-y-3">
                      <p className="text-xs font-bold text-white">{livePoll.question}</p>
                      <div className="space-y-2">
                        {livePoll.options.map(opt => {
                          const total = livePoll.options.reduce((a, b) => a + b.votes, 0);
                          const pct = Math.round((opt.votes / total) * 100);
                          const isSelected = livePoll.userVotedOptionId === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleVotePoll(opt.id)}
                              className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium space-y-1 transition-all ${
                                isSelected ? 'bg-indigo-600/40 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                              }`}
                            >
                              <div className="flex justify-between">
                                <span>{opt.text}</span>
                                <span className="font-bold">{pct}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 2: SUPER MESSAGE & DONATION MODAL */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isSuperMsgOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="bg-[#120e2b] border border-amber-500/40 rounded-2xl w-full max-w-md p-6 space-y-4 text-left shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Send Super Message / Donation
                </h3>
                <button onClick={() => setIsSuperMsgOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold">Select Donation Amount ($):</label>
                <div className="grid grid-cols-4 gap-2">
                  {['2.00', '5.00', '10.00', '50.00'].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setSuperMsgAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        superMsgAmount === amt ? 'bg-amber-500 border-amber-400 text-black' : 'bg-white/5 border-white/10 text-gray-200'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold">Highlighted Message:</label>
                <textarea 
                  value={superMsgText}
                  onChange={(e) => setSuperMsgText(e.target.value)}
                  placeholder="Type your highlight message to support the creator..."
                  rows={3}
                  className="w-full bg-[#0a0818] border border-indigo-500/30 text-white text-xs p-3 rounded-xl outline-none"
                />
              </div>

              <button 
                onClick={handleSubmitSuperMsg}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all"
              >
                Send Super Message (${superMsgAmount}) 🚀
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 3: CREATOR LIVE STUDIO */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isCreatorStudioOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="bg-[#120e2e] border border-indigo-500/40 rounded-2xl w-full max-w-lg p-6 space-y-5 text-left shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-red-500" /> SoftCast Creator Live Studio
                </h3>
                <button onClick={() => setIsCreatorStudioOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 font-bold block mb-1">Stream Title:</label>
                  <input 
                    type="text" 
                    value={studioStreamTitle}
                    onChange={(e) => setStudioStreamTitle(e.target.value)}
                    className="w-full bg-[#090716] border border-indigo-500/30 text-white text-xs p-2.5 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-bold block mb-1">Stream Category:</label>
                  <select 
                    value={studioCategory}
                    onChange={(e) => setStudioCategory(e.target.value)}
                    className="w-full bg-[#090716] border border-indigo-500/30 text-white text-xs p-2.5 rounded-xl outline-none"
                  >
                    <option value="technology">Technology & AI</option>
                    <option value="gaming">Gaming</option>
                    <option value="education">Education</option>
                    <option value="music">Music</option>
                  </select>
                </div>

                <div className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-indigo-300 block">Stream Settings:</span>
                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <span>AI Moderation Active</span>
                    <span className="text-emerald-400 font-bold">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <span>Latency Mode</span>
                    <span className="text-indigo-300 font-bold">Ultra Low (Sub-second)</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setIsStreamLiveNow(!isStreamLiveNow);
                    showToast(isStreamLiveNow ? 'Stream ended successfully.' : '🔴 LIVE STREAM IS NOW BROADCASTING WORLDWIDE!');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                    isStreamLiveNow ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isStreamLiveNow ? 'End Live Stream' : 'Start Live Broadcast Now 🚀'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 4: LIVE HISTORY DRAWER */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isHistoryOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="bg-[#100c28] border border-indigo-500/30 rounded-2xl w-full max-w-md p-6 space-y-4 text-left shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-400" /> Recently Watched Live Streams
                </h3>
                <button onClick={() => setIsHistoryOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto">
                {liveHistory.map(item => (
                  <div key={item.id} className="p-3 bg-white/2 border border-white/5 rounded-xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h5 className="text-xs font-bold text-white">{item.title}</h5>
                      <p className="text-[10px] text-gray-400">{item.creator} • {item.date} • {item.duration}</p>
                    </div>
                    <button 
                      onClick={() => showToast(`Replaying "${item.title}" with AI chapters`)}
                      className="px-2.5 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-lg"
                    >
                      Replay
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
