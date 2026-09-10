import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SiPython,
  SiPytorch,
  SiReact,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiSqlite,
  SiDocker,
  SiGit,
  SiLinux,
  SiTailwindcss,
  SiVite,
  SiNvidia,
  SiNextdotjs,
  SiPostman,
  SiDotnet,
} from 'react-icons/si'
import {
  TbBrain,
  TbBinaryTree,
  TbBrandCSharp,
} from 'react-icons/tb'
import {
  LuLayers,
  LuSparkles,
  LuTerminal,
  LuDatabase,
  LuWorkflow,
  LuCheck,
  LuExternalLink,
  LuInfo,
  LuX,
  LuNetwork,
  LuCpu,
  LuBoxes,
  LuBrainCircuit,
  LuGlobe,
  LuArrowRight,
} from 'react-icons/lu'
import { RiRobot3Line } from 'react-icons/ri'

// Engineering problem lenses with clean SVG icons (zero emojis)
const PROBLEM_LENSES = [
  {
    id: 'all',
    label: 'All Systems',
    icon: LuBoxes,
    tagline: 'Complete Full-Stack & AI Architecture',
    summary: 'Holistic view of engineering capabilities across intelligent models, client runtimes, distributed storage, and deployment infrastructure.',
    pipeline: ['Data & Vector Tier', 'Inference & API Engine', 'Reactive Client UI', 'DevOps & Containers'],
  },
  {
    id: 'ai',
    label: 'Autonomous AI & RAG',
    icon: LuBrainCircuit,
    tagline: 'Edge AI, LLM Orchestration & Intelligent Agents',
    summary: 'Designing real-time voice assistants, semantic document search (RAG), and hardware-accelerated deep learning models.',
    pipeline: ['Edge Devices (Jetson)', 'PyTorch & Transformers', 'Vector DB (Astra)', 'Gemini / LLM Engine', 'Voice & Chat UI'],
  },
  {
    id: 'web',
    label: 'High-Velocity Web',
    icon: LuGlobe,
    tagline: 'Micro-Interactions, 60fps Runtimes & Scalable State',
    summary: 'Crafting responsive, zero-jank frontend applications with atomic Tailwind styling, kinetic Framer Motion, and modern build tooling.',
    pipeline: ['Vite & Next.js Core', 'React 19 Components', 'TypeScript Type-Safety', 'Tailwind & Motion Physics'],
  },
  {
    id: 'backend',
    label: 'Resilient APIs & Data',
    icon: LuDatabase,
    tagline: 'Secure REST Architectures & Hybrid Databases',
    summary: 'Architecting high-concurrency microservices, document & relational database schema design, and asynchronous task execution.',
    pipeline: ['Client Requests', 'Node / Express Middleware', 'PostgreSQL / MongoDB', 'Vector Embeddings Cache'],
  },
  {
    id: 'systems',
    label: 'Systems & DevOps',
    icon: LuTerminal,
    tagline: 'Linux Systems, Containerization & CI/CD',
    summary: 'Managing enterprise Linux environments, Docker workflows, automated builds, and low-level memory-efficient systems programming.',
    pipeline: ['Linux / Bash Shell', 'Docker Image Builds', 'Git Version Control', 'Postman Automated Tests'],
  },
]

