/**
 * InyBit Theme — 04-code-copy.js
 * Markdown code block copy buttons and toast status feedback.
 *
 * 按钮由 layouts/_markup/render-codeblock.html 生成：
 *   .code-block > .code-header > button.copy-btn
 * 本文件只负责绑定事件，不再注入第二个按钮。
 * 旧实现把无样式的 .code-copy-btn 追加到 .highlight 末尾，按钮视觉上贴住下一个代码块，
 * 点击后复制的是上一块的内容，表现为「复制错位」。
 */
(function (window) {
  'use strict';
  window.InyBit = window.InyBit || {};

  var ICON_COPY = '<svg class="copy-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
  var ICON_CHECK = '<svg class="icon-check" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

  function writeClipboard(text, onSuccess) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(function () {
        fallbackCopy(text, onSuccess);
      });
      return;
    }
    fallbackCopy(text, onSuccess);
  }

  function fallbackCopy(text, onSuccess) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      if (document.execCommand('copy')) onSuccess();
    } catch (e) {}
    document.body.removeChild(textarea);
  }

  function initCodeCopyButtons() {
    var buttons = document.querySelectorAll('.code-block .copy-btn');

    buttons.forEach(function (button) {
      if (button.dataset.copyBound === 'true') return;
      button.dataset.copyBound = 'true';

      // 复制范围永远取自按钮所属的代码块，不做全局下标匹配
      var block = button.closest('.code-block');
      if (!block) return;
      var codeEl = block.querySelector('pre code') || block.querySelector('pre');
      if (!codeEl) return;

      button.addEventListener('click', function () {
        var text = codeEl.innerText.replace(/\s+$/, '');

        writeClipboard(text, function () {
          button.classList.add('copied');
          button.innerHTML = ICON_CHECK + '<span class="copy-text">已复制!</span>';
          window.setTimeout(function () {
            button.classList.remove('copied');
            button.innerHTML = ICON_COPY + '<span class="copy-text">复制</span>';
          }, 2000);
        });
      });
    });
  }

  window.InyBit.initCodeCopy = initCodeCopyButtons;
})(window);
