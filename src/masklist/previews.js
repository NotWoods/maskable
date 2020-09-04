import Sortable from '/web_modules/sortablejs.js';
import { applyMask } from '../viewer/masks.js';

/** @type {NodeListOf<HTMLElement>} */
const previews = document.querySelectorAll('.mask__preview');
const lists = document.querySelectorAll('.masklist');

previews.forEach((preview) => {
  const maskName = preview.parentElement.dataset.value;
  const success = applyMask([preview], [], maskName);

  if (!success) {
    preview.parentElement.hidden = true;
  }
});

lists.forEach((list) => {
  new Sortable(list, {
    group: 'masklist',
    animation: 150,
    filter: '.locked',
  });
});

document.querySelector('button[name="reset"]').addEventListener('click', () => {
  // TODO clear stored mask settings, then reload
  window.location.reload();
})
