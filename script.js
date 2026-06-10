/**
 * ================================================================
 * BEBIN V — PORTFOLIO JAVASCRIPT
 * Author  : Bebin V
 * Version : 1.0.0
 * ================================================================
 *
 * Table of Contents:
 *  01. Loading Screen
 *  02. Custom Cursor
 *  03. Scroll Progress Bar
 *  04. Navbar (scroll + active link highlighting)
 *  05. Mobile Menu (hamburger)
 *  06. Theme Toggle (dark / light)
 *  07. Typewriter Animation
 *  08. Particle Canvas
 *  09. Scroll Reveal Animations
 *  10. Animated Statistics Counter
 *  11. Skill Bar Animations
 *  12. Project Filtering
 *  13. Contact Form Validation
 *  14. Back to Top Button
 *  15. Footer Year
 *  16. Init
 * ================================================================
 */

'use strict';

/* ================================================================
   01. LOADING SCREEN
================================================================ */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Hide loader when page content is ready
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Allow body interaction after loader hides
      document.body.style.overflow = '';
    }, 600);
  });

  // Safety timeout — always hide after 3s
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 3000);

  // Prevent scroll during loading
  document.body.style.overflow = 'hidden';
}

/* ================================================================
   02. CUSTOM CURSOR
================================================================ */
function initCustomCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let animId = null;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows instantly
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth ring follow via RAF
  function animateRing() {
    // Lerp (linear interpolation) for smooth trailing effect
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    animId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Cursor hover state on interactive elements
  const interactiveSelector = 'a, button, [role="button"], input, textarea, select, label, .skill-pill, .filter-btn, .project-card';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}

/* ================================================================
   03. SCROLL PROGRESS BAR
================================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function updateProgress() {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const progress     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    bar.style.width = progress + '%';
    bar.setAttribute('aria-valuenow', Math.round(progress));
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ================================================================
   04. NAVBAR — SCROLL EFFECT & ACTIVE LINK
================================================================ */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.navbar__link');
  const sections  = document.querySelectorAll('main section[id]');
  if (!navbar) return;

  // ---- Scroll styling ----
  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // ---- Active section highlighting ----
  function updateActiveLink() {
    let currentSection = '';

    sections.forEach((section) => {
      const sectionTop    = section.getBoundingClientRect().top;
      const sectionHeight = section.offsetHeight;

      if (sectionTop <= 90 && sectionTop + sectionHeight > 90) {
        currentSection = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.dataset.section === currentSection) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    handleNavbarScroll();
    updateActiveLink();
  }, { passive: true });

  handleNavbarScroll();
  updateActiveLink();

  // ---- Smooth scroll for nav links ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Close mobile menu if open
      closeMobileMenu();
    });
  });
}

/* ================================================================
   05. MOBILE MENU (HAMBURGER)
================================================================ */
let mobileMenuOpen = false;

function closeMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  mobileMenuOpen = false;
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');

  // Restore tabindex
  mobileMenu.querySelectorAll('.mobile-menu__link').forEach((link) => {
    link.setAttribute('tabindex', '-1');
  });
}

function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    mobileMenuOpen = !mobileMenuOpen;

    hamburger.classList.toggle('open', mobileMenuOpen);
    hamburger.setAttribute('aria-expanded', String(mobileMenuOpen));
    mobileMenu.classList.toggle('open', mobileMenuOpen);
    mobileMenu.setAttribute('aria-hidden', String(!mobileMenuOpen));

    mobileMenu.querySelectorAll('.mobile-menu__link').forEach((link) => {
      link.setAttribute('tabindex', mobileMenuOpen ? '0' : '-1');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (mobileMenuOpen && !hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuOpen) closeMobileMenu();
  });
}

