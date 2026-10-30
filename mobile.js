/* Progressive enhancement: the website remains usable without a service worker. */
(() => {
  if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .catch((error) => console.info('Offline support unavailable:', error));
  });
})();
