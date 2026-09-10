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
import rehypeSanitize from 'rehype-sanitize';
import ThinkingBlock from './ThinkingBlock';

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

// ── Scenario 1: Context-Aware Contact & AI Writing Studio Card ──
const TONE_META = {
  professional: { icon: "💼", label: "Professional" },
  casual:       { icon: "☕", label: "Casual" },
  collaborative:{ icon: "🤝", label: "Collaborative" },
};

function sanitizePlaceholders(text, senderName = "") {
  if (!text) return "";
  let res = text;
  const name = (senderName || "").trim();
  if (name) {
    res = res.replace(/\[\s*(?:your\s*name|name|sender(?:\s*name)?|insert\s*name)\s*\]/gi, name);
  } else {
    // If no name is provided, clean up dangling sign-offs with placeholder
    res = res.replace(/(?:thanks|thank\s*you|regards|best|warm\s*regards|sincerely),?\s*\n*\s*\[\s*(?:your\s*name|name|sender(?:\s*name)?|insert\s*name)\s*\]/gi, "");
    res = res.replace(/\[\s*(?:your\s*name|name|sender(?:\s*name)?|insert\s*name)\s*\]/gi, "");
  }
  return res.trim();
}

function InteractiveContactForm({ intentContext = null, messages = [] }) {
  const [formState, setFormState] = useState({
    name: "", email: "", subject: "", body: "", tone: "professional",
  });
  const [polishing, setPolishing]               = useState(false);
  const [polishingSubject, setPolishingSubject] = useState(false);
  const [drafting, setDrafting]                 = useState(false);
  const [sending, setSending]                   = useState(false);
  const [sentSuccess, setSentSuccess]           = useState(false);
  const [errorMsg, setErrorMsg]                 = useState("");
  const [charCount, setCharCount]               = useState(0);

  const setField = (key, value) => {
    setFormState(prev => ({ ...prev, [key]: value }));
    if (key === "body") setCharCount(value.length);
  };

  const getContext = () => {
    let snippet = intentContext?.conversationSnippet || "";
    let intent = intentContext?.intentHint || "contact";

    if (!snippet && Array.isArray(messages) && messages.length > 0) {
      snippet = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-6)
        .map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content}`)
        .join("\n");
    }

    if (intent === "contact" && snippet) {
      if (/hire|job|role|position|recruit|opportu/i.test(snippet)) intent = "hire";
      else if (/collaborat|partner|work together|team up/i.test(snippet)) intent = "collaborate";
      else if (/question|ask|wonder|curious/i.test(snippet)) intent = "question";
    }

    return { snippet, intent };
  };

  // ── AI Draft from Chat: auto-generates body+subject from conversation context
  const handleAIDraft = async () => {
    if (drafting) return;
    setDrafting(true);
    setErrorMsg("");
    const { snippet, intent } = getContext();
    try {
      const res = await fetch("https://aj-backend.vercel.app/api/ask-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "draft_email",
          draftData: {
            conversationSnippet: snippet,
            intentHint: intent,
            tone: formState.tone,
            senderName: formState.name || "",
          },
        }),
      });
      const data = await res.json();
      if (data.body) {
        const cleanBody = sanitizePlaceholders(data.body, formState.name);
        setField("body", cleanBody);
      }
      if (data.subject) setField("subject", data.subject);
    } catch (err) {
      console.warn("AI draft failed:", err);
    } finally {
      setDrafting(false);
    }
  };

  // ── AI Polish: refines message body AND subject line (Context-Aware)
  const handlePolish = async () => {
    if ((!formState.body.trim() && !formState.subject.trim()) || polishing) return;
    setPolishing(true);
    setErrorMsg("");
    const { snippet, intent } = getContext();
    try {
      const res = await fetch("https://aj-backend.vercel.app/api/ask-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "polish_message",
          polishData: {
            text: formState.body,
            subject: formState.subject,
            tone: formState.tone,
            senderName: formState.name || "",
            conversationSnippet: snippet,
            intentHint: intent,
          },
        }),
      });
      const data = await res.json();
      if (data.polished) {
        const cleanBody = sanitizePlaceholders(data.polished, formState.name);
        setField("body", cleanBody);
      }
      if (data.polishedSubject) {
        setField("subject", data.polishedSubject);
      }
    } catch (err) {
      console.warn("AI polish failed:", err);
    } finally {
      setPolishing(false);
    }
  };

  // ── AI Polish Subject: dedicated polish for subject field (Context-Aware)
  const handlePolishSubject = async () => {
    if (polishingSubject) return;
    setPolishingSubject(true);
    setErrorMsg("");
    const { snippet, intent } = getContext();
    try {
      const res = await fetch("https://aj-backend.vercel.app/api/ask-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "polish_subject",
          subjectData: {
            subject: formState.subject,
            body: formState.body,
            tone: formState.tone,
            conversationSnippet: snippet,
            intentHint: intent,
          },
        }),
      });
      const data = await res.json();
      if (data.polishedSubject) {
        setField("subject", data.polishedSubject);
      }
    } catch (err) {
      console.warn("Subject polish failed:", err);
    } finally {
      setPolishingSubject(false);
    }
  };

  // ── Send Email
  const handleSend = async (e) => {
    e.preventDefault();
    if (!formState.email.trim() || !formState.body.trim() || sending) return;
    setSending(true);
    setErrorMsg("");
    try {
      const res = await fetch("https://aj-backend.vercel.app/api/ask-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_contact",
          contactData: {
            name: formState.name,
            email: formState.email,
            subject: formState.subject,
            message: formState.body,
            tone: formState.tone,
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSentSuccess(true);
      } else {
        setErrorMsg(data.details || "Failed to send. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Try again or find Akarsh on LinkedIn.");
    } finally {
      setSending(false);
    }
  };

  // ── Success State ──
  if (sentSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-4 p-5 rounded-2xl border border-emerald-400/25 bg-emerald-950/20 text-center backdrop-blur-md"
      >
        <IoCheckmarkCircle className="text-4xl text-emerald-400 mx-auto mb-3" />
        <h4 className="text-white font-semibold text-sm mb-1">Message Delivered!</h4>
        <p className="text-xs text-gray-300 leading-relaxed">
          Akarsh has your note in his inbox and will reply to{" "}
          <span className="text-[#00f4ff] font-mono">{formState.email}</span> shortly.
        </p>
      </motion.div>
    );
  }

  const intentBadge = {
    hire: "hiring opportunity",
    collaborate: "collaboration",
    question: "your question",
    contact: "reaching out",
  }[intentContext?.intentHint] || "reaching out";

  return (
    <motion.form
      onSubmit={handleSend}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 rounded-2xl overflow-hidden border border-cyan-400/20 shadow-[0_8px_40px_rgba(0,244,255,0.08)] text-left"
      style={{ background: "rgba(8,15,30,0.97)" }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8"
        style={{ background: "rgba(0,244,255,0.04)" }}
      >
        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#00f4ff] tracking-wide">
          <IoMailOutline className="text-base" />
          Direct Contact Studio
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-emerald-300/80 font-mono">context-aware</span>
        </div>
      </div>

      {/* ── Context banner (only when conversation context is available) ── */}
      {intentContext?.conversationSnippet && (
        <div className="flex items-start gap-2.5 mx-4 mt-3 px-3 py-2.5 rounded-xl"
          style={{ background: "rgba(0,244,255,0.06)", border: "1px solid rgba(0,244,255,0.12)" }}
        >
          <IoSparkles className="text-[#00f4ff] text-sm shrink-0 mt-0.5" />
          <p className="text-[11.5px] text-cyan-200/75 leading-relaxed">
            I understand you're interested in <span className="text-[#00f4ff] font-medium">{intentBadge}</span>. Hit <strong className="text-white font-semibold">AI Draft</strong> below to auto-write a message based on our chat, or type your own.
          </p>
        </div>
      )}

      <div className="px-4 pt-4 pb-4 flex flex-col gap-4">

        {/* ── Row 1: Name + Email ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11.5px] font-medium text-gray-300">Your Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Rivera"
              value={formState.name}
              onChange={e => {
                const newName = e.target.value;
                setField("name", newName);
                // Dynamically sync user's name into body if [Your Name] placeholder exists
                if (formState.body && /\[\s*(?:your\s*name|name|sender(?:\s*name)?|insert\s*name)\s*\]/i.test(formState.body)) {
                  setField("body", sanitizePlaceholders(formState.body, newName));
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl text-[13px] text-white placeholder-gray-500 transition-all"
              style={{
                background: "rgba(15,22,45,0.9)",
                border: "1px solid rgba(255,255,255,0.12)",
                outline: "none",
              }}
              onFocus={e => { e.target.style.borderColor = "rgba(0,244,255,0.55)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,244,255,0.08)"; }}
              onBlur={e  => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11.5px] font-medium text-gray-300">Your Email <span className="text-red-400">*</span></label>
            <input
              type="email"
              required
              placeholder="e.g. alex@company.com"
              value={formState.email}
              onChange={e => setField("email", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-[13px] text-white placeholder-gray-500 transition-all"
              style={{
                background: "rgba(15,22,45,0.9)",
                border: "1px solid rgba(255,255,255,0.12)",
                outline: "none",
              }}
              onFocus={e => { e.target.style.borderColor = "rgba(0,244,255,0.55)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,244,255,0.08)"; }}
              onBlur={e  => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}
            />
          </div>
        </div>

        {/* ── Row 2: Subject with dedicated AI Polish Subject action ── */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11.5px] font-medium text-gray-300">Subject</label>
            <button
              type="button"
              onClick={handlePolishSubject}
              disabled={polishingSubject}
              className="text-[11px] font-medium text-cyan-300/90 hover:text-cyan-200 flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
              title="Polish or auto-generate subject line"
            >
              <IoSparkles className={`text-[10px] text-[#00f4ff] ${polishingSubject ? "animate-spin" : ""}`} />
              <span>{polishingSubject ? "Polishing..." : "✦ AI Polish Subject"}</span>
            </button>
          </div>
          <input
            type="text"
            placeholder="e.g. Collaboration on AI Project"
            value={formState.subject}
            onChange={e => setField("subject", e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-[13px] text-white placeholder-gray-500 transition-all"
            style={{
              background: "rgba(15,22,45,0.9)",
              border: "1px solid rgba(255,255,255,0.12)",
              outline: "none",
            }}
            onFocus={e => { e.target.style.borderColor = "rgba(0,244,255,0.55)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,244,255,0.08)"; }}
            onBlur={e  => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {/* ── Row 3: Message ── */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[11.5px] font-medium text-gray-300">Your Message <span className="text-red-400">*</span></label>
            <span className={`text-[10.5px] font-mono ${ charCount > 450 ? "text-amber-400" : "text-gray-500" }`}>
              {charCount} / 500
            </span>
          </div>

          {/* ── AI Action Buttons ── */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAIDraft}
              disabled={drafting}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11.5px] font-semibold transition-all active:scale-95 disabled:opacity-50"
              style={{
                background: "rgba(255,201,34,0.12)",
                border: "1px solid rgba(255,201,34,0.3)",
                color: "#ffc922",
              }}
            >
              <RiMagicLine className={`text-sm ${drafting ? "animate-spin" : ""}`} />
              {drafting ? "Drafting..." : "✦ AI Draft from Chat"}
            </button>
            <button
              type="button"
              onClick={handlePolish}
              disabled={(!formState.body.trim() && !formState.subject.trim()) || polishing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11.5px] font-semibold transition-all active:scale-95 disabled:opacity-50"
              style={{
                background: "rgba(0,244,255,0.08)",
                border: "1px solid rgba(0,244,255,0.22)",
                color: "#00f4ff",
              }}
            >
              <IoSparkles className={`text-xs ${polishing ? "animate-spin" : ""}`} />
              {polishing ? "Polishing..." : "✦ AI Polish (Body & Subject)"}
            </button>
          </div>

          <textarea
            rows={4}
            required
            maxLength={500}
            placeholder="Hi Akarsh, I'd love to connect regarding..."
            value={formState.body}
            onChange={e => setField("body", e.target.value)}
            className="w-full px-3.5 py-3 rounded-xl text-[13px] text-white placeholder-gray-500 leading-relaxed resize-none transition-all"
            style={{
              background: "rgba(15,22,45,0.9)",
              border: "1px solid rgba(255,255,255,0.12)",
              outline: "none",
            }}
            onFocus={e => { e.target.style.borderColor = "rgba(0,244,255,0.55)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,244,255,0.08)"; }}
            onBlur={e  => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {/* ── Row 4: Tone Selector ── */}
        <div className="flex flex-col gap-2">
          <label className="text-[11.5px] font-medium text-gray-300">Tone</label>
          <div className="flex gap-2">
            {Object.entries(TONE_META).map(([key, meta]) => (
              <button
                key={key}
                type="button"
                onClick={() => setField("tone", key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11.5px] font-medium transition-all active:scale-95 ${
                  formState.tone === key
                    ? "text-black font-semibold shadow-[0_0_12px_rgba(0,244,255,0.25)]"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                style={formState.tone === key
                  ? { background: "linear-gradient(135deg, #00f4ff, #00bf8f)", border: "1px solid transparent" }
                  : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)" }
                }
              >
                <span>{meta.icon}</span>
                {meta.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Error ── */}
        {errorMsg && (
          <p className="text-[11px] text-red-400 font-mono bg-red-950/20 px-3 py-2 rounded-lg border border-red-500/20">
            {errorMsg}
          </p>
        )}

        {/* ── Send Button ── */}
        <button
          type="submit"
          disabled={!formState.email.trim() || !formState.body.trim() || sending}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13.5px] font-bold text-black transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: !formState.email.trim() || !formState.body.trim() || sending
              ? "rgba(0,244,255,0.2)"
              : "linear-gradient(135deg, #00f4ff 0%, #00bf8f 100%)",
            boxShadow: "0 0 20px rgba(0,244,255,0.2)",
          }}
        >
          <FaPaperPlane className="text-xs" />
          {sending ? "Sending..." : "Send to Akarsh →"}
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
      className="mt-3 p-3.5 rounded-xl border border-white/10 bg-slate-900/90 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(0,244,255,0.12)] text-left"
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
  let clean = content
    // Strip structured data tags (always strip these — they're handled as UI components)
    .replace(/<projects>[\s\S]*?(?:<\/projects>|$)/gi, "")
    .replace(/<skills>[\s\S]*?(?:<\/skills>|$)/gi, "")
    .replace(/<suggestions>[\s\S]*?(?:<\/suggestions>|$)/gi, "");

  // Secondary safety net: strip raw markdown leakage from models that ignore instructions.
  // This runs client-side as the last line of defence before text is displayed.
  clean = clean
    // Strip ATX headings (# Heading)
    .replace(/^#{1,6}\s+/gm, "")
    // Unwrap **bold** and __bold__ → plain text
    .replace(/\*\*(.+?)\*\*/gs, "$1")
    .replace(/__(.+?)__/gs, "$1")
    // Unwrap *italic* and _italic_ → plain text
    .replace(/\*(.+?)\*/gs, "$1")
    .replace(/_([^_]+)_/gs, "$1")
    // Strip ~~strikethrough~~
    .replace(/~~(.+?)~~/gs, "$1")
    // Strip ```code blocks``` entirely (content too noisy for chat)
    .replace(/```[\s\S]*?```/g, "")
    // Unwrap `inline code` → plain text
    .replace(/`([^`]+)`/g, "$1")
    // Strip setext-style heading underlines (=== or ---)
    .replace(/^[=]{3,}\s*$/gm, "")
    // Collapse excess blank lines
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return clean;
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
  const [liveThinkingSteps, setLiveThinkingSteps] = useState([]);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const [intentContextStore, setIntentContextStore] = useState(null);

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const inputRef = useRef(null);
  const isNearBottomRef = useRef(true);
  const tickingRef = useRef(false);

  // Lock background body scroll whenever ChatWindow is open (both half-screen & full-screen)
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);

  const handleContainerScroll = useCallback(() => {
    if (!tickingRef.current) {
      window.requestAnimationFrame(() => {
        const el = scrollContainerRef.current;
        if (el) {
          const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
          const nearBottom = distanceToBottom < 80;
          isNearBottomRef.current = nearBottom;
          setShowScrollBottomBtn((prev) => (prev !== !nearBottom ? !nearBottom : prev));
        }
        tickingRef.current = false;
      });
      tickingRef.current = true;
    }
  }, []);

  const scrollToBottom = useCallback((force = false) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (force || isNearBottomRef.current) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth'
      });
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
    setActiveThought('analyzing your question...');
    setLiveThinkingSteps(['analyzing your question...']);

    // Force scroll down so user immediately sees their question
    setTimeout(() => scrollToBottom(true), 50);

    // Dynamic thinking phase fallback interval
    const thoughts = [
      'analyzing your question...',
      'checking portfolio knowledge...',
      'synthesizing answer with verified facts...',
    ];
    let thoughtIdx = 0;
    const interval = setInterval(() => {
      thoughtIdx = (thoughtIdx + 1) % thoughts.length;
      setActiveThought(thoughts[thoughtIdx]);
    }, 1500);

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
          action: 'stream_chat',
        }),
      });

      clearInterval(interval);

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      let data = null;
      const contentType = res.headers.get('content-type') || '';
      const collectedSteps = [];

      if (contentType.includes('text/event-stream') && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(trimmed.slice(6));
                if (parsed.type === 'thinking') {
                  if (parsed.step) {
                    setActiveThought(parsed.step);
                    if (!collectedSteps.includes(parsed.step)) {
                      collectedSteps.push(parsed.step);
                    }
                    setLiveThinkingSteps([...collectedSteps]);
                  }
                } else if (parsed.type === 'done') {
                  data = parsed;
                } else if (parsed.type === 'error') {
                  throw new Error(parsed.message || 'Stream processing error');
                }
              } catch (e) {
                // Ignore partial JSON parse errors
              }
            }
          }
        }
      } else {
        // Standard JSON fallback
        data = await res.json();
      }

      if (!data) {
        throw new Error('No response data received');
      }

      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || "I'm here to help with any details regarding Akarsh!",
        scenario: data.scenario || "general",
        showContactForm: data.showContactForm || false,
        cards: data.cards || [],
        skills: data.skills || [],
        suggestions: data.suggestions && data.suggestions.length ? data.suggestions : DEFAULT_SUGGESTIONS,
        intentContext: data.intentContext || null,
        thinkingSteps: data.thinkingSteps || (collectedSteps.length > 0 ? collectedSteps : null),
      };

      // Persist the latest intentContext so the form always has fresh context
      if (data.intentContext) setIntentContextStore(data.intentContext);

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
      setLiveThinkingSteps([]);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 20 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className={`fixed z-[9999] rounded-2xl flex flex-col overflow-hidden text-white font-sans border border-cyan-400/25 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(0,244,255,0.15)] backdrop-blur-2xl transition-all duration-300 overscroll-contain ${
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
        className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll relative"
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
                  : 'bg-slate-900/90 text-gray-100 rounded-bl-none border border-white/10 font-normal'
              }`}
            >
              {/* Reasoning / Thinking Trace for Assistant Messages */}
              {msg.role === 'assistant' && msg.thinkingSteps && msg.thinkingSteps.length > 0 && (
                <div className="mb-2">
                  <ThinkingBlock
                    isLive={false}
                    steps={msg.thinkingSteps}
                    defaultExpanded={false}
                  />
                </div>
              )}

              <div className="prose prose-invert prose-sm max-w-none text-gray-100 [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>strong]:text-white [&>strong]:font-semibold [&>a]:text-cyan-400 [&>a]:underline-offset-2 [&>h1]:text-base [&>h2]:text-sm [&>h3]:text-sm [&>h1]:font-semibold [&>h2]:font-semibold [&>h3]:font-medium [&>code]:bg-slate-800 [&>code]:text-cyan-300 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-xs [&>pre]:bg-slate-800 [&>pre]:rounded-lg [&>pre]:p-3 [&>pre]:text-xs [&>pre]:overflow-x-auto">
                <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                  {sanitizeMessageContent(msg.content)}
                </ReactMarkdown>
              </div>

              {/* Scenario 1: Render Context-Aware Contact Studio */}
              {msg.showContactForm && (
                <InteractiveContactForm
                  intentContext={msg.intentContext || intentContextStore}
                  messages={messages}
                />
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
          <div className="flex flex-col items-start w-full max-w-[88%]">
            <ThinkingBlock
              isLive={true}
              activeStep={activeThought}
              steps={liveThinkingSteps}
              defaultExpanded={true}
            />
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