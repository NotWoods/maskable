// @ts-check
import { absolutePath } from './lib/absolute-path.js';

/** @type {import('rollup').RollupOptions} */
const config = {
    input: 'src/viewer/bundle.js',
    inlineDynamicImports: true,
    output: {
        file: 'bundle.js',
        format: 'iife',
    },
    plugins: [absolutePath()],
};

export default config;
