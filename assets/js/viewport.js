(function() {
  const DESIGN_WIDTH = 1920;
  const viewport = document.querySelector('meta[name=viewport]');

  if (!viewport) {
    return;
  }

  const isMobileLayout = window.matchMedia('(max-width: 1199px)').matches;

  if (isMobileLayout) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    return;
  }

  const scale = window.innerWidth / DESIGN_WIDTH;
  viewport.setAttribute(
    'content',
    `width=${DESIGN_WIDTH}, initial-scale=${scale}, minimum-scale=0.2`
  );
})();