// Comprehensive Skill Registry with real credentials from Akarsh's LinkedIn & GitHub
const SKILL_MODULES = [
  {
    id: 'ai-ml',
    title: 'AI, Machine Learning & Edge Computing',
    icon: RiRobot3Line,
    glowColor: 'from-[#00f4ff]/20 to-[#302b63]/40',
    borderColor: 'border-cyan-500/30',
    accentColor: '#00f4ff',
    badge: 'Core Specialization',
    description: 'Specializing in LLM agent workflows, Transformer models, edge hardware inference, and automated computer vision pipelines.',
    skills: [
      {
        name: 'Python',
        icon: SiPython,
        tier: 'Daily Driver',
        statusColor: 'emerald',
        lens: ['all', 'ai', 'backend'],
        category: 'Core Language',
        highlight: 'Primary language for ML modeling, data pipelines, automation scripts, and backend microservices.',
        project: 'Safari Voice Assistant & Heart Disease ML',
      },
      {
        name: 'PyTorch & Neural Networks',
        icon: SiPytorch,
        tier: 'Deep Specialization',
        statusColor: 'cyan',
        lens: ['all', 'ai'],
        category: 'Deep Learning',
        highlight: 'Building classification models, convolutional networks, and fine-tuning transformer architectures.',
        project: 'AI-Generated Text Detection & RL Dino Game',
      },
      {
        name: 'Gemini & Generative AI',
        icon: LuSparkles,
        tier: 'Production Active',
        statusColor: 'emerald',
        lens: ['all', 'ai'],
        category: 'LLM Orchestration',
        highlight: 'Implementing ReAct agents, function-calling, structured JSON generation, and multi-turn contextual chatbots.',
        project: 'Portfolio AI Assistant Companion',
      },
      {
        name: 'RAG & Vector Search',
        icon: TbBinaryTree,
        tier: 'Production Active',
        statusColor: 'emerald',
        lens: ['all', 'ai', 'backend'],
        category: 'Semantic Retrieval',
        highlight: 'Document chunking, dense vector embeddings generation, similarity querying with Astra DB and hybrid search.',
        project: 'RAG Pipeline & Repo Intelligence',
      },
      {
        name: 'Edge AI (Jetson Nano & CUDA)',
        icon: SiNvidia,
        tier: 'Certified Credential',
        statusColor: 'amber',
        lens: ['all', 'ai', 'systems'],
        category: 'Embedded Hardware AI',
        highlight: 'NVIDIA-certified for embedded deep learning deployment, TensorRT optimizations, and real-time inference.',
        project: 'NVIDIA Jetson Nano Real-Time Vision',
      },
      {
        name: 'BERT & Transformers',
        icon: TbBrain,
        tier: 'Specialized Study',
        statusColor: 'cyan',
        lens: ['all', 'ai'],
        category: 'Natural Language Processing',
        highlight: 'Text tokenization, sentiment analysis, attention heads analysis, and sequence-to-sequence translation.',
        project: 'AI Text Detection & Voice Processing',
      },
    ],
  },
  {
    id: 'frontend',
    title: 'Modern Frontend & Reactive Web Engine',
    icon: LuLayers,
    glowColor: 'from-[#ffc922]/20 to-[#00f4ff]/20',
    borderColor: 'border-amber-400/30',
    accentColor: '#ffc922',
    badge: 'High Velocity',
    description: 'Engineering responsive, accessible, and kinetic user interfaces with modern React paradigms and hardware-accelerated animations.',
    skills: [
      {
        name: 'React 19',
        icon: SiReact,
        tier: 'Daily Driver',
        statusColor: 'emerald',
        lens: ['all', 'web'],
        category: 'UI Library & Runtime',
        highlight: 'Hooks architecture, custom animation pipelines, responsive layouts, and performance optimization.',
        project: 'Portfolio V2, E-Commerce Hub, Booking App',
      },
      {
        name: 'TypeScript',
        icon: SiTypescript,
        tier: 'Daily Driver',
        statusColor: 'emerald',
        lens: ['all', 'web', 'backend'],
        category: 'Type-Safe Development',
        highlight: 'Strict interfaces, generic utilities, component prop safety, and full-stack type contracts.',
        project: 'Enterprise Systems & Next.js Modules',
      },
      {
        name: 'JavaScript (ES6+)',
        icon: SiJavascript,
        tier: 'Daily Driver',
        statusColor: 'emerald',
        lens: ['all', 'web', 'backend'],
        category: 'Core Language',
        highlight: 'Asynchronous event loop, promises, closures, dynamic DOM manipulation, and modern web APIs.',
        project: 'All Full-Stack & Frontend Applications',
      },
      {
        name: 'Next.js',
        icon: SiNextdotjs,
        tier: 'High Velocity',
        statusColor: 'cyan',
        lens: ['all', 'web'],
        category: 'Full-Stack Framework',
        highlight: 'Server-Side Rendering (SSR), Static Site Generation, App Router patterns, and API routes.',
        project: 'Scalable Web Applications',
      },
      {
        name: 'Tailwind CSS',
        icon: SiTailwindcss,
        tier: 'Daily Driver',
        statusColor: 'emerald',
        lens: ['all', 'web'],
        category: 'Utility Design System',
        highlight: 'Custom design tokens, responsive breakpoints, glassmorphic filters, and cyber-dark aesthetics.',
        project: 'Brand Portfolio Design System',
      },
      {
        name: 'Framer Motion',
        icon: LuWorkflow,
        tier: 'Daily Driver',
        statusColor: 'emerald',
        lens: ['all', 'web'],
        category: 'Motion Physics Engine',
        highlight: 'Spring physics, stagger choreographies, 3D flip cards, gesture controls, and layout transitions.',
        project: 'Portfolio Interactive Experiences',
      },
    ],
  },
  {
    id: 'backend-data',
    title: 'Backend Architecture & Data Systems',
    icon: LuDatabase,
    glowColor: 'from-[#00bf8f]/20 to-[#1cd8d2]/20',
    borderColor: 'border-teal-400/30',
    accentColor: '#00bf8f',
    badge: 'Enterprise Grade',
    description: 'Constructing robust server backends, secure authentication layers, relational schemas, and unstructured vector databases.',
    skills: [
      {
        name: 'Node.js & Express',
        icon: SiNodedotjs,
        tier: 'Daily Driver',
        statusColor: 'emerald',
        lens: ['all', 'backend', 'web'],
        category: 'Server Runtime & Framework',
        highlight: 'RESTful API construction, middleware pipelining, JWT authentication, and CORS security.',
        project: 'AJ_Backend & E-Commerce Service',
      },
      {
        name: 'MongoDB',
        icon: SiMongodb,
        tier: 'Daily Driver',
        statusColor: 'emerald',
        lens: ['all', 'backend'],
        category: 'NoSQL Document Store',
        highlight: 'Mongoose schema design, aggregation pipelines, indexed collections, and atlas cloud clusters.',
        project: 'E-Commerce Hub & Task Manager',
      },
      {
        name: 'PostgreSQL & SQL',
        icon: SiPostgresql,
        tier: 'High Velocity',
        statusColor: 'cyan',
        lens: ['all', 'backend'],
        category: 'Relational Database',
        highlight: 'Relational schema normalization, complex JOIN queries, ACID compliance, and connection pooling.',
        project: 'Relational Data Stores & TCS Systems',
      },
      {
        name: 'MySQL & SQLite',
        icon: SiMysql,
        tier: 'Production Active',
        statusColor: 'emerald',
        lens: ['all', 'backend'],
        category: 'Structured Databases',
        highlight: 'Embedded and standalone relational database querying, indexing, and transactional integrity.',
        project: 'Local Testing & Educational Databases',
      },
      {
        name: 'C# & .NET Framework',
        icon: TbBrandCSharp,
        tier: 'Enterprise Certified',
        statusColor: 'amber',
        lens: ['all', 'backend'],
        category: 'Enterprise Engineering',
        highlight: 'Object-oriented application development, ADO.NET database connectivity, and structured enterprise logic.',
        project: 'Enterprise Services & TCS Training',
      },
      {
        name: 'RESTful APIs',
        icon: LuNetwork,
        tier: 'Daily Driver',
        statusColor: 'emerald',
        lens: ['all', 'backend', 'web'],
        category: 'API Protocol',
        highlight: 'Idempotent routing, HTTP status codes, structured JSON payloads, rate limiting, and error handling.',
        project: 'All Web & Backend Integrations',
      },
    ],
  },
  {
    id: 'devops-tools',
    title: 'Systems, DevOps & Engineering Tooling',
    icon: LuTerminal,
    glowColor: 'from-[#302b63]/30 to-[#00f4ff]/20',
    borderColor: 'border-purple-400/30',
    accentColor: '#93c1c1',
    badge: 'Reliability & CI/CD',
    description: 'Ensuring continuous deployment, version control discipline, Linux server mastery, and reproducible build systems.',
    skills: [
      {
        name: 'Linux & CentOS',
        icon: SiLinux,
        tier: 'Certified Knowledge',
        statusColor: 'emerald',
        lens: ['all', 'systems', 'backend'],
        category: 'Operating Systems & Shell',
        highlight: 'CompTIA-certified CentOS 7 administration, shell scripting, process management, and SSH hardening.',
        project: 'Linux Server Environments & Development',
      },
      {
        name: 'Docker',
        icon: SiDocker,
        tier: 'Production Active',
        statusColor: 'cyan',
        lens: ['all', 'systems', 'backend'],
        category: 'Containerization',
        highlight: 'Multi-stage Dockerfile creation, image optimization, local microservice orchestration with Docker Compose.',
        project: 'Containerized Deployment Pipelines',
      },
      {
        name: 'Git & GitHub',
        icon: SiGit,
        tier: 'Daily Driver',
        statusColor: 'emerald',
        lens: ['all', 'systems', 'web', 'backend'],
        category: 'Version Control',
        highlight: 'Branching workflows, pull requests, merge conflict resolution, semantic commit history, and GitHub Actions.',
        project: 'All Open-Source & Portfolio Repositories',
      },
      {
        name: 'Vite & Build Tooling',
        icon: SiVite,
        tier: 'Daily Driver',
        statusColor: 'emerald',
        lens: ['all', 'systems', 'web'],
        category: 'Modern Bundler',
        highlight: 'Hot Module Replacement, Rolldown integration, production tree-shaking, and bundle size minimization.',
        project: 'Portfolio V2 & Modern Web Apps',
      },
      {
        name: 'Postman',
        icon: SiPostman,
        tier: 'Daily Driver',
        statusColor: 'emerald',
        lens: ['all', 'systems', 'backend'],
        category: 'API Testing & Documentation',
        highlight: 'Automated test suites, collection runners, environment variable configurations, and endpoint contract validation.',
        project: 'API Development & Verification',
      },
      {
        name: 'Systems Programming (C / Java)',
        icon: LuCpu,
        tier: 'Academic & Foundation',
        statusColor: 'amber',
        lens: ['all', 'systems'],
        category: 'Low-Level Foundations',
        highlight: 'Memory management, pointers, compiler construction, and object-oriented design patterns.',
        project: 'Compiler Lab & Swing Login Systems',
      },
    ],
  },
]

