/**
 * InyBit Theme — 06-tabs-asciinema.js
 * Multi-tabs component and Asciinema terminal player initialization.
 */
(function (window) {
  'use strict';
  window.InyBit = window.InyBit || {};

  function initAsciinemaPlayers() {
    var containers = document.querySelectorAll('.asciinema-player-container');
    if (!containers.length) return;

    function mountPlayer(container) {
      if (container.dataset.playerMounted) return;
      var src = container.getAttribute('data-src');
      if (!src) return;

      if (typeof AsciinemaPlayer !== 'undefined' && typeof AsciinemaPlayer.create === 'function') {
        container.dataset.playerMounted = 'true';
        container.innerHTML = '';
        var playerBox = document.createElement('div');
        container.appendChild(playerBox);

        var rows = parseInt(container.getAttribute('data-rows') || '15', 10);
        var autoPlay = container.getAttribute('data-autoplay') === 'true';
        var loop = container.getAttribute('data-loop') === 'true';
        var theme = container.getAttribute('data-theme') || 'asciinema';

        try {
          AsciinemaPlayer.create(src, playerBox, {
            rows: rows,
            autoPlay: autoPlay,
            loop: loop,
            theme: theme,
            fit: 'width'
          });
        } catch (e) {}
      }
    }

    containers.forEach(function (c) { mountPlayer(c); });
  }

  function initTabs() {
    var tabGroups = document.querySelectorAll('.tabs-component');
    tabGroups.forEach(function (group) {
      var navButtons = group.querySelectorAll('.tab-btn');
      var panes = group.querySelectorAll('.tab-pane');

      navButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var targetTab = btn.getAttribute('data-tab');

          navButtons.forEach(function (b) {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          panes.forEach(function (p) {
            p.classList.remove('active');
          });

          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');

          panes.forEach(function (p) {
            if (p.getAttribute('data-tab') === targetTab) {
              p.classList.add('active');
            }
          });
        });
      });
    });
  }

  window.InyBit.initAsciinema = initAsciinemaPlayers;
  window.InyBit.initTabs = initTabs;
})(window);
