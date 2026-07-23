import React, { useRef, useState } from 'react';
import { 
  Gamepad2, Trophy, Flame, ChevronRight, Play, CheckCircle2, 
  Gamepad, Target, Compass, Sword, Shield, Brain, Activity, 
  Sparkles, Monitor, Search, ChevronLeft, Eye, Users, Video as VideoIcon,
  Bot, Zap, Award, Bell, MessageSquare, Share2, ExternalLink, Star,
  Radio, Terminal, Sliders, DollarSign, X, Send, RefreshCw, GitBranch,
  Check, Heart, UserPlus, Calendar, Globe, BookOpen
} from 'lucide-react';
import { Video } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface GamingHubProps {
  videos?: Video[];
  onPlayVideo: (video: Video) => void;
  isPremium: boolean;
}

interface StreamerProfile {
  id: string;
  name: string;
  game: string;
  followers: string;
  viewers: string;
  avatarUrl: string;
  coverUrl: string;
  bio: string;
  schedule: string;
  socials: string[];
}

interface EsportsMatch {
  id: string;
  tournament: string;
  game: string;
  teamA: { name: string; score: number; logo: string };
  teamB: { name: string; score: number; logo: string };
  status: 'LIVE' | 'UPCOMING' | 'FINISHED';
  time: string;
  viewers?: string;
  replayVideo: Video;
}

interface GameGuide {
  id: string;
  title: string;
  game: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';
  views: string;
  readTime: string;
  author: string;
  coverUrl: string;
  video: Video;
}

interface GameRelease {
  id: string;
  title: string;
  releaseDate: string;
  platforms: string[];
  developer: string;
  coverUrl: string;
  notified?: boolean;
}

interface GameCommunity {
  id: string;
  name: string;
  game: string;
  members: string;
  posts: string;
  coverUrl: string;
  joined?: boolean;
}

