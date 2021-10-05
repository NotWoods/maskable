export class History {
  /**
   * @param {HTMLInputElement} element
   * @param {import('./layer.js').Layer} layer
   */

  constructor(element, layer) {
    this.element = element;
    /**
     * @type {import("./layer.js").Layer[]}
     */
    this.stack = [];
    this.stack.push(layer);
  }

  /**
   * @param {import("./layer.js").Layer} layer
   */
  pushLayer(layer) {
    this.stack.push(layer);
  }

  popLayer() {
    this.stack.pop();
  }

  getLastLayer() {
    return this.stack[this.stack.length - 1];
  }

  getSecondLastLayer() {
    return this.stack[this.stack.length - 2];
  }

  isAvailableToPop() {
    // stack always has at least 1 element
    return this.stack.length > 1 ? true : false;
  }
}