const Skills = () => {
  const [activeLens, setActiveLens] = useState('all')
  const [selectedSkill, setSelectedSkill] = useState(null)

  const currentLensData = useMemo(() => {
    return PROBLEM_LENSES.find((l) => l.id === activeLens) || PROBLEM_LENSES[0]
  }, [activeLens])

  return (
    <section
      id="skills"
      className="relative min-h-screen w-full bg-[#000000] text-white py-20 lg:py-24 px-4 sm:px-6 lg:px-10 flex flex-col justify-center"
    >
      {/* Ambient Cosmic Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#302b63]/30 via-[#00f4ff]/15 to-transparent blur-[160px] animate-pulse"
          style={{ animationDuration: '9s' }}
        />
        <div
          className="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#00bf8f]/15 via-[#ffc922]/10 to-transparent blur-[150px] animate-pulse"
          style={{ animationDuration: '11s' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <div className="relative z-10 max-w-[1360px] w-full mx-auto flex flex-col gap-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#00f4ff] to-[#ffc922]"
          >
            Engineering Stack & Systems
          </motion.h2>
        </div>

        {/* Problem-to-Tech Resolver: Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-1.5 items-center w-full"
        >
          {/* Interactive Filter Grid */}
          <div className="w-full p-1 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 w-full">
              {PROBLEM_LENSES.map((lens) => {
                const isActive = activeLens === lens.id
                const LensIcon = lens.icon

                return (
                  <button
                    key={lens.id}
                    onClick={() => setActiveLens(lens.id)}
                    className={`relative px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 text-center select-none ${
                      isActive
                        ? 'text-black font-semibold shadow-[0_0_20px_#00f4ff]'
                        : 'text-gray-300 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeLensPill"
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#00f4ff] via-[#1cd8d2] to-[#ffc922]"
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      />
                    )}
                    <LensIcon
                      className={`w-3.5 h-3.5 shrink-0 relative z-10 transition-colors ${
                        isActive ? 'text-black' : 'text-cyan-400'
                      }`}
                    />
                    <span className="relative z-10 truncate">{lens.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          </motion.div>

        {/* The Bento-Box Grid (Clean, spacious cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 w-full">
          {SKILL_MODULES.map((module, mIdx) => {
            const ModuleIcon = module.icon
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: mIdx * 0.05 }}
                className={`group relative rounded-xl p-3.5 sm:p-4 bg-white/[0.02] border ${module.borderColor} backdrop-blur-2xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,244,255,0.1)] flex flex-col justify-between overflow-hidden`}
              >
                {/* Background Ambient Tint */}
                <div
                  className={`absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br ${module.glowColor} blur-[75px] pointer-events-none group-hover:scale-125 transition-transform duration-500`}
                />

                <div>
                  {/* Module Header */}
                  <div className="flex items-center justify-between mb-2 relative z-10">
                    <div className="flex items-center gap-2">
                      <div
                        className="p-1 rounded-md border border-white/10 bg-white/[0.05]"
                        style={{ color: module.accentColor }}
                      >
                        <ModuleIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-tight leading-tight">
                          {module.title}
                        </h3>
                        <span className="text-[9.5px] font-mono text-gray-400">
                          {module.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills Grid - Sleek interactive horizontal pill chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 relative z-10">
                    {module.skills.map((skill) => {
                      const SkillIcon = skill.icon
                      const isHighlighted =
                        activeLens === 'all' || skill.lens.includes(activeLens)

                      return (
                        <motion.button
                          key={skill.name}
                          onClick={() => setSelectedSkill(skill)}
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative px-2 py-1.5 rounded-lg border text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
                            isHighlighted
                              ? 'bg-white/[0.04] border-white/10 hover:border-cyan-400/50 hover:bg-cyan-950/30 hover:shadow-[0_0_12px_rgba(0,244,255,0.15)]'
                              : 'opacity-35 grayscale-[50%] bg-black/40 border-white/5 hover:opacity-75'
                          }`}
                        >
                          {/* Left: Icon + Skill Name */}
                          <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-1">
                            <SkillIcon
                              className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                                isHighlighted ? 'text-white' : 'text-gray-500'
                              }`}
                            />
                            <span className="text-[11px] font-semibold text-gray-200 truncate">
                              {skill.name}
                            </span>
                          </div>

                          {/* Right: Telemetry Status Indicator */}
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              skill.statusColor === 'emerald'
                                ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                                : skill.statusColor === 'cyan'
                                ? 'bg-[#00f4ff] shadow-[0_0_6px_#00f4ff]'
                                : 'bg-[#ffc922] shadow-[0_0_6px_#ffc922]'
                            }`}
                            title={skill.tier}
                          />

                          {/* Subtle active border glow */}
                          {isHighlighted && activeLens !== 'all' && (
                            <div className="absolute inset-0 rounded-lg border border-cyan-400/40 pointer-events-none" />
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Footer Telemetry Legend */}
                <div className="mt-2 pt-1 border-t border-white/[0.06] flex items-center justify-between text-[9px] font-mono text-gray-400 relative z-10">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Daily Driver
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Deep Focus
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffc922]" />
                    Certified / R&D
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Interactive Skill Inspector Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSkill(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-[#0a0d1a] border border-cyan-400/40 shadow-[0_0_50px_rgba(0,244,255,0.25)] text-white overflow-hidden"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00f4ff] via-[#ffc922] to-[#00bf8f]" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedSkill(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <LuX className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/10 text-cyan-300">
                  <selectedSkill.icon className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                    {selectedSkill.category}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight">
                    {selectedSkill.name}
                  </h3>
                </div>
              </div>

              {/* Status and Tier Badge */}
              <div className="flex items-center gap-3 mb-6 text-xs font-mono">
                <span className="px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-950/40 text-cyan-300 flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      selectedSkill.statusColor === 'emerald'
                        ? 'bg-emerald-400'
                        : selectedSkill.statusColor === 'cyan'
                        ? 'bg-cyan-400'
                        : 'bg-amber-400'
                    }`}
                  />
                  {selectedSkill.tier}
                </span>
                <span className="text-gray-400">
                  Architecture Role Verified
                </span>
              </div>

              {/* Architectural Highlight */}
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <LuInfo className="w-3.5 h-3.5 text-cyan-400" />
                    Production Implementation
                  </div>
                  <p className="text-gray-200 leading-relaxed bg-white/[0.03] p-3.5 rounded-xl border border-white/5">
                    {selectedSkill.highlight}
                  </p>
                </div>

                <div>
                  <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <LuCheck className="w-3.5 h-3.5 text-[#ffc922]" />
                    Applied in Real Project / Pipeline
                  </div>
                  <div className="text-cyan-300 font-medium bg-cyan-950/20 p-3 rounded-xl border border-cyan-400/20">
                    {selectedSkill.project}
                  </div>
                </div>
              </div>

              {/* Modal Footer CTA */}
              <div className="mt-7 pt-4 border-t border-white/10 flex items-center justify-between">
                <a
                  href="#projects"
                  onClick={() => setSelectedSkill(null)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-cyan-400 transition-colors"
                >
                  View Featured Projects <LuExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setSelectedSkill(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Close Inspector
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Skills