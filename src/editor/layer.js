/**
 * `CanvasImageSource` variant that has number width/height
 * @typedef {HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas} CanvasImageSourceNum
 */

/**
 * Data class representing a layer that can be drawn onto the canvas.
 * @typedef {object} Layer
 * @property {CanvasImageSourceNum} [src] Original image of the layer, unless it's only a color
 * @property {string} name Name of the layer. Defaults to filename.
 * @property {string} fill CSS color used to tint the layer.
 * @property {number} alpha Value from [0 - 100] representing the layer opacity.
 * @property {number} padding Padding around the layer.
 * @property {number} x Value from [-200 - 200] representing the x offset percentage.
 * @property {number} y Value from [-200 - 200] representing the y offset percentage.
 * @property {boolean} locked Whether the layer is locked and cannot be edited.
 * @property {number} rotation Value from [0 - 360] representing the layer rotation.
 * @property {'fill' | 'contain' | 'cover'} fit Fit style for image layers. No effect on color layers.
 * - fill:    The image dimensions will match the canvas, discarding the
 *            aspect ratio.
 * - contain: The image will be scaled down so that it is entirely visible.
 * - cover:   The image will be scaled up so that its smaller side matches
 *            the canvas size.
 */

/**
 * Create a new image from a blob.
 *
 * @param {File} source
 * @returns {Promise<HTMLImageElement>}
 */
async function createImage(source) {
  const img = new Image();
  img.src = URL.createObjectURL(source);
  img.dataset.mime_type = source.type;
  await img.decode();
  URL.revokeObjectURL(img.src);
  return img;
}

/**
 * Create a list of layers from a list of files
 * @param {Iterable<File>} files
 * @returns {Promise<Layer[]>}
 */
export async function layersFromFiles(files) {
  return Promise.all(
    Array.from(files).map(async (file) => {
      const img = await createImage(file);
      const layer = createLayer('#ffffff', img);
      layer.name = file.name;
      return layer;
    }),
  );
}

/**
 * Create a new image or color canvas.
 * @param {string} fill
 * @param {CanvasImageSourceNum} [src]
 * @returns {Layer}
 */
export function createLayer(fill, src) {
  return {
    src,
    name: 'Layer',
    fill,
    padding: 0,
    x: 0,
    y: 0,
    rotation: 0,
    alpha: src ? 0 : 100,
    locked: false,
    fit: 'contain',
  };
}

export function backgroundLayer() {
  const layer = createLayer('#448AFF');
  layer.locked = true;
  return layer;
}

/**
 * @param {Layer} layer
 * @returns {Layer}
 */
export function copyLayer(layer) {
  return {
    src: layer.src,
    name: layer.name,
    fill: layer.fill,
    padding: layer.padding,
    x: layer.x,
    y: layer.y,
    rotation: layer.rotation,
    alpha: layer.alpha,
    locked: layer.locked,
    fit: layer.fit,
  };
}
