// visitorTracker.js - High-Reliability Exit Telemetry & AI Intent Tracker for Telegram
// Built following the Council Deliberation protocol

class VisitorTracker {
  constructor() {
    this.startTime = Date.now();
    this.maxScroll = 0;
    this.sectionsViewed = new Set(['home']);
    this.actions = [];
    this.chatQueries = [];
    this.aiIntentSummary = '';
    this.geoData = null;
    this.knownVisitor = '';
    this.isInitialized = false;
    this.hasDispatched = false;
    this.isSummarizing = false;
  }

  init() {
    if (typeof window === 'undefined' || this.isInitialized) return;
    this.isInitialized = true;

    // 1. Read URL query params for known recruiter/contact tags (e.g. ?v=Google_Recruiter or ?ref=LinkedIn)
    try {
      const params = new URLSearchParams(window.location.search);
      this.knownVisitor = params.get('v') || params.get('ref') || params.get('from') || '';
    } catch {
      this.knownVisitor = '';
    }

    // 2. Asynchronously fetch Geo & ISP data (non-blocking)
    this.fetchGeoData();

    // 3. Track scroll depth milestones and sections viewed
    this.setupScrollAndSectionTracking();

    // 4. Global click listener for key portfolio interactions
    this.setupGlobalActionTracking();

    // 5. Setup zero-loss exit listeners (visibilitychange & pagehide)
    this.setupExitListeners();
  }

  async fetchGeoData() {
    try {
      // Primary: ipapi.co (free, returns city, country, org/ISP)
      const res = await fetch('https://ipapi.co/json/', { cache: 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        this.geoData = {
          ip: data.ip || 'Unknown',
          city: data.city || '',
          region: data.region || '',
          country: data.country_name || '',
          countryCode: data.country_code || '',
          org: data.org || data.asn || 'Residential / Mobile ISP',
        };
        return;
      }
    } catch {
      // Fallback
    }

    // Secondary fallback: cloudflare trace or simple timezone
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown Timezone';
      this.geoData = {
        city: tz.split('/')[1]?.replace(/_/g, ' ') || 'Unknown',
        country: tz.split('/')[0] || 'Unknown',
        org: 'Standard Network',
      };
    } catch {
      this.geoData = { city: 'Unknown', country: 'Unknown', org: 'Standard Network' };
    }
  }

  setupScrollAndSectionTracking() {
    let scrollTimeout = null;
    const handleScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          const currentScroll = Math.min(100, Math.round((window.scrollY / totalHeight) * 100));
          if (currentScroll > this.maxScroll) {
            this.maxScroll = currentScroll;
          }
        }

