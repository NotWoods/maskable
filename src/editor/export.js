import { toUrl } from './canvas.js';

/** @type {HTMLFormElement} */
const sizes = document.querySelector('#exportSizes');
const maxSizeValue = sizes.querySelector('#maxSize');
const sizeInputs = /** @type {NodeListOf<HTMLInputElement>} */ (
  document.getElementsByName('sizes')
);
const jsonPreview = document.querySelector('.mask__json-view__preview');

/**
 * Returns selected sizes
 */
function getFormSizesValues() {
  const exportSizes = new FormData(sizes).getAll('sizes').map(toSize);

  return exportSizes;
}

/**
 * Get the suggested file name for the given maskable icon size.
 * @param {number | undefined} size Size of the maskable icon, or `undefined` for max size.
 */
const fileName = (size) =>
  size != undefined ? `maskable_icon_x${size}.png` : 'maskable_icon.png';

/**
 * @param {File | string} value
 * @returns {number | undefined} Number for one of the checkboxes in the second row,
 * or `undefined` for max size.
 */
function toSize(value) {
  if (value instanceof File) {
    throw new Error();
  }
  const size = parseInt(value, 10);
  if (size > -1) {
    return size;
  } else {
    return undefined;
  }
}

/**
 * Updates Web App Manifest JSON preview based on selected sizes.
 * @param {import('./canvas.js').CanvasController} controller
 */
function updateJsonPreview(controller) {
  const exportSizes = getFormSizesValues().map((size) => {
    const pixelSize = size ?? controller.getSize();
    return {
      purpose: 'maskable',
      sizes: `${pixelSize}x${pixelSize}`,
      src: fileName(size),
      type: 'image/png',
    };
  });

  jsonPreview.textContent = JSON.stringify(exportSizes, null, 2);
}

/**
 * Enables/disables export size checkboxes based on the biggest layer.
 * @param {import('./canvas.js').CanvasController} controller
 */
function updateExportSizes(controller) {
  const maxSize = controller.getSize();

  maxSizeValue.textContent = `${maxSize}x${maxSize}`;
  for (const element of sizeInputs) {
    const size = toSize(element.value);
    if (size != undefined) {
      element.disabled = size > maxSize;
    }
  }
}

/**
 * Downloads the current image off the canvas.
 * @param {import('./canvas.js').CanvasController} controller
 */
async function download(controller) {
  const exportSizes = getFormSizesValues();

  const exported = Promise.all(
    exportSizes.map(async (size) => {
      const url = await toUrl(controller.export(size), true);

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName(size);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    }),
  );

  try {
    const layers = controller.getLayerCount();
    fathom?.trackGoal('exportItem', layers);
  } catch {
    // Blocked by ad blocker
  }
  await exported;
}

/**
 * @param {import('./canvas.js').CanvasController} controller
 */
export function setupExportDialog(controller) {
  /**
   * @param {Event} evt
   */
  function handleSubmit(evt) {
    evt.preventDefault();
    download(controller);
  }

  function handleChange() {
    updateJsonPreview(controller);
  }

  updateExportSizes(controller);
  updateJsonPreview(controller);
  sizes.addEventListener('submit', handleSubmit);
  sizes.addEventListener('change', handleChange);

  return function cleanup() {
    sizes.removeEventListener('submit', handleSubmit);
    sizes.removeEventListener('change', handleChange);

    jsonPreview.textContent = 'Select some size to display the JSON preview';

    // reset form fields
    sizes.reset();
  };
}
