// src/components/ThinkingBlock.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoChevronDown, 
  IoChevronUp, 
  IoCheckmarkCircle, 
  IoSparkles, 
  IoTerminalOutline,
  IoTimeOutline 
} from "react-icons/io5";
import { RiRobot2Line, RiCpuLine } from "react-icons/ri";

/**
 * ThinkingBlock
 * 
 * Props:
 * - isLive: boolean — true while agent is executing / streaming steps
 * - activeStep: string — current step message being processed
 * - steps: Array<string | { step: string, tool?: string, timestamp?: number }> — list of captured steps
 * - defaultExpanded?: boolean — whether to start expanded
 * - durationMs?: number — total execution duration in ms if available
 */
export default function ThinkingBlock({
  isLive = false,
  activeStep = '',
  steps = [],
  defaultExpanded = false,
  durationMs = null,
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || isLive);

  // Normalize steps into an array of string descriptions
  const stepList = Array.isArray(steps)
    ? steps.map((s) => (typeof s === 'string' ? s : s.step || JSON.stringify(s)))
    : [];

  // If live and activeStep is not in list yet, display it as active
  const currentStepText = activeStep || (isLive ? "Analyzing question & context..." : "Reasoning complete");
  const stepCount = Math.max(stepList.length, isLive ? 1 : 0);

  return (
    <div className="w-full my-2 text-xs font-mono select-none">
      {/* ── Collapsible Bar ── */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 border cursor-pointer ${
          isLive
            ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(0,244,255,0.12)]'
            : 'bg-slate-950/50 hover:bg-slate-900/70 border-white/10 hover:border-cyan-500/25 text-gray-400 hover:text-cyan-200'
        }`}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2 overflow-hidden mr-2">
          {isLive ? (
            <div className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f4ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00f4ff]"></span>
            </div>
          ) : (
            <RiCpuLine className="text-cyan-400/80 text-sm shrink-0" />
          )}

          <span className="truncate text-left text-[11.5px] font-medium tracking-tight">
            {isLive ? (
              <span className="text-cyan-300 font-medium">
                {currentStepText}
              </span>
            ) : (
              <span>
                Thought process <span className="text-gray-500">({stepCount} {stepCount === 1 ? 'step' : 'steps'}{durationMs ? ` · ${(durationMs / 1000).toFixed(1)}s` : ''})</span>
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-gray-500">
          <span className="text-[10px] uppercase tracking-wider text-cyan-400/70 font-semibold px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">
            {isLive ? 'thinking' : 'trace'}
          </span>
          {isExpanded ? (
            <IoChevronUp className="text-xs text-cyan-400" />
          ) : (
            <IoChevronDown className="text-xs text-gray-400" />
          )}
        </div>
      </button>

      {/* ── Expanded Step-by-Step Flow ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mt-1.5 p-3 rounded-xl bg-slate-950/70 border border-white/5 backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-[10.5px] text-gray-400 pb-1 border-b border-white/5">
                <span className="flex items-center gap-1 text-cyan-300/80">
                  <IoTerminalOutline className="text-xs" /> Reasoning Trace
                </span>
                <span className="text-gray-500 text-[10px]">LangGraph Agent</span>
              </div>

              <div className="space-y-1.5 pt-0.5">
                {stepList.map((step, idx) => {
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-2 text-[11px] leading-relaxed text-gray-300"
                    >
                      <IoCheckmarkCircle className="text-emerald-400 text-xs mt-0.5 shrink-0" />
                      <span className="break-words font-sans text-gray-300/90">{step}</span>
                    </motion.div>
                  );
                })}

                {isLive && activeStep && (
                  <motion.div
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-2 text-[11px] leading-relaxed text-cyan-300"
                  >
                    <div className="w-3 h-3 rounded-full border border-cyan-400 border-t-transparent animate-spin shrink-0 mt-0.5" />
                    <span className="break-words font-sans text-cyan-200 animate-pulse">{activeStep}</span>
                  </motion.div>
                )}

                {stepList.length === 0 && !isLive && (
                  <p className="text-gray-500 text-[11px] italic">Direct response (cached / immediate)</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
