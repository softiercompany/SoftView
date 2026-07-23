import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header for telemetry.
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini SDK successfully initialized.");
  } catch (err) {
    console.error("Failed to initialize Gemini SDK:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found. Server will run with high-fidelity local fallback simulation.");
}

// AI Picks API Endpoint
app.post("/api/ai-picks", async (req, res) => {
  const { prompt, mood } = req.body;
  const userPrompt = prompt || "Interesting topics in technology and cinema";
  const userMood = mood || "Curious";

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Generate 3 highly interesting, creative video recommendations based on the user prompt: "${userPrompt}" and user mood: "${userMood}". 
For each video, provide:
1. Title (catchy, premium, like a trending video)
2. Creator (inventive name)
3. Duration (format MM:SS, e.g., "14:22")
4. Compelling description
5. Cover prompt / search keywords (3 words separated by commas, e.g., "space,nebula,galaxy", to find matching imagery)
6. A video script/transcript as an array of 5 distinct sentences that represent the video narrations for a mock player.`,
        config: {
          systemInstruction: "You are the advanced video synthesis AI for SoftCast, a YouTube-like premium streaming site. You generate engaging, premium-quality video metadata and step-by-step narrative scripts.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            description: "A list of custom recommended video picks",
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "A catchy, interesting video title" },
                creator: { type: Type.STRING, description: "A creative name of the creator" },
                duration: { type: Type.STRING, description: "Format MM:SS (e.g. 15:30)" },
                description: { type: Type.STRING, description: "A brief, compelling description of the video" },
                coverPrompt: { type: Type.STRING, description: "3 search keywords separated by commas to load a scenic image (e.g., 'cyberpunk,city,neon')" },
                videoScript: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "A sequence of 5 sentences making up the script/transcript of the video for simulated voiceover playback"
                }
              },
              required: ["title", "creator", "duration", "description", "coverPrompt", "videoScript"]
            }
          }
        }
      });

      const responseText = response.text;
      if (responseText) {
        const data = JSON.parse(responseText.trim());
        return res.json({ success: true, source: 'gemini', data });
      }
    } catch (error: any) {
      console.error("Error communicating with Gemini API:", error);
      // Fall through to simulated fallback on error
    }
  }

  // High-fidelity local simulation fallback (or used when GEMINI_API_KEY is not configured)
  const simulatedPicks = [
    {
      title: `Exploring the Depth of "${userPrompt}"`,
      creator: `AI Curator - ${userMood} Edition`,
      duration: "14:25",
      description: `A customized documentary exploring the nuances of ${userPrompt} designed specifically for your ${userMood.toLowerCase()} state of mind.`,
      coverPrompt: "abstract,intelligence,digital",
      videoScript: [
        `Welcome to this special custom broadcast, synthesized specifically for your mood today.`,
        `When we look at ${userPrompt}, we discover a deep intersection of technology and human curiosity.`,
        `Many pioneers have struggled to define how this paradigm shifts our day-to-day experience.`,
        `But by focusing on incremental growth and aesthetic design, a clear pattern starts to emerge.`,
        `Thank you for watching this synthesized journey. Stay curious, and keep exploring.`
      ]
    },
    {
      title: `The Future of ${userPrompt.split(' ').slice(0, 3).join(' ') || 'Tomorrow'}`,
      creator: `TechVanguard`,
      duration: "18:10",
      description: `How future shifts in global infrastructure and AI research will change the way we interact with ${userPrompt}.`,
      coverPrompt: "technology,futuristic,neon",
      videoScript: [
        `The world is accelerating at a pace never seen before in human history.`,
        `By leveraging next-generation neural nodes, we can synthesize information seamlessly.`,
        `Imagine a reality where your tools understand your exact context and requirements before you even express them.`,
        `This is not science fiction; it is the immediate horizon of full-stack design.`,
        `As we close this chapter, ask yourself: how will you build the next interface?`
      ]
    },
    {
      title: `A Beginner's Guide to Cognitive Flow`,
      creator: `MindLab Companion`,
      duration: "11:50",
      description: `A peaceful exploration combining the elements of focus, modern design, and ${userMood.toLowerCase()} mindfulness practice.`,
      coverPrompt: "serene,nature,mindfulness",
      videoScript: [
        `In an era of endless notifications, finding quiet focus is a revolutionary act.`,
        `Take a slow, deep breath, and let the background noise of the day fade away completely.`,
        `Neurologists have found that even ten minutes of singular concentration resets our mental fatigue.`,
        `By designing high-contrast, beautiful spaces, we support our brain's natural desire for harmony.`,
        `Thank you for taking this mindful breathing break with us on SoftCast.`
      ]
    }
  ];

  res.json({ success: true, source: 'simulation', data: simulatedPicks });
});

