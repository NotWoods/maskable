// Prefixed CSS properties

interface CSSStyleDeclaration {
  webkitClipPath?: string;
}

// Web Share API

interface Navigator {
  share(data: { url?: string; text?: string; title?: string }): Promise<void>;
}
