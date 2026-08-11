/* ============================================================
   CINEMATIC PORTFOLIO — Complete Application
   Works without a build step or HTTP server.
   ============================================================ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     1. CINEMATIC FRAME PLAYER
  ══════════════════════════════════════════════════════════ */

  var TOTAL_FRAMES = 240;
  var FRAME_DIR = 'ezgif-3c5773385383a0b5-jpg/ezgif-frame-';
  var FRAME_EXT = '.jpg';
  var TARGET_FPS = 30;
  var MOBILE_FPS = 15;
  var BATCH_SIZE = 40;
  var PLAY_THRESHOLD = 30;

  var canvas = document.getElementById('bg-canvas');
  var ctx = canvas.getContext('2d', { alpha: false });
  var frames = new Array(TOTAL_FRAMES).fill(null);
  var loadedCount = 0;
  var currentFrame = 0;
  var lastTimestamp = 0;
  var playing = false;
  var rafId = null;
  var imgW = 0;
  var imgH = 0;
  var canvasW = 0;
  var canvasH = 0;
  var drawX = 0, drawY = 0, drawW = 0, drawH = 0;

  var isMobile = window.innerWidth < 768;
  var fps = isMobile ? MOBILE_FPS : TARGET_FPS;
  var frameInterval = 1000 / fps;
  var frameStep = isMobile ? 2 : 1;

  function pad(i) {
    var s = String(i);
    while (s.length < 3) s = '0' + s;
    return s;
  }

  function updateDrawRect() {
    if (!imgW || !imgH) return;
    var scale = Math.max(canvasW / imgW, canvasH / imgH);
    drawW = imgW * scale;
    drawH = imgH * scale;
    drawX = (canvasW - drawW) / 2;
    drawY = (canvasH - drawH) / 2;
  }

  function resizeCanvas() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasW = w;
    canvasH = h;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    updateDrawRect();
    var f = getNearestLoaded(currentFrame);
    if (f) ctx.drawImage(f, drawX, drawY, drawW, drawH);
  }

  function getNearestLoaded(index) {
    if (frames[index]) return frames[index];
    for (var i = index - 1; i >= 0; i--) {
      if (frames[i]) return frames[i];
    }
    for (var j = index + 1; j < TOTAL_FRAMES; j++) {
      if (frames[j]) return frames[j];
    }
    return null;
  }

  function drawFrame(img) {
    if (!img) return;
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }

  function animate(timestamp) {
    if (!playing) return;
    rafId = requestAnimationFrame(animate);
    var elapsed = timestamp - lastTimestamp;
    if (elapsed < frameInterval) return;
    currentFrame = (currentFrame + frameStep) % TOTAL_FRAMES;
    var frame = getNearestLoaded(currentFrame);
    if (frame) drawFrame(frame);
    lastTimestamp = timestamp - (elapsed % frameInterval);
  }

  function loadBatch(startIndex) {
    var end = Math.min(startIndex + BATCH_SIZE, TOTAL_FRAMES);
    var done = 0;
    var total = end - startIndex;

    for (var i = startIndex; i < end; i++) {
      (function (idx) {
        var img = new Image();
        img.onload = function () {
          frames[idx] = img;
          loadedCount++;
          done++;
          if (!imgW && img.naturalWidth) {
            imgW = img.naturalWidth;
            imgH = img.naturalHeight;
            updateDrawRect();
          }
          if (!playing && loadedCount >= PLAY_THRESHOLD) {
            playing = true;
            rafId = requestAnimationFrame(animate);
          }
          if (done === total && end < TOTAL_FRAMES) {
            loadBatch(end);
          }
        };
        img.onerror = function () {
          done++;
          if (done === total && end < TOTAL_FRAMES) {
            loadBatch(end);
          }
        };
        img.src = FRAME_DIR + pad(idx + 1) + FRAME_EXT;
      })(i);
    }
  }

  // Start the player
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });
  loadBatch(0);

  /* ══════════════════════════════════════════════════════════
     2. SECTION RENDERERS
  ══════════════════════════════════════════════════════════ */

  /* ── About ───────────────────────────────────────────────── */
  function renderAbout(container, data) {
    if (!container || !data) return;

    var educationHTML = (data.education || []).map(function (edu) {
      return '<div class="edu-item reveal-on-scroll">' +
        '<div class="edu-degree">' + edu.degree + '</div>' +
        '<div class="edu-institution">' + edu.institution + '</div>' +
        '<div class="edu-meta">' +
        '<span class="edu-year">' + edu.year + '</span>' +
        '<span class="edu-grade">' + edu.grade + '</span>' +
        '</div></div>';
    }).join('');

    var interestHTML = (data.interests || []).map(function (interest) {
      return '<span class="interest-chip">' + interest + '</span>';
    }).join('');

    container.innerHTML =
      '<div class="section-header reveal-on-scroll">' +
      '<span class="section-label">01</span>' +
      '<h2 class="section-title">About</h2>' +
      '<div class="section-line"></div>' +
      '</div>' +
      '<div class="about-intro glass-card reveal-on-scroll">' +
      '<p class="about-intro-text">' + data.intro + '</p>' +
      '</div>' +
      '<div class="about-grid">' +
      '<div class="about-col">' +
      '<div class="glass-card reveal-on-scroll">' +
      '<h3 class="card-heading"><span class="card-heading-icon">🎓</span> Education</h3>' +
      '<div class="edu-list">' + educationHTML + '</div>' +
      '</div>' +
      '<div class="glass-card reveal-on-scroll">' +
      '<h3 class="card-heading"><span class="card-heading-icon">✦</span> Interests</h3>' +
      '<div class="interests-grid">' + interestHTML + '</div>' +
      '</div>' +
      '</div>' +
      '<div class="about-col">' +
      '<div class="glass-card about-bg-card reveal-on-scroll">' +
      '<h3 class="card-heading"><span class="card-heading-icon">◈</span> Background</h3>' +
      '<p class="about-bg-text">' + data.background + '</p>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  /* ── Objective ───────────────────────────────────────────── */
  function renderObjective(container, text) {
    if (!container) return;
    container.innerHTML =
      '<div class="section-header reveal-on-scroll">' +
      '<span class="section-label">02</span>' +
      '<h2 class="section-title">Objective</h2>' +
      '<div class="section-line"></div>' +
      '</div>' +
      '<div class="objective-wrapper reveal-on-scroll">' +
      '<div class="objective-quote-mark">"</div>' +
      '<p class="objective-text">' + text + '</p>' +
      '<div class="objective-attribution">— Adhithya Ravichandran</div>' +
      '</div>';
  }

  /* ── Projects ────────────────────────────────────────────── */
  var PROJ_GRADIENTS = [
    'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)',
    'linear-gradient(135deg, #1c1c1c 0%, #2d2d2d 50%, #1a1a1a 100%)',
  ];

  function renderProjects(container, projects) {
    if (!container || !projects) return;

    var cardsHTML = projects.map(function (project, index) {
      var bgStyle = project.image
        ? 'background-image: url("' + project.image + '")'
        : 'background: ' + PROJ_GRADIENTS[index % PROJ_GRADIENTS.length];

      var tagsHTML = project.technologies.slice(0, 4).map(function (t) {
        return '<span class="tag-chip">' + t + '</span>';
      }).join('');

      var moreTags = project.technologies.length > 4
        ? '<span class="tag-chip tag-chip--more">+' + (project.technologies.length - 4) + '</span>'
        : '';

      return '<div class="project-card reveal-on-scroll" data-project-id="' + project.id + '" role="button" tabindex="0" aria-label="View ' + project.title + ' details">' +
        '<div class="project-card-bg" style="' + bgStyle + '"><div class="project-card-pattern"></div></div>' +
        '<div class="project-card-overlay">' +
        '<div class="project-card-body">' +
        '<h3 class="project-card-title">' + project.title + '</h3>' +
        '<p class="project-card-desc">' + project.shortDescription + '</p>' +
        '<div class="project-card-tags">' + tagsHTML + moreTags + '</div>' +
        '</div>' +
        '<div class="project-card-cta">' +
        '<span class="project-cta-text">View Details</span>' +
        '<span class="project-cta-arrow">→</span>' +
        '</div>' +
        '</div>' +
        '</div>';
    }).join('');

    container.innerHTML =
      '<div class="section-header reveal-on-scroll">' +
      '<span class="section-label">03</span>' +
      '<h2 class="section-title">Projects</h2>' +
      '<div class="section-line"></div>' +
      '</div>' +
      '<div class="projects-grid">' + cardsHTML + '</div>';

    container.querySelectorAll('.project-card').forEach(function (card) {
      function handler() {
        var id = card.getAttribute('data-project-id');
        showProjectDetail(id);
      }
      card.addEventListener('click', handler);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
      });
    });
  }

  function showProjectDetail(id) {
    var project = (portfolioData.projects || []).find(function (p) { return p.id === id; });
    if (!project) return;

    var detailView = document.getElementById('detail-view');
    var detailContent = document.getElementById('detail-content');
    var bgOverlay = document.getElementById('bg-overlay');

    var featuresHTML = (project.features || []).map(function (f) {
      return '<li class="detail-feature-item"><span class="detail-feature-bullet">◆</span>' + f + '</li>';
    }).join('');

    var techTagsHTML = (project.technologies || []).map(function (t) {
      return '<span class="detail-tech-tag">' + t + '</span>';
    }).join('');

    var linksHTML = '';
    if (project.github) {
      linksHTML += '<a href="' + project.github + '" target="_blank" rel="noopener" class="detail-link detail-link--github"><span>View on GitHub</span><span class="detail-link-icon">↗</span></a>';
    }
    if (project.demo) {
      linksHTML += '<a href="' + project.demo + '" target="_blank" rel="noopener" class="detail-link detail-link--demo"><span>Live Demo</span><span class="detail-link-icon">↗</span></a>';
    }

    function block(label, content) {
      if (!content) return '';
      return '<div class="detail-block reveal-on-scroll">' +
        '<h3 class="detail-block-label">' + label + '</h3>' +
        '<p class="detail-block-text">' + content + '</p>' +
        '</div>';
    }

    var bgStyle = project.image
      ? 'background-image: url("' + project.image + '"); background-size: cover; background-position: center;'
      : 'background: linear-gradient(135deg, #0d1117 0%, #161b22 60%, #21262d 100%);';

    detailContent.innerHTML =
      '<div class="detail-hero" style="' + bgStyle + '">' +
      '<div class="detail-hero-overlay">' +
      '<div class="detail-hero-inner">' +
      '<h1 class="detail-title">' + project.title + '</h1>' +
      '<div class="detail-hero-tags">' + techTagsHTML + '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="detail-body">' +
      block('Overview', project.overview) +
      block('Problem Statement', project.problem) +
      block('Solution', project.solution) +
      (project.features && project.features.length ?
        '<div class="detail-block reveal-on-scroll">' +
        '<h3 class="detail-block-label">Key Features</h3>' +
        '<ul class="detail-features-list">' + featuresHTML + '</ul>' +
        '</div>' : '') +
      block('My Contribution', project.contribution) +
      block('Results & Impact', project.results) +
      block('Future Improvements', project.futureScope) +
      (linksHTML ? '<div class="detail-links reveal-on-scroll">' + linksHTML + '</div>' : '') +
      '</div>';

    detailView.classList.remove('hidden');
    setTimeout(function () { detailView.classList.add('active'); }, 10);
    bgOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    detailView.scrollTop = 0;

    document.getElementById('detail-back-btn').onclick = function () {
      hideDetailView();
    };

    setTimeout(function () {
      detailView.querySelectorAll('.reveal-on-scroll').forEach(function (el) {
        el.classList.add('revealed');
      });
    }, 200);
  }

  function hideDetailView() {
    var detailView = document.getElementById('detail-view');
    var bgOverlay = document.getElementById('bg-overlay');
    detailView.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(function () {
      detailView.classList.add('hidden');
      var heroRect = document.getElementById('home').getBoundingClientRect();
      if (heroRect.bottom > 0) {
        bgOverlay.classList.remove('active');
      } else {
        bgOverlay.classList.add('active');
      }
    }, 500);
  }

  /* ── Skills ──────────────────────────────────────────────── */
  function renderSkills(container, skills) {
    if (!container || !skills) return;
    var cats = Object.keys(skills).map(function (cat) {
      var chips = skills[cat].map(function (s) {
        return '<span class="skill-chip">' + s + '</span>';
      }).join('');
      return '<div class="skill-category reveal-on-scroll">' +
        '<h3 class="skill-category-title">' + cat + '</h3>' +
        '<div class="skill-chips">' + chips + '</div>' +
        '</div>';
    }).join('');

    container.innerHTML =
      '<div class="section-header reveal-on-scroll">' +
      '<span class="section-label">04</span>' +
      '<h2 class="section-title">Skills</h2>' +
      '<div class="section-line"></div>' +
      '</div>' +
      '<div class="skills-grid">' + cats + '</div>';
  }

  /* ── Certifications ──────────────────────────────────────── */
  var CERT_GRADIENTS = [
    'linear-gradient(135deg, #1a1a2e, #16213e)',
    'linear-gradient(135deg, #0f2027, #203a43)',
    'linear-gradient(135deg, #141e30, #243b55)',
  ];

  function renderCertifications(container, certifications) {
    if (!container || !certifications) return;

    var cardsHTML = certifications.map(function (cert, index) {
      var bgStyle = cert.image
        ? 'background-image: url("' + cert.image + '"); background-size: cover; background-position: center;'
        : 'background: ' + CERT_GRADIENTS[index % CERT_GRADIENTS.length] + ';';

      return '<div class="cert-card reveal-on-scroll" data-cert-id="' + cert.id + '" role="button" tabindex="0" aria-label="View ' + cert.name + '">' +
        '<div class="cert-card-bg" style="' + bgStyle + '">' +
        (!cert.image ? '<div class="cert-card-icon">◈</div>' : '') +
        '</div>' +
        '<div class="cert-card-body">' +
        '<div class="cert-card-date">' + cert.date + '</div>' +
        '<h3 class="cert-card-name">' + cert.name + '</h3>' +
        '<div class="cert-card-org">' + cert.organization + '</div>' +
        '<p class="cert-card-desc">' + cert.shortDescription + '</p>' +
        '<div class="cert-card-cta">View Details →</div>' +
        '</div>' +
        '</div>';
    }).join('');

    container.innerHTML =
      '<div class="section-header reveal-on-scroll">' +
      '<span class="section-label">05</span>' +
      '<h2 class="section-title">Certifications</h2>' +
      '<div class="section-line"></div>' +
      '</div>' +
      '<div class="certifications-grid">' + cardsHTML + '</div>';

    container.querySelectorAll('.cert-card').forEach(function (card) {
      function handler() {
        var id = card.getAttribute('data-cert-id');
        openCertModal(id);
      }
      card.addEventListener('click', handler);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
      });
    });
  }

  function openCertModal(id) {
    var cert = (portfolioData.certifications || []).find(function (c) { return c.id === id; });
    if (!cert) return;

    var modal = document.getElementById('cert-modal');
    var content = document.getElementById('modal-content');

    var skillsHTML = (cert.skillsCovered || []).map(function (s) {
      return '<span class="cert-skill-chip">' + s + '</span>';
    }).join('');

    var bgStyle = cert.image
      ? 'background-image: url("' + cert.image + '"); background-size: cover; background-position: center;'
      : 'background: linear-gradient(135deg, #0d1117, #161b22);';

    content.innerHTML =
      '<button class="modal-close-btn" id="modal-close-btn" aria-label="Close">✕</button>' +
      '<div class="cert-modal-hero" style="' + bgStyle + '">' +
      (!cert.image ? '<div class="cert-modal-icon">◈</div>' : '') +
      '</div>' +
      '<div class="cert-modal-body">' +
      '<div class="cert-modal-org">' + cert.organization + ' · ' + cert.date + '</div>' +
      '<h2 class="cert-modal-name">' + cert.name + '</h2>' +
      '<p class="cert-modal-desc">' + (cert.description || cert.shortDescription) + '</p>' +
      (skillsHTML ? '<div class="cert-modal-section"><h4 class="cert-modal-section-label">Skills Covered</h4><div class="cert-skills-grid">' + skillsHTML + '</div></div>' : '') +
      (cert.credentialId ? '<div class="cert-modal-section"><h4 class="cert-modal-section-label">Credential ID</h4><p class="cert-credential-id">' + cert.credentialId + '</p></div>' : '') +
      (cert.credentialLink ? '<a href="' + cert.credentialLink + '" target="_blank" rel="noopener" class="cert-verify-btn">Verify Credential ↗</a>' : '') +
      '</div>';

    modal.classList.remove('hidden');
    setTimeout(function () { modal.classList.add('active'); }, 10);
    document.body.style.overflow = 'hidden';

    document.getElementById('modal-close-btn').onclick = closeCertModal;
    document.getElementById('modal-backdrop').onclick = closeCertModal;
  }

  function closeCertModal() {
    var modal = document.getElementById('cert-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(function () { modal.classList.add('hidden'); }, 400);
  }

  /* ── Resume ──────────────────────────────────────────────── */
  function renderResume(container, resumeData) {
    if (!container || !resumeData) return;
    var file = resumeData.file;
    var label = resumeData.label || 'Resume.pdf';
    container.innerHTML =
      '<div class="section-header reveal-on-scroll">' +
      '<span class="section-label">06</span>' +
      '<h2 class="section-title">Resume</h2>' +
      '<div class="section-line"></div>' +
      '</div>' +
      '<div class="resume-wrapper reveal-on-scroll">' +
      '<div class="resume-frame-container">' +
      '<iframe id="resume-iframe" src="' + file + '" type="application/pdf" title="Resume" loading="lazy" aria-label="Resume PDF preview">' +
      '<div class="resume-fallback">' +
      '<p>PDF preview not available in your browser.</p>' +
      '<a href="' + file + '" target="_blank" rel="noopener" class="resume-btn resume-btn--view">Open Resume ↗</a>' +
      '</div>' +
      '</iframe>' +
      '</div>' +
      '<div class="resume-actions">' +
      '<a href="' + file + '" target="_blank" rel="noopener" class="resume-btn resume-btn--view" id="resume-view-btn">' +
      '<span>View Full Resume</span><span class="btn-icon">↗</span>' +
      '</a>' +
      '<a href="' + file + '" download="' + label + '" class="resume-btn resume-btn--download" id="resume-download-btn">' +
      '<span>Download Resume</span><span class="btn-icon">↓</span>' +
      '</a>' +
      '</div>' +
      '</div>';
  }

  /* ══════════════════════════════════════════════════════════
     3. RENDER ALL SECTIONS
  ══════════════════════════════════════════════════════════ */
  renderAbout(document.getElementById('about-container'), portfolioData.about);
  renderObjective(document.getElementById('objective-container'), portfolioData.objective);
  renderProjects(document.getElementById('projects-container'), portfolioData.projects);
  renderSkills(document.getElementById('skills-container'), portfolioData.skills);
  renderCertifications(document.getElementById('certifications-container'), portfolioData.certifications);
  renderResume(document.getElementById('resume-container'), portfolioData.resume);

  /* ══════════════════════════════════════════════════════════
     4. NAVIGATION
  ══════════════════════════════════════════════════════════ */
  var mainNav = document.getElementById('main-nav');
  var bgOverlay = document.getElementById('bg-overlay');
  var navLinks = mainNav.querySelector('.nav-links');
  var menuBtn = document.getElementById('nav-menu-btn');
  var allNavLinks = mainNav.querySelectorAll('.nav-link');

  // Hero exit → show nav + overlay
  var heroSection = document.getElementById('home');
  var heroObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) {
        mainNav.classList.add('visible');
        bgOverlay.classList.add('active');
      } else {
        mainNav.classList.remove('visible');
        bgOverlay.classList.remove('active');
      }
    });
  }, { threshold: 0.05 });
  heroObserver.observe(heroSection);

  // Active section tracking
  var sectionIds = ['home', 'about', 'objective', 'projects', 'skills', 'certifications', 'resume'];
  var activeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        allNavLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('data-section') === id);
        });
      }
    });
  }, { threshold: 0.4 });

  sectionIds.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) activeObserver.observe(el);
  });

  // Nav link click — smooth scroll
  allNavLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var sectionId = link.getAttribute('data-section');
      var target = document.getElementById(sectionId);
      if (target) {
        e.preventDefault();
        navLinks.classList.remove('open');
        menuBtn.classList.remove('open');
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Mobile hamburger
  menuBtn.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    menuBtn.classList.toggle('open', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', function (e) {
    if (!mainNav.contains(e.target)) {
      navLinks.classList.remove('open');
      menuBtn.classList.remove('open');
    }
  });

  /* ══════════════════════════════════════════════════════════
     5. HERO SCROLL EFFECTS
  ══════════════════════════════════════════════════════════ */
  var heroSubtitleWrapper = document.getElementById('hero-subtitle-wrapper');
  var scrollIndicator = document.getElementById('scroll-indicator');
  var subtitleRevealed = false;

  window.addEventListener('scroll', function () {
    var scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 80 && !subtitleRevealed) {
      subtitleRevealed = true;
      heroSubtitleWrapper.classList.add('visible');
    }
    scrollIndicator.style.opacity = scrollY > 50 ? '0' : '1';
  }, { passive: true });

  /* ══════════════════════════════════════════════════════════
     6. SCROLL REVEAL
  ══════════════════════════════════════════════════════════ */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-on-scroll').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ══════════════════════════════════════════════════════════
     7. KEYBOARD: Escape closes modals
  ══════════════════════════════════════════════════════════ */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var detailView = document.getElementById('detail-view');
      var certModal = document.getElementById('cert-modal');
      if (!detailView.classList.contains('hidden') && detailView.classList.contains('active')) {
        hideDetailView();
      }
      if (!certModal.classList.contains('hidden') && certModal.classList.contains('active')) {
        closeCertModal();
      }
    }
  });

  /* ══════════════════════════════════════════════════════════
     8. CUSTOM CURSOR
  ══════════════════════════════════════════════════════════ */
  var customCursor = document.getElementById('custom-cursor');
  if (customCursor) {
    document.addEventListener('mousemove', function (e) {
      customCursor.style.left = e.clientX + 'px';
      customCursor.style.top = e.clientY + 'px';
    });
    
    // Add hover effects for clickable elements
    var clickables = document.querySelectorAll('a, button, .project-card, .cert-card');
    clickables.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        customCursor.style.width = '40px';
        customCursor.style.height = '40px';
        customCursor.style.backgroundColor = 'rgba(255, 255, 0, 0.4)';
      });
      el.addEventListener('mouseleave', function () {
        customCursor.style.width = '20px';
        customCursor.style.height = '20px';
        customCursor.style.backgroundColor = 'yellow';
      });
    });
  }

})();
