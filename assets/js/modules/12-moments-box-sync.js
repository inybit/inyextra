/**
 * InyBit Theme — 12-moments-box-sync.js
 * Keeps the visibility state of .moment-interactions-box in sync with its
 * children (likes row / comments list / inline comment bar), so an empty
 * container never renders as a stray grey bubble.
 */
(function (window) {
  'use strict';
  window.InyBit = window.InyBit || {};

  var BOX_SELECTOR = '.moment-interactions-box';

  function isShown(el) {
    if (!el) return false;
    return window.getComputedStyle(el).display !== 'none';
  }

  function syncBox(box) {
    if (!box) return;
    var likesRow = box.querySelector('.moment-likes-row');
    var commentsList = box.querySelector('.moment-comments-list');
    var commentBar = box.querySelector('.moment-comment-bar');

    var hasLikes = isShown(likesRow);
    var hasComments = isShown(commentsList);
    var hasBar = isShown(commentBar);

    box.classList.toggle('has-likes', hasLikes);
    box.classList.toggle('has-comments', hasComments);
    box.classList.toggle('is-empty', !hasLikes && !hasComments && !hasBar);
  }

  function observeBox(box) {
    if (!box || box.getAttribute('data-box-sync') === 'on') return;
    box.setAttribute('data-box-sync', 'on');
    syncBox(box);

    if (typeof window.MutationObserver !== 'function') return;
    var observer = new window.MutationObserver(function () { syncBox(box); });
    // Children toggle inline style.display from several places (fetch callbacks,
    // form submit, action buttons) — observe them instead of hooking each path.
    observer.observe(box, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      childList: true,
      subtree: true
    });
  }

  function initMomentsBoxSync() {
    var boxes = document.querySelectorAll(BOX_SELECTOR);
    for (var i = 0; i < boxes.length; i++) observeBox(boxes[i]);
  }

  window.InyBit.initMomentsBoxSync = initMomentsBoxSync;
  window.InyBit.syncMomentBox = syncBox;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMomentsBoxSync);
  } else {
    initMomentsBoxSync();
  }
})(window);
