// @ts-check
import { absolutePath } from './lib/absolute-path.js';

/** @type {import('rollup').RollupOptions} */
const viewer = {
  input: 'src/viewer/bundle.js',
  inlineDynamicImports: true,
  output: {
    file: 'viewer-bundle.js',
    format: 'iife',
  },
  plugins: [absolutePath()],
};

/** @type {import('rollup').RollupOptions} */
const editor = {
  input: 'src/editor/bundle.js',
  inlineDynamicImports: true,
  output: {
    file: 'editor-bundle.js',
    format: 'iife',
  },
  plugins: [absolutePath()],
};

export default [viewer, editor];
