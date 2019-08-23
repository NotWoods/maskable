import('/web_modules/file-drop-element.js');
import('/web_modules/dark-mode-toggle.js');

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
