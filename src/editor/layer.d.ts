/** `CanvasImageSource` variant that has number width/height */
type CanvasImageSourceNum =
  | HTMLImageElement
  | HTMLVideoElement
  | HTMLCanvasElement
  | ImageBitmap
  | OffscreenCanvas;

/**
 * Data class representing a layer that can be drawn onto the canvas.
 */
export interface Layer {
  /**
   * Original image of the layer, unless it's only a color
   */
  src?: CanvasImageSourceNum;
  /**
   * Name of the layer. Defaults to filename.
   */
  name: string;
  /**
   * CSS color used to tint the layer.
   */
  fill: string;
  /**
   * Value from [0-100] representing the layer opacity.
   */
  alpha: number;
  padding: number;
  x: number;
  y: number;
  locked: boolean;
  /**
   * Fit style for image layers. No effect on color layers.
   * - fill:    The image dimensions will match the canvas, discarding the
   *            aspect ratio.
   * - contain: The image will be scaled down so that it is entirely visible.
   * - cover:   The image will be scaled up so that its smaller side matches
   *            the canvas size.
   */
  fit: 'fill' | 'contain' | 'cover';
}

/**
 * Create a list of layers from a list of files
 * @param {Iterable<File>} files
 * @returns {Promise<import("./layer.js").Layer[]>}
 */
export function layersFromFiles(files: Iterable<File>): Promise<Layer[]>;

/**
 * Create a new image or color canvas.
 * @param {string} fill
 * @param {CanvasImageSourceNum} [src]
 * @returns {import("./layer.js").Layer}
 */
export function createLayer(fill: string, src?: CanvasImageSourceNum): Layer;

export function backgroundLayer(): Layer;
