/* =========================================================
   PORTFOLIO — script.js
   All interactivity: nav, typing, scroll reveals,
   skill tags, project cards, contact form validation
   ========================================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR: scroll style + active link ─────────────── */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();


  /* ── 2. MOBILE HAMBURGER MENU ──────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });


  /* ── 3. SMOOTH SCROLLING ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ── 4. TYPING ANIMATION ───────────────────────────────── */
  const typedEl = document.getElementById('typed-text');
  const phrases = [
    'Integrated M.Tech CSE Student',
    'Aspiring DevOps & Cloud Engineer',
    'Technology Enthusiast',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let isDeleting = false;
  let typeTimer;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (!isDeleting) {
      typedEl.textContent = currentPhrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === currentPhrase.length) {
        isDeleting = true;
        typeTimer = setTimeout(type, 1800);
        return;
      }
    } else {
      typedEl.textContent = currentPhrase.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx  = (phraseIdx + 1) % phrases.length;
        typeTimer = setTimeout(type, 400);
        return;
      }
    }

    const speed = isDeleting ? 60 : 90;
    typeTimer = setTimeout(type, speed);
  }

  setTimeout(type, 1000);


  /* ── 5. INTERSECTION OBSERVER: reveal ──────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = (Array.from(revealEls).indexOf(entry.target) % 3) * 100;
        setTimeout(() => entry.target.classList.add('in-view'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ── 6. SKILL TAG HOVER ANIMATION ─────────────────────── */
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      tag.style.transform = 'scale(1.08) translateY(-2px)';
    });
    tag.addEventListener('mouseleave', () => {
      tag.style.transform = '';
    });
  });


  /* ── 7. CONTACT FORM VALIDATION ────────────────────────── */
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('submit-btn');
  const btnText    = document.getElementById('btn-text');
  const successMsg = document.getElementById('form-success');

  if (form) {
    const fields = [
      { id: 'name',    errorId: 'name-error',    validate: v => v.trim().length >= 2   || 'Please enter your full name (min. 2 characters).' },
      { id: 'email',   errorId: 'email-error',   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.' },
      { id: 'subject', errorId: 'subject-error', validate: v => v.trim().length >= 3   || 'Please enter a subject (min. 3 characters).' },
      { id: 'message', errorId: 'message-error', validate: v => v.trim().length >= 10  || 'Please write at least 10 characters.' },
    ];

    function validateField(fieldConfig) {
      const el      = document.getElementById(fieldConfig.id);
      const errorEl = document.getElementById(fieldConfig.errorId);
      const result  = fieldConfig.validate(el.value);

      if (result === true) {
        el.classList.remove('error');
        errorEl.textContent = '';
        return true;
      } else {
        el.classList.add('error');
        errorEl.textContent = result;
        return false;
      }
    }

    fields.forEach(f => {
      const el = document.getElementById(f.id);
      el.addEventListener('blur', () => validateField(f));
      el.addEventListener('input', () => {
        if (el.classList.contains('error')) validateField(f);
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const allValid = fields.map(f => validateField(f)).every(Boolean);
      if (!allValid) return;

      setLoading(true);
      await sleep(1500);
      setLoading(false);

      form.reset();
      fields.forEach(f => {
        document.getElementById(f.id).classList.remove('error');
        document.getElementById(f.errorId).textContent = '';
      });
      successMsg.classList.add('show');
      setTimeout(() => successMsg.classList.remove('show'), 5000);
    });

    function setLoading(isLoading) {
      submitBtn.disabled = isLoading;
      if (isLoading) {
        btnText.innerHTML = `<span class="spinner"></span> Sending…`;
      } else {
        btnText.innerHTML = `Send Message
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>`;
      }
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }


  /* ── 8. BACK TO TOP BUTTON ─────────────────────────────── */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.style.opacity = window.scrollY > 500 ? '1' : '0.4';
    }, { passive: true });
  }


  /* ── 9. PARALLAX: Hero blobs subtle mouse follow ───────── */
  const blob1 = document.querySelector('.blob-1');
  const blob2 = document.querySelector('.blob-2');

  if (blob1 && blob2) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      blob1.style.transform = `translate(${x}px, ${y}px)`;
      blob2.style.transform = `translate(${-x * 0.6}px, ${-y * 0.6}px)`;
    }, { passive: true });
  }


  /* ── 10. CARD TILT EFFECT (project cards) ──────────────── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      const cx    = rect.width  / 2;
      const cy    = rect.height / 2;
      const rotX  = ((y - cy) / cy) * -6;
      const rotY  = ((x - cx) / cx) *  6;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ── 11. EDUCATION CARD REVEAL ─────────────────────────── */
  const educationCards = document.querySelectorAll('.education-card');
  const eduObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        eduObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  educationCards.forEach(card => eduObserver.observe(card));


  /* ── 12. SECTION HEADER REVEAL ─────────────────────────── */
  document.querySelectorAll('.section-header').forEach(header => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          header.style.opacity   = '1';
          header.style.transform = 'translateY(0)';
          obs.unobserve(header);
        }
      });
    }, { threshold: 0.3 });

    header.style.opacity   = '0';
    header.style.transform = 'translateY(24px)';
    header.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    obs.observe(header);
  });


  /* ── 13. YEAR IN FOOTER ─────────────────────────────────── */
  const yearSpan = document.querySelector('.footer-bottom p');
  if (yearSpan) {
    yearSpan.innerHTML = yearSpan.innerHTML.replace('2024', new Date().getFullYear());
  }

}); // end DOMContentLoaded
