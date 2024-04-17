import type { Plugin } from "rollup";

import { type Nitro } from "nitropack";

export const ImportMetaRe = /import\.meta|globalThis._importMeta_/;

// ununsed i used this as a reference on how to use a rollup plugin from nitro source code
export function importMeta(nitro: Nitro): Plugin {
  return {
    name: "import-meta",
    renderChunk(code, chunk) {
      const isEntry = chunk.isEntry;
      if (
        !isEntry &&
        (!ImportMetaRe.test(code) || code.includes("ROLLUP_NO_REPLACE"))
      ) {
        return;
      }
      const url =
        nitro.options.node && isEntry && !code.includes("ROLLUP_NO_REPLACE")
          ? "_import_meta_url_"
          : '"file:///_entry.js"';
      const envImport = nitro.options.node
        ? "import process from 'node:process';"
        : "";
      const env = nitro.options.node ? "process.env" : "{}";
      const ref = "globalThis._importMeta_";
      const stub = `{url:${url},env:${env}}`;
      const stubInit = isEntry ? `${ref}=${stub};` : `${ref}=${ref}||${stub};`;

      return {
        code: envImport + stubInit + code,
        map: null,
      };
    },
  };
}

// this plugin must become before terser
export function fixGlobals(): Plugin {
    return {
      name: "fix-globals",
      renderChunk(code, chunk) {
        code = code
          .replace("_global.process = _global.process || process$1;", "")
          .replace(
            "const process = _global.process;",
            "const process = _global.process || process$1;"
          )
          // when building with ssr = true, _global becomes _global$1
          .replace("_global$1.process = _global$1.process || process$1;", "")
          .replace(
            "const process = _global$1.process;",
            "const process = _global$1.process || process$1;"
          );
  
        return {
          code: code,
          map: null,
        };
      },
    };
  }