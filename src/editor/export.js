import { toUrl } from './canvas.js';

/** @type {HTMLFormElement} */
const sizes = document.querySelector('#exportSizes');
const maxSizeValue = sizes.querySelector('#maxSize');
const sizeInputs = /** @type {NodeList} */ (
  document.getElementsByName('sizes')
);
const jsonPreview = document.querySelector('.mask__json-view__preview');

sizeInputs.forEach((inputSize) => {
  inputSize.addEventListener('change', handleClickSizeOption);
});

/**
 * Returns selected sizes
 */
function getFormSizesValues() {
  const exportSizes = new FormData(sizes).getAll('sizes').map(toSize);

  return exportSizes;
}

function handleClickSizeOption() {
  const exportSizes = getFormSizesValues()
    .filter((size) => !!size)
    .map((size) => ({
      src: `maskable_icon_x${size}.png`,
      type: 'image/png',
      sizes: `${size}x${size}`,
    }));

  jsonPreview.textContent = JSON.stringify(exportSizes, null, 2);
}

/**
 * @param {File | string} value
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
 * Enables/disables export size checkboxes based on the biggest layer.
 * @param {import('./canvas').CanvasController} controller
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
 * @param {import('./canvas').CanvasController} controller
 */
async function download(controller) {
  const exportSizes = getFormSizesValues();

  const exported = Promise.all(
    exportSizes.map(async (size) => {
      const url = await toUrl(controller.export(size), true);

      const a = document.createElement('a');
      a.href = url;
      a.download =
        size != undefined ? `maskable_icon_x${size}.png` : 'maskable_icon.png';
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
 * @param {import('./canvas').CanvasController} controller
 */
export function setupExportDialog(controller) {
  /**
   * @param {Event} evt
   */
  function handleSubmit(evt) {
    evt.preventDefault();
    download(controller);
  }

  updateExportSizes(controller);
  sizes.addEventListener('submit', handleSubmit);

  return function cleanup() {
    sizes.removeEventListener('submit', handleSubmit);

    jsonPreview.textContent = 'Select some size to display the JSON preview';

    // reset form fields
    sizes.reset();
  };
}
