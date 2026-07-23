import React, { useState } from 'react';
import { Bell, Search, Award, Star, UserCheck, LogIn, LogOut, ChevronDown } from 'lucide-react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  user: UserProfile;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: string) => void;
  onOpenPremium: () => void;
  onSignOut?: () => void;
}

export default function Header({ user, searchQuery, setSearchQuery, setActiveTab, onOpenPremium, onSignOut }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, title: '🔥 Level Up Unlocked!', text: `You reached Level ${user.level}! Keep watching to earn more certificates.`, time: '5m ago', unread: true },
    { id: 2, title: '🤖 New AI Picks available', text: 'SoftAI generated a new set of personalized coding & tech videos.', time: '2h ago', unread: true },
    { id: 3, title: '🎥 CodeLab is live!', text: '"DevOps Live Q&A Session" is currently broadcasting.', time: '3h ago', unread: false }
  ];

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setActiveTab('discover');
    }
  };

  return (
    <header id="app-header" className="h-16 shrink-0 bg-[#070610] border-b border-[#1a163a]/50 px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Search Input Bar */}
      <div id="header-search-bar" className="w-96 relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          id="search-input-field"
          type="text"
          placeholder="Search videos, guides, learning paths..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyPress}
          className="w-full bg-[#110e28] hover:bg-[#151133] focus:bg-[#19153d] border border-[#2a245a]/50 focus:border-[#4d40bc] text-white text-sm pl-11 pr-4 py-2 rounded-xl outline-none placeholder-gray-500 transition-all font-sans"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Right Action Icons */}
      <div id="header-actions" className="flex items-center gap-4">
        {/* Experience Multiplier Banner (Conditional) */}
        <div id="xp-multiplier" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
          <Award className="w-3.5 h-3.5 text-purple-400" />
          <span>{user.isPremium ? '2x XP Boost Active' : '1x XP Normal'}</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            id="notification-bell-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 text-gray-300 hover:text-white bg-[#110e28] hover:bg-[#1a163a] rounded-xl transition-all relative border border-[#221c4a]/40"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-purple-500 rounded-full border border-[#070610]" />
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                id="notifications-dropdown"
                className="absolute right-0 mt-3 w-80 bg-[#0d0b1e] border border-[#2a245a]/80 rounded-2xl shadow-2xl p-4 text-white z-50"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#221c4a]/80 mb-3">
                  <span className="font-bold text-sm">Notifications</span>
                  <button className="text-[10px] text-purple-400 hover:text-purple-300">Mark all read</button>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-2.5 rounded-xl text-left transition-colors ${n.unread ? 'bg-[#1b1542]/40 border border-purple-500/15' : 'hover:bg-white/5'}`}>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-gray-100">{n.title}</h4>
                        <span className="text-[9px] text-gray-500 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">{n.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            id="user-profile-menu-btn"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 pr-2.5 bg-[#110e28] hover:bg-[#1a163a] border border-[#221c4a]/40 rounded-xl transition-all"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className={`w-7 h-7 rounded-lg object-cover ${user.isPremium ? 'border border-amber-400' : 'border border-purple-500/40'}`}
            />
            <span className="text-xs font-semibold text-gray-200 hidden sm:inline">{user.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          </button>

          {/* Profile Quick Stats Dropdown */}
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                id="profile-dropdown"
                className="absolute right-0 mt-3 w-64 bg-[#0d0b1e] border border-[#2a245a]/80 rounded-2xl shadow-2xl p-4 text-white z-50 text-left"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-[#221c4a]/80 mb-3">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-1">
                      {user.name}
                      {user.isPremium && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />}
                    </h4>
                    <p className="text-xs text-gray-400">Level {user.level} Voyager</p>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center text-xs bg-white/5 p-2 rounded-lg">
                    <span className="text-gray-400">XP Progress:</span>
                    <span className="text-white font-semibold">{user.xp} / {user.xpNextLevel}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs bg-white/5 p-2 rounded-lg">
                    <span className="text-gray-400">Premium Status:</span>
                    <span className={user.isPremium ? 'text-amber-400 font-semibold flex items-center gap-0.5' : 'text-gray-400 font-medium'}>
                      {user.isPremium ? 'Premium Active' : 'Basic Tier'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left py-2 px-3 hover:bg-white/5 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Manage Profile Settings
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('journey');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left py-2 px-3 hover:bg-white/5 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    View Watch Journey
                  </button>
                  {onSignOut && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onSignOut();
                      }}
                      className="w-full text-left py-2 px-3 hover:bg-red-500/10 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 transition-colors flex items-center justify-between"
                    >
                      <span>Sign Out</span>
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {!user.isPremium && (
                    <button
                      onClick={() => {
                        onOpenPremium();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-center mt-2 py-2 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-xs font-bold text-white transition-all shadow-md"
                    >
                      Upgrade Plan
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
