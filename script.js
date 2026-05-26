/* ══════════════════════════════════════════════
   POST-DIGITAL LAB — script.js
   Navbar · Mobile menu · Scroll FX · AOS · Form
   ══════════════════════════════════════════════ */

'use strict';

/* ─── DOM REFS ──────────────────────────────── */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('navLinks');
const scrollTopBtn= document.getElementById('scrollTop');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

/* ═════════════════════════════════════════════
   1. NAVBAR — scroll effect
   ═════════════════════════════════════════════ */
function handleNavbarScroll() {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

/* ═════════════════════════════════════════════
   2. MOBILE MENU — hamburger toggle
   ═════════════════════════════════════════════ */
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ═════════════════════════════════════════════
   3. SMOOTH SCROLL — for all anchor links
   ═════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

/* ═════════════════════════════════════════════
   4. SCROLL-TO-TOP BUTTON
   ═════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ═════════════════════════════════════════════
   5. AOS — Animate On Scroll (custom, no library)
   ═════════════════════════════════════════════ */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  // Stagger children inside grids
  const staggerParents = [
    '.services-grid',
    '.advantages-grid',
    '.testimonials-grid',
    '.gallery-grid',
    '.about-values',
  ];

  staggerParents.forEach(selector => {
    const parent = document.querySelector(selector);
    if (!parent) return;
    parent.querySelectorAll('[data-aos]').forEach((el, i) => {
      el.style.transitionDelay = `${i * 80}ms`;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}
initAOS();

/* ═════════════════════════════════════════════
   6. ACTIVE NAV LINK on scroll (highlight)
   ═════════════════════════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], .hero[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActive() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= navbar.offsetHeight + 40) {
        current = sec.getAttribute('id');
      }
    });
    links.forEach(link => {
      link.classList.remove('active-link');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active-link');
      }
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();

  // Add style for active link dynamically
  const style = document.createElement('style');
  style.textContent = `.nav-links a.active-link:not(.nav-cta) { color: var(--cyan); }`;
  document.head.appendChild(style);
})();

/* ═════════════════════════════════════════════
   7. CONTACT FORM — client-side simulation
   ═════════════════════════════════════════════ */
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre   = contactForm.nombre.value.trim();
  const telefono = contactForm.telefono.value.trim();
  const servicio = contactForm.servicio.value;
  const mensaje  = contactForm.mensaje.value.trim();

  // Basic validation
  let valid = true;
  const fields = [
    { el: contactForm.nombre,   val: nombre },
    { el: contactForm.telefono, val: telefono },
    { el: contactForm.servicio, val: servicio },
    { el: contactForm.mensaje,  val: mensaje },
  ];
  fields.forEach(({ el, val }) => {
    if (!val) {
      el.style.borderColor = 'var(--red)';
      el.style.boxShadow   = '0 0 0 3px rgba(255,68,85,0.15)';
      valid = false;
      el.addEventListener('input', () => {
        el.style.borderColor = '';
        el.style.boxShadow   = '';
      }, { once: true });
    }
  });

  if (!valid) return;

  // Simulate async submit
  const btn = contactForm.querySelector('button[type="submit"]');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.disabled = false;
    formSuccess.style.display = 'flex';
    contactForm.reset();
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-hide after 6s
    setTimeout(() => {
      formSuccess.style.display = 'none';
    }, 6000);
  }, 1800);
});

/* ═════════════════════════════════════════════
   8. HERO typing cursor effect (cosmetic)
   ═════════════════════════════════════════════ */
(function initCursor() {
  const statusEl = document.querySelector('.status-ok');
  if (!statusEl) return;

  const messages = [
    '<i class="fas fa-check-circle"></i> Sistema reparado',
    '<i class="fas fa-wifi"></i> Conectado',
    '<i class="fas fa-battery-full"></i> Batería al 100%',
    '<i class="fas fa-shield-alt"></i> Sin virus detectados',
    '<i class="fas fa-sync"></i> Actualizado',
  ];
  let idx = 0;

  setInterval(() => {
    idx = (idx + 1) % messages.length;
    statusEl.style.opacity = '0';
    setTimeout(() => {
      statusEl.innerHTML = messages[idx];
      statusEl.style.opacity = '1';
    }, 300);
  }, 2800);

  statusEl.style.transition = 'opacity 0.3s';
})();

/* ═════════════════════════════════════════════
   9. GALLERY — subtle tilt on hover
   ═════════════════════════════════════════════ */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    item.style.transform = `perspective(600px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) scale(1.02)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
    item.style.transition = 'transform 0.5s ease';
    setTimeout(() => { item.style.transition = ''; }, 500);
  });
});

/* ═════════════════════════════════════════════
   10. SERVICE CARDS — stagger load animation
   ═════════════════════════════════════════════ */
(function staggerServiceCards() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 60}ms`;
  });
})();

/* ─── console easter egg ──────────────────── */
console.log(
  '%c[Post-Digital Lab]%c\nReparación inteligente · La Paz, BCS\nhttps://postdigitallab.mx',
  'color:#00d4ff;font-family:monospace;font-size:14px;font-weight:bold',
  'color:#8898aa;font-family:monospace;font-size:12px'
);
