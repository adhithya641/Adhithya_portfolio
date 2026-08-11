/**
 * ============================================================
 *  APP ORCHESTRATOR
 *  Bootstraps the entire portfolio.
 * ============================================================
 */

import { FramePlayer }          from './framePlayer.js';
import { initNav }              from './nav.js';
import { initRouter }           from './router.js';
import { renderAbout }          from './sections/about.js';
import { renderObjective }      from './sections/objective.js';
import { renderProjects, showProjectDetail, hideDetailView } from './sections/projects.js';
import { renderSkills }         from './sections/skills.js';
import { renderCertifications } from './sections/certifications.js';
import { renderResume }         from './sections/resume.js';
import { portfolio }            from './data/portfolio.js';

/* ── 1. Start cinematic frame player ─────────────────────── */
const player = new FramePlayer('bg-canvas');

/* ── 2. Render all sections from data ────────────────────── */
renderAbout(
  document.getElementById('about-container'),
  portfolio.about
);

renderObjective(
  document.getElementById('objective-container'),
  portfolio.objective
);

renderProjects(
  document.getElementById('projects-container'),
  portfolio.projects
);

renderSkills(
  document.getElementById('skills-container'),
  portfolio.skills
);

renderCertifications(
  document.getElementById('certifications-container'),
  portfolio.certifications
);

renderResume(
  document.getElementById('resume-container'),
  portfolio.resume
);

/* ── 3. Navigation ───────────────────────────────────────── */
initNav();

/* ── 4. Router ───────────────────────────────────────────── */
initRouter(
  (id) => showProjectDetail(id, portfolio.projects),
  hideDetailView
);

/* ── 5. Hero scroll effects ──────────────────────────────── */
const heroSubtitleWrapper = document.getElementById('hero-subtitle-wrapper');
const scrollIndicator     = document.getElementById('scroll-indicator');
let subtitleRevealed      = false;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Reveal subtitle on first scroll (stays revealed permanently)
  if (scrollY > 80 && !subtitleRevealed) {
    subtitleRevealed = true;
    heroSubtitleWrapper.classList.add('visible');
  }

  // Fade scroll indicator
  scrollIndicator.style.opacity = scrollY > 50 ? '0' : '1';
}, { passive: true });

/* ── 6. Scroll reveal animations ─────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

// Observe all reveal-on-scroll elements after render
document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
  revealObserver.observe(el);
});

/* ── 7. Handle initial URL hash ──────────────────────────── */
if (window.location.hash) {
  const hash = window.location.hash;
  if (hash.startsWith('#/projects/')) {
    const id = hash.slice('#/projects/'.length);
    setTimeout(() => showProjectDetail(id, portfolio.projects), 300);
  } else {
    const sectionId = hash.slice(1);
    const el = document.getElementById(sectionId);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 300);
  }
}

/* ── 8. Keyboard accessibility for detail view escape ────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const detailView = document.getElementById('detail-view');
    const certModal  = document.getElementById('cert-modal');

    if (!detailView.classList.contains('hidden') && detailView.classList.contains('active')) {
      hideDetailView();
    }
    if (!certModal.classList.contains('hidden') && certModal.classList.contains('active')) {
      import('./sections/certifications.js').then(m => m.closeCertModal());
    }
  }
});
