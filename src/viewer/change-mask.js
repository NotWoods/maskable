// @ts-check
import { applyMask, simpleMasks } from './masks.js';

class MaskManager {
  constructor() {
    this.container = document.querySelector('.masks');
    this.hideMasks();
  }

  /**
   * @type {NodeListOf<HTMLInputElement>}
   */
  get masks() {
    return this.container.querySelectorAll('.mask__option input');
  }

  /**
   * Get hidden masks from storage. Defaults to masks that aren't well supported.
   * @private
   * @returns {readonly string[]}
   */
  getShownMasks() {
    const shownMasks = localStorage.getItem('shownMasks');
    if (shownMasks != undefined) {
      return shownMasks.split(',');
    } else {
      undefined;
    }
  }

  hideMasks() {
    const shownMasks = this.getShownMasks();

    const toShow = new Set(shownMasks ?? simpleMasks);
    for (const mask of this.masks) {
      mask.parentElement.hidden = !toShow.has(mask.value);
    }
  }
}

/** @type {NodeListOf<HTMLElement>} All elements to change the mask of. */
const masked = document.querySelectorAll('.masked');
/** @type {NodeListOf<HTMLElement>} */
const icons = document.querySelectorAll('.icon');

const maskManager = new MaskManager();
maskManager.container.addEventListener('change', (evt) => {
  const radio = /** @type {HTMLInputElement} */ (evt.target);
  if (radio.name === 'mask') {
    applyMask(masked, icons, radio.value);
  }
});
