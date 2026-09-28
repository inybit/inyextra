/**
 * InyBit Theme — 07-toc-sidebar.js
 * TOC ScrollSpy reading follower and Blog sidebar tree navigation.
 */
(function (window) {
  'use strict';
  window.InyBit = window.InyBit || {};

  function initTOC() {
    var tocLinks = document.querySelectorAll('.toc-content a, #TableOfContents a, .toc-sidebar a');
    if (!tocLinks.length) return;

    var headings = [];
    tocLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        try {
          var targetId = decodeURIComponent(href.substring(1));
          var el = document.getElementById(targetId);
          if (el) {
            headings.push({ el: el, link: link });
          }
        } catch (e) {}
      }
    });

    if (!headings.length) return;

    function onScroll() {
      var scrollY = window.scrollY;
      var activeIndex = -1;

      for (var i = 0; i < headings.length; i++) {
        var top = headings[i].el.getBoundingClientRect().top + scrollY - 90;
        if (scrollY >= top) {
          activeIndex = i;
        } else {
          break;
        }
      }

      tocLinks.forEach(function (l) { l.classList.remove('active'); });

      if (activeIndex >= 0 && activeIndex < headings.length) {
        headings[activeIndex].link.classList.add('active');
      } else if (headings.length > 0 && scrollY < 200) {
        headings[0].link.classList.add('active');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initBlogSidebarTree() {
    var folderHeaders = document.querySelectorAll('.blog-sidebar-tree .tree-folder-header');
    folderHeaders.forEach(function (header) {
      header.addEventListener('click', function () {
        var parent = header.closest('.tree-folder');
        if (parent) {
          parent.classList.toggle('collapsed');
        }
      });
    });
  }

  window.InyBit.initTOC = initTOC;
  window.InyBit.initBlogSidebarTree = initBlogSidebarTree;
})(window);
