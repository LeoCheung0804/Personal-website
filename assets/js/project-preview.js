'use strict';

(() => {
  const section = document.querySelector('.project-preview');
  const wrapper = section?.querySelector('.project-preview-wrapper');
  const list = section?.querySelector('.project-preview-list');
  const toggle = section?.querySelector('[data-project-preview-toggle]');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!section || !wrapper || !list || !toggle) return;

  const autoplayDelay = 4200;
  const initialAutoplayDelay = 1800;
  let direction = 1;
  let autoplayTimer = null;
  let hasAdvanced = false;
  let userPaused = false;
  let focusPaused = false;
  let pointerPaused = false;
  let sectionVisible = true;

  const hasOverflow = () => wrapper.scrollWidth > wrapper.clientWidth + 2;

  const canAutoplay = () => (
    hasOverflow()
    && !motionQuery.matches
    && !userPaused
    && !focusPaused
    && !pointerPaused
    && sectionVisible
    && !document.hidden
  );

  const clearAutoplay = () => {
    window.clearTimeout(autoplayTimer);
    autoplayTimer = null;
  };

  const updateToggle = () => {
    const autoplayAvailable = hasOverflow() && !motionQuery.matches;
    const labelKey = userPaused ? 'projectPreview.resume' : 'projectPreview.pause';
    const label = typeof getTranslation === 'function'
      ? getTranslation(labelKey)
      : (userPaused ? 'Resume selected work auto-scroll' : 'Pause selected work auto-scroll');
    const icon = toggle.querySelector('ion-icon');

    toggle.hidden = !autoplayAvailable;
    toggle.dataset.paused = String(userPaused);
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
    if (icon) icon.setAttribute('name', userPaused ? 'play-outline' : 'pause-outline');
  };

  const getStops = () => {
    const maxScroll = Math.max(0, wrapper.scrollWidth - wrapper.clientWidth);
    const firstItem = list.firstElementChild;
    const origin = firstItem?.offsetLeft || 0;
    const stops = Array.from(
      list.children,
      (item) => Math.min(Math.max(0, item.offsetLeft - origin), maxScroll),
    );

    return [...new Set([0, ...stops, maxScroll].map((value) => Math.round(value)))]
      .sort((a, b) => a - b);
  };

  const scheduleAutoplay = (delay = hasAdvanced ? autoplayDelay : initialAutoplayDelay) => {
    clearAutoplay();
    if (!canAutoplay()) return;
    autoplayTimer = window.setTimeout(advance, delay);
  };

  const advance = () => {
    if (!canAutoplay()) {
      clearAutoplay();
      return;
    }

    const stops = getStops();
    const current = wrapper.scrollLeft;
    let target;

    if (direction > 0) {
      target = stops.find((stop) => stop > current + 2);
      if (target === undefined) {
        direction = -1;
        target = [...stops].reverse().find((stop) => stop < current - 2);
      }
    } else {
      target = [...stops].reverse().find((stop) => stop < current - 2);
      if (target === undefined) {
        direction = 1;
        target = stops.find((stop) => stop > current + 2);
      }
    }

    if (target !== undefined) {
      hasAdvanced = true;
      wrapper.scrollTo({ left: target, behavior: 'smooth' });
    }

    scheduleAutoplay();
  };

  const pauseForManualInput = () => {
    clearAutoplay();
    userPaused = true;
    updateToggle();
  };

  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    focusPaused = false;
    updateToggle();
    if (userPaused) clearAutoplay();
    else scheduleAutoplay(800);
  });

  section.addEventListener('focusin', (event) => {
    focusPaused = event.target !== toggle;
    if (focusPaused) clearAutoplay();
    else scheduleAutoplay();
  });

  section.addEventListener('focusout', () => {
    window.setTimeout(() => {
      focusPaused = section.contains(document.activeElement) && document.activeElement !== toggle;
      if (!focusPaused) scheduleAutoplay(3000);
    }, 0);
  });

  wrapper.addEventListener('pointerdown', () => {
    pointerPaused = true;
    clearAutoplay();
  });

  const releasePointer = () => {
    if (!pointerPaused) return;
    pointerPaused = false;
    pauseForManualInput();
  };

  window.addEventListener('pointerup', releasePointer);
  window.addEventListener('pointercancel', releasePointer);
  wrapper.addEventListener('wheel', pauseForManualInput, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearAutoplay();
    else scheduleAutoplay();
  });

  const handleMotionPreference = () => {
    clearAutoplay();
    updateToggle();
    scheduleAutoplay();
  };

  if (typeof motionQuery.addEventListener === 'function') {
    motionQuery.addEventListener('change', handleMotionPreference);
  } else {
    motionQuery.addListener(handleMotionPreference);
  }

  window.addEventListener('site-language-change', updateToggle);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      sectionVisible = entry.isIntersecting;
      if (sectionVisible) scheduleAutoplay();
      else clearAutoplay();
    }, { threshold: 0.15 });

    observer.observe(section);
  }

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(() => {
      const maxScroll = Math.max(0, wrapper.scrollWidth - wrapper.clientWidth);
      if (wrapper.scrollLeft > maxScroll) wrapper.scrollLeft = maxScroll;
      updateToggle();
      scheduleAutoplay();
    });

    observer.observe(wrapper);
  }

  updateToggle();
  scheduleAutoplay();
})();
