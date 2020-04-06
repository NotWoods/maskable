import { join } from 'path';

/** @returns {import('rollup').Plugin} */
export function absolutePath({ root = process.cwd() } = {}) {
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
