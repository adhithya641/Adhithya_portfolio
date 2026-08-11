/**
 * ============================================================
 *  SKILLS SECTION RENDERER
 *  - Groups by category
 *  - Elegant chips — no progress bars
 * ============================================================
 */

export function renderSkills(container, skills) {
  if (!container || !skills) return;

  const categoriesHTML = Object.entries(skills).map(([category, items]) => {
    const chipsHTML = items.map((skill) => `
      <span class="skill-chip">${skill}</span>
    `).join('');

    return `
      <div class="skill-category reveal-on-scroll">
        <h3 class="skill-category-title">${category}</h3>
        <div class="skill-chips">
          ${chipsHTML}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="section-header reveal-on-scroll">
      <span class="section-label">04</span>
      <h2 class="section-title">Skills</h2>
      <div class="section-line"></div>
    </div>

    <div class="skills-grid">
      ${categoriesHTML}
    </div>
  `;
}
