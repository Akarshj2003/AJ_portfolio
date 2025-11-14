import React, { useState, useEffect } from 'react'
import { RiRobot3Fill } from "react-icons/ri";
import { motion } from "framer-motion";

const glowVariants = {
  idleGlow: {
    scale: [1, 1.05, 1],
    filter: [
      "drop-shadow(0 0 15px #00f4ff)",
      "drop-shadow(0 0 20px #00f4ff)",
      "drop-shadow(0 0 30px #00f4ff)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },

  hover: {
    scale: 1.25,
    y: -6,
    filter: "drop-shadow(0 0 25px #00f4ff)",
    transition: { type: "spring", stiffness: 300, damping: 15 }
  },

  tap: {
    scale: 0.9,
    transition: { duration: 0.1 }
  }
};

function ChatToggleButton({ onOpen }) {

  const [isIdle, setIsIdle] = useState(true);

  // Resume animations 10s after hover ends
  const handleMouseLeave = () => {
    setIsIdle(false);

    setTimeout(() => setIsIdle(true), 10000); // 10 seconds
  };

  return (
    <motion.a
      href="#"
      variants={glowVariants}
      onClick={(e) => { e.preventDefault(); onOpen(); }}

      // This runs the glow only when idle
      animate={isIdle ? "idleGlow" : ""}
      whileHover="hover"
      whileTap="tap"

      onMouseEnter={() => setIsIdle(false)} // stop jump + glow
      onMouseLeave={handleMouseLeave}       // resume after 10 sec

      className={`fixed bottom-6 right-6 z-50 p-2 
        ${isIdle ? "animate-jump" : ""}`}
    >
      <RiRobot3Fill className="w-12 h-12 text-cyan-400" />
    </motion.a>
  );
}

export default ChatToggleButton;