/* ================================================================
   06. THEME TOGGLE (DARK / LIGHT)
================================================================ */
function initThemeToggle() {
  const toggle  = document.getElementById('theme-toggle');
  const iconMoon = document.getElementById('icon-moon');
  const iconSun  = document.getElementById('icon-sun');
  const html     = document.documentElement;
  if (!toggle) return;

  // Persist theme in localStorage
  const saved = localStorage.getItem('portfolio-theme');
  if (saved) {
    html.setAttribute('data-theme', saved);
    updateIcons(saved);
  }

  function updateIcons(theme) {
    if (theme === 'light') {
      iconMoon.style.display = 'none';
      iconSun.style.display  = 'block';
    } else {
      iconMoon.style.display = 'block';
      iconSun.style.display  = 'none';
    }
  }

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateIcons(next);
  });
}

/* ================================================================
   07. TYPEWRITER ANIMATION
================================================================ */
function initTypewriter() {
  const el      = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Data Analyst',
    'AI & DS Graduate',
    'Python Developer',
    'Problem Solver',
    'Data Storyteller'
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let typingSpeed = 100;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      // Typing forward
      el.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        // Pause at end of phrase before deleting
        isDeleting  = true;
        typingSpeed = 1800; // hold duration
      } else {
        typingSpeed = 90 + Math.random() * 40; // slight randomness
      }
    } else {
      // Deleting
      el.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting  = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400; // pause before next phrase
      } else {
        typingSpeed = 50;
      }
    }

    setTimeout(type, typingSpeed);
  }

  // Start with a small delay for page load
  setTimeout(type, 1200);
}

