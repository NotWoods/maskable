// Prefixed CSS properties

import { FileDropEvent } from "file-drop-element";

declare global {
  interface CSSStyleDeclaration {
    webkitClipPath?: string;
  }

  // Web Share API

  interface Navigator {
    share(data: { url?: string; text?: string; title?: string }): Promise<void>;
  }

  interface HTMLElementEventMap {
    'filedrop': FileDropEvent
  }
}
