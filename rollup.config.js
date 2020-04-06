import multi from '@rollup/plugin-multi-entry';
import { absolutePath } from './lib/absolute-path.js';
import { ignore } from './lib/ignore.js';

/** @type {import('rollup').RollupOptions} */
const viewer = {
  input: [
    'src/viewer/polyfill.js',
    'src/viewer/change-mask.js',
    'src/viewer/keys.js',
    'src/viewer/upload-icon.js',
  ],
  output: {
    file: 'src/viewer-bundle.js',
    format: 'iife',
  },
  plugins: [multi()],
};

/** @type {import('rollup').RollupOptions} */
const editor = {
  input: ['src/viewer/change-mask.js', 'src/editor/main.js'],
  output: {
    file: 'src/editor-bundle.js',
    format: 'iife',
  },
  plugins: [multi()],
};

/** @type {import('rollup').RollupOptions} */
const libs = {
  input: 'src/viewer/libs.js',
  inlineDynamicImports: true,
  output: {
    file: 'src/libs-bundle.js',
    format: 'iife',
  },
  plugins: [
    ignore({
      // Don't bother with custom elements on old browsers
      matches: (id) =>
        id.includes('dark-mode-toggle') || id.includes('file-drop-element'),
    }),
    absolutePath(),
  ],
};

export default [viewer, editor, libs];