export default function GamingHub({ videos = [], onPlayVideo, isPremium }: GamingHubProps) {
  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // References for horizontal scrolling of sections
  const trendingScrollRef = useRef<HTMLDivElement>(null);
  const liveStreamsScrollRef = useRef<HTMLDivElement>(null);
  const recommendedScrollRef = useRef<HTMLDivElement>(null);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const esportsScrollRef = useRef<HTMLDivElement>(null);
  const guidesScrollRef = useRef<HTMLDivElement>(null);
  const releasesScrollRef = useRef<HTMLDivElement>(null);
  const communitiesScrollRef = useRef<HTMLDivElement>(null);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, offset: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Filter States
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [guideDifficultyFilter, setGuideDifficultyFilter] = useState<string>('all');

  // Modal / Drawer States
  const [isAiCoachOpen, setIsAiCoachOpen] = useState(false);
  const [isRankRoadmapOpen, setIsRankRoadmapOpen] = useState(false);
  const [isEsportsModalOpen, setIsEsportsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedStreamer, setSelectedStreamer] = useState<StreamerProfile | null>(null);
  const [selectedStreamerVideo, setSelectedStreamerVideo] = useState<Video | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [streamChat, setStreamChat] = useState<{ user: string; text: string; color: string }[]>([
    { user: 'AimGod_99', text: 'Insane 1v4 clutch!! 🔥🔥', color: 'text-purple-400' },
    { user: 'ValoPro', text: 'What sensitivity is he using??', color: 'text-cyan-400' },
    { user: 'Sardor_Gamer', text: 'O`zbekistondan salom! 👋', color: 'text-emerald-400' },
    { user: 'Nexus_Rider', text: 'GG WP Shroud!', color: 'text-amber-400' }
  ]);

  // AI Game Coach State
  const [coachInput, setCoachInput] = useState('');
  const [coachGame, setCoachGame] = useState('VALORANT');
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachMessages, setCoachMessages] = useState<{ sender: 'user' | 'coach'; text: string; timestamp: string }[]>([
    {
      sender: 'coach',
      text: "Salom Gamer! Men SoftCast AI Game Coach'man. Aim mashqlari, crosshair sozlamalari, agent strategiyalari yoki rank oshirish bo'yicha qanday yordam bera olaman?",
      timestamp: 'Just now'
    }
  ]);

  // AI Rank Progression Roadmap State
  const [roadmapGame, setRoadmapGame] = useState('VALORANT');
  const [roadmapTarget, setRoadmapTarget] = useState('Immortal / Radiant');
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState<any | null>(null);

  // User Following States
  const [followedStreamers, setFollowedStreamers] = useState<string[]>(['Shroud']);
  const [followedGames, setFollowedGames] = useState<string[]>(['VALORANT', 'Minecraft']);

  // Dynamic Releases Data with Notifications
  const [releases, setReleases] = useState<GameRelease[]>([
    {
      id: 'rel-1',
      title: 'Grand Theft Auto VI (GTA 6)',
      releaseDate: 'Fall 2026',
      platforms: ['PS5', 'Xbox Series X/S', 'PC'],
      developer: 'Rockstar Games',
      coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop',
      notified: false
    },
    {
      id: 'rel-2',
      title: 'The Witcher 4: Polaris',
      releaseDate: 'Q1 2027',
      platforms: ['PC', 'PS5', 'Xbox Series X'],
      developer: 'CD Projekt Red',
      coverUrl: 'https://images.unsplash.com/photo-1655821888788-6107699e173b?w=600&auto=format&fit=crop',
      notified: false
    },
    {
      id: 'rel-3',
      title: 'Hollow Knight: Silksong',
      releaseDate: 'Q4 2026',
      platforms: ['PC', 'Nintendo Switch', 'PS5', 'Xbox'],
      developer: 'Team Cherry',
      coverUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&auto=format&fit=crop',
      notified: true
    },
    {
      id: 'rel-4',
      title: 'Cyberpunk: Orion Project',
      releaseDate: '2027',
      platforms: ['PC', 'PS5 Pro'],
      developer: 'CD Projekt Red',
      coverUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop',
      notified: false
    }
  ]);

  // Communities Data
  const [communities, setCommunities] = useState<GameCommunity[]>([
    {
      id: 'com-1',
      name: 'Minecraft Uzbekistan Builders',
      game: 'Minecraft',
      members: '2.5M Members',
      posts: '120K Posts',
      coverUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&auto=format&fit=crop',
      joined: true
    },
    {
      id: 'com-2',
      name: 'VALORANT Competitive Hub',
      game: 'VALORANT',
      members: '1.8M Members',
      posts: '340K Posts',
      coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop',
      joined: false
    },
    {
      id: 'com-3',
      name: 'Elden Ring Lore & Speedruns',
      game: 'Elden Ring',
      members: '890K Members',
      posts: '95K Posts',
      coverUrl: 'https://images.unsplash.com/photo-1655821888788-6107699e173b?w=600&auto=format&fit=crop',
      joined: false
    },
    {
      id: 'com-4',
      name: 'Call of Duty Warzone Tactics',
      game: 'Call of Duty: MWIII',
      members: '1.2M Members',
      posts: '210K Posts',
      coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop',
      joined: true
    }
  ]);

  // Esports Events Data
  const esportsMatches: EsportsMatch[] = [
    {
      id: 'esp-1',
      tournament: 'VALORANT Champions 2026',
      game: 'VALORANT',
      teamA: { name: 'Sentinels', score: 2, logo: '🛡️' },
      teamB: { name: 'Fnatic', score: 1, logo: '🔥' },
      status: 'LIVE',
      time: 'Map 4 - Haven',
      viewers: '284K',
      replayVideo: {
        id: 'esp-v1',
        title: 'VALORANT Champions 2026 - Grand Finals Match Live',
        description: 'Watch Sentinels vs Fnatic duel for the world championship trophy!',
        category: 'gaming',
        coverUrl: 'https://images.unsplash.com/photo-1578269174936-2709b5a5e06c?w=800&auto=format&fit=crop',
        duration: 'LIVE',
        views: '284K watching',
        uploadDate: 'Started 2h ago',
        creator: 'VCT Esports',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/e_E9W2vsRbA'
      }
    },
    {
      id: 'esp-2',
      tournament: 'PGL CS2 Major Copenhagen',
      game: 'Counter-Strike 2',
      teamA: { name: 'Natus Vincere', score: 1, logo: '⚡' },
      teamB: { name: 'FaZe Clan', score: 1, logo: '🦅' },
      status: 'LIVE',
      time: 'Decider Map',
      viewers: '412K',
      replayVideo: {
        id: 'esp-v2',
        title: 'CS2 Major Copenhagen Grand Final - NaVi vs FaZe',
        description: 'The intense deciding map for the Counter-Strike world championship title.',
        category: 'gaming',
        coverUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop',
        duration: 'LIVE',
        views: '412K watching',
        uploadDate: 'Started 3h ago',
        creator: 'ESL CS2',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/SgXDxS6Jv8o'
      }
    },
    {
      id: 'esp-3',
      tournament: 'League of Legends Worlds 2026',
      game: 'League of Legends',
      teamA: { name: 'T1', score: 3, logo: '👑' },
      teamB: { name: 'Gen.G Esports', score: 0, logo: '🐯' },
      status: 'FINISHED',
      time: 'Final: 3 - 0',
      replayVideo: {
        id: 'esp-v3',
        title: 'T1 vs Gen.G - LoL Worlds Grand Final Full Highlights',
        description: 'Faker leads T1 to another historic world title sweep.',
        category: 'gaming',
        coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop',
        duration: '45:10',
        views: '3.1M views',
        uploadDate: 'Yesterday',
        creator: 'Riot Games Esports',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/AKXiKBnzpUQ'
      }
    }
  ];

  // Game Guides Data
  const gameGuides: GameGuide[] = [
    {
      id: 'gd-1',
      title: 'Valorant Aim Calibration & Crosshair Placement 2026',
      game: 'VALORANT',
      difficulty: 'Pro',
      views: '450K',
      readTime: '12 min',
      author: 'TenZ Academy',
      coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop',
      video: {
        id: 'gv-1',
        title: 'Valorant Aim Calibration & Crosshair Masterclass',
        description: 'Micro-adjustments, recoil control, and angle isolation.',
        category: 'gaming',
        coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop',
        duration: '14:20',
        views: '450K views',
        uploadDate: '3 days ago',
        creator: 'TenZ',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/e_E9W2vsRbA'
      }
    },
    {
      id: 'gd-2',
      title: 'Minecraft Redstone Automation & Smart Farm Guide',
      game: 'Minecraft',
      difficulty: 'Intermediate',
      views: '620K',
      readTime: '18 min',
      author: 'MumboJumbo',
      coverUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&auto=format&fit=crop',
      video: {
        id: 'gv-2',
        title: 'Minecraft Automated Redstone Farm Tutorial',
        description: 'Build automated item sorters, piston elevators, and crop harvesters.',
        category: 'gaming',
        coverUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=800&auto=format&fit=crop',
        duration: '19:40',
        views: '620K views',
        uploadDate: '1 week ago',
        creator: 'MumboJumbo',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/MmB9b5njVbA'
      }
    },
    {
      id: 'gd-3',
      title: 'Elden Ring Shadow of Erdtree Overpowered Builds',
      game: 'Elden Ring',
      difficulty: 'Advanced',
      views: '890K',
      readTime: '15 min',
      author: 'Fextralife',
      coverUrl: 'https://images.unsplash.com/photo-1655821888788-6107699e173b?w=600&auto=format&fit=crop',
      video: {
        id: 'gv-3',
        title: 'Elden Ring Best End Game Boss Melter Builds',
        description: 'Destroy bosses in seconds with optimized talisman combinations.',
        category: 'gaming',
        coverUrl: 'https://images.unsplash.com/photo-1655821888788-6107699e173b?w=800&auto=format&fit=crop',
        duration: '22:15',
        views: '890K views',
        uploadDate: '4 days ago',
        creator: 'Fextralife',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/AKXiKBnzpUQ'
      }
    }
  ];

  // Static Data specifically designed from user's reference image
  const featuredWidgets = [
    {
      id: 'top-games',
      title: 'Top Games',
      sub: 'Popular games right now',
      color: 'from-[#3b1c78]/20 to-[#10082c]/10',
      borderColor: 'border-[#4c249a]/40',
      glowColor: 'bg-purple-600/10',
      badgeColor: 'text-purple-400',
      icon: Gamepad2,
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop',
      video: {
        id: 'gm-top-games',
        title: 'Top Games of 2026 - Official Showcase',
        description: 'Check out the hottest and most popular games trending across the globe right now.',
        category: 'gaming' as const,
        coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop',
        duration: '12:30',
        views: '1.4M views',
        uploadDate: '2 days ago',
        creator: 'SoftCast Gaming',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/SgXDxS6Jv8o'
      }
    },
    {
      id: 'esports',
      title: 'Esports',
      sub: 'Tournaments, highlights & news',
      color: 'from-[#122e6b]/20 to-[#05112c]/10',
      borderColor: 'border-[#1b439c]/40',
      glowColor: 'bg-blue-600/10',
      badgeColor: 'text-blue-400',
      icon: Trophy,
      imageUrl: 'https://images.unsplash.com/photo-1578269174936-2709b5a5e06c?w=500&auto=format&fit=crop',
      video: {
        id: 'gm-esports',
        title: 'Valorant Champions Tour - Grand Finals Highlight',
        description: 'Re-live the incredible action, mind-blowing clutches, and triumphant moments from the grand championship final.',
        category: 'gaming' as const,
        coverUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop',
        duration: '18:15',
        views: '890K views',
        uploadDate: '1 day ago',
        creator: 'VCT Esports',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/e_E9W2vsRbA'
      }
    },
    {
      id: 'game-guides',
      title: 'Game Guides',
      sub: 'Tips, tricks and walkthroughs',
      color: 'from-[#0a2f32]/20 to-[#031315]/10',
      borderColor: 'border-[#145d63]/40',
      glowColor: 'bg-teal-600/10',
      badgeColor: 'text-teal-400',
      icon: Monitor,
      imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop',
      video: {
        id: 'gm-guides',
        title: 'The Ultimate Elden Ring Beginner Guide - Shadow of the Erdtree',
        description: 'Essential items, mechanics, routes, and weapon suggestions to excel in the realm of shadow.',
        category: 'gaming' as const,
        coverUrl: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=800&auto=format&fit=crop',
        duration: '25:40',
        views: '2.1M views',
        uploadDate: '3 weeks ago',
        creator: 'RageGamingWalkthroughs',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/AKXiKBnzpUQ'
      }
    },
    {
      id: 'new-releases',
      title: 'New Releases',
      sub: 'Latest games and updates',
      color: 'from-[#3b0a1d]/20 to-[#12040a]/10',
      borderColor: 'border-[#6c1435]/40',
      glowColor: 'bg-rose-600/10',
      badgeColor: 'text-rose-400',
      icon: Flame,
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&auto=format&fit=crop',
      video: {
        id: 'gm-releases',
        title: 'Top 10 High-Graphics Games Launching in 2026',
        description: 'Get ready for the most ambitious next-generation graphical masterpieces releasing this quarter.',
        category: 'gaming' as const,
        coverUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop',
        duration: '15:10',
        views: '450K views',
        uploadDate: '4 days ago',
        creator: 'NextGen Gaming',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/WJW-VfbyRHI'
      }
    }
  ];

  const trendingGames = [
    {
      rank: 1,
      title: 'Call of Duty: MWIII',
      genre: 'Shooter',
      followers: '2.4M followers',
      duration: '18:45',
      coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop',
      rankBadgeBg: 'bg-gradient-to-br from-indigo-600 to-indigo-800',
      video: {
        id: 'gm-trend-1',
        title: 'Call of Duty: MWIII - Season 5 Official Multiplayer Gameplay',
        description: 'Watch the high-octane modern shooter tournament and map showcases in stunning ultra 4K.',
        category: 'gaming' as const,
        coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop',
        duration: '18:45',
        views: '2.4M views',
        uploadDate: '3 days ago',
        creator: 'Call of Duty',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/SgXDxS6Jv8o'
      }
    },
    {
      rank: 2,
      title: 'VALORANT',
      genre: 'FPS',
      followers: '1.8M followers',
      duration: '16:22',
      coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop',
      rankBadgeBg: 'bg-gradient-to-br from-purple-600 to-fuchsia-700',
      video: {
        id: 'gm-trend-2',
        title: 'VALORANT - New Duelist Agent Release & Gameplay Analysis',
        description: 'Full breakdown of the new Valorant agent skills, utility tips, and meta-shaping strategy.',
        category: 'gaming' as const,
        coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop',
        duration: '16:22',
        views: '1.8M views',
        uploadDate: 'Yesterday',
        creator: 'Valorant Guides',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/e_E9W2vsRbA'
      }
    },
    {
      rank: 3,
      title: 'Elden Ring',
      genre: 'RPG',
      followers: '1.2M followers',
      duration: '20:31',
      coverUrl: 'https://images.unsplash.com/photo-1655821888788-6107699e173b?w=600&auto=format&fit=crop',
      rankBadgeBg: 'bg-gradient-to-br from-amber-600 to-orange-700',
      video: {
        id: 'gm-trend-3',
        title: 'Elden Ring - Shadow of the Erdtree Boss Rush Speedrun',
        description: 'Witness high-skill combat mechanics defeating the legendary demigods in the shadow realm.',
        category: 'gaming' as const,
        coverUrl: 'https://images.unsplash.com/photo-1655821888788-6107699e173b?w=800&auto=format&fit=crop',
        duration: '20:31',
        views: '1.2M views',
        uploadDate: '5 days ago',
        creator: 'EldenGod',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/AKXiKBnzpUQ'
      }
    },
    {
      rank: 4,
      title: 'Minecraft',
      genre: 'Sandbox',
      followers: '1.1M followers',
      duration: '12:10',
      coverUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&auto=format&fit=crop',
      rankBadgeBg: 'bg-gradient-to-br from-blue-600 to-cyan-700',
      video: {
        id: 'gm-trend-4',
        title: 'Minecraft - How to Build a Modern Redstone Smart Base',
        description: 'Step-by-step smart house guide with hidden rooms, piston doors, and automated crop sorting machines.',
        category: 'gaming' as const,
        coverUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=800&auto=format&fit=crop',
        duration: '12:10',
        views: '1.1M views',
        uploadDate: '1 week ago',
        creator: 'MumboJumbo',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/MmB9b5njVbA'
      }
    },
    {
      rank: 5,
      title: 'Fortnite',
      genre: 'Battle Royale',
      followers: '980K followers',
      duration: '15:20',
      coverUrl: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=600&auto=format&fit=crop',
      rankBadgeBg: 'bg-gradient-to-br from-pink-600 to-rose-700',
      video: {
        id: 'gm-trend-5',
        title: 'Fortnite Chapter 5 Season 3 - Epic Victory Royale Solo',
        description: 'Testing the new vehicle weapons and nitro medallions in a high lobby win.',
        category: 'gaming' as const,
        coverUrl: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=800&auto=format&fit=crop',
        duration: '15:20',
        views: '980K views',
        uploadDate: '2 days ago',
        creator: 'Fortnite Champion',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/WJW-VfbyRHI'
      }
    }
  ];

  const liveStreams = [
    {
      id: 'live-shroud',
      streamer: 'Shroud',
      game: 'Call of Duty: MWIII',
      viewers: '12.4K',
      avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop',
      coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop',
      video: {
        id: 'gm-live-shroud',
        title: 'Shroud LIVE - Ranked Crimson Grind (MWIII)',
        description: 'Watch shroud dominate the lobby with pristine target locks, recoil control, and strategic communications.',
        category: 'gaming' as const,
        coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop',
        duration: 'LIVE',
        views: '12.4K watching',
        uploadDate: 'Stream Started: 2h ago',
        creator: 'Shroud',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/AAnN96Sre_U'
      }
    },
    {
      id: 'live-tenz',
      streamer: 'TenZ',
      game: 'VALORANT',
      viewers: '8.7K',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop',
      coverUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop',
      video: {
        id: 'gm-live-tenz',
        title: 'TenZ LIVE - Radiant Ranked Jett Gameplay',
        description: 'High-speed mechanics, clean aim snaps, and expert duel techniques from Sentinels star player TenZ.',
        category: 'gaming' as const,
        coverUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop',
        duration: 'LIVE',
        views: '8.7K watching',
        uploadDate: 'Stream Started: 1h ago',
        creator: 'TenZ',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/8b96D6O08r8'
      }
    },
    {
      id: 'live-cohh',
      streamer: 'CohhCarnage',
      game: 'Elden Ring',
      viewers: '6.2K',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop',
      coverUrl: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=600&auto=format&fit=crop',
      video: {
        id: 'gm-live-cohh',
        title: 'CohhCarnage LIVE - Elden Ring DLC Blind Exploration',
        description: 'Relaxed and complete walkabout searching secrets and mapping dungeon structures in Elden Ring.',
        category: 'gaming' as const,
        coverUrl: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=800&auto=format&fit=crop',
        duration: 'LIVE',
        views: '6.2K watching',
        uploadDate: 'Stream Started: 4h ago',
        creator: 'CohhCarnage',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/lA8g2DshCq8'
      }
    },
    {
      id: 'live-dream',
      streamer: 'Dream',
      game: 'Minecraft',
      viewers: '5.1K',
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop',
      coverUrl: 'https://images.unsplash.com/photo-1587573089734-09cb6b447681?w=600&auto=format&fit=crop',
      video: {
        id: 'gm-live-dream',
        title: 'Dream LIVE - Speedrunner VS 3 Hunters Rematch',
        description: 'Elite speedrunning chase sequences across nether fortresses and end portals.',
        category: 'gaming' as const,
        coverUrl: 'https://images.unsplash.com/photo-1587573089734-09cb6b447681?w=800&auto=format&fit=crop',
        duration: 'LIVE',
        views: '5.1K watching',
        uploadDate: 'Stream Started: 3h ago',
        creator: 'Dream',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/V6X-EunIoxE'
      }
    }
  ];

  const categories = [
    { name: 'Action', videos: '12.5K videos', icon: Target, bg: 'bg-[#1e0e1a]/80', border: 'border-[#4c1c3f]/50', color: 'text-rose-400', glow: 'shadow-[0_0_15px_-3px_rgba(244,63,94,0.15)]' },
    { name: 'Adventure', videos: '8.3K videos', icon: Compass, bg: 'bg-[#0d1e13]/80', border: 'border-[#194c2e]/50', color: 'text-emerald-400', glow: 'shadow-[0_0_15px_-3px_rgba(52,211,153,0.15)]' },
    { name: 'RPG', videos: '9.7K videos', icon: Sword, bg: 'bg-[#0e172e]/80', border: 'border-[#1b346e]/50', color: 'text-blue-400', glow: 'shadow-[0_0_15px_-3px_rgba(59,130,246,0.15)]' },
    { name: 'Strategy', videos: '6.1K videos', icon: Brain, bg: 'bg-[#0a2327]/80', border: 'border-[#14474f]/50', color: 'text-teal-400', glow: 'shadow-[0_0_15px_-3px_rgba(20,184,166,0.15)]' },
    { name: 'Sports', videos: '4.8K videos', icon: Activity, bg: 'bg-[#26160d]/80', border: 'border-[#4e2c14]/50', color: 'text-orange-400', glow: 'shadow-[0_0_15px_-3px_rgba(249,115,22,0.15)]' },
    { name: 'Racing', videos: '3.2K videos', icon: Flame, bg: 'bg-[#190a23]/80', border: 'border-[#331448]/50', color: 'text-purple-400', glow: 'shadow-[0_0_15px_-3px_rgba(168,85,247,0.15)]' },
    { name: 'Indie', videos: '7.6K videos', icon: Sparkles, bg: 'bg-[#1a0928]/80', border: 'border-[#3a115b]/50', color: 'text-violet-400', glow: 'shadow-[0_0_15px_-3px_rgba(139,92,246,0.15)]' },
    { name: 'Simulation', videos: '5.4K videos', icon: Gamepad, bg: 'bg-[#071926]/80', border: 'border-[#10344d]/50', color: 'text-cyan-400', glow: 'shadow-[0_0_15px_-3px_rgba(6,182,212,0.15)]' }
  ];

  // Send AI Coach Chat
  const handleSendCoachMessage = async () => {
    if (!coachInput.trim()) return;
    const msgText = coachInput.trim();
    setCoachInput('');

    setCoachMessages(prev => [...prev, { sender: 'user', text: msgText, timestamp: 'Just now' }]);
    setCoachLoading(true);

    try {
      const res = await fetch('/api/ai-gaming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'coach_chat', prompt: msgText, game: coachGame })
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setCoachMessages(prev => [...prev, { sender: 'coach', text: data.reply, timestamp: 'Just now' }]);
      }
    } catch (err) {
      console.error(err);
      setCoachMessages(prev => [...prev, {
        sender: 'coach',
        text: `🎮 "${coachGame}" bo'yicha maslahat: Daily 15-min AimLab gridshot mashq qiling va har bir o'limdan so'ng xatoingizni tahlil qiling!`,
        timestamp: 'Just now'
      }]);
    } finally {
      setCoachLoading(false);
    }
  };

  // Generate Rank Progression Roadmap
  const handleGenerateRankRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    try {
      const res = await fetch('/api/ai-gaming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'rank_roadmap', game: roadmapGame, rankTarget: roadmapTarget })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedRoadmap(data.data);
        showToast(`🏆 ${roadmapGame} bo'yicha "${roadmapTarget}" darajasiga chiqish xaritasi tayyorlandi!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  // Toggle Notification on Release
  const toggleReleaseNotify = (id: string, title: string) => {
    setReleases(prev => prev.map(r => {
      if (r.id === id) {
        const nextState = !r.notified;
        if (nextState) {
          showToast(`🔔 "${title}" chiqarilganda sizga eslatma yuboriladi!`);
        } else {
          showToast(`🔕 Eslatma bekor qilindi.`);
        }
        return { ...r, notified: nextState };
      }
      return r;
    }));
  };

  // Toggle Community Join
  const toggleCommunityJoin = (id: string, name: string) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === id) {
        const nextJoined = !c.joined;
        if (nextJoined) {
          showToast(`👥 "${name}" hamjamiyatiga qo'shildingiz!`);
        } else {
          showToast(`A'zolik bekor qilindi.`);
        }
        return { ...c, joined: nextJoined };
      }
      return c;
    }));
  };

  // Send Stream Chat Message
  const handleSendStreamChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setStreamChat(prev => [...prev, { user: 'You (SoftCast)', text: chatInput.trim(), color: 'text-purple-300' }]);
    setChatInput('');
  };

  // Open Streamer Drawer
  const openStreamerDrawer = (stream: typeof liveStreams[0]) => {
    setSelectedStreamer({
      id: stream.id,
      name: stream.streamer,
      game: stream.game,
      followers: `${(Math.random() * 2 + 1).toFixed(1)}M`,
      viewers: `${stream.viewers}K`,
      avatarUrl: stream.avatarUrl,
      coverUrl: stream.coverUrl,
      bio: `Professional content creator & competitive gamer streaming high-skill ${stream.game} action daily.`,
      schedule: 'Mon - Fri @ 18:00 UTC',
      socials: ['Twitter', 'Twitch', 'YouTube', 'Discord']
    });
    setSelectedStreamerVideo(stream.video);
  };

  return (
    <div 
      id="gaming-page-main-container" 
      className="w-full h-full text-left bg-[#05040d] text-white overflow-y-auto max-h-[calc(100vh-4.5rem)] scrollbar-thin scrollbar-thumb-purple-900/40 select-none pb-28 relative font-sans"
    >
      {/* GLOBAL TOAST OVERLAY */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            className="fixed top-20 right-8 z-50 bg-[#1e0f3d] border border-[#6b41cb]/80 px-4 py-3 rounded-xl flex items-center gap-3 shadow-2xl text-xs max-w-sm"
          >
            <Sparkles className="w-4.5 h-4.5 text-purple-400 shrink-0 animate-pulse" />
            <p className="text-gray-100 font-medium leading-snug">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key="gaming-dashboard"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="p-6 md:p-8 space-y-8 max-w-[1300px] mx-auto"
      >
        {/* HEADER BLOCK WITH SEARCH & KILLER FEATURE BUTTONS */}
        <div id="gaming-page-hero-title" className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1444]/50 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white font-display">Gaming</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-950/80 border border-purple-500/40 text-purple-300 flex items-center gap-1">
                <Radio className="w-3 h-3 text-red-400 animate-pulse" />
                Live Ecosystem
              </span>
            </div>
            <p className="text-xs md:text-sm text-gray-400 font-medium">Everything about games, esports and gaming culture.</p>
          </div>

          {/* SEARCH & INTERACTIVE CONTROLS */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games, streams, guides, teams..."
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

            {/* KILLER FEATURE BUTTON 1: AI GAME COACH */}
            <button
              onClick={() => setIsAiCoachOpen(true)}
              className="w-full sm:w-auto px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
            >
              <Bot className="w-4 h-4 text-purple-200 animate-pulse" />
              <span>AI Coach 🤖</span>
            </button>

            {/* KILLER FEATURE BUTTON 2: RANK ROADMAP */}
            <button
              onClick={() => setIsRankRoadmapOpen(true)}
              className="w-full sm:w-auto px-3 py-2 bg-[#120d30] hover:bg-purple-950/60 border border-[#2d226b] text-purple-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 whitespace-nowrap"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Rank Roadmap 🏆</span>
            </button>
          </div>
        </div>

        {/* SEARCH OVERLAY (IF USER IS TYPING) */}
        {searchQuery.trim() && (
          <div className="p-4 bg-[#0a081a] border border-purple-500/30 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <p className="text-xs font-bold text-purple-300">
                Search results for: <strong className="text-white">"{searchQuery}"</strong>
              </p>
              <span className="text-[10px] text-gray-400 font-mono">Games, Streams, Esports</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {trendingGames
                .filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.genre.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(game => (
                  <div 
                    key={game.rank}
                    onClick={() => {
                      onPlayVideo(game.video);
                      setSearchQuery('');
                    }}
                    className="p-3 bg-[#120d30] border border-white/5 hover:border-purple-500/40 rounded-xl cursor-pointer flex items-center gap-3"
                  >
                    <img src={game.coverUrl} alt="" className="w-12 h-10 object-cover rounded-lg shrink-0" />
                    <div className="min-w-0 text-left">
                      <h5 className="text-xs font-bold text-white truncate">{game.title}</h5>
                      <p className="text-[10px] text-gray-400 truncate">{game.genre} • {game.followers}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TOP 4 KPI/FEATURED NAVIGATION WIDGETS */}
        <div id="gaming-kpi-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {featuredWidgets.map((widget) => {
            const WidgetIcon = widget.icon;
            return (
              <div 
                key={widget.id}
                onClick={() => onPlayVideo(widget.video)}
                className={`relative p-5 bg-gradient-to-br ${widget.color} border ${widget.borderColor} rounded-2xl flex flex-col justify-between overflow-hidden group hover:border-purple-500/50 transition-all duration-300 shadow-lg h-36 cursor-pointer`}
              >
                <div className="absolute top-0 right-0 w-32 h-full opacity-10 group-hover:opacity-20 group-hover:scale-105 transition-all duration-300 pointer-events-none">
                  <img src={widget.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div className={`absolute -top-12 -right-12 w-28 h-28 ${widget.glowColor} rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-all`} />

                <div className="flex justify-between items-start">
                  <div className="space-y-1 z-10">
                    <h3 className="text-[13px] font-bold text-white tracking-wide">{widget.title}</h3>
                    <p className="text-[10.5px] text-gray-400 max-w-[160px] line-clamp-2">{widget.sub}</p>
                  </div>
                  <div className={`w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${widget.badgeColor} shadow-lg z-10`}>
                    <WidgetIcon className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5 z-10">
                  <span className={`text-[10px] font-bold ${widget.badgeColor}`}>Watch Spotlight &rarr;</span>
                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-purple-600 hover:border-purple-500 flex items-center justify-center text-white active:scale-90 transition-all shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ESPORTS ARENA SECTION 🏆 */}
        <div id="section-esports" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Esports Tournaments & Live Arena
              </h2>
              <p className="text-[11px] text-gray-400">Live match scores, brackets and pro tournament highlights.</p>
            </div>
            <button 
              onClick={() => setIsEsportsModalOpen(true)}
              className="text-[11px] font-bold text-purple-400 hover:text-purple-300 transition-colors"
            >
              Full Schedule &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {esportsMatches.map((match) => (
              <div 
                key={match.id}
                onClick={() => onPlayVideo(match.replayVideo)}
                className="p-4 bg-gradient-to-b from-[#0f0c29]/70 to-[#070518]/90 border border-[#211a54]/50 rounded-2xl space-y-3 hover:border-purple-500/50 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-extrabold text-purple-300 uppercase tracking-wider truncate max-w-[70%]">
                    {match.tournament}
                  </span>
                  {match.status === 'LIVE' ? (
                    <span className="px-2 py-0.5 rounded bg-red-600/90 text-[9px] font-extrabold text-white flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      LIVE ({match.viewers})
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-gray-800 text-[9px] font-bold text-gray-400">
                      FINISHED
                    </span>
                  )}
                </div>

                {/* Team Vs Scorecard */}
                <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{match.teamA.logo}</span>
                    <span className="text-xs font-bold text-white">{match.teamA.name}</span>
                  </div>
                  <div className="px-3 py-1 bg-purple-950/80 border border-purple-500/30 rounded-lg text-xs font-black font-mono text-purple-300">
                    {match.teamA.score} - {match.teamB.score}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{match.teamB.name}</span>
                    <span className="text-xl">{match.teamB.logo}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                  <span>{match.time}</span>
                  <span className="text-purple-400 font-bold group-hover:underline">Watch Stream &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TRENDING GAMES SECTION */}
        <div id="section-trending-games" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Trending Games</h2>
              <p className="text-[11px] text-gray-400">The most popular games calculated by player activity & video views.</p>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => scrollContainer(trendingScrollRef, -280)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => scrollContainer(trendingScrollRef, 280)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div 
            ref={trendingScrollRef}
            className="flex gap-4 md:gap-5 overflow-x-auto pb-2 scrollbar-none scroll-smooth snap-x"
          >
            {trendingGames.map((game) => (
              <div 
                key={game.rank}
                onClick={() => onPlayVideo(game.video)}
                className="min-w-[220px] max-w-[240px] flex-1 bg-[#0f0e20]/50 border border-[#232049]/40 rounded-xl p-3 space-y-3 shrink-0 snap-start group hover:border-purple-500/30 hover:bg-[#0f0e20]/80 transition-all cursor-pointer"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-[#181142] flex items-center justify-center border border-[#2b2762]">
                  <div className={`absolute top-2 left-2 z-10 w-6 h-6 rounded-lg ${game.rankBadgeBg} flex items-center justify-center text-[11px] font-extrabold text-white shadow-md border border-white/15`}>
                    {game.rank}
                  </div>
                  <img src={game.coverUrl} alt={game.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <div className="w-9 h-9 rounded-full bg-purple-600 hover:scale-105 active:scale-95 flex items-center justify-center text-white shadow-md">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 text-[9px] px-1.5 py-0.5 bg-black/80 text-white rounded font-mono font-bold">{game.duration}</span>
                </div>

                <div className="text-left space-y-0.5">
                  <h4 className="font-bold text-[12.5px] text-white tracking-wide line-clamp-1 group-hover:text-purple-400 transition-colors">{game.title}</h4>
                  <div className="flex items-center gap-2 text-[10.5px]">
                    <span className="text-purple-400 font-semibold">{game.genre}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                    <span className="text-gray-400 font-medium">{game.followers}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LIVE GAME STREAMS 🔴 */}
        <div id="section-live-streams" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                Live Game Streams
              </h2>
              <p className="text-[11px] text-gray-400">Watch top gamers broadcasting live right now.</p>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => scrollContainer(liveStreamsScrollRef, -280)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => scrollContainer(liveStreamsScrollRef, 280)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div 
            ref={liveStreamsScrollRef}
            className="flex gap-4 md:gap-5 overflow-x-auto pb-2 scrollbar-none scroll-smooth snap-x"
          >
            {liveStreams.map((stream) => (
              <div 
                key={stream.id}
                onClick={() => openStreamerDrawer(stream)}
                className="min-w-[230px] max-w-[250px] flex-1 bg-[#09071c]/40 border border-[#201944]/30 rounded-xl p-3 space-y-3 shrink-0 snap-start group hover:border-red-500/30 hover:bg-[#09071c]/80 transition-all cursor-pointer"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black/40 border border-white/5">
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 bg-red-600 px-2 py-0.5 rounded font-bold text-[8.5px] uppercase tracking-wide text-white shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    LIVE
                  </div>
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded text-[8.5px] font-extrabold text-gray-200">
                    <Users className="w-2.5 h-2.5 text-gray-400" />
                    {stream.viewers}
                  </div>
                  <img src={stream.coverUrl} alt={stream.streamer} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <div className="w-9 h-9 rounded-full bg-red-600 hover:scale-105 active:scale-95 flex items-center justify-center text-white shadow-md">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-left pt-0.5">
                  <div className="relative shrink-0">
                    <img src={stream.avatarUrl} alt="" className="w-8 h-8 rounded-full border border-purple-500/30 object-cover" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-[#09071c] rounded-full" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-[12px] text-white truncate">{stream.streamer}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-current shrink-0" />
                    </div>
                    <p className="text-[10px] text-gray-400 truncate">{stream.game}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GAME GUIDES & WALKTHROUGHS 📖 */}
        <div id="section-game-guides" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-400" />
                Game Guides & Walkthroughs
              </h2>
              <p className="text-[11px] text-gray-400">Master mechanics, aim routines, and boss strategies.</p>
            </div>
            <div className="flex items-center gap-2">
              {['all', 'Pro', 'Intermediate'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setGuideDifficultyFilter(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all ${
                    guideDifficultyFilter === lvl ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gameGuides
              .filter(g => guideDifficultyFilter === 'all' || g.difficulty === guideDifficultyFilter)
              .map((guide) => (
                <div 
                  key={guide.id}
                  onClick={() => onPlayVideo(guide.video)}
                  className="p-4 bg-[#091518]/60 border border-[#143e42]/50 rounded-2xl space-y-3 hover:border-teal-500/40 transition-all cursor-pointer group"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40">
                    <img src={guide.coverUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-teal-950/90 border border-teal-500/40 text-[9px] font-bold text-teal-300">
                      {guide.difficulty}
                    </span>
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-[9px] font-mono text-gray-200 rounded">
                      {guide.readTime}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white group-hover:text-teal-300 line-clamp-2">{guide.title}</h4>
                    <p className="text-[10px] text-gray-400">{guide.author} • {guide.views} views</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* UPCOMING GAME RELEASES 🚀 */}
        <div id="section-upcoming-releases" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Calendar className="w-5 h-5 text-rose-400" />
                New Releases & Calendar
              </h2>
              <p className="text-[11px] text-gray-400">Track upcoming launches and set instant release notifications.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {releases.map((rel) => (
              <div 
                key={rel.id}
                className="p-4 bg-[#140812]/70 border border-[#3b1233]/40 rounded-2xl space-y-3 flex flex-col justify-between hover:border-rose-500/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40">
                    <img src={rel.coverUrl} alt="" className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-rose-950/90 border border-rose-500/40 text-[9px] font-bold text-rose-300 rounded-full">
                      {rel.releaseDate}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{rel.title}</h4>
                    <p className="text-[10px] text-gray-400">{rel.developer}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {rel.platforms.map((p, idx) => (
                      <span key={idx} className="text-[8.5px] px-1.5 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-gray-300">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => toggleReleaseNotify(rel.id, rel.title)}
                  className={`w-full py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                    rel.notified ? 'bg-rose-600 text-white' : 'bg-white/5 hover:bg-white/10 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{rel.notified ? 'Eslatma Qo`shildi ✓' : 'Notify Release'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* GAMING COMMUNITIES HUB 🌐 */}
        <div id="section-communities" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-400" />
                Gaming Communities & Clans
              </h2>
              <p className="text-[11px] text-gray-400">Join gaming hubs to find squadmates, tips, and custom lobby tournaments.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {communities.map((com) => (
              <div 
                key={com.id}
                className="p-4 bg-[#0d0a28]/70 border border-[#231d5e]/40 rounded-2xl space-y-3 flex flex-col justify-between hover:border-indigo-500/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <img src={com.coverUrl} alt="" className="w-10 h-10 rounded-xl object-cover border border-purple-500/30 shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{com.name}</h4>
                      <p className="text-[10px] text-indigo-300 font-medium">{com.game}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 bg-white/5 p-2 rounded-lg">
                    <span>{com.members}</span>
                    <span>{com.posts}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleCommunityJoin(com.id, com.name)}
                  className={`w-full py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                    com.joined ? 'bg-indigo-600 text-white' : 'bg-white/5 hover:bg-white/10 text-indigo-300 border border-indigo-500/30'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{com.joined ? 'Qo`shilingan ✓' : 'Join Community'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* GAME CATEGORIES SLIDER */}
        <div id="section-categories" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Game Categories</h2>
              <p className="text-[11px] text-gray-400">Explore games by genre.</p>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => scrollContainer(categoriesScrollRef, -200)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => scrollContainer(categoriesScrollRef, 200)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div 
            ref={categoriesScrollRef}
            className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-none scroll-smooth snap-x"
          >
            {categories.map((cat, idx) => {
              const CatIcon = cat.icon;
              const isSelected = activeCategoryFilter === cat.name.toLowerCase();
              return (
                <div 
                  key={idx}
                  onClick={() => setActiveCategoryFilter(isSelected ? 'all' : cat.name.toLowerCase())}
                  className={`min-w-[150px] md:min-w-[170px] flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300 cursor-pointer snap-start ${cat.bg} ${cat.border} ${cat.glow} ${
                    isSelected ? 'border-purple-500 bg-purple-950/25 scale-[1.02]' : 'hover:scale-[1.02] hover:border-purple-500/20'
                  }`}
                >
                  <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${cat.color} shrink-0`}>
                    <CatIcon className="w-5 h-5" />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="block font-bold text-xs text-white truncate">{cat.name}</span>
                    <span className="block text-[10px] text-gray-400 truncate">{cat.videos}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </motion.div>

      {/* KILLER FEATURE MODAL 1: AI GAME COACH CHAT 🤖 */}
      <AnimatePresence>
        {isAiCoachOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-[#0d0926] border border-purple-500/40 rounded-3xl shadow-2xl flex flex-col h-[82vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 bg-[#140e3b] border-b border-purple-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                    <Bot className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      SoftCast AI Game Coach
                      <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded font-mono">24/7 ONLINE</span>
                    </h3>
                    <p className="text-[11px] text-gray-400">Aim, Mechanics, Sensitivity & Tactical Analysis</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select 
                    value={coachGame}
                    onChange={(e) => setCoachGame(e.target.value)}
                    className="bg-[#09061d] border border-purple-500/30 text-xs text-purple-200 px-2.5 py-1 rounded-xl outline-none font-bold"
                  >
                    <option value="VALORANT">VALORANT</option>
                    <option value="Call of Duty">Call of Duty</option>
                    <option value="CS2">Counter-Strike 2</option>
                    <option value="Elden Ring">Elden Ring</option>
                    <option value="Minecraft">Minecraft</option>
                  </select>
                  <button onClick={() => setIsAiCoachOpen(false)} className="text-gray-400 hover:text-white p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#080518]">
                {coachMessages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-purple-600 text-white rounded-br-none shadow-md' 
                        : 'bg-[#15103b] border border-purple-500/30 text-gray-100 rounded-bl-none shadow'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-gray-500 mt-1 px-1 font-mono">{msg.timestamp}</span>
                  </div>
                ))}
                {coachLoading && (
                  <div className="flex items-center gap-2 text-xs text-purple-400 italic">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>AI Coach tactikal xaritani tahlil qilmoqda...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-[#110c30] border-t border-purple-500/30 flex items-center gap-2">
                <input
                  type="text"
                  value={coachInput}
                  onChange={(e) => setCoachInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendCoachMessage()}
                  placeholder={`Ask Coach about ${coachGame} aim, lineups, sensitivity...`}
                  className="flex-1 bg-[#09061d] border border-purple-500/30 text-white px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-purple-500 placeholder:text-gray-500"
                />
                <button
                  onClick={handleSendCoachMessage}
                  disabled={coachLoading}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* KILLER FEATURE MODAL 2: RANK PROGRESSION ROADMAP 🏆 */}
      <AnimatePresence>
        {isRankRoadmapOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-[#0d0926] border border-purple-500/40 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            >
              <div className="p-4 bg-[#140e3b] border-b border-purple-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">AI Gaming Rank Roadmap</h3>
                    <p className="text-[11px] text-gray-400">Synthesize daily training drills to reach peak competitive rank.</p>
                  </div>
                </div>
                <button onClick={() => setIsRankRoadmapOpen(false)} className="text-gray-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-5 bg-[#080518]">
                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 mb-1 block">Selected Game</label>
                    <select
                      value={roadmapGame}
                      onChange={(e) => setRoadmapGame(e.target.value)}
                      className="w-full bg-[#120c33] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white outline-none font-bold"
                    >
                      <option value="VALORANT">VALORANT</option>
                      <option value="Counter-Strike 2">Counter-Strike 2</option>
                      <option value="Call of Duty: Warzone">Call of Duty: Warzone</option>
                      <option value="Apex Legends">Apex Legends</option>
                      <option value="Overwatch 2">Overwatch 2</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 mb-1 block">Target Rank</label>
                    <select
                      value={roadmapTarget}
                      onChange={(e) => setRoadmapTarget(e.target.value)}
                      className="w-full bg-[#120c33] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white outline-none font-bold"
                    >
                      <option value="Immortal / Radiant">Immortal / Radiant</option>
                      <option value="Ascendant / Diamond">Ascendant / Diamond</option>
                      <option value="Global Elite">Global Elite</option>
                      <option value="Master / Predator">Master / Predator</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGenerateRankRoadmap}
                  disabled={isGeneratingRoadmap}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isGeneratingRoadmap ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Roadmap AI Tomonidan Yaratilmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Rank Oshirish Xaritasini Yaratish ✨</span>
                    </>
                  )}
                </button>

                {/* Generated Roadmap Display */}
                {generatedRoadmap && (
                  <div className="p-4 bg-[#110c30] border border-purple-500/30 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-white">{generatedRoadmap.title}</h4>
                        <p className="text-[10.5px] text-purple-300">Estimated Duration: {generatedRoadmap.estimatedDays} Days</p>
                      </div>
                      <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold rounded-lg">
                        Target: {generatedRoadmap.targetRank}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {generatedRoadmap.phases?.map((phase: any, pIdx: number) => (
                        <div key={pIdx} className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-purple-300">{phase.phaseName}</span>
                            <span className="text-[9.5px] font-mono text-gray-400">{phase.focusArea}</span>
                          </div>
                          <p className="text-[11px] text-gray-300 leading-snug">{phase.dailyRoutine}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {phase.keyMetrics?.map((m: string, mIdx: number) => (
                              <span key={mIdx} className="text-[9px] px-2 py-0.5 bg-purple-950/60 text-purple-200 border border-purple-500/30 rounded font-mono">
                                ✓ {m}
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

      {/* STREAMER DRAWER & QUICK CHAT MODAL 🔴 */}
      <AnimatePresence>
        {selectedStreamer && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-lg h-full bg-[#0d0926] border-l border-purple-500/30 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="relative h-44 bg-purple-950">
                <img src={selectedStreamer.coverUrl} alt="" className="w-full h-full object-cover opacity-60" />
                <button 
                  onClick={() => setSelectedStreamer(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute -bottom-6 left-6 flex items-end gap-3">
                  <img src={selectedStreamer.avatarUrl} alt="" className="w-16 h-16 rounded-2xl border-2 border-purple-500 object-cover shadow-xl" />
                  <div className="mb-1">
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      {selectedStreamer.name}
                      <CheckCircle2 className="w-4 h-4 text-blue-400 fill-current" />
                    </h3>
                    <p className="text-[11px] text-purple-300">{selectedStreamer.game} • {selectedStreamer.viewers} Live Viewers</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 p-6 space-y-5 overflow-y-auto mt-6">
                <p className="text-xs text-gray-300 leading-relaxed">{selectedStreamer.bio}</p>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      if (selectedStreamerVideo) onPlayVideo(selectedStreamerVideo);
                    }}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 active:scale-95 shadow-lg"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Watch Stream Live</span>
                  </button>
                  <button 
                    onClick={() => {
                      showToast(`💖 ${selectedStreamer.name} kuzatib borilmoqda!`);
                    }}
                    className="px-4 py-2.5 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 font-bold text-xs rounded-xl active:scale-95"
                  >
                    Follow Streamer
                  </button>
                </div>

                {/* Live Stream Chat Preview */}
                <div className="p-3 bg-[#110c30] border border-purple-500/30 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    Live Stream Chat Room
                  </h4>
                  <div className="h-36 overflow-y-auto space-y-2 text-xs">
                    {streamChat.map((c, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className={`font-bold ${c.color}`}>{c.user}:</span>
                        <span className="text-gray-200">{c.text}</span>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSendStreamChat} className="flex gap-2 pt-2 border-t border-white/10">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Send a chat message..."
                      className="flex-1 bg-black/40 border border-purple-500/30 text-xs text-white px-3 py-1.5 rounded-lg outline-none"
                    />
                    <button type="submit" className="px-3 py-1.5 bg-purple-600 text-xs font-bold text-white rounded-lg">
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
