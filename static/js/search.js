/**
 * inybit Theme — Offline Full-Text Search (FlexSearch.js)
 * Supports CJK + Latin tokenization, multi-language indexes, and full keyboard navigation.
 */
(function () {
  'use strict';

  const modal = document.getElementById('search-modal');
  if (!modal) return;

  const backdrop = document.getElementById('search-backdrop');
  const input = document.getElementById('search-input');
  const closeBtn = document.getElementById('search-close-btn');
  const statusEl = document.getElementById('search-status');
  const listEl = document.getElementById('search-results-list');
  const triggers = [
    document.getElementById('search-trigger'),
    document.getElementById('search-trigger-mobile')
  ].filter(Boolean);

  const lang = modal.dataset.lang || 'zh-cn';
  const indexUrl = modal.dataset.indexUrl || (lang === 'en' ? '/en/index.json' : '/index.json');

  const i18n = {
    loading: lang === 'en' ? 'Loading search index...' : '正在加载搜索索引...',
    ready: lang === 'en' ? 'Type keywords to start offline search' : '输入关键词开始离线全文检索',
    error: lang === 'en' ? 'Failed to load search index.' : '搜索索引加载失败，请稍后重试。',
    noResults: (q) => lang === 'en' ? `No results found for "<strong>${q}</strong>"` : `未找到与 “<strong>${q}</strong>” 相关的文章`
  };

  let searchIndex = null;
  let rawDocuments = [];
  let selectedIndex = -1;
  let isLoaded = false;
  let isLoading = false;

  // Initialize FlexSearch Document Index with high-performance CJK + Latin encoder
  function initSearchEngine(data) {
    rawDocuments = data;

    // CJK characters match regex (matches single CJK ideographs or word-like chunks)
    const regex = /[\u4e00-\u9fa5]|[\w]+/g;
    const encode = function (str) {
      if (!str) return [];
      return ('' + str).toLowerCase().match(regex) || [];
    };

    searchIndex = new FlexSearch.Document({
      tokenize: "forward",
      encode: encode,
      document: {
        id: "id",
        index: ["title", "content", "summary", "tags"],
        store: ["title", "permalink", "date", "summary", "tags"]
      }
    });

    data.forEach((doc, idx) => {
      searchIndex.add({
        id: idx,
        title: doc.title,
        content: doc.content || '',
        summary: doc.summary || '',
        tags: (doc.tags || []).join(' ')
      });
    });

    isLoaded = true;
    isLoading = false;
  }

  // Load search data asynchronously
  async function loadSearchData() {
    if (isLoaded || isLoading) return;
    isLoading = true;
    statusEl.textContent = i18n.loading;

    try {
      const resp = await fetch(indexUrl);
      if (!resp.ok) throw new Error(`HTTP error ${resp.status}`);
      const data = await resp.json();
      initSearchEngine(data);
      statusEl.textContent = i18n.ready;
      if (input.value.trim()) {
        performSearch(input.value.trim());
      }
    } catch (e) {
      isLoading = false;
      statusEl.textContent = i18n.error;
      console.error('[Search] Failed to load search index:', e);
    }
  }

  // Open search modal
  function openSearch() {
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    loadSearchData();
    setTimeout(() => {
      input.focus();
      input.select();
    }, 50);
  }

  // Close search modal
  function closeSearch() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    selectedIndex = -1;
  }

  // Escape HTML entities to prevent XSS in highlighting
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function (m) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[m];
    });
  }

  // Highlight query words in text
  function highlightText(text, query) {
    if (!text || !query) return escapeHtml(text);
    const escapedText = escapeHtml(text);
    const cleanQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${cleanQuery})`, 'gi');
    return escapedText.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  // Generate contextual snippet around matched query
  function getSnippet(content, query, length = 110) {
    if (!content) return '';
    const plain = content.replace(/<[^>]+>/g, '').trim();
    const idx = plain.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) {
      return plain.slice(0, length) + (plain.length > length ? '...' : '');
    }
    const start = Math.max(0, idx - 25);
    const end = Math.min(plain.length, idx + length - 25);
    let snippet = plain.slice(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < plain.length) snippet = snippet + '...';
    return snippet;
  }

  // Execute full-text search
  function performSearch(query) {
    if (!query) {
      listEl.innerHTML = '';
      statusEl.style.display = 'block';
      statusEl.textContent = i18n.ready;
      selectedIndex = -1;
      return;
    }

    if (!isLoaded) {
      statusEl.style.display = 'block';
      statusEl.textContent = i18n.loading;
      return;
    }

    const results = searchIndex.search(query, { limit: 20, enrich: true });
    const matchedIds = new Set();

    results.forEach(fieldRes => {
      if (fieldRes.result) {
        fieldRes.result.forEach(r => {
          const id = typeof r === 'object' && r !== null ? r.id : r;
          if (typeof id === 'number' || typeof id === 'string') {
            matchedIds.add(Number(id));
          }
        });
      }
    });

    if (matchedIds.size === 0) {
      listEl.innerHTML = '';
      statusEl.style.display = 'block';
      statusEl.innerHTML = i18n.noResults(escapeHtml(query));
      selectedIndex = -1;
      return;
    }

    statusEl.style.display = 'none';
    const docs = Array.from(matchedIds).map(id => rawDocuments[id]).filter(Boolean);

    listEl.innerHTML = docs.map((doc, i) => {
      const snippet = getSnippet(doc.content || doc.summary, query);
      const highlightedTitle = highlightText(doc.title, query);
      const highlightedSnippet = highlightText(snippet, query);
      const tagsHtml = (doc.tags || []).map(t => `<span class="search-tag">${escapeHtml(t)}</span>`).join('');

      return `
        <li class="search-result-item" role="option" data-index="${i}">
          <a href="${doc.permalink}" class="search-result-link">
            <div class="search-result-header">
              <span class="search-result-title">${highlightedTitle}</span>
              <span class="search-result-date">${doc.date || ''}</span>
            </div>
            <p class="search-result-snippet">${highlightedSnippet}</p>
            ${tagsHtml ? `<div class="search-result-tags">${tagsHtml}</div>` : ''}
          </a>
        </li>
      `;
    }).join('');

    selectedIndex = 0;
    updateSelection();
  }

  function updateSelection() {
    const items = listEl.querySelectorAll('.search-result-item');
    items.forEach((item, i) => {
      if (i === selectedIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        item.classList.remove('selected');
      }
    });
  }

  // Bind Event Listeners
  triggers.forEach(trigger => {
    trigger.addEventListener('click', openSearch);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeSearch);
  if (backdrop) backdrop.addEventListener('click', closeSearch);

  if (input) {
    input.addEventListener('input', e => {
      performSearch(e.target.value.trim());
    });

    input.addEventListener('keydown', e => {
      const items = listEl.querySelectorAll('.search-result-item');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (items.length > 0) {
          selectedIndex = (selectedIndex + 1) % items.length;
          updateSelection();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (items.length > 0) {
          selectedIndex = (selectedIndex - 1 + items.length) % items.length;
          updateSelection();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          const link = items[selectedIndex].querySelector('a');
          if (link) link.click();
        }
      } else if (e.key === 'Escape') {
        closeSearch();
      }
    });
  }

  // Global Keyboard Shortcuts
  document.addEventListener('keydown', e => {
    const active = document.activeElement;
    const isInputActive = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal.getAttribute('aria-hidden') === 'false') {
        closeSearch();
      } else {
        openSearch();
      }
    } else if (e.key === '/' && !isInputActive) {
      e.preventDefault();
      openSearch();
    } else if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeSearch();
    }
  });

})();