// AI Learn Endpoint for Mentor Chat, Roadmap Generation, and Quiz Generation
app.post("/api/ai-learn", async (req, res) => {
  const { type, prompt, goal, topic, level } = req.body;

  if (ai) {
    try {
      if (type === 'mentor_chat') {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `User message to AI Learning Mentor: "${prompt}". Goal/Context: "${goal || 'General Skill Growth'}". Provide an encouraging, insightful, structured response advising the student on what to learn next, step-by-step practice, and career tips.`
        });
        return res.json({ success: true, source: 'gemini', reply: response.text });
      }

      if (type === 'roadmap_generator') {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Create a comprehensive multi-step career learning roadmap for goal: "${goal || prompt}". Include 6 logical learning steps from beginner to advanced.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                estimatedMonths: { type: Type.NUMBER },
                steps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      duration: { type: Type.STRING },
                      skillsCovered: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["title", "description", "duration", "skillsCovered"]
                  }
                }
              },
              required: ["title", "description", "estimatedMonths", "steps"]
            }
          }
        });
        const data = JSON.parse(response.text || '{}');
        return res.json({ success: true, source: 'gemini', data });
      }

      if (type === 'quiz_generator') {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Generate a 3-question quiz for topic: "${topic || 'Web Development'}", level: "${level || 'Intermediate'}".`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.NUMBER },
                  explanation: { type: Type.STRING }
                },
                required: ["question", "options", "correctIndex", "explanation"]
              }
            }
          }
        });
        const data = JSON.parse(response.text || '[]');
        return res.json({ success: true, source: 'gemini', data });
      }
    } catch (err) {
      console.error("AI Learn API error:", err);
    }
  }

  // Local fallback simulation
  if (type === 'mentor_chat') {
    return res.json({
      success: true,
      source: 'simulation',
      reply: `Ajoyib maqsad! "${goal || prompt}" bo'yicha rivojlanish uchun SoftCast AI sizga quyidagi 3 ta bosqichni tavsiya qiladi:\n\n1. 🎯 Asosiy bilimlarni mustahkamlash (1-2 oy): Fundamental sintaksis va loyihalar tayyorlash.\n2. 🚀 Amaliy loyihalar (3-4 oy): Portfolio uchun 2 ta real-time web dastur tuzish.\n3. 🏆 Advanced daraja va Sertifikatlash (5-6 oy): System Architecture hamda SoftCast Sertifikat imtihoni.\n\nHar kuni kamida 30 daqiqa video ko'rib, streak'ingizni saqlang!`
    });
  }

  if (type === 'roadmap_generator') {
    return res.json({
      success: true,
      source: 'simulation',
      data: {
        title: goal || "AI Synthesized Full Stack Mastery",
        description: "Custom AI-generated month-by-month career roadmap tailored to your specific goal.",
        estimatedMonths: 6,
        steps: [
          { title: "Month 1: HTML, CSS & Modern Layouts", description: "Flexbox, Grid, CSS Variables and Responsive Mobile First UI design.", duration: "4 weeks", skillsCovered: ["HTML5", "CSS3", "Tailwind CSS"] },
          { title: "Month 2: Modern JavaScript (ES6+)", description: "Async/Await, Promises, Closures, DOM manipulation and ES Modules.", duration: "4 weeks", skillsCovered: ["JavaScript", "DOM", "Async/Await"] },
          { title: "Month 3: React 18 & State Management", description: "Hooks, Context API, Vite, Component lifecycle and performance optimization.", duration: "4 weeks", skillsCovered: ["React", "TypeScript", "Vite"] },
          { title: "Month 4: Backend Node.js & Express APIs", description: "RESTful endpoints, middleware, authentication tokens and file uploads.", duration: "4 weeks", skillsCovered: ["Node.js", "Express", "REST APIs"] },
          { title: "Month 5: Firestore & Relational Databases", description: "Schema modeling, indexes, query optimization and persistent state.", duration: "4 weeks", skillsCovered: ["Firestore", "SQL", "Database Design"] },
          { title: "Month 6: Deployment, CI/CD & Portfolio", description: "Containerization, Cloud Run, Git workflows and final certification test.", duration: "4 weeks", skillsCovered: ["Cloud Run", "Git", "Docker"] }
        ]
      }
    });
  }

  if (type === 'quiz_generator') {
    return res.json({
      success: true,
      source: 'simulation',
      data: [
        {
          question: `What is the primary benefit of using React hooks like useEffect or useState?`,
          options: [
            "To manage component lifecycle and reactive state without writing class components",
            "To connect directly to SQL databases without backend APIs",
            "To replace CSS stylesheets with inline HTML attributes",
            "To force synchronous browser page reloads"
          ],
          correctIndex: 0,
          explanation: "Hooks allow functional components to maintain local state and side effects cleanly."
        },
        {
          question: `How do async/await functions behave in modern JavaScript?`,
          options: [
            "They freeze the entire browser tab until execution finishes",
            "They allow asynchronous code to be written in a readable, sequential synchronous style using Promises",
            "They convert JavaScript code into C++ machine binaries",
            "They automatically encrypt all HTTP request bodies"
          ],
          correctIndex: 1,
          explanation: "Async/await provides cleaner syntax over promise chains while preserving non-blocking event loops."
        }
      ]
    });
  }

  res.json({ success: false, message: "Invalid type requested" });
});

