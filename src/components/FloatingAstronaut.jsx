import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import avatar from '../assets/avatar.png'

// Warm, simple greetings (clean, no tech clutter, no copilot)
const WARM_GREETINGS = [
  "Hey! Welcome to my world 👋",
  "Glad you're here! Feel free to explore ✨",
  "Floating through space & building cool things 🚀",
  "Enjoy your flight around my portfolio 🪐"
]

export default function FloatingAstronaut() {
  const containerRef = useRef(null)
  const hideTimeoutRef = useRef(null)

  // Smooth mouse tilt tracking for physical depth
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { stiffness: 100, damping: 24, mass: 0.8 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  // Gentle 2D-friendly perspective tilt to avoid font rasterization blur
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [5, -5])
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-6, 6])
  const transX = useTransform(smoothX, [-0.5, 0.5], [-12, 12])
  const transY = useTransform(smoothY, [-0.5, 0.5], [-12, 12])

  // Interaction states
  const [isHovered, setIsHovered] = useState(false)
  const [isRecoiling, setIsRecoiling] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [activeGreetingIndex, setActiveGreetingIndex] = useState(0)
  const [showBubble, setShowBubble] = useState(false)

  // Clear dismiss timer
  const clearHideTimer = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
  }

  // Hover: Warm welcome pops up cleanly
  const handleMouseEnter = () => {
    clearHideTimer()
    setIsHovered(true)
    setShowBubble(true)
  }

  // Mouse leave: Closes smoothly after a natural pause
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
    clearHideTimer()
    hideTimeoutRef.current = setTimeout(() => {
      setShowBubble(false)
    }, 3200)
  }

  // Mouse coordinate tracking
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width || 1)
    const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height || 1)
    mouseX.set(Math.max(-0.5, Math.min(0.5, x)))
    mouseY.set(Math.max(-0.5, Math.min(0.5, y)))
  }, [mouseX, mouseY])

  // Click: Cycles to next warm greeting + zero-G inertia recoil
  const handleAstronautClick = () => {
    if (isDragging) return
    clearHideTimer()
    setShowBubble(true)
    setActiveGreetingIndex((prev) => (prev + 1) % WARM_GREETINGS.length)
    setIsRecoiling(true)

    setTimeout(() => {
      setIsRecoiling(false)
    }, 900)

    hideTimeoutRef.current = setTimeout(() => {
      if (!isHovered) {
        setShowBubble(false)
      }
    }, 4500)
  }

  useEffect(() => {
    return () => clearHideTimer()
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full flex items-center justify-center select-none"
    >
      {/* Ambient Cosmic Radial Glow (High performance, hardware-accelerated) */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 'min(36vw, 420px)',
          height: 'min(65vh, 540px)',
          background: 'radial-gradient(ellipse at center, rgba(0, 244, 255, 0.12) 0%, rgba(48, 43, 99, 0.18) 50%, transparent 70%)',
          filter: 'blur(45px)',
          transform: 'translateZ(0)',
          willChange: 'opacity',
        }}
      />

      {/* Orbiting Planetary Ring */}
      <motion.div
        className="absolute pointer-events-none border border-cyan-400/10 rounded-full"
        style={{
          width: 'min(42vw, 520px)',
          height: 'min(42vw, 520px)',
          willChange: 'transform',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00f4ff] shadow-[0_0_8px_#00f4ff]" />
        <div className="absolute bottom-6 right-12 w-1 h-1 rounded-full bg-[#ffc922] shadow-[0_0_6px_#ffc922]" />
      </motion.div>

      {/* Draggable & Tilting Astronaut Body */}
      <motion.div
        drag
        dragConstraints={{ top: -50, bottom: 50, left: -60, right: 60 }}
        dragElastic={0.3}
        dragTransition={{ bounceStiffness: 220, bounceDamping: 18 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        style={{
          rotateX,
          rotateY,
          x: transX,
          y: transY,
          cursor: isDragging ? 'grabbing' : 'grab',
          willChange: 'transform',
        }}
        className="relative z-20 flex flex-col items-center justify-center"
      >
        {/* Deep Orbital Drift: Drifting off into space and coming back */}
        <motion.div
          animate={{
            y: [0, -14, -26, -10, 8, 0],
            x: [0, 10, 20, 6, -5, 0],
            scale: [1, 0.96, 0.92, 0.96, 1.01, 1],
            rotateZ: [0, 1.5, 2.8, 0.8, -1.2, 0],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
          style={{ willChange: 'transform' }}
          className="relative inline-block"
        >
          {/* Locked Inner Container for 100% Thruster Alignment */}
          <div className="relative inline-block">
            {/* BACKPACK THRUSTER 1: Main Upper Nozzle (Behind Right Shoulder) */}
            <div
              className="absolute pointer-events-none z-0"
              style={{
                top: '32%',
                left: '68%',
                transform: 'rotate(24deg)',
              }}
            >
              <motion.div
                className="w-3.5 rounded-full bg-gradient-to-b from-white via-[#00f4ff] to-transparent"
                style={{
                  boxShadow: '0 0 12px #00f4ff',
                  willChange: 'height, opacity',
                }}
                animate={
                  isRecoiling || isDragging
                    ? {
                        height: [20, 48, 28, 42, 16],
                        opacity: [0.4, 0.95, 0.5, 0.85, 0.2],
                      }
                    : {
                        height: [14, 24, 16, 26, 14],
                        opacity: [0.3, 0.65, 0.35, 0.65, 0.3],
                      }
                }
                transition={{
                  duration: isRecoiling ? 0.8 : 3.2,
                  repeat: isRecoiling ? 0 : Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>

            {/* BACKPACK THRUSTER 2: Lower Stabilization Nozzle (Right Mid-Back) */}
            <div
              className="absolute pointer-events-none z-0"
              style={{
                top: '44%',
                left: '72%',
                transform: 'rotate(32deg)',
              }}
            >
              <motion.div
                className="w-3 rounded-full bg-gradient-to-b from-white via-[#00f4ff] to-transparent"
                style={{
                  boxShadow: '0 0 10px #00f4ff',
                  willChange: 'height, opacity',
                }}
                animate={
                  isRecoiling || isDragging
                    ? {
                        height: [16, 42, 24, 36, 14],
                        opacity: [0.35, 0.9, 0.45, 0.8, 0.2],
                      }
                    : {
                        height: [12, 20, 14, 22, 12],
                        opacity: [0.25, 0.55, 0.3, 0.55, 0.25],
                      }
                }
                transition={{
                  duration: isRecoiling ? 0.8 : 3.6,
                  repeat: isRecoiling ? 0 : Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>

            {/* LEFT RCS MICRO-VENT: Upper Left Shoulder (Attitude Stabilizer) */}
            <div
              className="absolute pointer-events-none z-0"
              style={{
                top: '25%',
                left: '42%',
                transform: 'rotate(-42deg)',
              }}
            >
              <motion.div
                className="w-2 rounded-full bg-gradient-to-b from-white/90 via-[#00f4ff]/70 to-transparent"
                style={{
                  boxShadow: '0 0 6px #00f4ff',
                  willChange: 'height, opacity',
                }}
                animate={
                  isRecoiling || isDragging
                    ? {
                        height: [10, 26, 16, 22, 10],
                        opacity: [0.3, 0.85, 0.4, 0.75, 0.2],
                      }
                    : {
                        height: [8, 14, 10, 16, 8],
                        opacity: [0.2, 0.45, 0.25, 0.45, 0.2],
                      }
                }
                transition={{
                  duration: isRecoiling ? 0.8 : 3.0,
                  repeat: isRecoiling ? 0 : Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>

            {/* Astronaut Avatar Image */}
            <motion.img
              src={avatar}
              alt="Akarsh J"
              onClick={handleAstronautClick}
              whileTap={{ scale: 0.97 }}
              animate={
                isRecoiling
                  ? {
                      scale: [1, 0.96, 1.01, 1],
                      y: [0, 5, -2, 0],
                    }
                  : {
                      scale: 1,
                    }
              }
              transition={{
                duration: 0.85,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="relative z-10 object-contain select-none cursor-pointer"
              style={{
                width: 'min(44vw, 680px)',
                maxHeight: 'min(82vh, 740px)',
                filter: isHovered
                  ? 'drop-shadow(0 0 16px rgba(0, 244, 255, 0.4))'
                  : 'drop-shadow(0 0 8px rgba(0, 244, 255, 0.18))',
                willChange: 'transform',
              }}
              draggable={false}
            />

            {/* CRISP, ULTRA-FAST WARM WELCOME BUBBLE */}
            {/* Rendered in razor-sharp 2D space: No 3D blur, no font scaling blur, 100% crisp typography */}
            <AnimatePresence>
              {showBubble && (
                <motion.div
                  key="welcome-bubble"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="absolute -top-3 -left-2 sm:-left-6 lg:-left-12 z-40 pointer-events-auto"
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    textRendering: 'optimizeLegibility',
                  }}
                >
                  <div className="relative px-4 py-2.5 rounded-2xl bg-[#090e1a]/95 border border-cyan-400/40 shadow-[0_4px_20px_rgba(0,0,0,0.6),0_0_15px_rgba(0,244,255,0.2)] flex items-center gap-2 whitespace-nowrap">
                    {/* Live pulse dot */}
                    <span className="relative flex h-2 w-2 flex-shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                    </span>

                    {/* Warm, friendly welcome text - 100% crisp and readable */}
                    <p className="text-sm font-semibold text-white tracking-normal select-none">
                      {WARM_GREETINGS[activeGreetingIndex]}
                    </p>

                    {/* Speech Pointer stem towards helmet */}
                    <div className="absolute -bottom-1.5 right-8 w-2.5 h-2.5 bg-[#090e1a] border-r border-b border-cyan-400/40 transform rotate-45" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Clean Subtle Hint */}
      <div
        className="absolute bottom-4 right-6 text-[11px] font-mono text-gray-400 tracking-wider flex items-center gap-2 pointer-events-none transition-opacity duration-300"
        style={{ opacity: isHovered ? 0.8 : 0.3 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span>HOVER OR TAP TO GREET</span>
      </div>
    </div>
  )
}
