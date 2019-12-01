// @ts-check

export const SIZE = 192;
const DPR = devicePixelRatio || 1;
const SCALED_SIZE = SIZE * DPR;

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
 * @param {CanvasImageSource} [src]
 * @returns {import("./layer.js").Layer}
 */
export function createLayer(fill, src) {
  const canvas = document.createElement('canvas');
  canvas.width = SCALED_SIZE;
  canvas.height = SCALED_SIZE;
  canvas.className = 'icon';
  const ctx = canvas.getContext('2d');
  ctx.scale(DPR, DPR);

  return {
    src,
    name: 'Layer',
    fill,
    padding: 0,
    alpha: src ? 0 : 100,
    canvas,
    ctx,
    locked: false,
  };
}

export function backgroundLayer() {
  const layer = createLayer('#448AFF');
  layer.locked = true;
  return layer;
}
