/**
 * ============================================================
 *  ABOUT SECTION RENDERER
 *  Renders all content from portfolio.about
 * ============================================================
 */

export function renderAbout(container, data) {
  if (!container || !data) return;

  const educationHTML = (data.education || []).map((edu) => `
    <div class="edu-item reveal-on-scroll">
      <div class="edu-degree">${edu.degree}</div>
      <div class="edu-institution">${edu.institution}</div>
      <div class="edu-meta">
        <span class="edu-year">${edu.year}</span>
        <span class="edu-grade">${edu.grade}</span>
      </div>
    </div>
  `).join('');

  const interestHTML = (data.interests || []).map((interest) => `
    <span class="interest-chip">${interest}</span>
  `).join('');

  container.innerHTML = `
    <div class="section-header reveal-on-scroll">
      <span class="section-label">01</span>
      <h2 class="section-title">About</h2>
      <div class="section-line"></div>
    </div>

    <div class="about-intro glass-card reveal-on-scroll">
      <p class="about-intro-text">${data.intro || ''}</p>
    </div>

    <div class="about-grid">
      <div class="about-col">
        <div class="glass-card reveal-on-scroll">
          <h3 class="card-heading">
            <span class="card-heading-icon">🎓</span>
            Education
          </h3>
          <div class="edu-list">
            ${educationHTML}
          </div>
        </div>

        <div class="glass-card reveal-on-scroll">
          <h3 class="card-heading">
            <span class="card-heading-icon">✦</span>
            Interests
          </h3>
          <div class="interests-grid">
            ${interestHTML}
          </div>
        </div>
      </div>

      <div class="about-col">
        <div class="glass-card about-bg-card reveal-on-scroll">
          <h3 class="card-heading">
            <span class="card-heading-icon">◈</span>
            Background
          </h3>
          <p class="about-bg-text">${data.background || ''}</p>
        </div>
      </div>
    </div>
  `;
}
