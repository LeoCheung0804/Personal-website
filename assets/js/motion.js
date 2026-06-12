'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// motion helpers
function applyRandomFade() {
  const fadeItems = document.querySelectorAll('.fade-seed');

  fadeItems.forEach((item) => {
    const delay = 0.1 + Math.random() * 0.5;
    item.style.setProperty('--fade-delay', `${delay.toFixed(2)}s`);
    item.classList.add('fade-ready');
  });
}

function refreshFadeAnimations() {
  const fadeItems = document.querySelectorAll('.fade-seed.fade-ready');

  fadeItems.forEach((item) => {
    item.classList.remove('fade-ready');
    void item.offsetWidth;
    item.classList.add('fade-ready');
  });
}

function initMagneticButtons() {
  const magneticTargets = document.querySelectorAll('[data-magnetic]');

  magneticTargets.forEach((target) => {
    if (target.dataset.magneticReady === "true") return;

    target.dataset.magneticReady = "true";
    const strength = parseFloat(target.dataset.magneticStrength || '0.25');
    let rafId;

    target.addEventListener('mousemove', (event) => {
      const rect = target.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      const moveX = (relX / rect.width) * (strength * 60);
      const moveY = (relY / rect.height) * (strength * 60);

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        target.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    });

    target.addEventListener('mouseleave', () => {
      cancelAnimationFrame(rafId);
      target.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}

function initTiltCards() {
  if (window.VanillaTilt && typeof window.VanillaTilt.init === 'function') {
    const tiltCards = [...document.querySelectorAll('.tilt-card')].filter((card) => !card.vanillaTilt);

    VanillaTilt.init(tiltCards, {
      max: 8,
      speed: 500,
      glare: true,
      "max-glare": 0.15,
      scale: 1.02,
      reverse: true
    });
  }
}
