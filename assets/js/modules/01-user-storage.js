/**
 * InyBit Theme — 01-user-storage.js
 * Shared nickname and email management across moments and comments.
 */
(function (window) {
  'use strict';
  window.InyBit = window.InyBit || {};

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  }

  function getSharedUserData() {
    var nick = '';
    var email = '';
    try {
      var artalkUser = JSON.parse(localStorage.getItem('ArtalkUser') || '{}');
      nick = (artalkUser.name || artalkUser.nick || '').trim();
      email = (artalkUser.email || '').trim();
    } catch (e) {}
    if (!nick) {
      nick = (localStorage.getItem('moment_user_nick') || '').trim();
    }
    if (!email) {
      email = (localStorage.getItem('moment_user_email') || '').trim();
    }
    return { nick: nick, email: email };
  }

  function getSharedUserNick() {
    return getSharedUserData().nick;
  }

  function setSharedUserData(nick, email) {
    if (!nick) return;
    nick = nick.trim();
    email = (email || '').trim();
    try {
      localStorage.setItem('moment_user_nick', nick);
      if (email) localStorage.setItem('moment_user_email', email);
      var artalkUser = {};
      try {
        artalkUser = JSON.parse(localStorage.getItem('ArtalkUser') || '{}');
      } catch (e) {}
      artalkUser.name = nick;
      artalkUser.nick = nick;
      if (email) artalkUser.email = email;
      localStorage.setItem('ArtalkUser', JSON.stringify(artalkUser));
    } catch (e) {}
  }

  function setSharedUserNick(nick, email) {
    setSharedUserData(nick, email);
  }

  window.InyBit.isValidEmail = isValidEmail;
  window.InyBit.getSharedUserData = getSharedUserData;
  window.InyBit.getSharedUserNick = getSharedUserNick;
  window.InyBit.setSharedUserData = setSharedUserData;
  window.InyBit.setSharedUserNick = setSharedUserNick;
})(window);
