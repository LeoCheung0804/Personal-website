'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }


const reducedMotionQuery = typeof window.matchMedia === "function"
  ? window.matchMedia("(prefers-reduced-motion: reduce)")
  : { matches: false };

function prefersReducedMotion() {
  return reducedMotionQuery.matches;
}

function getMotionTargets(scope, selector) {
  const root = scope && typeof scope.querySelectorAll === "function" ? scope : document;
  const targets = [...root.querySelectorAll(selector)];

  if (root !== document && typeof root.matches === "function" && root.matches(selector)) {
    targets.unshift(root);
  }

  return targets;
}


// motion helpers
function applyRandomFade(scope = document) {
  const fadeItems = getMotionTargets(scope, '.fade-seed');

  fadeItems.forEach((item) => {
    const delay = prefersReducedMotion() ? 0 : 0.1 + Math.random() * 0.5;
    item.style.setProperty('--fade-delay', `${delay.toFixed(2)}s`);
    item.classList.add('fade-ready');
  });
}

function refreshFadeAnimations(scope = document) {
  const fadeItems = getMotionTargets(scope, '.fade-seed.fade-ready');

  fadeItems.forEach((item) => {
    if (prefersReducedMotion()) {
      item.style.setProperty('--fade-delay', '0s');
      return;
    }

    item.classList.remove('fade-ready');
    void item.offsetWidth;
    item.classList.add('fade-ready');
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

    target.addEventListener('mousemove', (event) => {
      if (prefersReducedMotion()) {
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
        if (prefersReducedMotion()) {
          resetPosition();
          return;
        }

        target.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    });

    target.addEventListener('mouseleave', resetPosition);
    target.addEventListener('blur', resetPosition);
  });
}

function destroyTiltCards(scope = document) {
  const tiltCards = getMotionTargets(scope, '.tilt-card');

  tiltCards.forEach((card) => {
    if (card.vanillaTilt && typeof card.vanillaTilt.destroy === 'function') {
      card.vanillaTilt.destroy();
    }

    card.style.removeProperty('transform');
    card.style.removeProperty('will-change');
  });
}

function initTiltCards(scope = document) {
  const tiltCards = getMotionTargets(scope, '.tilt-card');

  if (prefersReducedMotion()) {
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
        max: 8,
        speed: 500,
        glare: true,
        "max-glare": 0.15,
        scale: 1.02,
        reverse: true
      });
    }
  }
}

function refreshMotionEffects(scope = document) {
  applyRandomFade(scope);
  initMagneticButtons(scope);
  initTiltCards(scope);
  refreshFadeAnimations(scope);
}

function handleMotionPreferenceChange() {
  if (prefersReducedMotion()) {
    getMotionTargets(document, '[data-magnetic]').forEach((target) => {
      target.style.removeProperty('transform');
    });
    destroyTiltCards(document);
    applyRandomFade(document);
    return;
  }

  refreshMotionEffects(document);
}

if (typeof reducedMotionQuery.addEventListener === "function") {
  reducedMotionQuery.addEventListener("change", handleMotionPreferenceChange);
} else if (typeof reducedMotionQuery.addListener === "function") {
  reducedMotionQuery.addListener(handleMotionPreferenceChange);
}

document.addEventListener("site:page-activated", (event) => {
  const activePage = event.detail && event.detail.page;

  requestAnimationFrame(() => {
    refreshMotionEffects(activePage || document);
  });
});
