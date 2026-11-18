'use strict';

function readPreference(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writePreference(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // The current page keeps working when preferences cannot be saved.
  }
}

function bindPreferenceSwitch(button, toggle) {
  if (!button) return;

  const ink = button.querySelector('.preference-switch__ripple');
  const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
  let ripple;

  button.addEventListener('click', event => {
    const animate = event.detail > 0 && motion.matches;
    button.classList.toggle('is-pointer-switching', animate);
    toggle();
    ripple?.cancel();
    if (!animate || !ink?.animate) return;

    const bounds = ink.parentElement.getBoundingClientRect();
    ink.style.left = `${Math.max(0, Math.min(bounds.width, event.clientX - bounds.left))}px`;
    ink.style.top = `${Math.max(0, Math.min(bounds.height, event.clientY - bounds.top))}px`;
    ripple = ink.animate([
      { transform: 'translate(-50%, -50%) scale(.16)', opacity: .32 },
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 0 }
    ], { duration: 160, easing: getComputedStyle(button).getPropertyValue('--switch-ease').trim() || 'ease' });
  });
  motion.addEventListener('change', () => ripple?.cancel());
}
