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

## 🗄️ Supabase Database Setup (100% Full Platform Configuration)

The repository includes a complete, production-grade Supabase configuration script in **[`supabase.sql`](./supabase.sql)**.

To set up Supabase in 1 step:
1. Open your **[Supabase Dashboard SQL Editor](https://supabase.com/dashboard/project/_/sql/new)**.
2. Copy and paste the entire contents of **`supabase.sql`**.
3. Click **Run**.

This will automatically create all tables (`users`, `user_profiles`, `videos`, `watch_history`, `saved_videos`, `learning_paths`, `ai_picks`), create RLS policies, set up storage buckets, and configure the automated Supabase Auth trigger function (`auth.users` -> `public.users` sync).

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
