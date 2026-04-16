(function() {
  const DESIGN_WIDTH = 1920;
  const viewport = document.querySelector('meta[name=viewport]');

  if (!viewport) {
    return;
  }

  const scale = window.innerWidth / DESIGN_WIDTH;
  viewport.setAttribute(
    'content',
    `width=${DESIGN_WIDTH}, initial-scale=${scale}, minimum-scale=0.2`
  );
})();