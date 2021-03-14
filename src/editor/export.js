// @ts-check
import { toUrl } from './canvas.js';

/** @type {HTMLFormElement} */
const sizes = document.querySelector('#exportSizes');
const maxSizeValue = sizes.querySelector('#maxSize');
const sizeInputs = /** @type {NodeListOf<HTMLInputElement>} */ (document.getElementsByName(
  'sizes'
));

const insightsReady = import('/web_modules/insights-js/dist/esnext/index.js');

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
  sizeInputs.forEach((element) => {
    const size = toSize(element.value);
    if (size != undefined) {
      element.disabled = size > maxSize;
    }
  });
}

/**
 * Downloads the current image off the canvas.
 * @param {import('./canvas').CanvasController} controller
 */
async function download(controller) {
  const exportSizes = new FormData(sizes).getAll('sizes').map(toSize);

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
    })
  );

  try {
    const insights = await insightsReady;
    insights.track({
      id: 'export-item',
      parameters: {
        layers: controller.layers.length.toString(),
      },
    });
  } catch (err) {
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
  };
}
