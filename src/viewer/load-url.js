import { DialogManager } from './dialog';

const urlDialog = new DialogManager(document.querySelector('.url-dialog'));
urlDialog.setupContent = function () {
  const selectedUrl = new URL(location.href).searchParams.get('demo');

  if (selectedUrl) {
    /** @type {HTMLInputElement} */
    const input = this.dialog.querySelector('#url');
    input.value = new URL(selectedUrl, location.href).href;
  }
  return () => {};
};

for (const element of document.querySelectorAll('.toggle--url')) {
  element.addEventListener('click', () => urlDialog.toggleDialog());
}
