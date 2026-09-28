/**
 * InyBit Theme — 99-init.js
 * DOM Ready Entrypoint initializing all components.
 */
document.addEventListener('DOMContentLoaded', function () {
  if (!window.InyBit) return;

  if (typeof window.InyBit.initTheme === 'function') window.InyBit.initTheme();
  if (typeof window.InyBit.initNav === 'function') window.InyBit.initNav();
  if (typeof window.InyBit.initCodeCopy === 'function') window.InyBit.initCodeCopy();
  if (typeof window.InyBit.initFileTree === 'function') window.InyBit.initFileTree();
  if (typeof window.InyBit.initAsciinema === 'function') window.InyBit.initAsciinema();
  if (typeof window.InyBit.initTabs === 'function') window.InyBit.initTabs();
  if (typeof window.InyBit.initTOC === 'function') window.InyBit.initTOC();
  if (typeof window.InyBit.initBlogSidebarTree === 'function') window.InyBit.initBlogSidebarTree();
  if (typeof window.InyBit.initMomentsModal === 'function') window.InyBit.initMomentsModal();
  if (typeof window.InyBit.initMoments === 'function') window.InyBit.initMoments();
  if (typeof window.InyBit.initArtalkComments === 'function') window.InyBit.initArtalkComments();
});
