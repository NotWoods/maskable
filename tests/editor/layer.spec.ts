import { describe, expect, test } from 'vitest';
import { backgroundLayer, createLayer } from '../../src/editor/layer.js';

describe('createLayer', () => {
  test('create layer with fill', () => {
    expect(createLayer('#f00')).toEqual({
      name: 'Layer',
      fill: '#f00',
      padding: 0,
      x: 0,
      y: 0,
      alpha: 100,
      rotation: 0,
      locked: false,
      fit: 'contain',
    });
  });

  test('create layer with image', () => {
    const img = { close() {} } as ImageBitmap;
    expect(createLayer('#ff0', img)).toEqual({
      src: img,
      name: 'Layer',
      fill: '#ff0',
      padding: 0,
      x: 0,
      y: 0,
      alpha: 0,
      rotation: 0,
      locked: false,
      fit: 'contain',
    });
  });

  test('create background layer', () => {
    expect(backgroundLayer()).toEqual({
      name: 'Layer',
      fill: '#448AFF',
      padding: 0,
      x: 0,
      y: 0,
      alpha: 100,
      rotation: 0,
      locked: true,
      fit: 'contain',
    });
  });
});