        // Detect active sections by DOM query
        const sections = ['home', 'about', 'skills', 'projects', 'contact'];
        sections.forEach((secId) => {
          const el = document.getElementById(secId);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.6 && rect.bottom > 0) {
              this.sectionsViewed.add(secId);
            }
          }
        });
      }, 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  setupGlobalActionTracking() {
    window.addEventListener('click', (e) => {
      const target = e.target.closest('a, button');
      if (!target) return;

      const href = target.getAttribute('href') || '';
      const text = (target.innerText || target.getAttribute('aria-label') || '').trim();

      if (href.includes('resume.pdf') || text.toLowerCase().includes('resume')) {
        this.trackAction('📄 Downloaded Resume');
      } else if (href.includes('github.com')) {
        this.trackAction('🐙 Visited GitHub Profile');
      } else if (href.includes('linkedin.com')) {
        this.trackAction('💼 Visited LinkedIn Profile');
      } else if (href.includes('projects') || text.toLowerCase().includes('view my work')) {
        this.trackAction('🚀 Clicked View My Work');
      } else if (text.toLowerCase().includes('live demo') || text.toLowerCase().includes('github →')) {
        this.trackAction(`📂 Inspected Project Link (${text})`);
      }
    }, { passive: true });
  }

  trackAction(actionName) {
    if (!actionName || this.actions.includes(actionName)) return;
    if (this.actions.length < 12) {
      this.actions.push(actionName);
    }
  }

  recordChatQuery(query) {
    if (!query) return;
    this.chatQueries.push(query);
    this.trackAction('💬 Engaged with AI Assistant');

    // Debounced background generation of AI Intent Summary
    this.scheduleIntentSummary();
  }

  scheduleIntentSummary() {
    if (this.isSummarizing || this.chatQueries.length === 0) return;
    
    // Proactively generate intent summary while user is still on site
    setTimeout(async () => {
      await this.generateAIIntentSummary();
    }, 1500);
  }

  async generateAIIntentSummary() {
    if (this.isSummarizing || this.chatQueries.length === 0) return;
    this.isSummarizing = true;

    try {
      const formattedQueries = this.chatQueries.map((q, i) => `${i + 1}. "${q}"`).join('\n');
      const prompt = `Analyze these questions asked by a visitor on Akarsh J's software engineering portfolio chatbot:\n${formattedQueries}\n\nIn ONE concise, punchy paragraph (3-4 sentences), summarize who this visitor likely is (e.g. tech recruiter, prospective client, fellow developer, student), their core intent, and the exact skills or projects they cared about. Write only the paragraph summary, no conversational filler.`;

      const res = await fetch('https://aj-backend.vercel.app/api/ask-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: prompt,
          history: [],
          action: 'stream_chat',
        }),
      });

      if (res.ok) {
        const text = await res.text();
        // Parse standard or SSE stream if applicable
        let cleanText = text;
        if (text.includes('data:')) {
          cleanText = text
            .split('\n')
            .filter((l) => l.startsWith('data:'))
            .map((l) => l.replace('data:', '').trim())
            .join(' ');
        }
        this.aiIntentSummary = cleanText.trim().replace(/^"|"$/g, '');
      }
    } catch (err) {
      // Fallback intent summary based on heuristics
      const joined = this.chatQueries.join(' ').toLowerCase();
      if (/hire|salary|experience|resume|role|job|contact/i.test(joined)) {
        this.aiIntentSummary = "The visitor asked questions regarding Akarsh's career background, work experience, and hiring/contact channels. High hiring intent.";
      } else if (/ai|project|model|tech|react|gemini/i.test(joined)) {
        this.aiIntentSummary = "The visitor was technically evaluating Akarsh's project portfolio, specifically inquiring about his AI architecture and full-stack implementations.";
      } else {
        this.aiIntentSummary = `The visitor inquired about: ${this.chatQueries.slice(-2).join(', ')}`;
      }
    } finally {
      this.isSummarizing = false;
    }
  }

  setupExitListeners() {
    const triggerExit = () => {
      this.dispatchExitReport();
    };

    // Modern browsers: visibilitychange (when tab is hidden / closed / switched)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        triggerExit();
      }
    });

    // Mobile & desktop page unload
    window.addEventListener('pagehide', triggerExit);

    // Desktop tab closure / page reload
    window.addEventListener('beforeunload', triggerExit);

    // Provide global manual trigger for instant testing
    if (typeof window !== 'undefined') {
      window.__dispatchExitReport = () => {
        this.hasDispatched = false;
        console.log('[VisitorTracker] Manual exit report triggered!');
        this.dispatchExitReport(true);
      };
    }
  }

  formatDuration(ms) {
    const totalSec = Math.max(1, Math.round(ms / 1000));
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  }

  getCountryFlag(countryCode) {
    if (!countryCode || countryCode.length !== 2) return '🌐';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  }

  buildTelegramHTML() {
    const durationStr = this.formatDuration(Date.now() - this.startTime);
    const flag = this.getCountryFlag(this.geoData?.countryCode);
    const locationStr = this.geoData?.city
      ? `${this.geoData.city}, ${this.geoData.country} ${flag}`
      : (this.geoData?.country || 'Unknown Location');

    const orgStr = this.geoData?.org || 'Standard Network';
    const scrollStr = `${this.maxScroll}% (${Array.from(this.sectionsViewed).join(' → ')})`;
    const referrerStr = document.referrer ? new URL(document.referrer).hostname : 'Direct / Bookmark';
    
    // User Agent / Device parsing
    const ua = navigator.userAgent;
    let deviceType = 'Desktop';
    if (/android/i.test(ua)) deviceType = 'Android 📱';
    else if (/iphone|ipad|ipod/i.test(ua)) deviceType = 'iOS 📱';
    else if (/mac/i.test(ua)) deviceType = 'Mac OS 💻';
    else if (/win/i.test(ua)) deviceType = 'Windows 💻';
    else if (/linux/i.test(ua)) deviceType = 'Linux 💻';

    let html = `🚀 <b>New Portfolio Visitor Session Report</b>\n\n`;

    if (this.knownVisitor) {
      html += `👤 <b>Identified Tag:</b> <code>${this.escapeHTML(this.knownVisitor)}</code>\n`;
    }

    html += `📍 <b>Location:</b> ${this.escapeHTML(locationStr)}\n`;
    html += `🏢 <b>Network / Org:</b> ${this.escapeHTML(orgStr)}\n`;
    html += `⏱️ <b>Time on Site:</b> ${durationStr}\n`;
    html += `📜 <b>Scroll Depth:</b> ${scrollStr}\n`;
    html += `📱 <b>Device:</b> ${deviceType} (${window.innerWidth}x${window.innerHeight})\n`;
    html += `🔗 <b>Referrer:</b> ${this.escapeHTML(referrerStr)}\n`;

    if (this.actions.length > 0) {
      html += `\n🎯 <b>Key Actions Taken:</b>\n`;
      this.actions.forEach((act) => {
        html += `• ${this.escapeHTML(act)}\n`;
      });
    }

    if (this.aiIntentSummary) {
      html += `\n🧠 <b>AI Visitor Intent Analysis:</b>\n<blockquote>${this.escapeHTML(this.aiIntentSummary)}</blockquote>\n`;
    } else if (this.chatQueries.length > 0) {
      html += `\n💬 <b>Chat Questions Asked:</b>\n`;
      this.chatQueries.slice(0, 4).forEach((q) => {
        html += `• <i>"${this.escapeHTML(q)}"</i>\n`;
      });
    }

    return html;
  }

  escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  dispatchExitReport(force = false) {
    // Prevent multiple dispatches for the same session
    if (this.hasDispatched) return;

    const durationSeconds = Math.round((Date.now() - this.startTime) / 1000);

    // Filter out 0-second crawler bounces unless forced or user interacted
    if (!force && durationSeconds < 3 && this.actions.length === 0 && this.chatQueries.length === 0 && this.maxScroll < 10) {
      return;
    }

    this.hasDispatched = true;

    const htmlMessage = this.buildTelegramHTML();
    const durationStr = this.formatDuration(Date.now() - this.startTime);
    const flag = this.getCountryFlag(this.geoData?.countryCode);
    const locationStr = this.geoData?.city
      ? `${this.geoData.city}, ${this.geoData.country} ${flag}`
      : (this.geoData?.country || 'Unknown Location');

    const ua = navigator.userAgent;
    let deviceType = 'Desktop';
    if (/android/i.test(ua)) deviceType = 'Android';
    else if (/iphone|ipad|ipod/i.test(ua)) deviceType = 'iOS';
    else if (/mac/i.test(ua)) deviceType = 'Mac OS';
    else if (/win/i.test(ua)) deviceType = 'Windows';
    else if (/linux/i.test(ua)) deviceType = 'Linux';

    const sessionData = {
      location: locationStr,
      city: this.geoData?.city || '',
      country: this.geoData?.country || '',
      org: this.geoData?.org || 'Standard Network',
      duration: durationStr,
      durationSeconds,
      maxScroll: this.maxScroll,
      sectionsViewed: Array.from(this.sectionsViewed),
      actions: this.actions,
      chatQueries: this.chatQueries,
      aiIntentSummary: this.aiIntentSummary,
      knownTag: this.knownVisitor,
      device: `${deviceType} (${window.innerWidth}x${window.innerHeight})`,
      referrer: document.referrer || 'Direct',
    };

    const backendEndpoint = import.meta.env.VITE_NOTIFY_API_URL || 'https://aj-backend.vercel.app/api/notify-telegram';
    const localToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const localChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    // Dev preview in console
    console.log(
      '%c[VisitorTracker] Exit Report Dispatched!',
      'color: #00f4ff; font-weight: bold;',
      '\n\n' + htmlMessage
    );

    // 1. Primary: Send through secure backend (Zero secrets in frontend)
    // CRITICAL: We pass Blob with type 'text/plain'. This is a CORS-safelisted Content-Type
    // which eliminates the CORS preflight (OPTIONS) request that browsers abort during tab teardown!
    const backendPayload = JSON.stringify({
      message: htmlMessage,
      session: sessionData,
    });
    let sent = false;

    if (navigator.sendBeacon) {
      try {
        const blob = new Blob([backendPayload], { type: 'text/plain' });
        sent = navigator.sendBeacon(backendEndpoint, blob);
      } catch {
        sent = false;
      }
    }

    if (!sent) {
      try {
        fetch(backendEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: backendPayload,
          keepalive: true,
        }).catch(() => {});
      } catch {
        // Silent error handling on page unload
      }
    }

    // 2. Secondary fallback: Direct Telegram call if local developer credentials exist
    if (localToken && localChatId) {
      const directEndpoint = `https://api.telegram.org/bot${localToken}/sendMessage`;
      const directPayload = JSON.stringify({
        chat_id: localChatId,
        text: htmlMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });

      if (navigator.sendBeacon) {
        try {
          const blob = new Blob([directPayload], { type: 'text/plain' });
          navigator.sendBeacon(directEndpoint, blob);
        } catch {}
      }
    }
  }
}

export const visitorTracker = new VisitorTracker();
