import React, { useRef, useState } from 'react';
import { 
  Film, Ticket, Star, Trophy, Calendar, Play, ChevronLeft, ChevronRight, 
  CheckCircle2, Flame, Heart, Sparkles, Compass, Search, Bell, Users,
  Share2, MessageSquare, Plus, Bookmark, X, Bot, Send, Award, Sliders,
  Volume2, ShieldAlert, Check, RefreshCw, Eye, Tv, SlidersHorizontal, UserPlus
} from 'lucide-react';
import { Video } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CinemaHubProps {
  videos?: Video[];
  onPlayVideo: (video: Video) => void;
  isPremium: boolean;
}

interface MovieReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  text: string;
  date: string;
  likes: number;
  isSpoiler: boolean;
}

interface ActorDirector {
  id: string;
  name: string;
  role: 'Actor' | 'Director';
  photo: string;
  bio: string;
  awards: string;
  followers: string;
  isFollowing: boolean;
  topMovies: string[];
}

export default function CinemaHub({ videos = [], onPlayVideo, isPremium }: CinemaHubProps) {
  // Global Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Scroll refs for horizontal layouts
  const popularScrollRef = useRef<HTMLDivElement>(null);
  const trailersScrollRef = useRef<HTMLDivElement>(null);
  const recommendationsScrollRef = useRef<HTMLDivElement>(null);
  const newReleasesScrollRef = useRef<HTMLDivElement>(null);
  const genresScrollRef = useRef<HTMLDivElement>(null);
  const actorsScrollRef = useRef<HTMLDivElement>(null);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, offset: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Interactive States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeGenreFilter, setActiveGenreFilter] = useState<string>('all');
  const [newReleaseFilter, setNewReleaseFilter] = useState<'today' | 'week' | 'month' | '2026'>('week');
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [notifiedMovieIds, setNotifiedMovieIds] = useState<string[]>([]);

  // Modal / Drawer States
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isWatchPartyOpen, setIsWatchPartyOpen] = useState(false);
  const [isJourneyOpen, setIsJourneyOpen] = useState(false);
  const [isActorsModalOpen, setIsActorsModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isSceneAnalysisOpen, setIsSceneAnalysisOpen] = useState(false);

  // Selected Item States for Modals
  const [selectedMovieForReviews, setSelectedMovieForReviews] = useState<{ id: string; title: string; coverUrl: string } | null>(null);
  const [selectedMovieForRating, setSelectedMovieForRating] = useState<{ id: string; title: string; rating: string } | null>(null);
  const [selectedMovieForScene, setSelectedMovieForScene] = useState<{ id: string; title: string } | null>(null);

  // User Rating Input state
  const [userScore, setUserScore] = useState<number>(9);

  // AI Movie Assistant State
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantMood, setAssistantMood] = useState('Family Night');
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<{ summary: string; recommendations: any[] } | null>({
    summary: '🎬 **SoftCast AI Film Curator Picks**:',
    recommendations: [
      {
        title: 'Arrival (2016)',
        year: '2016',
        genre: 'Sci-Fi / Mystery',
        rating: '8.0',
        reason: 'Denis Villeneuve\'s emotional masterpiece about linguistics, non-linear time perception, and alien contact.'
      },
      {
        title: 'The Martian (2015)',
        year: '2015',
        genre: 'Sci-Fi / Adventure',
        rating: '8.0',
        reason: 'Ridley Scott\'s inspiring survival story of astronaut Mark Watney science-ing his way off Mars.'
      },
      {
        title: 'Gravity (2013)',
        year: '2013',
        genre: 'Sci-Fi / Thriller',
        rating: '7.7',
        reason: 'Alfonso Cuarón\'s heart-pounding orbital survival journey featuring breathtaking zero-gravity cinematography.'
      }
    ]
  });

  // Scene Analysis State
  const [sceneAnalysisInput, setSceneAnalysisInput] = useState('Explain the wormhole scene symbolism and Hans Zimmer organ score.');
  const [sceneAnalysisResult, setSceneAnalysisResult] = useState<string | null>(null);
  const [sceneAnalysisLoading, setSceneAnalysisLoading] = useState(false);

  // Watch Party Chat State
  const [partyChatInput, setPartyChatInput] = useState('');
  const [partyChatMessages, setPartyChatMessages] = useState([
    { id: '1', user: 'Aslbek', text: 'Hey guys! Interstellar 4K Dolby Atmos starting now 🚀', time: '20:14' },
    { id: '2', user: 'Malika', text: 'The Hans Zimmer score in this scene gives me goosebumps every time!', time: '20:15' },
    { id: '3', user: 'Bobur', text: 'Is everyone synced up on timecode 01:24:15?', time: '20:16' }
  ]);

  // Sample Community Reviews State
  const [movieReviews, setMovieReviews] = useState<MovieReview[]>([
    {
      id: 'rev-1',
      userName: 'Sardor_Cinephile',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop',
      rating: 10,
      text: 'Interstellar is not just a film; it is a spiritual journey through space, time, and human love. The black hole visual physics were literally published as scientific papers!',
      date: '2 days ago',
      likes: 342,
      isSpoiler: false
    },
    {
      id: 'rev-2',
      userName: 'Elena_FilmCritic',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop',
      rating: 9,
      text: '[Spoiler Alert] The tesseract sequence inside Gargantua connects the 5th dimensional gravity waves to Murphy\'s bedroom watch. Masterpiece editing!',
      date: '1 week ago',
      likes: 189,
      isSpoiler: true
    }
  ]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewSpoiler, setNewReviewSpoiler] = useState(false);
  const [showSpoilers, setShowSpoilers] = useState(false);

  // Sample Actors and Directors Data
  const [castEcosystem, setCastEcosystem] = useState<ActorDirector[]>([
    {
      id: 'cast-1',
      name: 'Christopher Nolan',
      role: 'Director',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop',
      bio: 'Visionary filmmaker known for non-linear storytelling, practical effects, and mind-bending Sci-Fi epics.',
      awards: 'Oscar Winner (Oppenheimer)',
      followers: '2.4M',
      isFollowing: true,
      topMovies: ['Interstellar', 'Inception', 'The Dark Knight', 'Tenet', 'Oppenheimer']
    },
    {
      id: 'cast-2',
      name: 'Denis Villeneuve',
      role: 'Director',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop',
      bio: 'Canadian director renowned for grand visual scope, tactile atmosphere, and modern Sci-Fi masterpieces.',
      awards: 'Oscar Nominee',
      followers: '1.8M',
      isFollowing: false,
      topMovies: ['Dune: Part Two', 'Arrival', 'Blade Runner 2049', 'Sicario']
    },
    {
      id: 'cast-3',
      name: 'Leonardo DiCaprio',
      role: 'Actor',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop',
      bio: 'Acclaimed actor celebrated for intense dramatic commitment and iconic movie collaborations.',
      awards: 'Oscar Winner (The Revenant)',
      followers: '8.9M',
      isFollowing: true,
      topMovies: ['Inception', 'Titanic', 'The Wolf of Wall Street', 'Shutter Island']
    },
    {
      id: 'cast-4',
      name: 'Timothée Chalamet',
      role: 'Actor',
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop',
      bio: 'Leading star of modern cinema headlining global franchises and intimate indie character studies.',
      awards: '2x Oscar Nominee',
      followers: '6.1M',
      isFollowing: false,
      topMovies: ['Dune: Part Two', 'Wonka', 'Call Me by Your Name', 'Interstellar']
    },
    {
      id: 'cast-5',
      name: 'Zendaya',
      role: 'Actor',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop',
      bio: 'Emmy-winning powerhouse actress bringing charisma, depth, and style to major cinematic universes.',
      awards: '2x Emmy Winner',
      followers: '12.3M',
      isFollowing: true,
      topMovies: ['Dune: Part Two', 'Spider-Man: No Way Home', 'Challengers', 'The Greatest Showman']
    }
  ]);

  // Top 4 Spotlight widgets matching design layout
  const spotlightWidgets = [
    {
      id: 'now-playing',
      title: 'Now Playing',
      sub: 'In cinemas & SoftCast streaming',
      color: 'from-[#4a154b]/20 to-[#0e020e]/10',
      borderColor: 'border-[#6c2a6d]/30',
      glowColor: 'bg-fuchsia-600/10',
      badgeColor: 'text-fuchsia-400',
      icon: Ticket,
      imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop',
      video: {
        id: 'cinema-kpi-now',
        title: 'Dune: Part Two - Global IMAX Theatrical Release',
        description: 'Experience Paul Atreides\' mythic journey on Arrakis in pristine 4K HDR with Dolby Atmos surround audio.',
        category: 'cinema' as const,
        coverUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop',
        duration: '2:46:00',
        views: '18.5M views',
        uploadDate: '2024',
        creator: 'Warner Bros. Pictures',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/Way9Dexny3w'
      }
    },
    {
      id: 'top-rated',
      title: 'Top Rated',
      sub: '⭐ 9.4 Avg Community Score',
      color: 'from-[#1e144a]/20 to-[#050311]/10',
      borderColor: 'border-[#3d2e85]/30',
      glowColor: 'bg-indigo-600/10',
      badgeColor: 'text-indigo-400',
      icon: Star,
      imageUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=500&auto=format&fit=crop',
      video: {
        id: 'cinema-kpi-rated',
        title: 'The Shawshank Redemption (1994) - Highest Rated Cinema Masterpiece',
        description: 'Consistently ranked #1 on IMDb and SoftCast Cinema as the greatest film of human hope and redemption.',
        category: 'cinema' as const,
        coverUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=800&auto=format&fit=crop',
        duration: '2:22:36',
        views: '45.8M views',
        uploadDate: '1994',
        creator: 'Columbia Pictures',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY'
      }
    },
    {
      id: 'award-winners',
      title: 'Award Winners',
      sub: 'Oscar & Cannes Gold Recipients',
      color: 'from-[#3b2d10]/25 to-[#0b0803]/10',
      borderColor: 'border-[#624c1e]/30',
      glowColor: 'bg-amber-600/10',
      badgeColor: 'text-amber-400',
      icon: Trophy,
      imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500&auto=format&fit=crop',
      video: {
        id: 'cinema-kpi-awards',
        title: 'Oppenheimer (2023) - 7x Academy Award Winner',
        description: 'Christopher Nolan\'s sweeping biographical drama about the father of the atomic bomb, starring Cillian Murphy.',
        category: 'cinema' as const,
        coverUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop',
        duration: '3:00:22',
        views: '28.9M views',
        uploadDate: '2023',
        creator: 'Universal Pictures',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E'
      }
    },
    {
      id: 'coming-soon',
      title: 'Coming Soon',
      sub: 'Upcoming 2026 Blockbusters',
      color: 'from-[#0b332b]/20 to-[#020e0c]/10',
      borderColor: 'border-[#1b5e51]/30',
      glowColor: 'bg-teal-600/10',
      badgeColor: 'text-teal-400',
      icon: Calendar,
      imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop',
      video: {
        id: 'cinema-kpi-upcoming',
        title: 'Avatar 3: Fire and Ash - Official Teaser Preview',
        description: 'James Cameron takes audiences to unmapped volcanic regions of Pandora with the Ash People Na\'vi clan.',
        category: 'cinema' as const,
        coverUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop',
        duration: '03:15',
        views: '32M views',
        uploadDate: 'Coming 2026',
        creator: '20th Century Studios',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/73_1biulkYk'
      }
    }
  ];

  // 1. Popular Movies data matching design
  const popularMovies = [
    {
      id: 'pop-1',
      title: 'Interstellar',
      genre: 'Sci-Fi, Drama',
      rating: '8.6',
      year: '2014',
      duration: '2:49:04',
      director: 'Christopher Nolan',
      coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop',
      video: {
        id: 'cinema-pop-1',
        title: 'Interstellar (2014) - Official Movie Feature',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        category: 'cinema' as const,
        coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
        duration: '2:49:04',
        views: '15.4M views',
        uploadDate: '2014',
        creator: 'Warner Bros. Pictures',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E'
      }
    },
    {
      id: 'pop-2',
      title: 'The Dark Knight',
      genre: 'Action, Crime',
      rating: '9.0',
      year: '2008',
      duration: '2:32:13',
      director: 'Christopher Nolan',
      coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop',
      video: {
        id: 'cinema-pop-2',
        title: 'The Dark Knight (2008) - Official Movie Feature',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological tests of his ability to fight injustice.',
        category: 'cinema' as const,
        coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop',
        duration: '2:32:13',
        views: '24.2M views',
        uploadDate: '2008',
        creator: 'Warner Bros. Pictures',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY'
      }
    },
    {
      id: 'pop-3',
      title: 'Inception',
      genre: 'Sci-Fi, Thriller',
      rating: '8.8',
      year: '2010',
      duration: '2:28:08',
      director: 'Christopher Nolan',
      coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop',
      video: {
        id: 'cinema-pop-3',
        title: 'Inception (2010) - Official Movie Feature',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        category: 'cinema' as const,
        coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop',
        duration: '2:28:08',
        views: '18.9M views',
        uploadDate: '2010',
        creator: 'Warner Bros. Pictures',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/YoHD9XEInc0'
      }
    },
    {
      id: 'pop-4',
      title: 'Pulp Fiction',
      genre: 'Crime, Drama',
      rating: '8.9',
      year: '1994',
      duration: '2:34:58',
      director: 'Quentin Tarantino',
      coverUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600&auto=format&fit=crop',
      video: {
        id: 'cinema-pop-4',
        title: 'Pulp Fiction (1994) - Official Movie Feature',
        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
        category: 'cinema' as const,
        coverUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&auto=format&fit=crop',
        duration: '2:34:58',
        views: '12.8M views',
        uploadDate: '1994',
        creator: 'Miramax Films',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/s7EgWkyY_lU'
      }
    },
    {
      id: 'pop-5',
      title: 'The Lord of the Rings',
      genre: 'Adventure, Fantasy',
      rating: '8.9',
      year: '2001',
      duration: '2:58:21',
      director: 'Peter Jackson',
      coverUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop',
      video: {
        id: 'cinema-pop-5',
        title: 'The Lord of the Rings: The Fellowship of the Ring (2001) - Movie Feature',
        description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth.',
        category: 'cinema' as const,
        coverUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop',
        duration: '2:58:21',
        views: '35.4M views',
        uploadDate: '2001',
        creator: 'New Line Cinema',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/V75dMMBU2K0'
      }
    }
  ];

  // 2. Top Movie Trailers data
  const movieTrailers = [
    {
      id: 'tr-1',
      title: 'Dune: Part Two',
      duration: '02:25',
      reaction: '94% Excited',
      coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop',
      video: {
        id: 'cinema-trailer-1',
        title: 'Dune: Part Two - Official Trailer',
        description: 'Explore the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge.',
        category: 'cinema' as const,
        coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop',
        duration: '02:25',
        views: '45M views',
        uploadDate: '1 month ago',
        creator: 'Warner Bros. Pictures',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/Way9Dexny3w'
      }
    },
    {
      id: 'tr-2',
      title: 'Deadpool & Wolverine',
      duration: '02:11',
      reaction: '98% Excited',
      coverUrl: 'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=600&auto=format&fit=crop',
      video: {
        id: 'cinema-trailer-2',
        title: 'Deadpool & Wolverine - Official Trailer',
        description: 'Wolverine is recovering from his injuries when he crosses paths with the loudmouth, Deadpool. They team up to defeat a common enemy.',
        category: 'cinema' as const,
        coverUrl: 'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=800&auto=format&fit=crop',
        duration: '02:11',
        views: '58M views',
        uploadDate: '2 weeks ago',
        creator: 'Marvel Studios',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/73_1biulkYk'
      }
    },
    {
      id: 'tr-3',
      title: 'Gladiator II',
      duration: '02:37',
      reaction: '89% Excited',
      coverUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&auto=format&fit=crop',
      video: {
        id: 'cinema-trailer-3',
        title: 'Gladiator II - Official Trailer',
        description: 'Years after witnessing the death of the revered hero Maximus, Lucius is forced to enter the Colosseum to fight for Rome.',
        category: 'cinema' as const,
        coverUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&auto=format&fit=crop',
        duration: '02:37',
        views: '32M views',
        uploadDate: '3 days ago',
        creator: 'Paramount Pictures',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/g6jWeD_71fI'
      }
    },
    {
      id: 'tr-4',
      title: 'Mission: Impossible - Dead Reckoning',
      duration: '02:18',
      reaction: '91% Excited',
      coverUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop',
      video: {
        id: 'cinema-trailer-4',
        title: 'Mission: Impossible - Dead Reckoning Part One | Official Trailer',
        description: 'Ethan Hunt and his IMF team must track down a dangerous weapon before it falls into the wrong hands.',
        category: 'cinema' as const,
        coverUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop',
        duration: '02:18',
        views: '38M views',
        uploadDate: '5 days ago',
        creator: 'Paramount Pictures',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/2m1COnN0Y_E'
      }
    }
  ];

  // 3. Because You Love Movies data
  const recommendedMovies = [
    {
      id: 'rec-1',
      title: 'The Shawshank Redemption',
      genre: 'Drama',
      rating: '9.3',
      duration: '2:22:36',
      coverUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop',
      video: {
        id: 'cinema-rec-1',
        title: 'The Shawshank Redemption (1994) - Official Movie Feature',
        description: 'Two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.',
        category: 'cinema' as const,
        coverUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop',
        duration: '2:22:36',
        views: '45.8M views',
        uploadDate: '1994',
        creator: 'Columbia Pictures',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY'
      }
    },
    {
      id: 'rec-2',
      title: 'Forrest Gump',
      genre: 'Drama, Romance',
      rating: '8.8',
      duration: '2:22:10',
      coverUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop',
      video: {
        id: 'cinema-rec-2',
        title: 'Forrest Gump (1994) - Official Movie Feature',
        description: 'The history of the United States unfolds from the perspective of an Alabama man who yearns to be reunited with his childhood sweetheart.',
        category: 'cinema' as const,
        coverUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&auto=format&fit=crop',
        duration: '2:22:10',
        views: '38.2M views',
        uploadDate: '1994',
        creator: 'Paramount Pictures',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E'
      }
    },
    {
      id: 'rec-3',
      title: 'Fight Club',
      genre: 'Drama',
      rating: '8.8',
      duration: '2:19:09',
      coverUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop',
      video: {
        id: 'cinema-rec-3',
        title: 'Fight Club (1999) - Official Movie Feature',
        description: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into much more.',
        category: 'cinema' as const,
        coverUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop',
        duration: '2:19:09',
        views: '29.4M views',
        uploadDate: '1999',
        creator: '20th Century Fox',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/YoHD9XEInc0'
      }
    },
    {
      id: 'rec-4',
      title: 'The Godfather',
      genre: 'Crime, Drama',
      rating: '9.2',
      duration: '2:55:24',
      coverUrl: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=600&auto=format&fit=crop',
      video: {
        id: 'cinema-rec-4',
        title: 'The Godfather (1972) - Official Movie Feature',
        description: 'The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant youngest son.',
        category: 'cinema' as const,
        coverUrl: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=800&auto=format&fit=crop',
        duration: '2:55:24',
        views: '54.1M views',
        uploadDate: '1972',
        creator: 'Paramount Pictures',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/s7EgWkyY_lU'
      }
    }
  ];

  // 4. New Releases data
  const newReleases = [
    {
      id: 'nw-1',
      title: 'Civil War',
      genre: 'Action, Thriller',
      rating: '7.1',
      year: '2024',
      duration: '1:49:34',
      tag: 'week',
      coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop',
      video: {
        id: 'cinema-new-1',
        title: 'Civil War (2024) - Official Movie Feature',
        description: 'A journey across a dystopian future America, following a team of military-embedded journalists racing to DC.',
        category: 'cinema' as const,
        coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop',
        duration: '1:49:34',
        views: '4.5M views',
        uploadDate: '2 months ago',
        creator: 'A24',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/aDyQxtg0V2w'
      }
    },
    {
      id: 'nw-2',
      title: 'Kingdom of the Planet of the Apes',
      genre: 'Action, Sci-Fi',
      rating: '7.6',
      year: '2024',
      duration: '2:25:18',
      tag: 'week',
      coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop',
      video: {
        id: 'cinema-new-2',
        title: 'Kingdom of the Planet of the Apes (2024) - Official Movie Feature',
        description: 'Many years after the reign of Caesar, a young ape goes on a journey that will define a future for apes and humans alike.',
        category: 'cinema' as const,
        coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop',
        duration: '2:25:18',
        views: '8.2M views',
        uploadDate: '1 month ago',
        creator: '20th Century Studios',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/Kdr5eed1C0I'
      }
    },
    {
      id: 'nw-3',
      title: 'Challengers',
      genre: 'Drama, Romance',
      rating: '7.8',
      year: '2024',
      duration: '2:11:35',
      tag: 'month',
      coverUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&auto=format&fit=crop',
      video: {
        id: 'cinema-new-3',
        title: 'Challengers (2024) - Official Movie Feature',
        description: 'Tashi, a former tennis prodigy turned coach, enters her husband into a challenger event where he faces his former best friend.',
        category: 'cinema' as const,
        coverUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop',
        duration: '2:11:35',
        views: '6.4M views',
        uploadDate: '3 weeks ago',
        creator: 'Metro-Goldwyn-Mayer',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/Vbo_4006E88'
      }
    },
    {
      id: 'nw-4',
      title: 'A Quiet Place: Day One',
      genre: 'Horror, Sci-Fi',
      rating: '7.0',
      year: '2024',
      duration: '1:39:52',
      tag: '2026',
      coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop',
      video: {
        id: 'cinema-new-4',
        title: 'A Quiet Place: Day One (2024) - Official Movie Feature',
        description: 'Experience the day the world went silent in this terrifying prequel to the critically acclaimed horror franchise.',
        category: 'cinema' as const,
        coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop',
        duration: '1:39:52',
        views: '9.1M views',
        uploadDate: '1 month ago',
        creator: 'Paramount Pictures',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/YPY7J-flzE8'
      }
    }
  ];

  // 5. Browse by Genre & Mood
  const genres = [
    { name: 'Action', videos: '1.2K movies', icon: Flame, bg: 'bg-[#1e0e0a]/80', border: 'border-[#4e1f14]/50', color: 'text-orange-400', glow: 'shadow-[0_0_15px_-3px_rgba(249,115,22,0.15)]' },
    { name: 'Adventure', videos: '987 movies', icon: Compass, bg: 'bg-[#0d1e17]/80', border: 'border-[#1a3f30]/50', color: 'text-emerald-400', glow: 'shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)]' },
    { name: 'Sci-Fi', videos: '1.1K movies', icon: Sparkles, bg: 'bg-[#061c28]/80', border: 'border-[#0c3951]/50', color: 'text-cyan-400', glow: 'shadow-[0_0_15px_-3px_rgba(6,182,212,0.15)]' },
    { name: 'Drama', videos: '2.4K movies', icon: Heart, bg: 'bg-[#1b0d26]/80', border: 'border-[#431962]/50', color: 'text-fuchsia-400', glow: 'shadow-[0_0_15px_-3px_rgba(217,70,239,0.15)]' },
    { name: 'Comedy', videos: '1.0K movies', icon: Star, bg: 'bg-[#181a0b]/80', border: 'border-[#3a3d13]/50', color: 'text-yellow-400', glow: 'shadow-[0_0_15px_-3px_rgba(234,179,8,0.15)]' },
    { name: 'Thriller', videos: '890 movies', icon: Flame, bg: 'bg-[#200b12]/80', border: 'border-[#4b1424]/50', color: 'text-rose-400', glow: 'shadow-[0_0_15px_-3px_rgba(244,63,94,0.15)]' },
    { name: 'Horror', videos: '674 movies', icon: Trophy, bg: 'bg-[#1a0f0d]/80', border: 'border-[#421b14]/50', color: 'text-red-400', glow: 'shadow-[0_0_15px_-3px_rgba(239,68,68,0.15)]' },
    { name: 'Romance', videos: '1.3K movies', icon: Heart, bg: 'bg-[#230a1c]/80', border: 'border-[#4c163a]/50', color: 'text-pink-400', glow: 'shadow-[0_0_15px_-3px_rgba(244,63,94,0.15)]' }
  ];

  // Send AI Movie Recommendation Request
  const handleGetAiRecommendations = async () => {
    if (!assistantInput.trim()) return;
    const promptText = assistantInput.trim();
    setAssistantLoading(true);

    try {
      const res = await fetch('/api/ai-cinema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'movie_recommendation', prompt: promptText, mood: assistantMood })
      });
      const resData = await res.json();
      if (resData.success && resData.data) {
        setAiRecommendations(resData.data);
      }
    } catch (err) {
      console.error(err);
      setAiRecommendations({
        summary: `🎬 **SoftCast AI Film Curator Picks** for "${promptText}":`,
        recommendations: [
          {
            title: 'Interstellar (2014)',
            year: '2014',
            genre: 'Sci-Fi / Drama',
            rating: '8.6',
            reason: 'Christopher Nolan\'s iconic space-time journey with awe-inspiring wormhole cinematography.'
          },
          {
            title: 'Inception (2010)',
            year: '2010',
            genre: 'Sci-Fi / Thriller',
            rating: '8.8',
            reason: 'High-concept dream heist with folding cityscapes and zero-gravity corridor fights.'
          }
        ]
      });
    } finally {
      setAssistantLoading(false);
    }
  };

  // Run AI Scene Analysis
  const handleRunSceneAnalysis = async () => {
    if (!selectedMovieForScene) return;
    setSceneAnalysisLoading(true);
    try {
      const res = await fetch('/api/ai-cinema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'scene_explanation',
          movieTitle: selectedMovieForScene.title,
          prompt: sceneAnalysisInput
        })
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setSceneAnalysisResult(data.reply);
      }
    } catch (err) {
      setSceneAnalysisResult(`🎬 **Scene Analysis for ${selectedMovieForScene.title}**: The climax uses non-linear editing to reflect psychological state, amplified by 60 BPM ambient bass resonance.`);
    } finally {
      setSceneAnalysisLoading(false);
    }
  };

  // Toggle Watchlist
  const toggleWatchlist = (id: string, title: string) => {
    if (watchlistIds.includes(id)) {
      setWatchlistIds(prev => prev.filter(i => i !== id));
      showToast(`🔕 "${title}" Watchlist'dan olib tashlandi.`);
    } else {
      setWatchlistIds(prev => [...prev, id]);
      showToast(`＋ "${title}" Watchlist ga muvaffaqiyatli qo'shildi!`);
    }
  };

  // Toggle Favorite
  const toggleFavorite = (id: string, title: string) => {
    if (favoriteIds.includes(id)) {
      setFavoriteIds(prev => prev.filter(i => i !== id));
      showToast(`Sevimlilardan olib tashlandi.`);
    } else {
      setFavoriteIds(prev => [...prev, id]);
      showToast(`❤️ "${title}" Sevimlilar ro'yxatiga saqlandi!`);
    }
  };

  // Toggle Movie Notification
  const toggleNotification = (id: string, title: string) => {
    if (notifiedMovieIds.includes(id)) {
      setNotifiedMovieIds(prev => prev.filter(i => i !== id));
      showToast(`🔕 Build release bildirishnomasi o'chirildi.`);
    } else {
      setNotifiedMovieIds(prev => [...prev, id]);
      showToast(`🔔 "${title}" premyerasi kuni sizga xabar yuboriladi!`);
    }
  };

  // Toggle Follow Cast/Director
  const toggleFollowCast = (id: string, name: string) => {
    setCastEcosystem(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextState = !item.isFollowing;
          showToast(nextState ? `✅ ${name} kuzatuvlarga qo'shildi!` : `Kuzatuv bekor qilindi.`);
          return { ...item, isFollowing: nextState };
        }
        return item;
      })
    );
  };

  // Submit User Review
  const handleSubmitReview = () => {
    if (!newReviewText.trim()) return;
    const review: MovieReview = {
      id: Date.now().toString(),
      userName: 'Aslbek_User',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop',
      rating: userScore,
      text: newReviewSpoiler ? `[Spoiler Warning] ${newReviewText}` : newReviewText,
      date: 'Just now',
      likes: 1,
      isSpoiler: newReviewSpoiler
    };
    setMovieReviews(prev => [review, ...prev]);
    setNewReviewText('');
    showToast('💬 Sharhingiz muvaffaqiyatli chop etildi!');
  };

  // Send Watch Party Chat Message
  const handleSendPartyMessage = () => {
    if (!partyChatInput.trim()) return;
    const msg = {
      id: Date.now().toString(),
      user: 'Aslbek',
      text: partyChatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setPartyChatMessages(prev => [...prev, msg]);
    setPartyChatInput('');
  };

  return (
    <div 
      id="cinema-page-main-container" 
      className="w-full h-full text-left bg-[#030208] text-white overflow-y-auto max-h-[calc(100vh-4.5rem)] scrollbar-thin scrollbar-thumb-indigo-900/40 select-none pb-28 relative font-sans"
    >
      {/* GLOBAL TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            className="fixed top-20 right-8 z-50 bg-[#170e2b] border border-[#6b35af]/80 px-4 py-3 rounded-xl flex items-center gap-3 shadow-2xl text-xs max-w-sm"
          >
            <Film className="w-4.5 h-4.5 text-fuchsia-400 shrink-0 animate-pulse" />
            <p className="text-gray-100 font-medium leading-snug">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key="cinema-dashboard"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="p-6 md:p-8 space-y-8 max-w-[1300px] mx-auto"
      >
        {/* HEADER BLOCK WITH TITLE, MOOD SEARCH & TOP ACTION BUTTONS */}
        <div id="cinema-page-hero-title" className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1b153b]/60 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white font-sans flex items-center gap-2.5">
              Cinema
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-fuchsia-950/80 border border-fuchsia-500/40 text-fuchsia-300">
                Dolby Vision &bull; 4K
              </span>
            </h1>
            <p className="text-xs md:text-sm text-gray-400 font-medium">Movies, trailers, and everything about the world of film.</p>
          </div>

          {/* SEARCH & INTERACTIVE ACTION BAR */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
            {/* SEARCH INPUT */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-fuchsia-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, actors, directors, mood..."
                className="w-full bg-[#0b081c] border border-[#231b4d]/80 focus:border-fuchsia-500 text-white pl-9 pr-3 py-2 rounded-xl text-xs placeholder:text-gray-500 outline-none transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* ACTION 1: AI MOVIE ASSISTANT */}
            <button
              onClick={() => setIsAiAssistantOpen(true)}
              className="w-full sm:w-auto px-3 py-2 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-95 whitespace-nowrap"
            >
              <Bot className="w-4 h-4 text-fuchsia-200 animate-pulse" />
              <span>AI Movie Curator 🤖</span>
            </button>

            {/* ACTION 2: WATCH PARTY */}
            <button
              onClick={() => setIsWatchPartyOpen(true)}
              className="w-full sm:w-auto px-3 py-2 bg-[#170a2c] hover:bg-fuchsia-950/60 border border-[#481c78] text-fuchsia-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 whitespace-nowrap"
            >
              <Users className="w-4 h-4 text-fuchsia-400" />
              <span>Watch Party 🍿</span>
            </button>

            {/* ACTION 3: PERSONAL CINEMA JOURNEY */}
            <button
              onClick={() => setIsJourneyOpen(true)}
              className="w-full sm:w-auto px-3 py-2 bg-[#0e1026] hover:bg-indigo-950/60 border border-[#232a69] text-indigo-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 whitespace-nowrap"
            >
              <Tv className="w-4 h-4 text-indigo-400" />
              <span>Journey 📊</span>
            </button>
          </div>
        </div>

        {/* SEARCH OVERLAY (IF USER IS TYPING) */}
        {searchQuery.trim() && (
          <div className="p-4 bg-[#090717] border border-fuchsia-500/30 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <p className="text-xs font-bold text-fuchsia-300">
                Search results for: <strong className="text-white">"{searchQuery}"</strong>
              </p>
              <span className="text-[10px] text-gray-400 font-mono">Movies, Cast, Directors</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {popularMovies
                .filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.director.toLowerCase().includes(searchQuery.toLowerCase()) || m.genre.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(item => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      onPlayVideo(item.video);
                      setSearchQuery('');
                    }}
                    className="p-3 bg-[#110d2d] border border-white/5 hover:border-fuchsia-500/40 rounded-xl cursor-pointer flex items-center gap-3"
                  >
                    <img src={item.coverUrl} alt="" className="w-12 h-10 object-cover rounded-lg shrink-0" />
                    <div className="min-w-0 text-left">
                      <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                      <p className="text-[10px] text-gray-400 truncate">{item.genre} • Dir. {item.director}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TOP 4 SPOTLIGHT WIDGETS */}
        <div id="cinema-kpi-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {spotlightWidgets.map((widget) => {
            const WidgetIcon = widget.icon;
            return (
              <div 
                key={widget.id}
                onClick={() => onPlayVideo(widget.video)}
                className={`relative p-5 bg-gradient-to-br ${widget.color} border ${widget.borderColor} rounded-2xl flex flex-col justify-between overflow-hidden group hover:border-fuchsia-500/50 transition-all duration-300 shadow-lg h-36 cursor-pointer`}
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
                  <span className={`text-[10px] font-bold ${widget.badgeColor}`}>Explore Category &rarr;</span>
                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-fuchsia-600 hover:border-fuchsia-500 flex items-center justify-center text-white active:scale-90 transition-all shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ACTORS & DIRECTORS ECOSYSTEM STRIP */}
        <div className="p-4 bg-[#0d091e]/60 border border-[#2b1f5e]/40 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Top Directors & Actors</h3>
            </div>
            <button 
              onClick={() => setIsActorsModalOpen(true)}
              className="text-[10.5px] font-bold text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
            >
              View Full Ecosystem &rarr;
            </button>
          </div>

          <div 
            ref={actorsScrollRef}
            className="flex gap-3 overflow-x-auto pb-1 scrollbar-none"
          >
            {castEcosystem.map((person) => (
              <div 
                key={person.id}
                className="min-w-[200px] p-2.5 bg-[#120b29] border border-white/5 hover:border-fuchsia-500/30 rounded-xl flex items-center justify-between gap-2.5 shrink-0"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={person.photo} alt={person.name} className="w-9 h-9 rounded-full object-cover shrink-0 border border-fuchsia-500/40" />
                  <div className="min-w-0 text-left">
                    <h5 className="text-[11.5px] font-bold text-white truncate">{person.name}</h5>
                    <p className="text-[9.5px] text-gray-400 truncate">{person.role} &bull; {person.followers}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleFollowCast(person.id, person.name)}
                  className={`p-1.5 rounded-lg border text-[10px] transition-all shrink-0 ${
                    person.isFollowing 
                      ? 'bg-fuchsia-950/80 border-fuchsia-500/50 text-fuchsia-300' 
                      : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
                  }`}
                >
                  {person.isFollowing ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* POPULAR MOVIES */}
        <div id="section-popular-movies" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Popular Movies</h2>
              <p className="text-[11px] text-gray-400">Top blockbusters loved by our global cinephile community.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-gray-400 font-bold hover:text-fuchsia-400 transition-colors cursor-pointer">See all</span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => scrollContainer(popularScrollRef, -280)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => scrollContainer(popularScrollRef, 280)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div 
            ref={popularScrollRef}
            className="flex gap-4 md:gap-5 overflow-x-auto pb-2 scrollbar-none scroll-smooth snap-x"
          >
            {popularMovies.map((item) => (
              <div 
                key={item.id}
                className="min-w-[220px] max-w-[240px] flex-1 bg-[#0d0b1d]/50 border border-[#201c3f]/40 rounded-xl p-3 space-y-3 shrink-0 snap-start group hover:border-fuchsia-500/30 hover:bg-[#0d0b1d]/80 transition-all flex flex-col justify-between"
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
                    <div className="w-9 h-9 rounded-full bg-fuchsia-600 hover:scale-105 active:scale-95 flex items-center justify-center text-white shadow-md">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 text-[9px] px-1.5 py-0.5 bg-black/80 text-white rounded font-mono font-bold">{item.duration}</span>
                </div>

                <div className="text-left space-y-1">
                  <h4 
                    onClick={() => onPlayVideo(item.video)}
                    className="font-bold text-[12.5px] text-white tracking-wide line-clamp-1 group-hover:text-fuchsia-400 transition-colors cursor-pointer"
                  >
                    {item.title}
                  </h4>
                  <p className="text-[10.5px] text-gray-400 font-medium truncate">
                    {item.genre} &bull; <Star className="w-3 h-3 text-amber-400 inline-block fill-current -mt-0.5" /> {item.rating}
                  </p>
                </div>

                {/* CARD ACTIONS: WATCHLIST, FAVORITE, RATE, REVIEWS & SCENE EXPLAINER */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-gray-400 text-[10px]">
                  <button 
                    onClick={() => toggleWatchlist(item.id, item.title)}
                    className={`hover:text-fuchsia-300 transition-colors flex items-center gap-1 ${watchlistIds.includes(item.id) ? 'text-fuchsia-400 font-bold' : ''}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Watchlist</span>
                  </button>

                  <button 
                    onClick={() => toggleFavorite(item.id, item.title)}
                    className={`hover:text-rose-400 transition-colors ${favoriteIds.includes(item.id) ? 'text-rose-500' : ''}`}
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </button>

                  <button 
                    onClick={() => {
                      setSelectedMovieForReviews({ id: item.id, title: item.title, coverUrl: item.coverUrl });
                      setIsReviewsModalOpen(true);
                    }}
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>

                  <button 
                    onClick={() => {
                      setSelectedMovieForScene({ id: item.id, title: item.title });
                      setIsSceneAnalysisOpen(true);
                    }}
                    className="hover:text-indigo-300 transition-colors text-[9px] font-bold text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-500/30"
                  >
                    AI Scene
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP MOVIE TRAILERS */}
        <div id="section-movie-trailers" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Top Movie Trailers</h2>
              <p className="text-[11px] text-gray-400">Watch upcoming teasers and audience excitement reactions.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-gray-400 font-bold hover:text-fuchsia-400 transition-colors cursor-pointer">See all</span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => scrollContainer(trailersScrollRef, -280)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => scrollContainer(trailersScrollRef, 280)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div 
            ref={trailersScrollRef}
            className="flex gap-4 md:gap-5 overflow-x-auto pb-2 scrollbar-none scroll-smooth snap-x"
          >
            {movieTrailers.map((dive) => (
              <div 
                key={dive.id}
                onClick={() => onPlayVideo(dive.video)}
                className="min-w-[230px] max-w-[250px] flex-1 bg-[#06050e]/50 border border-[#1b1932]/35 rounded-xl p-3 space-y-3 shrink-0 snap-start group hover:border-fuchsia-500/30 hover:bg-[#06050e]/85 transition-all cursor-pointer"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-[#0d091a] border border-[#231b3e]/40">
                  <div className="absolute top-2 left-2 z-10 flex items-center bg-fuchsia-600 px-1.5 py-0.5 rounded font-extrabold text-[8px] uppercase tracking-wide text-white shadow-md">
                    TRAILER
                  </div>
                  <img 
                    src={dive.coverUrl} 
                    alt={dive.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <div className="w-9 h-9 rounded-full bg-fuchsia-600 hover:scale-105 active:scale-95 flex items-center justify-center text-white shadow-md">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 text-[9px] px-1.5 py-0.5 bg-black/80 text-white rounded font-mono font-bold">{dive.duration}</span>
                </div>

                <div className="text-left space-y-0.5">
                  <h4 className="font-bold text-[12.5px] text-white tracking-wide line-clamp-1 group-hover:text-fuchsia-400 transition-colors">{dive.title}</h4>
                  <p className="text-[10px] text-emerald-400 font-semibold">{dive.reaction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BECAUSE YOU LOVE MOVIES */}
        <div id="section-recommendations" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Because You Love Movies</h2>
              <p className="text-[11px] text-gray-400">AI personalized picks based on your Sci-Fi watch history.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-gray-400 font-bold hover:text-fuchsia-400 transition-colors cursor-pointer">See all</span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => scrollContainer(recommendationsScrollRef, -280)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => scrollContainer(recommendationsScrollRef, 280)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div 
            ref={recommendationsScrollRef}
            className="flex gap-4 md:gap-5 overflow-x-auto pb-2 scrollbar-none scroll-smooth snap-x"
          >
            {recommendedMovies.map((playlist) => (
              <div 
                key={playlist.id}
                onClick={() => onPlayVideo(playlist.video)}
                className="min-w-[220px] max-w-[240px] flex-1 bg-[#12102e]/30 border border-[#2d226a]/30 rounded-2xl p-3 flex flex-col justify-between shrink-0 snap-start h-auto group hover:border-fuchsia-500/50 transition-all cursor-pointer"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/5 mb-3">
                  <img 
                    src={playlist.coverUrl} 
                    alt={playlist.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <div className="w-9 h-9 rounded-full bg-fuchsia-600 hover:scale-105 active:scale-95 flex items-center justify-center text-white shadow-md">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 text-[9px] px-1 bg-black/80 rounded font-mono text-white font-bold">{playlist.duration}</span>
                </div>

                <div className="space-y-1 text-left">
                  <h4 className="font-bold text-[12.5px] text-white tracking-wide line-clamp-1 leading-snug group-hover:text-fuchsia-400 transition-colors">{playlist.title}</h4>
                  <p className="text-[10.5px] text-gray-400 font-medium">
                    {playlist.genre} &bull; <Star className="w-3 h-3 text-amber-400 inline-block fill-current -mt-0.5" /> {playlist.rating}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NEW RELEASES */}
        <div id="section-new-releases" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base md:text-lg font-bold text-white tracking-tight">New Releases</h2>
              <p className="text-[11px] text-gray-400">Brand new movies added this week.</p>
            </div>

            {/* FILTER TABS */}
            <div className="flex items-center gap-1.5 bg-[#0a071a] p-1 rounded-xl border border-white/10">
              {(['today', 'week', 'month', '2026'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setNewReleaseFilter(tab)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all ${
                    newReleaseFilter === tab ? 'bg-fuchsia-600 text-white shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab === '2026' ? '2026 Upcoming' : tab}
                </button>
              ))}
            </div>
          </div>

          <div 
            ref={newReleasesScrollRef}
            className="flex gap-4 md:gap-5 overflow-x-auto pb-2 scrollbar-none scroll-smooth snap-x"
          >
            {newReleases.map((item) => (
              <div 
                key={item.id}
                onClick={() => onPlayVideo(item.video)}
                className="min-w-[210px] max-w-[230px] flex-1 bg-[#090715]/60 border border-[#20183b]/40 rounded-2xl p-3 space-y-3 shrink-0 snap-start group hover:border-fuchsia-500/30 transition-all cursor-pointer"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/5">
                  <div className="absolute top-2 left-2 z-10 flex items-center bg-fuchsia-600 px-1.5 py-0.5 rounded font-extrabold text-[8px] uppercase tracking-wide text-white shadow-md">
                    NEW
                  </div>
                  <img 
                    src={item.coverUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <div className="w-9 h-9 rounded-full bg-fuchsia-600 hover:scale-105 active:scale-95 flex items-center justify-center text-white shadow-md">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 text-[9px] px-1 bg-black/80 rounded font-mono text-white font-bold">{item.duration}</span>
                </div>

                <div className="space-y-1.5 text-left">
                  <h4 className="font-bold text-[12px] text-white tracking-wide line-clamp-2 leading-snug group-hover:text-fuchsia-400 transition-colors">{item.title}</h4>
                  <p className="text-[10.5px] text-gray-400 font-medium">
                    {item.genre} &bull; <Star className="w-3 h-3 text-amber-400 inline-block fill-current -mt-0.5" /> {item.rating}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BROWSE BY GENRE */}
        <div id="section-browse-genres" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Browse by Genre</h2>
              <p className="text-[11px] text-gray-400">Find movies by your favorite genres and mood atmospheres.</p>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => scrollContainer(genresScrollRef, -200)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => scrollContainer(genresScrollRef, 200)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div 
            ref={genresScrollRef}
            className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-none scroll-smooth snap-x"
          >
            {genres.map((topic, idx) => {
              const TopicIcon = topic.icon;
              const isSelected = activeGenreFilter === topic.name.toLowerCase();
              return (
                <div 
                  key={idx}
                  onClick={() => setActiveGenreFilter(isSelected ? 'all' : topic.name.toLowerCase())}
                  className={`min-w-[155px] md:min-w-[175px] flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300 cursor-pointer snap-start ${topic.bg} ${topic.border} ${topic.glow} ${
                    isSelected ? 'border-fuchsia-500 bg-fuchsia-950/25 scale-[1.02]' : 'hover:scale-[1.02] hover:border-fuchsia-500/20'
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

      </motion.div>

      {/* ================= MODAL 1: AI MOVIE CURATOR & ASSISTANT ================= */}
      <AnimatePresence>
        {isAiAssistantOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0e0921] border border-[#4d258b] w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-5 text-left relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsAiAssistantOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="p-2.5 rounded-xl bg-fuchsia-600/20 border border-fuchsia-500/40 text-fuchsia-300">
                  <Bot className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">SoftCast AI Film Curator ⭐</h3>
                  <p className="text-xs text-gray-400">Natural language movie matching, mood selection & deep recommendations.</p>
                </div>
              </div>

              {/* MOOD SELECTION CHIPS */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Select Mood / Category:</label>
                <div className="flex flex-wrap gap-2">
                  {['Family Night', 'Dark Sci-Fi', 'Mind Bending', 'Feel Good', 'Oscar Favorites'].map(m => (
                    <button
                      key={m}
                      onClick={() => setAssistantMood(m)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        assistantMood === m 
                          ? 'bg-fuchsia-600 text-white shadow-md' 
                          : 'bg-[#181136] border border-white/10 text-gray-300 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* INPUT FORM */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  placeholder="e.g. 'Bugun oilam bilan ko'rishga 2 soatgacha bo'lgan komediya tanlab ber'"
                  className="flex-1 bg-[#070512] border border-[#2a1d4f] focus:border-fuchsia-500 text-white px-3.5 py-2.5 rounded-xl text-xs outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleGetAiRecommendations()}
                />
                <button
                  onClick={handleGetAiRecommendations}
                  disabled={assistantLoading}
                  className="px-4 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 shrink-0"
                >
                  {assistantLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Search AI</span>
                </button>
              </div>

              {/* RECOMMENDATION RESULTS */}
              {aiRecommendations && (
                <div className="space-y-3 p-4 bg-[#070414] border border-fuchsia-500/30 rounded-xl">
                  <p className="text-xs text-fuchsia-300 font-bold">{aiRecommendations.summary}</p>
                  <div className="space-y-2.5">
                    {aiRecommendations.recommendations.map((rec, i) => (
                      <div key={i} className="p-3 bg-[#110c2c] border border-white/5 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-white">{rec.title} ({rec.year})</h5>
                          <span className="text-[10px] text-amber-400 font-bold font-mono">⭐ {rec.rating}</span>
                        </div>
                        <p className="text-[11px] text-gray-300 leading-relaxed">{rec.reason}</p>
                        <div className="text-[9.5px] text-fuchsia-400 font-mono pt-1">{rec.genre}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 2: WATCH PARTY ROOM ================= */}
      <AnimatePresence>
        {isWatchPartyOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0f0924] border border-[#532694] w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-5 text-left relative"
            >
              <button 
                onClick={() => setIsWatchPartyOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-fuchsia-600/20 border border-fuchsia-500/40 text-fuchsia-300">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Live Watch Party 🍿</h3>
                    <p className="text-xs text-gray-400">Sync playback room code: <strong className="text-fuchsia-300 font-mono">SOFT-8921</strong></p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Synced
                </span>
              </div>

              {/* TIMECODE SYNC BAR */}
              <div className="p-3 bg-[#080517] border border-white/10 rounded-xl flex items-center justify-between text-xs">
                <span className="text-gray-400">Movie: <strong className="text-white">Interstellar (4K HDR)</strong></span>
                <span className="text-fuchsia-400 font-mono font-bold">01:24:15 / 02:49:04</span>
              </div>

              {/* PARTY MEMBERS */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">In Room:</span>
                {['Aslbek (Host)', 'Malika', 'Bobur', 'Sarah'].map(u => (
                  <span key={u} className="px-2 py-0.5 bg-[#1b123a] border border-white/10 text-gray-200 text-[10px] font-bold rounded-md">
                    {u}
                  </span>
                ))}
              </div>

              {/* CHAT MESSAGES */}
              <div className="h-44 overflow-y-auto bg-[#070414] border border-white/5 p-3 rounded-xl space-y-2 text-xs">
                {partyChatMessages.map(msg => (
                  <div key={msg.id} className="text-left space-y-0.5">
                    <span className="font-bold text-fuchsia-300">{msg.user} <span className="text-[9px] text-gray-500 font-normal">({msg.time})</span>:</span>
                    <p className="text-gray-200 bg-[#120c2d] p-2 rounded-lg inline-block text-[11px] leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* CHAT INPUT */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={partyChatInput}
                  onChange={(e) => setPartyChatInput(e.target.value)}
                  placeholder="Send live chat message to party..."
                  className="flex-1 bg-[#070512] border border-[#2a1d4f] focus:border-fuchsia-500 text-white px-3.5 py-2 rounded-xl text-xs outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendPartyMessage()}
                />
                <button
                  onClick={handleSendPartyMessage}
                  className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold rounded-xl"
                >
                  Send
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 3: PERSONAL CINEMA JOURNEY STATS ================= */}
      <AnimatePresence>
        {isJourneyOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0d0921] border border-[#482187] w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5 text-left relative"
            >
              <button 
                onClick={() => setIsJourneyOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300">
                  <Tv className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Personal Cinema Journey 📊</h3>
                  <p className="text-xs text-gray-400">Aslbek's viewing statistics & collection metrics.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#140c33] border border-white/10 rounded-xl space-y-1 text-center">
                  <span className="text-2xl font-black text-fuchsia-400 font-mono">245</span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Movies Watched</p>
                </div>
                <div className="p-3.5 bg-[#140c33] border border-white/10 rounded-xl space-y-1 text-center">
                  <span className="text-2xl font-black text-indigo-400 font-mono">430h</span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Watch Time</p>
                </div>
                <div className="p-3.5 bg-[#140c33] border border-white/10 rounded-xl space-y-1 text-center">
                  <span className="text-sm font-black text-cyan-400">Sci-Fi</span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Favorite Genre</p>
                </div>
                <div className="p-3.5 bg-[#140c33] border border-white/10 rounded-xl space-y-1 text-center">
                  <span className="text-xs font-black text-amber-400 truncate block">Christopher Nolan</span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Top Director</p>
                </div>
              </div>

              <div className="p-3 bg-[#080517] border border-white/10 rounded-xl space-y-1">
                <h5 className="text-xs font-bold text-white">Custom Collections:</h5>
                <p className="text-[11px] text-gray-400">📁 My Sci-Fi Vault (12 films)</p>
                <p className="text-[11px] text-gray-400">📁 Mind Bending Thrillers (8 films)</p>
                <p className="text-[11px] text-gray-400">📁 Oscar Best Picture Winners (15 films)</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 4: ACTORS & DIRECTORS ECOSYSTEM ================= */}
      <AnimatePresence>
        {isActorsModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0e0a22] border border-[#522896] w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-5 text-left relative max-h-[85vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsActorsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="p-2.5 rounded-xl bg-amber-600/20 border border-amber-500/40 text-amber-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Directors & Actors Ecosystem 🎭</h3>
                  <p className="text-xs text-gray-400">Explore filmographies, awards, and follow creators.</p>
                </div>
              </div>

              <div className="space-y-4">
                {castEcosystem.map((person) => (
                  <div key={person.id} className="p-4 bg-[#130c2e] border border-white/10 rounded-xl flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <img src={person.photo} alt={person.name} className="w-14 h-14 rounded-full object-cover shrink-0 border border-fuchsia-500/50" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{person.name}</h4>
                          <span className="px-2 py-0.5 bg-fuchsia-950 border border-fuchsia-500/40 text-fuchsia-300 text-[9px] font-bold rounded-full">
                            {person.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-300 leading-relaxed">{person.bio}</p>
                        <p className="text-[10px] text-amber-400 font-semibold">{person.awards}</p>
                        <div className="text-[10px] text-gray-400">Top Movies: {person.topMovies.join(', ')}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFollowCast(person.id, person.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        person.isFollowing
                          ? 'bg-fuchsia-950 border border-fuchsia-500 text-fuchsia-300'
                          : 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white'
                      }`}
                    >
                      {person.isFollowing ? 'Following ✓' : '+ Follow'}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 5: COMMUNITY REVIEWS ================= */}
      <AnimatePresence>
        {isReviewsModalOpen && selectedMovieForReviews && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0e0a22] border border-[#522896] w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 text-left relative max-h-[85vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsReviewsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <img src={selectedMovieForReviews.coverUrl} alt="" className="w-12 h-10 object-cover rounded-lg shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedMovieForReviews.title} - Community Reviews</h3>
                  <p className="text-[10.5px] text-gray-400">IMDb & SoftCast verified user reviews.</p>
                </div>
              </div>

              {/* POST A REVIEW INPUT */}
              <div className="p-3 bg-[#130d31] border border-white/10 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-200">Write Your Review:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-400">Score:</span>
                    <select 
                      value={userScore}
                      onChange={(e) => setUserScore(Number(e.target.value))}
                      className="bg-[#080517] text-amber-400 text-xs font-bold px-1.5 py-0.5 rounded border border-white/10"
                    >
                      {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(s => (
                        <option key={s} value={s}>{s}/10 ⭐</option>
                      ))}
                    </select>
                  </div>
                </div>

                <textarea
                  rows={2}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Share your thoughts or scene breakdown..."
                  className="w-full bg-[#080517] border border-white/10 focus:border-fuchsia-500 text-white p-2.5 rounded-lg text-xs outline-none resize-none"
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-[11px] text-gray-400 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={newReviewSpoiler}
                      onChange={(e) => setNewReviewSpoiler(e.target.checked)}
                      className="accent-fuchsia-600 rounded"
                    />
                    <span>Contains Spoilers</span>
                  </label>

                  <button
                    onClick={handleSubmitReview}
                    className="px-3.5 py-1.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold rounded-lg"
                  >
                    Post Review
                  </button>
                </div>
              </div>

              {/* REVIEWS LIST */}
              <div className="space-y-3 pt-2">
                {movieReviews.map((rev) => (
                  <div key={rev.id} className="p-3 bg-[#110c29] border border-white/5 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={rev.userAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-xs font-bold text-white">{rev.userName}</span>
                      </div>
                      <span className="text-xs font-bold text-amber-400">⭐ {rev.rating}/10</span>
                    </div>
                    <p className="text-[11.5px] text-gray-200 leading-relaxed">{rev.text}</p>
                    <div className="flex items-center justify-between text-[10px] text-gray-500">
                      <span>{rev.date}</span>
                      <span>❤️ {rev.likes} likes</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 6: AI SCENE ANALYSIS ================= */}
      <AnimatePresence>
        {isSceneAnalysisOpen && selectedMovieForScene && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0e0a22] border border-[#522896] w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 text-left relative"
            >
              <button 
                onClick={() => setIsSceneAnalysisOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-300">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Scene Breakdown: {selectedMovieForScene.title}</h3>
                  <p className="text-[10.5px] text-gray-400">Deep director symbolism & soundtrack analysis.</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300">Scene Question:</label>
                <input
                  type="text"
                  value={sceneAnalysisInput}
                  onChange={(e) => setSceneAnalysisInput(e.target.value)}
                  className="w-full bg-[#080517] border border-white/10 focus:border-indigo-500 text-white p-2.5 rounded-lg text-xs outline-none"
                />
                <button
                  onClick={handleRunSceneAnalysis}
                  disabled={sceneAnalysisLoading}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2"
                >
                  {sceneAnalysisLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Analyze Scene'}
                </button>
              </div>

              {sceneAnalysisResult && (
                <div className="p-3.5 bg-[#080517] border border-indigo-500/30 rounded-xl text-xs leading-relaxed text-gray-200 whitespace-pre-line">
                  {sceneAnalysisResult}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
