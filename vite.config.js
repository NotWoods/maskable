import { resolve } from 'path';
import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import handlebars from 'vite-plugin-handlebars';
import { VitePWA as pwa } from 'vite-plugin-pwa';
import { ViteWebfontDownload as webfont } from 'vite-plugin-webfont-dl';

module.exports = defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      input: {
        viewer: resolve(__dirname, 'index.html'),
        editor: resolve(__dirname, 'editor.html'),
        settings: resolve(__dirname, 'settings.html'),
      },
    },
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'partials'),
      helpers: {
        activeIf(context, name) {
          if (context === name) {
            return ' navbar__link--active';
          } else {
            return '';
          }
        },
      },
    }),
    webfont(
      'https://fonts.googleapis.com/css2?family=Lato:wght@400;900&display=swap'
    ),
    pwa({
      manifest: false,
      workbox: {
        cacheId: 'maskable.app',
        globPatterns: [
          '*.{html,css,svg,woff2}',
          'assets/*.js',
          'demo/*.{png,svg}',
          'favicon/favicon_*.png',
          'toggle/*.svg',
        ],
        globIgnores: ['assets/*-legacy.*.js', 'open'],
        ignoreURLParametersMatching: [/demo/, /fbclid/],
      },
    }),
    legacy({
      targets: ['defaults', 'not IE 11', 'kaios >= 2'],
    }),
  ],
});
