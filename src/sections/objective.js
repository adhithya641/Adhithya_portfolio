/**
 * ============================================================
 *  OBJECTIVE SECTION RENDERER
 * ============================================================
 */

export function renderObjective(container, objectiveText) {
  if (!container) return;

  container.innerHTML = `
    <div class="section-header reveal-on-scroll">
      <span class="section-label">02</span>
      <h2 class="section-title">Objective</h2>
      <div class="section-line"></div>
    </div>

    <div class="objective-wrapper reveal-on-scroll">
      <div class="objective-quote-mark">"</div>
      <p class="objective-text">${objectiveText || ''}</p>
      <div class="objective-attribution">— Adhithya Ravichandran</div>
    </div>
  `;
}
