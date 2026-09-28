/**
 * InyBit Theme — 09-moments-modal.js
 * WeChat Moments User Identification Modal (Nickname & Email Required).
 */
(function (window) {
  'use strict';
  window.InyBit = window.InyBit || {};

  function initMomentsUserModal() {
    var modalEl = document.getElementById('moment-user-modal');
    if (!modalEl) return null;

    var closeBtn = modalEl.querySelector('.moment-modal-close');
    var cancelBtn = modalEl.querySelector('.btn-cancel');
    var backdrop = modalEl.querySelector('.moment-modal-backdrop');
    var form = modalEl.querySelector('.moment-modal-form');
    var nickInput = modalEl.querySelector('.moment-modal-input-nick');
    var emailInput = modalEl.querySelector('.moment-modal-input-email');
    var currentCallback = null;

    function closeModal() {
      modalEl.classList.remove('is-open');
      modalEl.style.display = 'none';
      currentCallback = null;
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var n = nickInput ? nickInput.value.trim() : '';
        var em = emailInput ? emailInput.value.trim() : '';

        if (!n) {
          if (nickInput) nickInput.focus();
          alert('请填写昵称');
          return;
        }
        if (!em || (window.InyBit.isValidEmail && !window.InyBit.isValidEmail(em))) {
          if (emailInput) emailInput.focus();
          alert('请填写有效邮箱');
          return;
        }

        if (window.InyBit.setSharedUserData) {
          window.InyBit.setSharedUserData(n, em);
        }

        var cb = currentCallback;
        closeModal();

        // Sync into any open moment comment inputs
        document.querySelectorAll('.moment-input-nick').forEach(function (el) { el.value = n; });
        document.querySelectorAll('.moment-input-email').forEach(function (el) { el.value = em; });

        if (typeof cb === 'function') {
          cb(n, em);
        }
      });
    }

    var controller = {
      open: function (callback) {
        currentCallback = callback;
        var u = (window.InyBit.getSharedUserData) ? window.InyBit.getSharedUserData() : { nick: '', email: '' };
        if (nickInput) nickInput.value = u.nick;
        if (emailInput) emailInput.value = u.email;
        modalEl.classList.add('is-open');
        modalEl.style.display = 'flex';
        if (!u.nick && nickInput) {
          nickInput.focus();
        } else if (!u.email && emailInput) {
          emailInput.focus();
        }
      },
      close: closeModal
    };

    window.InyBit.momentsModal = controller;
    return controller;
  }

  window.InyBit.initMomentsModal = initMomentsUserModal;
})(window);
