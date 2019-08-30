import('/web_modules/file-drop-element.js');
import('/web_modules/dark-mode-toggle.js');

if ('serviceWorker' in navigator) {
    // Gotta load this somewhere!
    navigator.serviceWorker.register('/sw.js');
}

const toggle = document.querySelector('dark-mode-toggle');
const { body } = document;

// Initialize the toggle based on `prefers-color-scheme`, defaulting to 'light'.
toggle.mode = matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
// Set or remove the `dark` class the first time.
toggle.mode === 'dark'
    ? body.classList.add('dark')
    : body.classList.remove('dark');

// Listen for toggle changes (which includes `prefers-color-scheme` changes)
// and toggle the `dark` class accordingly.
toggle.addEventListener('colorschemechange', () => {
    body.classList.toggle('dark', toggle.mode === 'dark');
});

if (new URL(location.href).searchParams.has('secret')) {
    body.classList.add('show-secrets')
}

import('/web_modules/ganalytics.js').then(({ default: GAnalytics }) => {
    // Initialize Google Analytics
    const ga = GAnalytics('UA-37324002-6', { aid: 1 });
    // Track number of clicks on the "Icon from ..." link
    document.querySelector('.source__link').addEventListener('click', evt => {
        const link = /** @type {HTMLAnchorElement} */ (evt.currentTarget);
        ga.send('event', { ec: 'Source Link', ea: 'click', el: link.href });
    });
});
