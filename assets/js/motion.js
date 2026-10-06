'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }


const reducedMotionQuery = typeof window.matchMedia === "function"
  ? window.matchMedia("(prefers-reduced-motion: reduce)")
  : { matches: false };
const hoverPointerQuery = typeof window.matchMedia === "function"
  ? window.matchMedia("(hover: hover) and (pointer: fine)")
  : { matches: false };
const preparedFadeItems = new WeakSet();
let fadeRefreshFrame;

function prefersReducedMotion() {
  return reducedMotionQuery.matches;
}

function allowsPointerMotion() {
  return hoverPointerQuery.matches && !prefersReducedMotion();
}

function getMotionTargets(scope, selector) {
  const root = scope && typeof scope.querySelectorAll === "function" ? scope : document;
  const targets = [...root.querySelectorAll(selector)];

  if (root !== document && typeof root.matches === "function" && root.matches(selector)) {
    targets.unshift(root);
  }

  return targets;
}


// Keep the public helper name for existing consumers; reveals use a predictable
// reading-order stagger and release their transform when the entrance finishes.
function applyRandomFade(scope = document) {
  const fadeItems = getMotionTargets(scope, '.fade-seed');

  fadeItems.forEach((item, index) => {
    item.style.setProperty('--fade-delay', `${Math.min(index * 60, 240)}ms`);

    if (!preparedFadeItems.has(item)) {
      preparedFadeItems.add(item);
      item.addEventListener('animationend', (event) => {
        if (event.target === item && event.animationName === 'fadeUp') {
          item.classList.remove('fade-ready');
        }
      });
      if (!prefersReducedMotion()) item.classList.add('fade-ready');
    }

    if (prefersReducedMotion()) item.classList.remove('fade-ready');
  });
}

function refreshFadeAnimations(scope = document) {
  const fadeItems = getMotionTargets(scope, '.fade-seed');
  applyRandomFade(scope);
  cancelAnimationFrame(fadeRefreshFrame);

  fadeItems.forEach((item) => {
    item.classList.remove('fade-ready');
  });

  if (prefersReducedMotion()) return;

  // Let the whole batch settle before restarting, without per-card layout reads.
  fadeRefreshFrame = requestAnimationFrame(() => {
    fadeRefreshFrame = requestAnimationFrame(() => {
      if (prefersReducedMotion()) return;
      fadeItems.forEach((item) => {
        if (item.isConnected) item.classList.add('fade-ready');
      });
    });
  });
}

function initMagneticButtons(scope = document) {
  const magneticTargets = getMotionTargets(scope, '[data-magnetic]');

  magneticTargets.forEach((target) => {
    if (target.dataset.magneticReady === "true") return;

    target.dataset.magneticReady = "true";
    const strength = parseFloat(target.dataset.magneticStrength || '0.25');
    let rafId;

    const resetPosition = () => {
      cancelAnimationFrame(rafId);
      target.style.removeProperty('transform');
    };

    target.addEventListener('pointermove', (event) => {
      if (!allowsPointerMotion() || event.pointerType === 'touch') {
        resetPosition();
        return;
      }

      const rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      const moveX = (relX / rect.width) * (strength * 60);
      const moveY = (relY / rect.height) * (strength * 60);

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!allowsPointerMotion()) {
          resetPosition();
          return;
        }

        target.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    });

    target.addEventListener('pointerleave', resetPosition);
    target.addEventListener('pointercancel', resetPosition);
    target.addEventListener('blur', resetPosition);
  });
}

function destroyTiltCards(scope = document) {
  const tiltCards = getMotionTargets(scope, '.tilt-card');

  tiltCards.forEach((card) => {
    if (card.vanillaTilt && typeof card.vanillaTilt.destroy === 'function') {
      const tilt = card.vanillaTilt;
      tilt.destroy();
      // VanillaTilt 1.8 resets during destroy and schedules a new transition timeout.
      // Cancel that timeout before it reads the now-released element.
      window.clearTimeout(tilt.transitionTimeout);
    }

    card.style.removeProperty('transform');
    card.style.removeProperty('will-change');
  });
}

function initTiltCards(scope = document) {
  const tiltCards = getMotionTargets(scope, '.tilt-card');

  if (!allowsPointerMotion()) {
    destroyTiltCards(scope);
    return;
  }

  if (window.VanillaTilt && typeof window.VanillaTilt.init === 'function') {
    tiltCards.forEach((card) => {
      if (card.vanillaTilt && typeof card.vanillaTilt.update === 'function') {
        card.vanillaTilt.update();
      }
    });

    const newTiltCards = tiltCards.filter((card) => !card.vanillaTilt);

    if (newTiltCards.length > 0) {
      window.VanillaTilt.init(newTiltCards, {
        max: 3,
        speed: 400,
        glare: false,
        scale: 1.005,
        reverse: true,
        gyroscope: false
      });
    }
  }
}

function refreshMotionEffects(scope = document) {
  initMagneticButtons(scope);
  initTiltCards(scope);
  refreshFadeAnimations(scope);
}

function handleMotionPreferenceChange() {
  if (!allowsPointerMotion()) {
    getMotionTargets(document, '[data-magnetic]').forEach((target) => {
      target.style.removeProperty('transform');
    });
    destroyTiltCards(document);
  }

  if (prefersReducedMotion()) {
    cancelAnimationFrame(fadeRefreshFrame);
    applyRandomFade(document);
  } else {
    initMagneticButtons(document);
    initTiltCards(document);
  }
}

if (typeof reducedMotionQuery.addEventListener === "function") {
  reducedMotionQuery.addEventListener("change", handleMotionPreferenceChange);
} else if (typeof reducedMotionQuery.addListener === "function") {
  reducedMotionQuery.addListener(handleMotionPreferenceChange);
}

if (typeof hoverPointerQuery.addEventListener === "function") {
  hoverPointerQuery.addEventListener("change", handleMotionPreferenceChange);
} else if (typeof hoverPointerQuery.addListener === "function") {
  hoverPointerQuery.addListener(handleMotionPreferenceChange);
}

document.addEventListener("site:page-activated", (event) => {
  const activePage = event.detail && event.detail.page;

  requestAnimationFrame(() => {
    refreshMotionEffects(activePage || document);
  });
});
