/**
 * ============================================================
 *  NAVIGATION MODULE
 *  - Fixed nav, initially hidden
 *  - Slides down when user exits hero section
 *  - Active section indicator tracks scroll position
 *  - Mobile hamburger menu
 * ============================================================
 */

const NAV_SECTIONS = ['home', 'about', 'objective', 'projects', 'skills', 'certifications', 'resume'];

export function initNav() {
  const nav           = document.getElementById('main-nav');
  const links         = nav.querySelectorAll('.nav-link');
  const menuBtn       = document.getElementById('nav-menu-btn');
  const navLinks      = nav.querySelector('.nav-links');
  const heroSection   = document.getElementById('home');
  const bgOverlay     = document.getElementById('bg-overlay');

  /* ── Hero exit observer → reveal nav + activate overlay ─── */
  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          nav.classList.add('visible');
          bgOverlay.classList.add('active');
        } else {
          nav.classList.remove('visible');
          bgOverlay.classList.remove('active');
        }
      });
    },
    { threshold: 0.05 }   // nav appears when hero has 95% scrolled away
  );
  heroObserver.observe(heroSection);

  /* ── Active section tracker ─────────────────────────────── */
  const sectionEls = NAV_SECTIONS.map((id) => document.getElementById(id)).filter(Boolean);

  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    { threshold: 0.4 }
  );

  sectionEls.forEach((el) => activeObserver.observe(el));

  function setActiveLink(sectionId) {
    links.forEach((link) => {
      const isActive = link.dataset.section === sectionId;
      link.classList.toggle('active', isActive);
    });
  }

  /* ── Smooth scroll on nav link click ───────────────────── */
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const sectionId = link.dataset.section;
      const target    = document.getElementById(sectionId);
      if (target) {
        e.preventDefault();
        // Close mobile menu
        navLinks.classList.remove('open');
        menuBtn.classList.remove('open');
        // Navigate
        target.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, '', `#${sectionId}`);
      }
    });
  });

  /* ── Mobile hamburger toggle ────────────────────────────── */
  menuBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuBtn.classList.toggle('open', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      navLinks.classList.remove('open');
      menuBtn.classList.remove('open');
    }
  });
}
