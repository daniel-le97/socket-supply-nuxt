import { existsSync, promises as fsp } from "node:fs";
import { resolve } from "pathe";
import { joinURL } from "ufo";
import type { Nitro } from "nitropack";
import type { NitroPreset } from "nitropack";

const getPath = (path: string) => {
  const metaUrl = new URL(import.meta.url).pathname;
  return metaUrl.replace("nitro.config.ts", path);
};

export default <NitroPreset>{
  // baseURL: "/nitro",
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
        changedContents = changedContents
          .replace("_global$1.process = _global$1.process || process$1;", "")
          .replace(
            "const process = _global$1.process;",
            "const process = _global$1.process || process$1;"
          )
          .replace("_global.process = _global.process || process$1;", "")
          .replace(
            "const process = _global.process;",
            "const process = _global.process || process$1;"
          )
          .replace(/(\w+)\.process=\1\.process\|\|(\w+);/g, "")
      }
      if (nitro.options.minify) {

        changedContents = changedContents
          .replace(/(\w+)\.process=\1\.process\|\|(\w+);/g, "")
          // .replace("const f=g.process", "const f=g.process||t")
      }

      await fsp.writeFile(entry, changedContents, "utf8");

      //   await fsp.writeFile(
      //     resolve(nitro.options.output.publicDir, "sw.js"),
      //     `self.importScripts('${joinURL(
      //       nitro.options.baseURL,
      //       "server/index.mjs"
      //     )}');`,
      //     "utf8"
      //   );

      const html = await fsp.readFile(getPath("entry.html"), "utf-8");
      // const html = htmlTemplate(nitro.options.baseURL);
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
