import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Video, LearningPath, UserProfile, Comment } from '../types';

// Read Supabase credentials from client-side or server-side environment variables
const env = (import.meta as any).env || process.env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key')) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseClient() !== null;
}

export function getSupabaseConfigDetails() {
  return {
    configured: isSupabaseConfigured(),
    url: supabaseUrl ? (supabaseUrl.length > 25 ? `${supabaseUrl.substring(0, 22)}...` : supabaseUrl) : 'Not set',
    hasAnonKey: Boolean(supabaseAnonKey && !supabaseAnonKey.includes('your-anon-key'))
  };
}

// Custom OAuth Flow Helpers (Start and finish strictly on application domain)
export async function startCustomGoogleAuth() {
  try {
    const res = await fetch('/api/auth/google?mode=json');
    const data = await res.json();
    if (data.url) {
      return { url: data.url, error: null };
    }
    return { url: '/api/auth/google', error: null };
  } catch (err: any) {
    return { url: '/api/auth/google', error: null };
  }
}

export async function startCustomGithubAuth() {
  try {
    const res = await fetch('/api/auth/github?mode=json');
    const data = await res.json();
    if (data.url) {
      return { url: data.url, error: null };
    }
    return { url: '/api/auth/github', error: null };
  } catch (err: any) {
    return { url: '/api/auth/github', error: null };
  }
}

export async function startCustomDiscordAuth() {
  try {
    const res = await fetch('/api/auth/discord?mode=json');
    const data = await res.json();
    if (data.url) {
      return { url: data.url, error: null };
    }
    return { url: '/api/auth/discord', error: null };
  } catch (err: any) {
    return { url: '/api/auth/discord', error: null };
  }
}

// Sign out function for Supabase
export async function signOutSupabase() {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.auth.signOut();
  } catch (err) {
    console.warn('Supabase signout warning:', err);
  }
}

// SQL DDL Schema string for user copy-pasting into Supabase SQL Editor
export const SUPABASE_SQL_SCHEMA = `-- SoftView Supabase Database Schema
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create User Profiles Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id TEXT PRIMARY KEY DEFAULT 'default-user',
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'Aslbek',
  level INT DEFAULT 12,
  xp INT DEFAULT 620,
  xp_next_level INT DEFAULT 1000,
  avatar_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Videos Table
CREATE TABLE IF NOT EXISTS public.videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'discover',
  cover_url TEXT,
  duration TEXT DEFAULT '10:00',
  views TEXT DEFAULT '0 views',
  upload_date TEXT DEFAULT 'Just now',
  creator TEXT DEFAULT 'Anonymous',
  creator_verified BOOLEAN DEFAULT false,
  progress INT DEFAULT 0,
  is_live BOOLEAN DEFAULT false,
  video_url TEXT,
  comments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Watch History Table
CREATE TABLE IF NOT EXISTS public.watch_history (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT DEFAULT 'default-user',
  video_id TEXT REFERENCES public.videos(id) ON DELETE CASCADE,
  watched_at TIMESTAMPTZ DEFAULT NOW(),
  progress_seconds INT DEFAULT 0
);

-- 5. Create Saved/Liked Videos Table
CREATE TABLE IF NOT EXISTS public.saved_videos (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT DEFAULT 'default-user',
  video_id TEXT REFERENCES public.videos(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Learning Paths Table
CREATE TABLE IF NOT EXISTS public.learning_paths (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  xp_reward INT DEFAULT 100,
  steps JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all on users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow public all on user_profiles" ON public.user_profiles FOR ALL USING (true);
CREATE POLICY "Allow public read access on videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Allow public insert on videos" ON public.videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on videos" ON public.videos FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on videos" ON public.videos FOR DELETE USING (true);
CREATE POLICY "Allow public all on watch_history" ON public.watch_history FOR ALL USING (true);
CREATE POLICY "Allow public all on saved_videos" ON public.saved_videos FOR ALL USING (true);
CREATE POLICY "Allow public all on learning_paths" ON public.learning_paths FOR ALL USING (true);
`;

// Fetch all videos from Supabase
export async function fetchSupabaseVideos(): Promise<Video[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      if (error?.code === 'PGRST301' || error?.message?.includes('schema cache') || error?.message?.includes('does not exist') || error?.message?.includes('404')) {
        console.warn('Supabase Notice: Table "public.videos" not found in Supabase database. Please run the SQL migration script provided in README.md or Settings to create the tables.');
      } else {
        console.warn('Supabase fetch videos error:', error?.message);
      }
      return [];
    }

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      category: item.category || 'discover',
      coverUrl: item.cover_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop',
      duration: item.duration || '10:00',
      views: item.views || '0 views',
      uploadDate: item.upload_date || 'Recently',
      creator: item.creator || 'User',
      creatorVerified: item.creator_verified ?? false,
      progress: item.progress || 0,
      isLive: item.is_live ?? false,
      videoUrl: item.video_url || 'https://www.youtube.com/embed/5g19-0r_TJI',
      comments: item.comments || []
    }));
  } catch (err) {
    console.error('Error fetching from Supabase:', err);
    return [];
  }
}

