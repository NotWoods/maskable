// @ts-check

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
  focusable.forEach((input) => {
    accessKeys.set(input.accessKey, input);
  });
  return accessKeys;
}

const accessKeys = getAccessKeys();
document.addEventListener('keydown', (evt) => {
  if (evt.repeat) return; // Ignore holding down keys
  const input = accessKeys.get(evt.key);

  if (input) {
    evt.preventDefault();
    input.click();
  }
});
