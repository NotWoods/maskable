/**
 * Manages progressively enhancing a `<dialog>` element.
 */
export class DialogManager {
  /**
   * @param {HTMLDialogElement} dialog
   */
  constructor(dialog) {
    this.dialog = dialog;
    /**
     * @type {HTMLElement}
     * Title of the dialog, will be focused on when dialog is opened.
     */
    this.title = dialog.querySelector(
      `#${dialog.getAttribute('aria-labelledby')}`
    );
    /**
     * @type {NodeListOf<HTMLElement>}
     * Focusable elements inside the dialog.
     */
    this.focusable = dialog.querySelectorAll('[tabindex="0"], input, button');

    /**
     * Cleanup content listeners created in `setupContent`.
     * @see {DialogManager.setupContent}
     */
    this.cleanupContent = () => {};

    this.dialog.addEventListener('keyup', (event) => {
      if (event.key === 'Escape' && this.dialog.open) {
        event.preventDefault();
        this.closeDialog();
      }
    });
  }

  openDialog() {
    const { dialog } = this;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    }

    dialog.open = true;
    dialog.setAttribute('open', '');
    dialog.removeAttribute('inert');
    dialog.setAttribute('aria-hidden', 'false');

    this.title.focus();

    this.cleanupContent = this.setupContent();
  }

  closeDialog() {
    const { dialog } = this;
    if (typeof dialog.close === 'function') {
      dialog.close();
    }

    dialog.open = false;
    dialog.removeAttribute('open');
    dialog.setAttribute('inert', '');
    dialog.setAttribute('aria-hidden', 'true');

    this.cleanupContent();
  }

  /**
   * Toggle the dialog open or closed
   * @param {boolean} [open] True to open the dialog, false to close.
   * Defaults to toggling the current state.
   */
  toggleDialog(open = !this.dialog.open) {
    if (open) {
      this.openDialog();
    } else {
      this.closeDialog();
    }
  }

  /**
   * @abstract
   * Manage dialog content and setup any listeners needed.
   * @returns {() => void} Cleanup function used to remove listeners.
   */
  setupContent() {
    return this.cleanupContent;
  }
}

/**
 * Lazy load a promise.
 * @template T
 * @param {() => Promise<T>} setupFn
 * @returns {() => Promise<T>}
 */
export function lazy(setupFn) {
  /** @type {Promise<T>} */
  let promise;
  return () => {
    if (promise) return promise;

    promise = setupFn();
    return promise;
  };
}
