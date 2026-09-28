/**
 * InyBit Theme — 05-filetree.js
 * Collapsible & interactive FileTree shortcode component.
 */
(function (window) {
  'use strict';
  window.InyBit = window.InyBit || {};

  function getFileIconSvg(ext) {
    switch (ext) {
      case 'md':
        return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>';
      case 'go':
      case 'py':
      case 'js':
      case 'ts':
        return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';
      case 'html':
      case 'css':
        return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>';
      case 'json':
      case 'toml':
      case 'yaml':
      case 'yml':
        return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
      case 'cast':
      case 'sh':
        return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>';
      default:
        return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>';
    }
  }

  function initCollapsibleFileTree() {
    var components = document.querySelectorAll('.filetree-component');

    components.forEach(function (comp) {
      if (comp.dataset.initialized) return;
      comp.dataset.initialized = 'true';

      var rawEl = comp.querySelector('.filetree-raw-source code');
      var rootEl = comp.querySelector('.filetree-tree-root');
      var toggleAllBtn = comp.querySelector('.filetree-toggle-all');
      if (!rawEl || !rootEl) return;

      var rawText = rawEl.textContent.trim();
      if (!rawText) return;

      var lines = rawText.split('\n').filter(function (l) { return l.trim().length > 0; });
      var items = [];

      lines.forEach(function (line) {
        var depth = 0;
        var clean = line;

        var prefixMatch = line.match(/^[\s│├└─*•\-]+/);
        if (prefixMatch) {
          var p = prefixMatch[0];
          var indentSpaces = p.replace(/[├└─*•\-]/g, ' ').length;
          depth = Math.floor(indentSpaces / 2);
          clean = line.slice(p.length).trim();
        } else {
          var leadingSpaces = line.search(/\S|$/);
          depth = Math.floor(leadingSpaces / 2);
          clean = line.trim();
        }

        if (!clean) return;

        var isFolder = clean.endsWith('/') || clean.endsWith('\\');
        if (isFolder) {
          clean = clean.replace(/[\/\\]$/, '');
        }

        items.push({
          raw: line,
          name: clean,
          depth: depth,
          isFolder: isFolder
        });
      });

      for (var i = 0; i < items.length - 1; i++) {
        if (items[i + 1].depth > items[i].depth) {
          items[i].isFolder = true;
        }
      }

      var fragment = document.createDocumentFragment();
      var stack = [{ depth: -1, container: fragment }];

      items.forEach(function (item) {
        while (stack.length > 1 && stack[stack.length - 1].depth >= item.depth) {
          stack.pop();
        }

        var parentContainer = stack[stack.length - 1].container;
        var itemEl = document.createElement('div');
        itemEl.className = 'tree-node ' + (item.isFolder ? 'tree-folder is-open' : 'tree-file');
        itemEl.setAttribute('data-depth', item.depth);

        var rowEl = document.createElement('div');
        rowEl.className = 'tree-node-row';
        rowEl.style.paddingLeft = (item.depth * 18 + 10) + 'px';

        if (item.isFolder) {
          var chevron = document.createElement('span');
          chevron.className = 'tree-chevron';
          chevron.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>';
          rowEl.appendChild(chevron);

          var folderIcon = document.createElement('span');
          folderIcon.className = 'tree-icon folder-icon';
          folderIcon.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>';
          rowEl.appendChild(folderIcon);

          var nameSpan = document.createElement('span');
          nameSpan.className = 'tree-label folder-label';
          nameSpan.textContent = item.name;
          rowEl.appendChild(nameSpan);

          itemEl.appendChild(rowEl);

          var childrenEl = document.createElement('div');
          childrenEl.className = 'tree-children';
          itemEl.appendChild(childrenEl);

          rowEl.addEventListener('click', function (e) {
            e.stopPropagation();
            itemEl.classList.toggle('is-open');
          });

          stack.push({ depth: item.depth, container: childrenEl });
        } else {
          var spacer = document.createElement('span');
          spacer.className = 'tree-chevron-spacer';
          rowEl.appendChild(spacer);

          var extMatch = item.name.match(/\.([a-zA-Z0-9]+)$/);
          var ext = extMatch ? extMatch[1].toLowerCase() : '';
          var fileIcon = document.createElement('span');
          fileIcon.className = 'tree-icon file-icon file-ext-' + ext;
          fileIcon.innerHTML = getFileIconSvg(ext);
          rowEl.appendChild(fileIcon);

          var fileNameSpan = document.createElement('span');
          fileNameSpan.className = 'tree-label file-label';
          fileNameSpan.textContent = item.name;
          rowEl.appendChild(fileNameSpan);

          if (ext) {
            var extBadge = document.createElement('span');
            extBadge.className = 'tree-badge';
            extBadge.textContent = ext;
            rowEl.appendChild(extBadge);
          }

          itemEl.appendChild(rowEl);
        }

        parentContainer.appendChild(itemEl);
      });

      rootEl.appendChild(fragment);

      if (toggleAllBtn) {
        var allExpanded = true;
        toggleAllBtn.addEventListener('click', function () {
          allExpanded = !allExpanded;
          var folders = rootEl.querySelectorAll('.tree-folder');
          folders.forEach(function (f) {
            if (allExpanded) {
              f.classList.add('is-open');
            } else {
              f.classList.remove('is-open');
            }
          });
          var span = toggleAllBtn.querySelector('span');
          if (span) {
            span.textContent = allExpanded ? '全部折叠' : '全部展开';
          }
        });
      }
    });
  }

  window.InyBit.initFileTree = initCollapsibleFileTree;
})(window);
