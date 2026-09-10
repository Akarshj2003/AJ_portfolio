import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../data/projectsData';
import ShootingStars from '../components/ShootingStars';
import { 
  FiExternalLink, 
  FiGithub, 
  FiChevronLeft, 
  FiChevronRight, 
  FiCpu, 
  FiActivity, 
  FiShield, 
  FiLayers,
  FiEye,
  FiMic,
  FiTerminal
} from 'react-icons/fi';

// Visual Icon mapping for each project's primary discipline
const DisciplineIcon = ({ iconType, className }) => {
  switch (iconType) {
    case 'ai':
      return <FiCpu className={className} />;
    case 'brain':
      return <FiLayers className={className} />;
    case 'eye':
      return <FiEye className={className} />;
    case 'voice':
      return <FiMic className={className} />;
    case 'ticket':
      return <FiActivity className={className} />;
    case 'health':
      return <FiShield className={className} />;
    default:
      return <FiTerminal className={className} />;
  }
};

// Interactive mini-simulations inside card previews
const LiveCardSimulation = ({ type }) => {
  if (type === 'dino') {
    return (
      <div className="absolute inset-0 flex flex-col justify-end p-2.5 overflow-hidden bg-black/75 font-mono text-[9px]">
        <div className="flex justify-between items-center text-cyan-400 font-bold mb-1.5 opacity-90">
          <span>AI AGENT: DQN</span>
          <span className="animate-pulse text-[8px]">HI 01420 · 60FPS</span>
        </div>
        <div className="relative h-10 border-b border-cyan-400/40 w-full flex items-end">
          {/* Animated jumping dino */}
          <div className="absolute left-5 bottom-0 w-4 h-5 bg-cyan-400 rounded-xs animate-bounce flex items-center justify-center shadow-[0_0_8px_#00f4ff]">
            <span className="text-[6.5px] text-black font-extrabold">AI</span>
          </div>
          {/* Scrolling cactus obstacle */}
          <div className="absolute right-0 bottom-0 w-2 h-3.5 bg-red-400/80 rounded-t-xs animate-[ping_1.6s_cubic-bezier(0,0,0.2,1)_infinite]" />
        </div>
        <div className="mt-1 text-[7.5px] text-gray-400 flex justify-between">
          <span>REWARD: +14.2</span>
          <span className="text-emerald-400 font-semibold">ACTION: JUMP</span>
        </div>
      </div>
    );
  }

  if (type === 'nlp') {
    return (
      <div className="absolute inset-0 flex flex-col justify-between p-2.5 bg-black/80 font-mono text-[9px]">
        <div className="flex justify-between items-center text-amber-400 font-semibold">
          <span>BERT ATTENTION POOL</span>
          <span className="text-[8px] px-1 py-0.2 rounded bg-amber-400/20 text-amber-300">TRANSFORMER</span>
        </div>
        <div className="space-y-1 my-auto">
          <div className="flex justify-between text-[8px] text-gray-300">
            <span>Human Stylometry:</span>
            <span className="text-gray-400">4.2%</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full w-[95.8%] shadow-[0_0_8px_#ffc922]" />
          </div>
          <div className="flex justify-between text-[8.5px] text-amber-300 font-bold">
            <span>AI Probability:</span>
            <span>95.8% [SYNTHETIC]</span>
          </div>
        </div>
        <div className="text-[7.5px] text-gray-400 truncate">
          &gt; Perplexity: 14.8 · Entropy: LOW
        </div>
      </div>
    );
  }

  if (type === 'vision') {
    return (
      <div className="absolute inset-0 flex flex-col justify-between p-2.5 bg-black/80 font-mono text-[9px]">
        <div className="flex justify-between items-center text-rose-400 font-bold">
          <span>VQA SCENE DETECTOR</span>
          <span className="animate-pulse text-[7.5px] text-rose-300">● STREAM</span>
        </div>
        <div className="relative border border-dashed border-rose-400/50 rounded p-1.5 my-auto bg-rose-950/20">
          <div className="text-[8px] text-rose-300 font-semibold mb-0.5">[PEDESTRIAN CROSSING]</div>
          <div className="text-[7.5px] text-gray-300">Dist: 2.8m · Signal: WALK (GREEN)</div>
          <div className="text-[7.5px] text-emerald-400 mt-0.5">TTS: "Safe to proceed."</div>
        </div>
        <div className="text-[7.5px] text-gray-400">FPS: 32 · Latency: 180ms</div>
      </div>
    );
  }

  if (type === 'voice') {
    return (
      <div className="absolute inset-0 flex flex-col justify-between p-2.5 bg-black/80 font-mono text-[9px]">
        <div className="flex justify-between items-center text-teal-400 font-semibold">
          <span>SAFARI VOICE RECOG</span>
          <span className="text-[7.5px] bg-teal-400/20 px-1 rounded text-teal-300">ACTIVE RAG</span>
        </div>
        {/* Animated wave bars */}
        <div className="flex items-center justify-center gap-1 h-8 my-auto">
          {[40, 75, 100, 60, 90, 45, 80, 55, 95, 30].map((h, idx) => (
            <div 
              key={idx} 
              className="w-1 bg-teal-400 rounded-full animate-pulse shadow-[0_0_6px_#00bf8f]" 
              style={{ height: `${h}%`, animationDelay: `${idx * 80}ms` }}
            />
          ))}
        </div>
        <div className="text-[7.5px] text-teal-200 truncate">
          &gt; Query: "Show Semester 6 Syllabus"
        </div>
      </div>
    );
  }

  if (type === 'grid') {
    return (
      <div className="absolute inset-0 flex flex-col justify-between p-2.5 bg-black/80 font-mono text-[9px]">
        <div className="flex justify-between items-center text-violet-400 font-semibold">
          <span>ATOMIC SEAT MAP</span>
          <span className="text-[7.5px] text-emerald-400">SYNCED: 100%</span>
        </div>
        <div className="grid grid-cols-6 gap-0.5 my-auto px-1">
          {Array.from({ length: 18 }).map((_, i) => {
            const isBooked = [1, 4, 7, 8, 12, 13, 16].includes(i);
            const isSelected = i === 10;
            return (
              <div 
                key={i} 
                className={`h-2.5 rounded-xs transition-all ${
                  isSelected 
                    ? 'bg-violet-400 shadow-[0_0_6px_#b48cff]' 
                    : isBooked 
                      ? 'bg-red-500/40' 
                      : 'bg-white/20'
                }`}
              />
            );
          })}
        </div>
        <div className="text-[7.5px] text-gray-400 flex justify-between">
          <span>LOCK: 09:58s</span>
          <span className="text-violet-300 font-bold">SEAT: D10</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-2.5 bg-black/80 font-mono text-[9px]">
      <div className="flex justify-between items-center text-cyan-400 font-semibold">
        <span>ASTRA DB VECTOR SEARCH</span>
        <span className="text-[7.5px] text-cyan-300">CLINICAL TRIAGE</span>
      </div>
      <div className="space-y-0.5 my-auto">
        <div className="text-[8px] text-gray-300">Semantic Cosine: 0.941</div>
        <div className="p-1 rounded bg-cyan-950/40 border border-cyan-400/30 text-[7.5px] text-cyan-200 truncate">
          Matched: "Pediatric Fever Triage"
        </div>
      </div>
      <div className="text-[7.5px] text-emerald-400">Hallucination Guard: SAFE</div>
    </div>
  );
};

const Projects = () => {
  const N = projects.length;
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Orbit physics refs
  // Angle convention: 90 deg is the FRONT APEX (closest to viewer, depth = 1)
  const angleRef = useRef(90);
  const targetAngleRef = useRef(null);
  const isSteeringRef = useRef(false);
  const velocityRef = useRef(0.20); // Smooth, kinetic cruise speed (~27s per full turn)
  const focusBoostRef = useRef(new Array(N).fill(0));
  const activeIndexRef = useRef(0);
  const reqIdRef = useRef(null);
  const orbitContainerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartAngleRef = useRef(90);

  // Resize listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Geometry parameters: calibrated to fit within a single screen viewport
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth < 1024;
  const RADIUS_X = isMobile ? 120 : isTablet ? 180 : Math.max(220, Math.min(270, N * 44));
  const RADIUS_Y_RATIO = isMobile ? 0.13 : 0.15;
  const CRUISE_SPEED = 0.20; // 0.20 deg/frame gives a smooth, noticeable, and natural orbit

  // Smoothly rotate the orbit so project `index` lands at 90 deg (the front apex)
  const jumpToProject = useCallback((index) => {
    // Project `index` angle = angle + (index * 360 / N)
    // We want project `index` to be at 90 deg:
    // angle + (index * 360 / N) = 90  =>  desiredAngle = 90 - (index * 360 / N)
    const desiredAngle = 90 - (index * (360 / N));
    const currentAngle = angleRef.current;
    
    // Find shortest rotational arc
    const diff = (desiredAngle - currentAngle) % 360;
    const shortestDiff = ((diff + 540) % 360) - 180;
    
    targetAngleRef.current = currentAngle + shortestDiff;
    isSteeringRef.current = true;
    setActiveIndex(index);
    activeIndexRef.current = index;
  }, [N]);

  // Navigate next / prev
  const handlePrev = useCallback(() => {
    const prevIdx = (activeIndexRef.current - 1 + N) % N;
    jumpToProject(prevIdx);
  }, [N, jumpToProject]);

  const handleNext = useCallback(() => {
    const nextIdx = (activeIndexRef.current + 1) % N;
    jumpToProject(nextIdx);
  }, [N, jumpToProject]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Pointer drag to scrub orbit
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    dragStartAngleRef.current = angleRef.current;
    isSteeringRef.current = false;
    targetAngleRef.current = null;
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - dragStartXRef.current;
    // Map pixels to rotational degrees
    angleRef.current = dragStartAngleRef.current + (deltaX * 0.35);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Main 60fps 3D Orbit Loop
  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      const isHovered = hoveredIndex !== null;
      const isDragging = isDraggingRef.current;

      // Steering vs Free Cruise
      if (isSteeringRef.current && targetAngleRef.current !== null) {
        angleRef.current = lerp(angleRef.current, targetAngleRef.current, 0.08);
        velocityRef.current = 0;

        if (Math.abs(targetAngleRef.current - angleRef.current) < 0.1) {
          angleRef.current = targetAngleRef.current;
          isSteeringRef.current = false;
          targetAngleRef.current = null;
        }
      } else if (!isDragging) {
        // Auto-cruise: smoothly decelerate to 0 if hovered, else maintain CRUISE_SPEED
        const targetVelocity = isHovered ? 0 : CRUISE_SPEED;
        velocityRef.current = lerp(velocityRef.current, targetVelocity, 0.08);
        angleRef.current = (angleRef.current + velocityRef.current) % 360;
      }

      let bestDepth = -1;
      let bestIdx = 0;

      // Update DOM positions directly for 60fps hardware-accelerated transforms
      if (orbitContainerRef.current) {
        const satellites = orbitContainerRef.current.children;

        for (let i = 0; i < N; i++) {
          const sat = satellites[i];
          if (!sat) continue;

          const baseAngleDeg = angleRef.current + (i * 360 / N);
          const rad = (baseAngleDeg * Math.PI) / 180;

          // Depth from 0 (back apex, rad = 270 deg) to 1 (front apex, rad = 90 deg)
          // sin(90) = 1  => depth = (1 + 1)/2 = 1.0 (Frontmost)
          // sin(270) = -1 => depth = (-1 + 1)/2 = 0.0 (Backmost)
          const depth = (Math.sin(rad) + 1) / 2;
          if (depth > bestDepth) {
            bestDepth = depth;
            bestIdx = i;
          }

          // Focus boost for hovered card
          const isThisHovered = hoveredIndex === i;
          focusBoostRef.current[i] = lerp(focusBoostRef.current[i], isThisHovered ? 1 : 0, 0.12);
          const fb = focusBoostRef.current[i];

          // Coordinates on the 3D ellipse (Y is positive downwards)
          const x = RADIUS_X * Math.cos(rad);
          const y = RADIUS_X * RADIUS_Y_RATIO * Math.sin(rad);

          // Deep-orbit culling & scaling:
          // Cards at the far back (depth < 0.18) smoothly fade out to eliminate congestion
          const baseScale = lerp(0.68, 1.05, depth);
          const scale = baseScale * (1 + fb * 0.14);
          
          const opacity = depth < 0.18 
            ? 0 
            : Math.min(1, lerp(0.3, 1, depth) + fb * 0.25);

          const zIndex = fb > 0.05 
            ? 900 + Math.round(fb * 90) 
            : Math.round(depth * 100);

          sat.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
          sat.style.opacity = opacity;
          sat.style.zIndex = zIndex;
          sat.style.pointerEvents = depth < 0.22 && fb < 0.1 ? 'none' : 'auto';
        }
      }

      // Sync active project with whichever is frontmost when not steering or hovered
      if (!isSteeringRef.current && hoveredIndex === null) {
        if (activeIndexRef.current !== bestIdx) {
          activeIndexRef.current = bestIdx;
          setActiveIndex(bestIdx);
        }
      } else if (hoveredIndex !== null && activeIndexRef.current !== hoveredIndex) {
        activeIndexRef.current = hoveredIndex;
        setActiveIndex(hoveredIndex);
      }

      reqIdRef.current = requestAnimationFrame(tick);
    };

    reqIdRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(reqIdRef.current);
  }, [N, RADIUS_X, RADIUS_Y_RATIO, hoveredIndex]);

  const activeProject = projects[activeIndex] || projects[0];

  return (
    <section 
      id="projects" 
      className="relative isolate h-screen max-h-screen min-h-[580px] w-full bg-black text-white pt-16 pb-3 sm:pt-18 sm:pb-3 px-3 sm:px-6 flex flex-col justify-between items-center overflow-hidden"
    >
      {/* Dynamic Ambient Void Glow reacting to active project's color */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-700 blur-[130px] opacity-35 -z-10"
        style={{
          background: `radial-gradient(ellipse 800px 500px at 50% 45%, ${activeProject.glow}, transparent 75%)`
        }}
      />

      {/* Cyber Background Grid Accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* Realistic Deep-Space Galaxy Starfield & Shooting Stars */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <ShootingStars className="w-full h-full" />
      </div>

      {/* Header with signature brand gradient */}
      <div className="relative z-10 text-center mx-auto mb-1">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#00f4ff] to-[#ffc922]"
        >
          Featured Projects
        </motion.h2>
      </div>

      {/* 3D Orbit Stage (Fitted compactly within 100vh window) */}
      <div 
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        className="relative w-full max-w-5xl h-[210px] sm:h-[225px] md:h-[240px] my-auto flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
      >
        {/* Left & Right Edge Navigation Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous Project"
          className="absolute left-1 sm:left-4 z-30 p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-gray-300 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,244,255,0.4)] transition-all duration-300 active:scale-90 cursor-pointer"
        >
          <FiChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Project"
          className="absolute right-1 sm:right-4 z-30 p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-gray-300 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,244,255,0.4)] transition-all duration-300 active:scale-90 cursor-pointer"
        >
          <FiChevronRight className="w-4 h-4" />
        </button>

        {/* Orbit Canvas Anchoring */}
        <div 
          ref={orbitContainerRef} 
          className="absolute top-[40%] left-1/2 w-0 h-0 pointer-events-none"
        >
          {projects.map((proj, idx) => {
            const isHovered = hoveredIndex === idx;
            const isFocused = activeIndex === idx;

            return (
              <div
                key={proj.id}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => jumpToProject(idx)}
                className="absolute top-0 left-0 w-[150px] sm:w-[170px] md:w-[185px] h-[195px] sm:h-[210px] md:h-[220px] cursor-pointer pointer-events-auto will-change-transform"
                style={{ backfaceVisibility: 'hidden' }}
              >
                {/* Outer Glass Card */}
                <div 
                  className={`relative w-full h-full rounded-xl overflow-hidden backdrop-blur-xl border transition-[border-color,background-color,box-shadow] duration-200 flex flex-col ${
                    isFocused || isHovered 
                      ? 'border-white/30 bg-[#0d101e]/90 shadow-[0_0_30px_-6px_var(--glow-color)]' 
                      : 'border-white/10 bg-[#070913]/70 hover:border-white/20'
                  }`}
                  style={{
                    '--glow-color': proj.accent
                  }}
                >
                  {/* Subtle top edge color line */}
                  <div 
                    className="h-1 w-full transition-[background-color,box-shadow] duration-200"
                    style={{ 
                      background: isFocused || isHovered ? proj.accent : 'transparent',
                      boxShadow: isFocused || isHovered ? `0 0 10px ${proj.accent}` : 'none'
                    }}
                  />

                  {/* Card Art / Video / Poster / Live Simulation */}
                  <div className="relative h-[46%] w-full bg-gradient-to-b from-white/5 to-transparent border-b border-white/10 overflow-hidden flex items-center justify-center">
                    {/* Video Player on Hover / Focus if video available */}
                    {proj.video && (isHovered || isFocused) ? (
                      <video 
                        src={proj.video} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover"
                      />
                    ) : proj.poster ? (
                      /* Poster Image */
                      <img 
                        src={proj.poster} 
                        alt={proj.title} 
                        className={`w-full h-full object-cover transition-transform duration-300 ${
                          isHovered ? 'scale-105' : ''
                        }`}
                        style={{ objectPosition: 'center 36%' }}
                      />
                    ) : (
                      /* Stylized Cyber Icon */
                      <div className="flex flex-col items-center justify-center gap-1.5 text-gray-400 group-hover:text-white transition-colors">
                        <DisciplineIcon 
                          iconType={proj.icon} 
                          className="w-10 h-10 transition-transform duration-300" 
                          style={{ color: isFocused || isHovered ? proj.accent : '#9ca3af' }}
                        />
                        <span className="font-mono text-[8.5px] tracking-widest uppercase opacity-60">
                          {proj.kicker}
                        </span>
                      </div>
                    )}

                    {/* Live Simulation Overlay on Hover if project has hasLiveSimulation and no video */}
                    <AnimatePresence>
                      {isHovered && !proj.video && proj.hasLiveSimulation && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0"
                        >
                          <LiveCardSimulation type={proj.hasLiveSimulation} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Top Right Quick Launch & Status Badge */}
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Open GitHub Repository"
                        className="p-1 rounded-full bg-black/70 border border-white/15 backdrop-blur-md text-gray-300 hover:text-cyan-300 hover:border-cyan-400 transition-colors"
                      >
                        <FiGithub className="w-2.5 h-2.5" />
                      </a>
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[8px] font-mono">
                        <span 
                          className="w-1.5 h-1.5 rounded-full" 
                          style={{ background: proj.accent }}
                        />
                        <span className="text-gray-300">{proj.video ? 'DEMO' : 'LIVE'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1 min-h-0 bg-gradient-to-b from-transparent to-black/40">
                    <div>
                      <div 
                        className="font-mono text-[8.5px] tracking-wider uppercase font-semibold mb-0.5 truncate"
                        style={{ color: proj.accent }}
                      >
                        {proj.kicker}
                      </div>

                      <h3 className="text-xs sm:text-[13px] font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                        {proj.title}
                      </h3>

                      <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2 leading-tight">
                        {proj.tagline}
                      </p>
                    </div>

                    {/* HUD Metric & Tech Tags */}
                    <div className="pt-1.5">
                      <div className="text-[9px] font-mono text-gray-300 flex items-center gap-1 mb-1.5 font-medium truncate">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: proj.accent }} />
                        <span className="truncate">{proj.metric}</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {proj.tags.slice(0, 3).map((tag, tIdx) => (
                          <span 
                            key={tIdx}
                            className="px-1 py-0.2 rounded font-mono text-[8px] bg-white/5 border border-white/10 text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                        {proj.tags.length > 3 && (
                          <span className="px-1 py-0.2 rounded font-mono text-[8px] text-gray-500">
                            +{proj.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Orbit Pagination Dots */}
      <div className="flex items-center gap-1.5 mb-1.5 z-10">
        {projects.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => jumpToProject(idx)}
            aria-label={`Select ${p.title}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              activeIndex === idx 
                ? 'w-6 h-1.5 bg-gradient-to-r from-cyan-400 to-teal-400 shadow-[0_0_8px_#00f4ff]' 
                : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Technical Dossier Console Panel (Compact & sleek, fitting within 100vh screen) */}
      <motion.div 
        key={activeProject.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 max-w-4xl w-full mx-auto p-3 sm:p-3.5 rounded-xl bg-[#090c17]/95 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row gap-3 sm:gap-4 items-start justify-between"
      >
        {/* Left info column */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span 
              className="px-2 py-0.5 rounded-full font-mono text-[9.5px] font-semibold tracking-wider uppercase border"
              style={{ 
                color: activeProject.accent, 
                borderColor: `${activeProject.accent}50`,
                background: `${activeProject.accent}15`
              }}
            >
              {activeProject.kicker}
            </span>
            <span className="text-gray-400 text-[10px] font-mono">
              Project {activeIndex + 1} of {N}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
            {activeProject.title}
          </h3>

          <p className="text-gray-300 text-[10.5px] sm:text-[11px] mt-0.5 leading-snug font-normal line-clamp-1">
            {activeProject.tagline}
          </p>

          {/* Problem & Key Technical Challenges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1.5 pt-1.5 border-t border-white/10 text-xs">
            <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/5">
              <div className="font-mono uppercase tracking-wider text-[8.5px] mb-0.5 flex items-center gap-1 text-cyan-300 font-semibold">
                <span>The Problem It Solves</span>
              </div>
              <p className="text-gray-300 text-[10px] leading-snug line-clamp-1">
                {activeProject.problem}
              </p>
            </div>

            <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/5">
              <div className="font-mono uppercase tracking-wider text-[8.5px] mb-0.5 flex items-center gap-1 text-amber-300 font-semibold">
                <span>Technical Challenges Overcome</span>
              </div>
              <p className="text-gray-300 text-[10px] leading-snug line-clamp-1">
                {activeProject.challenges}
              </p>
            </div>
          </div>

          {/* Full Tech Stack Pills */}
          <div className="flex flex-wrap items-center gap-1 mt-1.5">
            <span className="text-[9.5px] font-mono text-gray-500 mr-1">STACK:</span>
            {activeProject.tags.map((tag, i) => (
              <span 
                key={i}
                className="px-1.5 py-0.2 rounded font-mono text-[8.5px] bg-white/5 border border-white/10 text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right CTA Action Deck */}
        <div className="flex flex-row md:flex-col gap-1.5 w-full md:w-auto shrink-0 md:self-center">
          <a
            href={activeProject.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-bold text-black text-[10.5px] font-mono tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg group cursor-pointer"
            style={{
              background: activeProject.accent,
              boxShadow: `0 0 20px -4px ${activeProject.accentSoft}`
            }}
          >
            <FiGithub className="w-3.5 h-3.5" />
            <span>VIEW ON GITHUB</span>
            <FiExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          {activeProject.demoUrl && activeProject.demoUrl !== activeProject.githubUrl && (
            <a
              href={activeProject.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 px-3.5 py-1.5 rounded-lg border border-white/20 text-white hover:border-cyan-400 text-[9.5px] font-mono tracking-wider transition-all hover:bg-white/5 cursor-pointer"
            >
              <span>LIVE DEMO</span>
              <FiExternalLink className="w-3 h-3" />
            </a>
          )}

          {/* Controls Keyboard Prompt */}
          <div className="text-center font-mono text-[8.5px] text-gray-500 hidden md:block">
            <span>[ ← / → ] to navigate</span>
          </div>
        </div>
      </motion.div>

      {/* Footer Navigation Tip */}
      <div className="text-center font-mono text-[9px] text-gray-500 mb-0.5 z-10">
        Hover any project to pause & preview demo · Click to explore project code
      </div>
    </section>
  );
};

export default Projects;
