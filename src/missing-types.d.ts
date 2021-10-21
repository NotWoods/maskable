// Prefixed CSS properties

import { FileDropEvent } from 'file-drop-element';

interface Fathom {
  trackPageview(opts?: { url?: string; referrer?: string }): void;
  trackGoal(code: string, cents: number): void;
}

interface ColorSelectionOptions {
  signal?: AbortSignal;
}

interface ColorSelectionResult {
  sRGBHex: string;
}

declare global {
  interface CSSStyleDeclaration {
    webkitClipPath?: string;
  }

  interface HTMLElementEventMap {
    filedrop: FileDropEvent;
  }

  class EyeDropper {
    constructor();
    open(options?: ColorSelectionOptions): Promise<ColorSelectionResult>;
  }

  interface Window {
    EyeDropper: typeof EyeDropper;
  }

  let fathom: Fathom;
}
