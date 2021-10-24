export class History {
  /**
   * @param {import('./layer.js').Layer} layer
   * @param {HTMLInputElement} input
   * @param {Number} position
   */

  constructor(layer, input, position) {
    /**
     * @type {import("./layer.js").Layer[]}
     */
    this.stack = [];
    this.stack.push(layer);
    /**
     * @type {HTMLInputElement[]}
     */
    this.inputs = [];
    this.inputs.push(input);

    /**
     * @type {Number[]}
     */
    this.positions = [];
    this.positions.push(position);
  }

  /**
   * @param {import("./layer.js").Layer} layer
   * @param {HTMLInputElement} input
   */
  push(layer, input, position) {
    this.stack.push(layer);
    this.inputs.push(input);
    this.positions.push(position);
  }

  pop() {
    return {
      layer: this.stack.pop(),
      input: this.inputs.pop(),
      position: this.positions.pop(),
    };
  }

  getLast() {
    return {
      layer: this.stack[this.stack.length - 1],
      input: this.inputs[this.inputs.length - 1],
      position: this.positions[this.positions.length - 1],
    };
  }

  getLastOfPosition(position) {
    const index = this.positions.lastIndexOf(position);
    return {
      layer: this.stack[index],
      input: this.inputs[index],
      position: this.positions[index],
    };
  }

  increasePosition() {
    // this will be called when new layer is added
    // new layer is added to the front
    this.positions = this.positions.map((pos) => ++pos);
  }

  decreasePosition() {
    // this will be called when a layer is deleted
    this.positions = this.positions.map((pos) => --pos);
  }

  isAvailableToPop() {
    // stack always has at least 1 element
    return this.stack.length > 1;
  }

  isLastOne(position) {
    return this.positions.indexOf(position) === -1;
  }

  removeOnePosition(position) {
    const indexes = [];
    let i = -1;
    while ((i = this.positions.indexOf(position, i + 1)) != -1) {
      indexes.push(i);
    }

    for (let j = indexes.length - 1; j >= 0; j--) {
      this.inputs.splice(indexes[j], 1);
      this.stack.splice(indexes[j], 1);
      this.positions.splice(indexes[j], 1);
    }

    this.positions = this.positions.map((pos) => {
      if (pos > position) pos--;
      return pos;
    });
  }
}
