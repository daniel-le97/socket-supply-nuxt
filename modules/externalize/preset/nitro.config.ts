import { existsSync, promises as fsp } from "node:fs";
import { resolve } from "pathe";
import { joinURL } from "ufo";
import type { Nitro } from "nitropack";
import type { NitroPreset } from "nitropack";
import { fixGlobals } from "./plugin";
import { type Plugin } from "rollup";
const getPath = (path: string) => {
  const metaUrl = new URL(import.meta.url).pathname;
  return metaUrl.replace("nitro.config.ts", path);
};

export default <NitroPreset>{
  baseURL: "/nitro",
  // serveStatic:'inline',
  // replace: {
  //   "globalThis": "self"
  // },
  minify: false,
  extends: "node-server",
  // replace:{
  //   "node:*": "socket:*"
  // },
  // unenv:{
  //   ''
  // }
  // static:true,
  node: false,
  noExternals: true,
  exportConditions: ["socket"],
  entry: getPath("entry.ts"),
  output: {
    serverDir: "{{ output.dir }}/public/server",
  },
  // commands: {
  //   preview: "npx serve ./public",
  // },
  // esbuild:{
  //   'options':{
  //     'platform': 'browser',
  //   }
  // },
  externals: [/^socket:.*/],
  rollupConfig: {
    // output: {
    //   format: "es",
    //   // name: "nitro",

    //   // 'preserveModules': true,
    //   // generatedCode: {
    //   //   symbols: true,
    //   // },
    // },
    external: [/^socket:.*/],
  },
  // inlineDynamicImports: true,
  // wasm: {
  //   esmImport: true,
  //   lazy: false,
  // },
  hooks: {
    "rollup:before": (nitro, config) => {
      (config.plugins as [Plugin]).unshift(fixGlobals());
    },
    "prerender:generate"(route, nitro) {
      console.log("prerender:generate", route);

      // route.contents = route.contents?.replace(
      //   "</head>",
      //   `${script}\n</head>`
      // );
    },
    async compiled(nitro: Nitro) {
      const dir = nitro.options.output.serverDir;
      const entry = dir + "/index.mjs";
      const fileContents = await fsp.readFile(entry, "utf8");

      let changedContents =
        `globalThis = globalThis || self || global || {};` + fileContents;

      await fsp.writeFile(entry, changedContents, "utf8");

      //   await fsp.writeFile(
      //     resolve(nitro.options.output.publicDir, "sw.js"),
      //     `self.importScripts('${joinURL(
      //       nitro.options.baseURL,
      //       "server/index.mjs"
      //     )}');`,
      //     "utf8"
      //   );

      // Write fallback initializer files
      const html = await fsp.readFile(getPath("entry.html"), "utf8");
      if (!existsSync(resolve(nitro.options.output.publicDir, "index.html"))) {
        await fsp.writeFile(
          resolve(nitro.options.output.publicDir, "index.html"),
          html,
          "utf8"
        );
      }
    },
  },
};
