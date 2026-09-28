/**
 * InyBit Theme — 11-moments-feed.js
 * WeChat Moments Feed Interactivity (Likes, Comments & Artalk API Sync).
 */
(function (window) {
  'use strict';
  window.InyBit = window.InyBit || {};

  function initMomentsInteractions() {
    var container = document.querySelector('.moments-page-container');
    var artalkServer = (container && container.getAttribute('data-artalk-server')) || '';
    var siteName = (container && container.getAttribute('data-artalk-site')) || 'Blog';

    var momentCards = document.querySelectorAll('.moment-card');
    if (!momentCards.length) return;

    var modalController = window.InyBit.momentsModal || (window.InyBit.initMomentsModal && window.InyBit.initMomentsModal());
    var helpers = window.InyBit.momentsHelpers || {};
    var saveLocalComment = helpers.saveLocalComment || function () {};
    var updateLocalCommentRealId = helpers.updateLocalCommentRealId || function () {};
    var updateLikesDisplay = helpers.updateLikesDisplay || function () {};
    var renderAllComments = helpers.renderAllComments || function () {};
    var postToArtalk = helpers.postMomentToArtalk || function () {};
    var getSharedUserData = window.InyBit.getSharedUserData || function () { return { nick: '', email: '' }; };
    var setSharedUserData = window.InyBit.setSharedUserData || function () {};
    var isValidEmail = window.InyBit.isValidEmail || function () { return true; };

    momentCards.forEach(function (card) {
      var momentId = card.getAttribute('data-moment-id');
      var pageKey = card.getAttribute('data-page-key') || ('/moments/' + momentId + '/');
      var momentTitle = card.getAttribute('data-moment-title') || ('朋友圈 - ' + momentId);
      var pageUrl = card.getAttribute('data-page-url') || (window.location.origin + pageKey);

      var actionTrigger = card.querySelector('.moment-action-trigger');
      var popover = card.querySelector('.moment-action-popover');
      var likeBtn = card.querySelector('.like-btn');
      var commentBtn = card.querySelector('.comment-btn');
      var commentBar = document.getElementById('comment-bar-' + momentId);
      var commentsList = document.getElementById('comments-list-' + momentId);
      var initialNodes = commentsList ? Array.from(commentsList.querySelectorAll('.initial-comment')) : [];
      var likesRow = document.getElementById('likes-row-' + momentId);
      var defaultLikesAttr = (likesRow && likesRow.querySelector('.likes-names'))
        ? likesRow.querySelector('.likes-names').getAttribute('data-default-likes') || ''
        : '';
      var defaultLikesArr = defaultLikesAttr ? defaultLikesAttr.split(',').filter(Boolean) : [];

      var isLiked = localStorage.getItem('moment_liked_' + momentId) === 'true';
      card._onlineLikers = [];
      card._pageId = null;

      updateLikesDisplay(momentId, defaultLikesArr, isLiked, []);

      function refreshComments(backendComments) {
        renderAllComments(commentsList, initialNodes, backendComments, pageKey);
      }

      if (artalkServer) {
        fetch(artalkServer + '/api/v2/comments?page_key=' + encodeURIComponent(pageKey) + '&site_name=' + encodeURIComponent(siteName) + '&limit=100&offset=0')
          .then(function (res) { return res.json(); })
          .then(function (data) {
            var backendComments = (data && data.comments) ? data.comments : [];
            card._backendComments = backendComments;
            var onlineLikers = [];

            backendComments.forEach(function (c) {
              var content = (c.content || '').trim();
              if ((content === '[LIKE]' || content === '[赞]') && c.nick && onlineLikers.indexOf(c.nick) === -1) {
                onlineLikers.push(c.nick);
              }
            });

            refreshComments(backendComments);
            card._onlineLikers = onlineLikers;
            if (data && data.page && data.page.id) card._pageId = data.page.id;
            updateLikesDisplay(momentId, defaultLikesArr, isLiked, onlineLikers);
          })
          .catch(function () {
            refreshComments([]);
            updateLikesDisplay(momentId, defaultLikesArr, isLiked, []);
          });
      } else {
        refreshComments([]);
        updateLikesDisplay(momentId, defaultLikesArr, isLiked, []);
      }

      if (actionTrigger && popover) {
        actionTrigger.addEventListener('click', function (e) {
          e.stopPropagation();
          document.querySelectorAll('.moment-action-popover').forEach(function (p) {
            if (p !== popover) {
              p.classList.remove('active');
              p.classList.remove('is-active');
            }
          });
          popover.classList.toggle('is-active');
          popover.classList.toggle('active');
        });
      }

      if (likeBtn) {
        var likeLabel = likeBtn.querySelector('.like-btn-label');
        if (isLiked) {
          likeBtn.classList.add('is-liked');
          if (likeLabel) likeLabel.textContent = '已赞';
        } else if (likeLabel) {
          likeLabel.textContent = '赞';
        }

        likeBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          if (popover) {
            popover.classList.remove('active');
            popover.classList.remove('is-active');
          }
          if (isLiked) return;

          var userData = getSharedUserData();
          if (!userData.nick || !userData.email || !isValidEmail(userData.email)) {
            if (modalController) {
              modalController.open(function (nick, email) { executeLike(nick, email); });
            } else {
              var n = prompt('请输入昵称（必填）：', userData.nick || '');
              var em = prompt('请输入邮箱（必填）：', userData.email || '');
              if (n && n.trim() && em && isValidEmail(em.trim())) {
                setSharedUserData(n.trim(), em.trim());
                executeLike(n.trim(), em.trim());
              }
            }
            return;
          }

          executeLike(userData.nick, userData.email);

          function executeLike(nick, email) {
            isLiked = true;
            localStorage.setItem('moment_liked_' + momentId, 'true');
            likeBtn.classList.add('is-liked');
            if (likeLabel) likeLabel.textContent = '已赞';

            var heartIcon = likesRow ? likesRow.querySelector('.heart-icon') : null;
            if (heartIcon) {
              heartIcon.classList.remove('heart-beat');
              void heartIcon.offsetWidth;
              heartIcon.classList.add('heart-beat');
            }

            if (card._onlineLikers.indexOf(nick) === -1) card._onlineLikers.push(nick);
            updateLikesDisplay(momentId, defaultLikesArr, isLiked, card._onlineLikers);

            postToArtalk(artalkServer, siteName, pageKey, momentTitle, pageUrl, nick, email, '[LIKE]', function (id) {
              localStorage.setItem('moment_like_comment_id_' + momentId, String(id));
            });

            if (artalkServer && card._pageId) {
              fetch(artalkServer + '/api/v2/votes/page/' + card._pageId + '/up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: nick, email: email })
              }).catch(function () {});
            }
          }
        });
      }

      if (commentBtn && commentBar) {
        commentBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          if (popover) {
            popover.classList.remove('active');
            popover.classList.remove('is-active');
          }

          var isClosed = commentBar.style.display === 'none' || !commentBar.style.display;
          commentBar.style.display = isClosed ? 'block' : 'none';

          if (isClosed) {
            var nickInput = commentBar.querySelector('.moment-input-nick');
            var emailInput = commentBar.querySelector('.moment-input-email');
            var textInput = commentBar.querySelector('.moment-input-text');
            var userData = getSharedUserData();

            if (nickInput && userData.nick) nickInput.value = userData.nick;
            if (emailInput && userData.email) emailInput.value = userData.email;

            if (!userData.nick && nickInput) nickInput.focus();
            else if (!userData.email && emailInput) emailInput.focus();
            else if (textInput) textInput.focus();
          }
        });
      }

      if (commentBar) {
        var form = commentBar.querySelector('.moment-comment-form');
        var nickIn = commentBar.querySelector('.moment-input-nick');
        var emailIn = commentBar.querySelector('.moment-input-email');
        var textIn = commentBar.querySelector('.moment-input-text');

        if (form && textIn) {
          form.addEventListener('submit', function (e) {
            e.preventDefault();
            var text = textIn.value.trim();
            var nick = nickIn ? nickIn.value.trim() : '';
            var email = emailIn ? emailIn.value.trim() : '';

            if (!nick) {
              if (nickIn) nickIn.focus();
              alert('请填写昵称');
              return;
            }
            if (!email || !isValidEmail(email)) {
              if (emailIn) emailIn.focus();
              alert('请填写有效的邮箱地址');
              return;
            }
            if (!text) {
              textIn.focus();
              return;
            }

            setSharedUserData(nick, email);

            var tempId = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
            saveLocalComment({
              id: tempId,
              tempId: tempId,
              pageKey: pageKey,
              nick: nick,
              text: text,
              time: Date.now(),
              isPending: true
            });

            refreshComments(card._backendComments || []);

            postToArtalk(artalkServer, siteName, pageKey, momentTitle, pageUrl, nick, email, text, function (id) {
              updateLocalCommentRealId(tempId, id);
            });

            textIn.value = '';
            commentBar.style.display = 'none';
          });
        }
      }
    });

    document.addEventListener('click', function () {
      document.querySelectorAll('.moment-action-popover').forEach(function (p) {
        p.classList.remove('active');
        p.classList.remove('is-active');
      });
    });
  }

  window.InyBit.initMoments = initMomentsInteractions;
})(window);
