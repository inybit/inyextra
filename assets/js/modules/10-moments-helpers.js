/**
 * InyBit Theme — 10-moments-helpers.js
 * Helpers for WeChat Moments local comments persistence, rendering and Artalk sync.
 */
(function (window) {
  'use strict';
  window.InyBit = window.InyBit || {};

  function getLocalComments() {
    try {
      return JSON.parse(localStorage.getItem('moment_local_comments') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveLocalComment(item) {
    if (!item) return;
    var list = getLocalComments();
    list.push(item);
    try {
      localStorage.setItem('moment_local_comments', JSON.stringify(list));
    } catch (e) {}
  }

  function updateLocalCommentRealId(tempId, realId) {
    if (!tempId || !realId) return;
    var list = getLocalComments();
    var updated = false;
    list.forEach(function (c) {
      if (String(c.id) === String(tempId) || String(c.tempId) === String(tempId)) {
        c.realId = String(realId);
        c.isPending = false;
        updated = true;
      }
    });
    if (updated) {
      try {
        localStorage.setItem('moment_local_comments', JSON.stringify(list));
      } catch (e) {}
    }
  }

  function updateLikesDisplay(momentId, defaultLikesArr, isLikedByUser, onlineLikers) {
    var likesRow = document.getElementById('likes-row-' + momentId);
    var namesEl = document.getElementById('likes-names-' + momentId);
    if (!likesRow || !namesEl) return;

    var currentNames = defaultLikesArr.slice();
    var currentUser = (window.InyBit.getSharedUserData) ? window.InyBit.getSharedUserData() : { nick: '我' };
    var userNick = currentUser.nick || '我';

    (onlineLikers || []).forEach(function (liker) {
      if (liker && currentNames.indexOf(liker) === -1) {
        currentNames.push(liker);
      }
    });

    if (isLikedByUser) {
      if (currentNames.indexOf(userNick) === -1 && currentNames.indexOf('我') === -1) {
        currentNames.push(userNick);
      }
    } else {
      currentNames = currentNames.filter(function (n) { return n !== userNick && n !== '我'; });
    }

    if (currentNames.length > 0) {
      namesEl.textContent = currentNames.join('，');
      likesRow.style.display = 'flex';
    } else {
      namesEl.textContent = '';
      likesRow.style.display = 'none';
    }
  }

  function appendCommentItem(commentsListEl, nick, text, commentId, isNew, isPending) {
    if (!commentsListEl || !text) return;
    if (commentId && commentsListEl.querySelector('[data-comment-id="' + commentId + '"]')) {
      return;
    }

    var item = document.createElement('div');
    item.className = 'moment-comment-item' + (isNew ? ' moment-new-comment' : '');
    if (commentId) item.setAttribute('data-comment-id', commentId);

    var textWrap = document.createElement('div');
    textWrap.className = 'moment-comment-text-wrap';

    var authorSpan = document.createElement('span');
    authorSpan.className = 'comment-author';
    authorSpan.textContent = (nick || '访客') + ': ';

    var textSpan = document.createElement('span');
    textSpan.className = 'comment-text';
    textSpan.textContent = text;

    textWrap.appendChild(authorSpan);
    textWrap.appendChild(textSpan);

    if (isPending) {
      var pendingSpan = document.createElement('span');
      pendingSpan.className = 'comment-pending-badge';
      pendingSpan.textContent = '(审核中)';
      pendingSpan.title = '评论提交成功，正在等待审核，刷新后依然可见';
      textWrap.appendChild(pendingSpan);
    }

    item.appendChild(textWrap);
    commentsListEl.appendChild(item);
    commentsListEl.style.display = 'flex';
  }

  function renderAllComments(commentsList, initialNodes, backendComments, pageKey) {
    if (!commentsList) return;
    backendComments = backendComments || [];
    commentsList.innerHTML = '';
    (initialNodes || []).forEach(function (n) { commentsList.appendChild(n); });

    var allItems = [];

    backendComments.forEach(function (c) {
      var content = (c.content || '').trim();
      if (content !== '[LIKE]' && content !== '[赞]') {
        var parsedTime = c.date ? new Date(c.date.replace(/-/g, '/')).getTime() : 0;
        allItems.push({
          id: c.id,
          nick: c.nick,
          text: c.content,
          time: parsedTime || (typeof c.id === 'number' ? c.id * 1000 : 0),
          isPending: false
        });
      }
    });

    var localList = getLocalComments();
    var pendingList = [];
    localList.forEach(function (lc) {
      if (lc.pageKey === pageKey) {
        var alreadyInBackend = allItems.some(function (item) {
          return (lc.realId && String(item.id) === String(lc.realId)) ||
                 (item.nick === lc.nick && item.text === lc.text);
        });
        if (!alreadyInBackend) {
          pendingList.push({
            id: lc.id,
            nick: lc.nick,
            text: lc.text,
            time: lc.time || Date.now(),
            isPending: true
          });
        }
      }
    });

    allItems.sort(function (a, b) { return (a.time || 0) - (b.time || 0); });
    pendingList.sort(function (a, b) { return (a.time || 0) - (b.time || 0); });

    var totalCount = (initialNodes || []).length;
    allItems.concat(pendingList).forEach(function (item) {
      appendCommentItem(commentsList, item.nick, item.text, item.id, false, item.isPending);
      totalCount++;
    });

    commentsList.style.display = totalCount > 0 ? 'flex' : 'none';
  }

  function postMomentToArtalk(server, site, key, title, url, nick, email, content, onId) {
    if (!server) return;
    fetch(server + '/api/v2/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nick,
        email: email,
        content: content,
        page_key: key,
        page_title: title,
        page_url: url,
        site_name: site
      })
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data && data.id && typeof onId === 'function') {
        onId(data.id);
      }
    })
    .catch(function () {});
  }

  window.InyBit.momentsHelpers = {
    getLocalComments: getLocalComments,
    saveLocalComment: saveLocalComment,
    updateLocalCommentRealId: updateLocalCommentRealId,
    updateLikesDisplay: updateLikesDisplay,
    appendCommentItem: appendCommentItem,
    renderAllComments: renderAllComments,
    postMomentToArtalk: postMomentToArtalk
  };
})(window);