// AI Gaming Endpoint for AI Game Coach, Rank Roadmap, and Gaming Search
app.post("/api/ai-gaming", async (req, res) => {
  const { type, prompt, game, rankTarget, query } = req.body;

  if (ai) {
    try {
      if (type === 'coach_chat') {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `User message to SoftCast AI Game Coach: "${prompt}". Active game context: "${game || 'VALORANT / Competitive FPS'}". Provide high-rank tactical advice, crosshair placement routines, sensitivity formulas, mental reset tips, or agent build strategies.`
        });
        return res.json({ success: true, source: 'gemini', reply: response.text });
      }

      if (type === 'rank_roadmap') {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Create a step-by-step gaming rank progression roadmap for game: "${game || 'VALORANT'}", aiming for target rank: "${rankTarget || 'Immortal / Radiant'}". Provide 5 structured training phases (Aim, Crosshair Placement, Utility Usage, Map Communication, Clutch Mindset).`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                game: { type: Type.STRING },
                targetRank: { type: Type.STRING },
                estimatedDays: { type: Type.NUMBER },
                phases: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      phaseName: { type: Type.STRING },
                      focusArea: { type: Type.STRING },
                      dailyRoutine: { type: Type.STRING },
                      keyMetrics: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["phaseName", "focusArea", "dailyRoutine", "keyMetrics"]
                  }
                }
              },
              required: ["title", "game", "targetRank", "estimatedDays", "phases"]
            }
          }
        });
        const data = JSON.parse(response.text || '{}');
        return res.json({ success: true, source: 'gemini', data });
      }
    } catch (err) {
      console.error("AI Gaming API error:", err);
    }
  }

  // Local fallback simulation
  if (type === 'coach_chat') {
    return res.json({
      success: true,
      source: 'simulation',
      reply: `🎮 **SoftCast AI Game Coach Analysis**:

1. **Aim & Target Locks** (Target: 20 min/day):
   • AimLab/Kovaaks: Micro-flex 100 reps + Deathmatch with Vandal only (no spraying, headshots only).

2. **Crosshair Placement & Angle Isolation**:
   • Hold angles at natural head level. Slice the pie when peeking corners rather than wide-swinging blind.

3. **Clutch Mindset & Economy**:
   • Save utility for retakes. Never re-peek the same angle when low on HP!`
    });
  }

  if (type === 'rank_roadmap') {
    return res.json({
      success: true,
      source: 'simulation',
      data: {
        title: `${game || 'VALORANT'} Rank Advancement Roadmap`,
        game: game || 'VALORANT',
        targetRank: rankTarget || 'Radiant / Ascendant',
        estimatedDays: 60,
        phases: [
          { phaseName: "Phase 1: Aim & Crosshair Calibration", focusArea: "Headshot Accuracy & Recoil Control", dailyRoutine: "15m AimLab gridshot + 2 Deathmatches holding head-height angles.", keyMetrics: ["HS Rate > 28%", "First Bullet Accuracy"] },
          { phaseName: "Phase 2: Agent Utility Synergy", focusArea: "Flash, Smoke, and Recon timing", dailyRoutine: "Practice lineup flash angles on Ascent & Haven in custom lobby.", keyMetrics: ["Assist Conversion > 40%", "Utility Damage"] },
          { phaseName: "Phase 3: Map Economy & Comm Protocols", focusArea: "Callouts, ICL shotcalling & Eco-rounds", dailyRoutine: "Call out enemy positions within 1.5 seconds of contact.", keyMetrics: ["Win Rate on Eco Rounds", "Clutch Conversion"] },
          { phaseName: "Phase 4: High-Rank VOD Review", focusArea: "Analyzing Deaths & Mistakes", dailyRoutine: "Record 1 match per day, re-watch death timestamps, write down 2 corrections.", keyMetrics: ["KD Ratio > 1.25", "Climbing Rank Rating"] }
        ]
      }
    });
  }

  res.json({ success: false, message: "Invalid type requested" });
});

// AI Tech Endpoint for AI Tech Assistant, Explainer, and Product Reviews
app.post("/api/ai-tech", async (req, res) => {
  const { type, prompt, topic, product } = req.body;

  if (ai) {
    try {
      if (type === 'tech_assistant') {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `User message to SoftCast AI Tech Expert: "${prompt}". Topic context: "${topic || 'General Technology & Hardware'}". Provide clear, expert technical explanations, architectural insights, pros & cons, or code/system tips.`
        });
        return res.json({ success: true, source: 'gemini', reply: response.text });
      }

      if (type === 'product_review') {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Generate a structured tech review and benchmark breakdown for product: "${product || 'NVIDIA RTX 5090'}". Include rating (out of 5), key specs, 3 Pros, 3 Cons, and verdict summary.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                productName: { type: Type.STRING },
                rating: { type: Type.NUMBER },
                verdict: { type: Type.STRING },
                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                keySpecs: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["productName", "rating", "verdict", "pros", "cons", "keySpecs"]
            }
          }
        });
        const data = JSON.parse(response.text || '{}');
        return res.json({ success: true, source: 'gemini', data });
      }
    } catch (err) {
      console.error("AI Tech API error:", err);
    }
  }

  // Local fallback simulation
  if (type === 'tech_assistant') {
    return res.json({
      success: true,
      source: 'simulation',
      reply: `⚡ **SoftCast AI Tech Expert Analysis**:

1. **Architecture & Engineering**:
   • Silicon node density and microarchitecture enhancements yield 35% higher throughput per watt.

2. **Practical Applications**:
   • Ideal for local LLM inference, real-time 3D ray-tracing pipelines, and zero-latency video rendering.

3. **Key Recommendation**:
   • Ensure PCIe Gen 5 Motherboard support and a 1000W ATX 3.0 power supply for optimal thermal headroom.`
    });
  }

  if (type === 'product_review') {
    return res.json({
      success: true,
      source: 'simulation',
      data: {
        productName: product || 'NVIDIA RTX 5090 Blackwell',
        rating: 4.9,
        verdict: 'The ultimate consumer GPU flagship delivering uncompromised 4K 240Hz ray-tracing and immense AI tensor performance.',
        pros: ['Unmatched 4K Path Tracing Frame Rates', '32GB GDDR7 High-Bandwidth VRAM', 'DLSS 4 Neural Frame Synthesis'],
        cons: ['High 500W TGP Power Requirement', 'Premium Enthusiast Price Tag', '3.5-slot Large Chassis Footprint'],
        keySpecs: ['24,576 CUDA Cores', '32GB GDDR7 VRAM', '512-bit Memory Bus', 'PCIe 5.0 x16']
      }
    });
  }

  res.json({ success: false, message: "Invalid type requested" });
});

// AI Cinema Endpoint for Movie Assistant, Scene Explanation, & Mood Search
app.post("/api/ai-cinema", async (req, res) => {
  const { type, prompt, movieTitle, mood } = req.body;

  if (ai) {
    try {
      if (type === 'movie_recommendation') {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `User request to SoftCast AI Cinema Curator: "${prompt}". Mood context: "${mood || 'Any'}". Recommend 3 top movies with title, year, genre, IMDb score prediction, and why it fits the user's request.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                recommendations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      year: { type: Type.STRING },
                      genre: { type: Type.STRING },
                      rating: { type: Type.STRING },
                      reason: { type: Type.STRING }
                    },
                    required: ["title", "year", "genre", "rating", "reason"]
                  }
                }
              },
              required: ["summary", "recommendations"]
            }
          }
        });
        const data = JSON.parse(response.text || '{}');
        return res.json({ success: true, source: 'gemini', data });
      }

      if (type === 'scene_explanation') {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Provide deep cinematic analysis, director symbolism, and soundtrack mood explanation for movie scene: "${movieTitle}". Context/question: "${prompt}".`
        });
        return res.json({ success: true, source: 'gemini', reply: response.text });
      }
    } catch (err) {
      console.error("AI Cinema API error:", err);
    }
  }

  // Local fallback simulation
  if (type === 'movie_recommendation') {
    return res.json({
      success: true,
      source: 'simulation',
      data: {
        summary: `🎬 **SoftCast AI Film Curator Picks** for "${prompt || 'Mind-bending Sci-Fi'}":`,
        recommendations: [
          {
            title: 'Arrival (2016)',
            year: '2016',
            genre: 'Sci-Fi / Mystery',
            rating: '8.0',
            reason: 'Denis Villeneuve\'s emotional masterpiece about linguistics, non-linear time perception, and alien contact.'
          },
          {
            title: 'Ex Machina (2014)',
            year: '2014',
            genre: 'Sci-Fi / Thriller',
            rating: '7.7',
            reason: 'Alex Garland\'s intense psychological Turing test exploration between a programmer and an enigmatic AI android.'
          },
          {
            title: 'Coherence (2013)',
            year: '2013',
            genre: 'Sci-Fi / Mind Bender',
            rating: '7.2',
            reason: 'A dinner party turns chaotic when a comet pass causes quantum decoherence and parallel reality overlaps.'
          }
        ]
      }
    });
  }

  if (type === 'scene_explanation') {
    return res.json({
      success: true,
      source: 'simulation',
      reply: `🎬 **Cinematic Scene Analysis (${movieTitle || 'Interstellar'})**:

• **Visual Symbolism**: Christopher Nolan utilizes practical IMAX 70mm cameras to capture scale versus human isolation in the wormhole transition.
• **Hans Zimmer Score**: The organ soundtrack ramps up rhythmically at 60 BPM to mirror human heartbeat and time dilation anxiety.
• **Emotional Core**: Cooper's watch tick represents the physical tether of love transcending four-dimensional spatial constraints.`
    });
  }

  res.json({ success: false, message: "Invalid type requested" });
});

