/* NULL ITSM — shared navigation (shared).
 * Active-module highlighting, signed-in user chip, and sign-out wiring.
 * Depends on js/auth.js (NULLAuth) being loaded first. */
(function () {
  'use strict';
  var LINKS = {
    home: 'null-itsm-command-center.html',
    tickets: 'null-itsm-tickets.html',
    endpoints: 'null-itsm-endpoints.html',
    changes: 'null-itsm-changes.html',
    cmdb: 'null-itsm-cmdb.html',
    analytics: 'null-itsm-analytics.html',
    settings: 'null-itsm-platform-settings.html'
  };

  function currentFile() {
    var p = window.location.pathname.split('/').pop() || '';
    return p.split('?')[0].split('#')[0] || 'null-itsm-command-center.html';
  }

  function markActive() {
    var file = currentFile();
    var links = document.querySelectorAll('a[href$=".html"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var href = a.getAttribute('href');
      if (!href) continue;
      var target = href.split('/').pop().split('?')[0].split('#')[0];
      if (target === file) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
      }
    }
  }

  function fillUser() {
    if (!window.NULLAuth) return;
    var s = window.NULLAuth.getSession();
    if (!s || !s.user) return;
    var nameEl = document.querySelector('#user-name');
    if (nameEl) nameEl.textContent = s.user;
    var av = document.querySelector('#avatar-init');
    if (av) {
      var parts = String(s.user).split(/\s+/);
      av.textContent = ((parts[0] || 'J')[0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
    }
  }

  function wireSignOut() {
    if (!window.NULLAuth) return;
    var els = document.querySelectorAll('[data-sign-out]');
    for (var i = 0; i < els.length; i++) {
      els[i].addEventListener('click', function (e) {
        e.preventDefault();
        window.NULLAuth.signOut();
      });
    }
  }

  function init() { markActive(); fillUser(); wireSignOut(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.NULLNav = { LINKS: LINKS, markActive: markActive, fillUser: fillUser };
})();
