// Prefixed CSS properties

import { FileDropEvent } from "file-drop-element";

declare global {
  interface CSSStyleDeclaration {
    webkitClipPath?: string;
  }

  interface HTMLElementEventMap {
    'filedrop': FileDropEvent
  }
}
