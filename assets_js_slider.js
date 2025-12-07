/* Lightweight slider logic */
(function () {
  const slider = document.querySelector('.site-slider');
  if (!slider) return;

  const track = slider.querySelector('.site-slider__track');
  const slides = Array.from(slider.querySelectorAll('.site-slider__slide'));
  const prevBtn = slider.querySelector('.site-slider__nav--prev');
  const nextBtn = slider.querySelector('.site-slider__nav--next');
  const dotsContainer = slider.querySelector('.site-slider__dots');

  let current = 0;
  let autoplay = true;
  let intervalMs = 5000;
  let autoplayId = null;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    const offset = -current * 100;
    track.style.transform = `translateX(${offset}%)`;
    updateDots();
    updateAria();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function updateDots() {
    const dots = Array.from(dotsContainer.children);
    dots.forEach((d, i) => d.setAttribute('aria-selected', String(i === current)));
  }

  function updateAria() {
    slides.forEach((s, i) => {
      s.setAttribute('aria-hidden', String(i !== current));
      s.setAttribute('tabindex', i === current ? '0' : '-1');
    });
  }

  // Create dots
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'site-slider__dot';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', String(i === 0));
    btn.setAttribute('aria-controls', `slide-${i}`);
    btn.addEventListener('click', () => {
      goTo(i);
      pauseAutoplay();
    });
    dotsContainer.appendChild(btn);
  });

  // Set slide IDs for aria-controls
  slides.forEach((s, i) => s.setAttribute('id', `slide-${i}`));

  prevBtn.addEventListener('click', () => { prev(); pauseAutoplay(); });
  nextBtn.addEventListener('click', () => { next(); pauseAutoplay(); });

  // Keyboard navigation
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prev(); pauseAutoplay(); }
    if (e.key === 'ArrowRight') { next(); pauseAutoplay(); }
  });

  // Pause/resume on hover/focus
  slider.addEventListener('mouseenter', pauseAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
  slider.addEventListener('focusin', pauseAutoplay);
  slider.addEventListener('focusout', startAutoplay);

  function startAutoplay() {
    if (!autoplay) return;
    stopAutoplay();
    autoplayId = setInterval(next, intervalMs);
  }
  function stopAutoplay() { if (autoplayId) { clearInterval(autoplayId); autoplayId = null; } }
  function pauseAutoplay() { autoplay = false; stopAutoplay(); }

  // Initialize
  goTo(0);
  startAutoplay();

  // Expose control if needed
  slider.sliderAPI = { next, prev, goTo, startAutoplay, stopAutoplay, pauseAutoplay };
})();