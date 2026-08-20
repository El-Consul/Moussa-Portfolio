// ── STICKY NAV SCROLL EFFECT ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// ── ACTIVE NAV LINK ON SCROLL ──
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section, .hero');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }
  });
}, { threshold: 0.3 });
sections.forEach(sec => sectionObserver.observe(sec));

// ── MOBILE MENU TOGGLE ──
const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinksContainer.classList.toggle('open');
});
navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinksContainer.classList.remove('open');
  });
});

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

// ── GA4 EVENT TRACKING ──
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

// ── CV DOWNLOAD GA4 TRACKING ──
['hero-cv', 'nav-cv', 'contact-cv'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'cv_download', {
          'event_category': 'Conversion',
          'event_label': 'CV Download',
          'source': id
        });
      }
    });
  }
});

// ── TAG CLICK TRACKING ──
document.querySelectorAll('.tag').forEach(tag => {
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

// ── SECTION ENGAGEMENT TRACKING ──
const trackedSections = new Set();
const engageObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const sectionHeader = entry.target.querySelector('.section-title') || entry.target.querySelector('.project-name') || entry.target.querySelector('.exp-role');
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

document.querySelectorAll('.section, .project-card, .exp-card, .faq-item').forEach(sec => engageObserver.observe(sec));

// ── REVEAL ON SCROLL ──
const revs = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      e.target.querySelectorAll('.skill-fill').forEach(b => {
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

// ── SMOOTH SCROLL FOR NAV LINKS ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
