/**
 * InyBit Theme — 04-code-copy.js
 * Markdown code block copy buttons and toast status feedback.
 */
(function (window) {
  'use strict';
  window.InyBit = window.InyBit || {};

  function initCodeCopyButtons() {
    var codeBlocks = document.querySelectorAll('.highlight pre, .content pre');

    codeBlocks.forEach(function (pre) {
      if (pre.parentNode.querySelector('.code-copy-btn')) return;

      var button = document.createElement('button');
      button.className = 'code-copy-btn';
      button.type = 'button';
      button.setAttribute('aria-label', '复制代码');
      button.innerHTML = '<svg class="icon-copy" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg><span class="copy-text">复制</span>';

      var container = pre.closest('.highlight') || pre;
      var computedPos = window.getComputedStyle(container).position;
      if (computedPos === 'static') {
        container.style.position = 'relative';
      }

      container.appendChild(button);

      button.addEventListener('click', function () {
        var code = pre.querySelector('code');
        var text = (code ? code.innerText : pre.innerText).trimEnd();

        function showSuccess() {
          button.classList.add('copied');
          button.innerHTML = '<svg class="icon-check" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span class="copy-text">已复制!</span>';
          setTimeout(function () {
            button.classList.remove('copied');
            button.innerHTML = '<svg class="icon-copy" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg><span class="copy-text">复制</span>';
          }, 2000);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(showSuccess).catch(function () {
            fallbackCopy(text, showSuccess);
          });
        } else {
          fallbackCopy(text, showSuccess);
        }
      });
    });

    function fallbackCopy(text, cb) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        cb();
      } catch (e) {}
      document.body.removeChild(textarea);
    }
  }

  window.InyBit.initCodeCopy = initCodeCopyButtons;
})(window);
