import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiSend, 
  FiMapPin, 
  FiClock, 
  FiDownload,
  FiZap
} from 'react-icons/fi'
import { FaGithub, FaLinkedin, FaRocket } from 'react-icons/fa'
import { RiRobot2Line } from 'react-icons/ri'

const ESCAPE_HTML = (str) => {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const Contacts = ({ onAskAI }) => {
  const [formData, setFormData] = useState({
    callsign: '',
    frequency: '',
    subject: '',
    payload: '',
    honeypot: '', // anti-spam bot trap
  })
  const [isTransmitting, setIsTransmitting] = useState(false)
  const [transmitStatus, setTransmitStatus] = useState(null) // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 1. Anti-bot honeypot check
    if (formData.honeypot) {
      setTransmitStatus('success')
      return
    }

    // 2. Client-side validation
    if (!formData.callsign.trim() || !formData.frequency.trim() || !formData.payload.trim()) {
      setErrorMessage('Please fill in your name, email, and message.')
      return
    }

    setIsTransmitting(true)
    setErrorMessage('')

    const cleanSubject = formData.subject.trim() || 'Portfolio Contact Message'

    // Format message for Telegram
    const telegramHTML = `📬 <b>New Message from Portfolio!</b>\n\n` +
      `👤 <b>Name:</b> <code>${ESCAPE_HTML(formData.callsign.trim())}</code>\n` +
      `✉️ <b>Sender Email:</b> <a href="mailto:${ESCAPE_HTML(formData.frequency.trim())}">${ESCAPE_HTML(formData.frequency.trim())}</a>\n` +
      `📝 <b>Subject:</b> <i>${ESCAPE_HTML(cleanSubject)}</i>\n` +
      `⏱️ <b>Time:</b> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST\n\n` +
      `💬 <b>Message:</b>\n<blockquote>${ESCAPE_HTML(formData.payload.trim())}</blockquote>`

    const backendEndpoint = import.meta.env.VITE_NOTIFY_API_URL || 'https://aj-backend.vercel.app/api/notify-telegram'
    const localToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
    const localChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID

    let delivered = false

    // Tier 1: Dispatch via Vercel Backend Relay
    try {
      const res = await fetch(backendEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: telegramHTML }),
      })

      if (res.ok) delivered = true
    } catch (err) {
      console.warn('Backend send failed, attempting direct relay...', err)
    }

    // Tier 2: Direct fail-safe fallback using client-side Telegram Bot API
    if (!delivered && localToken && localChatId) {
      try {
        const directRes = await fetch(`https://api.telegram.org/bot${localToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: localChatId,
            text: telegramHTML,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }),
        })

        if (directRes.ok) delivered = true
      } catch (directErr) {
        console.error('Direct Telegram send failed:', directErr)
      }
    }

    setIsTransmitting(false)

    if (delivered) {
      setTransmitStatus('success')
      setFormData({
        callsign: '',
        frequency: '',
        subject: '',
        payload: '',
        honeypot: '',
      })
    } else {
      setTransmitStatus('error')
      setErrorMessage(
        'Could not deliver message right now. Please connect directly with me on LinkedIn or GitHub!'
      )
    }
  }

  const resetTransmission = () => {
    setTransmitStatus(null)
    setErrorMessage('')
  }

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full bg-black text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center overflow-hidden isolate"
    >
      {/* Ambient Nebula Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 -left-32 w-[50vw] max-w-[450px] h-[50vw] max-h-[450px] rounded-full bg-gradient-to-tr from-[#302b63] via-[#00f4ff]/15 to-transparent opacity-25 blur-[140px]"
          style={{ transform: 'translateZ(0)' }}
        />
        <div
          className="absolute bottom-10 -right-32 w-[50vw] max-w-[450px] h-[50vw] max-h-[450px] rounded-full bg-gradient-to-bl from-[#ffc922]/15 via-[#1cd8d2]/15 to-transparent opacity-20 blur-[150px]"
          style={{ transform: 'translateZ(0)' }}
        />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto flex flex-col gap-6 sm:gap-8">
        
        {/* Section Header (Compact) */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-[#00f4ff]/30 text-xs font-mono text-[#00f4ff] tracking-wider mb-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f4ff] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f4ff]" />
            </span>
            <span>GET IN TOUCH</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#00f4ff] to-[#ffc922]"
          >
            Let's Build Something Great
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-1.5 text-gray-300 text-xs sm:text-sm leading-relaxed"
          >
            Have an engineering role, project, or question? Send a message below — it pings my phone instantly!
          </motion.p>
        </div>

        {/* Compact Split Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          
          {/* LEFT COLUMN: Unified Info & Outlinks (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col justify-between gap-5"
          >
            {/* Status & Intro */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Open for Opportunities
                </span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                Available for <strong className="text-white font-semibold">Software Developer</strong> roles, AI application engineering, and high-impact web systems.
              </p>

              {/* Instant Telegram Note */}
              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200/90 flex items-center gap-2.5">
                <FiZap className="text-cyan-400 text-base shrink-0" />
                <span>Sends an instant push alert to my phone so I can reply fast.</span>
              </div>
            </div>

            {/* Quick Metadata */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-gray-400 py-3 border-y border-white/5">
              <div className="flex items-center gap-1.5">
                <FiMapPin className="text-cyan-400 shrink-0" />
                <span>Bangalore, IN</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FiClock className="text-[#ffc922] shrink-0" />
                <span>Reply: &lt; 12 hrs</span>
              </div>
            </div>

            {/* Direct Social Links */}
            <div>
              <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2.5">
                Connect Directly
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://github.com/Akarshj2003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-400/40 flex items-center gap-2 transition-all group active:scale-95"
                >
                  <FaGithub className="text-base text-gray-300 group-hover:text-white shrink-0" />
                  <div className="truncate">
                    <div className="text-xs font-bold text-white truncate">GitHub</div>
                    <div className="text-[9px] text-gray-400 font-mono truncate">@Akarshj2003</div>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/akarshj2003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-400/40 flex items-center gap-2 transition-all group active:scale-95"
                >
                  <FaLinkedin className="text-base text-gray-300 group-hover:text-[#00f4ff] shrink-0" />
                  <div className="truncate">
                    <div className="text-xs font-bold text-white truncate">LinkedIn</div>
                    <div className="text-[9px] text-gray-400 font-mono truncate">in/akarshj2003</div>
                  </div>
                </a>

                <a
                  href={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/resume.pdf`}
                  download
                  className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#ffc922]/50 flex items-center gap-2 transition-all group active:scale-95"
                >
                  <FiDownload className="text-base text-gray-300 group-hover:text-[#ffc922] shrink-0" />
                  <div className="truncate">
                    <div className="text-xs font-bold text-white truncate">Resume</div>
                    <div className="text-[9px] text-gray-400 font-mono truncate">PDF Dossier</div>
                  </div>
                </a>

                <button
                  onClick={() => onAskAI && onAskAI("How can I hire or collaborate with Akarsh?")}
                  className="p-2.5 rounded-xl bg-cyan-950/30 hover:bg-cyan-950/50 border border-cyan-400/30 hover:border-cyan-400/70 flex items-center gap-2 transition-all text-left group active:scale-95 cursor-pointer"
                >
                  <RiRobot2Line className="text-base text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                  <div className="truncate">
                    <div className="text-xs font-bold text-white truncate">Ask AI</div>
                    <div className="text-[9px] text-cyan-300 font-mono truncate">AI Dossier</div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Contact Form (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-xl h-full flex flex-col justify-center">
              
              {/* SUCCESS BANNER */}
              <AnimatePresence>
                {transmitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 rounded-xl bg-cyan-950/40 border border-cyan-400/50 text-center flex flex-col items-center gap-2.5 my-auto"
                  >
                    <div className="w-12 h-12 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center text-xl text-cyan-300">
                      <FaRocket />
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      Message Delivered! 🚀
                    </h3>
                    <p className="text-xs text-gray-300 max-w-sm leading-relaxed">
                      Thanks for reaching out! Your message was delivered straight to my phone. I'll get back to you shortly.
                    </p>
                    <button
                      onClick={resetTransmission}
                      className="mt-2 px-4 py-1.5 rounded-full bg-cyan-400/20 hover:bg-cyan-400/30 border border-cyan-400 text-xs font-mono text-white font-bold transition-all active:scale-95 cursor-pointer"
                    >
                      SEND ANOTHER MESSAGE
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* THE FORM */}
              {transmitStatus !== 'success' && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                  
                  {/* Invisible Honeypot */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                    tabIndex="-1"
                    autoComplete="off"
                  />

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="callsign"
                        required
                        value={formData.callsign}
                        onChange={handleChange}
                        placeholder="e.g. Alex Smith"
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        name="frequency"
                        required
                        value={formData.frequency}
                        onChange={handleChange}
                        placeholder="e.g. alex@company.com"
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Subject Line */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Job Opportunity / Project Discussion"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-300">
                        Message *
                      </label>
                      <span className="text-[10px] font-mono text-gray-500">
                        {formData.payload.length} chars
                      </span>
                    </div>
                    <textarea
                      name="payload"
                      required
                      rows="3"
                      value={formData.payload}
                      onChange={handleChange}
                      placeholder="Tell me a bit about what you're working on, your timeline, or just say hi..."
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Error Notification */}
                  {errorMessage && (
                    <div className="p-2.5 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-300">
                      ⚠️ {errorMessage}
                    </div>
                  )}

                  {/* Send Button */}
                  <div className="pt-0.5">
                    <button
                      type="submit"
                      disabled={isTransmitting}
                      className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#00f4ff] via-[#1cd8d2] to-[#ffc922] text-black font-extrabold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(0,244,255,0.3)] hover:shadow-[0_0_30px_rgba(0,244,255,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isTransmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Sending message...</span>
                        </>
                      ) : (
                        <>
                          <FiSend />
                          <span>SEND MESSAGE</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center text-[10.5px] text-gray-500">
                    ⚡ Delivered straight to my personal Telegram
                  </div>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default Contacts