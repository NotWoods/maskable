// @ts-check

/**
 * @typedef {object} ColorLayer
 * @prop {'color'} type
 * @prop {string | CanvasGradient | CanvasPattern} fill
 */

/**
 * @typedef {object} ImageLayer
 * @prop {'image'} type
 * @prop {CanvasImageSource} source If string, a color. Otherwise an image.
 * @prop {number} padding Percentage of size representing how much to pad the image.
 */

/** @typedef {ColorLayer | ImageLayer} Layer */

/**
 * Flattens all the layers into a single canvas.
 * @param {Layer[]} layers
 * @param {CanvasRenderingContext2D} out Canvas to draw to.
 */
export function flattenLayers(layers, out) {
    const size = out.canvas.width;
    if (size !== out.canvas.height) {
        console.warn(
            `out canvas is not square. (${out.canvas.width}x${out.canvas.height})`,
        );
    }
    out.clearRect(0, 0, size, size);
    for (const layer of layers) {
        switch (layer.type) {
            case 'color':
                out.fillStyle = layer.fill;
                out.fillRect(0, 0, size, size);
                break;
            case 'image': {
                const pad = size * layer.padding;
                const layerSize = size - pad * 2;
                out.drawImage(layer.source, pad, pad, layerSize, layerSize);
                break;
            }
        }
    }
}
