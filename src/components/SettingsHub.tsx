import React, { useState, useMemo, useEffect } from 'react';
import { 
  User, Shield, Lock, Link2, Tv, Moon, Play, Bell, Globe, Heart, 
  ShieldAlert, Download, Database, Laptop, HelpCircle, Info, LogOut, 
  Search, Crown, Camera, Sparkles, ChevronRight, Check, Trash2, 
  RefreshCw, Star, Share2, Users, Radio, Save, X, Eye, ThumbsUp, AlertCircle,
  Fingerprint, Key, AlertTriangle, Sliders, Cpu, Volume2, EyeOff, Layers, FileText,
  Smartphone, CreditCard, HardDrive, Bot, CheckCircle2, ShieldCheck, Zap,
  UserCheck, Activity, Award, BarChart3, Wifi, Languages, SlidersHorizontal, Scale
} from 'lucide-react';
import { UserProfile } from '../types';
import { syncUserToBothDatabases, isSupabaseConfigured } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsHubProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onClearHistory: () => void;
}

export default function SettingsHub({ user, onUpdateUser, onClearHistory }: SettingsHubProps) {
  // Active Tab State across all 23 modules
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. PROFILE & IDENTITY STATE
  const [editName, setEditName] = useState(user.name);
  const [username, setUsername] = useState('aslbek_dev');
  const [editEmail, setEditEmail] = useState('aslbek.dev@gmail.com');
  const [editBio, setEditBio] = useState('Full-stack developer & AI enthusiast crafting modern video experiences.');
  const [website, setWebsite] = useState('https://softview.dev');
  const [location, setLocation] = useState('Tashkent, Uzbekistan');
  const [pronouns, setPronouns] = useState('he/him');
  const [editAvatar, setEditAvatar] = useState(user.avatarUrl);
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop');
  const [twitterUrl, setTwitterUrl] = useState('https://x.com/aslbek_dev');
  const [githubUrl, setGithubUrl] = useState('https://github.com/aslbek-dev');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  // 2. ACCOUNT SECURITY & PASSKEYS STATE
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authApp2FA, setAuthApp2FA] = useState(true);
  const [sms2FA, setSms2FA] = useState(false);
  const [email2FA, setEmail2FA] = useState(true);
  const [passkeyFaceId, setPasskeyFaceId] = useState(true);
  const [passkeyFingerprint, setPasskeyFingerprint] = useState(true);
  const [passkeyWindowsHello, setPasskeyWindowsHello] = useState(true);
  const [activeSessions, setActiveSessions] = useState([
    { id: '1', device: 'Chrome on Windows 11', location: 'Tashkent, Uzbekistan', lastActive: '2 minutes ago', current: true },
    { id: '2', device: 'Android App (Redmi Note 12)', location: 'Samarkand, Uzbekistan', lastActive: 'Today at 10:24 AM', current: false },
    { id: '3', device: 'Safari on macOS Sonoma', location: 'Berlin, Germany', lastActive: '3 days ago', current: false },
  ]);

  // 3. AI SECURITY PROTECTION STATE
  const [aiSecurityActive, setAiSecurityActive] = useState(true);
  const [aiBotDetection, setAiBotDetection] = useState(true);
  const [aiHijackProtection, setAiHijackProtection] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState([
    { id: 's1', location: 'Frankfurt, Germany', time: '10 minutes ago', ip: '185.220.101.5', status: 'pending' }
  ]);

  // 4. PRIVACY CENTER STATE
  const [profileVisibility, setProfileVisibility] = useState('Public');
  const [watchHistoryPrivacy, setWatchHistoryPrivacy] = useState(true);
  const [searchHistoryPrivacy, setSearchHistoryPrivacy] = useState(true);
  const [likesPrivacy, setLikesPrivacy] = useState(false);
  const [playlistsPrivacy, setPlaylistsPrivacy] = useState(false);
  const [commentsPrivacy, setCommentsPrivacy] = useState(false);
  const [subscriptionsPrivacy, setSubscriptionsPrivacy] = useState(false);
  const [showWatchedVideos, setShowWatchedVideos] = useState(true);
  const [showSavedVideos, setShowSavedVideos] = useState(false);
  const [showAchievements, setShowAchievements] = useState(true);
  const [showBadges, setShowBadges] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);

  // 5. AI PRIVACY MANAGER STATE
  const privacyScore = 92;

  // 6. PLAYBACK SETTINGS STATE
  const [playbackQuality, setPlaybackQuality] = useState('1080p');
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');
  const [autoplay, setAutoplay] = useState(true);
  const [skipIntro, setSkipIntro] = useState(true);
  const [skipSponsor, setSkipSponsor] = useState(true);
  const [autoCaptions, setAutoCaptions] = useState(true);
  const [smartChaptersAI, setSmartChaptersAI] = useState(true);

  // 7. AI EXPERIENCE SETTINGS STATE
  const [personalizedFeed, setPersonalizedFeed] = useState(true);
  const [aiPicks, setAiPicks] = useState(true);
  const [discoverRecommendations, setDiscoverRecommendations] = useState(true);
  const [aiLearningMode, setAiLearningMode] = useState(75); // 75% educational, 25% entertainment
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(true);

  // 8. CONTENT PREFERENCES STATE
  const [interests, setInterests] = useState([
    { name: 'AI & Machine Learning', affinity: 92, enabled: true },
    { name: 'Programming & Web Dev', affinity: 85, enabled: true },
    { name: 'Technology & Hardware', affinity: 78, enabled: true },
    { name: 'Gaming & Esports', affinity: 60, enabled: true },
    { name: 'Cinema & Filmmaking', affinity: 45, enabled: false },
    { name: 'Education & Science', affinity: 90, enabled: true },
  ]);

  // 9. PARENTAL CONTROLS STATE
  const [childAccount, setChildAccount] = useState(false);
  const [dailyScreenTimeLimit, setDailyScreenTimeLimit] = useState('2 hours');
  const [bedtimeLock, setBedtimeLock] = useState('22:00');
  const [contentFilterLevel, setContentFilterLevel] = useState('Moderate');
  const [aiContentScanner, setAiContentScanner] = useState(true);

  // 10. CREATOR MODE STATE
  const [creatorMonetization, setCreatorMonetization] = useState(true);
  const [creatorCopyright, setCreatorCopyright] = useState(true);

  // 11. DOWNLOAD & OFFLINE STATE
  const [downloadQuality, setDownloadQuality] = useState('1080p Full HD');
  const [storageLocation, setStorageLocation] = useState('Internal Storage (34.2 GB Free)');
  const [autoDownloadNext, setAutoDownloadNext] = useState(true);
  const [smartOfflineAI, setSmartOfflineAI] = useState(true);

  // 12. DATA & STORAGE STATE
  const [cacheSize, setCacheSize] = useState(245.6);
  const [downloadsSize, setDownloadsSize] = useState(12.4);
  const [offlineVideosSize, setOfflineVideosSize] = useState(8.0);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [dbUsersList, setDbUsersList] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const fetchUsersFromDatabase = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setDbUsersList(data.users);
      }
    } catch (err) {
      console.warn('Failed to load users from DB:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'storage') {
      fetchUsersFromDatabase();
    }
  }, [activeTab]);

  // 13. NOTIFICATIONS STATE
  const [notifyNewUploads, setNotifyNewUploads] = useState(true);
  const [notifyLiveStreams, setNotifyLiveStreams] = useState(true);
  const [notifyRecommendations, setNotifyRecommendations] = useState(false);
  const [notifyComments, setNotifyComments] = useState(true);
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [notifyRevenue, setNotifyRevenue] = useState(true);
  const [notifySecurity, setNotifySecurity] = useState(true);
  const [notifyAiWeeklyReport, setNotifyAiWeeklyReport] = useState(true);
  const [notifyLearningReminders, setNotifyLearningReminders] = useState(true);

  // 14. DEVICES MANAGEMENT STATE
  const [connectedDevices, setConnectedDevices] = useState([
    { id: 'd1', name: 'MacBook Pro M3', type: 'Laptop', active: 'Active now', status: 'Primary' },
    { id: 'd2', name: 'Redmi Note 12 Pro', type: 'Android Phone', active: 'Yesterday', status: 'Companion' },
    { id: 'd3', name: 'iPad Air 5th Gen', type: 'Tablet', active: '3 days ago', status: 'Standby' }
  ]);

  // 15. LANGUAGE & REGION STATE
  const [appLanguage, setAppLanguage] = useState('English');
  const [subtitleLanguage, setSubtitleLanguage] = useState('English (Auto)');
  const [translationLanguage, setTranslationLanguage] = useState('Uzbek');
  const [appRegion, setAppRegion] = useState('Uzbekistan (UZ)');
  const [timezone, setTimezone] = useState('Asia/Tashkent (UTC+5)');
  const [aiSubtitles, setAiSubtitles] = useState(true);
  const [aiTranslatedComments, setAiTranslatedComments] = useState(true);

  // 16. ACCESSIBILITY STATE
  const [screenReader, setScreenReader] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('Medium');
  const [colorBlindnessMode, setColorBlindnessMode] = useState('None');
  const [reducedMotion, setReducedMotion] = useState(false);

  // 17. PAYMENTS & PREMIUM STATE
  const [premiumActive, setPremiumActive] = useState(user.isPremium ?? true);

  // 18. AI DATA CONTROL STATE
  const [consentWatchHistory, setConsentWatchHistory] = useState(true);
  const [consentLikes, setConsentLikes] = useState(true);
  const [consentSearches, setConsentSearches] = useState(true);
  const [consentPlaylists, setConsentPlaylists] = useState(false);

  // 19. ACCOUNT DATA EXPORT STATE
  const [exportItems, setExportItems] = useState({
    videos: true,
    history: true,
    comments: true,
    playlists: true,
    profile: true
  });
  const [isExporting, setIsExporting] = useState(false);

  // 21. SOFTVIEW LABS STATE
  const [labsSummary, setLabsSummary] = useState(true);
  const [labsChapters, setLabsChapters] = useState(true);
  const [labsSmartSearch, setLabsSmartSearch] = useState(true);
  const [labsVoiceNav, setLabsVoiceNav] = useState(false);

  // 23. ABOUT SOFTVIEW STATE
  const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);

  // Save changes to profile
  const handleSaveProfile = () => {
    onUpdateUser({
      ...user,
      name: editName,
      avatarUrl: editAvatar
    });
    triggerToast('Profile & Identity updated successfully!');
  };

  // AI Bio Generator
  const handleGenerateAiBio = () => {
    setIsGeneratingBio(true);
    setTimeout(() => {
      setEditBio('🚀 Tech Voyager & Content Creator. Exploring AI systems, full-stack architecture, and interactive video media on SoftView.');
      setIsGeneratingBio(false);
      triggerToast('AI Bio generated!');
    }, 1200);
  };

  // Clear cache action
  const handleClearCache = () => {
    setIsClearingCache(true);
    setTimeout(() => {
      setCacheSize(0);
      setIsClearingCache(false);
      triggerToast('Storage cache cleared! 245.6 MB freed.');
    }, 1000);
  };

  // Export Data Action
  const handleStartExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      triggerToast('GDPR Data Archive created! Download starting...');
    }, 2000);
  };

  // Check Updates
  const handleCheckUpdates = () => {
    setIsCheckingUpdates(true);
    setTimeout(() => {
      setIsCheckingUpdates(false);
      triggerToast('SoftView Client v2.4.1 is up to date!');
    }, 1400);
  };

  // All 23 Module definitions for Navigation
  const modulesList = [
    { id: 'profile', name: 'Profile & Identity', icon: User, category: 'Account' },
    { id: 'security', name: 'Account Security', icon: Lock, category: 'Account' },
    { id: 'ai-security', name: 'AI Security Protection', icon: ShieldCheck, category: 'Account', badge: 'AI Guard' },
    { id: 'privacy', name: 'Privacy Center', icon: EyeOff, category: 'Privacy' },
    { id: 'ai-privacy', name: 'AI Privacy Manager', icon: Bot, category: 'Privacy', badge: '92/100' },
    { id: 'playback', name: 'Playback Settings', icon: Play, category: 'Media' },
    { id: 'ai-experience', name: 'AI Experience', icon: Sparkles, category: 'Media', badge: 'Core' },
    { id: 'content', name: 'Content Preferences', icon: Heart, category: 'Media' },
    { id: 'parental', name: 'Parental Controls', icon: ShieldAlert, category: 'Safety' },
    { id: 'creator', name: 'Creator Mode', icon: Tv, category: 'Creator', badge: 'Pro' },
    { id: 'downloads', name: 'Download & Offline', icon: Download, category: 'Storage' },
    { id: 'storage', name: 'Data & Storage', icon: Database, category: 'Storage' },
    { id: 'notifications', name: 'Notifications', icon: Bell, category: 'Preferences' },
    { id: 'devices', name: 'Devices Management', icon: Laptop, category: 'Preferences' },
    { id: 'language', name: 'Language & Region', icon: Globe, category: 'Preferences' },
    { id: 'accessibility', name: 'Accessibility', icon: Sliders, category: 'Preferences' },
    { id: 'payments', name: 'Payments & Premium', icon: CreditCard, category: 'Billing' },
    { id: 'ai-data', name: 'AI Data Control', icon: Cpu, category: 'Privacy' },
    { id: 'export', name: 'Account Data Export', icon: FileText, category: 'Data' },
    { id: 'deletion', name: 'Account Deletion', icon: Trash2, category: 'Data' },
    { id: 'labs', name: 'SoftView Labs', icon: Zap, category: 'Experimental', badge: 'Beta' },
    { id: 'help', name: 'Help & Support', icon: HelpCircle, category: 'Support' },
    { id: 'about', name: 'About SoftView', icon: Info, category: 'Support' },
  ];

  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return modulesList;
    return modulesList.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  return (
    <div className="w-full h-full text-left bg-[#030208] text-white overflow-y-auto max-h-[calc(100vh-4.5rem)] scrollbar-thin scrollbar-thumb-indigo-950/50 pb-24 font-sans">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-8 z-50 bg-[#161233] border border-indigo-500/60 px-4 py-3 rounded-xl flex items-center gap-3 shadow-2xl text-xs max-w-sm"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 animate-spin" />
            <p className="text-gray-100 font-medium">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">⚙️ SoftView Settings</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Personal Digital Control Center
              </span>
            </div>
            <p className="text-xs md:text-sm text-gray-400 font-medium">
              Configure profile identity, AI security, privacy manager, video player, creator tools, and system preferences.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-80 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5" />
            <input 
              type="text"
              placeholder="Search all 23 settings modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0718] border border-[#211a45] hover:border-indigo-500/30 focus:border-indigo-500 text-white text-xs pl-10 pr-8 py-2.5 rounded-xl outline-none placeholder-gray-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-gray-500 hover:text-white text-xs font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* MAIN 2-COLUMN CONTROL CENTER LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDEBAR NAVIGATION (23 MODULES CATEGORIZED) */}
          <div className="lg:col-span-3 space-y-2 bg-[#090714] border border-[#1b1932] p-3.5 rounded-2xl h-fit max-h-[750px] overflow-y-auto scrollbar-thin">
            <div className="px-2 py-1 flex items-center justify-between text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
              <span>Control Modules</span>
              <span className="text-indigo-400 font-mono">23 Total</span>
            </div>

            <div className="space-y-1">
              {filteredModules.map((m) => {
                const IconComp = m.icon;
                const isActive = activeTab === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveTab(m.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left group ${
                      isActive 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20' 
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-indigo-400 group-hover:text-indigo-300'}`} />
                      <span className="truncate">{m.name}</span>
                    </div>

                    {m.badge && (
                      <span className={`text-[9.5px] px-2 py-0.5 rounded-md font-extrabold shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : 'bg-indigo-950 text-indigo-300 border border-indigo-500/20'
                      }`}>
                        {m.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT ACTIVE MODULE DETAIL PANEL */}
          <div className="lg:col-span-9 bg-[#090714] border border-[#1b1932] p-6 rounded-2xl space-y-6 shadow-2xl min-h-[600px]">
            
            {/* 1. PROFILE & IDENTITY */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <div>
                    <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-400" />
                      <span>Profile & Identity 👤</span>
                    </h2>
                    <p className="text-xs text-gray-400">Manage public identity, avatar, cover banner, bio, and social channels.</p>
                  </div>
                  <button 
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Profile</span>
                  </button>
                </div>

                {/* AI PROFILE ASSISTANT BANNER */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-purple-950/30 to-[#090714] border border-indigo-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-300">
                      <Bot className="w-4 h-4 text-indigo-400" />
                      <span>AI Profile Assistant 🤖</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 font-mono">Profile Strength: 82%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 rounded-full w-[82%]" />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-300">
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-400 font-semibold">✓ Add creator description</span>
                      <span className="text-emerald-400 font-semibold">✓ Add social links</span>
                    </div>
                    <button 
                      onClick={handleGenerateAiBio}
                      disabled={isGeneratingBio}
                      className="px-3 py-1 bg-indigo-600/30 border border-indigo-500/40 hover:bg-indigo-600/50 text-indigo-300 text-[10.5px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{isGeneratingBio ? 'Writing Bio...' : 'AI Bio Writer'}</span>
                    </button>
                  </div>
                </div>

                {/* Cover Image & Avatar */}
                <div className="space-y-4">
                  <div className="relative h-36 rounded-xl overflow-hidden border border-white/10 group">
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => triggerToast('Cover image update dialog opened')}
                        className="px-3 py-1.5 bg-black/70 hover:bg-black/90 text-white text-xs font-bold rounded-lg border border-white/20 flex items-center gap-2"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Change Cover</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-end gap-4 -mt-12 pl-4 relative">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-[#090714] shadow-2xl relative group">
                      <img src={editAvatar} alt="Avatar" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => triggerToast('Avatar preset selector opened')}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-0.5 pb-1">
                      <h3 className="text-base font-extrabold text-white">{editName}</h3>
                      <p className="text-xs text-indigo-400 font-mono">@{username}</p>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Display Name</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-[#05040d] border border-[#201a45] text-white px-3.5 py-2 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Username</label>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#05040d] border border-[#201a45] text-white px-3.5 py-2 rounded-xl text-xs outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Bio</label>
                    <textarea 
                      rows={3}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="w-full bg-[#05040d] border border-[#201a45] text-white px-3.5 py-2 rounded-xl text-xs outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Website</label>
                    <input 
                      type="text" 
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full bg-[#05040d] border border-[#201a45] text-white px-3.5 py-2 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Location</label>
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-[#05040d] border border-[#201a45] text-white px-3.5 py-2 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pronouns</label>
                    <input 
                      type="text" 
                      value={pronouns}
                      onChange={(e) => setPronouns(e.target.value)}
                      className="w-full bg-[#05040d] border border-[#201a45] text-white px-3.5 py-2 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">X (Twitter)</label>
                    <input 
                      type="text" 
                      value={twitterUrl}
                      onChange={(e) => setTwitterUrl(e.target.value)}
                      className="w-full bg-[#05040d] border border-[#201a45] text-white px-3.5 py-2 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. ACCOUNT SECURITY */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-indigo-400" />
                    <span>Account Security 🔐</span>
                  </h2>
                  <p className="text-xs text-gray-400">Password management, 2FA protection, Passkeys, and Active Sessions.</p>
                </div>

                {/* Password Management */}
                <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-4">
                  <h3 className="text-xs font-extrabold text-gray-300 uppercase tracking-wider">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input 
                      type="password" 
                      placeholder="Current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-[#090714] border border-[#201a45] text-white px-3 py-2 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                    <input 
                      type="password" 
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-[#090714] border border-[#201a45] text-white px-3 py-2 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                    <input 
                      type="password" 
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-[#090714] border border-[#201a45] text-white px-3 py-2 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-400">Password Strength: <strong className="text-emerald-400">Strong (14 characters)</strong></span>
                    <button 
                      onClick={() => {
                        if (!currentPassword || !newPassword) {
                          triggerToast('Please fill out password fields');
                        } else {
                          triggerToast('Password updated successfully!');
                          setCurrentPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                        }
                      }}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all cursor-pointer"
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                {/* 2FA Options */}
                <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-3">
                  <h3 className="text-xs font-extrabold text-gray-300 uppercase tracking-wider">Two-Factor Authentication (2FA)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 bg-[#090714] border border-white/5 rounded-lg">
                      <span className="text-xs font-bold text-gray-200">Authenticator App</span>
                      <input type="checkbox" checked={authApp2FA} onChange={(e) => setAuthApp2FA(e.target.checked)} className="accent-indigo-500 cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#090714] border border-white/5 rounded-lg">
                      <span className="text-xs font-bold text-gray-200">SMS Verification</span>
                      <input type="checkbox" checked={sms2FA} onChange={(e) => setSms2FA(e.target.checked)} className="accent-indigo-500 cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#090714] border border-white/5 rounded-lg">
                      <span className="text-xs font-bold text-gray-200">Email Code</span>
                      <input type="checkbox" checked={email2FA} onChange={(e) => setEmail2FA(e.target.checked)} className="accent-indigo-500 cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#090714] border border-white/5 rounded-lg">
                      <span className="text-xs font-bold text-gray-200">Passkey / Biometric</span>
                      <input type="checkbox" checked={passkeyFaceId} onChange={(e) => setPasskeyFaceId(e.target.checked)} className="accent-indigo-500 cursor-pointer" />
                    </div>
                  </div>
                </div>

                {/* Passkeys */}
                <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-300">
                    <Fingerprint className="w-4 h-4 text-indigo-400" />
                    <span>Passkeys 🔑 (Face ID, Fingerprint, Windows Hello)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-gray-300">Face ID & Touch ID</span>
                    <button 
                      onClick={() => triggerToast('Passkey created with Face ID')}
                      className="text-xs text-indigo-400 font-bold hover:underline cursor-pointer"
                    >
                      Configure Passkey
                    </button>
                  </div>
                </div>

                {/* Login Activity */}
                <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-extrabold text-gray-300 uppercase tracking-wider">Active Sessions</h3>
                    <button 
                      onClick={() => {
                        setActiveSessions(activeSessions.filter(s => s.current));
                        triggerToast('Logged out of all other active sessions!');
                      }}
                      className="text-xs text-red-400 font-bold hover:underline cursor-pointer"
                    >
                      Logout All Other Devices
                    </button>
                  </div>

                  <div className="space-y-2">
                    {activeSessions.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-3 bg-[#090714] border border-white/5 rounded-lg text-xs">
                        <div>
                          <div className="flex items-center gap-2 font-bold text-white">
                            <span>{s.device}</span>
                            {s.current && <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">Current Device</span>}
                          </div>
                          <div className="text-[11px] text-gray-400">{s.location} • {s.lastActive}</div>
                        </div>
                        {!s.current && (
                          <button 
                            onClick={() => {
                              setActiveSessions(activeSessions.filter(item => item.id !== s.id));
                              triggerToast(`Session terminated for ${s.device}`);
                            }}
                            className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-bold rounded cursor-pointer"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. AI SECURITY PROTECTION */}
            {activeTab === 'ai-security' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                    <span>AI Security Protection 🛡️</span>
                  </h2>
                  <p className="text-xs text-gray-400">SoftView AI monitors account activity to intercept suspicious logins and hijacking.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-200">Smart Security AI</span>
                      <input type="checkbox" checked={aiSecurityActive} onChange={(e) => setAiSecurityActive(e.target.checked)} className="accent-indigo-500 cursor-pointer" />
                    </div>
                    <p className="text-[11px] text-gray-400">Detects unusual geographic leaps and device finger-prints.</p>
                  </div>

                  <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-200">Bot Activity Blocker</span>
                      <input type="checkbox" checked={aiBotDetection} onChange={(e) => setAiBotDetection(e.target.checked)} className="accent-indigo-500 cursor-pointer" />
                    </div>
                    <p className="text-[11px] text-gray-400">Prevents automated credential stuffing and bot spam.</p>
                  </div>

                  <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-200">Hijack Protection</span>
                      <input type="checkbox" checked={aiHijackProtection} onChange={(e) => setAiHijackProtection(e.target.checked)} className="accent-indigo-500 cursor-pointer" />
                    </div>
                    <p className="text-[11px] text-gray-400">Locks sensitive account settings if unauthorized API calls occur.</p>
                  </div>
                </div>

                {/* Simulated Security Alert Card */}
                <div className="p-5 bg-gradient-to-r from-red-950/30 via-amber-950/20 to-[#05040d] border border-red-500/30 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Security Alert Simulation</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    New login attempt detected: <strong>Location: Frankfurt, Germany (IP: 185.220.101.5)</strong>. Was this you?
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => triggerToast('Session confirmed by user.')}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      YES, IT WAS ME
                    </button>
                    <button 
                      onClick={() => triggerToast('Session blocked & password reset link sent!')}
                      className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      NO, BLOCK & PROTECT
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. PRIVACY CENTER */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <EyeOff className="w-5 h-5 text-indigo-400" />
                    <span>Privacy Center 🕵️</span>
                  </h2>
                  <p className="text-xs text-gray-400">Control profile visibility, activity history, and data exposure levels.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#05040d] border border-white/5 rounded-xl">
                    <div>
                      <h3 className="text-xs font-bold text-white">Profile Privacy Level</h3>
                      <p className="text-[11px] text-gray-400">Who can see your channel profile page and achievements.</p>
                    </div>
                    <select 
                      value={profileVisibility}
                      onChange={(e) => setProfileVisibility(e.target.value)}
                      className="bg-[#090714] border border-[#201a45] text-indigo-300 text-xs font-bold px-3 py-1.5 rounded-lg outline-none"
                    >
                      <option value="Public">Public</option>
                      <option value="Friends">Friends</option>
                      <option value="Followers">Followers</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>

                  <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-3">
                    <h3 className="text-xs font-extrabold text-gray-300 uppercase tracking-wider">Activity Privacy Controls</h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <label className="flex items-center justify-between p-2.5 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                        <span>Record Watch History</span>
                        <input type="checkbox" checked={watchHistoryPrivacy} onChange={(e) => setWatchHistoryPrivacy(e.target.checked)} className="accent-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between p-2.5 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                        <span>Record Search History</span>
                        <input type="checkbox" checked={searchHistoryPrivacy} onChange={(e) => setSearchHistoryPrivacy(e.target.checked)} className="accent-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between p-2.5 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                        <span>Show Liked Videos</span>
                        <input type="checkbox" checked={likesPrivacy} onChange={(e) => setLikesPrivacy(e.target.checked)} className="accent-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between p-2.5 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                        <span>Public Saved Playlists</span>
                        <input type="checkbox" checked={playlistsPrivacy} onChange={(e) => setPlaylistsPrivacy(e.target.checked)} className="accent-indigo-500" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. AI PRIVACY MANAGER */}
            {activeTab === 'ai-privacy' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-indigo-400" />
                    <span>AI Privacy Manager 🤖</span>
                  </h2>
                  <p className="text-xs text-gray-400">SoftView AI audits your privacy exposure and recommends optimizations.</p>
                </div>

                <div className="p-5 bg-gradient-to-r from-emerald-950/40 via-[#05040d] to-[#090714] border border-emerald-500/30 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-300">Your AI Privacy Score</span>
                    <h3 className="text-3xl font-extrabold text-emerald-400 font-mono">{privacyScore} / 100</h3>
                    <p className="text-xs text-emerald-300/80 font-medium">Good protection! Minor recommendations available.</p>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-400 font-extrabold font-mono text-sm">
                    92%
                  </div>
                </div>

                <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-3">
                  <h3 className="text-xs font-extrabold text-gray-300 uppercase tracking-wider">AI Recommendations</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Enable passkey authentication for biometrics</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Hide watch history from public search results</span>
                    </div>
                    <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span>Suggested: Review connected third-party app permissions annually</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. PLAYBACK SETTINGS */}
            {activeTab === 'playback' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Play className="w-5 h-5 text-indigo-400" />
                    <span>Playback Settings ▶️</span>
                  </h2>
                  <p className="text-xs text-gray-400">Stream resolution quality, player speed, auto captions, and Smart Player AI.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-2">
                    <label className="text-xs font-bold text-gray-200 block">Default Resolution</label>
                    <select 
                      value={playbackQuality} 
                      onChange={(e) => setPlaybackQuality(e.target.value)}
                      className="w-full bg-[#090714] border border-[#201a45] text-white text-xs px-3 py-2 rounded-xl outline-none"
                    >
                      {['Auto', '144p', '360p', '720p', '1080p', '2K', '4K', '8K'].map(q => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>

                  <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-2">
                    <label className="text-xs font-bold text-gray-200 block">Default Speed</label>
                    <select 
                      value={playbackSpeed} 
                      onChange={(e) => setPlaybackSpeed(e.target.value)}
                      className="w-full bg-[#090714] border border-[#201a45] text-white text-xs px-3 py-2 rounded-xl outline-none"
                    >
                      {['0.5x', '0.75x', '1.0x', '1.25x', '1.5x', '2.0x'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-3 text-xs">
                  <h3 className="text-xs font-extrabold text-gray-300 uppercase tracking-wider">Player Features</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center justify-between p-2.5 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                      <span>Autoplay Next Video</span>
                      <input type="checkbox" checked={autoplay} onChange={(e) => setAutoplay(e.target.checked)} className="accent-indigo-500" />
                    </label>
                    <label className="flex items-center justify-between p-2.5 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                      <span>Skip Intro</span>
                      <input type="checkbox" checked={skipIntro} onChange={(e) => setSkipIntro(e.target.checked)} className="accent-indigo-500" />
                    </label>
                    <label className="flex items-center justify-between p-2.5 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                      <span>Skip Sponsor Sections</span>
                      <input type="checkbox" checked={skipSponsor} onChange={(e) => setSkipSponsor(e.target.checked)} className="accent-indigo-500" />
                    </label>
                    <label className="flex items-center justify-between p-2.5 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                      <span>Auto Captions</span>
                      <input type="checkbox" checked={autoCaptions} onChange={(e) => setAutoCaptions(e.target.checked)} className="accent-indigo-500" />
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-indigo-950/40 via-[#05040d] to-[#090714] border border-indigo-500/30 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-extrabold text-indigo-300">
                    <span>Smart Player AI (Auto Chapters & Highlights)</span>
                    <input type="checkbox" checked={smartChaptersAI} onChange={(e) => setSmartChaptersAI(e.target.checked)} className="accent-indigo-500 cursor-pointer" />
                  </div>
                  <p className="text-[11px] text-gray-400">AI analyzes video timestamps and automatically generates chapters and key highlight markers.</p>
                </div>
              </div>
            )}

            {/* 7. AI EXPERIENCE SETTINGS */}
            {activeTab === 'ai-experience' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <span>AI Experience Settings 🧠</span>
                  </h2>
                  <p className="text-xs text-gray-400">Manage feed recommendation engines, learning mode ratios, and AI memory.</p>
                </div>

                <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-3">
                  <h3 className="text-xs font-extrabold text-gray-300 uppercase tracking-wider">AI Recommendations</h3>
                  <div className="space-y-2 text-xs">
                    <label className="flex items-center justify-between p-2.5 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                      <span>Personalized Feed</span>
                      <input type="checkbox" checked={personalizedFeed} onChange={(e) => setPersonalizedFeed(e.target.checked)} className="accent-indigo-500" />
                    </label>
                    <label className="flex items-center justify-between p-2.5 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                      <span>AI Picks</span>
                      <input type="checkbox" checked={aiPicks} onChange={(e) => setAiPicks(e.target.checked)} className="accent-indigo-500" />
                    </label>
                  </div>
                </div>

                {/* AI Learning Mode Ratio */}
                <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-gray-200">AI Learning Mode Ratio</span>
                    <span className="font-mono text-indigo-400 font-bold">{aiLearningMode}% Educational / {100 - aiLearningMode}% Entertainment</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={aiLearningMode} 
                    onChange={(e) => setAiLearningMode(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-gray-400">Higher ratio prioritizes coding courses, science tutorials, and educational content in your feed.</p>
                </div>

                <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-white">SoftView AI Assistant</h3>
                    <p className="text-[11px] text-gray-400">Clear chat memory and search context history stored for your profile.</p>
                  </div>
                  <button 
                    onClick={() => triggerToast('SoftView AI assistant memory cleared!')}
                    className="px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Clear AI Memory
                  </button>
                </div>
              </div>
            )}

            {/* 8. CONTENT PREFERENCES */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Heart className="w-5 h-5 text-indigo-400" />
                    <span>Content Preferences 🎯</span>
                  </h2>
                  <p className="text-xs text-gray-400">Tailor topics and categories to customize your interest spectrum.</p>
                </div>

                <div className="space-y-3">
                  {interests.map((item, idx) => (
                    <div key={idx} className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-white">{item.name}</span>
                        <span className="text-indigo-400 font-mono">{item.affinity}% Affinity</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                          style={{ width: `${item.affinity}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. PARENTAL CONTROLS */}
            {activeTab === 'parental' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-indigo-400" />
                    <span>Parental Controls 👨‍👩‍👧</span>
                  </h2>
                  <p className="text-xs text-gray-400">Family safety options, daily screen time bounds, bedtime lock, and AI Content Scanner.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-2">
                    <label className="text-xs font-bold text-gray-200 block">Daily Screen Time Limit</label>
                    <select 
                      value={dailyScreenTimeLimit}
                      onChange={(e) => setDailyScreenTimeLimit(e.target.value)}
                      className="w-full bg-[#090714] border border-[#201a45] text-white text-xs px-3 py-2 rounded-xl outline-none"
                    >
                      {['30 minutes', '1 hour', '2 hours', '3 hours', 'Unlimited'].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-2">
                    <label className="text-xs font-bold text-gray-200 block">Bedtime Lock</label>
                    <select 
                      value={bedtimeLock}
                      onChange={(e) => setBedtimeLock(e.target.value)}
                      className="w-full bg-[#090714] border border-[#201a45] text-white text-xs px-3 py-2 rounded-xl outline-none"
                    >
                      {['21:00', '22:00', '23:00', 'Off'].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-gray-200">AI Content Scanner Filter</span>
                    <input type="checkbox" checked={aiContentScanner} onChange={(e) => setAiContentScanner(e.target.checked)} className="accent-indigo-500 cursor-pointer" />
                  </div>
                  <p className="text-[11px] text-gray-400">Scans video audio and frames for violence, jump scares, or 18+ content in real-time.</p>
                </div>
              </div>
            )}

            {/* 10. CREATOR MODE */}
            {activeTab === 'creator' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Tv className="w-5 h-5 text-indigo-400" />
                    <span>Creator Mode 🎥</span>
                  </h2>
                  <p className="text-xs text-gray-400">Channel dashboard, monetization settings, copyright matches, and brand permissions.</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#05040d] border border-white/5 rounded-xl p-4 text-left">
                    <span className="block text-[10px] text-gray-400 font-extrabold uppercase">Subscribers</span>
                    <span className="block text-xl font-extrabold text-indigo-400 mt-1 font-mono">14,240</span>
                  </div>
                  <div className="bg-[#05040d] border border-white/5 rounded-xl p-4 text-left">
                    <span className="block text-[10px] text-gray-400 font-extrabold uppercase">Avg View Duration</span>
                    <span className="block text-xl font-extrabold text-purple-400 mt-1 font-mono">18m 12s</span>
                  </div>
                  <div className="bg-[#05040d] border border-white/5 rounded-xl p-4 text-left">
                    <span className="block text-[10px] text-gray-400 font-extrabold uppercase">Est. Revenue</span>
                    <span className="block text-xl font-extrabold text-amber-400 mt-1 font-mono">$1,842.50</span>
                  </div>
                </div>

                <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span>Monetization Status</span>
                    <input type="checkbox" checked={creatorMonetization} onChange={(e) => setCreatorMonetization(e.target.checked)} className="accent-indigo-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Automated Copyright Match Scanner</span>
                    <input type="checkbox" checked={creatorCopyright} onChange={(e) => setCreatorCopyright(e.target.checked)} className="accent-indigo-500" />
                  </div>
                </div>
              </div>
            )}

            {/* 11. DOWNLOAD & OFFLINE */}
            {activeTab === 'downloads' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Download className="w-5 h-5 text-indigo-400" />
                    <span>Download & Offline 📥</span>
                  </h2>
                  <p className="text-xs text-gray-400">Offline playback resolution, storage paths, and Smart Offline AI pre-caching.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-2">
                    <label className="text-xs font-bold text-gray-200 block">Download Quality</label>
                    <select 
                      value={downloadQuality} 
                      onChange={(e) => setDownloadQuality(e.target.value)}
                      className="w-full bg-[#090714] border border-[#201a45] text-white text-xs px-3 py-2 rounded-xl outline-none"
                    >
                      {['1080p Full HD', '720p HD', '480p SD'].map(q => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>

                  <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-2">
                    <label className="text-xs font-bold text-gray-200 block">Storage Target</label>
                    <select 
                      value={storageLocation} 
                      onChange={(e) => setStorageLocation(e.target.value)}
                      className="w-full bg-[#090714] border border-[#201a45] text-white text-xs px-3 py-2 rounded-xl outline-none"
                    >
                      {['Internal Storage (34.2 GB Free)', 'SD Card'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-indigo-950/40 via-[#05040d] to-[#090714] border border-indigo-500/30 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-extrabold text-indigo-300">
                    <span>Smart Offline AI Pre-Caching</span>
                    <input type="checkbox" checked={smartOfflineAI} onChange={(e) => setSmartOfflineAI(e.target.checked)} className="accent-indigo-500 cursor-pointer" />
                  </div>
                  <p className="text-[11px] text-gray-400">
                    You usually watch <strong>Programming & React Courses</strong>. AI automatically downloaded: <em>React Course Part 4</em>.
                  </p>
                </div>
              </div>
            )}

            {/* 12. DATA & STORAGE & SUPABASE DATABASE */}
            {activeTab === 'storage' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-indigo-400" />
                    <span>User's Data & Cloud Storage ⚡</span>
                  </h2>
                  <p className="text-xs text-gray-400">Manage registered user accounts, server database synchronization, Supabase cloud schema, and local storage allocation.</p>
                </div>

                {/* ACTIVE USER DATA & DATABASE SYNC CARD */}
                <div className="p-5 bg-gradient-to-r from-indigo-950/60 via-[#0a081f] to-[#04030d] border border-indigo-500/40 rounded-2xl space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatarUrl} 
                        alt={user.name} 
                        className="w-12 h-12 rounded-full border-2 border-indigo-400 object-cover shadow-lg shrink-0" 
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-extrabold text-white">{user.name}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Level {user.level} • {user.xp} XP
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">Account status: Active & Synced to Databases</p>
                      </div>
                    </div>

                    <button
                      onClick={async () => {
                        await syncUserToBothDatabases({
                          email: editEmail || 'aslbek.dev@gmail.com',
                          name: user.name,
                          avatarUrl: user.avatarUrl,
                          provider: 'auth'
                        });
                        await fetchUsersFromDatabase();
                        triggerToast('User data successfully synchronized to both Server DB and Supabase!');
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Sync My Data to Databases</span>
                    </button>
                  </div>

                  {/* REGISTERED USERS DATABASE DIRECTORY */}
                  <div className="pt-3 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-300 flex items-center gap-2">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <span>Registered User Accounts in Database ({dbUsersList.length})</span>
                      </span>
                      <button 
                        onClick={fetchUsersFromDatabase}
                        disabled={isLoadingUsers}
                        className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                        <span>Refresh List</span>
                      </button>
                    </div>

                    {dbUsersList.length === 0 ? (
                      <div className="p-4 bg-black/40 border border-white/5 rounded-xl text-center text-xs text-gray-400">
                        No secondary registered users found yet. Sign up or log in via Google, GitHub, Discord, or Email to register new users into the DB.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto scrollbar-thin pr-1">
                        {dbUsersList.map((u, idx) => (
                          <div key={u.id || idx} className="p-3 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <img src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop'} alt={u.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                              <div className="truncate">
                                <span className="font-bold text-gray-200 block truncate">{u.name || u.email}</span>
                                <span className="text-[10px] text-gray-400 block truncate">{u.email}</span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                              {u.provider || 'email'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* SUPABASE CLOUD DATABASE CONNECTION CARD */}
                <div className="p-5 bg-gradient-to-r from-[#0c0926] via-[#08061a] to-[#04030d] border border-emerald-500/30 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                          <span>Supabase Realtime Cloud Database</span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wide">Ready</span>
                        </h3>
                        <p className="text-xs text-gray-400">Direct integration for live user accounts, user profiles, videos, and playlists.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-1">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">VITE_SUPABASE_URL</span>
                      <code className="text-[11px] text-emerald-300 font-mono block truncate">
                        {(import.meta as any).env?.VITE_SUPABASE_URL ? (import.meta as any).env.VITE_SUPABASE_URL : 'https://your-project.supabase.co (Add in Vercel/Env)'}
                      </code>
                    </div>

                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-1">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">VITE_SUPABASE_ANON_KEY</span>
                      <code className="text-[11px] text-emerald-300 font-mono block truncate">
                        {(import.meta as any).env?.VITE_SUPABASE_ANON_KEY ? '••••••••••••••••••••••••' : 'Configured via .env or Vercel Environment Variables'}
                      </code>
                    </div>
                  </div>

                  {/* SQL Schema Copy Codebox */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-300">Supabase SQL Schema (User Data & App Tables):</span>
                      <button 
                        onClick={() => {
                          const sql = `-- Supabase Complete Table Setup for User Data & App
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE REFERENCES users(id),
  name TEXT,
  level INTEGER DEFAULT 12,
  xp INTEGER DEFAULT 620,
  xp_next_level INTEGER DEFAULT 1000,
  avatar_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  cover_url TEXT,
  duration TEXT,
  views TEXT,
  upload_date TEXT,
  creator TEXT,
  creator_verified BOOLEAN DEFAULT true,
  category TEXT DEFAULT 'technology',
  language TEXT DEFAULT 'Uzbek',
  is_live BOOLEAN DEFAULT false,
  match_percentage INTEGER DEFAULT 95,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning_paths (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  lessons_count INTEGER,
  duration TEXT,
  progress INTEGER DEFAULT 0,
  category TEXT,
  level TEXT
);`;
                          navigator.clipboard.writeText(sql);
                          triggerToast('Full User Data SQL Schema copied to clipboard!');
                        }}
                        className="px-3 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-bold rounded-lg transition-all border border-emerald-500/30 flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copy Complete SQL Schema</span>
                      </button>
                    </div>

                    <pre className="p-3 bg-[#030208] border border-white/10 rounded-xl text-[10px] text-gray-300 font-mono overflow-x-auto max-h-36 scrollbar-thin">
                      {`CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE REFERENCES users(id),
  name TEXT,
  level INTEGER DEFAULT 12,
  xp INTEGER DEFAULT 620,
  avatar_url TEXT
);`}
                    </pre>
                  </div>
                </div>

                <div className="p-5 bg-[#05040d] border border-white/5 rounded-xl space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-gray-200">Local Storage Allocation</span>
                    <span className="font-mono text-indigo-400 font-bold">22.5 GB Total Used</span>
                  </div>

                  {/* Multi-segmented Storage Bar */}
                  <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden flex">
                    <div className="h-full bg-indigo-500" style={{ width: '55%' }} title="Downloads: 12.4 GB" />
                    <div className="h-full bg-purple-500" style={{ width: '35%' }} title="Offline Videos: 8.0 GB" />
                    <div className="h-full bg-amber-500" style={{ width: `${(cacheSize / 250) * 10}%` }} title="AI Cache" />
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-300">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-indigo-500" /> Downloads: 12.4 GB</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-purple-500" /> Offline: 8.0 GB</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> AI Cache: {cacheSize.toFixed(1)} MB</span>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button 
                      onClick={handleClearCache}
                      disabled={isClearingCache}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isClearingCache ? 'Clearing Cache...' : 'Clear Storage Cache'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 13. NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-indigo-400" />
                    <span>Notifications 🔔</span>
                  </h2>
                  <p className="text-xs text-gray-400">Customize alerts for uploads, creator milestones, security, and weekly AI digests.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-3">
                    <h3 className="font-extrabold text-gray-300 uppercase tracking-wider">Video & Creator Alerts</h3>
                    <label className="flex items-center justify-between p-2 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                      <span>New Uploads</span>
                      <input type="checkbox" checked={notifyNewUploads} onChange={(e) => setNotifyNewUploads(e.target.checked)} className="accent-indigo-500" />
                    </label>
                    <label className="flex items-center justify-between p-2 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                      <span>Live Streams</span>
                      <input type="checkbox" checked={notifyLiveStreams} onChange={(e) => setNotifyLiveStreams(e.target.checked)} className="accent-indigo-500" />
                    </label>
                    <label className="flex items-center justify-between p-2 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                      <span>Revenue & Payouts</span>
                      <input type="checkbox" checked={notifyRevenue} onChange={(e) => setNotifyRevenue(e.target.checked)} className="accent-indigo-500" />
                    </label>
                  </div>

                  <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-3">
                    <h3 className="font-extrabold text-gray-300 uppercase tracking-wider">Security & AI Reports</h3>
                    <label className="flex items-center justify-between p-2 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                      <span>Security Login Alerts</span>
                      <input type="checkbox" checked={notifySecurity} onChange={(e) => setNotifySecurity(e.target.checked)} className="accent-indigo-500" />
                    </label>
                    <label className="flex items-center justify-between p-2 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                      <span>Weekly AI Report</span>
                      <input type="checkbox" checked={notifyAiWeeklyReport} onChange={(e) => setNotifyAiWeeklyReport(e.target.checked)} className="accent-indigo-500" />
                    </label>
                    <label className="flex items-center justify-between p-2 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                      <span>Learning Reminders</span>
                      <input type="checkbox" checked={notifyLearningReminders} onChange={(e) => setNotifyLearningReminders(e.target.checked)} className="accent-indigo-500" />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 14. DEVICES MANAGEMENT */}
            {activeTab === 'devices' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Laptop className="w-5 h-5 text-indigo-400" />
                    <span>Devices Management 📱</span>
                  </h2>
                  <p className="text-xs text-gray-400">Signed-in companion devices, session statuses, and remote logout controls.</p>
                </div>

                <div className="space-y-3">
                  {connectedDevices.map((d) => (
                    <div key={d.id} className="p-4 bg-[#05040d] border border-white/5 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">{d.name} ({d.type})</span>
                        <span className="text-[11px] text-gray-400">{d.active} • {d.status}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setConnectedDevices(connectedDevices.filter(item => item.id !== d.id));
                          triggerToast(`Device ${d.name} disconnected`);
                        }}
                        className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-lg cursor-pointer"
                      >
                        Remove Device
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 15. LANGUAGE & REGION */}
            {activeTab === 'language' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-400" />
                    <span>Language & Region 🌍</span>
                  </h2>
                  <p className="text-xs text-gray-400">App localization, subtitle translation languages, and AI real-time translation.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-2">
                    <label className="text-xs font-bold text-gray-200 block">App Language</label>
                    <select value={appLanguage} onChange={(e) => setAppLanguage(e.target.value)} className="w-full bg-[#090714] border border-[#201a45] text-white text-xs px-3 py-2 rounded-xl outline-none">
                      {['English', 'Uzbek', 'Spanish', 'Japanese', 'German'].map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>

                  <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-2">
                    <label className="text-xs font-bold text-gray-200 block">Translation Target Language</label>
                    <select value={translationLanguage} onChange={(e) => setTranslationLanguage(e.target.value)} className="w-full bg-[#090714] border border-[#201a45] text-white text-xs px-3 py-2 rounded-xl outline-none">
                      {['Uzbek', 'English', 'Spanish', 'Japanese', 'German'].map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-3 text-xs">
                  <h3 className="font-extrabold text-gray-300 uppercase tracking-wider">AI Automatic Translation</h3>
                  <label className="flex items-center justify-between p-2.5 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                    <span>Automatic Subtitle Translation</span>
                    <input type="checkbox" checked={aiSubtitles} onChange={(e) => setAiSubtitles(e.target.checked)} className="accent-indigo-500" />
                  </label>
                  <label className="flex items-center justify-between p-2.5 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                    <span>Translate Foreign Comments</span>
                    <input type="checkbox" checked={aiTranslatedComments} onChange={(e) => setAiTranslatedComments(e.target.checked)} className="accent-indigo-500" />
                  </label>
                </div>
              </div>
            )}

            {/* 16. ACCESSIBILITY */}
            {activeTab === 'accessibility' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-indigo-400" />
                    <span>Accessibility ♿</span>
                  </h2>
                  <p className="text-xs text-gray-400">High contrast visual themes, font scaling, screen reader support, and color blindness modes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-3">
                    <label className="flex items-center justify-between p-2 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                      <span>Screen Reader Optimization</span>
                      <input type="checkbox" checked={screenReader} onChange={(e) => setScreenReader(e.target.checked)} className="accent-indigo-500" />
                    </label>
                    <label className="flex items-center justify-between p-2 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                      <span>High Contrast Mode</span>
                      <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} className="accent-indigo-500" />
                    </label>
                    <label className="flex items-center justify-between p-2 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                      <span>Reduced Motion</span>
                      <input type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} className="accent-indigo-500" />
                    </label>
                  </div>

                  <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-3">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-200 block">Font Size Scale</label>
                      <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="w-full bg-[#090714] border border-[#201a45] text-white px-3 py-1.5 rounded-lg outline-none">
                        {['Small', 'Medium', 'Large', 'Extra Large'].map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-200 block">Color Blindness Filter</label>
                      <select value={colorBlindnessMode} onChange={(e) => setColorBlindnessMode(e.target.value)} className="w-full bg-[#090714] border border-[#201a45] text-white px-3 py-1.5 rounded-lg outline-none">
                        {['None', 'Protanopia', 'Deuteranopia', 'Tritanopia'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 17. PAYMENTS & PREMIUM */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-400" />
                    <span>Payments & Premium 💳</span>
                  </h2>
                  <p className="text-xs text-gray-400">Subscription plans, active payment methods, billing history, and creator payouts.</p>
                </div>

                <div className="p-5 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-[#05040d] border border-purple-500/30 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">Current Plan</span>
                    <h3 className="text-lg font-extrabold text-white flex items-center gap-2 mt-0.5">
                      <span>SoftView Premium Plan</span>
                      <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">4K streaming, offline downloads, ad-free experience, AI tools unlocked.</p>
                  </div>
                  <button 
                    onClick={() => triggerToast('Subscription manager opened')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Manage Plan
                  </button>
                </div>
              </div>
            )}

            {/* 18. AI DATA CONTROL */}
            {activeTab === 'ai-data' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-indigo-400" />
                    <span>AI Data Control 🧬</span>
                  </h2>
                  <p className="text-xs text-gray-400">Explicitly consent to or restrict how SoftView AI learns from your activity history.</p>
                </div>

                <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-3 text-xs">
                  <h3 className="font-extrabold text-gray-300 uppercase tracking-wider">Allow SoftView AI to Learn From:</h3>
                  <label className="flex items-center gap-3 p-2.5 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                    <input type="checkbox" checked={consentWatchHistory} onChange={(e) => setConsentWatchHistory(e.target.checked)} className="accent-indigo-500" />
                    <span>Watch History & Duration Metrics</span>
                  </label>
                  <label className="flex items-center gap-3 p-2.5 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                    <input type="checkbox" checked={consentLikes} onChange={(e) => setConsentLikes(e.target.checked)} className="accent-indigo-500" />
                    <span>Liked Videos & Upvotes</span>
                  </label>
                  <label className="flex items-center gap-3 p-2.5 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                    <input type="checkbox" checked={consentSearches} onChange={(e) => setConsentSearches(e.target.checked)} className="accent-indigo-500" />
                    <span>Search History & AI Chat Inquiries</span>
                  </label>
                  <label className="flex items-center gap-3 p-2.5 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                    <input type="checkbox" checked={consentPlaylists} onChange={(e) => setConsentPlaylists(e.target.checked)} className="accent-indigo-500" />
                    <span>Saved Course Playlists & Milestones</span>
                  </label>
                </div>
              </div>
            )}

            {/* 19. ACCOUNT DATA EXPORT */}
            {activeTab === 'export' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <span>Account Data Export 📦 (GDPR Compliant)</span>
                  </h2>
                  <p className="text-xs text-gray-400">Request a complete JSON/ZIP download archive of your videos, playlists, history, and profile.</p>
                </div>

                <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-3 text-xs">
                  <h3 className="font-extrabold text-gray-300 uppercase tracking-wider">Select Data Items to Include</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 p-2 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                      <input type="checkbox" checked={exportItems.videos} onChange={(e) => setExportItems({...exportItems, videos: e.target.checked})} className="accent-indigo-500" />
                      <span>Uploaded Videos</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                      <input type="checkbox" checked={exportItems.history} onChange={(e) => setExportItems({...exportItems, history: e.target.checked})} className="accent-indigo-500" />
                      <span>Watch & Search History</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                      <input type="checkbox" checked={exportItems.comments} onChange={(e) => setExportItems({...exportItems, comments: e.target.checked})} className="accent-indigo-500" />
                      <span>Comments & Chat History</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 bg-[#090714] border border-white/5 rounded-lg cursor-pointer">
                      <input type="checkbox" checked={exportItems.playlists} onChange={(e) => setExportItems({...exportItems, playlists: e.target.checked})} className="accent-indigo-500" />
                      <span>Playlists & Roadmaps</span>
                    </label>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={handleStartExport}
                      disabled={isExporting}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isExporting ? 'Generating Archive (.zip)...' : 'Download My Data Archive'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 20. ACCOUNT DELETION */}
            {activeTab === 'deletion' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-red-400 flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-red-400" />
                    <span>Account Deletion & Deactivation ⚠️</span>
                  </h2>
                  <p className="text-xs text-gray-400">Temporarily pause your channel presence or delete your account permanently.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-[#05040d] border border-white/10 rounded-xl space-y-3 text-xs">
                    <h3 className="font-extrabold text-amber-400">Temporary Deactivation</h3>
                    <p className="text-gray-400 leading-relaxed">Hides your channel profile, uploaded videos, and comments. You can reactivate anytime by logging back in.</p>
                    <button 
                      onClick={() => triggerToast('Deactivation process initiated.')}
                      className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold rounded-lg cursor-pointer"
                    >
                      Deactivate Account
                    </button>
                  </div>

                  <div className="p-5 bg-red-950/20 border border-red-500/30 rounded-xl space-y-3 text-xs">
                    <h3 className="font-extrabold text-red-400">Permanent Account Deletion</h3>
                    <p className="text-gray-400 leading-relaxed">Permanently purges all channel history, achievements, uploaded videos, and subscription data. This action is irreversible.</p>
                    <button 
                      onClick={() => triggerToast('Permanent deletion requires password confirmation modal.')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg cursor-pointer"
                    >
                      Delete Account Permanently
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 21. SOFTVIEW LABS */}
            {activeTab === 'labs' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-indigo-400" />
                    <span>SoftView Labs 🧪 (Experimental AI Features)</span>
                  </h2>
                  <p className="text-xs text-gray-400">Test cutting-edge artificial intelligence features before global rollout.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <label className="flex items-center justify-between p-3.5 bg-[#05040d] border border-white/5 rounded-xl cursor-pointer">
                    <div>
                      <span className="font-bold text-white block">AI Video Summary</span>
                      <span className="text-[11px] text-gray-400">Generates instant 3-bullet summaries for long coding streams.</span>
                    </div>
                    <input type="checkbox" checked={labsSummary} onChange={(e) => setLabsSummary(e.target.checked)} className="accent-indigo-500" />
                  </label>

                  <label className="flex items-center justify-between p-3.5 bg-[#05040d] border border-white/5 rounded-xl cursor-pointer">
                    <div>
                      <span className="font-bold text-white block">AI Auto-Chapters</span>
                      <span className="text-[11px] text-gray-400">Automatically creates interactive jump markers based on topic shifts.</span>
                    </div>
                    <input type="checkbox" checked={labsChapters} onChange={(e) => setLabsChapters(e.target.checked)} className="accent-indigo-500" />
                  </label>

                  <label className="flex items-center justify-between p-3.5 bg-[#05040d] border border-white/5 rounded-xl cursor-pointer">
                    <div>
                      <span className="font-bold text-white block">Smart Search Grounding</span>
                      <span className="text-[11px] text-gray-400">Answers natural language queries using video transcription contexts.</span>
                    </div>
                    <input type="checkbox" checked={labsSmartSearch} onChange={(e) => setLabsSmartSearch(e.target.checked)} className="accent-indigo-500" />
                  </label>

                  <label className="flex items-center justify-between p-3.5 bg-[#05040d] border border-white/5 rounded-xl cursor-pointer">
                    <div>
                      <span className="font-bold text-white block">Voice Navigation Controls</span>
                      <span className="text-[11px] text-gray-400">Control video playback using spoken speech commands.</span>
                    </div>
                    <input type="checkbox" checked={labsVoiceNav} onChange={(e) => setLabsVoiceNav(e.target.checked)} className="accent-indigo-500" />
                  </label>
                </div>
              </div>
            )}

            {/* 22. HELP & SUPPORT */}
            {activeTab === 'help' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-indigo-400" />
                    <span>Help & Support 💬</span>
                  </h2>
                  <p className="text-xs text-gray-400">Access documentation guides, submit bug reports, or contact support.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-2">
                    <h3 className="font-extrabold text-white">Help Center & Guides</h3>
                    <p className="text-gray-400">Learn how to customize your watch journey, build learning playlists, and manage stream keys.</p>
                    <button 
                      onClick={() => triggerToast('Opening Help Center documentation...')}
                      className="px-3.5 py-1.5 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 font-bold rounded-lg cursor-pointer"
                    >
                      Visit Help Center
                    </button>
                  </div>

                  <div className="p-4 bg-[#05040d] border border-white/5 rounded-xl space-y-2">
                    <h3 className="font-extrabold text-white">Submit a Bug Report</h3>
                    <p className="text-gray-400">Found an issue in playback or local storage sync? Send diagnostic logs directly to developers.</p>
                    <button 
                      onClick={() => triggerToast('Bug report form initialized.')}
                      className="px-3.5 py-1.5 bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 font-bold rounded-lg cursor-pointer"
                    >
                      Report an Issue
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 23. ABOUT SOFTVIEW */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Info className="w-5 h-5 text-indigo-400" />
                    <span>About SoftView ℹ️</span>
                  </h2>
                  <p className="text-xs text-gray-400">Client build signature, legal documentation, and software updates.</p>
                </div>

                <div className="p-5 bg-[#05040d] border border-white/5 rounded-xl space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-300">Software Version</span>
                    <span className="font-mono text-indigo-400 font-bold">SoftView v2.4.1 (Stable Build)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-300">Container Platform</span>
                    <span className="font-mono text-gray-400">Cloud Run Sandboxed Container</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-300">Engine Core</span>
                    <span className="font-mono text-gray-400">React 18 + Vite ESM + Gemini AI Integration</span>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <button 
                      onClick={handleCheckUpdates}
                      disabled={isCheckingUpdates}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isCheckingUpdates ? 'animate-spin' : ''}`} />
                      <span>{isCheckingUpdates ? 'Checking Updates...' : 'Check for Updates'}</span>
                    </button>

                    <div className="flex gap-4 text-xs font-semibold text-gray-400">
                      <button onClick={() => triggerToast('Terms of Service opened')} className="hover:text-white cursor-pointer">Terms</button>
                      <button onClick={() => triggerToast('Privacy Policy opened')} className="hover:text-white cursor-pointer">Privacy</button>
                      <button onClick={() => triggerToast('Open Source Licenses list loaded')} className="hover:text-white cursor-pointer">Licenses</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
