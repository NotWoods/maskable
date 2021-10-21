/** @type {HTMLFormElement} */
const options = document.querySelector('.options');
/** @type {HTMLParagraphElement} */
const backgroundInfo = document.querySelector('.info--background');
/** @type {HTMLParagraphElement} */
const fitInfo = document.querySelector('.info--fit');

/**
 * Return the preview element corresponding to a changing input.
 * @param {HTMLInputElement} input
 * @returns {HTMLSpanElement | HTMLInputElement | undefined}
 */
function findPreview(input) {
  if (input.className === 'control__input') {
    return /** @type {HTMLSpanElement | HTMLInputElement} */ (
      input.nextElementSibling
    );
  } else if (input.className === 'control__preview') {
    // Special case for the "color" input
    return /** @type {HTMLInputElement} */ (input.previousElementSibling);
  } else {
    return undefined;
  }
}

/**
 * Updates the preview span adjacent to an input with the current value.
 * @param {HTMLInputElement} input
 */
export function updatePreview(input) {
  const preview = findPreview(input);
  if (!preview) return;

  const text = input.value + (preview.dataset.suffix || '');
  if (preview instanceof HTMLInputElement) {
    preview.value = text;
  } else {
    preview.textContent = text;
  }
}

/**
 * Sets the selected layer based on a radio element.
 * @param {import("./layer").Layer} layer
 */
export function selectLayer(layer) {
  options.padding.value = layer.padding;
  options.padding.disabled = layer.locked;
  options.x.value = layer.x;
  options.y.value = layer.y;
  for (const input of options.fill) {
    input.value = layer.fill;
  }
  options.alpha.value = layer.alpha;
  options.alpha.disabled = layer.locked;
  options.delete.disabled = layer.locked;
  backgroundInfo.hidden = !layer.locked;
  options.fit[0].disabled = !layer.src;
  fitInfo.hidden = Boolean(layer.src);
  options.rotation.value = layer.rotation;
  updatePreviews();
}

function updatePreviews() {
  const inputs = /** @type {HTMLInputElement[]} */ (
    Array.from(options.elements)
  );
  inputs.forEach(updatePreview);
}

updatePreviews();