// AI SoftCast Live Endpoint (Live Assistant, Live Summary, AI Notes, Translator, AI Clip Detector)
app.post("/api/ai-live", async (req, res) => {
  const { type, streamTitle, prompt, targetLang } = req.body;

  if (ai) {
    try {
      if (type === 'assistant') {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `You are SoftCast AI Live Assistant for stream: "${streamTitle || 'SaaS Architecture & AI Coding'}". User question: "${prompt}". Provide a concise, clear answer explaining what the streamer is currently working on or discussing.`
        });
        return res.json({ success: true, source: 'gemini', reply: response.text });
      }

      if (type === 'summary') {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Generate a real-time structured live stream summary with timestamps and key topics for stream: "${streamTitle || 'Building SaaS in Public'}".`
        });
        return res.json({ success: true, source: 'gemini', summary: response.text });
      }

      if (type === 'translate') {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Translate the following stream transcript line into ${targetLang || 'Uzbek'}: "${prompt}". Return only the translated text.`
        });
        return res.json({ success: true, source: 'gemini', translation: response.text });
      }

      if (type === 'notes') {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Create bulleted smart study notes from the live stream titled: "${streamTitle}". Include key concepts, code snippets or commands mentioned, and actionable steps.`
        });
        return res.json({ success: true, source: 'gemini', notes: response.text });
      }
    } catch (err) {
      console.error("AI Live API error:", err);
    }
  }

  // Fallbacks
  if (type === 'assistant') {
    return res.json({
      success: true,
      source: 'simulation',
      reply: `🤖 **AI Live Assistant**: The streamer "${streamTitle || 'CodeLab'}" is currently demonstrating React 19 server actions with Supabase database schema migrations and real-time subscription hooks!`
    });
  }

  if (type === 'summary') {
    return res.json({
      success: true,
      source: 'simulation',
      summary: `📌 **Real-Time Live Timeline & Chapters**:

• **00:00 - 12:30**: Stream introduction & architecture overview
• **12:35 - 28:10**: Building database schema with Drizzle ORM
• **28:10 - 45:20**: Deploying serverless functions & WebSocket setup
• **45:20 - Live**: Community Q&A & live code refactoring`
    });
  }

  if (type === 'translate') {
    const translations: Record<string, string> = {
      'Uzbek': 'Bugungi efirda biz real-vaqt rejimida Next.js va Supabase yordamida loyiha yaratamiz.',
      'Russian': 'В сегодняшнем эфире мы создаем проект на Next.js и Supabase в реальном времени.',
      'Spanish': '¡En la transmisión de hoy estamos construyendo un proyecto en tiempo real con Next.js y Supabase!'
    };
    return res.json({
      success: true,
      source: 'simulation',
      translation: translations[targetLang || 'Uzbek'] || translations['Uzbek']
    });
  }

  if (type === 'notes') {
    return res.json({
      success: true,
      source: 'simulation',
      notes: `📝 **AI Generated Live Notes (${streamTitle || 'SaaS Building'})**:

1. **Architecture Rule**: Keep WebSocket connections multiplexed to reduce server connection overhead.
2. **Database Tip**: Use indexed composite keys for faster real-time table queries.
3. **Deployment**: Set environment variables before running automated CI/CD container builds.`
    });
  }

  res.json({ success: false, message: "Invalid type requested" });
});

// AI SoftView Library Endpoint (YouTube Import, Smart Summaries, Auto Subtitles, Semantic Search, AI Organizer)
app.post("/api/ai-library", async (req, res) => {
  const { type, url, videoTitle, query, targetLang } = req.body;

  if (ai) {
    try {
      if (type === 'youtube_import') {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Analyze YouTube video URL or topic: "${url}". Extract or generate structured metadata: JSON format with fields: title, description, thumbnail, duration, author, category, language, chapters (array of objects with timestamp and title), tags (array).`
        });
        return res.json({ success: true, source: 'gemini', metadata: response.text });
      }

      if (type === 'video_summary') {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Provide a structured AI summary for video titled: "${videoTitle || 'React Architecture'}". Include: Main Ideas (3 bullet points), Key Code or Concept takeaways, and Estimated Time Saved.`
        });
        return res.json({ success: true, source: 'gemini', summary: response.text });
      }

      if (type === 'subtitles') {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Generate timed subtitle lines in ${targetLang || 'Uzbek'} for video titled: "${videoTitle}". Format as WebVTT timestamped lines with auto speaker identification.`
        });
        return res.json({ success: true, source: 'gemini', subtitles: response.text });
      }

      if (type === 'semantic_search') {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Perform semantic search understanding concept: "${query}". Return matching topic tags, related tech stack terms, and relevance score explanations.`
        });
        return res.json({ success: true, source: 'gemini', searchResults: response.text });
      }
    } catch (err) {
      console.error("AI Library API error:", err);
    }
  }

  // Fallbacks
  if (type === 'youtube_import') {
    let cleanTitle = 'Imported YouTube Video';
    let cleanCover = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop';
    let cleanAuthor = 'YouTube Channel';

    if (url.includes('react') || url.includes('next')) {
      cleanTitle = 'Mastering React 19 & Next.js App Router';
      cleanCover = 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop';
      cleanAuthor = 'Fireship Tech';
    } else if (url.includes('python') || url.includes('ai')) {
      cleanTitle = 'Python AI & Machine Learning Pipeline';
      cleanCover = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop';
      cleanAuthor = 'TechWorld with Nana';
    } else if (url.includes('music') || url.includes('lofi')) {
      cleanTitle = 'Deep Focus Ambient Chill Mix';
      cleanCover = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop';
      cleanAuthor = 'ChilledCow / Lofi Girl';
    } else {
      cleanTitle = 'Imported Tech Walkthrough & Full Stack Setup';
    }

    return res.json({
      success: true,
      source: 'simulation',
      videoData: {
        id: `yt-import-${Date.now()}`,
        youtubeUrl: url,
        title: cleanTitle,
        description: 'Imported via SoftView YouTube Knowledge Engine. Automatically enriched with AI chapters, transcript index, and smart notes.',
        coverUrl: cleanCover,
        duration: '22:15',
        views: '45.2K views',
        uploadDate: 'Just now',
        creator: cleanAuthor,
        creatorVerified: true,
        category: 'technology',
        language: 'English',
        tags: ['YouTube Import', 'SoftView Knowledge', 'AI Analyzed', 'Technology'],
        chapters: [
          { timestamp: '00:00', title: 'Introduction & Setup' },
          { timestamp: '04:15', title: 'Core Concepts & Architecture' },
          { timestamp: '12:30', title: 'Hands-on Implementation' },
          { timestamp: '18:45', title: 'Summary & Best Practices' }
        ],
        videoUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E'
      }
    });
  }

  if (type === 'video_summary') {
    return res.json({
      success: true,
      source: 'simulation',
      summary: `💡 **AI Video Executive Summary (${videoTitle || 'Tech Tutorial'})**:

• **Main Idea 1**: Modular component architecture simplifies state management and testability.
• **Main Idea 2**: Server actions eliminate unnecessary API boilerplate, routing mutations safely.
• **Main Idea 3**: Proper indexing and lazy initialization avoid client bundle bloat.

⏱️ **Time Saved**: ~38 minutes (AI condensed a 45 min video into 3 min core insights).`
    });
  }

  if (type === 'subtitles') {
    const lang = targetLang || 'Uzbek';
    return res.json({
      success: true,
      source: 'simulation',
      subtitles: `WEBVTT - SoftView AI Subtitle Generator (${lang})

00:00:01.000 --> 00:00:04.500
[Spiker 1]: ${lang === 'Uzbek' ? 'Assalomu alaykum! Bugun SoftView kutubxonasida yangi darsni ko‘rib chiqamiz.' : 'Hello everyone! Today we are exploring a new lesson in SoftView Library.'}

00:00:05.000 --> 00:00:09.200
[Spiker 1]: ${lang === 'Uzbek' ? 'Dastlab ma’lumotlar bazasi va server vaqtinchalik xotirasini sozlaymiz.' : 'First we configure our database and server cache rules.'}

00:00:09.800 --> 00:00:14.000
[Spiker 2]: ${lang === 'Uzbek' ? 'Ajoyib! Kodni optimallashtirish bo‘yicha AI tavsiyalarini bajaramiz.' : 'Great! Now we apply AI recommendations for code optimization.'}`
    });
  }

  if (type === 'semantic_search') {
    return res.json({
      success: true,
      source: 'simulation',
      matches: [
        { topic: 'React Authentication & Firebase', relevance: '98%', count: 4 },
        { topic: 'JWT & OAuth Security Flows', relevance: '92%', count: 3 },
        { topic: 'Full Stack User Session Guards', relevance: '85%', count: 2 }
      ]
    });
  }

  res.json({ success: false, message: "Invalid type requested" });
});

// ==========================================
// SUPABASE DATABASE INTEGRATION API ENDPOINTS
// ==========================================

// In-memory fallback database for videos when Supabase is not yet populated
let serverVideos: any[] = [];
let serverLearningPaths: any[] = [];

// Get Supabase connection status
app.get("/api/supabase/status", (req, res) => {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
  const configured = Boolean(url && key && !url.includes("your-project") && !key.includes("your-anon-key"));

  res.json({
    configured,
    url: url ? (url.length > 25 ? `${url.substring(0, 22)}...` : url) : "Not set",
    hasKey: Boolean(key && !key.includes("your-anon-key")),
    message: configured 
      ? "Supabase database client connected successfully" 
      : "Supabase environment variables not set. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env or Vercel settings."
  });
});

// Get Videos Endpoint
app.get("/api/videos", (req, res) => {
  res.json({ success: true, videos: serverVideos });
});

// Add Video Endpoint
app.post("/api/videos", (req, res) => {
  const newVideo = req.body;
  if (!newVideo || !newVideo.title) {
    return res.status(400).json({ success: false, message: "Video title is required" });
  }

  const videoRecord = {
    id: newVideo.id || `vid-${Date.now()}`,
    title: newVideo.title,
    description: newVideo.description || "",
    category: newVideo.category || "discover",
    coverUrl: newVideo.coverUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop",
    duration: newVideo.duration || "10:00",
    views: newVideo.views || "1 view",
    uploadDate: newVideo.uploadDate || "Just now",
    creator: newVideo.creator || "User",
    creatorVerified: newVideo.creatorVerified ?? false,
    progress: newVideo.progress || 0,
    isLive: newVideo.isLive ?? false,
    videoUrl: newVideo.videoUrl || "https://www.youtube.com/embed/5g19-0r_TJI",
    comments: newVideo.comments || []
  };

  serverVideos.unshift(videoRecord);
  res.json({ success: true, video: videoRecord, totalVideos: serverVideos.length });
});

// Delete Video Endpoint
app.delete("/api/videos/:id", (req, res) => {
  const { id } = req.params;
  serverVideos = serverVideos.filter(v => v.id !== id);
  res.json({ success: true, message: `Video ${id} removed` });
});

// Get Learning Paths Endpoint
app.get("/api/learning-paths", (req, res) => {
  res.json({ success: true, paths: serverLearningPaths });
});

// Add Learning Path Endpoint
app.post("/api/learning-paths", (req, res) => {
  const newPath = req.body;
  if (!newPath || !newPath.title) {
    return res.status(400).json({ success: false, message: "Path title is required" });
  }

  const pathRecord = {
    id: newPath.id || `path-${Date.now()}`,
    title: newPath.title,
    description: newPath.description || "",
    category: newPath.category || "General",
    xpReward: newPath.xpReward || 100,
    steps: newPath.steps || []
  };

  serverLearningPaths.unshift(pathRecord);
  res.json({ success: true, path: pathRecord });
});

// ==========================================
// CUSTOM GOOGLE OAUTH FLOW ENDPOINTS
// Starts and finishes strictly on application domain (bypasses *.supabase.co)
// ==========================================

app.get("/api/auth/google", (req, res) => {
  const host = req.get('host') || 'softview.vercel.app';
  const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const appUrl = process.env.APP_URL || `${protocol}://${host}`;
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();

  if (googleClientId && googleClientId !== "" && googleClientId !== "your-google-client-id") {
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.set("client_id", googleClientId);
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", "openid profile email");
    googleAuthUrl.searchParams.set("access_type", "offline");
    googleAuthUrl.searchParams.set("prompt", "consent");

    if (req.query.mode === 'json') {
      return res.json({ success: true, url: googleAuthUrl.toString() });
    }
    return res.redirect(googleAuthUrl.toString());
  }

  // Fallback demo auth start on our domain when GOOGLE_CLIENT_ID is not configured
  const demoCallbackUrl = `${appUrl}/api/auth/google/callback?code=softview_custom_demo_code`;
  if (req.query.mode === 'json') {
    return res.json({ success: true, url: demoCallbackUrl });
  }
  return res.redirect(demoCallbackUrl);
});

