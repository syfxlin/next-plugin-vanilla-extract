# next-plugin-vanilla-extract

[vanilla-extract](https://vanilla-extract.style) is a CSS-in-JS compiler that writes styles in TypeScript (or JavaScript) using locale-scoped class names and CSS variables, then generates static CSS files at build time.

@syfxlin/next-plugin-vanilla-extract is a alternative plugin for [@vanilla-extract/next-plugin](https://www.npmjs.com/package/@vanilla-extract/next-plugin) that fixes @vanilla-extract/next-plugin's inability to generate CSS files for React Server Components on Windows. ([vanilla-extract-css/vanilla-extract#1086](https://github.com/vanilla-extract-css/vanilla-extract/issues/1086))

## Motivation

vanilla-extract does provide a Next.js plugin, but I'm having problems with the build not outputting CSS on Windows ([vanilla-extract-css/vanilla-extract#1086](https://github.com/vanilla-extract-css/vanilla-extract/issues/1086)). To get it to work correctly you need to use Client Component, or use Linux/macOS instead of Windows.

@vanilla-extract/next-plugin uses virtualFileLoader to collect styles and write them to virtual modules during compilation, and then MiniCssExtractPlugin extracts these virtual CSS files. So I did a simple analysis, modified the implementation of virtualFileLoader to write the styles to the actual CSS file and replaced the import statement ([here](https://github.com/vanilla-extract-css/vanilla-extract/blob/58005eb5e7456cf2b3c04ea7aef29677db37cc3c/packages/webpack-plugin/src/loader.ts#L105-L110)), and was surprised to find that the styles were output just fine, so the problem was in the virtualFileLoader.

Sukka had a similar problem with style9-webpack ([here](https://github.com/SukkaW/style9-webpack/issues/1)) and created a similar virtualFileLoader solution. Next.js removes the resource matching query (`!=!`) and the inline loader (`!virtual-file-loader.js?{}!`), so you need to pass the virtual CSS file directly to `noop.css`, and then extract the virtual CSS file from `noop.css` via a loader like this:

```javascript
import "noop.css?{ filename, source }"
```

I started this project as a proof-of-concept, based on @vanilla-extract/next-plugin, to see if it would solve the [vanilla-extract-css/vanilla-extract#1086](https://github.com/vanilla-extract-css/vanilla-extract/issues/1086) issue.

This is a **temporary solution**, if you are not developing on Windows or have not encountered similar problems, use @vanilla-extract/next-plugin. but if you are using Next.js 13 App Directory and are having problems with @vanilla-extract/next-plugin, you can try @syfxlin/next-plugin-vanilla-extract.

## Installation

```shell
# NPM
npm i -D @syfxlin/next-plugin-vanilla-extract
# Yarn
yarn add -D @syfxlin/next-plugin-vanilla-extract
# PNPM
pnpm add -D @syfxlin/next-plugin-vanilla-extract
```

## Usage

```javascript
const { createVanillaExtractPlugin } = require("@syfxlin/next-plugin-vanilla-extract");
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const config = {
  // Your Next.js config goes here.
};

module.exports = withVanillaExtract(config);
```

## Maintainer

**@syfxlin/next-plugin-vanilla-extract** is written and maintained with the help of [Otstar Lin](https://github.com/syfxlin) and the following [contributors](https://github.com/syfxlin/next-plugin-vanilla-extract/graphs/contributors).

## License

Released under the [MIT](https://opensource.org/licenses/MIT) License.
