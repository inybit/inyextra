/**
 * InyBit Theme — 02-theme.js
 * 3-State Theme toggle (Light/Dark/System default) and Artalk sync.
 */
(function (window) {
  'use strict';
  window.InyBit = window.InyBit || {};

  var THEME_KEY = 'inyextra-theme';

  function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function getSavedMode() {
    try {
      return localStorage.getItem(THEME_KEY) || 'system';
    } catch (e) {
      return 'system';
    }
  }

  function resolveTheme(mode) {
    if (mode === 'system') {
      return getSystemTheme();
    }
    return mode === 'dark' ? 'dark' : 'light';
  }

  function syncArtalkDarkMode(isDark) {
    if (window.artalkInstance && typeof window.artalkInstance.setDarkMode === 'function') {
      try {
        window.artalkInstance.setDarkMode(isDark);
      } catch (e) {}
    }
    var layerWraps = document.querySelectorAll('.atk-layer-wrap');
    layerWraps.forEach(function (wrap) {
      if (isDark) {
        wrap.classList.add('atk-dark-mode');
      } else {
        wrap.classList.remove('atk-dark-mode');
      }
    });
  }

  function applyThemeMode(mode, save) {
    var effectiveTheme = resolveTheme(mode);
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    document.documentElement.setAttribute('data-theme-mode', mode);

    if (save) {
      try {
        localStorage.setItem(THEME_KEY, mode);
      } catch (e) {}
    }

    var isDark = effectiveTheme === 'dark';
    syncArtalkDarkMode(isDark);

    // Update flat buttons in minimal footer
    document.querySelectorAll('.theme-flat-btn').forEach(function (btn) {
      var setMode = btn.getAttribute('data-theme-set');
      if (setMode === mode) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });

    // Update upward popover menu buttons if present
    document.querySelectorAll('.theme-option').forEach(function (opt) {
      var optMode = opt.getAttribute('data-theme-set');
      if (optMode === mode) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });

    // Dispatch custom event for plugins or widgets
    window.dispatchEvent(new CustomEvent('inybit-theme-changed', {
      detail: { mode: mode, effectiveTheme: effectiveTheme, isDark: isDark }
    }));
  }

  function initTheme() {
    var currentMode = getSavedMode();
    applyThemeMode(currentMode, false);

    // Flat 3-state buttons click handlers in footer
    document.querySelectorAll('.theme-flat-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = this.getAttribute('data-theme-set');
        if (mode) applyThemeMode(mode, true);
      });
    });

    // Theme options in dropdown/popovers
    document.querySelectorAll('.theme-option').forEach(function (opt) {
      opt.addEventListener('click', function (e) {
        e.preventDefault();
        var mode = this.getAttribute('data-theme-set');
        if (mode) applyThemeMode(mode, true);
      });
    });

    // Listen for OS theme changes when in 'system' mode
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
        if (getSavedMode() === 'system') {
          applyThemeMode('system', false);
        }
      });
    }
  }

  window.InyBit.initTheme = initTheme;
  window.InyBit.applyThemeMode = applyThemeMode;
  window.InyBit.syncArtalkDarkMode = syncArtalkDarkMode;
})(window);
