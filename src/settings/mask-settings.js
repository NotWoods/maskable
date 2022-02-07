// @ts-check

const form = document.querySelector('form');

/**
 * Get shown masks from storage.
 * Also ensures settings page checkboxes match current saved state.
 * @returns {Set<string>}
 */
function loadShownMasks() {
  const savedShownMasks = localStorage.getItem('shownMasks');
  if (savedShownMasks != undefined) {
    const savedHiddenMasksList = new Set(savedShownMasks.split(','));
    /** @type {NodeListOf<HTMLInputElement>} */
    const maskCheckboxes = form['mask'];
    for (const mask of maskCheckboxes) {
      mask.checked = savedHiddenMasksList.has(mask.value);
    }
    return savedHiddenMasksList;
  } else {
    /** @type {NodeListOf<HTMLInputElement>} */
    const checkedMasks = form.querySelectorAll('input[name="mask"]:checked');
    return new Set(Array.from(checkedMasks, (element) => element.value));
  }
}

/**
 * Save shown masks to storage.
 * @param {Iterable<string>} shownMasks
 */
function saveShownMasks(shownMasks) {
  const serialized = Array.from(shownMasks).join(',');
  localStorage.setItem('shownMasks', serialized);
}

const savedMasks = loadShownMasks();

form.addEventListener('change', (event) => {
  const input = /** @type {HTMLInputElement} */ (event.target);
  if (input.name === 'mask') {
    if (input.checked) {
      savedMasks.add(input.value);
    } else {
      savedMasks.delete(input.value);
    }
    saveShownMasks(savedMasks);
  }
});
