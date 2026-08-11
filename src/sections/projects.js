/**
 * ============================================================
 *  PROJECTS SECTION RENDERER
 *  - Renders project cards grid
 *  - Handles project detail view (full-screen overlay)
 * ============================================================
 */

// ── Gradient placeholders for projects without images ────────
const GRADIENT_PLACEHOLDERS = [
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)',
  'linear-gradient(135deg, #1c1c1c 0%, #2d2d2d 50%, #1a1a1a 100%)',
];

export function renderProjects(container, projects) {
  if (!container || !projects) return;

  const cardsHTML = projects.map((project, index) => {
    const bgStyle = project.image
      ? `background-image: url('${project.image}')`
      : `background: ${GRADIENT_PLACEHOLDERS[index % GRADIENT_PLACEHOLDERS.length]}`;

    const tagsHTML = (project.technologies || []).slice(0, 4).map((t) => `
      <span class="tag-chip">${t}</span>
    `).join('');

    const moreTags = project.technologies.length > 4
      ? `<span class="tag-chip tag-chip--more">+${project.technologies.length - 4}</span>`
      : '';

    return `
      <div class="project-card reveal-on-scroll" 
           data-project-id="${project.id}"
           role="button"
           tabindex="0"
           aria-label="View ${project.title} details">
        <div class="project-card-bg" style="${bgStyle}">
          ${!project.image ? `<div class="project-card-pattern"></div>` : ''}
        </div>
        <div class="project-card-overlay">
          <div class="project-card-body">
            <h3 class="project-card-title">${project.title}</h3>
            <p class="project-card-desc">${project.shortDescription}</p>
            <div class="project-card-tags">
              ${tagsHTML}${moreTags}
            </div>
          </div>
          <div class="project-card-cta">
            <span class="project-cta-text">View Details</span>
            <span class="project-cta-arrow">→</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="section-header reveal-on-scroll">
      <span class="section-label">03</span>
      <h2 class="section-title">Projects</h2>
      <div class="section-line"></div>
    </div>

    <div class="projects-grid">
      ${cardsHTML}
    </div>
  `;

  // Bind click/keyboard events
  container.querySelectorAll('.project-card').forEach((card) => {
    const handler = () => {
      const id = card.dataset.projectId;
      window.location.hash = `#/projects/${id}`;
    };
    card.addEventListener('click', handler);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });
}

/* ── Project Detail View ──────────────────────────────────── */

export function showProjectDetail(id, projects) {
  const project = projects.find((p) => p.id === id);
  if (!project) return;

  const detailView    = document.getElementById('detail-view');
  const detailContent = document.getElementById('detail-content');
  const bgOverlay     = document.getElementById('bg-overlay');

  const featuresHTML = (project.features || []).map((f) => `
    <li class="detail-feature-item">
      <span class="detail-feature-bullet">◆</span>
      ${f}
    </li>
  `).join('');

  const techTagsHTML = (project.technologies || []).map((t) => `
    <span class="detail-tech-tag">${t}</span>
  `).join('');

  const linksHTML = [
    project.github ? `<a href="${project.github}" target="_blank" rel="noopener" class="detail-link detail-link--github">
      <span>View on GitHub</span> <span class="detail-link-icon">↗</span>
    </a>` : '',
    project.demo ? `<a href="${project.demo}" target="_blank" rel="noopener" class="detail-link detail-link--demo">
      <span>Live Demo</span> <span class="detail-link-icon">↗</span>
    </a>` : '',
  ].join('');

  const sectionBlock = (label, content) => content ? `
    <div class="detail-block reveal-on-scroll">
      <h3 class="detail-block-label">${label}</h3>
      <p class="detail-block-text">${content}</p>
    </div>
  ` : '';

  const bgStyle = project.image
    ? `background-image: url('${project.image}')`
    : `background: linear-gradient(135deg, #0d1117 0%, #161b22 60%, #21262d 100%)`;

  detailContent.innerHTML = `
    <div class="detail-hero" style="${bgStyle}">
      <div class="detail-hero-overlay">
        <div class="detail-hero-inner">
          <h1 class="detail-title">${project.title}</h1>
          <div class="detail-hero-tags">${techTagsHTML}</div>
        </div>
      </div>
    </div>

    <div class="detail-body">
      ${sectionBlock('Overview', project.overview)}
      ${sectionBlock('Problem Statement', project.problem)}
      ${sectionBlock('Solution', project.solution)}

      ${(project.features && project.features.length) ? `
        <div class="detail-block reveal-on-scroll">
          <h3 class="detail-block-label">Key Features</h3>
          <ul class="detail-features-list">
            ${featuresHTML}
          </ul>
        </div>
      ` : ''}

      ${sectionBlock('My Contribution', project.contribution)}
      ${sectionBlock('Results & Impact', project.results)}
      ${sectionBlock('Future Improvements', project.futureScope)}

      ${linksHTML ? `
        <div class="detail-links reveal-on-scroll">
          ${linksHTML}
        </div>
      ` : ''}
    </div>
  `;

  // Activate detail view
  detailView.classList.remove('hidden');
  detailView.classList.add('active');
  bgOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  detailView.scrollTop = 0;

  // Wire back button
  document.getElementById('detail-back-btn').addEventListener('click', hideDetailView);

  // Trigger reveal animations in detail view
  setTimeout(() => {
    detailView.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      el.classList.add('revealed');
    });
  }, 100);
}

export function hideDetailView() {
  const detailView = document.getElementById('detail-view');
  const bgOverlay  = document.getElementById('bg-overlay');

  detailView.classList.remove('active');
  document.body.style.overflow = '';

  setTimeout(() => {
    detailView.classList.add('hidden');
    // Restore overlay only if not in hero
    const heroSection = document.getElementById('home');
    const heroRect    = heroSection.getBoundingClientRect();
    if (heroRect.bottom <= 0) {
      bgOverlay.classList.add('active');
    } else {
      bgOverlay.classList.remove('active');
    }
    // Navigate back to projects section
    window.location.hash = 'projects';
  }, 500);
}
