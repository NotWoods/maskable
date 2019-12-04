// @ts-check

/**
 * @typedef {object} CanvasContainer
 * @prop {HTMLCanvasElement} canvas
 * @prop {CanvasRenderingContext2D} ctx
 * @prop {number} size
 */

/**
 * Returns the multiplier to scale the layer by.
 * For example, if padding is 0% then the return value will be 1.
 * @param {import('./layer.js').Layer} layer
 */
const getScale = layer => 1 - layer.padding / 100;

/**
 * @param {import('./layer.js').Layer} layer
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} size
 */
export function drawLayer(layer, ctx, size) {
  ctx.clearRect(0, 0, size, size);
  const scaledSize = getScale(layer) * size;
  ctx.globalCompositeOperation = 'source-over';
  if (layer.src) {
    const { height: srcHeight, width: srcWidth } = layer.src;
    const srcRatio = srcWidth / srcHeight;
    let width = scaledSize;
    let height = scaledSize;

    if (layer.fit === 'fill') {
      // do nothing
    } else if (layer.fit === 'contain' ? srcRatio > 1 : srcRatio < 1) {
      height = width / srcRatio;
    } else {
      width = height * srcRatio;
    }
    const insetX = (size - width) / 2;
    const insetY = (size - height) / 2;

    ctx.globalAlpha = 1;
    ctx.drawImage(layer.src, insetX, insetY, width, height);
    ctx.globalCompositeOperation = 'source-atop';
  }
  const inset = (size - scaledSize) / 2;
  ctx.fillStyle = layer.fill;
  ctx.globalAlpha = layer.alpha / 100;
  ctx.fillRect(inset, inset, scaledSize, scaledSize);
}

/**
 * Creates a blob URL or data URL for the canvas.
 * @param {HTMLCanvasElement} canvas
 */
export async function toUrl(canvas) {
  if (canvas.toBlob) {
    const blob = await new Promise(resolve =>
      canvas.toBlob(resolve, 'image/png'),
    );
    return URL.createObjectURL(blob);
  } else {
    return canvas.toDataURL('image/png');
  }
}

/**
 * Create a new canvas element.
 * @param {number} size
 * @param {number} scale
 */
export function createCanvas(size, scale = 1) {
  const canvas = document.createElement('canvas');
  return scaleCanvas(canvas, size, scale);
}

/**
 * Scale an existing canvas element.
 * @param {HTMLCanvasElement} canvas
 * @param {number} size
 * @param {number} scale
 */
export function scaleCanvas(canvas, size, scale = 1) {
  canvas.width = size * scale;
  canvas.height = size * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  return { canvas, ctx, size };
}

export class CanvasController {
  constructor() {
    /** @type {import('./layer.js').Layer[]} */
    this.layers = [];
    /** @type {Map<import('./layer.js').Layer, CanvasContainer[]>} */
    this.canvases = new Map();
  }

  /**
   * Add a layer and display its canvas
   * @param {import('./layer.js').Layer} layer
   * @param {ReadonlyArray<Pick<CanvasContainer, 'canvas' | 'size'>>} canvases
   */
  add(layer, canvases) {
    this.layers.unshift(layer);
    this.canvases.set(
      layer,
      canvases.map(({ canvas, size }) => {
        return { canvas, size, ctx: canvas.getContext('2d') };
      }),
    );
    this.draw(layer);
  }

  /**
   * Delete a layer and its corresponding canvas
   * @param {import('./layer.js').Layer} layer
   */
  delete(layer) {
    const index = this.layers.indexOf(layer);
    if (index > -1) {
      this.layers.splice(index, 1);
      this.canvases.get(layer).forEach(({ canvas }) => canvas.remove());
      this.canvases.delete(layer);
    }
  }

  export() {
    const sizes = this.layers
      .filter(layer => layer.src)
      .map(layer => {
        const src = /** @type {HTMLImageElement} */ (layer.src);
        return Math.max(src.width, src.height) * getScale(layer);
      });
    const size =
      sizes.length === 0 ? 1024 : sizes.reduce((acc, n) => Math.max(acc, n), 0);

    const { canvas: mainCanvas, ctx } = createCanvas(size);
    const { canvas: layerCanvas, ctx: layerCtx } = createCanvas(size);

    this.layers
      .slice()
      .reverse()
      .forEach(layer => {
        drawLayer(layer, layerCtx, size);
        ctx.drawImage(layerCanvas, 0, 0);
      });

    return mainCanvas;
  }

  /**
   * @param {import('./layer.js').Layer} layer
   */
  draw(layer) {
    const canvases = this.canvases.get(layer);
    for (const { ctx, size } of canvases) {
      drawLayer(layer, ctx, size);
    }
  }
}
