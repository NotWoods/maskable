import { resolve } from 'path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

module.exports = defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      input: {
        viewer: resolve(__dirname, 'index.html'),
        editor: resolve(__dirname, 'editor.html'),
        settings: resolve(__dirname, 'settings.html')
      }
    }
  },
  plugins: [handlebars({
    partialDirectory: resolve(__dirname, 'partials'),
    helpers: {
      activeIf(context, name) {
        if (context === name) {
          return ' navbar__link--active'
        } else {
          return ''
        }
      }
    }
  })]
})
