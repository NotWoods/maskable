// @ts-check
const { join } = require('path');

/** @returns {import('rollup').Plugin} */
function absolutePath({ root = process.cwd() } = {}) {
    return {
        name: 'absolute-path',
        resolveId(source) {
            if (source.startsWith('/')) {
                return join(root, source);
            } else {
                return null;
            }
        },
    };
}

/** @type {import('rollup').RollupOptions} */
const config = {
    input: 'src/bundle.js',
    inlineDynamicImports: true,
    output: {
        file: 'bundle.js',
        format: 'iife',
    },
    plugins: [absolutePath()],
};

export default config;
