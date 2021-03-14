import { applyMask } from './masks.js';

if ('serviceWorker' in navigator) {
  // Gotta load this somewhere!
  navigator.serviceWorker.register('/sw.js');
}

if (new URL(location.href).searchParams.has('secret')) {
  // Secret masks with poor support
  document.body.classList.add('show-secrets');
}

/** @type {HTMLElement} */
const container = document.querySelector('.icon__grid');
/** @type {NodeListOf<HTMLElement>} All elements to change the mask of. */
const masked = document.querySelectorAll('.masked');
/** @type {NodeListOf<HTMLElement>} */
const icons = document.querySelectorAll('.icon');

document.querySelector('.masks').addEventListener('change', (evt) => {
  const radio = /** @type {HTMLInputElement} */ (evt.target);
  if (radio.name === 'mask') {
    applyMask(masked, icons, radio.value);
  }
});
document.querySelector('.controls').addEventListener('change', (evt) => {
  const checkbox = /** @type {HTMLInputElement} */ (evt.target);
  switch (checkbox.name) {
    case 'shrink': {
      // Shrink the icon to 1/4 size
      const size = checkbox.checked ? '0.25' : '1';
      container.style.transform = `scale(${size})`;
      break;
    }
    case 'ghost':
      // Show ghost image behind icon
      container.classList.toggle('icon--ghost', checkbox.checked);
      break;
  }
});
