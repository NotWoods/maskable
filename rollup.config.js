import multi from '@rollup/plugin-multi-entry';
import { absolutePath } from './lib/absolute-path.js';

/** @type {import('rollup').RollupOptions} */
const viewer = {
  input: ['src/viewer/change-mask.js', 'src/viewer/upload-icon.js'],
  output: {
    file: 'viewer-bundle.js',
    format: 'iife',
  },
  plugins: [multi({ entry: false })],
};

/** @type {import('rollup').RollupOptions} */
const editor = {
  input: ['src/viewer/change-mask.js', 'src/editor/main.js'],
  output: {
    file: 'editor-bundle.js',
    format: 'iife',
  },
  plugins: [multi({ entry: false })],
};

/** @type {import('rollup').RollupOptions} */
const libs = {
  input: 'src/viewer/libs.js',
  inlineDynamicImports: true,
  output: {
    file: 'libs-bundle.js',
    format: 'iife',
  },
  plugins: [absolutePath()],
};


export default [viewer, editor, libs];
