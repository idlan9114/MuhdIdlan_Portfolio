# .

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

## Responsive Styling

This project uses Tailwind's mobile-first setup:

- Classes without a breakpoint prefix are the mobile/base styles.
- Use `lg:` for desktop overrides, starting at `1024px`.

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Bandwidth and image assets

After adding or replacing images in `src/assets/image`, run `npm run images:webp`
and include the generated assets in the deployment. Display images are limited to
960px on their longest side; gallery previews use 1920px and load only when opened.
Original source images remain available locally. The music cover uses a separate
192px asset. The homepage video and music player load after the visitor presses play.

Netlify should build with `npm run build` and publish `dist`. The generated
`_headers` file gives hashed `/assets/*` files one year of browser caching;
HTML retains Netlify's default caching behavior.
