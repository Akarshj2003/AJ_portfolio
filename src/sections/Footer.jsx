import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FiClock, 
  FiMapPin, 
  FiArrowUp, 
  FiMail 
} from 'react-icons/fi'
import { FaGithub, FaLinkedin, FaRocket } from 'react-icons/fa'
import logo from '../assets/logo.png'

const Footer = ({ onAskAI }) => {
  const [timeStr, setTimeStr] = useState('')
  const [isLaunching, setIsLaunching] = useState(false)

  // Live Earth IST Time (UTC+5:30)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const formatted = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      setTimeStr(formatted)
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const scrollToTop = () => {
    setIsLaunching(true)
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    setTimeout(() => {
      setIsLaunching(false)
    }, 1200)
  }

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
    { label: 'Resume', href: `${import.meta.env.BASE_URL.replace(/\/$/, '')}/resume.pdf`, external: true },
  ]

  return (
    <footer className="relative w-full bg-black text-white overflow-hidden select-none isolate">
      
      {/* ─────────────────────────────────────────────────────────────
          1. PLANETARY HORIZON & ATMOSPHERE (CELESTIAL SURFACE)
      ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden pointer-events-none">
        
        {/* Deep Atmosphere Radial Rim Glow (Rayleigh scattering) */}
        <div 
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[140vw] sm:w-[120vw] h-[280px] sm:h-[340px] rounded-[100%] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 100%, rgba(0, 244, 255, 0.22) 0%, rgba(48, 43, 99, 0.35) 45%, transparent 75%)',
            filter: 'blur(35px)',
          }}
        />

        {/* Ambient Pulsing Star Dust on Horizon */}
        <div className="absolute top-0 inset-x-0 h-40 overflow-hidden pointer-events-none opacity-60">
          <div className="absolute top-6 left-[15%] w-1 h-1 rounded-full bg-white animate-ping" style={{ animationDuration: '4s' }} />
          <div className="absolute top-12 left-[32%] w-1.5 h-1.5 rounded-full bg-[#00f4ff] shadow-[0_0_8px_#00f4ff] animate-pulse" />
          <div className="absolute top-8 right-[24%] w-1 h-1 rounded-full bg-[#ffc922] shadow-[0_0_6px_#ffc922] animate-ping" style={{ animationDuration: '6s' }} />
          <div className="absolute top-14 right-[12%] w-1.5 h-1.5 rounded-full bg-white opacity-80" />
        </div>

        {/* Planetary Curvature & Mountain Silhouette SVG */}
        <svg
          viewBox="0 0 1440 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block transform scale-y-105 origin-bottom"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Atmosphere Neon Rim Gradient */}
            <linearGradient id="planetRimGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#302b63" stopOpacity="0.3" />
              <stop offset="25%" stopColor="#00f4ff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="75%" stopColor="#00f4ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffc922" stopOpacity="0.4" />
            </linearGradient>

            {/* Inner Planetary Body Gradient */}
            <linearGradient id="planetBodyGradient" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#090e1c" />
              <stop offset="40%" stopColor="#060913" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
          </defs>

          {/* Distant Ridge (Subtle Lunar topography) */}
          <path
            d="M0,130 Q360,90 720,80 Q1080,90 1440,130 L1440,220 L0,220 Z"
            fill="#050811"
            opacity="0.7"
          />

          {/* Foreground Planet Curve with Atmosphere Corona */}
          <path
            d="M-40,140 Q720,28 1480,140 L1480,220 L-40,220 Z"
            fill="url(#planetBodyGradient)"
          />

          {/* Atmospheric Rim Line (The glowing edge of the planet) */}
          <path
            d="M-40,140 Q720,28 1480,140"
            stroke="url(#planetRimGlow)"
            strokeWidth="2.5"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(0, 244, 255, 0.7)) drop-shadow(0 0 25px rgba(0, 244, 255, 0.4))',
            }}
          />
        </svg>

        {/* Surface Lunar Base Telemetry Beacon (Station Light) */}
        <div className="absolute top-[86px] sm:top-[74px] left-[50%] -translate-x-1/2 flex flex-col items-center pointer-events-none">
          {/* Pulsing Beacon Tower Light */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f4ff] opacity-80" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white shadow-[0_0_12px_#00f4ff]" />
          </span>
          <div className="h-6 w-[1px] bg-gradient-to-b from-[#00f4ff] to-transparent opacity-60" />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. ORBITAL LAUNCH ROCKET (BACK TO TOP BOOSTER)
      ───────────────────────────────────────────────────────────── */}
      <div className="relative z-20 flex flex-col items-center -mt-10 sm:-mt-12 mb-8">
        <motion.button
          onClick={scrollToTop}
          whileHover={{ scale: 1.08, y: -6 }}
          whileTap={{ scale: 0.94 }}
          className="group relative flex flex-col items-center focus:outline-none"
          aria-label="Orbital launch: return to top of portfolio"
        >
          {/* Glowing Rocket Vessel Circle */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#090e1c] border border-cyan-400/50 flex items-center justify-center text-xl sm:text-2xl text-cyan-300 shadow-[0_0_25px_rgba(0,244,255,0.35)] group-hover:shadow-[0_0_40px_rgba(0,244,255,0.8)] group-hover:border-cyan-300 transition-all duration-300">
            <FaRocket 
              className={`transform transition-transform duration-500 ${
                isLaunching ? '-translate-y-4 scale-125 text-[#ffc922]' : 'group-hover:-translate-y-1'
              }`} 
            />

            {/* Thruster Exhaust Jet Flame */}
            <motion.div
              className="absolute -bottom-4 w-3.5 rounded-full bg-gradient-to-b from-white via-[#00f4ff] to-transparent"
              style={{
                boxShadow: '0 0 14px #00f4ff',
                willChange: 'height, opacity',
              }}
              animate={
                isLaunching
                  ? { height: [24, 48, 20], opacity: [0.9, 1, 0.4] }
                  : { height: [8, 18, 8], opacity: [0.4, 0.8, 0.4] }
              }
              transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          {/* Kinetic Tooltip Prompt */}
          <div className="mt-5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-cyan-500/30 text-[10px] sm:text-xs font-mono text-cyan-300 tracking-wider shadow-lg group-hover:border-cyan-400 group-hover:text-white transition-all">
            <FiArrowUp className="text-xs animate-bounce" />
            <span>ORBITAL LAUNCH // RETURN TO TOP</span>
          </div>
        </motion.button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. COSMIC FLIGHT DECK (TELEMETRY, LINKS, SOCIALS)
      ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-6 pb-14 flex flex-col gap-10">
        
        {/* Top Flight Deck Tier: Brand Identity & Telemetry Clocks */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-8 border-b border-white/[0.08]">
          
          {/* Brand Signature (5 Cols) */}
          <div className="md:col-span-5 flex flex-col gap-3 text-center md:text-left items-center md:items-start">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Akarsh J logo" className="w-9 h-9 object-contain drop-shadow-[0_0_10px_#00f4ff]" />
              <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-[#00f4ff]">
                Akarsh J
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed">
              Software developer driven by curiosity, cosmic precision, and the power of intelligent systems.
            </p>
          </div>

          {/* Earth Telemetry Flight Deck (4 Cols) */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start gap-2 bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span>EARTH TELEMETRY // ASIA-KOLKATA</span>
            </div>

            <div className="flex items-baseline gap-2 font-mono">
              <FiClock className="text-sm text-[#ffc922]" />
              <span className="text-xl font-bold text-white tracking-widest">
                {timeStr || '12:00:00'}
              </span>
              <span className="text-xs text-gray-400">IST (UTC+5:30)</span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400">
              <FiMapPin className="text-cyan-400 shrink-0" />
              <span>Bangalore Base: 12.9716° N, 77.5946° E</span>
            </div>
          </div>

          {/* Social Satellite Outlinks (3 Cols) */}
          <div className="md:col-span-3 flex justify-center md:justify-end gap-3">
            {/* GitHub */}
            <a
              href="https://github.com/Akarshj2003"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="w-11 h-11 rounded-xl bg-white/[0.04] hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400 flex items-center justify-center text-lg text-gray-300 hover:text-white shadow-lg hover:shadow-[0_0_15px_#00f4ff] hover:scale-105 active:scale-95 transition-all"
            >
              <FaGithub />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/akarshj2003"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="w-11 h-11 rounded-xl bg-white/[0.04] hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400 flex items-center justify-center text-lg text-gray-300 hover:text-[#00f4ff] shadow-lg hover:shadow-[0_0_15px_#00f4ff] hover:scale-105 active:scale-95 transition-all"
            >
              <FaLinkedin />
            </a>
          </div>

        </div>

        {/* Middle Tier: Mission Telemetry Navigation Links */}
        <div className="flex flex-wrap items-center justify-center md:justify-between gap-6 py-2">
          
          <ul className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm font-medium text-gray-400 font-mono">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="hover:text-cyan-300 hover:drop-shadow-[0_0_8px_#00f4ff] transition-all"
                >
                  {link.label}
                </a>
              </li>
            ))}
            {onAskAI && (
              <li>
                <button
                  type="button"
                  onClick={() => onAskAI("Tell me more about Akarsh J and how to contact him.")}
                  className="text-cyan-400 hover:text-cyan-200 hover:drop-shadow-[0_0_8px_#00f4ff] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>💬 AI Dossier</span>
                </button>
              </li>
            )}
          </ul>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>MISSION STATUS: 100% OPERATIONAL</span>
          </div>

        </div>

        {/* Bottom Tier: Mission Signature & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.05] text-[11px] font-mono text-gray-500 text-center sm:text-left">
          
          <p>
            Designed &amp; Engineered with cosmic physics, React 19 &amp; Gemini AI.
          </p>

          <p>
            © {new Date().getFullYear()} Akarsh J. All rights reserved.
          </p>

        </div>

      </div>

    </footer>
  )
}

export default Footer
