/// <reference types="types-wm" />

if (window.customElements) {
  import('file-drop-element');
  import('dark-mode-toggle');
}

/** @type {import('dark-mode-toggle').DarkModeToggle} */
const toggle = document.querySelector('dark-mode-toggle');
/** @type {HTMLElement | null} */
const ad = document.querySelector('[data-ea-publisher]');

/**
 * Set or remove the `dark` class on body and ads.
 * @param {boolean} darkMode
 */
function updateDarkModeClasses(darkMode) {
  document.body.classList.toggle('dark', darkMode);
  if (ad) {
    ad.classList.toggle('dark', darkMode);
  }
}

// Initialize the toggle based on `prefers-color-scheme`, defaulting to 'light'.
toggle.mode = matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light';
// Set or remove the `dark` class the first time.
updateDarkModeClasses(toggle.mode === 'dark');
// Listen for toggle changes (which includes `prefers-color-scheme` changes)
// and toggle the `dark` class accordingly.
toggle.addEventListener('colorschemechange', () => {
  updateDarkModeClasses(toggle.mode === 'dark');
});

if (document.monetization && ad) {
  function onMonetizationStart() {
    if (document.monetization.state === 'started') {
      console.log('Payment started, hiding ads');
      ad.hidden = true;
    }
  }
  document.monetization.addEventListener(
    'monetizationstart',
    onMonetizationStart,
  );
}
