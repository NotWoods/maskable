// Prefixed CSS properties

import { FileDropEvent } from 'file-drop-element';

interface Fathom {
  trackPageview(opts?: { url?: string; referrer?: string }): void;
  trackGoal(code: string, cents: number): void;
}

interface ColorSelectionOptions {
  /**
   * An `AbortSignal`. The eyedropper mode will be aborted when the `AbortSignal`'s `abort()` method is called.
   */
  signal?: AbortSignal;
}

interface ColorSelectionResult {
  /**
   * A string representing the selected color, in hexadecimal sRGB format (`#aabbcc`).
   */
  sRGBHex: string;
}

declare global {
  interface CSSStyleDeclaration {
    webkitClipPath?: string;
  }

  interface HTMLElementEventMap {
    filedrop: FileDropEvent;
  }

  /**
   * The `EyeDropper` interface represents an instance of an eyedropper tool that can be opened and used by the user to select colors from the screen.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper
   */
  class EyeDropper {
    constructor();
    /**
     * The `EyeDropper.open()` method starts the eyedropper mode,
     * returning a promise which is fulfilled once the user has either selected a color or dismissed the eyedropper mode.
     * @param options An options object to pass an `AbortSignal` signal.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper/open
     */
    open(options?: ColorSelectionOptions): Promise<ColorSelectionResult>;
  }

  interface Window {
    EyeDropper?: typeof EyeDropper;
  }

  let fathom: Fathom;
}