/* ================================================================
   08. PARTICLE CANVAS
================================================================ */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let W, H;

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    canvas.style.display = 'none';
    return;
  }

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    const count = Math.floor((W * H) / 14000); // density

    for (let i = 0; i < count; i++) {
      particles.push({
        x:     Math.random() * W,
        y:     Math.random() * H,
        vx:    (Math.random() - 0.5) * 0.4,
        vy:    (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const particleColor = isDark ? '126, 87, 255' : '100, 70, 200';
    const lineColor     = isDark ? '126, 87, 255' : '100, 70, 200';

    particles.forEach((p, i) => {
      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0)  p.x = W;
      if (p.x > W)  p.x = 0;
      if (p.y < 0)  p.y = H;
      if (p.y > H)  p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${particleColor}, ${p.alpha})`;
      ctx.fill();

      // Draw connecting lines to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q    = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        const maxDist = 110;

        if (dist < maxDist) {
          const lineAlpha = (1 - dist / maxDist) * 0.25;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${lineColor}, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    });

    animationId = requestAnimationFrame(drawParticles);
  }

  // Init
  resize();
  drawParticles();

  // Resize debounce
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });
}

/* ================================================================
   09. SCROLL REVEAL ANIMATIONS
================================================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ================================================================
   10. ANIMATED STATISTICS COUNTER
================================================================ */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-card__number[data-target]');
  if (!statNumbers.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el          = entry.target;
        const target      = parseInt(el.dataset.target, 10);
        const isDecimal   = el.dataset.decimal === 'true';
        const duration    = prefersReducedMotion ? 0 : 1600;
        const start       = performance.now();

        function count(now) {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const eased    = 1 - Math.pow(1 - progress, 3);
          const value    = Math.round(eased * target);

          el.textContent = isDecimal
            ? (value / 10).toFixed(1)
            : value + (target === 2 ? '+' : '');

          if (progress < 1) requestAnimationFrame(count);
        }

        if (duration === 0) {
          el.textContent = isDecimal
            ? (target / 10).toFixed(1)
            : target + (target === 2 ? '+' : '');
        } else {
          requestAnimationFrame(count);
        }

        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => observer.observe(el));
}

/* ================================================================
   11. SKILL BAR ANIMATIONS
================================================================ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar__fill');
  if (!bars.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const fillEl  = entry.target;
        const bar     = fillEl.closest('.skill-bar');
        const pctEl   = bar ? bar.querySelector('.skill-bar__pct') : null;
        const width   = parseInt(fillEl.dataset.width, 10);

        if (prefersReducedMotion) {
          fillEl.style.width = width + '%';
          if (pctEl) pctEl.textContent = width + '%';
          observer.unobserve(fillEl);
          return;
        }

        // Animate the bar
        fillEl.style.transition = 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
        fillEl.style.width      = width + '%';

        // Animate the percentage label
        if (pctEl) {
          let current = 0;
          const step  = () => {
            current = Math.min(current + 1, width);
            pctEl.textContent = current + '%';
            if (current < width) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }

        observer.unobserve(fillEl);
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach((bar) => observer.observe(bar));
}

/* ================================================================
   12. PROJECT FILTERING
================================================================ */
function initProjectFilters() {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active state
      filterBtns.forEach((b) => {
        b.classList.remove('filter-btn--active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('filter-btn--active');
      btn.setAttribute('aria-selected', 'true');

      // Show/hide cards
      projectCards.forEach((card) => {
        const categories = card.dataset.category ? card.dataset.category.split(' ') : [];

        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
          // Replay reveal animation
          card.classList.remove('revealed');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => card.classList.add('revealed'));
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Mark all revealed on init
  projectCards.forEach((card) => card.classList.add('revealed'));
}

/* ================================================================
   13. CONTACT FORM VALIDATION
================================================================ */
function initContactForm() {
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('form-submit-btn');
  const btnText    = document.getElementById('btn-text');
  const btnIcon    = document.getElementById('btn-icon');
  const successEl  = document.getElementById('form-success');
  if (!form) return;

  const fields = {
    name:    { el: document.getElementById('form-name'),    errEl: document.getElementById('error-name'),    validate: (v) => v.trim().length >= 2 ? '' : 'Please enter your full name.' },
    email:   { el: document.getElementById('form-email'),   errEl: document.getElementById('error-email'),   validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address.' },
    subject: { el: document.getElementById('form-subject'), errEl: document.getElementById('error-subject'), validate: (v) => v.trim().length >= 3 ? '' : 'Please enter a subject.' },
    message: { el: document.getElementById('form-message'), errEl: document.getElementById('error-message'), validate: (v) => v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.' }
  };

  function validateField(key) {
    const { el, errEl, validate } = fields[key];
    const error = validate(el.value);
    errEl.textContent = error;
    el.classList.toggle('error', !!error);
    return !error;
  }

  // Real-time validation on blur
  Object.keys(fields).forEach((key) => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.classList.contains('error')) validateField(key);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    const valid = Object.keys(fields).every((key) => validateField(key));
    if (!valid) return;

    // Loading state
    submitBtn.disabled   = true;
    btnText.textContent  = 'Sending…';
    btnIcon.style.display = 'none';

    // Simulate network request (replace with real API call)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Success state
    form.reset();
    Object.keys(fields).forEach((key) => {
      fields[key].el.classList.remove('error');
      fields[key].errEl.textContent = '';
    });

    submitBtn.disabled    = false;
    btnText.textContent   = 'Send Message';
    btnIcon.style.display = '';

    successEl.hidden = false;
    setTimeout(() => { successEl.hidden = true; }, 4000);
  });
}

/* ================================================================
   14. BACK TO TOP BUTTON
================================================================ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ================================================================
   15. FOOTER YEAR
================================================================ */
function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ================================================================
   16. INIT — DOM READY
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCustomCursor();
  initScrollProgress();
  initNavbar();
  initMobileMenu();
  initThemeToggle();
  initTypewriter();
  initParticleCanvas();
  initScrollReveal();
  initStatCounters();
  initSkillBars();
  initProjectFilters();
  initContactForm();
  initBackToTop();
  initFooterYear();

  // Log for debugging
  console.log('%c Bebin V Portfolio v1.0 ', 'background: linear-gradient(135deg,#7e57ff,#00d4ff); color: #fff; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
});
