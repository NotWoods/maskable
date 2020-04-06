const emptyModule = 'export {}';
const emptyFileName = '\0empty_module';

/**
 * @param {object} options
 * @param {Iterable<string> | ((id: string) => boolean)} options.matches
 * @returns {import('rollup').Plugin}
 */
export function ignore(options) {
  /** @type {(id: string) => boolean)} */
  let matches;
  if (typeof options.matches === 'function') {
    matches = options.matches;
  } else {
    const ids = new Set(options.matches);
    matches = (id) => ids.has(id);
  }

  return {
    name: 'ignore',
    resolveId(source) {
      if (matches(source)) return emptyFileName;
      return null;
    },
    load(id) {
      if (id === emptyFileName) return emptyModule;
      return null;
    },
  };
}
