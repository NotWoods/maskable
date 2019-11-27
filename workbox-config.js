module.exports = {
  cacheId: 'maskable.app',
  globDirectory: '.',
  globPatterns: [
    '*.{html,css,svg}',
    'src/**/*.js',
    'web_modules/*.js',
    'demo/*.{png,svg}',
    'favicon/favicon_*.png',
    'toggle/*.svg',
    'bundle.js',
  ],
  globIgnores: ['**/node_modules/**', '**/sw.js', 'src/viewer/bundle.js'],
  swDest: 'sw.js',
  ignoreURLParametersMatching: [/demo/, /fbclid/],
};
