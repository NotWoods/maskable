interface Navigator {
  share(data: { url?: string; text?: string; title?: string }): Promise<void>;
}

interface CSSStyleDeclaration {
  webkitClipPath?: string;
}
