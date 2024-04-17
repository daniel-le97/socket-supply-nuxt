import { existsSync, promises as fsp } from "node:fs";
import { resolve } from "pathe";
import { joinURL } from "ufo";
import type { Nitro } from "nitropack";
import type { NitroPreset } from "nitropack";
import {type Plugin}from "rollup";
import { fixGlobals } from "./plugin";
const getPath = (path: string) => {
  const metaUrl = new URL(import.meta.url).pathname;
  return metaUrl.replace("nitro.config.ts", path);
};

export default <NitroPreset>{
  baseURL: '/nitro',
  // serveStatic:'inline',
  // replace: {
  //   "globalThis": "self"
  // },
  minify: false,
  extends: "service-worker",
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
    output: {
      format: "es",
      // name: "nitro",

      // 'preserveModules': true,
      // generatedCode: {
      //   symbols: true,
      // },
    },
    external: [/^socket:.*/],
  },
  // inlineDynamicImports: true,
  // wasm: {
  //   esmImport: true,
  //   lazy: false,
  // },
  hooks: {
    'rollup:before': (nitro, config) => {
      (config.plugins as [Plugin]).unshift(fixGlobals())
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

      if (nitro.options.minify !== true) {
        // changedContents = changedContents
        //   .replace("_global.process = _global.process || process$1;", "")
        //   .replace(
        //     "const process = _global.process;",
        //     "const process = _global.process || process$1;"
        //   );
      }
      // if (nitro.options.minify) {
      //   changedContents = changedContents
      //     .replace("Oe.process=Oe.process||Be;", "")
      //     .replace("const Ce=Oe.process", "const Ce=Oe.process||Be");
      // }

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
