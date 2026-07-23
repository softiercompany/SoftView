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

# Supabase Credentials
VITE_SUPABASE_URL="https://your-supabase-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_URL="https://your-supabase-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Gemini AI API Key
GEMINI_API_KEY="your-gemini-api-key"
```

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
