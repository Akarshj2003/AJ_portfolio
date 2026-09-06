// ChatWindow.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IoClose, IoSend, IoSparkles, IoTerminalOutline } from "react-icons/io5";
import { RiRobot2Line, RiCompass3Line } from "react-icons/ri";
import { FaGithub, FaExternalLinkAlt, FaStar } from "react-icons/fa";
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

// ── Brand & Liquid Glass Tokens ─────────────────────────────────
const CYAN   = '#00f4ff';
const GOLD   = '#ffc922';
const BG_GLASS = 'rgba(8, 12, 22, 0.82)';
const CARD_GLASS = 'rgba(15, 23, 42, 0.65)';
const BORDER_SUBTLE = 'rgba(255, 255, 255, 0.08)';
const BORDER_CYAN = 'rgba(0, 244, 255, 0.22)';

// ── Default Base Suggestions ────────────────────────────────────
const DEFAULT_SUGGESTIONS = [
  "What are Akarsh's top AI projects?",
  "Tell me about his work experience",
  "What is his core tech stack?",
  "How can I reach out or collaborate?",
];

// ── Liquid Glass Typing Indicator & Dynamic Thoughts ─────────────
function ThinkingPulse({ activeThought }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="flex flex-col gap-2 py-2 px-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20"
    >
      <div className="flex items-center gap-2">
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f4ff] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00f4ff]"></span>
        </div>
        <span className="text-xs font-mono text-cyan-300/90 tracking-wide lowercase">
          {activeThought || "thinking and exploring facts..."}
        </span>
      </div>
    </motion.div>
  );
}

