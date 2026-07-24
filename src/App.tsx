import { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomeHub from './components/HomeHub';
import CategoryHub from './components/CategoryHub';
import GamingHub from './components/GamingHub';
import TechnologyHub from './components/TechnologyHub';
import CinemaHub from './components/CinemaHub';
import DiscoverHub from './components/DiscoverHub';
import AIChatPicks from './components/AIChatPicks';
import LearningJourney from './components/LearningJourney';
import LiveHub from './components/LiveHub';
import LibraryHub from './components/LibraryHub';
import WatchJourneyHub from './components/WatchJourneyHub';
import SettingsHub from './components/SettingsHub';
import VideoPlayer from './components/VideoPlayer';
import PremiumModal from './components/PremiumModal';
import WelcomeLanding from './components/WelcomeLanding';
import KeypadTourModal from './components/KeypadTourModal';
import CookieBanner from './components/CookieBanner';
import { initialVideos, learningPaths } from './data';
import { Video, UserProfile, LearningPath } from './types';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { 
  fetchSupabaseVideos, 
  insertSupabaseVideo, 
  fetchSupabaseLearningPaths, 
  isSupabaseConfigured,
  saveSupabaseUserProfile,
  getSupabaseClient,
  signOutSupabase 
} from './lib/supabase';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('softview_logged_in');
    // If not explicitly set to false, allow welcome screen for initial landing
    return saved === 'true';
  });

  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [showFirstVideoBanner, setShowFirstVideoBanner] = useState(false);
  const [showKeypadTourModal, setShowKeypadTourModal] = useState(false);

  // Initialize videos & learning paths in state (empty by default as demo data was removed)
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [learningPathsData, setLearningPathsData] = useState<LearningPath[]>(learningPaths);

  // User profile state matching screenshot "Aslbek - Level 12" and progress bar
  const [user, setUser] = useState<UserProfile>({
    name: 'Aslbek',
    level: 12,
    xp: 620, // 62% towards Level 13, matching the visual progress bar in sidebar
    xpNextLevel: 1000,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop',
    isPremium: false
  });

  // Watch history and liked videos trackers (empty by default)
  const [watchHistory, setWatchHistory] = useState<Video[]>([]);
  const [likedVideos, setLikedVideos] = useState<Video[]>([]);

  // Check for custom Google OAuth URL params or popup message
  useEffect(() => {
    // 1. Check URL parameters if redirected back from custom OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth_success') === 'true') {
      const userName = urlParams.get('user_name') || 'Google User';
      const userAvatar = urlParams.get('user_avatar') || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop';
      
      setIsLoggedIn(true);
      localStorage.setItem('softview_logged_in', 'true');
      setUser((prev) => ({
        ...prev,
        name: userName,
        avatarUrl: userAvatar
      }));

      // Clean URL search parameters without reloading
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    // 2. Listen for postMessage from popup window custom OAuth
    const handlePopupMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SOFTVIEW_CUSTOM_GOOGLE_AUTH' && event.data.payload) {
        const payload = event.data.payload;
        const googleUser = payload.user || {};
        const userName = googleUser.name || googleUser.email?.split('@')[0] || 'Google User';
        const avatar = googleUser.picture || googleUser.avatarUrl;

        setIsLoggedIn(true);
        localStorage.setItem('softview_logged_in', 'true');
        setUser((prev) => ({
          ...prev,
          name: userName,
          avatarUrl: avatar || prev.avatarUrl
        }));
      }
    };

    window.addEventListener('message', handlePopupMessage);
    return () => window.removeEventListener('message', handlePopupMessage);
  }, []);

  // Fetch initial data & subscribe to Supabase Auth on mount
  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured()) {
        const supVideos = await fetchSupabaseVideos();
        if (supVideos.length > 0) {
          setVideos(supVideos);
        }
        const supPaths = await fetchSupabaseLearningPaths();
        if (supPaths.length > 0) {
          setLearningPathsData(supPaths);
        }
      } else {
        // Fetch from local server API fallback
        try {
          const res = await fetch('/api/videos');
          const data = await res.json();
          if (data.success && data.videos && data.videos.length > 0) {
            setVideos(data.videos);
          }
        } catch (err) {
          console.warn('Backend API fetch fallback:', err);
        }
      }
    }
    loadData();

    // Supabase Auth session listener
    const client = getSupabaseClient();
    if (client) {
      // Initial session check
      client.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setIsLoggedIn(true);
          localStorage.setItem('softview_logged_in', 'true');
          const meta = session.user.user_metadata || {};
          const userName = meta.full_name || meta.name || session.user.email?.split('@')[0] || 'Google User';
          const avatar = meta.avatar_url || meta.picture;
          setUser((prev) => ({
            ...prev,
            name: userName,
            avatarUrl: avatar || prev.avatarUrl
          }));
        }
      });

      // Auth State Change listener
      const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')) {
          setIsLoggedIn(true);
          localStorage.setItem('softview_logged_in', 'true');
          const meta = session.user.user_metadata || {};
          const userName = meta.full_name || meta.name || session.user.email?.split('@')[0] || 'Google User';
          const avatar = meta.avatar_url || meta.picture;
          setUser((prev) => ({
            ...prev,
            name: userName,
            avatarUrl: avatar || prev.avatarUrl
          }));
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);


  // Add experience points and handle levels
  const handleAddXp = (amount: number) => {
    setUser((prev) => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      if (newXp >= prev.xpNextLevel) {
        newLevel += 1;
        newXp = newXp - prev.xpNextLevel;
      }
      const updated = {
        ...prev,
        level: newLevel,
        xp: newXp
      };
      if (isSupabaseConfigured()) {
        saveSupabaseUserProfile(updated);
      }
      return updated;
    });
  };

  // Video playback launcher
  const handlePlayVideo = (video: Video) => {
    setSelectedVideo(video);

    // Track watch history
    setWatchHistory((prev) => {
      const filtered = prev.filter((v) => v.id !== video.id);
      return [video, ...filtered];
    });
  };

  // Import custom video card & persist to Supabase / Backend API
  const handleAddCustomVideo = async (newVideo: Video) => {
    const isFirst = videos.length === 0;
    setVideos((prev) => [newVideo, ...prev]);

    if (isFirst) {
      setShowFirstVideoBanner(true);
      setShowKeypadTourModal(true);
    }

    // Save to Supabase
    if (isSupabaseConfigured()) {
      await insertSupabaseVideo(newVideo);
    }

    // Save to server backend
    try {
      await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVideo)
      });
    } catch (e) {
      console.warn('API post error:', e);
    }

    // Also launch and play immediately!
    handlePlayVideo(newVideo);
  };

  // Clear library history
  const handleClearHistory = () => {
    setWatchHistory([]);
  };

  const handleUpdateUserProfile = (updated: UserProfile) => {
    setUser(updated);
  };

  // Welcome / Sign In handlers
  const handleSignIn = (nameToPass?: string) => {
    setIsLoggedIn(true);
    localStorage.setItem('softview_logged_in', 'true');
    if (nameToPass && nameToPass.trim()) {
      setUser((prev) => ({ ...prev, name: nameToPass }));
    }
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    localStorage.setItem('softview_logged_in', 'false');
    signOutSupabase();
  };

  // SoftCast Premium activation
  const handleActivatePremium = () => {
    setUser((prev) => ({ ...prev, isPremium: true }));
    setIsPremiumModalOpen(false);
    handleAddXp(250); // Award 250 XP bonus for premium activation!
  };

  // Search logic
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videos;
    const query = searchQuery.toLowerCase();
    return videos.filter(
      (v) =>
        v.title.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query) ||
        v.creator.toLowerCase().includes(query)
    );
  }, [videos, searchQuery]);

  if (!isLoggedIn) {
    return (
      <>
        <WelcomeLanding onSignIn={handleSignIn} />
        <CookieBanner />
      </>
    );
  }

  return (
    <div id="softcast-app" className="flex bg-[#05040d] text-gray-100 font-sans h-screen overflow-hidden">
      {/* LEFT SIDEBAR NAVIGATION PANEL */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedVideo(null); // Clear video player when changing categories
        }}
        user={user}
        onOpenPremium={() => setIsPremiumModalOpen(true)}
      />

      {/* RIGHT MAIN WORKSPACE CANVAS */}
      <div id="main-content-canvas" className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* HEADER TOP ROW ACTION BAR */}
        <Header
          user={user}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setActiveTab={setActiveTab}
          onOpenPremium={() => setIsPremiumModalOpen(true)}
          onSignOut={handleSignOut}
        />

        {/* SUB-VIEW PANELS CONTAINER */}
        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {selectedVideo ? (
              /* ACTIVE VIDEO PLAYER VIEW (Takes priority) */
              <motion.div
                key="video-player"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full"
              >
                <VideoPlayer
                  video={selectedVideo}
                  onClose={() => setSelectedVideo(null)}
                  onAddXp={handleAddXp}
                />
              </motion.div>
            ) : (
              /* TAB COMPONENT ROUTER */
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="w-full h-full"
              >
                {activeTab === 'settings' ? (
                  <SettingsHub
                    user={user}
                    onUpdateUser={handleUpdateUserProfile}
                    onClearHistory={handleClearHistory}
                  />
                ) : videos.length === 0 ? (
                  /* WHEN DATABASE HAS NO VIDEOS, SHOW HOME EMPTY STATE ACROSS ALL OTHER TABS */
                  <HomeHub
                    videos={filteredVideos}
                    searchQuery={searchQuery}
                    onPlayVideo={handlePlayVideo}
                    setActiveTab={setActiveTab}
                    user={user}
                    onUpdateUser={handleUpdateUserProfile}
                    onAddXp={handleAddXp}
                    onAddCustomVideo={handleAddCustomVideo}
                  />
                ) : (
                  /* NORMAL TAB CONTENT WHEN VIDEOS EXIST IN DATABASE */
                  <>
                    {activeTab === 'home' && (
                      <HomeHub
                        videos={filteredVideos}
                        searchQuery={searchQuery}
                        onPlayVideo={handlePlayVideo}
                        setActiveTab={setActiveTab}
                        user={user}
                        onUpdateUser={handleUpdateUserProfile}
                        onAddXp={handleAddXp}
                        onAddCustomVideo={handleAddCustomVideo}
                      />
                    )}
                    {activeTab === 'discover' && (
                      <DiscoverHub
                        videos={videos}
                        onPlayVideo={handlePlayVideo}
                        searchQuery={searchQuery}
                        onAddXp={handleAddXp}
                      />
                    )}
                    {activeTab === 'ai-picks' && (
                      <AIChatPicks
                        videos={videos}
                        onPlayVideo={handlePlayVideo}
                        isPremium={user.isPremium}
                        onAddXp={handleAddXp}
                      />
                    )}
                    {activeTab === 'learn' && (
                      <LearningJourney
                        onPlayVideo={handlePlayVideo}
                        onAddXp={handleAddXp}
                        isPremium={user.isPremium}
                        learningPathsData={learningPathsData}
                        setLearningPathsData={setLearningPathsData}
                      />
                    )}
                    {activeTab === 'gaming' && (
                      <GamingHub
                        videos={videos}
                        onPlayVideo={handlePlayVideo}
                        isPremium={user.isPremium}
                      />
                    )}
                    {activeTab === 'technology' && (
                      <TechnologyHub
                        videos={videos}
                        onPlayVideo={handlePlayVideo}
                        isPremium={user.isPremium}
                      />
                    )}
                    {activeTab === 'cinema' && (
                      <CinemaHub
                        videos={videos}
                        onPlayVideo={handlePlayVideo}
                        isPremium={user.isPremium}
                      />
                    )}
                    {activeTab === 'live' && (
                      <LiveHub
                        videos={videos}
                        onAddXp={handleAddXp}
                        onPlayVideo={handlePlayVideo}
                      />
                    )}
                    {activeTab === 'library' && (
                      <LibraryHub
                        videos={videos}
                        watchHistory={watchHistory}
                        likedVideos={likedVideos}
                        onPlayVideo={handlePlayVideo}
                        onAddCustomVideo={handleAddCustomVideo}
                        onClearHistory={handleClearHistory}
                      />
                    )}
                    {activeTab === 'journey' && (
                      <WatchJourneyHub
                        user={user}
                      />
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* OVERLAY MODALS */}
      <AnimatePresence>
        {isPremiumModalOpen && (
          <PremiumModal
            isOpen={isPremiumModalOpen}
            onClose={() => setIsPremiumModalOpen(false)}
            onActivate={handleActivatePremium}
          />
        )}
      </AnimatePresence>

      {/* CONGRATULATORY FIRST VIDEO NOTIFICATION BAR */}
      <AnimatePresence>
        {showFirstVideoBanner && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-5 left-1/2 z-50 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white px-6 py-3.5 rounded-2xl shadow-[0_10px_40px_rgba(16,185,129,0.35)] border border-emerald-400/40 flex items-center gap-4 max-w-2xl w-[92%] sm:w-auto text-xs sm:text-sm font-bold"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-300 animate-bounce" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-black text-sm">🎉 Congratulations! Your first video was uploaded successfully!</p>
              <p className="text-emerald-100 text-[11px] font-medium mt-0.5">SoftView video tools and Keypad tour panel are now unlocked.</p>
            </div>
            <button 
              onClick={() => setShowFirstVideoBanner(false)}
              className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all active:scale-95 shrink-0"
            >
              Got It
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KEYPAD TOUR MODAL */}
      <KeypadTourModal
        isOpen={showKeypadTourModal}
        onClose={() => setShowKeypadTourModal(false)}
      />

      {/* COOKIE & PRIVACY AGREEMENT BADGE/BANNER */}
      <CookieBanner />
    </div>
  );
}
