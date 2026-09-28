/**
 * InyBit Theme — 08-artalk-post.js
 * Artalk v2.10.0 Post Comments Loader (Single Instance Guard, PV & Required Fields).
 */
(function (window) {
  'use strict';
  window.InyBit = window.InyBit || {};

  function initArtalkComments() {
    var artalkEl = document.getElementById('artalk-comments');
    if (!artalkEl) return;

    var server = artalkEl.getAttribute('data-server') || '';
    if (!server) return; // Do not initialize if no server configured

    var site = artalkEl.getAttribute('data-site') || document.title;
    var pageKey = artalkEl.getAttribute('data-page-key') || window.location.pathname;
    var pageTitle = artalkEl.getAttribute('data-page-title') || document.title;
    var placeholder = artalkEl.getAttribute('data-placeholder') || '说点什么吧... (文明你我他，和平靠大家)';
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // 1. Immediately fetch and display Page Views (PV) and Comment Count
    var pvEl = document.getElementById('artalk_pv');
    var countEl = document.getElementById('artalk_count');

    fetch(server + '/api/v2/comments?page_key=' + encodeURIComponent(pageKey) + '&site_name=' + encodeURIComponent(site) + '&limit=100&offset=0')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (pvEl && data && data.page) {
          pvEl.textContent = data.page.pv || 1;
        }
        if (countEl && data) {
          countEl.textContent = (typeof data.count === 'number') ? data.count : (data.comments ? data.comments.length : 0);
        }
      })
      .catch(function () {});

    // 2. Strict guard to guarantee mounting EXACTLY ONCE
    var isMounted = false;

    function mountArtalk() {
      if (isMounted || artalkEl.dataset.artalkMounted === 'true') return;
      if (typeof Artalk === 'undefined') return;

      isMounted = true;
      artalkEl.dataset.artalkMounted = 'true';
      artalkEl.innerHTML = '';

      var gravatarMirror = artalkEl.getAttribute('data-gravatar-mirror') || 'https://cravatar.cn/avatar/';

      try {
        window.artalkInstance = Artalk.init({
          el: '#artalk-comments',
          pageKey: pageKey,
          pageTitle: pageTitle,
          server: server,
          site: site,
          placeholder: placeholder,
          darkMode: isDark,
          listSort: true,
          gravatar: {
            mirror: gravatarMirror
          },
          emoticons: 'https://cdn.jsdelivr.net/gh/ArtalkJS/Emoticons/grpm/'
        });

        if (window.artalkInstance && pvEl) {
          window.artalkInstance.on('pv-updated', function (pv) {
            pvEl.textContent = pv;
          });
        }
      } catch (err) {
        console.warn('Artalk mount error:', err);
      }

      function initRightAlignedSortDropdown() {
        var header = document.querySelector('.artalk > .atk-list > .atk-list-header');
        if (!header) return;

        document.querySelectorAll('.artalk .atk-comment-count .atk-arrow-down-icon').forEach(function (el) {
          el.remove();
        });

        var dropdown = header.querySelector('.atk-dropdown');
        if (!dropdown) return;

        var existingBox = header.querySelector('.atk-sort-trigger-box');
        if (existingBox) {
          if (!existingBox.contains(dropdown)) {
            var oldDropdown = existingBox.querySelector('.atk-dropdown');
            if (oldDropdown && oldDropdown !== dropdown) oldDropdown.remove();
            existingBox.appendChild(dropdown);
          }
          var curActive = dropdown.querySelector('.active span');
          if (curActive) {
            var curLabel = existingBox.querySelector('.atk-sort-label');
            if (curLabel) curLabel.textContent = curActive.textContent.trim();
          }
          return;
        }

        var triggerBox = document.createElement('div');
        triggerBox.className = 'atk-sort-trigger-box';

        var activeItem = dropdown.querySelector('.active span');
        var activeText = activeItem ? activeItem.textContent.trim() : '最新';

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'atk-sort-btn';
        btn.innerHTML = '<span class="atk-sort-label">' + activeText + '</span><span class="atk-sort-caret">▾</span>';

        triggerBox.appendChild(btn);
        triggerBox.appendChild(dropdown);
        header.appendChild(triggerBox);

        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          triggerBox.classList.toggle('is-open');
        });

        dropdown.addEventListener('click', function (e) {
          var item = e.target.closest('.atk-dropdown-item');
          if (item) {
            var span = item.querySelector('span');
            if (span) {
              btn.querySelector('.atk-sort-label').textContent = span.textContent.trim();
            }
            triggerBox.classList.remove('is-open');
          }
        });

        document.addEventListener('click', function () {
          triggerBox.classList.remove('is-open');
        });
      }

      function filterSystemComments() {
        document.querySelectorAll('.artalk .atk-comment').forEach(function (el) {
          var contentEl = el.querySelector('.atk-comment-content');
          if (contentEl) {
            var txt = contentEl.textContent.trim();
            if (txt === '[LIKE]' || txt === '[赞]') {
              el.style.display = 'none';
            }
          }
        });
      }

      function markArtalkRequiredFields() {
        var isEn = document.documentElement.lang.startsWith('en');
        var nameInput = document.querySelector('.artalk .atk-name');
        var emailInput = document.querySelector('.artalk .atk-email');
        var linkInput = document.querySelector('.artalk .atk-link');

        if (nameInput) {
          nameInput.setAttribute('placeholder', isEn ? 'Nickname (Required) *' : '昵称 (必填) *');
          nameInput.setAttribute('title', isEn ? 'Nickname is required' : '昵称必须填写');
        }
        if (emailInput) {
          emailInput.setAttribute('placeholder', isEn ? 'Email (Required) *' : '邮箱 (必填) *');
          emailInput.setAttribute('title', isEn ? 'Email is required' : '邮箱必须填写 (保密)');
        }
        if (linkInput) {
          linkInput.setAttribute('placeholder', isEn ? 'Website (Optional)' : '网址 (选填)');
        }

        var u = (window.InyBit && window.InyBit.getSharedUserData) ? window.InyBit.getSharedUserData() : {};
        if (u.nick && nameInput && !nameInput.value) {
          nameInput.value = u.nick;
        }
        if (u.email && emailInput && !emailInput.value) {
          emailInput.value = u.email;
        }
      }

      function onArtalkListUpdate() {
        initRightAlignedSortDropdown();
        filterSystemComments();
        markArtalkRequiredFields();
      }

      if (window.artalkInstance) {
        window.artalkInstance.on('list-loaded', onArtalkListUpdate);
        window.artalkInstance.on('list-fetched', onArtalkListUpdate);
      }

      setTimeout(function () {
        onArtalkListUpdate();
        markArtalkRequiredFields();
        if (window.InyBit && window.InyBit.syncArtalkDarkMode) {
          window.InyBit.syncArtalkDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
        }
      }, 200);
      setTimeout(function () {
        markArtalkRequiredFields();
      }, 800);
    }

    var mountAttempts = 0;
    function tryMount() {
      if (isMounted) return;
      if (typeof Artalk !== 'undefined') {
        mountArtalk();
      } else if (mountAttempts < 30) {
        mountAttempts++;
        setTimeout(tryMount, 150);
      }
    }

    tryMount();
  }

  window.InyBit.initArtalkComments = initArtalkComments;
})(window);
