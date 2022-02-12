import {
  CanvasController,
  createCanvas,
  scaleCanvas,
  toUrl,
} from './canvas.js';
import { DialogManager } from './dialog.js';
import {
  backgroundLayer,
  createLayer,
  layersFromFiles,
  copyLayer,
} from './layer.js';
import { selectLayer, updatePreview } from './options.js';
import { History } from './history.js';

const VIEWER_SIZE = 192;
const PREVIEW_SIZE = 64;
const DPR = devicePixelRatio || 1;

/** @type {HTMLUListElement} */
const list = document.querySelector('.layers__list');
/** @type {HTMLTemplateElement} */
const template = document.querySelector('.layer__template');
/** @type {HTMLFormElement} */
const options = document.querySelector('.options');
/** @type {NodeListOf<HTMLDivElement>} */
const canvasContainers = document.querySelectorAll(
  '.icon__mask, .icon__original'
);

/** @type {import("./history.js").History} */
let history;

/** @type {WeakMap<Element, import("./layer.js").Layer>} */
const layers = new WeakMap();
const controller = new CanvasController();

/** @param {HTMLCanvasElement} preview */
function createCanvases(preview) {
  const viewerCanvases = Array.from(canvasContainers).map((container) => {
    const c = createCanvas(VIEWER_SIZE, DPR);
    c.canvas.className = 'icon';
    container.append(c.canvas);
    return c;
  });

  return viewerCanvases.concat(scaleCanvas(preview, PREVIEW_SIZE, DPR));
}

{
  const background = backgroundLayer();

  /** @type {HTMLCanvasElement} */
  const backgroundPreview = document.querySelector(
    '.layer__preview--background'
  );
  const canvases = createCanvases(backgroundPreview);

  layers.set(
    document.querySelector('input[name="layer"][value="background"'),
    background
  );

  const newLayer = copyLayer(background);

  history = new History(
    newLayer,
    document.querySelector('input[name="layer"][value="background"'),
    0
  );

  controller.add(background, canvases);
}

function checked() {
  /** @type {HTMLInputElement} */
  const radio = list.querySelector('input[name="layer"]:checked');
  return radio;
}

/**
 * Creates a new element representing a layer.
 * @param {import("./layer.js").Layer} layer
 */
function newLayerElement(layer) {
  const randomId = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(2, 10);
  const clone = document.importNode(template.content, true);

  /** @type {HTMLInputElement} */
  const radio = clone.querySelector('input[name="layer"]');
  radio.value = randomId;
  radio.id = randomId;
  radio.checked = true;

  clone.querySelector('label').htmlFor = randomId;

  /** @type {HTMLInputElement} */
  const textInput = clone.querySelector('input[name="name"]');
  textInput.value = layer.name;

  selectLayer(layer);

  const newLayer = copyLayer(layer);
  history.increasePosition();
  history.push(newLayer, radio, 0);

  /** @type {HTMLCanvasElement} */
  const preview = clone.querySelector('.layer__preview');
  const canvases = createCanvases(preview);

  layers.set(radio, layer);
  controller.add(layer, canvases);
  list.prepend(clone);
}

/**
 * Sets the name of a layer based on the value in the text input.
 * @param {HTMLInputElement} textInput
 */
function setLayerName(textInput) {
  const radio = textInput.parentElement.previousElementSibling;
  const layer = layers.get(radio);
  layer.name = textInput.value;
}

selectLayer(layers.get(checked()));

list.addEventListener('change', (evt) => {
  const input = /** @type {HTMLInputElement} */ (evt.target);

  if (input.name === 'layer') {
    selectLayer(layers.get(input));
  } else if (input.name === 'name') {
    setLayerName(input);
  }
});

/** @type {number | undefined} */
let lastHandle;

