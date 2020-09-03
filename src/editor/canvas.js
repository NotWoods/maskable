// @ts-check

/**
 * @typedef {object} CanvasContainer
 * Wrapper around canvas element with reference to rendering context and size.
 *
 * @prop {HTMLCanvasElement} canvas The referenced canvas element.
 * @prop {CanvasRenderingContext2D} ctx Rendering context for `canvas`.
 * @prop {number} size Width and height of the square `canvas`.
 */

/**
 * Returns the multiplier to scale the `layer` by.
 * For example, if padding is 0% then the return value will be 1.
 * @param {import('./layer.js').Layer} layer
 */
function getScale(layer) {
  return 1 - layer.padding / 100;
}

/**
 * Checks if `img` is an image element containing an SVG image.
 * The data attribute is set in `createImage`.
 *
 * @param {unknown} img Potential image element from the `createImage` function.
 * @returns {img is HTMLImageElement}
 */
function isSvg(img) {
  return (
    img instanceof HTMLImageElement && img.dataset.mime_type === 'image/svg+xml'
  );
}

/**
 * Render layer to given canvas.
 *
 * The canvas will be cleared and the layer will be drawn depending on its
 * various properties.
 *
 * @param {import('./layer.js').Layer} layer Layer to render.
 * @param {CanvasRenderingContext2D} ctx Canvas context.
 * @param {number} size Width and height of the square canvas.
 */
export function drawLayer(layer, ctx, size) {
  ctx.clearRect(0, 0, size, size);
  let width = getScale(layer) * size;
  let height = width;

  ctx.globalCompositeOperation = 'source-over';
  if (layer.src) {
    // If image layer...
    const { height: srcHeight, width: srcWidth } = layer.src;
    const srcRatio = srcWidth / srcHeight;

    if (layer.fit === 'fill') {
      // leave width and height as default
    } else if (layer.fit === 'contain' ? srcRatio > 1 : srcRatio < 1) {
      height = width / srcRatio;
    } else {
      width = height * srcRatio;
    }
    const insetX = ((size - width) / 2) + layer.x;
    const insetY = ((size - height) / 2) + layer.y;

    ctx.globalAlpha = 1;
    ctx.drawImage(layer.src, insetX, insetY, width, height);
    ctx.globalCompositeOperation = 'source-atop';
  }
  const insetX = ((size - width) / 2) + layer.x;
  const insetY = ((size - height) / 2) + layer.y;

  ctx.fillStyle = layer.fill;
  ctx.globalAlpha = layer.alpha / 100;
  ctx.fillRect(insetX, insetY, width, height);
}

/**
 * Creates a blob URL or data URL for the canvas.
 * @param {HTMLCanvasElement} canvas
 * @param {boolean} blob If true, try to return Blob URL.
 */
export async function toUrl(canvas, blob) {
  if (blob && canvas.toBlob) {
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/png')
    );
    return URL.createObjectURL(blob);
  } else {
    // No blob API, fallback to data URL
    return canvas.toDataURL('image/png');
  }
}

/**
 * Create a new canvas element.
 *
 * @param {number} size Width and height of the square canvas element.
 * @param {number} scale Scale factor for the canvas, based on display density.
 * @returns {CanvasContainer}
 */
export function createCanvas(size, scale = 1) {
  const canvas = document.createElement('canvas');
  return scaleCanvas(canvas, size, scale);
}

/**
 * Scale an existing canvas element.
 *
 * @param {HTMLCanvasElement} canvas Canvas element to modify.
 * @param {number} size Width and height of the square canvas element.
 * @param {number} scale Scale factor for the canvas, based on display density.
 * @returns {CanvasContainer}
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
    /**
     * List of layers to render
     * @private
     * @type {import('./layer.js').Layer[]}
     */
    this.layers = [];
    /**
     * Canvases corresponding to each layer
     * @private
     * @type {Map<import('./layer.js').Layer, CanvasContainer[]>}
     */
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
      })
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

  /**
   * Export the layers onto a single canvas
   */
  export() {
    const sizes = this.layers
      .filter((layer) => layer.src && !isSvg(layer.src))
      .map((layer) => {
        const src = /** @type {HTMLImageElement} */ (layer.src);
        return Math.max(src.width, src.height) * (1 / getScale(layer));
      });
    const size =
      sizes.length === 0 ? 1024 : sizes.reduce((acc, n) => Math.max(acc, n), 0);

    const { canvas: mainCanvas, ctx } = createCanvas(size);
    const { canvas: layerCanvas, ctx: layerCtx } = createCanvas(size);

    this.layers
      .slice()
      .reverse()
      .forEach((layer) => {
        drawLayer(layer, layerCtx, size);
        ctx.drawImage(layerCanvas, 0, 0);
      });

    return mainCanvas;
  }

  /**
   * Draw the layer on its corresponding canvases
   * @param {import('./layer.js').Layer} layer
   */
  draw(layer) {
    const canvases = this.canvases.get(layer);
    for (const { ctx, size } of canvases) {
      drawLayer(layer, ctx, size);
    }
  }
}
