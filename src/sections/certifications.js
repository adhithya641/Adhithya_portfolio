/**
 * ============================================================
 *  CERTIFICATIONS SECTION RENDERER
 *  - Renders certification cards
 *  - Opens detail modal on click
 * ============================================================
 */

const CERT_GRADIENTS = [
  'linear-gradient(135deg, #1a1a2e, #16213e)',
  'linear-gradient(135deg, #0f2027, #203a43)',
  'linear-gradient(135deg, #141e30, #243b55)',
];

export function renderCertifications(container, certifications) {
  if (!container || !certifications) return;

  const cardsHTML = certifications.map((cert, index) => {
    const bgStyle = cert.image
      ? `background-image: url('${cert.image}'); background-size: cover; background-position: center;`
      : `background: ${CERT_GRADIENTS[index % CERT_GRADIENTS.length]};`;

    return `
      <div class="cert-card reveal-on-scroll"
           data-cert-id="${cert.id}"
           role="button"
           tabindex="0"
           aria-label="View ${cert.name} details">
        <div class="cert-card-bg" style="${bgStyle}">
          ${!cert.image ? `<div class="cert-card-icon">◈</div>` : ''}
        </div>
        <div class="cert-card-body">
          <div class="cert-card-date">${cert.date}</div>
          <h3 class="cert-card-name">${cert.name}</h3>
          <div class="cert-card-org">${cert.organization}</div>
          <p class="cert-card-desc">${cert.shortDescription}</p>
          <div class="cert-card-cta">View Details →</div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="section-header reveal-on-scroll">
      <span class="section-label">05</span>
      <h2 class="section-title">Certifications</h2>
      <div class="section-line"></div>
    </div>

    <div class="certifications-grid">
      ${cardsHTML}
    </div>
  `;

  // Bind events
  container.querySelectorAll('.cert-card').forEach((card) => {
    const handler = () => {
      const id = card.dataset.certId;
      openCertModal(id, certifications);
    };
    card.addEventListener('click', handler);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });
}

/* ── Certification Modal ──────────────────────────────────── */

export function openCertModal(id, certifications) {
  const cert    = certifications.find((c) => c.id === id);
  if (!cert) return;

  const modal   = document.getElementById('cert-modal');
  const content = document.getElementById('modal-content');

  const skillsHTML = (cert.skillsCovered || []).map((s) => `
    <span class="cert-skill-chip">${s}</span>
  `).join('');

  const bgStyle = cert.image
    ? `background-image: url('${cert.image}'); background-size: cover; background-position: center;`
    : `background: linear-gradient(135deg, #0d1117, #161b22);`;

  content.innerHTML = `
    <button class="modal-close-btn" id="modal-close-btn" aria-label="Close">✕</button>

    <div class="cert-modal-hero" style="${bgStyle}">
      ${!cert.image ? `<div class="cert-modal-icon">◈</div>` : ''}
    </div>

    <div class="cert-modal-body">
      <div class="cert-modal-org">${cert.organization} · ${cert.date}</div>
      <h2 class="cert-modal-name">${cert.name}</h2>
      <p class="cert-modal-desc">${cert.description || cert.shortDescription}</p>

      ${skillsHTML ? `
        <div class="cert-modal-section">
          <h4 class="cert-modal-section-label">Skills Covered</h4>
          <div class="cert-skills-grid">
            ${skillsHTML}
          </div>
        </div>
      ` : ''}

      ${cert.credentialId ? `
        <div class="cert-modal-section">
          <h4 class="cert-modal-section-label">Credential ID</h4>
          <p class="cert-credential-id">${cert.credentialId}</p>
        </div>
      ` : ''}

      ${cert.credentialLink ? `
        <a href="${cert.credentialLink}" target="_blank" rel="noopener" class="cert-verify-btn">
          Verify Credential ↗
        </a>
      ` : ''}
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Wire close
  document.getElementById('modal-close-btn').addEventListener('click', closeCertModal);
  document.getElementById('modal-backdrop').addEventListener('click', closeCertModal);
}

export function closeCertModal() {
  const modal = document.getElementById('cert-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => modal.classList.add('hidden'), 400);
}
