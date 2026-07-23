import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, RotateCcw, ThumbsUp, Share2, Download, CheckCircle2, MessageSquare, Send, Sparkles } from 'lucide-react';
import { Video, Comment } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
  onAddXp: (amount: number) => void;
}

export default function VideoPlayer({ video, onClose, onAddXp }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 5000) + 1200);
  const [hasLiked, setHasLiked] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentsList, setCommentsList] = useState<Comment[]>(video.comments || []);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  // Experience point award logic when user finishes video
  const xpAwarded = useRef(false);

  // If video is custom/AI and has no comments, initialize with mock discussion
  useEffect(() => {
    if (!video.comments || video.comments.length === 0) {
      setCommentsList([
        { id: 'mc-1', userName: 'Aslbek (You)', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop', text: 'This customized AI generation is incredibly precise. Captures the mood perfectly!', likes: 23, timestamp: 'Just now' },
        { id: 'mc-2', userName: 'TechEnthusiast', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop', text: 'Wait, did Gemini actually generate this script? Wow, the phrasing is spot on.', likes: 12, timestamp: '1 hour ago' }
      ]);
    } else {
      setCommentsList(video.comments);
    }
    setProgress(0);
    setCurrentSentenceIndex(0);
    setIsPlaying(true);
    xpAwarded.current = false;
  }, [video]);

  // Simulated video playback progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 100;
          }
          const next = prev + 0.8;
          return next >= 100 ? 100 : next;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Handle completion side-effects safely when progress reaches 100
  useEffect(() => {
    if (progress >= 100) {
      setIsPlaying(false);
      if (!xpAwarded.current) {
        xpAwarded.current = true;
        onAddXp(30); // Award 30 XP for completion
      }
    }
  }, [progress, onAddXp]);

  // Synced transcript sentence index based on progress
  const hasScript = video.id.startsWith('ai-pick-') || (video.comments && video.comments.length === 2 && !video.videoUrl);
  const scriptSentences = video.description.split('. ').filter(Boolean).map(s => s.trim() + '.');

  useEffect(() => {
    if (scriptSentences.length > 0) {
      const index = Math.min(
        scriptSentences.length - 1,
        Math.floor((progress / 100) * scriptSentences.length)
      );
      setCurrentSentenceIndex(index);
    }
  }, [progress, scriptSentences.length]);

  // Audio-visual Canvas animation (Futuristic neural net particle simulation)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; color: string }> = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 3 + 1,
        color: `hsla(${260 + Math.random() * 60}, 80%, 65%, ${Math.random() * 0.4 + 0.3})`
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Radial dark background glow
      const grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width / 1.2);
      grad.addColorStop(0, '#120d2d');
      grad.addColorStop(1, '#070512');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Playback-dependent waveform drawing at bottom
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
      ctx.lineWidth = 2;
      const amplitude = isPlaying ? 25 : 2;
      for (let x = 0; x < width; x += 10) {
        const y = height - 60 + Math.sin(x * 0.01 + (isPlaying ? Date.now() * 0.003 : 0)) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Particle network
      particles.forEach((p, idx) => {
        p.x += p.vx * (isPlaying ? 1.2 : 0.2);
        p.y += p.vy * (isPlaying ? 1.2 : 0.2);

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Connect particles within proximity
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - dist / 100) * 0.15})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      animationFrameId.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = canvas.parentElement?.clientHeight || 450;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying]);

  const handleLikeVideo = () => {
    if (hasLiked) {
      setLikesCount(likesCount - 1);
      setHasLiked(false);
    } else {
      setLikesCount(likesCount + 1);
      setHasLiked(true);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const added: Comment = {
      id: `custom-c-${Date.now()}`,
      userName: 'Aslbek',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop',
      text: newCommentText,
      likes: 0,
      timestamp: 'Just now'
    };

    setCommentsList([added, ...commentsList]);
    setNewCommentText('');
  };

  return (
    <div id="video-player-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Left 2 columns - Player & Details */}
      <div className="lg:col-span-2 space-y-4">
        {/* Main Video Visual Screen Container */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-[#2a245a]/50 shadow-2xl group flex items-center justify-center">
          {video.videoUrl && !hasScript ? (
            /* Embed player for real youtube clips */
            <iframe
              id="iframe-player"
              src={`${video.videoUrl}?autoplay=1&mute=0`}
              title={video.title}
              className="w-full h-full border-none absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            /* Interactive custom canvas visualizer for synthesized/text videos */
            <div className="relative w-full h-full">
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

              {/* Subtitles Overlay */}
              <div className="absolute bottom-16 inset-x-6 text-center z-10 pointer-events-none select-none">
                <span className="inline-block px-4 py-2 rounded-xl bg-black/75 backdrop-blur-sm border border-purple-500/20 text-white font-medium text-sm md:text-base max-w-xl mx-auto shadow-xl">
                  {scriptSentences[currentSentenceIndex] || "SoftCast Custom Broadcast Synthesizer..."}
                </span>
              </div>

              {/* Glowing decorative indicator */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 bg-purple-600/20 backdrop-blur-md border border-purple-500/30 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest font-sans">AI Synthesized Channel</span>
              </div>
            </div>
          )}

          {/* Player controls overlay (visible on mouse hover or pause state) */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 text-white hover:text-purple-400 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <button
                onClick={() => setProgress(0)}
                className="p-1.5 text-white hover:text-purple-400 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <Volume2 className="w-4 h-4 text-white" />
            </div>

            {/* Simulated progress timeline */}
            <div className="flex-1 mx-6 relative">
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="absolute inset-x-0 -top-2 opacity-0 cursor-pointer h-5 w-full"
              />
            </div>

            <div className="text-xs text-gray-300 font-mono select-none">
              {Math.floor(progress / 10)}% Done
            </div>
          </div>
        </div>

        {/* Video metadata titles, buttons */}
        <div className="p-4 bg-[#110e28]/40 border border-[#231b52]/30 rounded-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-white leading-snug tracking-tight">{video.title}</h1>
              <p className="text-xs text-gray-400 mt-1">
                {video.views} • {video.uploadDate}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="like-video-btn"
                onClick={handleLikeVideo}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  hasLiked
                    ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                    : 'bg-[#151138]/50 border-[#2a245a]/50 text-gray-300 hover:text-white hover:bg-[#1a1545]'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                <span>{likesCount} Likes</span>
              </button>

              <button className="flex items-center gap-1.5 px-4 py-2 bg-[#151138]/50 border border-[#2a245a]/50 text-gray-300 hover:text-white hover:bg-[#1a1545] rounded-xl text-xs font-semibold transition-all">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>

              <button className="flex items-center gap-1.5 px-4 py-2 bg-[#151138]/50 border border-[#2a245a]/50 text-gray-300 hover:text-white hover:bg-[#1a1545] rounded-xl text-xs font-semibold transition-all">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="border-t border-[#231b52]/40 pt-4 flex gap-4">
            <div className="shrink-0">
              <div className="w-11 h-11 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-lg">
                {video.creator.charAt(0)}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white">{video.creator}</span>
                {video.creatorVerified && <CheckCircle2 className="w-4 h-4 text-blue-400 fill-blue-400/10 shrink-0" />}
              </div>
              <p className="text-[10px] text-purple-400 font-sans font-medium mt-0.5">850K Subscribers</p>

              <div className="mt-3 text-xs text-gray-300 leading-relaxed space-y-1">
                <p className={isDescriptionExpanded ? '' : 'line-clamp-2'}>
                  {video.description}
                </p>
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-purple-400 font-semibold hover:text-purple-300 mt-1 transition-colors"
                >
                  {isDescriptionExpanded ? 'Show less' : 'Read more'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Dynamic Comments Section */}
      <div id="comments-column" className="space-y-4">
        <div className="bg-[#110e28]/50 border border-[#231b52]/40 rounded-2xl p-4 h-[calc(100vh-6.5rem)] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#231b52]/40">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-sm text-white">Live Comments ({commentsList.length})</span>
            </div>
            <button
              onClick={onClose}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              Back to Browse
            </button>
          </div>

          {/* Scrollable list of comments */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            <AnimatePresence initial={false}>
              {commentsList.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 text-left"
                >
                  <img
                    src={c.userAvatar}
                    alt={c.userName}
                    className="w-8 h-8 rounded-lg object-cover shrink-0 border border-purple-500/20"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-gray-200">{c.userName}</span>
                      <span className="text-[9px] text-gray-500">{c.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1 leading-normal bg-white/5 p-2 rounded-xl border border-white/5">
                      {c.text}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-[9px] text-gray-500">
                      <ThumbsUp className="w-2.5 h-2.5 hover:text-purple-400 cursor-pointer" />
                      <span>{c.likes}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* New Comment Submission Form */}
          <form onSubmit={handleCommentSubmit} className="pt-3 border-t border-[#231b52]/40 flex gap-2">
            <input
              id="comment-input"
              type="text"
              placeholder="Join the discussion..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="flex-1 bg-[#090717] border border-[#2a245a]/50 focus:border-purple-500 text-white text-xs px-3.5 py-2.5 rounded-xl outline-none placeholder-gray-500 transition-all font-sans"
            />
            <button
              id="submit-comment-btn"
              type="submit"
              className="p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
