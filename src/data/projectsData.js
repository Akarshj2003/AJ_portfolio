import dinoVideo from '../assets/dino-demo.mp4';
import dinoPoster from '../assets/dino-poster.png';

/**
 * Akarsh J — Projects Showcase Data Catalog
 * 
 * To add a new project in the future:
 * Simply append a new object to the `projects` array below!
 * The 3D orbit engine automatically recalculates angular spacing (360° / N),
 * scales the radius, and culls off-screen items smoothly.
 */

export const projects = [
  {
    id: "rl-dino-game",
    kicker: "RL / COMPUTER VISION",
    title: "Dino Game AI — Autonomous DQN",
    tagline: "Autonomous Reinforcement Learning agent playing Chrome's T-Rex Dino game via real-time computer vision.",
    tags: ["Python", "Stable-Baselines3", "Gymnasium", "OpenCV", "PyTorch"],
    metric: "Autonomous 1000+ Score · 60 FPS Vision",
    accent: "#00f4ff",       // Cyber Cyan
    accentSoft: "rgba(0, 244, 255, 0.35)",
    glow: "rgba(0, 244, 255, 0.25)",
    icon: "ai",
    githubUrl: "https://github.com/Akarshj2003/RL_Dino_Game",
    demoUrl: "https://github.com/Akarshj2003/RL_Dino_Game",
    // Image poster & video demo preview
    poster: dinoPoster,
    video: dinoVideo,
    hasLiveSimulation: "dino",
    problem: "Exploring autonomous microsecond decision-making and visual perception in non-stationary arcade environments where game velocity continuously accelerates.",
    challenges: "Built an OpenCV screen-capture and downsampling pipeline for real-time CNN feature extraction; shaped rewards heavily against collisions while incentivizing velocity; tuned epsilon-greedy schedule to prevent policy collapse."
  },
  {
    id: "synthetix-ai-detection",
    kicker: "NLP / TRANSFORMERS",
    title: "Synthetix — AI vs Human Text Detection",
    tagline: "Deep learning NLP classifier leveraging fine-tuned BERT and Transformers to detect machine-generated vs human writing with probabilistic confidence.",
    tags: ["Python", "PyTorch", "Transformers", "BERT", "Flask", "React"],
    metric: "94%+ Classification Accuracy · <220ms Inference",
    accent: "#ffc922",       // Celestial Amber / Gold
    accentSoft: "rgba(255, 201, 34, 0.35)",
    glow: "rgba(255, 201, 34, 0.25)",
    icon: "brain",
    githubUrl: "https://github.com/Akarshj2003/AI-generated-text-detection",
    demoUrl: "https://github.com/Akarshj2003/AI-generated-text-detection",
    poster: null,
    video: null,
    hasLiveSimulation: "nlp",
    problem: "Distinguishing between nuanced synthetic text (ChatGPT, Claude, Gemini) and genuine human writing to combat academic plagiarism, synthetic review spam, and text misattribution.",
    challenges: "Overcame token length bottlenecks with sliding-window chunking and pooled attention scoring; mitigated cross-domain dataset bias; optimized inference to run under 220ms via batched PyTorch execution."
  },
  {
    id: "vqa-assist",
    kicker: "VISION-LANGUAGE / ACCESSIBILITY",
    title: "VQA Assist — Vision for Visually Impaired",
    tagline: "Assistive AI combining computer vision and multimodal LLMs to interpret surroundings and answer real-world visual queries for visually impaired users.",
    tags: ["Python", "PyTorch", "Vision-LLM", "FastAPI", "WebRTC"],
    metric: "Sub-Second VQA Turnaround · Zero-Shot Scene Analysis",
    accent: "#ff5376",       // Neon Coral / Rose
    accentSoft: "rgba(255, 83, 118, 0.35)",
    glow: "rgba(255, 83, 118, 0.25)",
    icon: "eye",
    githubUrl: "https://github.com/Akarshj2003",
    demoUrl: "https://github.com/Akarshj2003",
    poster: null,
    video: null,
    hasLiveSimulation: "vision",
    problem: "Helping visually impaired individuals navigate everyday environments, read fine product labels, and answer complex spatial questions without relying on sighted human assistance.",
    challenges: "Engineered a low-latency image-captioning and visual QA pipeline that gracefully handles blurry, shaky, and poorly lit smartphone camera frames while providing clear voice-synthesized descriptions."
  },
  {
    id: "safari-nss-assistant",
    kicker: "VOICE AI / RAG",
    title: "Safari — NSS College Voice & Knowledge AI",
    tagline: "Voice-interactive conversational AI for NSS College providing real-time queries, syllabus PDF analysis, and campus guidance.",
    tags: ["Python", "SpeechRecognition", "TTS", "LangChain", "FastAPI"],
    metric: "Multi-Document PDF Querying · Voice & Audio I/O",
    accent: "#00bf8f",       // Mint Teal
    accentSoft: "rgba(0, 191, 143, 0.35)",
    glow: "rgba(0, 191, 143, 0.25)",
    icon: "voice",
    githubUrl: "https://github.com/Akarshj2003/nss_online_Assistant",
    demoUrl: "https://github.com/Akarshj2003/nss_online_Assistant",
    poster: null,
    video: null,
    hasLiveSimulation: "voice",
    problem: "University students and faculty waste substantial time sifting through fragmented semester notices, timetable updates, and dense university PDF circulars.",
    challenges: "Built end-to-end voice-to-intent pipeline with acoustic noise filtration; implemented an unstructured PDF document ingestion engine capable of extracting tabular course regulations and syllabus units accurately."
  },
  {
    id: "cinepass-booking-engine",
    kicker: "FULL-STACK / DISTRIBUTED STATE",
    title: "CinePass — Real-Time Ticket Reservation",
    tagline: "High-concurrency movie reservation platform with interactive seat maps, role-based admin dashboard, and atomic checkout locks.",
    tags: ["React", "Redux Toolkit", "Node.js", "Express", "MongoDB", "Material UI"],
    metric: "Zero Double-Booking Guarantees · Sub-100ms Updates",
    accent: "#b48cff",       // Electric Violet
    accentSoft: "rgba(180, 140, 255, 0.35)",
    glow: "rgba(180, 140, 255, 0.25)",
    icon: "ticket",
    githubUrl: "https://github.com/Akarshj2003/booking_app",
    demoUrl: "https://github.com/Akarshj2003/booking_app",
    poster: null,
    video: null,
    hasLiveSimulation: "grid",
    problem: "Eliminating seat concurrency race conditions and double-booking errors during high-demand simultaneous customer reservation checkouts.",
    challenges: "Architected atomic seat reservation locks in MongoDB with auto-expiring checkout timers; structured predictable multi-tier Redux state; built a dynamic admin console for managing movie halls, timings, and ticket tiers."
  },
  {
    id: "hbotix-health-triage",
    kicker: "HEALTHCARE AI / TRIAGE",
    title: "HBotix — Clinical Query & Health Assistant",
    tagline: "Domain-specific conversational agent providing reliable preliminary symptom-information mapping with strict hallucination guardrails.",
    tags: ["Python", "NLP", "FastAPI", "Astra DB", "Semantic Search"],
    metric: "Strict Safety Guardrails · Semantic Vector Matching",
    accent: "#1cd8d2",       // Cyan Mist
    accentSoft: "rgba(28, 216, 210, 0.35)",
    glow: "rgba(28, 216, 210, 0.25)",
    icon: "health",
    githubUrl: "https://github.com/Akarshj2003/HBotix",
    demoUrl: "https://github.com/Akarshj2003/HBotix",
    poster: null,
    video: null,
    hasLiveSimulation: "medical",
    problem: "Providing accessible, around-the-clock preliminary medical triage information without risking inaccurate or misleading advice from standard conversational LLMs.",
    challenges: "Engineered strict intent guardrails that route medical questions strictly through verified semantic vector databases in Astra DB, triggering defensive disclaimers when confidence falls below clinical thresholds."
  }
];
