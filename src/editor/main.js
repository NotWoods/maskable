// @ts-check

import { createLayer, backgroundLayer, layersFromFiles } from './layer.js';
import { Canvas, toUrl } from './canvas.js';
import { selectLayer, updatePreview } from './options.js';

/** @type {HTMLUListElement} */
const list = document.querySelector('.layers__list');
/** @type {HTMLTemplateElement} */
const template = document.querySelector('.layer__template');
/** @type {HTMLFormElement} */
const options = document.querySelector('.options');

/** @type {WeakMap<Element, import("./layer.js").Layer>} */
const layers = new WeakMap();
const canvas = new Canvas();

const background = backgroundLayer();
layers.set(
  document.querySelector('input[name="layer"][value="background"'),
  background,
);
canvas.add(background);

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

  layers.set(radio, layer);
  canvas.add(layer);
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

list.addEventListener('change', evt => {
  const input = /** @type {HTMLInputElement} */ (evt.target);
  if (input.name === 'layer') {
    selectLayer(layers.get(input));
  } else if (input.name === 'name') {
    setLayerName(input);
  }
});

options.addEventListener('input', evt => {
  const input = /** @type {HTMLInputElement} */ (evt.target);
  if (input.name === 'layer') return;
  updatePreview(input);

  const layer = layers.get(checked());
  layer[input.name] =
    input.name === 'fill' ? input.value : Number.parseInt(input.value, 10);
  if (input.name === 'padding') {
    Canvas.scale(layer);
  }
});

options.addEventListener('change', evt => {
  const input = /** @type {HTMLInputElement} */ (evt.target);
  if (input.name === 'layer') return;

  const layer = layers.get(checked());
  Canvas.draw(layer);
});

/** @param {Iterable<File>} files */
async function addFiles(files) {
  // For each selected file, create a layer
  const layers = await layersFromFiles(files);
  // Insert layers after all load so that the order matches upload order
  layers.forEach(newLayerElement);
}

document.querySelector('button[name="add"]').addEventListener('click', () => {
  const color =
    '#' +
    Math.random()
      .toString(16)
      .substr(-6);
  newLayerElement(createLayer(color));
});
document
  .querySelector('button[name="delete"]')
  .addEventListener('click', () => {
    const radio = checked();
    const layer = layers.get(radio);
    if (layer.locked) return;
    canvas.delete(layer);
    radio.closest('.layer').remove();
  });
document
  .querySelector('button[name="export"]')
  .addEventListener('click', async () => {
    const url = await toUrl(canvas.export());

    let a = document.createElement('a');
    a.href = url;
    a.download = 'maskable_icon.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });

/** @type {HTMLInputElement} The "Upload" button */
const fileInput = document.querySelector('.layers [name="upload"]');
/** @type {import('file-drop-element').FileDropElement} The invisible file drop area */
const fileDrop = document.querySelector('#icon_drop');

fileInput.addEventListener('change', () => addFiles(fileInput.files));
fileDrop.addEventListener('filedrop', evt => addFiles(evt.files));
