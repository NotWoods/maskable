export interface Layer {
  /** Original image of the layer, unless it's only a color */
  src?: CanvasImageSource;
  name: string;
  fill: string;
  alpha: number;
  padding: number;
  locked: boolean;
}

/**
 * Create a list of layers from a list of files
 * @param {Iterable<File>} files
 * @returns {Promise<import("./layer.js").Layer[]>}
 */
export function layersFromFiles(files: Iterable<File>): Promise<Layer[]>

/**
 * Create a new image or color canvas.
 * @param {string} fill
 * @param {CanvasImageSource} [src]
 * @returns {import("./layer.js").Layer}
 */
export function createLayer(fill: string, src?: CanvasImageSource): Layer

export function backgroundLayer(): Layer
