// @ts-check

/**
 * Create a new image from a blob.
 * @param {Blob} blob
 * @returns {Promise<HTMLImageElement>}
 */
async function createImage(blob) {
  const img = new Image();
  img.src = URL.createObjectURL(blob);
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
    Array.from(files).map(async file => {
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
    alpha: src ? 0 : 100,
    locked: false,
    fit: 'contain'
  };
}

export function backgroundLayer() {
  const layer = createLayer('#448AFF');
  layer.locked = true;
  return layer;
}
