module.exports = {
    cacheId: 'maskable.app',
    globDirectory: '.',
    globPatterns: [
        '*.{html,css}',
        'src/**/*.js',
        'demo/*.{png,svg}',
        'favicon/favicon_*.png',
    ],
    swDest: 'sw.js',
    ignoreURLParametersMatching: [/demo/],
};
