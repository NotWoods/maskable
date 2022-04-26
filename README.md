<img src="public/favicon/favicon_196.png" width="128" height="128" alt="">

# Maskable.app

_Preview
[maskable icons](https://css-tricks.com/maskable-icons-android-adaptive-icons-for-your-pwa/)
in the browser!_

![Demo usage](.github/maskable-demo.gif)

---

[Maskable icons](https://www.w3.org/TR/appmanifest/#examples-of-masks) allow web
developers to specify a full-bleed icon that will be cropped by the user-agent
to match other icons on the device. On Android, this lets developers get rid of
the default white background around their icons and use the entire provided
space.

It's important to test maskable icons to ensure the important regions of the
icon are visible on any device and in any shape. Upload a maskable icon or drag
and drop it into [Maskable.app](https://maskable.app), then preview how it will
appear on different Android launchers.

## Developing

Install dependencies:

```shell
npm install
```

Once the modules are installed, run:

```shell
npm run dev
```

This starts a development server using [Vite](https://vitejs.dev/).

## Licensing

This project is available under the MIT License.
