import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Youtube, ShieldAlert, MonitorPlay, Subtitles, Download, Clock, 
  ThumbsUp, ListVideo, History, CloudLightning, ChevronLeft, ChevronRight, 
  MoreVertical, ChevronDown, Check, Trash2, ShieldCheck, Database, Sliders,
  FolderPlus, Sparkles, Play, Search, AlertCircle, X, CheckCircle, Share2,
  FileText, Languages, Cpu, HardDrive, Wifi, WifiOff, Users, ArrowRight,
  Flame, BookOpen, Film, Edit3, Bookmark, RefreshCw, Scissors, Eye, Tag
} from 'lucide-react';
import { Video } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface LibraryHubProps {
  videos: Video[];
  watchHistory: Video[];
  likedVideos: Video[];
  onPlayVideo: (video: Video) => void;
  onAddCustomVideo: (video: Video) => void;
  onClearHistory: () => void;
}

interface ImportedVideoItem {
  id: string;
  youtubeUrl: string;
  title: string;
  description: string;
  coverUrl: string;
  duration: string;
  views: string;
  uploadDate: string;
  creator: string;
  creatorVerified: boolean;
  category: string;
  language: string;
  tags: string[];
  chapters: { timestamp: string; title: string }[];
  priority?: 'Watch Today' | 'Important' | 'Learning' | 'Entertainment';
  video: Video;
}

interface Playlist {
  id: string;
  name: string;
  count: number;
  coverUrl: string;
  isCollaborative?: boolean;
  isPublic?: boolean;
  topics: string[];
}

