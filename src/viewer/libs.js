if (window.customElements) {
  import('/web_modules/file-drop-element.js');
  import('/web_modules/dark-mode-toggle.js');
}

const toggle = document.querySelector('dark-mode-toggle');
const ad = document.querySelector('[data-ea-publisher]');

/**
 * Set or remove the `dark` class on body and ads.
 * @param {boolean} darkMode
 */
function updateDarkModeClasses(darkMode) {
  document.body.classList.toggle('dark', darkMode);
  ad.classList.toggle('dark', darkMode)
}

// Initialize the toggle based on `prefers-color-scheme`, defaulting to 'light'.
toggle.mode = matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light';
// Set or remove the `dark` class the first time.
updateDarkModeClasses(toggle.mode === 'dark')
// Listen for toggle changes (which includes `prefers-color-scheme` changes)
// and toggle the `dark` class accordingly.
toggle.addEventListener('colorschemechange', () => {
  updateDarkModeClasses(toggle.mode === 'dark');
});

if (document.monetization) {
  document.monetization.addEventListener('monetizationstart', () => {
    if (document.monetization.state === 'started') {
      console.log('Payment started, hiding ads');
      ad.hidden = true;
    }
  });
}

import('/web_modules/insights-js/dist/esnext/index.js').then((insights) => {
  insights.init('qspST8ZECeI0JEFM');
  insights.trackPages();

  // Track number of clicks on the "Icon from..." link
  const source = document.querySelector('.source__link');
  if (!source) return;
  source.addEventListener('click', (evt) => {
    const link = /** @type {HTMLAnchorElement} */ (evt.currentTarget);
    insights.track({
      id: 'view-item',
      parameters: { id: link.href },
    });
  });
});
