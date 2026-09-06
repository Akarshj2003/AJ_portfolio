// ChatWindow.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  IoClose, IoSend, IoSparkles, IoTerminalOutline, 
  IoExpandOutline, IoContractOutline, IoCheckmarkCircle, IoMailOutline,
  IoArrowDown
} from "react-icons/io5";
import { RiRobot2Line, RiCompass3Line, RiMagicLine, RiCodeSSlashLine } from "react-icons/ri";
import { FaGithub, FaExternalLinkAlt, FaStar, FaPaperPlane } from "react-icons/fa";
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

// ── Brand & Liquid Glass Tokens ─────────────────────────────────
const CYAN   = '#00f4ff';
const GOLD   = '#ffc922';
const BG_GLASS = 'rgba(8, 12, 22, 0.84)';

// ── Default Base Suggestions ────────────────────────────────────
const DEFAULT_SUGGESTIONS = [
  "What are Akarsh's top AI projects?",
  "Tell me about his work experience",
  "What is his core tech stack?",
  "I want to send an email to Akarsh",
];

// ── Liquid Glass Typing Indicator & Dynamic Thoughts ─────────────
function ThinkingPulse({ activeThought }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="flex flex-col gap-2 py-2 px-3 rounded-xl bg-cyan-950/25 border border-cyan-500/25 max-w-[85%]"
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

// ── Scenario 1: Interactive Contact & AI Writing Studio Card ────
function InteractiveContactForm({ initialMessage = "" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState(initialMessage);
  const [tone, setTone] = useState("professional");
  const [polishing, setPolishing] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handlePolish = async () => {
    if (!message.trim() || polishing) return;
    setPolishing(true);
    setErrorMsg("");
    try {
      const res = await fetch("https://aj-backend.vercel.app/api/ask-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "polish_message",
          polishData: { text: message, tone },
        }),
      });
      const data = await res.json();
      if (data.polished) {
        setMessage(data.polished);
      }
    } catch (err) {
      console.warn("AI polish failed:", err);
    } finally {
      setPolishing(false);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email.trim() || !message.trim() || sending) return;
    setSending(true);
    setErrorMsg("");

    try {
      const res = await fetch("https://aj-backend.vercel.app/api/ask-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_contact",
          contactData: { name, email, subject, message, tone },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSentSuccess(true);
      } else {
        setErrorMsg(data.details || "Failed to dispatch email. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again or reach out via LinkedIn.");
    } finally {
      setSending(false);
    }
  };

  if (sentSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-center backdrop-blur-md"
      >
        <IoCheckmarkCircle className="text-3xl text-emerald-400 mx-auto mb-2" />
        <h4 className="text-white font-semibold text-sm">Message Sent Directly to Akarsh!</h4>
        <p className="text-xs text-gray-300 mt-1">
          Thanks for reaching out! Akarsh has received your note at his inbox and will reply to <span className="text-[#00f4ff] font-mono">{email}</span> shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSendEmail}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 p-4 rounded-xl border border-cyan-400/30 bg-slate-900/80 backdrop-blur-xl shadow-xl flex flex-col gap-3 text-left"
    >
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#00f4ff] uppercase tracking-wider">
          <IoMailOutline className="text-sm" /> Direct Contact Studio
        </div>
        <span className="text-[10px] text-gray-400 font-mono">dispatched to Akarsh's Gmail</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="text-[11px] font-medium text-gray-300 block mb-1">Your Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Alex Rivera"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950/70 text-xs px-3 py-2 rounded-lg border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00f4ff]"
          />
        </div>
        <div>
          <label className="text-[11px] font-medium text-gray-300 block mb-1">Your Email</label>
          <input
            type="email"
            required
            placeholder="e.g. alex@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950/70 text-xs px-3 py-2 rounded-lg border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00f4ff]"
          />
        </div>
      </div>

      <div>
        <label className="text-[11px] font-medium text-gray-300 block mb-1">Subject</label>
        <input
          type="text"
          placeholder="e.g. Collaboration on AI Project / Job Opportunity"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full bg-slate-950/70 text-xs px-3 py-2 rounded-lg border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00f4ff]"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-[11px] font-medium text-gray-300">Your Message</label>
          {/* Tone Selector Pills */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400 mr-1">Tone:</span>
            {["professional", "casual", "collaborative"].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTone(t)}
                className={`text-[10px] px-2 py-0.5 rounded capitalize transition-all ${
                  tone === t
                    ? "bg-[#00f4ff]/20 text-[#00f4ff] border border-[#00f4ff]/40 font-semibold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={3}
          required
          placeholder="Hi Akarsh, I'd love to connect regarding..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-slate-950/70 text-xs px-3 py-2 rounded-lg border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00f4ff] leading-relaxed resize-none"
        />
      </div>

      {errorMsg && (
        <p className="text-[11px] text-red-400 font-mono">{errorMsg}</p>
      )}

      <div className="flex items-center justify-between gap-2 pt-1">
        {/* AI Polish Button */}
        <button
          type="button"
          disabled={!message.trim() || polishing}
          onClick={handlePolish}
          className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-[#ffc922] border border-amber-500/30 flex items-center gap-1.5 transition-all disabled:opacity-40 active:scale-95"
          title="Enhance grammar and tone using AI"
        >
          <RiMagicLine className={`text-sm ${polishing ? "animate-spin" : ""}`} />
          {polishing ? "Polishing..." : "AI Polish & Grammar"}
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!email.trim() || !message.trim() || sending}
          className="text-xs px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#00f4ff] to-[#00bf8f] text-black font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,244,255,0.25)] hover:opacity-90 disabled:opacity-40 active:scale-95"
        >
          <FaPaperPlane className="text-[10px]" />
          {sending ? "Sending..." : "Send to Akarsh 🚀"}
        </button>
      </div>
    </motion.form>
  );
}

// ── Scenario 2: Interactive Glass Project Bento Card ────────────
function ProjectCard({ name, tech = [], description, link, homepage, stars, updatedAt }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, borderColor: 'rgba(0, 244, 255, 0.4)' }}
      transition={{ duration: 0.2 }}
      className="mt-3 p-3.5 rounded-xl border border-white/10 bg-slate-900/70 backdrop-blur-md transition-all shadow-lg hover:shadow-[0_0_20px_rgba(0,244,255,0.12)] text-left"
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

// ── Scenario 3: Interactive Clickable Skill Chips ────────────────
function SkillTags({ skills = [], onSkillClick }) {
  if (!skills || !skills.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2.5">
      {skills.map((s, idx) => (
        <button
          key={idx}
          onClick={() => onSkillClick && onSkillClick(`What projects did Akarsh build using ${s}?`)}
          className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-[#ffc922] border border-amber-500/25 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
          title={`Click to view projects using ${s}`}
        >
          <RiCodeSSlashLine className="text-[10px]" />
          {s}
        </button>
      ))}
    </div>
  );
}

function sanitizeMessageContent(content) {
  if (!content) return "";
  return content
    .replace(/<projects>[\s\S]*?(?:<\/projects>|$)/gi, "")
    .replace(/<skills>[\s\S]*?(?:<\/skills>|$)/gi, "")
    .replace(/<suggestions>[\s\S]*?(?:<\/suggestions>|$)/gi, "")
    .trim();
}

// ── Main ChatWindow Component ───────────────────────────────────
export default function ChatWindow({ onClose }) {
  // Starts in Half-Screen mode by default, toggleable to Full-Screen
  const [isFullScreen, setIsFullScreen] = useState(false);
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
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const inputRef = useRef(null);
  const isNearBottomRef = useRef(true);

  // Lock background body scroll when in full-screen
  useEffect(() => {
    if (isFullScreen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isFullScreen]);

  const handleContainerScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distanceToBottom < 80;
    isNearBottomRef.current = nearBottom;
    setShowScrollBottomBtn(!nearBottom);
  };

  const scrollToBottom = useCallback((force = false) => {
    if (force || isNearBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Only auto-scroll when a new message is added or loading finishes, NEVER on activeThought interval!
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

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

    // Force scroll down so user immediately sees their question
    setTimeout(() => scrollToBottom(true), 50);

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
        }),
      });

      clearInterval(interval);

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || "I'm here to help with any details regarding Akarsh!",
        scenario: data.scenario || "general",
        showContactForm: data.showContactForm || false,
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
      layout
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 20 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      onWheel={(e) => e.stopPropagation()}
      className={`fixed z-50 rounded-2xl flex flex-col overflow-hidden text-white font-sans border border-cyan-400/25 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(0,244,255,0.15)] backdrop-blur-2xl transition-all duration-300 overscroll-contain ${
        isFullScreen
          ? 'inset-2 sm:inset-4 w-[calc(100vw-16px)] sm:w-[calc(100vw-32px)] h-[calc(100vh-16px)] sm:h-[calc(100vh-32px)]'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] md:w-[50vw] lg:w-[48vw] h-[88vh] max-h-[90vh]'
      }`}
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

        <div className="flex items-center gap-1">
          {/* Half-Screen / Full-Screen Toggle Button */}
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#00f4ff] hover:bg-white/10 transition-colors"
            title={isFullScreen ? "Restore to half screen" : "Expand to full screen"}
            aria-label={isFullScreen ? "Restore to half screen" : "Expand to full screen"}
          >
            {isFullScreen ? (
              <IoContractOutline className="text-lg" />
            ) : (
              <IoExpandOutline className="text-lg" />
            )}
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close chat"
          >
            <IoClose className="text-xl" />
          </button>
        </div>
      </div>

      {/* ── Message Stream Container ──────────────────────────────── */}
      <div
        ref={scrollContainerRef}
        onScroll={handleContainerScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain relative"
      >
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
                <ReactMarkdown>{sanitizeMessageContent(msg.content)}</ReactMarkdown>
              </div>

              {/* Scenario 1: Render Interactive Contact & AI Writing Studio Card */}
              {msg.showContactForm && (
                <InteractiveContactForm />
              )}

              {/* Scenario 2: Render Project Bento Cards */}
              {msg.cards && msg.cards.length > 0 && (
                <div className="mt-2 space-y-2">
                  {msg.cards.map((card, cIdx) => (
                    <ProjectCard key={cIdx} {...card} />
                  ))}
                </div>
              )}

              {/* Scenario 3: Render Interactive Clickable Skill Chips */}
              {msg.skills && msg.skills.length > 0 && (
                <SkillTags skills={msg.skills} onSkillClick={(prompt) => handleSend(prompt)} />
              )}
            </div>

            {/* Contextual Follow-Up Suggestions below latest assistant message */}
            {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5 pl-1 max-w-[95%]">
                {msg.suggestions.slice(0, 3).map((sug, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => handleSend(sug)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#00f4ff]/15 text-cyan-200/80 hover:text-[#00f4ff] border border-white/10 hover:border-[#00f4ff]/40 transition-all text-left flex items-center gap-1 active:scale-95 cursor-pointer"
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

      {/* Floating Scroll to Bottom Button */}
      <AnimatePresence>
        {showScrollBottomBtn && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            onClick={() => scrollToBottom(true)}
            className="absolute bottom-16 right-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-400/40 text-cyan-300 text-xs font-mono shadow-lg hover:bg-cyan-950 hover:text-white backdrop-blur-md transition-all cursor-pointer"
            aria-label="Scroll to bottom"
          >
            <IoArrowDown className="text-sm" />
            <span>Latest</span>
          </motion.button>
        )}
      </AnimatePresence>

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
          placeholder="Ask about projects, skills, experience, or send an email..."
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