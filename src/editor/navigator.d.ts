interface Navigator {
  share(data: { url?: string; text?: string; title?: string }): Promise<void>;
}
