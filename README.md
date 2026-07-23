# SoftView Platform

SoftView is a modern, interactive video streaming and learning platform built with React, Express, TypeScript, and Supabase.

## 🚀 Features

- **Interactive Video Hubs**: Home, Gaming, Technology, Cinema, Live Streams, and Discovery.
- **Custom Google OAuth Flow**: Complete authentication flow handled directly on your own domain without external provider redirects.
- **Supabase Integration**: Data persistence for video catalog, learning journeys, and user profiles.
- **Gemini AI Picks**: Personalized recommendations and interactive chat tools.
- **Gamified Progress**: Level up, earn XP, and unlock learning badges as you watch content.

## 🛠️ Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Google OAuth Configuration (Custom Flow)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="https://softview.vercel.app/api/auth/google/callback" # Or your current development/production URL

# Supabase Credentials
VITE_SUPABASE_URL="https://your-supabase-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_URL="https://your-supabase-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Gemini AI API Key
GEMINI_API_KEY="your-gemini-api-key"
```

### 🏷️ Changing Google Sign-In Panel Title to "SoftView"

To display **"Continue to SoftView"** instead of the domain name (**"Continue to softview.vercel.app"**) on Google's login popup:
1. Open [Google Cloud Console - OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent).
2. Click **Edit App** (or configure branding).
3. Under **App name**, enter: `SoftView`
4. Under **User support email**, select `softiercompany@gmail.com` (or your admin email).
5. (Optional) Upload `public/softview_logo.png` as the **App logo**.
6. Save and submit the changes. Google will now display **"Continue to SoftView"** on the sign-in screen.

### 🌐 Google OAuth Authorized Domain & Legal URLs Configuration

In Google Cloud Console under **OAuth consent screen > Branding / App Info**, fill in the following required fields:

- **App domain (Authorized Domain)**:
  `vercel.app` (or `softview.vercel.app`)

- **Application home page**:
  `https://softview.vercel.app`

- **Application privacy policy link**:
  `https://softview.vercel.app/privacy`

- **Application terms of service link**:
  `https://softview.vercel.app/terms`

- **Developer contact information**:
  `softiercompany@gmail.com`

### 🔑 Fixing Google OAuth `redirect_uri_mismatch` Error

To fix the `400: redirect_uri_mismatch` error in Google OAuth:
1. Open [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Select your Web Application OAuth 2.0 Client ID.
3. Under **Authorized redirect URIs**, click **ADD URI** and add:
   - `https://softview.vercel.app/api/auth/google/callback`
   - `https://ais-dev-acfn73brvntt6gswmsnwhd-676297479340.asia-southeast1.run.app/api/auth/google/callback` (or your current active domain)
4. Under **Authorized JavaScript origins**, add:
   - `https://softview.vercel.app`
   - `https://ais-dev-acfn73brvntt6gswmsnwhd-676297479340.asia-southeast1.run.app`
5. Save changes. Note that Google OAuth changes may take 1-5 minutes to propagate.

## 🗄️ Supabase Database Setup (Resolving 404 Missing Table Errors)

If you see `404 (Not Found)` or `Could not find the table 'public.videos'` in your browser console, it means your Supabase project database needs the initial table schema.

Execute the following SQL in your **[Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql)**:

```sql
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

-- 5. Create Saved Videos Table
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

-- Enable RLS Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all on users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow public all on user_profiles" ON public.user_profiles FOR ALL USING (true);
CREATE POLICY "Allow public read on videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Allow public insert on videos" ON public.videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on videos" ON public.videos FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on videos" ON public.videos FOR DELETE USING (true);
CREATE POLICY "Allow public all on watch_history" ON public.watch_history FOR ALL USING (true);
CREATE POLICY "Allow public all on saved_videos" ON public.saved_videos FOR ALL USING (true);
CREATE POLICY "Allow public all on learning_paths" ON public.learning_paths FOR ALL USING (true);
```

## ⏰ GitHub Actions Scheduled Crons (Trends & Streaks Reload)

A GitHub Actions workflow is located at `.github/workflows/cron-trends-streaks.yml`.

It automatically runs every day (at `00:00` and `12:00` UTC) or can be triggered manually via **Workflow Dispatch**.

### Endpoints
- `/api/cron/reload-trends` — Recalculates trending video positions and increases daily view metrics.
- `/api/cron/update-streaks` — Calculates user active learning streaks and updates daily streak badges.
- `/api/cron/daily-sync` — Runs both trends reload and streak updates in a single execution.

### Setup in GitHub
1. In your GitHub repository, navigate to **Settings > Secrets and variables > Actions**.
2. Add the following repository secrets:
   - `APP_URL`: Your deployed platform domain (e.g., `https://softview.vercel.app`).
   - `CRON_SECRET`: (Optional) Secret passphrase matching `CRON_SECRET` in your `.env`.

## 🎨 Branding & Custom Assets

Place your custom logo and favicon inside the `public/` folder:

- `/public/softview_logo.png` — Main platform logo displayed in sidebar and landing page.
- `/public/softview_favicon.png` — Browser tab icon.

The application automatically uses these assets and includes graceful fallback branding if missing.

## 📦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

## 📜 License

MIT License.
