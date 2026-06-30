// ===================== SCROLL PROGRESS BAR =====================
const scrollProgress = document.getElementById('scroll-progress');
function updateScrollProgress() {
  if (!scrollProgress) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });

// ===================== CURSOR GLOW =====================
const cursorGlow = document.getElementById('cursor-glow');
if (cursorGlow && window.matchMedia('(min-width: 769px)').matches) {
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
  }, { passive: true });
}

// ===================== TESTIMONIAL SWITCHER =====================
const strips = document.querySelectorAll('.strip-item');
const quote  = document.querySelector('.testimonial-quote');
const authorName = document.querySelector('.author-name');
const authorRole = document.querySelector('.author-role');

const defaultTestimonial = {
  quote: "We went from three tools and constant confusion to one place where everything lives. Onboarding new hires used to take a week — now it takes an afternoon.",
  name: "Sarah K.",
  role: "Co-founder, Luma Labs"
};

strips.forEach((item) => {
  item.addEventListener('click', () => {
    strips.forEach(s => s.classList.remove('strip-item--active'));
    item.classList.add('strip-item--active');

    const q = item.dataset.quote || defaultTestimonial.quote;
    const n = item.dataset.name  || defaultTestimonial.name;
    const r = item.dataset.role  || defaultTestimonial.role;

    quote.style.opacity = '0';
    setTimeout(() => {
      quote.textContent = `"${q}"`;
      authorName.textContent = n;
      authorRole.textContent = r;
      quote.style.opacity = '1';
    }, 150);
  });
});

// ===================== HAMBURGER MENU =====================
const hamburger  = document.querySelector('.nav-hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('is-open');
    mobileMenu.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('is-open');
      mobileMenu.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
}

// ===================== FOOTER REVEAL =====================
const pageWrap   = document.querySelector('.page-wrap');
const siteFooter = document.querySelector('.site-footer');

function syncFooterReveal() {
  if (pageWrap && siteFooter) {
    pageWrap.style.marginBottom = siteFooter.offsetHeight + 'px';
  }
}
syncFooterReveal();
window.addEventListener('resize', syncFooterReveal);

// ===================== INTERSECTION OBSERVER: CARD REVEAL =====================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('.card-reveal').forEach(el => revealObserver.observe(el));

// ===================== SECTION HEADER REVEAL =====================
const headerRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      headerRevealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.anim-section-header').forEach(el => headerRevealObserver.observe(el));

// ===================== STAT COUNTER ANIMATION =====================
function animateCounter(el) {
  const raw = el.dataset.target;
  if (!raw) return;
  const target   = parseFloat(raw);
  const suffix   = el.dataset.suffix || '';
  const duration = 1400;
  const start    = performance.now();

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(eased * target);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) statsObserver.observe(statsSection);

// ===================== PROGRESS BAR TRIGGER =====================
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.feature-card, .how-card').forEach(el => {
  progressObserver.observe(el);
});

// ===================== ORBIT CSS PULSE =====================
// Handled in CSS via @keyframes orbitPulse on .o-center

// ===================== CARD 3D TILT =====================
const tiltCards = document.querySelectorAll('.feature-card, .pricing-card');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    const rotX   = -dy * 4;
    const rotY   =  dx * 4;
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px) scale(1.005)`;
    card.style.transition = 'transform 0.08s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.35s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.35s';
  });
});

// ===================== HERO PATTERN PARALLAX =====================
const heroPattern = document.querySelector('.hero-pattern');
if (heroPattern) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroPattern.style.transform = `translateY(${y * 0.2}px)`;
  }, { passive: true });
}

// ===================== ACTIVE NAV LINK =====================
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--gray-900)' : '';
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => navObserver.observe(s));

// ===================== BUTTON RIPPLE =====================
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 1.5;
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;

    Object.assign(ripple.style, {
      position:      'absolute',
      width:         size + 'px',
      height:        size + 'px',
      left:          x + 'px',
      top:           y + 'px',
      borderRadius:  '50%',
      background:    'rgba(255,255,255,0.2)',
      transform:     'scale(0)',
      pointerEvents: 'none',
      animation:     'rippleOut 0.5s ease-out forwards'
    });

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Inject ripple keyframe once
if (!document.getElementById('ripple-style')) {
  const s = document.createElement('style');
  s.id = 'ripple-style';
  s.textContent = '@keyframes rippleOut { to { transform: scale(1); opacity: 0; } }';
  document.head.appendChild(s);
}
