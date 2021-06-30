/**
 * @jest-environment jsdom
 */

import { backgroundLayer } from '../../src/editor/layer.js';
import { toUrl, CanvasController } from '../../src/editor/canvas.js';

function mockCanvas(opts?: { toBlob?: boolean }) {
  const canvas = {
    toDataURL(type: string) {
      if (type === 'image/png') {
        return 'data:,MOCK';
      } else {
        throw new Error();
      }
    },
  } as HTMLCanvasElement;

  if (opts.toBlob) {
    canvas.toBlob = function (callback, type) {
      if (type === 'image/png') {
        callback(new Blob());
      } else {
        throw new Error();
      }
    };
  }

  return canvas;
}

globalThis.URL.createObjectURL = () => 'blob:MOCK';

describe('toUrl', () => {
  test('Return data URL when requested', async () => {
    const canvas1 = mockCanvas({ toBlob: true });
    expect(await toUrl(canvas1, false)).toBe('data:,MOCK');

    const canvas2 = mockCanvas({ toBlob: false });
    expect(await toUrl(canvas2, false)).toBe('data:,MOCK');
  });

  test('Return blob URL when requested', async () => {
    const canvas = mockCanvas({ toBlob: true });
    expect(await toUrl(canvas, true)).toMatch(/^blob:/);
  });

  test(`Return data URL when blob URL isn't supported`, async () => {
    const canvas = mockCanvas({ toBlob: false });
    expect(await toUrl(canvas, true)).toBe('data:,MOCK');
  });
});

describe('CanvasController', () => {
  test('Default values', async () => {
    const controller = new CanvasController();
    expect(controller.getLayerCount()).toBe(0);
    expect(controller.getSize()).toBe(1024);
  });

  test('Add and remove layers', async () => {
    const controller = new CanvasController();
    const layer1 = backgroundLayer();
    const layer2 = backgroundLayer();
    const layer3 = backgroundLayer();
    controller.add(layer1, []);
    controller.add(layer2, []);
    expect(controller.getLayerCount()).toBe(2);

    controller.delete(layer1);
    expect(controller.getLayerCount()).toBe(1);

    // Layer not in controller
    controller.delete(layer3);
    expect(controller.getLayerCount()).toBe(1);
  });
});
