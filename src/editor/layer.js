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
 * @returns {Promise<import("./layer.js").Layer[]>}
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
 * @param {import("./layer.js").CanvasImageSourceNum} [src]
 * @returns {import("./layer.js").Layer}
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
 *
 * @param {import("./layer.js").Layer} layer
 * @returns {import("./layer.js").Layer}
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
