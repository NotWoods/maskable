module.exports = {
    cacheId: 'maskable.app',
    globDirectory: '.',
    globPatterns: [
        '*.{html,css}',
        'src/**/*.js',
        'web_modules/*.js',
        'demo/*.{png,svg}',
        'favicon/favicon_*.png',
        'toggle/*.svg',
    ],
    swDest: 'sw.js',
    ignoreURLParametersMatching: [/demo/, /fbclid/],
};
