/**
 * InyBit Theme — 03-nav-banner.js
 * Mobile navigation menu and site announcement banner.
 */
(function (window) {
  'use strict';
  window.InyBit = window.InyBit || {};

  function initMobileMenu() {
    var menuToggle = document.getElementById('menu-toggle');
    var mobileNav = document.getElementById('mobile-nav');
    if (!menuToggle || !mobileNav) return;

    menuToggle.addEventListener('click', function () {
      var expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !expanded);
      mobileNav.classList.toggle('is-open', !expanded);
      document.body.style.overflow = !expanded ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  function initSiteBanner() {
    var banner = document.getElementById('site-banner');
    if (!banner) return;

    var bannerId = banner.getAttribute('data-banner-id') || 'banner-v1';
    var closeBtn = document.getElementById('banner-close-btn');

    try {
      if (localStorage.getItem('dismissed_' + bannerId) === 'true') {
        banner.style.display = 'none';
        return;
      }
    } catch (e) {}

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(-100%)';
        setTimeout(function () {
          banner.style.display = 'none';
        }, 200);
        try {
          localStorage.setItem('dismissed_' + bannerId, 'true');
        } catch (e) {}
      });
    }
  }

  window.InyBit.initNav = function () {
    initMobileMenu();
    initSiteBanner();
  };
})(window);
