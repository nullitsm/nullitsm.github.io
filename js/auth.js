/* NULL ITSM — demonstration authentication (shared).
 * Demo only: the session lives in sessionStorage in this browser tab.
 * This is NOT production authentication. Real authentication requires
 * a secure backend (server-side sessions, hashed credentials, HTTPS,
 * CSRF protection, etc.). Do not treat this as a security control. */
(function () {
  'use strict';
  var KEY = 'null-itsm-session';
  var SIGN_IN = 'null-itsm-sign-in.html';
  var HOME = 'null-itsm-command-center.html';

  function read() {
    try {
      var raw = sessionStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function getSession() { return read(); }
  function isAuthed() { return !!read(); }
  function setSession(name) {
    try { sessionStorage.setItem(KEY, JSON.stringify({ user: name, ts: Date.now() })); } catch (e) {}
  }
  function clearSession() {
    try { sessionStorage.removeItem(KEY); } catch (e) {}
  }
  function requireAuth() {
    if (!isAuthed()) { window.location.replace(SIGN_IN); return false; }
    return true;
  }
  function signOut() {
    clearSession();
    window.location.replace(SIGN_IN);
  }
  function redirectIfAuthed() {
    if (isAuthed()) { window.location.replace(HOME); return true; }
    return false;
  }
  function guard() {
    // Pages that require a session carry data-requires-auth on <body>.
    if (document.body && document.body.hasAttribute('data-requires-auth')) {
      requireAuth();
    }
  }

  window.NULLAuth = {
    getSession: getSession,
    isAuthed: isAuthed,
    setSession: setSession,
    clearSession: clearSession,
    requireAuth: requireAuth,
    signOut: signOut,
    redirectIfAuthed: redirectIfAuthed
  };

  document.addEventListener('DOMContentLoaded', guard);
  // Re-check on back/forward navigation: the back-forward cache restores
  // pages without reloading, so a pageshow check stops a signed-out
  // session from exposing protected content via the back button.
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { guard(); }
  });
})();
