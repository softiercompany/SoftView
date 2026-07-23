export interface Video {
  id: string;
  title: string;
  description: string;
  category: 'discover' | 'ai-picks' | 'learn' | 'gaming' | 'technology' | 'cinema' | 'live';
  coverUrl: string;
  duration: string; // e.g., "19:45"
  views: string; // e.g., "852K views"
  uploadDate: string; // e.g., "2 days ago"
  creator: string;
  creatorVerified: boolean;
  progress?: number; // percentage completed, e.g., 42
  isLive?: boolean;
  videoUrl?: string; // custom/youtube URL
  comments?: Comment[];
  matchPercentage?: number;
}

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  likes: number;
  timestamp: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface LearningStep {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  coverUrl: string;
  completed: boolean;
  quiz?: QuizQuestion;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  xpReward: number;
  steps: LearningStep[];
}

export interface UserProfile {
  name: string;
  level: number;
  xp: number;
  xpNextLevel: number;
  avatarUrl: string;
  isPremium: boolean;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  subscribers: string;
  category: string;
  verified: boolean;
  bio: string;
  isSubscribed?: boolean;
}

export interface AIPickResult {
  title: string;
  creator: string;
  duration: string;
  description: string;
  coverPrompt: string; // text description for UI
  videoScript: string[]; // sentences to "play"
}