// Insert video to Supabase
export async function insertSupabaseVideo(video: Video): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('videos').insert([{
      id: video.id || `vid-${Date.now()}`,
      title: video.title,
      description: video.description,
      category: video.category,
      cover_url: video.coverUrl,
      duration: video.duration,
      views: video.views,
      upload_date: video.uploadDate,
      creator: video.creator,
      creator_verified: video.creatorVerified,
      progress: video.progress || 0,
      is_live: video.isLive || false,
      video_url: video.videoUrl,
      comments: video.comments || []
    }]);

    if (error) {
      console.error('Supabase insert video error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error inserting video to Supabase:', err);
    return false;
  }
}

// Delete video from Supabase
export async function deleteSupabaseVideo(videoId: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('videos').delete().eq('id', videoId);
    if (error) {
      console.error('Supabase delete video error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error deleting video from Supabase:', err);
    return false;
  }
}

// Fetch learning paths from Supabase
export async function fetchSupabaseLearningPaths(): Promise<LearningPath[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('learning_paths')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      if (error?.code === 'PGRST301' || error?.message?.includes('schema cache') || error?.message?.includes('does not exist') || error?.message?.includes('404')) {
        console.warn('Supabase Notice: Table "public.learning_paths" not found in Supabase database. Run SQL migration script to enable learning paths database sync.');
      }
      return [];
    }

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      category: item.category || 'General',
      xpReward: item.xp_reward || 100,
      steps: item.steps || []
    }));
  } catch (err) {
    return [];
  }
}

// Insert learning path
export async function insertSupabaseLearningPath(path: LearningPath): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('learning_paths').insert([{
      id: path.id || `path-${Date.now()}`,
      title: path.title,
      description: path.description,
      category: path.category,
      xp_reward: path.xpReward,
      steps: path.steps || []
    }]);

    return !error;
  } catch (err) {
    return false;
  }
}

// Save user profile
export async function saveSupabaseUserProfile(user: UserProfile): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('user_profiles').upsert({
      id: 'default-user',
      name: user.name,
      level: user.level,
      xp: user.xp,
      xp_next_level: user.xpNextLevel,
      avatar_url: user.avatarUrl,
      is_premium: user.isPremium,
      updated_at: new Date().toISOString()
    });

    return !error;
  } catch (err) {
    return false;
  }
}

// Save complete user record to Supabase public.users and public.user_profiles tables
export async function saveSupabaseUserRecord(userData: {
  id?: string;
  email: string;
  name: string;
  username?: string;
  avatarUrl?: string;
  provider?: string;
}): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const userId = userData.id || `usr_${userData.provider || 'auth'}_${Date.now()}`;
    const { error: userErr } = await client.from('users').upsert({
      id: userId,
      email: userData.email,
      name: userData.name,
      avatar_url: userData.avatarUrl,
      role: 'user',
      created_at: new Date().toISOString()
    }, { onConflict: 'email' });

    const { error: profileErr } = await client.from('user_profiles').upsert({
      id: userId,
      user_id: userId,
      name: userData.name,
      avatar_url: userData.avatarUrl,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

    return !userErr && !profileErr;
  } catch (err) {
    console.warn('Notice saving user to Supabase:', err);
    return false;
  }
}

// Send email auth link (OTP/magic link) via Supabase Auth and save user record
export async function sendSupabaseAuthLink(email: string, fullName?: string) {
  const client = getSupabaseClient();
  const name = fullName || email.split('@')[0];

  // Sync user record to both databases first
  await syncUserToBothDatabases({
    email,
    name,
    provider: 'email'
  });

  if (client) {
    try {
      const redirectUrl = `${window.location.origin}/?auth_success=true&user_provider=email&user_email=${encodeURIComponent(email)}&user_name=${encodeURIComponent(name)}`;
      const { error } = await client.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: name,
            name
          }
        }
      });
      if (error) {
        console.warn('Supabase magic link message:', error.message);
      } else {
        console.log(`Supabase auth link sent to ${email}`);
      }
    } catch (err) {
      console.warn('Supabase auth link exception:', err);
    }
  }
}

// Universal function to sync user into both Server Database and Supabase Database
export async function syncUserToBothDatabases(userData: {
  id?: string;
  email: string;
  name: string;
  username?: string;
  avatarUrl?: string;
  provider?: string;
}) {
  // 1. Sync to Server DB
  try {
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
  } catch (err) {
    console.warn('Failed to sync user to server DB:', err);
  }

  // 2. Sync to Supabase DB
  if (isSupabaseConfigured()) {
    await saveSupabaseUserRecord(userData);
  }
}

