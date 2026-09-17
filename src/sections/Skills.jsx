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
  LuSparkles,
  LuTerminal,
  LuDatabase,
  LuCheck,
  LuInfo,
  LuX,
  LuCpu,
  LuBoxes,
  LuBrainCircuit,
  LuGlobe,
} from 'react-icons/lu'
import { RiRobot3Line } from 'react-icons/ri'

// Clean, intuitive category filters
const SKILL_CATEGORIES = [
  { id: 'all', label: 'All Skills', icon: LuBoxes },
  { id: 'ai', label: 'AI & Machine Learning', icon: LuBrainCircuit },
  { id: 'web', label: 'Frontend & Web', icon: LuGlobe },
  { id: 'backend', label: 'Backend & APIs', icon: LuDatabase },
  { id: 'tools', label: 'Tools & DevOps', icon: LuTerminal },
]

// Streamlined Skill Registry — Easy to understand, on-point
const SKILL_MODULES = [
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    icon: RiRobot3Line,
    glowColor: 'from-[#00f4ff]/20 to-[#302b63]/40',
    borderColor: 'border-cyan-500/30',
    accentColor: '#00f4ff',
    badge: 'Focus Area',
    skills: [
      {
        name: 'Python',
        icon: SiPython,
        tier: 'Core Language',
        statusColor: 'emerald',
        lens: ['all', 'ai', 'backend'],
        summary: 'Primary language for AI modeling, backend scripts, and data processing.',
        project: 'Safari Voice Assistant, Heart Disease ML',
      },
      {
        name: 'PyTorch',
        icon: SiPytorch,
        tier: 'Deep Learning',
        statusColor: 'cyan',
        lens: ['all', 'ai'],
        summary: 'Building neural networks, computer vision, and training ML classifiers.',
        project: 'AI-Generated Text Detection, RL Dino Game',
      },
      {
        name: 'Gemini & GenAI',
        icon: LuSparkles,
        tier: 'LLMs & Agents',
        statusColor: 'emerald',
        lens: ['all', 'ai'],
        summary: 'Integrating LLMs, smart chat agents, and function calling.',
        project: 'Portfolio AI Companion, Context Search',
      },
      {
        name: 'RAG & Vector Search',
        icon: TbBinaryTree,
        tier: 'Document AI',
        statusColor: 'emerald',
        lens: ['all', 'ai', 'backend'],
        summary: 'Connecting AI models to PDFs and documents for instant question answering.',
        project: 'College Voice Assistant, Document Q&A',
      },
      {
        name: 'Edge AI (NVIDIA)',
        icon: SiNvidia,
        tier: 'Hardware & Vision',
        statusColor: 'amber',
        lens: ['all', 'ai', 'tools'],
        summary: 'Running real-time computer vision models on local NVIDIA Jetson devices.',
        project: 'Real-Time Edge Vision Models',
      },
      {
        name: 'NLP & Transformers',
        icon: TbBrain,
        tier: 'Language Models',
        statusColor: 'cyan',
        lens: ['all', 'ai'],
        summary: 'Classifying text, understanding intent, and detecting AI vs. human writing.',
        project: 'Synthetix AI Text Detector',
      },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend & Web Development',
    icon: LuGlobe,
    glowColor: 'from-[#ffc922]/20 to-[#00f4ff]/20',
    borderColor: 'border-amber-400/30',
    accentColor: '#ffc922',
    badge: 'UI & Design',
    skills: [
      {
        name: 'React 19',
        icon: SiReact,
        tier: 'Daily Driver',
        statusColor: 'emerald',
        lens: ['all', 'web'],
        summary: 'Building modern, fast, and responsive user interfaces.',
        project: 'Portfolio V2, Movie Booking Web App',
      },
      {
        name: 'TypeScript',
        icon: SiTypescript,
        tier: 'Type-Safe Code',
        statusColor: 'emerald',
        lens: ['all', 'web', 'backend'],
        summary: 'Writing reliable, bug-free frontend and backend code with clear types.',
        project: 'Web Applications, Shared Data Models',
      },
      {
        name: 'JavaScript',
        icon: SiJavascript,
        tier: 'Core Web',
        statusColor: 'emerald',
        lens: ['all', 'web'],
        summary: 'Creating dynamic page interactions, animations, and modern web apps.',
        project: 'Interactive UI, Client Logic',
      },
      {
        name: 'Tailwind CSS',
        icon: SiTailwindcss,
        tier: 'Styling',
        statusColor: 'emerald',
        lens: ['all', 'web'],
        summary: 'Crafting custom, responsive dark-mode designs and clean layouts.',
        project: 'Portfolio & Full-Stack Projects',
      },
      {
        name: 'Next.js',
        icon: SiNextdotjs,
        tier: 'React Framework',
        statusColor: 'cyan',
        lens: ['all', 'web'],
        summary: 'Server-side rendering, fast routing, and modern web app development.',
        project: 'Next.js Web Applications',
      },
      {
        name: 'Vite',
        icon: SiVite,
        tier: 'Build Tool',
        statusColor: 'emerald',
        lens: ['all', 'web', 'tools'],
        summary: 'Lightning-fast development server and optimized production bundles.',
        project: 'Portfolio V2 & Modern Web Apps',
      },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Databases',
    icon: LuDatabase,
    glowColor: 'from-[#00bf8f]/20 to-[#302b63]/30',
    borderColor: 'border-emerald-500/30',
    accentColor: '#00bf8f',
    badge: 'APIs & Data',
    skills: [
      {
        name: 'Node.js & Express',
        icon: SiNodedotjs,
        tier: 'API Development',
        statusColor: 'emerald',
        lens: ['all', 'backend'],
        summary: 'Building lightweight, fast REST APIs and backend servers.',
        project: 'Portfolio Notification Relay, Booking API',
      },
      {
        name: 'MongoDB',
        icon: SiMongodb,
        tier: 'NoSQL Database',
        statusColor: 'emerald',
        lens: ['all', 'backend'],
        summary: 'Storing flexible document data for web applications and user sessions.',
        project: 'CinePass Movie Reservation Database',
      },
      {
        name: 'PostgreSQL & SQL',
        icon: SiPostgresql,
        tier: 'Relational DB',
        statusColor: 'cyan',
        lens: ['all', 'backend'],
        summary: 'Designing structured tables, relationships, and reliable queries.',
        project: 'Relational Schema & Data Projects',
      },
      {
        name: 'RESTful APIs',
        icon: SiExpress,
        tier: 'Architecture',
        statusColor: 'emerald',
        lens: ['all', 'backend'],
        summary: 'Designing clean endpoints connecting frontend apps to backend data.',
        project: 'Full-Stack Applications',
      },
      {
        name: 'Postman',
        icon: SiPostman,
        tier: 'API Testing',
        statusColor: 'emerald',
        lens: ['all', 'backend', 'tools'],
        summary: 'Testing endpoints, verifying status codes, and debugging APIs.',
        project: 'API Development & Quality Checks',
      },
      {
        name: 'MySQL & SQLite',
        icon: SiMysql,
        tier: 'Structured SQL',
        statusColor: 'cyan',
        lens: ['all', 'backend'],
        summary: 'Managing relational databases for web projects and local tools.',
        project: 'Database Management Systems',
      },
    ],
  },
  {
    id: 'tools',
    title: 'Tools & Engineering Workflow',
    icon: LuTerminal,
    glowColor: 'from-[#302b63]/40 to-[#00f4ff]/20',
    borderColor: 'border-purple-500/30',
    accentColor: '#a78bfa',
    badge: 'DevOps & Foundations',
    skills: [
      {
        name: 'Git & GitHub',
        icon: SiGit,
        tier: 'Version Control',
        statusColor: 'emerald',
        lens: ['all', 'tools'],
        summary: 'Code versioning, branch workflows, and collaborating on open-source projects.',
        project: 'All Repositories & CI/CD',
      },
      {
        name: 'Docker',
        icon: SiDocker,
        tier: 'Containers',
        statusColor: 'cyan',
        lens: ['all', 'tools'],
        summary: 'Packaging applications and dependencies into reproducible containers.',
        project: 'Containerized Services',
      },
      {
        name: 'Linux / Bash',
        icon: SiLinux,
        tier: 'Command Line',
        statusColor: 'emerald',
        lens: ['all', 'tools'],
        summary: 'Command-line scripting, server management, and automated workflows.',
        project: 'Linux Dev Environment & Server Scripts',
      },
      {
        name: 'C / C++',
        icon: LuCpu,
        tier: 'Foundations',
        statusColor: 'amber',
        lens: ['all', 'tools'],
        summary: 'Memory management, pointers, and strong computer science fundamentals.',
        project: 'Academic Projects & Algorithms',
      },
      {
        name: 'C# & .NET',
        icon: TbBrandCSharp,
        tier: 'Desktop & Web',
        statusColor: 'cyan',
        lens: ['all', 'tools', 'backend'],
        summary: 'Object-oriented programming, desktop software, and backend services.',
        project: 'Enterprise Application Labs',
      },
      {
        name: 'VS Code & Tooling',
        icon: LuTerminal,
        tier: 'Daily Environment',
        statusColor: 'emerald',
        lens: ['all', 'tools'],
        summary: 'Streamlined development with linters, debuggers, and modern extensions.',
        project: 'Daily Coding Workflow',
      },
    ],
  },
]

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedSkill, setSelectedSkill] = useState(null)

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
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#00f4ff] to-[#ffc922]"
          >
            Skills &amp; Technologies
          </motion.h2>
          <p className="mt-2 text-gray-400 text-sm max-w-md">
            The languages, frameworks, and tools I use to build fast web apps and intelligent systems.
          </p>
        </div>

        {/* Clean Category Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-1.5 items-center w-full"
        >
          <div className="w-full max-w-2xl p-1 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 w-full">
              {SKILL_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id
                const CatIcon = cat.icon

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`relative px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 text-center select-none ${
                      isActive
                        ? 'text-black font-semibold shadow-[0_0_20px_#00f4ff]'
                        : 'text-gray-300 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryPill"
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#00f4ff] via-[#1cd8d2] to-[#ffc922]"
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      />
                    )}
                    <CatIcon
                      className={`w-3.5 h-3.5 shrink-0 relative z-10 transition-colors ${
                        isActive ? 'text-black' : 'text-cyan-400'
                      }`}
                    />
                    <span className="relative z-10 truncate">{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Skill Cards Grid */}
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
                className={`group relative rounded-xl p-4 bg-white/[0.02] border ${module.borderColor} backdrop-blur-2xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,244,255,0.1)] flex flex-col justify-between overflow-hidden`}
              >
                {/* Background Ambient Glow */}
                <div
                  className={`absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br ${module.glowColor} blur-[75px] pointer-events-none group-hover:scale-125 transition-transform duration-500`}
                />

                <div>
                  {/* Module Header */}
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <div className="flex items-center gap-2">
                      <div
                        className="p-1.5 rounded-md border border-white/10 bg-white/[0.05]"
                        style={{ color: module.accentColor }}
                      >
                        <ModuleIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-tight leading-tight">
                          {module.title}
                        </h3>
                        <span className="text-[10px] font-mono text-gray-400">
                          {module.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 relative z-10">
                    {module.skills.map((skill) => {
                      const SkillIcon = skill.icon
                      const isHighlighted =
                        activeCategory === 'all' || skill.lens.includes(activeCategory)

                      return (
                        <motion.button
                          key={skill.name}
                          onClick={() => setSelectedSkill(skill)}
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative px-2.5 py-2 rounded-lg border text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
                            isHighlighted
                              ? 'bg-white/[0.04] border-white/10 hover:border-cyan-400/50 hover:bg-cyan-950/30 hover:shadow-[0_0_12px_rgba(0,244,255,0.15)]'
                              : 'opacity-35 grayscale-[50%] bg-black/40 border-white/5 hover:opacity-75'
                          }`}
                        >
                          {/* Icon + Skill Name */}
                          <div className="flex items-center gap-2 min-w-0 flex-1 mr-1">
                            <SkillIcon
                              className={`w-4 h-4 shrink-0 transition-colors ${
                                isHighlighted ? 'text-white' : 'text-gray-500'
                              }`}
                            />
                            <span className="text-xs font-semibold text-gray-200 truncate">
                              {skill.name}
                            </span>
                          </div>

                          {/* Subtle active border glow */}
                          {isHighlighted && activeCategory !== 'all' && (
                            <div className="absolute inset-0 rounded-lg border border-cyan-400/40 pointer-events-none" />
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Footer hint */}
                <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-gray-400 relative z-10">
                  <span>Click any skill to learn more</span>
                  <span className="text-cyan-400">● Active</span>
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
              className="relative w-full max-w-md p-6 rounded-2xl bg-[#0a0d1a] border border-cyan-400/40 shadow-[0_0_50px_rgba(0,244,255,0.25)] text-white overflow-hidden"
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
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-cyan-300">
                  <selectedSkill.icon className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">
                    {selectedSkill.tier}
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">
                    {selectedSkill.name}
                  </h3>
                </div>
              </div>

              {/* What I Use It For */}
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <LuInfo className="w-3.5 h-3.5 text-cyan-400" />
                    What I use it for
                  </div>
                  <p className="text-gray-200 leading-relaxed bg-white/[0.03] p-3 rounded-xl border border-white/5 text-xs sm:text-sm">
                    {selectedSkill.summary}
                  </p>
                </div>

                <div>
                  <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <LuCheck className="w-3.5 h-3.5 text-[#ffc922]" />
                    Featured In Projects
                  </div>
                  <div className="text-gray-300 bg-white/[0.03] p-3 rounded-xl border border-white/5 text-xs font-mono">
                    {selectedSkill.project}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Skills