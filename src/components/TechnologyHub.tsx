import React, { useRef, useState } from 'react';
import { 
  Cpu, Smartphone, Network, Globe, Cloud, Shield, Terminal, Wrench, 
  Mic, Trophy, Sparkles, ChevronRight, ChevronLeft, Play, CheckCircle2, 
  Users, Radio, Eye, Compass, Atom, Server, Workflow, Brain,
  Layers, SmartphoneIcon, Laptop, Settings, Search, X, Bot, Star,
  Bookmark, Heart, Share2, MessageSquare, Send, Check, RefreshCw
} from 'lucide-react';
import { Video } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface TechnologyHubProps {
  videos?: Video[];
  onPlayVideo: (video: Video) => void;
  isPremium: boolean;
}

interface ProductReview {
  id: string;
  productName: string;
  category: string;
  rating: number;
  verdict: string;
  pros: string[];
  cons: string[];
  keySpecs: string[];
  coverUrl: string;
  video: Video;
}

export default function TechnologyHub({ videos = [], onPlayVideo, isPremium }: TechnologyHubProps) {
  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Scroll refs for horizontal layouts
  const trendingScrollRef = useRef<HTMLDivElement>(null);
  const deepDivesScrollRef = useRef<HTMLDivElement>(null);
  const playlistsScrollRef = useRef<HTMLDivElement>(null);
  const newThisWeekScrollRef = useRef<HTMLDivElement>(null);
  const topicsScrollRef = useRef<HTMLDivElement>(null);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, offset: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTopicFilter, setActiveTopicFilter] = useState<string>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  // Modal / Drawer States
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductReview | null>(null);

  // AI Tech Assistant State
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantTopic, setAssistantTopic] = useState('Hardware & Chips');
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState<{ sender: 'user' | 'assistant'; text: string; timestamp: string }[]>([
    {
      sender: 'assistant',
      text: "Salom! Men SoftCast AI Tech Assistant'man. RTX GPU'lar, Quantum hisoblash, AI modellari, chip mikroarxitekturalari yoki dasturlash bo'yicha savollaringizga javob beraman.",
      timestamp: 'Just now'
    }
  ]);

  // Sample Hardware Product Reviews Data
  const productReviews: ProductReview[] = [
    {
      id: 'rev-1',
      productName: 'NVIDIA RTX 5090 Blackwell',
      category: 'GPU & Graphics',
      rating: 4.9,
      verdict: 'The pinnacle of enthusiast graphics hardware delivering unmatched 4K 240Hz ray-tracing and AI tensor acceleration.',
      pros: ['32GB GDDR7 Ultra-Speed Memory', 'DLSS 4 Neural Frame Synthesis', '35% Higher Compute Efficiency'],
      cons: ['500W High TGP Power Requirement', 'Premium Enthusiast Price Point', 'Large 3.5-Slot Form Factor'],
      keySpecs: ['24,576 CUDA Cores', '32GB GDDR7 VRAM', '512-bit Memory Bus', 'PCIe 5.0 x16'],
      coverUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop',
      video: {
        id: 'rev-vid-1',
        title: 'NVIDIA RTX 5090 - Deep Architectural Benchmark & 4K Ray Tracing Test',
        description: 'Exhaustive thermal, clock speed, and DLSS 4 frame rendering analysis on the new RTX flagship GPU.',
        category: 'technology',
        coverUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop',
        duration: '18:40',
        views: '1.4M views',
        uploadDate: '3 days ago',
        creator: 'TechSource',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/SgXDxS6Jv8o'
      }
    },
    {
      id: 'rev-2',
      productName: 'Apple M4 iPad Pro (13-inch)',
      category: 'Tablets & Mobility',
      rating: 4.8,
      verdict: 'Mind-blowing Tandem OLED display technology paired with class-leading single-core CPU efficiency.',
      pros: ['Ultra Retina XDR Tandem OLED', 'M4 Chip Neural Engine 38 TOPS', 'Impossibly Thin 5.1mm Body'],
      cons: ['iPadOS Still Limits Pro Workflows', 'Expensive Apple Pencil Pro Addon', 'No Thunderbolt Multi-Monitor Desktop Mode'],
      keySpecs: ['38 TOPS NPU', '10-core CPU / 10-core GPU', 'Tandem OLED 1000 nits', 'Thunderbolt 4 Port'],
      coverUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop',
      video: {
        id: 'rev-vid-2',
        title: 'Apple M4 iPad Pro - Long Term Review & OLED Screen Benchmark',
        description: 'Testing display accuracy, audio clarity, rendering times, and battery durability.',
        category: 'technology',
        coverUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop',
        duration: '16:15',
        views: '920K views',
        uploadDate: '1 week ago',
        creator: 'TechLab',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/e_E9W2vsRbA'
      }
    },
    {
      id: 'rev-3',
      productName: 'Samsung Galaxy Z Fold 6',
      category: 'Foldable Smartphones',
      rating: 4.6,
      verdict: 'Refined armor aluminum chassis and dual-screen AI multitasking make this the king of productivity foldables.',
      pros: ['Sighter Lighter & Squared Form Factor', 'Galaxy AI Real-Time Dual Screen Translation', '7 Years OS Updates'],
      cons: ['Camera Hardware Unchanged from Fold 5', 'S-Pen Slot Still Not Built-in', 'Premium Foldable Price Tag'],
      keySpecs: ['Snapdragon 8 Gen 3', '7.6" Dynamic AMOLED 2X', '50MP Triple Camera', 'IP48 Water Resistance'],
      coverUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop',
      video: {
        id: 'rev-vid-3',
        title: 'Samsung Galaxy Z Fold 6 - The Ultimate Multitasker Review',
        description: 'Crease resistance test, hinge torque evaluation, and Galaxy AI translation features in depth.',
        category: 'technology',
        coverUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop',
        duration: '13:27',
        views: '650K views',
        uploadDate: '4 days ago',
        creator: 'MobileTech',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/AKXiKBnzpUQ'
      }
    }
  ];

  // Top 4 Spotlight widgets matching design layout
  const spotlightWidgets = [
    {
      id: 'tech-news',
      title: 'Latest Tech News',
      sub: 'Stay updated with the latest in tech',
      color: 'from-[#2e1c6b]/30 to-[#070514]/15',
      borderColor: 'border-[#4c249a]/30',
      glowColor: 'bg-indigo-600/10',
      badgeColor: 'text-indigo-400',
      icon: Globe,
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop',
      video: {
        id: 'tech-spotlight-news',
        title: 'Technology News Roundup - AI, Hardware & Startups',
        description: 'Your ultimate weekly digest covering major breakthroughs in artificial intelligence, chip architecture, and global tech movements.',
        category: 'technology' as const,
        coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
        duration: '14:20',
        views: '1.2M views',
        uploadDate: '3 days ago',
        creator: 'TechNews Global',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/SgXDxS6Jv8o'
      }
    },
    {
      id: 'tech-reviews',
      title: 'Tech Reviews',
      sub: 'Honest reviews and in-depth tests',
      color: 'from-[#4e104e]/20 to-[#0d041c]/10',
      borderColor: 'border-[#8e1d8e]/30',
      glowColor: 'bg-fuchsia-600/10',
      badgeColor: 'text-fuchsia-400',
      icon: Smartphone,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop',
      video: {
        id: 'tech-spotlight-reviews',
        title: 'The Real Truth: Ultimate Smartphone Comparison & In-depth Battery Test',
        description: 'Putting this years flagship smartphones through extensive processing, battery drain, thermal, and camera sensor benchmark tests.',
        category: 'technology' as const,
        coverUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop',
        duration: '22:15',
        views: '840K views',
        uploadDate: '2 days ago',
        creator: 'Flagship Labs',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/e_E9W2vsRbA'
      }
    },
    {
      id: 'how-it-works',
      title: 'How It Works',
      sub: 'Understand the technology behind everything',
      color: 'from-[#072d42]/35 to-[#020d1c]/10',
      borderColor: 'border-[#0a5276]/30',
      glowColor: 'bg-cyan-600/10',
      badgeColor: 'text-cyan-400',
      icon: Cpu,
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop',
      video: {
        id: 'tech-spotlight-how',
        title: 'How Microchips are Actually Made - ASML EUV Explained',
        description: 'Explore the fascinating and extreme physics behind lithography, silicon refinement, and sub-nanometer etching.',
        category: 'technology' as const,
        coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
        duration: '18:40',
        views: '1.9M views',
        uploadDate: '5 days ago',
        creator: 'Silicon Valley Insights',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/AKXiKBnzpUQ'
      }
    },
    {
      id: 'future-tech',
      title: 'Future Tech',
      sub: "Discover tomorrow's technology today",
      color: 'from-[#103a3d]/25 to-[#030e15]/10',
      borderColor: 'border-[#1b5e63]/30',
      glowColor: 'bg-teal-600/10',
      badgeColor: 'text-teal-400',
      icon: Sparkles,
      imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&auto=format&fit=crop',
      video: {
        id: 'tech-spotlight-future',
        title: 'Beyond 2030: Tech That Will Change Humanity Forever',
        description: 'An expansive investigation into nuclear fusion, molecular nanotechnology, space habitats, and brain-computer interfaces.',
        category: 'technology' as const,
        coverUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop',
        duration: '29:50',
        views: '2.4M views',
        uploadDate: '1 week ago',
        creator: 'Horizon Science',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/WJW-VfbyRHI'
      }
    }
  ];

  // 1. Trending in Technology list
  const trendingTech = [
    {
      id: 'tr-1',
      title: 'The Rise of Artificial Intelligence',
      creator: 'TechFlow',
      views: '1.2M views',
      duration: '18:45',
      coverUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop',
      creatorVerified: true,
      video: {
        id: 'tech-trend-1',
        title: 'The Rise of Artificial Intelligence: What Lies Ahead',
        description: 'An deep exploration into generalized models, training compute requirements, and autonomous multi-agent networks changing software development.',
        category: 'technology' as const,
        coverUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop',
        duration: '18:45',
        views: '1.2M views',
        uploadDate: '3 days ago',
        creator: 'TechFlow',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/SgXDxS6Jv8o'
      }
    },
    {
      id: 'tr-2',
      title: 'Apple M4 Chip - Full Breakdown',
      creator: 'TechLab',
      views: '842K views',
      duration: '14:22',
      coverUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop',
      creatorVerified: true,
      video: {
        id: 'tech-trend-2',
        title: 'Apple M4 Architecture & Thermal Core Breakdown',
        description: "Let's analyze the microarchitectural upgrades in the M4 series processors, GPU ray tracing acceleration, and neural engine throughput benchmarks.",
        category: 'technology' as const,
        coverUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop',
        duration: '14:22',
        views: '842K views',
        uploadDate: 'Yesterday',
        creator: 'TechLab',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/e_E9W2vsRbA'
      }
    },
    {
      id: 'tr-3',
      title: 'Tesla Cybertruck - Inside & Out',
      creator: 'CarTech',
      views: '765K views',
      duration: '16:31',
      coverUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop',
      creatorVerified: true,
      video: {
        id: 'tech-trend-3',
        title: 'Tesla Cybertruck - Offroad and Tech System Review',
        description: 'Diving deep into the 48V steer-by-wire electrical architecture, raw stainless steel durability tests, and theater console UX.',
        category: 'technology' as const,
        coverUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop',
        duration: '16:31',
        views: '765K views',
        uploadDate: '4 days ago',
        creator: 'CarTech',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/AKXiKBnzpUQ'
      }
    },
    {
      id: 'tr-4',
      title: 'Windows 12 - First Look',
      creator: 'ProTech',
      views: '612K views',
      duration: '13:10',
      coverUrl: 'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?w=600&auto=format&fit=crop',
      creatorVerified: true,
      video: {
        id: 'tech-trend-4',
        title: 'Windows 12 - New Core Shell & AI Integration First Look',
        description: 'Previewing the floating taskbar, centralized AI copilot, customized workspaces, and advanced virtual desktop frameworks of the upcoming OS.',
        category: 'technology' as const,
        coverUrl: 'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?w=800&auto=format&fit=crop',
        duration: '13:10',
        views: '612K views',
        uploadDate: '5 days ago',
        creator: 'ProTech',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/MmB9b5njVbA'
      }
    },
    {
      id: 'tr-5',
      title: 'NVIDIA RTX 50 Series Explained',
      creator: 'TechSource',
      views: '593K views',
      duration: '12:05',
      coverUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop',
      creatorVerified: true,
      video: {
        id: 'tech-trend-5',
        title: 'NVIDIA Blackwell & RTX 5090 Architecture Explained',
        description: 'Analyzing the specs, PCIe Gen 5 configurations, memory bandwidth upgrades, and frame-generation deep neural net revisions.',
        category: 'technology' as const,
        coverUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop',
        duration: '12:05',
        views: '593K views',
        uploadDate: '1 week ago',
        creator: 'TechSource',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/WJW-VfbyRHI'
      }
    }
  ];

  // 2. Tech Deep Dives list (>20 min)
  const deepDives = [
    {
      id: 'dd-1',
      title: 'How Data Centers Power The Internet',
      creator: 'NetworkHub',
      views: '1.1M views',
      duration: '32:18',
      coverUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop',
      creatorVerified: true,
      video: {
        id: 'tech-dive-1',
        title: 'The Hidden Backbone: Global Data Center Architecture',
        description: 'A detailed look inside hyperscale server facilities, active cooling architectures, fiber optic loops, and backup energy matrix grids.',
        category: 'technology' as const,
        coverUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop',
        duration: '32:18',
        views: '1.1M views',
        uploadDate: '1 week ago',
        creator: 'NetworkHub',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/SgXDxS6Jv8o'
      }
    },
    {
      id: 'dd-2',
      title: 'SpaceX Starship - Full Analysis',
      creator: 'Space Zone',
      views: '987K views',
      duration: '28:45',
      coverUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=600&auto=format&fit=crop',
      creatorVerified: true,
      video: {
        id: 'tech-dive-2',
        title: 'SpaceX Starship Orbital Velocity & Raptor Engine telemetry',
        description: 'Diving deep into the full flight mechanics, methalox thrust performance ratios, stainless steel heat shielding panels, and hot staging mechanics.',
        category: 'technology' as const,
        coverUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&auto=format&fit=crop',
        duration: '28:45',
        views: '987K views',
        uploadDate: '3 days ago',
        creator: 'Space Zone',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/e_E9W2vsRbA'
      }
    },
    {
      id: 'dd-3',
      title: 'Quantum Computing Explained',
      creator: 'TechMind',
      views: '812K views',
      duration: '26:33',
      coverUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop',
      creatorVerified: true,
      video: {
        id: 'tech-dive-3',
        title: 'Quantum Computing - Superposition, Entanglement & Qubits',
        description: "Understand the math, helium refrigeration shells, and algorithms (Shor's/Grover's) that could revolutionize cybersecurity and material science.",
        category: 'technology' as const,
        coverUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop',
        duration: '26:33',
        views: '812K views',
        uploadDate: 'Yesterday',
        creator: 'TechMind',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/AKXiKBnzpUQ'
      }
    },
    {
      id: 'dd-4',
      title: 'Cybersecurity in 2026',
      creator: 'CyberSec',
      views: '723K views',
      duration: '22:19',
      coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop',
      creatorVerified: true,
      video: {
        id: 'tech-dive-4',
        title: 'Modern Cyber Warfare: Firewalls, Ransomware & Zero Days',
        description: 'An critical breakdown of sovereign cyber operations, sandbox execution evasion, and next-generation zero-trust framework designs.',
        category: 'technology' as const,
        coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop',
        duration: '22:19',
        views: '723K views',
        uploadDate: '6 days ago',
        creator: 'CyberSec',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/MmB9b5njVbA'
      }
    }
  ];

  // 3. Popular Playlists
  const playlists = [
    {
      id: 'pl-1',
      title: 'Programming Mastery',
      videoCount: 120,
      icon: Terminal,
      bg: 'bg-[#12102e]/60',
      borderColor: 'border-[#2d226a]/50',
      iconColor: 'text-violet-400',
      video: {
        id: 'pl-vid-1',
        title: 'The Ultimate Web Architect Path: 0 to Production Ready',
        description: 'Comprehensive pathway covering TypeScript backend systems, container configurations, robust unit test coverage, and edge load balancers.',
        category: 'technology' as const,
        coverUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop',
        duration: '45:30',
        views: '2.5M views',
        uploadDate: '1 month ago',
        creator: 'CodeArchitect',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/K8_vsk6lPTo'
      }
    },
    {
      id: 'pl-2',
      title: 'Linux & Open Source',
      videoCount: 85,
      icon: Layers,
      bg: 'bg-[#181a0b]/60',
      borderColor: 'border-[#3a3d13]/50',
      iconColor: 'text-yellow-400',
      video: {
        id: 'pl-vid-2',
        title: 'Advanced Linux Kernel Tuning & Bash Automation',
        description: 'Configure and compile custom kernels, tweak file system limits, design non-blocking bash scripts, and secure SSH tunnels properly.',
        category: 'technology' as const,
        coverUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop',
        duration: '28:15',
        views: '1.2M views',
        uploadDate: '2 weeks ago',
        creator: 'KernelMaster',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/yP6m5M36n4E'
      }
    },
    {
      id: 'pl-3',
      title: 'Smartphones Reviews',
      videoCount: 64,
      icon: SmartphoneIcon,
      bg: 'bg-[#1e0a26]/60',
      borderColor: 'border-[#49165b]/50',
      iconColor: 'text-purple-400',
      video: {
        id: 'pl-vid-3',
        title: 'Every Major Smartphone Unboxed and Reviewed',
        description: 'Exhaustive head-to-head camera shootout benchmarks, display color correctness analytics, and daily driver experience evaluations.',
        category: 'technology' as const,
        coverUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop',
        duration: '31:40',
        views: '980K views',
        uploadDate: '3 days ago',
        creator: 'Gadget Guru',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/A8g2DshCq8y'
      }
    },
    {
      id: 'pl-4',
      title: 'Build & Setup Guides',
      videoCount: 92,
      icon: Wrench,
      bg: 'bg-[#1d0e0a]/60',
      borderColor: 'border-[#4e1f14]/50',
      iconColor: 'text-orange-400',
      video: {
        id: 'pl-vid-4',
        title: 'Ultimate PC Cable Management & Airflow Optimization',
        description: 'Step-by-step masterclass guiding physical desktop assembly, clean cabling routes, static pressure fan curves, and quiet cooling loops.',
        category: 'technology' as const,
        coverUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop',
        duration: '19:55',
        views: '1.4M views',
        uploadDate: '10 days ago',
        creator: 'SetupCraft',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/5Nct8hG1mZ8'
      }
    }
  ];

  // 4. New This Week list
  const newThisWeek = [
    {
      id: 'nw-1',
      title: 'ASUS ROG Ally X - Handheld PC Review',
      creator: 'GadgetHub',
      views: '45K views',
      timeAgo: '2 days ago',
      duration: '11:32',
      coverUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&auto=format&fit=crop',
      video: {
        id: 'tech-new-1',
        title: 'ASUS ROG Ally X Review - The Handheld PC Perfected?',
        description: 'Testing the expanded battery capacities, improved ergonomics, higher performance RAM bandwidth, and revised heat dissipation vents.',
        category: 'technology' as const,
        coverUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=800&auto=format&fit=crop',
        duration: '11:32',
        views: '45K views',
        uploadDate: '2 days ago',
        creator: 'GadgetHub',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/K8_vsk6lPTo'
      }
    },
    {
      id: 'nw-2',
      title: 'AirPods Pro 3 - What\'s New?',
      creator: 'TechReview',
      views: '38K views',
      timeAgo: '3 days ago',
      duration: '10:48',
      coverUrl: 'https://images.unsplash.com/photo-1588449668338-d151688c3482?w=600&auto=format&fit=crop',
      video: {
        id: 'tech-new-2',
        title: 'AirPods Pro 3 - Audio Transparency & Hearing Health Test',
        description: 'Analyzing the H3 processing chip capability, hybrid computational active noise isolation systems, and lossless wireless playback.',
        category: 'technology' as const,
        coverUrl: 'https://images.unsplash.com/photo-1588449668338-d151688c3482?w=800&auto=format&fit=crop',
        duration: '10:48',
        views: '38K views',
        uploadDate: '3 days ago',
        creator: 'TechReview',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/yP6m5M36n4E'
      }
    },
    {
      id: 'nw-3',
      title: 'Humanoid Factory Robots Deployed',
      creator: 'Future Tech',
      views: '67K views',
      timeAgo: '4 days ago',
      duration: '14:21',
      coverUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop',
      video: {
        id: 'tech-new-3',
        title: 'Humanoid Robots Entering Factories - Actual Deployment Cases',
        description: 'Diving deep into sensory feedback, actuator mechanics, neural vision positioning, and reinforcement learning schedules of industrial humanoids.',
        category: 'technology' as const,
        coverUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop',
        duration: '14:21',
        views: '67K views',
        uploadDate: '4 days ago',
        creator: 'Future Tech',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/A8g2DshCq8y'
      }
    }
  ];

  // 5. Tech Topics list
  const topics = [
    { name: 'AI & Machine Learning', videos: '3.2K videos', icon: Brain, bg: 'bg-[#1b0d26]/80', border: 'border-[#431962]/50', color: 'text-fuchsia-400', glow: 'shadow-[0_0_15px_-3px_rgba(217,70,239,0.15)]' },
    { name: 'Programming', videos: '8.7K videos', icon: Terminal, bg: 'bg-[#0d1c2b]/80', border: 'border-[#1b3d62]/50', color: 'text-blue-400', glow: 'shadow-[0_0_15px_-3px_rgba(59,130,246,0.15)]' },
    { name: 'Gadgets', videos: '4.1K videos', icon: SmartphoneIcon, bg: 'bg-[#230a1c]/80', border: 'border-[#4c163a]/50', color: 'text-pink-400', glow: 'shadow-[0_0_15px_-3px_rgba(244,63,94,0.15)]' },
    { name: 'Cybersecurity', videos: '2.6K videos', icon: Shield, bg: 'bg-[#200b12]/80', border: 'border-[#4b1424]/50', color: 'text-rose-400', glow: 'shadow-[0_0_15px_-3px_rgba(244,63,94,0.15)]' },
    { name: 'Cloud Computing', videos: '2.3K videos', icon: Cloud, bg: 'bg-[#061c28]/80', border: 'border-[#0c3951]/50', color: 'text-cyan-400', glow: 'shadow-[0_0_15px_-3px_rgba(6,182,212,0.15)]' },
    { name: 'Automation', videos: '1.8K videos', icon: Settings, bg: 'bg-[#0d1e17]/80', border: 'border-[#1a3f30]/50', color: 'text-emerald-400', glow: 'shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)]' },
    { name: 'Web Development', videos: '6.4K videos', icon: Globe, bg: 'bg-[#140b2a]/80', border: 'border-[#2c155d]/50', color: 'text-violet-400', glow: 'shadow-[0_0_15px_-3px_rgba(139,92,246,0.15)]' },
    { name: 'Networking', videos: '2.0K videos', icon: Network, bg: 'bg-[#0d222b]/80', border: 'border-[#144759]/50', color: 'text-teal-400', glow: 'shadow-[0_0_15px_-3px_rgba(20,184,166,0.15)]' }
  ];

  // Send AI Assistant Chat Message
  const handleSendAssistantMessage = async () => {
    if (!assistantInput.trim()) return;
    const msgText = assistantInput.trim();
    setAssistantInput('');

    setAssistantMessages(prev => [...prev, { sender: 'user', text: msgText, timestamp: 'Just now' }]);
    setAssistantLoading(true);

    try {
      const res = await fetch('/api/ai-tech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'tech_assistant', prompt: msgText, topic: assistantTopic })
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setAssistantMessages(prev => [...prev, { sender: 'assistant', text: data.reply, timestamp: 'Just now' }]);
      }
    } catch (err) {
      console.error(err);
      setAssistantMessages(prev => [...prev, {
        sender: 'assistant',
        text: `⚡ Tech Analysis: "${msgText}" bo'yicha eng so'nggi xulosalarimiz: Tizim unumdorligini 40% ga oshirish uchun zamonaviy chip va async arxitekturadan foydalaning.`,
        timestamp: 'Just now'
      }]);
    } finally {
      setAssistantLoading(false);
    }
  };

  // Toggle Bookmark
  const toggleBookmark = (id: string, title: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(prev => prev.filter(i => i !== id));
      showToast(`🔕 "${title}" xatcho'plardan olib tashlandi.`);
    } else {
      setBookmarkedIds(prev => [...prev, id]);
      showToast(`🔖 "${title}" saqlangan videolar ro'yxatiga qo'shildi!`);
    }
  };

  // Toggle Like
  const toggleLike = (id: string, title: string) => {
    if (likedIds.includes(id)) {
      setLikedIds(prev => prev.filter(i => i !== id));
      showToast(`Baho bekor qilindi.`);
    } else {
      setLikedIds(prev => [...prev, id]);
      showToast(`❤️ "${title}" videosiga layk bosildi!`);
    }
  };

  return (
    <div 
      id="tech-page-main-container" 
      className="w-full h-full text-left bg-[#030208] text-white overflow-y-auto max-h-[calc(100vh-4.5rem)] scrollbar-thin scrollbar-thumb-indigo-900/40 select-none pb-28 relative font-sans"
    >
      {/* GLOBAL TOAST OVERLAY */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            className="fixed top-20 right-8 z-50 bg-[#15102d] border border-[#5239a0]/80 px-4 py-3 rounded-xl flex items-center gap-3 shadow-2xl text-xs max-w-sm"
          >
            <Sparkles className="w-4.5 h-4.5 text-indigo-400 shrink-0 animate-pulse" />
            <p className="text-gray-100 font-medium leading-snug">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key="tech-dashboard"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="p-6 md:p-8 space-y-8 max-w-[1300px] mx-auto"
      >
        {/* HEADER BLOCK WITH TITLE, SEARCH & INTERACTIVE CONTROLS */}
        <div id="tech-page-hero-title" className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1b153b]/60 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white font-sans flex items-center gap-2.5">
              Technology
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-950/80 border border-indigo-500/40 text-indigo-300">
                Future Tech Hub
              </span>
            </h1>
            <p className="text-xs md:text-sm text-gray-400 font-medium">Explore the future. Understand the now.</p>
          </div>

          {/* SEARCH & INTERACTIVE ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for tech, gadgets, reviews, tutorials..."
                className="w-full bg-[#0b081c] border border-[#231b4d]/80 focus:border-indigo-500 text-white pl-9 pr-3 py-2 rounded-xl text-xs placeholder:text-gray-500 outline-none transition-all"
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

            {/* ACTION 1: AI TECH ASSISTANT */}
            <button
              onClick={() => setIsAiAssistantOpen(true)}
              className="w-full sm:w-auto px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
            >
              <Bot className="w-4 h-4 text-indigo-200 animate-pulse" />
              <span>AI Tech Assistant 🤖</span>
            </button>

            {/* ACTION 2: TECH REVIEWS & BENCHMARKS */}
            <button
              onClick={() => {
                setSelectedProduct(productReviews[0]);
                setIsReviewsModalOpen(true);
              }}
              className="w-full sm:w-auto px-3 py-2 bg-[#100b2b] hover:bg-indigo-950/60 border border-[#2b1f63] text-indigo-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 whitespace-nowrap"
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span>Tech Reviews ⭐</span>
            </button>
          </div>
        </div>

        {/* SEARCH OVERLAY (IF USER IS TYPING) */}
        {searchQuery.trim() && (
          <div className="p-4 bg-[#090717] border border-indigo-500/30 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <p className="text-xs font-bold text-indigo-300">
                Search results for: <strong className="text-white">"{searchQuery}"</strong>
              </p>
              <span className="text-[10px] text-gray-400 font-mono">Videos, Reviews, Playlists</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {trendingTech
                .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.creator.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(item => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      onPlayVideo(item.video);
                      setSearchQuery('');
                    }}
                    className="p-3 bg-[#110d2d] border border-white/5 hover:border-indigo-500/40 rounded-xl cursor-pointer flex items-center gap-3"
                  >
                    <img src={item.coverUrl} alt="" className="w-12 h-10 object-cover rounded-lg shrink-0" />
                    <div className="min-w-0 text-left">
                      <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                      <p className="text-[10px] text-gray-400 truncate">{item.creator} • {item.views}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TOP 4 SPOTLIGHT WIDGETS MATCHING DESIGN */}
        <div id="tech-kpi-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {spotlightWidgets.map((widget) => {
            const WidgetIcon = widget.icon;
            return (
              <div 
                key={widget.id}
                onClick={() => onPlayVideo(widget.video)}
                className={`relative p-5 bg-gradient-to-br ${widget.color} border ${widget.borderColor} rounded-2xl flex flex-col justify-between overflow-hidden group hover:border-indigo-500/50 transition-all duration-300 shadow-lg h-36 cursor-pointer`}
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
                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-indigo-600 hover:border-indigo-500 flex items-center justify-center text-white active:scale-90 transition-all shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* TRENDING IN TECHNOLOGY */}
        <div id="section-trending-tech" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Trending in Technology</h2>
              <p className="text-[11px] text-gray-400">The most watched tech videos right now.</p>
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
            {trendingTech.map((item) => (
              <div 
                key={item.id}
                className="min-w-[220px] max-w-[240px] flex-1 bg-[#0d0b1d]/50 border border-[#201c3f]/40 rounded-xl p-3 space-y-3 shrink-0 snap-start group hover:border-indigo-500/30 hover:bg-[#0d0b1d]/80 transition-all"
              >
                <div 
                  onClick={() => onPlayVideo(item.video)}
                  className="relative aspect-video rounded-lg overflow-hidden bg-[#110e2d] flex items-center justify-center border border-[#242055] cursor-pointer"
                >
                  <img 
                    src={item.coverUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <div className="w-9 h-9 rounded-full bg-indigo-600 hover:scale-105 active:scale-95 flex items-center justify-center text-white shadow-md">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 text-[9px] px-1.5 py-0.5 bg-black/80 text-white rounded font-mono font-bold">{item.duration}</span>
                </div>

                <div className="text-left space-y-1">
                  <h4 
                    onClick={() => onPlayVideo(item.video)}
                    className="font-bold text-[12.5px] text-white tracking-wide line-clamp-1 group-hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10.5px]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-indigo-400 font-semibold truncate">{item.creator}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 fill-current shrink-0" />
                    </div>
                    <div className="flex items-center gap-1 shrink-0 text-gray-400">
                      <button 
                        onClick={() => toggleBookmark(item.id, item.title)}
                        className={`hover:text-indigo-300 transition-colors ${bookmarkedIds.includes(item.id) ? 'text-indigo-400' : ''}`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => toggleLike(item.id, item.title)}
                        className={`hover:text-rose-400 transition-colors ${likedIds.includes(item.id) ? 'text-rose-500' : ''}`}
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TECH DEEP DIVES (>20 min) */}
        <div id="section-tech-deep-dives" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Tech Deep Dives</h2>
              <p className="text-[11px] text-gray-400">In-depth explanations and long-form content.</p>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => scrollContainer(deepDivesScrollRef, -280)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => scrollContainer(deepDivesScrollRef, 280)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div 
            ref={deepDivesScrollRef}
            className="flex gap-4 md:gap-5 overflow-x-auto pb-2 scrollbar-none scroll-smooth snap-x"
          >
            {deepDives.map((dive) => (
              <div 
                key={dive.id}
                onClick={() => onPlayVideo(dive.video)}
                className="min-w-[230px] max-w-[250px] flex-1 bg-[#06050e]/50 border border-[#1b1932]/35 rounded-xl p-3 space-y-3 shrink-0 snap-start group hover:border-indigo-500/30 hover:bg-[#06050e]/85 transition-all cursor-pointer"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-[#0d091a] border border-[#231b3e]/40">
                  <img 
                    src={dive.coverUrl} 
                    alt={dive.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <div className="w-9 h-9 rounded-full bg-indigo-600 hover:scale-105 active:scale-95 flex items-center justify-center text-white shadow-md">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 text-[9px] px-1.5 py-0.5 bg-black/80 text-white rounded font-mono font-bold">{dive.duration}</span>
                </div>

                <div className="text-left space-y-0.5">
                  <h4 className="font-bold text-[12.5px] text-white tracking-wide line-clamp-1 group-hover:text-indigo-400 transition-colors">{dive.title}</h4>
                  <div className="flex items-center gap-2 text-[10.5px]">
                    <span className="text-indigo-400 font-semibold">{dive.creator}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 fill-current shrink-0" />
                    <span className="text-gray-400 font-medium">{dive.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* POPULAR PLAYLISTS */}
        <div id="section-popular-playlists" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Popular Playlists</h2>
              <p className="text-[11px] text-gray-400">Curated playlists to level up your tech knowledge.</p>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => scrollContainer(playlistsScrollRef, -280)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => scrollContainer(playlistsScrollRef, 280)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div 
            ref={playlistsScrollRef}
            className="flex gap-4 md:gap-5 overflow-x-auto pb-2 scrollbar-none scroll-smooth snap-x"
          >
            {playlists.map((playlist) => {
              const PlaylistIcon = playlist.icon;
              return (
                <div 
                  key={playlist.id}
                  onClick={() => onPlayVideo(playlist.video)}
                  className={`min-w-[220px] max-w-[240px] flex-1 ${playlist.bg} border ${playlist.borderColor} rounded-2xl p-4 flex flex-col justify-between shrink-0 snap-start h-36 group hover:border-indigo-500/50 transition-all cursor-pointer`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-bold text-[13px] text-white tracking-wide line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors">{playlist.title}</h4>
                      <p className="text-[10px] text-gray-400 font-semibold">{playlist.videoCount} Videos</p>
                    </div>
                    <div className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center ${playlist.iconColor}`}>
                      <PlaylistIcon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-[9.5px] font-bold text-gray-400 group-hover:text-white transition-colors">Open Playlist</span>
                    <div className="w-6 h-6 rounded-full bg-white/5 group-hover:bg-indigo-600 flex items-center justify-center text-white transition-all">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* NEW THIS WEEK */}
        <div id="section-new-this-week" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-bold text-white tracking-tight">New This Week</h2>
              <p className="text-[11px] text-gray-400">Fresh tech content you might have missed.</p>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => scrollContainer(newThisWeekScrollRef, -280)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => scrollContainer(newThisWeekScrollRef, 280)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div 
            ref={newThisWeekScrollRef}
            className="flex gap-4 md:gap-5 overflow-x-auto pb-2 scrollbar-none scroll-smooth snap-x"
          >
            {newThisWeek.map((item) => (
              <div 
                key={item.id}
                onClick={() => onPlayVideo(item.video)}
                className="min-w-[210px] max-w-[230px] flex-1 bg-[#090715]/60 border border-[#20183b]/40 rounded-2xl p-3 space-y-3 shrink-0 snap-start group hover:border-indigo-500/30 transition-all cursor-pointer"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/5">
                  <div className="absolute top-2 left-2 z-10 flex items-center bg-blue-600 px-1.5 py-0.5 rounded font-extrabold text-[8px] uppercase tracking-wide text-white shadow-md">
                    NEW
                  </div>
                  <img 
                    src={item.coverUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <div className="w-9 h-9 rounded-full bg-indigo-600 hover:scale-105 active:scale-95 flex items-center justify-center text-white shadow-md">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 text-[9px] px-1 bg-black/80 rounded font-mono text-white font-bold">{item.duration}</span>
                </div>

                <div className="space-y-1.5 text-left">
                  <h4 className="font-bold text-[12px] text-white tracking-wide line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                  <div className="space-y-0.5">
                    <p className="text-[10.5px] text-indigo-400 font-semibold flex items-center gap-1">
                      {item.creator}
                      <CheckCircle2 className="w-3 h-3 text-indigo-400 fill-current" />
                    </p>
                    <div className="flex items-center gap-1.5 text-[9.5px] text-gray-400 font-bold">
                      <span>{item.views}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                      <span>{item.timeAgo}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BROWSE TECH TOPICS */}
        <div id="section-browse-topics" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Browse Tech Topics</h2>
              <p className="text-[11px] text-gray-400">Explore by category.</p>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => scrollContainer(topicsScrollRef, -200)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => scrollContainer(topicsScrollRef, 200)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div 
            ref={topicsScrollRef}
            className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-none scroll-smooth snap-x"
          >
            {topics.map((topic, idx) => {
              const TopicIcon = topic.icon;
              const isSelected = activeTopicFilter === topic.name.toLowerCase();
              return (
                <div 
                  key={idx}
                  onClick={() => setActiveTopicFilter(isSelected ? 'all' : topic.name.toLowerCase())}
                  className={`min-w-[155px] md:min-w-[175px] flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300 cursor-pointer snap-start ${topic.bg} ${topic.border} ${topic.glow} ${
                    isSelected ? 'border-indigo-500 bg-indigo-950/25 scale-[1.02]' : 'hover:scale-[1.02] hover:border-indigo-500/20'
                  }`}
                >
                  <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${topic.color} shrink-0`}>
                    <TopicIcon className="w-5 h-5" />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="block font-bold text-xs text-white truncate">{topic.name}</span>
                    <span className="block text-[10px] text-gray-400 truncate">{topic.videos}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MODAL 1: AI TECH ASSISTANT CHAT */}
        <AnimatePresence>
          {isAiAssistantOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="w-full max-w-xl bg-[#0a081a] border border-[#2b215e] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px]"
              >
                {/* Header */}
                <div className="p-4 bg-[#110d2d] border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
                      <Bot className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">SoftCast AI Tech Expert</h3>
                      <p className="text-[10px] text-gray-400">Ask any question about GPUs, Chips, AI or Code</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsAiAssistantOpen(false)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Topic Presets */}
                <div className="px-4 py-2 bg-black/30 border-b border-white/5 flex gap-2 overflow-x-auto scrollbar-none">
                  {['Hardware & Chips', 'Artificial Intelligence', 'Programming & Systems', 'Quantum & Future'].map((tp) => (
                    <button
                      key={tp}
                      onClick={() => setAssistantTopic(tp)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                        assistantTopic === tp ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {tp}
                    </button>
                  ))}
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-indigo-900/40">
                  {assistantMessages.map((msg, idx) => (
                    <div 
                      key={idx}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none'
                          : 'bg-[#141033] border border-white/10 text-gray-200 rounded-tl-none'
                      }`}>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                        <span className="block text-[9px] opacity-60 mt-1 text-right">{msg.timestamp}</span>
                      </div>
                    </div>
                  ))}
                  {assistantLoading && (
                    <div className="flex justify-start">
                      <div className="p-3 bg-[#141033] border border-white/10 rounded-2xl text-xs text-indigo-300 flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>AI Tahlil qilmoqda...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Bar */}
                <div className="p-3 bg-[#0c0a21] border-t border-white/10 flex items-center gap-2">
                  <input
                    type="text"
                    value={assistantInput}
                    onChange={(e) => setAssistantInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendAssistantMessage()}
                    placeholder="Masalan: RTX 5090 vs M4 Pro qaysi biri AI uchun yaxshi?"
                    className="flex-1 bg-[#151138] border border-white/10 focus:border-indigo-500 text-white px-3 py-2 rounded-xl text-xs placeholder:text-gray-500 outline-none"
                  />
                  <button
                    onClick={handleSendAssistantMessage}
                    disabled={assistantLoading || !assistantInput.trim()}
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition-all active:scale-95 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL 2: TECH REVIEWS & BENCHMARKS */}
        <AnimatePresence>
          {isReviewsModalOpen && selectedProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-[#0a081a] border border-[#2d226b] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Header */}
                <div className="p-4 bg-[#110d2d] border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                    <div>
                      <h3 className="text-sm font-bold text-white">SoftCast Tech Review & Benchmarks</h3>
                      <p className="text-[10px] text-gray-400">Verified hardware benchmarks & testing data</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsReviewsModalOpen(false)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Product Select Tabs */}
                <div className="px-4 py-2.5 bg-black/40 border-b border-white/5 flex gap-2 overflow-x-auto scrollbar-none">
                  {productReviews.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => setSelectedProduct(prod)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        selectedProduct.id === prod.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {prod.productName}
                    </button>
                  ))}
                </div>

                {/* Body Content */}
                <div className="p-5 overflow-y-auto space-y-5 text-left scrollbar-thin scrollbar-thumb-indigo-900/40">
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <img src={selectedProduct.coverUrl} alt="" className="w-full sm:w-48 h-32 object-cover rounded-xl shrink-0 border border-white/10" />
                    <div className="space-y-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                        {selectedProduct.category}
                      </span>
                      <h2 className="text-lg font-black text-white">{selectedProduct.productName}</h2>
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>{selectedProduct.rating} / 5.0 Rating</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{selectedProduct.verdict}</p>
                    </div>
                  </div>

                  {/* Key Specs */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Key Specifications</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {selectedProduct.keySpecs.map((spec, i) => (
                        <div key={i} className="p-2 bg-[#130f33] border border-white/5 rounded-xl text-[10.5px] font-mono text-gray-200">
                          {spec}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pros & Cons Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
                      <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Check className="w-4 h-4" />
                        Pros
                      </h4>
                      <ul className="space-y-1 text-[11px] text-gray-300">
                        {selectedProduct.pros.map((p, i) => (
                          <li key={i}>• {p}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-2">
                      <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                        <X className="w-4 h-4" />
                        Cons
                      </h4>
                      <ul className="space-y-1 text-[11px] text-gray-300">
                        {selectedProduct.cons.map((c, i) => (
                          <li key={i}>• {c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer Video Launcher */}
                <div className="p-4 bg-[#0d0924] border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">Full Video Review Available</span>
                  <button
                    onClick={() => {
                      setIsReviewsModalOpen(false);
                      onPlayVideo(selectedProduct.video);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Full Review Video &rarr;</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
