import { deserializeCss } from "@vanilla-extract/integration";

import type webpack from "webpack";

export default function (this: webpack.LoaderContext<any>) {
  const callback = this.async();
  const resourceQuery = this.resourceQuery.slice(1);

  try {
    const { source } = JSON.parse(decodeURIComponent(resourceQuery));
    deserializeCss(source)
      .then((deserializedCss) => {
        callback(null, deserializedCss);
      })
      .catch((e) => {
        callback(e as Error);
      });
  } catch (e) {
    callback(e as Error);
  }
}