app.get("/api/auth/google/callback", async (req, res) => {
  const host = req.get('host') || 'softview.vercel.app';
  const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const appUrl = process.env.APP_URL || `${protocol}://${host}`;
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  const { code, error } = req.query;

  if (error) {
    return res.redirect(`${appUrl}/?auth_error=${encodeURIComponent(String(error))}`);
  }

  let googleUser = {
    id: 'google-user-' + Date.now(),
    email: 'softview.user@gmail.com',
    name: 'Aslbek (Google)',
    picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop'
  };
  let idToken = '';

  const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

  if (code && code !== 'softview_custom_demo_code' && googleClientId && googleClientSecret && googleClientId !== '' && googleClientSecret !== '' && googleClientId !== 'your-google-client-id') {
    try {
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: String(code),
          client_id: googleClientId,
          client_secret: googleClientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      const tokenData = await tokenRes.json();
      if (tokenData.access_token) {
        idToken = tokenData.id_token || '';
        const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const profile = await userRes.json();
        if (profile && profile.email) {
          googleUser = {
            id: profile.id || `google-${Date.now()}`,
            email: profile.email,
            name: profile.name || profile.given_name || profile.email.split('@')[0],
            picture: profile.picture || googleUser.picture,
          };
        }
      }
    } catch (err) {
      console.error("Google OAuth token exchange error:", err);
    }
  }

  // Create or update Supabase user/session on the server side
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  let sessionData: any = null;

  if (supabaseUrl && (supabaseServiceKey || supabaseAnonKey)) {
    try {
      const { createClient } = await import("@supabase/supabase-js");

      if (idToken && supabaseAnonKey) {
        const client = createClient(supabaseUrl, supabaseAnonKey);
        const { data } = await client.auth.signInWithIdToken({
          provider: 'google',
          token: idToken,
        });
        if (data?.session) {
          sessionData = data.session;
        }
      }

      if (!sessionData && supabaseServiceKey) {
        const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });

        const { data: usersData } = await adminClient.auth.admin.listUsers();
        const existingUser = usersData?.users?.find((u) => u.email === googleUser.email);

        if (existingUser) {
          await adminClient.auth.admin.updateUserById(existingUser.id, {
            user_metadata: {
              full_name: googleUser.name,
              avatar_url: googleUser.picture,
              name: googleUser.name,
              picture: googleUser.picture,
            },
            email_confirm: true,
          });
        } else {
          await adminClient.auth.admin.createUser({
            email: googleUser.email,
            email_confirm: true,
            user_metadata: {
              full_name: googleUser.name,
              avatar_url: googleUser.picture,
              name: googleUser.name,
              picture: googleUser.picture,
            },
          });
        }
      }
    } catch (err) {
      console.warn("Supabase server session creation notice:", err);
    }
  }

  // Return clean, branded HTML completion screen staying strictly on SoftView domain
  const responseHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SoftView Authentication</title>
  <style>
    body {
      background-color: #0b0f19;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    .card {
      background: #1e293b;
      border: 1px solid rgba(99, 102, 241, 0.3);
      padding: 32px;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
      max-width: 380px;
      width: 90%;
    }
    .avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      margin-bottom: 16px;
      border: 2px solid #6366f1;
    }
    h2 { font-size: 18px; margin: 0 0 8px 0; color: #fff; }
    p { font-size: 13px; color: #94a3b8; margin: 0; }
    .spinner {
      margin: 16px auto 0 auto;
      width: 24px;
      height: 24px;
      border: 3px solid rgba(99, 102, 241, 0.2);
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="card">
    <img src="${googleUser.picture}" class="avatar" alt="Avatar" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop'" />
    <h2>Welcome, ${googleUser.name}!</h2>
    <p>Signed in successfully. Returning to SoftView...</p>
    <div class="spinner"></div>
  </div>
  <script>
    const authData = ${JSON.stringify({
      user: googleUser,
      session: sessionData,
      appUrl: appUrl
    })};

    if (window.opener) {
      window.opener.postMessage({ type: 'SOFTVIEW_CUSTOM_GOOGLE_AUTH', payload: authData }, '*');
      setTimeout(() => { window.close(); }, 800);
    } else {
      setTimeout(() => {
        window.location.href = authData.appUrl + '/?auth_success=true&user_name=' + encodeURIComponent(authData.user.name) + '&user_email=' + encodeURIComponent(authData.user.email) + '&user_avatar=' + encodeURIComponent(authData.user.picture);
      }, 1000);
    }
  </script>
</body>
</html>`;

  res.send(responseHtml);
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SoftCast Server running on http://localhost:${PORT}`);
  });
}

export default app;

if (!process.env.VERCEL) {
  startServer();
}
