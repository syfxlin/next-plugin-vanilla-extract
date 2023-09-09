import { defineConfig } from "tsup";

export default defineConfig({
  format: ["esm", "cjs"],
  entry: [
    "src/index.ts",
    "src/vanilla-extract-virtual-file.css",
    "src/vanilla-extract-virtual-loader.ts",
    "src/vanilla-extract-webpack-loader.ts",
    "src/vanilla-extract-webpack-plugin.ts",
  ],
  dts: {
    entry: [
      "src/index.ts",
      "src/vanilla-extract-virtual-loader.ts",
      "src/vanilla-extract-webpack-loader.ts",
      "src/vanilla-extract-webpack-plugin.ts",
    ],
  },
  clean: true,
  bundle: false,
  sourcemap: false,
});
