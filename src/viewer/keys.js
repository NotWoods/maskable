/**
 * Builds a map of access keys to input elements.
 * Inputs with the `accesskey` HTML attribute will be placed in here.
 * @returns {ReadonlyMap<string, HTMLInputElement>}
 */
function getAccessKeys() {
  /** @type {Map<string, HTMLInputElement>} */
  const accessKeys = new Map();
  /** @type {NodeListOf<HTMLInputElement>} */
  const focusable = document.querySelectorAll('input[accesskey]');
  for (const input of focusable) {
    accessKeys.set(input.accessKey, input);
  }
  return accessKeys;
}

const accessKeys = getAccessKeys();
const masks = /** @type {HTMLCollectionOf<HTMLElement>} */ (
  document.getElementsByClassName('mask__option')
);
document.addEventListener('keydown', (evt) => {
  if (evt.repeat) return; // Ignore holding down keys

  const index = Number(evt.key);

  /** @type {HTMLElement | undefined} */
  let clickable;
  if (Number.isNaN(index)) {
    clickable = accessKeys.get(evt.key);
  } else {
    // Find option using 0-9 access key
    const maskOption = masks[index];
    if (maskOption instanceof HTMLAnchorElement) {
      clickable = maskOption;
    } else if (maskOption) {
      clickable = maskOption.querySelector('input');
    }
  }

  if (clickable) {
    evt.preventDefault();
    clickable.click();
  }
});
