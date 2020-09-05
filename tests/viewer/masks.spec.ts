// @ts-check

import { applyMask } from '../../src/viewer/masks.js';

describe('applyMask with clip-path support', () => {
  beforeAll(() => {
    window.CSS = { supports: () => true } as any;
  });

  test('set clip-path and -webkit-clip-path', () => {
    const masked = { style: {} } as HTMLElement;
    const icons = { style: {} } as HTMLElement;

    expect(applyMask([masked], [icons], 'circle')).toBe(true);

    expect(masked.style.webkitClipPath).toBe('inset(6.36% round 50%)');
    expect(masked.style.clipPath).toBe('inset(6.36% round 50%)');
    expect(masked.style.borderRadius).toBeUndefined();
    expect(masked.style.transform).toBeUndefined();
  });

  test('set clip-path and -webkit-clip-path for svg mask', () => {
    const masked = { style: {} } as HTMLElement;
    const icons = { style: {} } as HTMLElement;

    expect(applyMask([masked], [icons], 'squircle')).toBe(true);

    expect(masked.style.webkitClipPath).toBe('url(#squircle)');
    expect(masked.style.clipPath).toBe('url(#squircle)');
    expect(masked.style.borderRadius).toBeUndefined();
    expect(masked.style.transform).toBeUndefined();
  });

  test('fail when mask is invalid', () => {
    const masked = { style: {} } as HTMLElement;
    const icons = { style: {} } as HTMLElement;

    expect(applyMask([masked], [icons], 'foo')).toBe(false);

    expect(masked.style.webkitClipPath).toBeUndefined();
    expect(masked.style.clipPath).toBeUndefined();
    expect(masked.style.borderRadius).toBeUndefined();
    expect(masked.style.transform).toBeUndefined();
  });
});

describe('applyMask without clip-path support', () => {
  beforeAll(() => {
    window.CSS = { supports: () => false } as any;
  });

  test('set border radius and scale', () => {
    const masked = { style: {} } as HTMLElement;
    const icons = { style: {} } as HTMLElement;

    expect(applyMask([masked], [icons], 'circle')).toBe(true);

    expect(masked.style.webkitClipPath).toBeUndefined();
    expect(masked.style.clipPath).toBeUndefined();
    expect(masked.style.borderRadius).toBe('50%');
    expect(masked.style.transform).toBeUndefined();

    expect(icons.style.webkitClipPath).toBeUndefined();
    expect(icons.style.clipPath).toBeUndefined();
    expect(icons.style.borderRadius).toBeUndefined();
    expect(icons.style.transform).toBe('scale(1.15)');
  });

  test('fail when mask is unsupported', () => {
    const masked = { style: {} } as HTMLElement;
    const icons = { style: {} } as HTMLElement;

    expect(applyMask([masked], [icons], 'squircle')).toBe(false);

    expect(masked.style.webkitClipPath).toBeUndefined();
    expect(masked.style.clipPath).toBeUndefined();
    expect(masked.style.borderRadius).toBeUndefined();
    expect(masked.style.transform).toBeUndefined();

    expect(icons.style.webkitClipPath).toBeUndefined();
    expect(icons.style.clipPath).toBeUndefined();
    expect(icons.style.borderRadius).toBeUndefined();
    expect(icons.style.transform).toBeUndefined();
  });

  test('fail when mask is invalid', () => {
    const masked = { style: {} } as HTMLElement;
    const icons = { style: {} } as HTMLElement;

    expect(applyMask([masked], [icons], 'foo')).toBe(false);

    expect(masked.style.webkitClipPath).toBeUndefined();
    expect(masked.style.clipPath).toBeUndefined();
    expect(masked.style.borderRadius).toBeUndefined();
    expect(masked.style.transform).toBeUndefined();

    expect(icons.style.webkitClipPath).toBeUndefined();
    expect(icons.style.clipPath).toBeUndefined();
    expect(icons.style.borderRadius).toBeUndefined();
    expect(icons.style.transform).toBeUndefined();
  });
});
