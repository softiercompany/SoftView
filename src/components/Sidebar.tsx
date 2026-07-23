import { Home, Compass, Sparkles, BookOpen, Gamepad2, Cpu, Clapperboard, Radio, Library, Route, Settings, Crown } from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  onOpenPremium: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, user, onOpenPremium }: SidebarProps) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'ai-picks', label: 'AI Picks', icon: Sparkles, glow: true },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
    { id: 'technology', label: 'Technology', icon: Cpu },
    { id: 'cinema', label: 'Cinema', icon: Clapperboard },
    { id: 'live', label: 'Live', icon: Radio, pulse: true },
    { id: 'library', label: 'My Library', icon: Library },
    { id: 'journey', label: 'Watch Journey', icon: Route },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const xpPercent = Math.min(100, Math.max(0, (user.xp / user.xpNextLevel) * 100));

  return (
    <aside id="sidebar-container" className="w-64 shrink-0 bg-[#070610] border-r border-[#1a163a]/50 h-screen flex flex-col justify-between overflow-y-auto select-none">
      {/* Brand Logo Section */}
      <div id="brand-logo-section" className="p-6 pb-2 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-950/40">
          <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span className="text-xl font-bold tracking-tight text-white flex items-center">
          Soft<span className="text-purple-400">View</span>
        </span>
      </div>

      {/* Navigation List */}
      <nav id="sidebar-nav" className="px-4 py-3 flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              id={`sidebar-item-${item.id}`}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group text-left ${
                isActive
                  ? 'bg-gradient-to-r from-purple-900/40 via-indigo-950/30 to-transparent border-l-4 border-purple-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? 'text-purple-400' : 'text-gray-400 group-hover:text-purple-300'
                }`} />
                {item.pulse && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-black animate-ping" />
                )}
                {item.pulse && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-black" />
                )}
              </div>
              <span className="flex-1">{item.label}</span>
              {item.glow && (
                <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-md font-semibold font-sans">
                  AI
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Upgrade Banner & User Profile */}
      <div id="sidebar-footer-container" className="p-4 space-y-4">
        {/* SoftView Premium Banner */}
        <div id="premium-banner" className="bg-gradient-to-br from-[#1b1544] to-[#0c0921] border border-purple-900/40 rounded-2xl p-4 relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex gap-2.5 items-start mb-2">
            <div className="p-1.5 bg-amber-500/15 border border-amber-500/20 rounded-lg text-amber-400">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-wide">
                {user.isPremium ? 'SoftView Premium' : 'Upgrade to'}
              </h4>
              <p className="text-[10px] text-purple-300 font-medium">
                {user.isPremium ? 'Active Member' : 'SoftView Premium'}
              </p>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 leading-normal mb-3">
            {user.isPremium 
              ? 'Thank you for supporting us! You have unlocked all premium AI features and double XP boosters.'
              : 'Ad-free, AI features, offline downloads and more.'}
          </p>

          {!user.isPremium && (
            <button
              id="go-premium-sidebar-btn"
              onClick={onOpenPremium}
              className="w-full py-2 px-3 text-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.98] text-white text-[11px] font-bold rounded-xl transition-all shadow-md shadow-purple-950/30"
            >
              Go Premium
            </button>
          )}
        </div>

        {/* User Profile Info Card */}
        <div id="user-profile-sidebar-card" className="flex items-center gap-3 p-2 bg-white/5 border border-white/5 rounded-2xl">
          <div className="relative shrink-0">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className={`w-10 h-10 rounded-xl object-cover border-2 ${
                user.isPremium ? 'border-amber-400 shadow-sm shadow-amber-500/20' : 'border-purple-500/50'
              }`}
            />
            {user.isPremium && (
              <span className="absolute -bottom-1 -right-1 bg-amber-400 p-0.5 rounded-full border border-[#0d0a21]">
                <Crown className="w-2.5 h-2.5 text-black" />
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-white truncate max-w-[100px]">{user.name}</span>
              {user.isPremium && <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
            </div>
            <div className="flex items-center justify-between mt-0.5 text-[10px] text-gray-400">
              <span>Level {user.level}</span>
              <span>{user.xp}/{user.xpNextLevel} XP</span>
            </div>
            {/* Custom Progress Bar matching screenshot */}
            <div className="w-full bg-[#1c183b] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
