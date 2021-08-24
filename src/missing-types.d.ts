// Prefixed CSS properties

import { FileDropEvent } from 'file-drop-element';

interface Fathom {
  trackPageview(opts?: { url?: string; referrer?: string }): void;
  trackGoal(code: string, cents: number): void;
}

declare global {
  interface CSSStyleDeclaration {
    webkitClipPath?: string;
  }

  interface HTMLElementEventMap {
    filedrop: FileDropEvent;
  }

  let fathom: Fathom;
}
