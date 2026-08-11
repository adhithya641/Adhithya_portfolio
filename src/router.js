/**
 * ============================================================
 *  HASH ROUTER
 *  Handles navigation between:
 *    #/           → main portfolio (default)
 *    #/projects/:id  → project detail view
 *    #section-id  → scroll to section
 * ============================================================
 */

let _showProject = null;
let _hideDetail  = null;

export function initRouter(showProjectDetail, hideDetailView) {
  _showProject = showProjectDetail;
  _hideDetail  = hideDetailView;

  window.addEventListener('hashchange', _handleRoute);
  // Don't auto-handle on init — let app.js handle initial render
}

export function navigateTo(hash) {
  window.location.hash = hash;
}

function _handleRoute() {
  const hash = window.location.hash;

  if (hash.startsWith('#/projects/')) {
    const id = hash.slice('#/projects/'.length);
    if (_showProject) _showProject(id);
    return;
  }

  // Plain section anchor — hide detail, scroll to section
  if (_hideDetail) _hideDetail();

  const sectionId = hash.slice(1); // remove '#'
  if (sectionId) {
    const el = document.getElementById(sectionId);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }
}

export { _handleRoute as handleCurrentRoute };
