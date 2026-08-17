// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ── PROGRESS BAR ──
const prog = document.getElementById('prog');
window.addEventListener('scroll', () => {
  const maxScroll = document.body.scrollHeight - innerHeight;
  const pct = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  prog.style.width = Math.min(pct, 100) + '%';
}, { passive: true });

// ── THEME TOGGLE WITH GA4 TRACKING ──
const btn = document.getElementById('toggle');
let dark = true;
btn.addEventListener('click', () => {
  dark = !dark;
  const mode = dark ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', mode);
  btn.textContent = dark ? '🌙' : '☀️';
  if (typeof gtag === 'function') {
    gtag('event', 'theme_change', { 'theme': mode });
  }
});

// ── INTERACTIVE GA4 & GOOGLE TAGS EVENT TRACKING ──
function trackClick(id, category, label) {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'contact_click', {
          'event_category': category,
          'event_label': label,
          'contact_type': label,
          'destination_url': el.href || ''
        });
      }
    });
  }
}
trackClick('contact-phone', 'Contact', 'Phone');
trackClick('contact-email', 'Contact', 'Email');
trackClick('contact-linkedin', 'Contact', 'LinkedIn');
trackClick('contact-whatsapp', 'Contact', 'WhatsApp');

// ── GOOGLE TAGS - KEYWORD & TAG CLICK TRACKING ──
document.querySelectorAll('.tag').forEach(tag => {
  tag.style.cursor = 'pointer';
  tag.addEventListener('click', () => {
    const tagName = tag.textContent.trim();
    if (typeof gtag === 'function') {
      gtag('event', 'keyword_tag_click', {
        'event_category': 'Engagement',
        'event_label': tagName,
        'tag_name': tagName
      });
    }
  });
});

// ── SECTION ENGAGEMENT TRACKING (SEO & USER BEHAVIOR) ──
const trackedSections = new Set();
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const sectionHeader = entry.target.querySelector('h2.slabel') || entry.target.querySelector('h3.job-title');
      const sectionName = sectionHeader ? sectionHeader.textContent.trim() : entry.target.tagName;
      if (sectionName && !trackedSections.has(sectionName)) {
        trackedSections.add(sectionName);
        if (typeof gtag === 'function') {
          gtag('event', 'section_view', {
            'event_category': 'Content Engagement',
            'section_name': sectionName
          });
        }
      }
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.panel, .job, .faq-item').forEach(sec => sectionObserver.observe(sec));

// ── REVEAL ON SCROLL ──
const revs = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      e.target.querySelectorAll('.bar-fill').forEach(b => {
        setTimeout(() => b.style.width = b.dataset.w + '%', 250);
      });
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
revs.forEach((el, i) => {
  el.style.transitionDelay = Math.min(i * 0.05, 0.35) + 's';
  obs.observe(el);
});

// ── CODE RAIN BACKGROUND ──
const cv = document.getElementById('debris');
if (cv) {
  const cx = cv.getContext('2d');

  function resizeCv() { cv.width = innerWidth; cv.height = innerHeight; initCols(); }
  window.addEventListener('resize', resizeCv, { passive: true });

  const codeLines = [
    'const user = {', '  name: "Moussa",', '  role: "AM",',
    '  skills: [', '    "n8n",', '    "APIs",', '    "CRM"', '  ]', '};',
    'function automate(flow) {', '  return flow', '    .filter(ok)', '    .map(run);', '}',
    'async function fetch(url) {', '  const res = await', '    api.get(url);', '  return res.data;', '}',
    'workflow.on("trigger", e => {', '  notify(e.client);', '  log(e.ts);', '});',
    'if (client.happy) {', '  retain();', '} else {', '  escalate();', '}',
    'const pipeline =', '  leads.filter(q)', '  .map(demo)', '  .close();',
    'class Account {', '  constructor(id) {', '    this.id = id;', '  }',
    '  async health() {', '    return kpi.get(id);', '  }', '}',
    '// integrate CRM', 'webhook.post("/lead",', '  async (req) => {', '    await crm.add(req);', '  });',
    'export default {', '  manager: Moussa,', '  stack: n8n,', '  mode: "auto"', '};',
    'import { n8n }', '  from "@workflow";',
    'const deal = await', '  sales.close(lead);',
    'return { success: true };', 'console.log("done ✓");',
  ];

  const FONT_SIZE = 12;
  const COL_W     = () => window.innerWidth < 640 ? 110 : 200;
  let cols = [];

  function initCols() {
    const cw = COL_W();
    const numCols = Math.ceil(cv.width / cw) + 1;
    cols = Array.from({ length: numCols }, (_, i) => ({
      x: i * cw + Math.random() * 30 - 15,
      y: Math.random() * -cv.height * 1.5,
      speed: Math.random() * 0.5 + 0.25,
      lines: shuffleLines(),
      lineIdx: 0,
      lineY: 0,
    }));
  }

  function shuffleLines() {
    const arr = [...codeLines];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function tokenColor(line, isDark) {
    const t = line.trim();
    if (/^\/\//.test(t))                              return isDark ? '#3fb950' : '#1a7f37';
    if (/^(const|let|var|function|class|return|import|export|async|await|if|else)/.test(t))
                                                       return isDark ? '#ff7b72' : '#cf222e';
    if (/^["'`]/.test(t) || /".*"/.test(t))           return isDark ? '#a5d6ff' : '#0a3069';
    if (/^\s*\/\//.test(line))                         return isDark ? '#3fb950' : '#1a7f37';
    if (/[(){}[\]]/.test(t) && t.length <= 3)         return isDark ? '#ffa657' : '#bc4c00';
    return isDark ? '#8b949e' : '#656d76';
  }

  function drawRain() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    cx.fillStyle = isDark ? 'rgba(13,17,23,0.18)' : 'rgba(246,248,250,0.18)';
    cx.fillRect(0, 0, cv.width, cv.height);

    cx.font = `${window.innerWidth < 640 ? 10 : 12}px "JetBrains Mono", monospace`;

    cols.forEach(col => {
      const line = col.lines[col.lineIdx % col.lines.length];
      const y    = col.y;

      if (y > 0 && y < cv.height + FONT_SIZE) {
        cx.globalAlpha = 0.28;
        cx.fillStyle   = tokenColor(line, isDark);
        cx.fillText(line, col.x, y);
      }

      col.y += col.speed;

      if (col.y - col.lineY > FONT_SIZE + 4) {
        col.lineY = col.y;
        col.lineIdx++;
      }

      if (col.y > cv.height + 200) {
        col.y      = Math.random() * -cv.height;
        col.lineY  = col.y;
        col.lineIdx = 0;
        col.speed  = Math.random() * 0.5 + 0.25;
        col.lines  = shuffleLines();
      }
    });

    requestAnimationFrame(drawRain);
  }

  resizeCv();
  drawRain();
}
