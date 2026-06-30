// ===================== TESTIMONIAL SWITCHER =====================
const strips = document.querySelectorAll('.strip-item');
const quote = document.querySelector('.testimonial-quote');
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
const hamburger = document.querySelector('.nav-hamburger');
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
// Footer is position:fixed at bottom. page-wrap needs margin-bottom = footer height
// so content is scrollable above the footer.
const pageWrap = document.querySelector('.page-wrap');
const siteFooter = document.querySelector('.site-footer');

function syncFooterReveal() {
  if (pageWrap && siteFooter) {
    pageWrap.style.marginBottom = siteFooter.offsetHeight + 'px';
  }
}
syncFooterReveal();
window.addEventListener('resize', syncFooterReveal);

// ===================== CARD REVEAL (Intersection Observer) =====================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.card-reveal').forEach(el => revealObserver.observe(el));

// ===================== STAT COUNTER ANIMATION =====================
function animateCounter(el) {
  const raw = el.dataset.target;
  if (!raw) return;
  const target = parseFloat(raw);
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
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
// Trigger progress bar fills when the feature/how section enters viewport
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

// ===================== ORBIT PULSE =====================
// Subtle pulse animation on the center orbit node
const orbitCenter = document.querySelector('.o-center');
if (orbitCenter) {
  let scale = 1;
  setInterval(() => {
    orbitCenter.style.transform = 'scale(1.04)';
    orbitCenter.style.transition = 'transform 1s ease-in-out';
    setTimeout(() => {
      orbitCenter.style.transform = 'scale(1)';
    }, 1000);
  }, 3000);
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
