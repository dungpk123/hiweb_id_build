(function () {
  'use strict';

  if (window.__hiwebEditorNetworkGuardInstalled) return;
  window.__hiwebEditorNetworkGuardInstalled = true;

  const BLOCK_PATTERNS = [
    'a.ladipage.com/event',
  ];

  const shouldBlock = (input) => {
    const url = String(input || '');
    return BLOCK_PATTERNS.some((pattern) => url.includes(pattern));
  };

  const originalFetch = window.fetch;
  if (typeof originalFetch === 'function') {
    window.fetch = function (input, init) {
      const url = typeof input === 'string' ? input : input?.url;
      if (shouldBlock(url)) {
        return Promise.resolve(new Response('{}', { status: 204, statusText: 'No Content' }));
      }
      return originalFetch.call(this, input, init);
    };
  }

  const originalBeacon = navigator.sendBeacon;
  if (typeof originalBeacon === 'function') {
    navigator.sendBeacon = function (url, data) {
      if (shouldBlock(url)) return true;
      return originalBeacon.call(this, url, data);
    };
  }

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url) {
    this.__hiwebEditorBlockedRequest = shouldBlock(url);
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function () {
    if (this.__hiwebEditorBlockedRequest) {
      try { this.abort(); } catch (_) { }
      return;
    }
    return originalSend.apply(this, arguments);
  };
})();
