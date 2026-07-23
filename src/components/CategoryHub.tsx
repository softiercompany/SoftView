import { Gamepad2, Cpu, Clapperboard, Play, CheckCircle2 } from 'lucide-react';
import { Video } from '../types';

interface CategoryHubProps {
  category: 'gaming' | 'technology' | 'cinema' | 'discover';
  videos: Video[];
  onPlayVideo: (video: Video) => void;
}

export default function CategoryHub({ category, videos, onPlayVideo }: CategoryHubProps) {
  // Filter appropriate videos
  const categoryVideos = videos.filter((v) => {
    if (category === 'discover') return true; // Discover shows everything
    return v.category === category;
  });

  const getHeaderDetails = () => {
    switch (category) {
      case 'gaming':
        return {
          title: 'Gaming Central',
          sub: 'Watch custom Esports tournaments, lets plays, strategies and walkthroughs.',
          icon: Gamepad2,
          color: 'from-amber-600/10 via-amber-950/5'
        };
      case 'technology':
        return {
          title: 'Technology & Architecture',
          sub: 'Explore software roadmap lessons, quantum sandboxes, and modern framework guides.',
          icon: Cpu,
          color: 'from-purple-600/10 via-purple-950/5'
        };
      case 'cinema':
        return {
          title: 'Cinema Masterclasses',
          sub: 'Deep film grading essays, directors block decodes, and cinematography analysis.',
          icon: Clapperboard,
          color: 'from-indigo-600/10 via-indigo-950/5'
        };
      default:
        return {
          title: 'Discover Channels',
          sub: 'Search, browse, and master customized tutorials across the SoftCast universe.',
          icon: Play,
          color: 'from-purple-600/10 via-purple-950/5'
        };
    }
  };

  const header = getHeaderDetails();
  const Icon = header.icon;

  return (
    <div id={`category-workspace-${category}`} className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] select-none text-left">
      {/* Dynamic Jumbotron Cover */}
      <div className={`p-6 bg-gradient-to-r ${header.color} to-transparent border border-white/5 rounded-2xl flex items-center gap-4`}>
        <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-white animate-pulse">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">{header.title}</h1>
          <p className="text-xs text-gray-400 mt-1">{header.sub}</p>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {categoryVideos.map((video) => (
          <div
            id={`cat-video-card-${video.id}`}
            key={video.id}
            className="group bg-[#110e28]/30 hover:bg-[#110e28]/65 border border-[#231b52]/30 hover:border-purple-500/30 p-3.5 rounded-2xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Cover photo */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-purple-950/20 border border-[#2a245a]/50 shrink-0">
              <img
                src={video.coverUrl}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute bottom-2 right-2 text-[9px] px-1 bg-black/80 rounded font-mono text-white font-bold">
                {video.duration}
              </span>
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <button
                  onClick={() => onPlayVideo(video)}
                  className="p-2 bg-purple-600 rounded-full text-white hover:scale-110 active:scale-95 transition-all shadow-lg"
                >
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </button>
              </div>
            </div>

            {/* Video metadata titles */}
            <div className="mt-3.5 space-y-1 text-left flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-white text-xs leading-snug group-hover:text-purple-400 transition-colors line-clamp-2">
                  {video.title}
                </h4>
                <p className="text-[10px] text-gray-400 line-clamp-1 mt-1 leading-relaxed">
                  {video.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-[#231b52]/30 mt-3">
                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
                  <span>{video.creator}</span>
                  {video.creatorVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/5 shrink-0" />}
                </div>
                <span className="text-[10px] text-gray-500 font-mono shrink-0">{video.views}</span>
              </div>
            </div>
          </div>
        ))}

        {categoryVideos.length === 0 && (
          <div className="col-span-full h-48 flex flex-col items-center justify-center border border-white/5 rounded-2xl p-6 text-center">
            <Icon className="w-8 h-8 text-gray-600 mb-2" />
            <p className="text-xs text-gray-400">No active videos in this category right now. Use the Search to locate channels.</p>
          </div>
        )}
      </div>
    </div>
  );
}
