if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // The learning page remains usable even when offline support cannot be registered.
    });
  });
}

