import React, { useState, useEffect, useRef } from 'react';
import { RiRobot3Fill } from "react-icons/ri";
import { IoSparkles } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

function ChatToggleButton({ onOpen }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const hasInteractedRef = useRef(false);

  // Periodic tooltip popup: pops up after 5 seconds, auto-hides after 6 seconds
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      if (!hasInteractedRef.current && !isHovered) {
        setShowTooltip(true);
      }
    }, 5000);

    return () => clearTimeout(initialTimer);
  }, [isHovered]);

  // Auto-dismiss tooltip after 6 seconds so it doesn't linger forever
  useEffect(() => {
    if (showTooltip) {
      const dismissTimer = setTimeout(() => {
        setShowTooltip(false);
      }, 6000);
      return () => clearTimeout(dismissTimer);
    }
  }, [showTooltip]);

  // Periodic gentle nudge once more after 32 seconds if user is still browsing
  useEffect(() => {
    const repeatTimer = setTimeout(() => {
      if (!hasInteractedRef.current && !isHovered) {
        setShowTooltip(true);
      }
    }, 32000);

    return () => clearTimeout(repeatTimer);
  }, [isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Dismiss message box immediately on hover
    setShowTooltip(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (e) => {
    e.preventDefault();
    hasInteractedRef.current = true;
    setShowTooltip(false);
    onOpen();
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Periodic Curiosity Speech Bubble (Auto-fades, dismissed on hover) */}
      <AnimatePresence>
        {showTooltip && !isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 450, damping: 28 }}
            className="pointer-events-auto mb-2.5 max-w-[220px] sm:max-w-[250px] px-3.5 py-2.5 rounded-xl bg-[#080c1a]/95 border border-cyan-400/40 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.85),0_0_20px_rgba(0,244,255,0.25)] text-white text-[11px] leading-snug font-sans relative cursor-pointer group select-none"
            onClick={handleClick}
          >
            <div className="flex items-center gap-1.5 text-cyan-300 font-semibold mb-0.5 text-[10px] uppercase tracking-wider font-mono">
              <IoSparkles className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>AJ Cortex Online</span>
            </div>
            <p className="text-gray-200 group-hover:text-cyan-200 transition-colors">
              👋 Curious about Akarsh's AI models or projects? Ask me!
            </p>
            {/* Speech bubble pointer notch */}
            <div className="absolute -bottom-1.5 right-5 w-3 h-3 bg-[#080c1a] border-b border-r border-cyan-400/40 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Morphing Toggle: Small Round Icon by default -> Expands into Capsule on Hover */}
      <motion.button
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.94 }}
        layout
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`pointer-events-auto relative group flex items-center rounded-full bg-[#080c1a]/95 border border-cyan-400/50 hover:border-cyan-300 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(0,244,255,0.25)] hover:shadow-[0_0_35px_rgba(0,244,255,0.5)] cursor-pointer select-none transition-shadow duration-300 ${
          isHovered ? 'px-3.5 py-2 gap-2.5' : 'w-12 h-12 justify-center p-0'
        }`}
        aria-label="Open AJ Cortex AI Assistant"
      >
        {/* Ambient Radar Beacon Wave (Pulsing around button when round) */}
        {!isHovered && (
          <span className="absolute -inset-1 rounded-full bg-cyan-400/20 animate-ping opacity-40 pointer-events-none" style={{ animationDuration: '3s' }} />
        )}

        {/* Glowing Robot Avatar */}
        <div className="relative flex items-center justify-center shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f4ff]/25 to-[#ffc922]/20 border border-cyan-400/60 flex items-center justify-center text-cyan-300 group-hover:text-white transition-colors shadow-[0_0_12px_rgba(0,244,255,0.4)]">
            <RiRobot3Fill className="w-4.5 h-4.5" />
          </div>
          {/* Live green beacon dot */}
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#080c1a] shadow-[0_0_8px_#10b981]" />
        </div>

        {/* Expanded Capsule Content (Animated in on Hover) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex flex-col items-start leading-none text-left overflow-hidden whitespace-nowrap"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-[13px] font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors font-sans">
                  AJ Cortex
                </span>
                <span className="px-1.5 py-0.2 rounded-full font-mono text-[8px] font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  AI
                </span>
              </div>
              <span className="text-[9.5px] font-mono text-cyan-200/60 mt-0.5">
                Ask Me Anything
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

export default ChatToggleButton;
