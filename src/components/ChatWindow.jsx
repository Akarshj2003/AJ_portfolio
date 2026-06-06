// ChatWindow.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IoClose, IoSend, IoSparkles } from "react-icons/io5";
import { RiRobot2Line } from "react-icons/ri";
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

// ── Brand tokens ────────────────────────────────────────────────
const CYAN   = '#00BFA6';
const GOLD   = '#F5A623';
const BG     = '#080D0B';
const CARD   = '#0F1714';
const BORDER = '#1A2E28';

// ── Email flow step → progress (0‒100) ─────────────────────────
const EMAIL_PROGRESS = {
  collecting_name:    20,
  collecting_email:   40,
  collecting_message: 60,
  choosing_tone:      75,
  reviewing_draft:    90,
  done:              100,
};

// ── Suggestion pool (base) ──────────────────────────────────────
const BASE_SUGGESTIONS = [
  "🛠️ What projects has Akarsh built?",
  "💼 Tell me about his experience",
  "⚡ What's his tech stack?",
  "🎓 What's his educational background?",
  "🎉 Any fun facts about Akarsh?",
  "📧 Send Akarsh a message",
  "🌟 What makes Akarsh stand out?",
  "🚀 What's he currently working on?",
  "🤝 Is Akarsh open to opportunities?",
  "🧠 What are his strongest skills?",
];