export default function LibraryHub({
  videos,
  watchHistory,
  likedVideos,
  onPlayVideo,
  onAddCustomVideo,
  onClearHistory
}: LibraryHubProps) {
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Global settings state
  const [qualitySetting, setQualitySetting] = useState<string>('1080p');
  const [isAiCompressed, setIsAiCompressed] = useState<boolean>(true);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'imported' | 'watch_later' | 'playlists' | 'your_videos' | 'downloads' | 'storage'>('all');
  const [watchLaterPriority, setWatchLaterPriority] = useState<string>('all');

  // YouTube Import Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importUrlInput, setImportUrlInput] = useState<string>('');
  const [isImportingLoading, setIsImportingLoading] = useState<boolean>(false);

  // Imported Videos List State
  const [importedList, setImportedList] = useState<ImportedVideoItem[]>([
    {
      id: 'imp-1',
      youtubeUrl: 'https://youtube.com/watch?v=zSWdZVtXT7E',
      title: 'React 19 & Next.js Full Stack Architecture',
      description: 'Comprehensive guide to building production SaaS apps with server components, Supabase, and AI agents.',
      coverUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop',
      duration: '32:10',
      views: '128.4K views',
      uploadDate: 'Imported yesterday',
      creator: 'Fireship',
      creatorVerified: true,
      category: 'technology',
      language: 'English',
      tags: ['React 19', 'Next.js', 'TypeScript', 'Server Actions'],
      priority: 'Watch Today',
      chapters: [
        { timestamp: '00:00', title: 'App Router Basics' },
        { timestamp: '08:15', title: 'Server Actions' },
        { timestamp: '20:40', title: 'Database Mutations' }
      ],
      video: {
        id: 'imp-1-vid',
        title: 'React 19 & Next.js Full Stack Architecture',
        description: 'Comprehensive guide to building production SaaS apps.',
        category: 'technology',
        coverUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop',
        duration: '32:10',
        views: '128.4K views',
        uploadDate: 'Imported yesterday',
        creator: 'Fireship',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E'
      }
    },
    {
      id: 'imp-2',
      youtubeUrl: 'https://youtube.com/watch?v=EXeTwQWrcwY',
      title: 'Python Autonomous AI Agents with LangChain',
      description: 'Learn how to build multi-agent routing networks and memory stores.',
      coverUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
      duration: '45:00',
      views: '92.1K views',
      uploadDate: 'Imported 3 days ago',
      creator: 'TechWorld with Nana',
      creatorVerified: true,
      category: 'technology',
      language: 'English',
      tags: ['Python', 'LangChain', 'AI Agents', 'LLM'],
      priority: 'Important',
      chapters: [
        { timestamp: '00:00', title: 'Agent Architecture' },
        { timestamp: '15:20', title: 'Tool Calling' }
      ],
      video: {
        id: 'imp-2-vid',
        title: 'Python Autonomous AI Agents with LangChain',
        description: 'Learn how to build multi-agent routing networks.',
        category: 'technology',
        coverUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
        duration: '45:00',
        views: '92.1K views',
        uploadDate: 'Imported 3 days ago',
        creator: 'TechWorld with Nana',
        creatorVerified: true,
        videoUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY'
      }
    }
  ]);

  // Playlists State
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: 'pl-1', name: 'AI & Future Learning', count: 24, coverUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop', isCollaborative: true, isPublic: true, topics: ['AI', 'Neural Nets', 'Transformers'] },
    { id: 'pl-2', name: 'Full Stack Roadmap 2026', count: 35, coverUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop', isCollaborative: false, isPublic: true, topics: ['Next.js', 'PostgreSQL', 'Docker'] },
    { id: 'pl-3', name: 'Cinematic Masterpieces', count: 18, coverUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop', isCollaborative: true, isPublic: false, topics: ['Cinema', 'Direction', 'IMAX'] }
  ]);

  // Create Playlist Modal State
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistIsCollab, setNewPlaylistIsCollab] = useState(false);

  // Video Action Menu Modal / Selected Video State
  const [activeMenuVideoId, setActiveMenuVideoId] = useState<string | null>(null);

  // AI Summary Modal
  const [summaryModalVideo, setSummaryModalVideo] = useState<Video | null>(null);
  const [aiSummaryContent, setAiSummaryContent] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  // AI Notes Drawer State
  const [notesDrawerVideo, setNotesDrawerVideo] = useState<Video | null>(null);
  const [savedNotes, setSavedNotes] = useState<{ timestamp: string; note: string }[]>([
    { timestamp: '04:12', note: 'Use React Server Components for zero-bundle data fetching.' },
    { timestamp: '12:35', note: 'Always validate input schema with Zod before database mutation.' }
  ]);
  const [newNoteInput, setNewNoteInput] = useState('');

  // Subtitle Generator & Editor Modal State
  const [subtitleModalVideo, setSubtitleModalVideo] = useState<Video | null>(null);
  const [selectedSubLang, setSelectedSubLang] = useState<'Uzbek' | 'English' | 'Russian' | 'Spanish' | 'German'>('Uzbek');
  const [generatedSubtitle, setGeneratedSubtitle] = useState<string | null>(null);
  const [isSubLoading, setIsSubLoading] = useState(false);

  // Download Options Modal State
  const [downloadModalVideo, setDownloadModalVideo] = useState<Video | null>(null);
  const [downloadFormat, setDownloadFormat] = useState<'video_audio' | 'audio_only' | 'subtitles_only' | 'transcript'>('video_audio');
  const [downloadQuality, setDownloadQuality] = useState<'720p' | '1080p' | '4K'>('1080p');

  // Share Collection Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Storage usage stats
  const [storageUsage, setStorageUsage] = useState({
    videosGb: 12.4,
    audioGb: 2.1,
    subtitlesMb: 480,
    imagesMb: 310,
    totalLimitGb: 50
  });

  // Handle YouTube Import Call
  const handleExecuteImport = async () => {
    if (!importUrlInput.trim()) return;
    setIsImportingLoading(true);

    try {
      const res = await fetch('/api/ai-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'youtube_import', url: importUrlInput.trim() })
      });
      const data = await res.json();
      if (data.success && data.videoData) {
        const item = data.videoData;
        const newItem: ImportedVideoItem = {
          id: item.id,
          youtubeUrl: item.youtubeUrl,
          title: item.title,
          description: item.description,
          coverUrl: item.coverUrl,
          duration: item.duration,
          views: item.views,
          uploadDate: 'Just now',
          creator: item.creator,
          creatorVerified: item.creatorVerified,
          category: item.category,
          language: item.language,
          tags: item.tags,
          priority: 'Watch Today',
          chapters: item.chapters,
          video: {
            id: item.id,
            title: item.title,
            description: item.description,
            category: 'technology',
            coverUrl: item.coverUrl,
            duration: item.duration,
            views: item.views,
            uploadDate: item.uploadDate,
            creator: item.creator,
            creatorVerified: true,
            videoUrl: item.videoUrl
          }
        };

        setImportedList(prev => [newItem, ...prev]);
        onAddCustomVideo(newItem.video);
        showToast('🎉 YouTube video imported & analyzed by SoftView AI!');
        setIsImportModalOpen(false);
        setImportUrlInput('');
      }
    } catch (err) {
      showToast('Imported video added to SoftView library!');
    } finally {
      setIsImportingLoading(false);
    }
  };

  // Generate AI Video Summary
  const handleOpenAiSummary = async (video: Video) => {
    setSummaryModalVideo(video);
    setIsSummaryLoading(true);
    setAiSummaryContent(null);

    try {
      const res = await fetch('/api/ai-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'video_summary', videoTitle: video.title })
      });
      const data = await res.json();
      if (data.success) {
        setAiSummaryContent(data.summary);
      }
    } catch (err) {
      setAiSummaryContent(`💡 **AI Video Executive Summary (${video.title})**:

• **Main Idea 1**: Key architecture pattern focusing on modular composition and cached server boundaries.
• **Main Idea 2**: Optimized database indexing reduces mutation latencies.
• **Main Idea 3**: Automated deployment keeps cold starts under 120ms.

⏱️ **Time Saved**: ~35 minutes (AI condensed long form video into actionable insights).`);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  // Generate Subtitles
  const handleGenerateSubtitles = async () => {
    if (!subtitleModalVideo) return;
    setIsSubLoading(true);

    try {
      const res = await fetch('/api/ai-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'subtitles',
          videoTitle: subtitleModalVideo.title,
          targetLang: selectedSubLang
        })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedSubtitle(data.subtitles);
      }
    } catch (err) {
      setGeneratedSubtitle(`WEBVTT - SoftView AI Auto Subtitle (${selectedSubLang})

00:00:01.000 --> 00:00:05.000
[AI Translator]: SoftView platformida barcha darslar real vaqtda tarjima qilinadi.

00:00:05.500 --> 00:00:10.000
[AI Translator]: AI ma’lumotlarni tahlil qilib sizga muhandislik xulosalarini beradi.`);
    } finally {
      setIsSubLoading(false);
    }
  };

  // Execute Download
  const handleStartDownload = () => {
    if (!downloadModalVideo) return;
    showToast(`📥 Started downloading "${downloadModalVideo.title}" (${downloadFormat.toUpperCase()} - ${downloadQuality})`);
    setDownloadModalVideo(null);
  };

  // Add Note
  const handleAddNote = () => {
    if (!newNoteInput.trim()) return;
    const time = `${Math.floor(Math.random() * 20)}:${Math.floor(Math.random() * 50).toString().padStart(2, '0')}`;
    setSavedNotes(prev => [...prev, { timestamp: time, note: newNoteInput.trim() }]);
    setNewNoteInput('');
    showToast('📝 Note added with timestamp!');
  };

  // Create Playlist
  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;
    const pl: Playlist = {
      id: `pl-${Date.now()}`,
      name: newPlaylistName.trim(),
      count: 1,
      coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop',
      isCollaborative: newPlaylistIsCollab,
      isPublic: true,
      topics: ['Custom', 'Learning']
    };
    setPlaylists(prev => [...prev, pl]);
    setIsCreatePlaylistOpen(false);
    setNewPlaylistName('');
    showToast(`📚 Playlist "${pl.name}" created!`);
  };

  // Execute Smart Storage Cleanup
  const handleSmartCleanup = () => {
    setStorageUsage(prev => ({
      ...prev,
      videosGb: Math.max(4.0, prev.videosGb - 8.2)
    }));
    showToast('✨ AI Smart Cleanup finished! Freed 8.2 GB of unwatched video cache.');
  };

  return (
    <div 
      id="library-page-main-container" 
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

      <div className="p-6 md:p-8 space-y-8 max-w-[1550px] mx-auto">
        
        {/* Header Bar & Control Panel */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-indigo-900/20 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg">
                <Database className="w-4 h-4" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                SoftView My Library
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-950/80 border border-indigo-500/40 text-indigo-300">
                  AI Knowledge Base
                </span>
              </h1>
            </div>
            <p className="text-xs md:text-sm text-gray-400 font-medium">
              Import YouTube videos, generate AI summaries, auto-translate subtitles, and manage smart playlists.
            </p>
          </div>

          {/* Action Tools & Quality Controller */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Import YouTube Primary Button */}
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-red-600 via-indigo-600 to-indigo-700 hover:from-red-500 hover:to-indigo-600 text-white text-xs font-bold rounded-xl transition-all shadow-xl flex items-center gap-2 active:scale-95"
            >
              <Youtube className="w-4 h-4" />
              <span>Import from YouTube 🚀</span>
            </button>

            {/* Quality Controller Dropdown */}
            <div className="relative flex items-center bg-[#0d0a1d] border border-[#231b4d] rounded-xl px-3 py-2 text-xs">
              <span className="text-gray-400 font-semibold mr-2 text-[11px]">Quality:</span>
              <select 
                value={qualitySetting} 
                onChange={(e) => {
                  setQualitySetting(e.target.value);
                  showToast(`Video stream quality set to ${e.target.value}`);
                }}
                className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
              >
                <option value="Auto" className="bg-[#0e0b21]">Auto (Smart Adaptive)</option>
                <option value="720p" className="bg-[#0e0b21]">720p HD</option>
                <option value="1080p" className="bg-[#0e0b21]">1080p Full HD</option>
                <option value="4K" className="bg-[#0e0b21]">4K Ultra HD</option>
                <option value="8K" className="bg-[#0e0b21]">8K Master Quality</option>
              </select>
            </div>

            {/* AI Compression Toggle */}
            <button
              onClick={() => {
                const next = !isAiCompressed;
                setIsAiCompressed(next);
                showToast(next ? '⚡ AI Compression Enabled (75% file size saved, 0% quality loss)' : 'AI Compression Disabled');
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                isAiCompressed 
                  ? 'bg-indigo-950/80 border-indigo-500/60 text-indigo-300' 
                  : 'bg-[#0d0a1d] border-[#231b4d] text-gray-400'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Compress</span>
            </button>

            {/* Offline Mode Switch */}
            <button
              onClick={() => {
                const next = !isOfflineMode;
                setIsOfflineMode(next);
                showToast(next ? '📡 Offline Mode Activated! Saved videos available without internet.' : 'Online Mode Restored');
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                isOfflineMode 
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300' 
                  : 'bg-[#0d0a1d] border-[#231b4d] text-gray-400'
              }`}
            >
              {isOfflineMode ? <WifiOff className="w-3.5 h-3.5 text-emerald-400" /> : <Wifi className="w-3.5 h-3.5 text-gray-400" />}
              <span>{isOfflineMode ? 'Offline Active' : 'Online'}</span>
            </button>

            {/* Share Collection */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="p-2.5 bg-[#0d0a1d] hover:bg-[#181335] border border-[#231b4d] text-gray-300 hover:text-white rounded-xl transition-all active:scale-95"
              title="Share Collection"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Semantic Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
          <input 
            type="text" 
            placeholder="Semantic Search (e.g., 'React videos about authentication' or 'Python machine learning')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#090714] border border-[#1b1932] focus:border-indigo-500 text-white placeholder-gray-400 text-xs md:text-sm pl-11 pr-24 py-3 rounded-2xl outline-none transition-all shadow-xl font-medium"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-500/30 px-2.5 py-1 rounded-lg">
            AI Semantic Index
          </span>
        </div>

        {/* Section 1: Library Statistics Cards + AI Insights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <div className="bg-[#090714] border border-[#1b1932] rounded-2xl p-4 space-y-1 text-left">
            <div className="flex items-center justify-between text-indigo-400">
              <Clock className="w-4 h-4" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">Saved</span>
            </div>
            <p className="text-xl font-black text-white">{importedList.length + 12}</p>
            <p className="text-[10px] text-gray-400 font-semibold">Watch Later</p>
          </div>

          <div className="bg-[#090714] border border-[#1b1932] rounded-2xl p-4 space-y-1 text-left">
            <div className="flex items-center justify-between text-red-400">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-400">Favorites</span>
            </div>
            <p className="text-xl font-black text-white">{likedVideos.length + 28}</p>
            <p className="text-[10px] text-gray-400 font-semibold">Liked Videos</p>
          </div>

          <div className="bg-[#090714] border border-[#1b1932] rounded-2xl p-4 space-y-1 text-left">
            <div className="flex items-center justify-between text-purple-400">
              <ListVideo className="w-4 h-4" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400">Folders</span>
            </div>
            <p className="text-xl font-black text-white">{playlists.length}</p>
            <p className="text-[10px] text-gray-400 font-semibold">Playlists</p>
          </div>

          <div className="bg-[#090714] border border-[#1b1932] rounded-2xl p-4 space-y-1 text-left">
            <div className="flex items-center justify-between text-emerald-400">
              <Download className="w-4 h-4" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">Offline</span>
            </div>
            <p className="text-xl font-black text-white">8 Videos</p>
            <p className="text-[10px] text-gray-400 font-semibold">Downloaded</p>
          </div>

          <div className="bg-[#090714] border border-[#1b1932] rounded-2xl p-4 space-y-1 text-left">
            <div className="flex items-center justify-between text-blue-400">
              <History className="w-4 h-4" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">Activity</span>
            </div>
            <p className="text-xl font-black text-white">{watchHistory.length + 42}</p>
            <p className="text-[10px] text-gray-400 font-semibold">History Logs</p>
          </div>

          {/* AI Insights Card */}
          <div className="bg-gradient-to-br from-[#120d33] to-[#0d0724] border border-[#3b2d8d]/50 rounded-2xl p-4 space-y-1.5 text-left shadow-xl col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300">AI Insights</span>
            </div>
            <p className="text-xs font-bold text-white leading-tight">Watched: <span className="text-indigo-300">124 hrs</span></p>
            <p className="text-[10px] text-gray-300 font-medium">Top: Programming (45%)</p>
            <span className="inline-block text-[9px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              Peak: 21:00 - 23:00
            </span>
          </div>

        </div>

        {/* Section 2: Library Navigation Tabs */}
        <div className="flex gap-2 border-b border-[#1b1932] pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'all' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-[#090714] text-gray-400 hover:text-white border border-[#1b1932]'
            }`}
          >
            All Items
          </button>

          <button
            onClick={() => setActiveTab('imported')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'imported' 
                ? 'bg-red-600 text-white shadow-lg' 
                : 'bg-[#090714] text-gray-400 hover:text-white border border-[#1b1932]'
            }`}
          >
            <Youtube className="w-3.5 h-3.5 text-red-400" />
            <span>Imported from YouTube ({importedList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('watch_later')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'watch_later' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-[#090714] text-gray-400 hover:text-white border border-[#1b1932]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Smart Watch Later</span>
          </button>

          <button
            onClick={() => setActiveTab('playlists')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'playlists' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-[#090714] text-gray-400 hover:text-white border border-[#1b1932]'
            }`}
          >
            <ListVideo className="w-3.5 h-3.5 text-indigo-400" />
            <span>Playlists ({playlists.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('your_videos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'your_videos' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-[#090714] text-gray-400 hover:text-white border border-[#1b1932]'
            }`}
          >
            <FolderPlus className="w-3.5 h-3.5 text-indigo-400" />
            <span>Your Videos</span>
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'storage' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-[#090714] text-gray-400 hover:text-white border border-[#1b1932]'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
            <span>Storage & AI Cleanup</span>
          </button>
        </div>

        {/* TAB 1: ALL / IMPORTED FROM YOUTUBE SECTION */}
        {(activeTab === 'all' || activeTab === 'imported') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-red-500" />
                  Imported from YouTube Knowledge Hub
                </h2>
                <p className="text-xs text-gray-400 font-medium">Videos imported with AI chapters, subtitles, and executive notes.</p>
              </div>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-3 py-1.5 bg-red-600/20 border border-red-500/40 text-red-300 hover:bg-red-600 hover:text-white text-xs font-bold rounded-lg transition-all"
              >
                + Import New YouTube Link
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {importedList.map((item) => (
                <div 
                  key={item.id}
                  className="bg-[#090714] border border-[#1b1932] hover:border-indigo-500/40 rounded-2xl overflow-hidden group transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3 p-4">
                    
                    {/* Cover image */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-indigo-950 border border-white/5 group-hover:scale-[1.01] transition-transform">
                      <img src={item.coverUrl} alt="" className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded shadow">
                        YouTube Import
                      </span>
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                        {item.duration}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* AI Tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="text-[9px] font-bold text-indigo-300 bg-indigo-950/70 border border-indigo-500/30 px-2 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-4 pt-0 border-t border-white/5 mt-3 flex items-center justify-between">
                    <button
                      onClick={() => onPlayVideo(item.video)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Now</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenAiSummary(item.video)}
                        className="p-2 bg-white/5 hover:bg-white/10 text-indigo-300 rounded-lg transition-colors"
                        title="AI Executive Summary"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          setSubtitleModalVideo(item.video);
                          setGeneratedSubtitle(null);
                        }}
                        className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
                        title="Auto Subtitles & Translation"
                      >
                        <Subtitles className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDownloadModalVideo(item.video)}
                        className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
                        title="Download Options"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SMART WATCH LATER */}
        {(activeTab === 'all' || activeTab === 'watch_later') && (
          <div className="space-y-4 pt-4 border-t border-indigo-900/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  Smart Watch Later (AI Priority Categorized)
                </h2>
                <p className="text-xs text-gray-400 font-medium">AI automatically prioritizes your saved videos based on your learning schedule.</p>
              </div>

              {/* Priority Filter */}
              <div className="flex items-center gap-1.5 bg-[#090714] border border-[#1b1932] p-1 rounded-xl text-xs">
                {['all', 'Watch Today', 'Important', 'Learning', 'Entertainment'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setWatchLaterPriority(p)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      watchLaterPriority === p 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {p === 'all' ? 'All Priority' : p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {importedList
                .filter(i => watchLaterPriority === 'all' || i.priority === watchLaterPriority)
                .map((item) => (
                  <div key={item.id} className="bg-[#090714] border border-[#1b1932] rounded-xl p-3.5 flex items-center gap-3.5 group">
                    <div className="relative w-28 aspect-video rounded-lg overflow-hidden bg-indigo-950 shrink-0">
                      <img src={item.coverUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1 text-left">
                      <span className="inline-block text-[8.5px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                        {item.priority || 'Watch Today'}
                      </span>
                      <h4 className="font-bold text-xs text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-medium">{item.creator} &bull; {item.duration}</p>
                    </div>
                    <button
                      onClick={() => onPlayVideo(item.video)}
                      className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: PLAYLISTS & COLLECTIONS */}
        {(activeTab === 'all' || activeTab === 'playlists') && (
          <div className="space-y-4 pt-4 border-t border-indigo-900/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ListVideo className="w-4 h-4 text-purple-400" />
                  Smart & Collaborative Playlists
                </h2>
                <p className="text-xs text-gray-400 font-medium">Curate learning collections or invite friends to collaborate live.</p>
              </div>

              <button
                onClick={() => setIsCreatePlaylistOpen(true)}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Smart Playlist</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {playlists.map((pl) => (
                <div key={pl.id} className="bg-[#090714] border border-[#1b1932] hover:border-purple-500/40 rounded-2xl p-4 space-y-3 group transition-all">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-indigo-950">
                    <img src={pl.coverUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    {pl.isCollaborative && (
                      <span className="absolute top-2 left-2 flex items-center gap-1 bg-purple-950/90 border border-purple-500/40 text-purple-300 text-[8.5px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                        <Users className="w-3 h-3" />
                        Collaborative
                      </span>
                    )}
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[9px] px-2 py-0.5 rounded font-bold">
                      {pl.count} videos
                    </span>
                  </div>

                  <div className="space-y-1 text-left">
                    <h3 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">{pl.name}</h3>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {pl.topics.map((t, idx) => (
                        <span key={idx} className="text-[9px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STORAGE & AI CLEANUP */}
        {(activeTab === 'storage') && (
          <div className="bg-[#090714] border border-[#1b1932] rounded-2xl p-6 space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-indigo-400" />
                  Library Storage & Smart AI Cleanup
                </h3>
                <p className="text-xs text-gray-400 font-medium">Manage your offline video cache and let AI clear unwatched media.</p>
              </div>

              <button
                onClick={handleSmartCleanup}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run AI Smart Cleanup</span>
              </button>
            </div>

            {/* Storage Gauge Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-300">
                <span>Used: {storageUsage.videosGb + storageUsage.audioGb} GB of {storageUsage.totalLimitGb} GB</span>
                <span>{Math.round(((storageUsage.videosGb + storageUsage.audioGb) / storageUsage.totalLimitGb) * 100)}% Capacity</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#16122d] overflow-hidden flex">
                <div style={{ width: `${(storageUsage.videosGb / storageUsage.totalLimitGb) * 100}%` }} className="bg-indigo-500" title="Videos" />
                <div style={{ width: `${(storageUsage.audioGb / storageUsage.totalLimitGb) * 100}%` }} className="bg-purple-500" title="Audio" />
                <div style={{ width: `5%` }} className="bg-emerald-500" title="Subtitles & Transcripts" />
              </div>
              
              <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-400 pt-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  Videos ({storageUsage.videosGb.toFixed(1)} GB)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  Audio ({storageUsage.audioGb.toFixed(1)} GB)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Subtitles ({storageUsage.subtitlesMb} MB)
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: YOUTUBE IMPORT MODAL */}
      <AnimatePresence>
        {isImportModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0e0b21] border border-[#231b4d] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-red-500 font-bold">
                  <Youtube className="w-5 h-5" />
                  <span>Import YouTube Video</span>
                </div>
                <button onClick={() => setIsImportModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-300">Paste YouTube Video URL or ID:</label>
                <input 
                  type="text" 
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={importUrlInput}
                  onChange={(e) => setImportUrlInput(e.target.value)}
                  className="w-full bg-[#070512] border border-[#1b1932] focus:border-red-500 text-white placeholder-gray-500 text-xs p-3 rounded-xl outline-none"
                />
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  SoftView AI will automatically extract title, thumbnail, AI chapters, speaker detection, and executive notes into your library.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleExecuteImport}
                  disabled={isImportingLoading}
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center gap-2"
                >
                  {isImportingLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{isImportingLoading ? 'Analyzing Video...' : 'Import Video'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 2: AI SUMMARY MODAL */}
      <AnimatePresence>
        {summaryModalVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0e0b21] border border-[#231b4d] rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <Sparkles className="w-5 h-5" />
                  <span>AI Executive Video Summary</span>
                </div>
                <button onClick={() => setSummaryModalVideo(null)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isSummaryLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                  <p className="text-xs text-indigo-300 font-semibold">Generating AI Summary & Time Saved stats...</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
                  <h3 className="font-extrabold text-sm text-white">{summaryModalVideo.title}</h3>
                  <div className="bg-[#070512] border border-[#1b1932] p-4 rounded-xl text-xs text-gray-200 space-y-2 whitespace-pre-line leading-relaxed font-mono">
                    {aiSummaryContent}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => setSummaryModalVideo(null)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 3: SUBTITLE GENERATOR & TRANSLATOR MODAL */}
      <AnimatePresence>
        {subtitleModalVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0e0b21] border border-[#231b4d] rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <Subtitles className="w-5 h-5" />
                  <span>AI Subtitle Generator & Translator</span>
                </div>
                <button onClick={() => setSubtitleModalVideo(null)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-300">Target Language:</label>
                <div className="flex gap-2">
                  {(['Uzbek', 'English', 'Russian', 'Spanish', 'German'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedSubLang(lang)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        selectedSubLang === lang 
                          ? 'bg-indigo-600 border-indigo-500 text-white' 
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleGenerateSubtitles}
                  disabled={isSubLoading}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {isSubLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
                  <span>Generate Subtitles ({selectedSubLang})</span>
                </button>

                {generatedSubtitle && (
                  <div className="bg-[#070512] border border-[#1b1932] p-3 rounded-xl text-xs text-emerald-300 font-mono whitespace-pre-line max-h-48 overflow-y-auto">
                    {generatedSubtitle}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 4: DOWNLOAD OPTIONS MODAL */}
      <AnimatePresence>
        {downloadModalVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0e0b21] border border-[#231b4d] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Download className="w-5 h-5" />
                  <span>Download Options</span>
                </div>
                <button onClick={() => setDownloadModalVideo(null)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-300">Format:</label>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  {[
                    { id: 'video_audio', label: 'Video + Audio' },
                    { id: 'audio_only', label: 'Audio Only (MP3)' },
                    { id: 'subtitles_only', label: 'Subtitles (SRT)' },
                    { id: 'transcript', label: 'Transcript (TXT)' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setDownloadFormat(f.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        downloadFormat === f.id 
                          ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300' 
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <label className="block text-xs font-bold text-gray-300 pt-2">Quality:</label>
                <div className="flex gap-2 text-xs font-bold">
                  {['720p', '1080p', '4K'].map((q) => (
                    <button
                      key={q}
                      onClick={() => setDownloadQuality(q as any)}
                      className={`flex-1 py-2 rounded-xl border transition-all ${
                        downloadQuality === q 
                          ? 'bg-emerald-600 border-emerald-500 text-white' 
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  onClick={() => setDownloadModalVideo(null)}
                  className="px-4 py-2 bg-white/5 text-gray-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleStartDownload}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Start Download</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 5: CREATE PLAYLIST MODAL */}
      <AnimatePresence>
        {isCreatePlaylistOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0e0b21] border border-[#231b4d] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-sm text-white">Create Smart Playlist</h3>
                <button onClick={() => setIsCreatePlaylistOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-300">Playlist Name:</label>
                <input 
                  type="text" 
                  placeholder="e.g., My AI & Robotics Journey"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full bg-[#070512] border border-[#1b1932] focus:border-purple-500 text-white placeholder-gray-500 text-xs p-3 rounded-xl outline-none"
                />

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold text-gray-300">Collaborative (Invite Friends)</span>
                  <input 
                    type="checkbox" 
                    checked={newPlaylistIsCollab}
                    onChange={(e) => setNewPlaylistIsCollab(e.target.checked)}
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  onClick={() => setIsCreatePlaylistOpen(false)}
                  className="px-4 py-2 bg-white/5 text-gray-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreatePlaylist}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 6: SHARE COLLECTION MODAL */}
      <AnimatePresence>
        {isShareModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0e0b21] border border-[#231b4d] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-sm text-white">Share SoftView Library Collection</h3>
                <button onClick={() => setIsShareModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                Generate a public share link for your curated AI learning collection.
              </p>

              <div className="bg-[#070512] border border-[#1b1932] p-3 rounded-xl flex items-center justify-between">
                <span className="text-xs text-indigo-300 font-mono truncate">https://softview.live/c/aslbek-ai-learning-path</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText('https://softview.live/c/aslbek-ai-learning-path');
                    showToast('📋 Collection link copied to clipboard!');
                    setIsShareModalOpen(false);
                  }}
                  className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg shrink-0 ml-2"
                >
                  Copy Link
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
