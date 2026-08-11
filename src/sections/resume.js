/**
 * ============================================================
 *  RESUME SECTION RENDERER
 *  - Centered PDF preview
 *  - View full resume + download buttons
 *  To replace the resume: update portfolio.resume.file in portfolio.js
 * ============================================================
 */

export function renderResume(container, resumeData) {
  if (!container || !resumeData) return;

  const { file, label } = resumeData;

  container.innerHTML = `
    <div class="section-header reveal-on-scroll">
      <span class="section-label">06</span>
      <h2 class="section-title">Resume</h2>
      <div class="section-line"></div>
    </div>

    <div class="resume-wrapper reveal-on-scroll">
      <div class="resume-frame-container">
        <iframe
          id="resume-iframe"
          src="${file}"
          type="application/pdf"
          title="Adhithya Ravichandran Resume"
          loading="lazy"
          aria-label="Resume PDF preview">
          <div class="resume-fallback">
            <p>PDF preview not available in your browser.</p>
            <a href="${file}" target="_blank" rel="noopener" class="resume-btn resume-btn--view">
              Open Resume ↗
            </a>
          </div>
        </iframe>
      </div>

      <div class="resume-actions">
        <a href="${file}"
           target="_blank"
           rel="noopener"
           class="resume-btn resume-btn--view"
           id="resume-view-btn">
          <span>View Full Resume</span>
          <span class="btn-icon">↗</span>
        </a>
        <a href="${file}"
           download="${label || 'Adhithya_Resume.pdf'}"
           class="resume-btn resume-btn--download"
           id="resume-download-btn">
          <span>Download Resume</span>
          <span class="btn-icon">↓</span>
        </a>
      </div>
    </div>
  `;
}