function pickSuggestions(used) {
  const pool = BASE_SUGGESTIONS.filter(s => !used.has(s));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

// ── Typing indicator ────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display:'flex', gap:5, padding:'10px 4px', alignItems:'center' }}>
      {[0,1,2].map(i => (
        <motion.span
          key={i}
          style={{ width:7, height:7, borderRadius:'50%', background: CYAN, display:'block' }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

// ── Email progress bar ──────────────────────────────────────────
function EmailProgress({ step }) {
  const pct = EMAIL_PROGRESS[step] ?? 0;
  if (!pct) return null;
  return (
    <div style={{ padding:'6px 16px 0', flexShrink:0 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
        <span style={{ fontSize:11, color: CYAN, letterSpacing:1, textTransform:'uppercase', fontFamily:'monospace' }}>
          ✉ Email flow
        </span>
        <span style={{ fontSize:11, color: GOLD, fontFamily:'monospace' }}>{pct}%</span>
      </div>
      <div style={{ height:3, background: BORDER, borderRadius:2, overflow:'hidden' }}>
        <motion.div
          style={{ height:'100%', background:`linear-gradient(90deg,${CYAN},${GOLD})`, borderRadius:2 }}
          initial={{ width:0 }}
          animate={{ width:`${pct}%` }}
          transition={{ duration:0.5 }}
        />
      </div>
    </div>
  );
}

// ── Project card renderer ───────────────────────────────────────
function ProjectCard({ name, tech = [], description, link }) {
  return (
    <motion.div
      initial={{ opacity:0, y:8 }}
      animate={{ opacity:1, y:0 }}
      style={{
        background: CARD,
        border:`1px solid ${BORDER}`,
        borderLeft:`3px solid ${CYAN}`,
        borderRadius:10,
        padding:'12px 14px',
        marginTop:8,
        width:'100%',
      }}
    >
      <div style={{ fontWeight:700, color:'#fff', fontSize:14, marginBottom:4 }}>{name}</div>
      {description && <div style={{ fontSize:12, color:'#9CACA8', marginBottom:8, lineHeight:1.5 }}>{description}</div>}
      <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
        {tech.map(t => (
          <span key={t} style={{
            fontSize:10, padding:'2px 8px', borderRadius:20,
            background:'rgba(0,191,166,0.12)', color: CYAN,
            border:`1px solid rgba(0,191,166,0.25)`, fontFamily:'monospace',
          }}>{t}</span>
        ))}
      </div>
      {link && (
        <a href={link} target="_blank" rel="noreferrer"
          style={{ display:'inline-block', marginTop:8, fontSize:11, color: GOLD, textDecoration:'none' }}>
          View project →
        </a>
      )}
    </motion.div>
  );
}

// ── Skill tags renderer ─────────────────────────────────────────
function SkillTags({ skills = [] }) {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:8 }}>
      {skills.map(s => (
        <span key={s} style={{
          fontSize:11, padding:'4px 10px', borderRadius:20,
          background:'rgba(245,166,35,0.12)', color: GOLD,
          border:`1px solid rgba(245,166,35,0.25)`, fontFamily:'monospace',
        }}>{s}</span>
      ))}
    </div>
  );
}

// ── Markdown components ─────────────────────────────────────────
const mdComponents = {
  p:      ({ ...p }) => <p style={{ margin:'0 0 6px', lineHeight:1.6, fontSize:13 }} {...p} />,
  ul:     ({ ...p }) => <ul style={{ paddingLeft:18, margin:'4px 0' }} {...p} />,
  li:     ({ ...p }) => <li style={{ marginBottom:3, fontSize:13 }} {...p} />,
  strong: ({ ...p }) => <strong style={{ color:'#fff', fontWeight:700 }} {...p} />,
  a:      ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer"
      style={{ color: CYAN, textDecoration:'underline' }}>{children}</a>
  ),
  code: ({ className, children, ...p }) => {
    const isBlock = className?.includes('language-');
    return isBlock
      ? <pre style={{ background:'#0A1510', padding:10, borderRadius:8, overflowX:'auto', fontSize:12, fontFamily:'monospace', margin:'6px 0' }}>
          <code className={className} {...p}>{children}</code>
        </pre>
      : <code style={{ background:'rgba(0,191,166,0.12)', padding:'1px 5px', borderRadius:4, fontSize:12, fontFamily:'monospace' }} {...p}>{children}</code>;
  },
};

// ── Main component ──────────────────────────────────────────────
export default function ChatWindow({ onClose }) {
  const [input, setInput]       = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([{
    id: crypto.randomUUID(), sender:'bot', text:
      "Hey! 👋 I'm Akarsh's AI assistant — ask me anything about him, his projects, or his experience.\n\nOr I can help you send him a message directly! 🚀",
    suggestions: pickSuggestions(new Set()),
  }]);
  const [chatHistory, setChatHistory] = useState([]);
  const [usedSuggestions] = useState(() => new Set());

  const emailStateRef  = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);

  // auto-focus
  useEffect(() => { textareaRef.current?.focus(); }, []);

  // auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages]);

  // auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  // warmup on mount
  useEffect(() => {
    fetch('https://aj-backend.vercel.app/api/ask-gemini', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ query:'__warmup__', history:[] }),
    }).catch(() => {});
  }, []);

  const fetchWithTimeout = useCallback((url, options = {}, timeout = 28000) =>
    Promise.race([
      fetch(url, options),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout)),
    ]), []);

  const replaceMessage = (id, patch) =>
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m));

  const submit = useCallback(async (text) => {
    const q = text.trim();
    if (!q || isLoading) return;

    setIsLoading(true);
    const thinkingId = crypto.randomUUID();

    setMessages(prev => [
      ...prev,
      { id: crypto.randomUUID(), sender:'user', text: q },
      { id: thinkingId, sender:'bot', text:'__thinking__' },
    ]);
    setInput('');
    setTimeout(() => textareaRef.current?.focus(), 0);

    try {
      const res = await fetchWithTimeout('https://aj-backend.vercel.app/api/ask-gemini', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          query: q,
          history: chatHistory.slice(-20),
          emailState: emailStateRef.current,
        }),
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();

      emailStateRef.current = data.emailState || null;
      setChatHistory(data.history || []);

      // pick fresh suggestions (not used before, not same as current)
      const newSugs = pickSuggestions(usedSuggestions);
      newSugs.forEach(s => usedSuggestions.add(s));

      replaceMessage(thinkingId, {
        text: data.answer,
        cards:    data.cards    || [],
        skills:   data.skills   || [],
        suggestions: data.emailState ? [] : newSugs,
        emailStep: data.emailState?.step || null,
      });

    } catch (err) {
      replaceMessage(thinkingId, {
        text: err.message === 'timeout'
          ? "⏱️ Taking longer than usual — please try again!"
          : "⚠️ Something went wrong. Please try again!",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isLoading, chatHistory, fetchWithTimeout, usedSuggestions]);

  const handleSubmit = (e) => { e?.preventDefault(); submit(input); };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(input); }
  };

  const handleSuggestion = (s) => { submit(s); };

  const emailStep = emailStateRef.current?.step || null;

  return (
    <div style={{
      position:'fixed', zIndex:50,
      bottom:0, right:0,
      width:'100%', height:'90%',
      display:'flex', flexDirection:'column',
      background: BG,
      color:'#E0F0ED',
      borderTop:`1px solid ${BORDER}`,
      fontFamily:"'DM Sans', 'Segoe UI', sans-serif",
      overflow:'hidden',
    }}
    className="sm:w-[90%] md:w-[75%] lg:w-[48%] sm:bottom-6 sm:right-6 sm:h-[88%] sm:rounded-xl sm:border"
    >

      {/* ── Header ── */}
      <div style={{
        display:'flex', alignItems:'center', gap:10,
        padding:'12px 16px',
        borderBottom:`1px solid ${BORDER}`,
        background:`linear-gradient(135deg, #0C1712 0%, #080D0B 100%)`,
        flexShrink:0,
      }}>
        <div style={{
          width:36, height:36, borderRadius:'50%',
          background:`linear-gradient(135deg,${CYAN},${GOLD})`,
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        }}>
          <RiRobot2Line size={20} color="#000" />
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:14, color:'#fff', letterSpacing:0.3 }}>Akarsh's AI</div>
          <div style={{ fontSize:11, color: CYAN, display:'flex', alignItems:'center', gap:4 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background: CYAN, display:'inline-block',
              boxShadow:`0 0 6px ${CYAN}` }} />
            Online · Ask me anything
          </div>
        </div>
        <button onClick={onClose} aria-label="Close chat" style={{
          background:'transparent', border:'none', cursor:'pointer',
          color:'#5A7A74', padding:4, borderRadius:'50%',
          display:'flex', alignItems:'center', justifyContent:'center',
          transition:'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color='#fff'}
        onMouseLeave={e => e.currentTarget.style.color='#5A7A74'}
        >
          <IoClose size={22} />
        </button>
      </div>

      {/* ── Email progress ── */}
      {emailStep && <EmailProgress step={emailStep} />}

      {/* ── Messages ── */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 14px', display:'flex', flexDirection:'column', gap:14 }}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div key={msg.id}
              initial={{ opacity:0, y:10 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.25 }}
              style={{ display:'flex', flexDirection:'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {/* bubble row */}
              <div style={{ display:'flex', alignItems:'flex-end', gap:8,
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                maxWidth:'85%',
              }}>
                {/* avatar */}
                {msg.sender === 'bot' && (
                  <div style={{
                    width:28, height:28, borderRadius:'50%', flexShrink:0,
                    background:`linear-gradient(135deg,${CYAN},${GOLD})`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <RiRobot2Line size={15} color="#000" />
                  </div>
                )}

                {/* bubble */}
                <div style={{
                  padding:'10px 14px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.sender === 'user'
                    ? `linear-gradient(135deg,${CYAN}CC,${CYAN}99)`
                    : CARD,
                  border: msg.sender === 'user' ? 'none' : `1px solid ${BORDER}`,
                  color: msg.sender === 'user' ? '#000' : '#D8EDEA',
                  fontSize:13, lineHeight:1.6,
                  maxWidth:'100%',
                }}>
                  {msg.text === '__thinking__'
                    ? <TypingDots />
                    : <ReactMarkdown components={mdComponents}>
                        {msg.text}
                      </ReactMarkdown>
                  }
                </div>
              </div>

              {/* rich cards */}
              {msg.cards?.length > 0 && (
                <div style={{ maxWidth:'85%', marginLeft:36, width:'100%' }}>
                  {msg.cards.map((c, i) => <ProjectCard key={i} {...c} />)}
                </div>
              )}

              {/* skill tags */}
              {msg.skills?.length > 0 && (
                <div style={{ maxWidth:'85%', marginLeft:36 }}>
                  <SkillTags skills={msg.skills} />
                </div>
              )}

              {/* suggestion chips */}
              {msg.suggestions?.length > 0 && (
                <div style={{
                  display:'flex', flexWrap:'wrap', gap:6,
                  marginTop:8, marginLeft:36, maxWidth:'90%',
                }}>
                  {msg.suggestions.map(s => (
                    <button key={s} onClick={() => handleSuggestion(s)}
                      disabled={isLoading}
                      style={{
                        fontSize:11, padding:'5px 11px', borderRadius:20, cursor:'pointer',
                        background:'rgba(0,191,166,0.08)',
                        border:`1px solid rgba(0,191,166,0.3)`,
                        color: CYAN, transition:'all 0.2s',
                        fontFamily:'inherit',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background=`rgba(0,191,166,0.2)`; }}
                      onMouseLeave={e => { e.currentTarget.style.background=`rgba(0,191,166,0.08)`; }}
                    >{s}</button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <form onSubmit={handleSubmit} style={{
        padding:'10px 14px 14px',
        borderTop:`1px solid ${BORDER}`,
        display:'flex', gap:8, alignItems:'flex-end',
        background: BG, flexShrink:0,
      }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isLoading}
          placeholder="Ask anything about Akarsh…"
          style={{
            flex:1, maxHeight:120, padding:'10px 14px',
            background: CARD,
            border:`1px solid ${BORDER}`,
            borderRadius:14, color:'#E0F0ED', fontSize:13,
            resize:'none', outline:'none', fontFamily:'inherit',
            lineHeight:1.5, overflowY:'hidden',
            transition:'border-color 0.2s',
          }}
          onFocus={e => e.currentTarget.style.borderColor = CYAN}
          onBlur={e => e.currentTarget.style.borderColor = BORDER}
        />
        <button type="submit" disabled={isLoading || !input.trim()}
          aria-label="Send message"
          style={{
            width:42, height:42, borderRadius:'50%', border:'none', cursor:'pointer',
            background: (isLoading || !input.trim())
              ? '#1A2E28'
              : `linear-gradient(135deg,${CYAN},${GOLD})`,
            display:'flex', alignItems:'center', justifyContent:'center',
            flexShrink:0, transition:'all 0.2s',
            boxShadow: (!isLoading && input.trim()) ? `0 0 12px ${CYAN}55` : 'none',
          }}
        >
          {isLoading
            ? <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}>
                <IoSparkles size={18} color={CYAN} />
              </motion.div>
            : <IoSend size={17} color={input.trim() ? '#000' : '#3A5A54'} />
          }
        </button>
      </form>
    </div>
  );
}