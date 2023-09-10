// @ts-expect-error
import utils from "loader-utils";
import loader from "@vanilla-extract/webpack-plugin/loader";
import type webpack from "webpack";
import { processVanillaFile, serializeCss } from "@vanilla-extract/integration";

const emptyCssExtractionFile = require.resolve("./vanilla-extract-virtual-file.css");

export default loader;

// https://github.com/vanilla-extract-css/vanilla-extract/blob/58005eb5e7456cf2b3c04ea7aef29677db37cc3c/packages/webpack-plugin/src/loader.ts#L65
export function pitch(this: webpack.LoaderContext<any>) {
  const { childCompiler, outputCss, identifiers } = utils.getOptions(this);

  if (childCompiler.isChildCompiler(this._compiler?.name)) {
    return;
  }

  const callback = this.async();
  const compiled = childCompiler.getCompiledSource(this) as Promise<{ source: string }>;

  compiled
    .then(async ({ source }) => {
      const result = await processVanillaFile({
        source,
        outputCss,
        filePath: this.resourcePath,
        identOption: identifiers ?? (this.mode === "production" ? "short" : "debug"),
        serializeVirtualCssPath: async ({ fileName, source }) => {
          const serializedCss = await serializeCss(source);

          // https://github.com/SukkaW/style9-webpack/blob/f51c46bbcd95ea3b988d3559c3b35cc056874366/src/next-appdir/style9-next-loader.ts#L64-L72
          const request = utils.stringifyRequest(
            this,
            // Next.js RSC CSS extraction will discard any loaders in the request.
            // So we need to pass virtual css information through resourceQuery.
            // https://github.com/vercel/next.js/blob/3a9bfe60d228fc2fd8fe65b76d49a0d21df4ecc7/packages/next/src/build/webpack/plugins/flight-client-entry-plugin.ts#L425-L429
            // The compressed serialized CSS of vanilla-extract will add compressionFlag.
            // Causing the resourceQuery to be abnormally split, so uri encoding is required.
            // https://github.com/vanilla-extract-css/vanilla-extract/blob/58005eb5e7456cf2b3c04ea7aef29677db37cc3c/packages/integration/src/serialize.ts#L15
            `${emptyCssExtractionFile}?${encodeURIComponent(JSON.stringify({ fileName, source: serializedCss }))}`,
          );

          return `import ${request}`;
        },
      });
      callback(null, result);
    })
    .catch((e) => {
      callback(e);
    });
}
