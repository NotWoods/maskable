// @ts-check

/** @type {HTMLFormElement} */
const options = document.querySelector('.options');
/** @type {HTMLParagraphElement} */
const backgroundInfo = document.querySelector('.info--background');
/** @type {HTMLParagraphElement} */
const fitInfo = document.querySelector('.info--fit');

/**
 * Updates the preview span adjacent to an input with the current value.
 * @param {HTMLInputElement} input
 */
export function updatePreview(input) {
  if (input.className !== 'control__input') return;
  const preview = /** @type {HTMLSpanElement} */ (input.nextElementSibling);
  preview.textContent = input.value + (preview.dataset.suffix || '');
}

/**
 * Sets the selected layer based on a radio element.
 * @param {import("./layer").Layer} layer
 */
export function selectLayer(layer) {
  options.padding.value = layer.padding;
  options.padding.disabled = layer.locked;
  options.fill.value = layer.fill;
  options.alpha.value = layer.alpha;
  options.alpha.disabled = layer.locked;
  options.delete.disabled = layer.locked;
  backgroundInfo.hidden = !layer.locked;
  options.fit[0].disabled = !layer.src;
  fitInfo.hidden = Boolean(layer.src);
  Array.from(options.elements).forEach(updatePreview);
}

Array.from(options.elements).forEach(updatePreview);
