/** @type {HTMLFormElement} */
const options = document.querySelector('.options');

/**
 * Updates the preview span adjacent to an input with the current value.
 * @param {HTMLInputElement} input
 */
function updatePreview(input) {
  const preview = /** @type {HTMLSpanElement} */ (input.nextElementSibling);
  preview.textContent = input.value + (preview.dataset.suffix || '');
}

Array.from(options.elements).forEach(updatePreview);
options.addEventListener('input', evt => {
  const input = /** @type {HTMLInputElement} */ (evt.target);
  updatePreview(input);
});