// ── Interactive Glass Project Bento Card ────────────────────────
function ProjectCard({ name, tech = [], description, link, homepage, stars, updatedAt }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, borderColor: 'rgba(0, 244, 255, 0.4)' }}
      transition={{ duration: 0.2 }}
      className="mt-3 p-3.5 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md transition-all shadow-lg hover:shadow-[0_0_20px_rgba(0,244,255,0.12)] text-left"
    >
      <div className="flex justify-between items-start gap-2 mb-1.5">
        <div className="font-semibold text-white text-sm tracking-wide flex items-center gap-1.5">
          <IoTerminalOutline className="text-[#00f4ff] text-base" />
          {name}
        </div>
        {stars > 0 && (
          <span className="flex items-center gap-1 text-[11px] text-[#ffc922] font-mono bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
            <FaStar className="text-[10px]" /> {stars}
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs text-gray-300 leading-relaxed mb-2.5 font-normal">
          {description}
        </p>
      )}

      {tech.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tech.map((t, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#00f4ff]/10 text-[#00f4ff] border border-[#00f4ff]/20"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 text-xs pt-1 border-t border-white/5">
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[#ffc922] hover:text-white transition-colors font-medium"
          >
            <FaGithub /> GitHub →
          </a>
        )}
        {homepage && (
          <a
            href={homepage}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[#00f4ff] hover:text-white transition-colors font-medium"
          >
            <FaExternalLinkAlt className="text-[10px]" /> Live Demo →
          </a>
        )}
        {updatedAt && (
          <span className="text-[10px] text-gray-400 ml-auto font-mono">
            {updatedAt}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ── Skill Badges Component ──────────────────────────────────────
function SkillTags({ skills = [] }) {
  if (!skills || !skills.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2.5">
      {skills.map((s, idx) => (
        <span
          key={idx}
          className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-[#ffc922] border border-amber-500/25"
        >
          {s}
        </span>
      ))}
    </div>
  );
}

// ── Main ChatWindow Component ───────────────────────────────────
export default function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hey! I'm Akarsh's AI assistant. Ask me anything about his projects, experience, tech stack, or get in touch!",
      suggestions: DEFAULT_SUGGESTIONS,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeThought, setActiveThought] = useState('');
  const [emailState, setEmailState] = useState(null);
  const [userProfile, setUserProfile] = useState({});

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, activeThought, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setInput('');
    const userMsg = { id: Date.now().toString(), role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setActiveThought('exploring context for you...');

    // Subtle dynamic thinking phase
    const thoughts = [
      'analyzing your question...',
      'checking portfolio knowledge...',
      'synthesizing answer with verified facts...',
    ];
    let thoughtIdx = 0;
    const interval = setInterval(() => {
      thoughtIdx = (thoughtIdx + 1) % thoughts.length;
      setActiveThought(thoughts[thoughtIdx]);
    }, 1200);

    try {
      const historyPayload = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('https://aj-backend.vercel.app/api/ask-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          history: historyPayload,
          emailState,
          userProfile,
        }),
      });

      clearInterval(interval);

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setEmailState(data.emailState || null);
      if (data.userProfile) setUserProfile(data.userProfile);

      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || "I'm here to help with any details regarding Akarsh!",
        cards: data.cards || [],
        skills: data.skills || [],
        suggestions: data.suggestions && data.suggestions.length ? data.suggestions : DEFAULT_SUGGESTIONS,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      clearInterval(interval);
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Sorry, I had a quick hiccup reaching the backend. Please feel free to ask again or check Akarsh's GitHub/LinkedIn directly!",
          suggestions: DEFAULT_SUGGESTIONS,
        },
      ]);
    } finally {
      setLoading(false);
      setActiveThought('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] rounded-2xl flex flex-col overflow-hidden text-white font-sans border border-cyan-400/25 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(0,244,255,0.15)] backdrop-blur-2xl"
      style={{ background: BG_GLASS }}
    >
      {/* ── Top Bar / Header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00f4ff]/20 to-[#ffc922]/20 border border-[#00f4ff]/40 flex items-center justify-center text-[#00f4ff]">
            <RiRobot2Line className="text-lg" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-wide text-white">Akarsh AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-cyan-200/60 font-mono">portfolio intelligence</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close chat"
        >
          <IoClose className="text-xl" />
        </button>
      </div>

      {/* ── Message Stream Container ──────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-medium rounded-br-none shadow-[0_4px_15px_rgba(0,244,255,0.2)]'
                  : 'bg-slate-900/80 text-gray-100 rounded-bl-none border border-white/10 backdrop-blur-md font-normal'
              }`}
            >
              <div className="prose prose-invert prose-sm max-w-none text-gray-100 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>strong]:text-white [&>strong]:font-semibold">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>

              {/* Render Project Cards if any */}
              {msg.cards && msg.cards.length > 0 && (
                <div className="mt-2 space-y-2">
                  {msg.cards.map((card, cIdx) => (
                    <ProjectCard key={cIdx} {...card} />
                  ))}
                </div>
              )}

              {/* Render Skills Tags if any */}
              {msg.skills && msg.skills.length > 0 && (
                <SkillTags skills={msg.skills} />
              )}
            </div>

            {/* Render Contextual Follow-Up Suggestions below latest assistant message */}
            {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5 pl-1 max-w-[95%]">
                {msg.suggestions.slice(0, 3).map((sug, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => handleSend(sug)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#00f4ff]/15 text-cyan-200/80 hover:text-[#00f4ff] border border-white/10 hover:border-[#00f4ff]/40 transition-all text-left flex items-center gap-1 active:scale-95"
                  >
                    <RiCompass3Line className="text-xs text-[#ffc922]" />
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex flex-col items-start">
            <ThinkingPulse activeThought={activeThought} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Box & Send Button ───────────────────────────────── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-white/10 bg-slate-950/70 backdrop-blur-md flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about projects, skills, experience..."
          className="flex-1 bg-slate-900/80 text-white placeholder-gray-400 text-sm px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#00f4ff] focus:ring-1 focus:ring-[#00f4ff] transition-all font-sans"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#00f4ff] to-[#00bf8f] text-black font-bold flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(0,244,255,0.2)] active:scale-95 shrink-0"
          aria-label="Send message"
        >
          <IoSend className="text-sm ml-0.5" />
        </button>
      </form>
    </motion.div>
  );
}