options.addEventListener('input', (evt) => {
  const input = /** @type {HTMLInputElement} */ (evt.target);

  const layer = layers.get(checked());
  layer[input.name] =
    input.type === 'range' ? Number.parseInt(input.value, 10) : input.value;

  const newLayer = copyLayer(layer);

  const position = controller.getPosition(layer);

  /** @type {import("./layer.js").Layer} */

  history.push(newLayer, input, position);

  cancelAnimationFrame(lastHandle);
  lastHandle = requestAnimationFrame(() => {
    updatePreview(input);
    controller.draw(layer);
  });
});

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'z' && history.isAvailableToPop()) {
    let current = history.pop();
    // also delete layer by looping through the history
    // check if there is any current.position in the array
    if (history.isLastOne(current.position)) {
      const layerToDelete = controller.getLayer(current.position);
      if (layerToDelete.locked) return;
      const radio = current.input;
      const sibling = radio.closest('.layer').nextElementSibling;
      /** @type {HTMLInputElement} */
      const nextRadio = sibling.querySelector('input[name="layer"]');
      nextRadio.checked = true;
      selectLayer(layers.get(nextRadio));

      controller.delete(layerToDelete);
      radio.closest('.layer').remove();
      history.decreasePosition();
    } else if (current.position !== history.getLast().position) {
      current = history.getLastOfPosition(current.position);
      const position = current.position;

      selectLayer(current.layer);

      const layer = controller.getLayer(position);

      Object.assign(layer, current.layer);
      cancelAnimationFrame(lastHandle);
      lastHandle = requestAnimationFrame(() => {
        updatePreview(current.input);
        controller.draw(layer);
      });
    } else {
      const position = history.getLast().position;

      selectLayer(history.getLast().layer);

      const layer = controller.getLayer(position);

      Object.assign(layer, history.getLast().layer);
      cancelAnimationFrame(lastHandle);
      lastHandle = requestAnimationFrame(() => {
        updatePreview(history.getLast().input);
        controller.draw(layer);
      });
    }
  }
});

/** @param {Iterable<File>} files */
async function addFiles(files) {
  // For each selected file, create a layer
  const layers = await layersFromFiles(files);
  // Insert layers after all load so that the order matches upload order
  layers.forEach(newLayerElement);
}

/**
 * Attach click listener to button
 * @param {string} name
 * @param {() => void} listener
 */
function button(name, listener) {
  document
    .querySelector(`button[name="${name}"]`)
    .addEventListener('click', listener);
}

button('add', () => {
  const color = '#' + Math.random().toString(16).substr(-6);
  newLayerElement(createLayer(color));
});
button('delete', () => {
  const radio = checked();
  const layer = layers.get(radio);
  if (layer.locked) return;
  const sibling = radio.closest('.layer').nextElementSibling;
  /** @type {HTMLInputElement} */
  const nextRadio = sibling.querySelector('input[name="layer"]');
  selectLayer(layers.get(nextRadio));
  nextRadio.checked = true;

  const position = controller.getPosition(layer);
  history.removeOnePosition(position);

  controller.delete(layer);
  radio.closest('.layer').remove();
});
button('share', async () => {
  const url = await toUrl(controller.export(), false);
  const params = new URLSearchParams({ demo: url });
  const previewUrl = `https://maskable.app/?${params}`;

  if (navigator.share) {
    navigator.share({
      url: previewUrl,
      title: 'Maskable icon',
    });
  } else {
    window.open(previewUrl, '_blank');
  }
});

if (window.EyeDropper) {
  /** @type {HTMLInputElement} */
  const colorInput = document.querySelector('input[name="fill"]');
  /** @type {HTMLButtonElement} */
  const eyeDropperButton = document.querySelector(`button[name="eyedropper"]`);
  eyeDropperButton.hidden = false;
  const eyeDropper = new window.EyeDropper();

  eyeDropperButton.addEventListener('click', () => {
    eyeDropperButton.style.fill = '#1c7bfd';
    eyeDropper
      .open()
      .then((result) => {
        colorInput.value = result.sRGBHex;
        colorInput.dispatchEvent(new Event('input', { bubbles: true }));
      })
      .finally(() => {
        eyeDropperButton.style.fill = 'currentColor';
      });
  });
}

{
  /** @type {HTMLInputElement} The "Upload" button */
  const fileInput = document.querySelector('.layers [name="upload"]');
  /** @type {import('file-drop-element').FileDropElement} The invisible file drop area */
  const fileDrop = document.querySelector('#icon_drop');

  fileInput.addEventListener('change', () => addFiles(fileInput.files));
  fileDrop.addEventListener('filedrop', (evt) => addFiles(evt.files));
}

for (const element of document.querySelectorAll('.toggle--layers')) {
  element.addEventListener('click', () =>
    document.body.classList.toggle('open')
  );
}

{
  const exportDialog = new DialogManager(
    document.querySelector('.export-dialog')
  );
  /** @type {Promise<void>} */
  let lazyLoadSetupPromise;
  function lazyLoadSetup() {
    if (lazyLoadSetupPromise) return lazyLoadSetupPromise;

    lazyLoadSetupPromise = import('./export.js').then(
      ({ setupExportDialog }) => {
        exportDialog.setupContent = () => setupExportDialog(controller);
      }
    );
    return lazyLoadSetupPromise;
  }

  for (const element of document.querySelectorAll('.toggle--export')) {
    element.addEventListener('mouseover', lazyLoadSetup);
    element.addEventListener('click', async () => {
      await lazyLoadSetup();
      exportDialog.toggleDialog();
    });
  }
}
