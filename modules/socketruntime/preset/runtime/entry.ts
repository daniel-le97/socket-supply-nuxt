import "#internal/nitro/virtual/polyfills";
import * as os from 'node:os'
// @ts-ignore
import { isPublicAssetURL } from "#internal/nitro/virtual/public-assets";
import type { Context } from "socket:service-worker";
import * as path from "node:path";
import * as fsp from 'socket:url';

const nitroApp = useNitroApp();

function fixAssetsUrl(inputString: string) {
  const nuxtIndex = inputString.indexOf("/_nuxt/");
  return inputString.substring(nuxtIndex); // Extract substring starting from '/_nuxt/'
}

const handler = toWebHandler(nitroApp.h3App);

export default {
  async fetch(request: Request, env = {}, ctx: Context) {
    request.headers.set("runtime-preload-injection", "disabled");
    ctx.data = os.uptime();
    let url = new URL(request.url);

    if (isPublicAssetURL(url.pathname) || url.pathname.includes("/_server/")) {
      return;
    }

    let res;
    let hit = false;

    // idk why but nuxt will not serve its own build assets correctly so we need to fetch them
    if (url.pathname.includes("/_nuxt/")) {
      hit = true;
      res = await fetch(fixAssetsUrl(url.pathname));
    }

    if (!res && !hit) {
      // builtin handler
      res = await handler(request);
      // if u want to make the handler manually
      // res = await handleEvent(url, request);
    }

    const cloned = res?.clone();
    if (cloned) {
      console.log({
        contentType: cloned.headers.get("content-type"),
        url: url.pathname,
      });
    }

    return res;
  },
};

async function handleEvent(url: URL, request: Request) {
  let body = undefined;
  if (request.body && request.arrayBuffer) {
    body = await request.arrayBuffer();
  }

  request.headers.set("runtime-preload-injection", "disabled");
  return await nitroApp.localFetch(url.pathname + url.search, {
    host: url.hostname,
    protocol: url.protocol,
    headers: request.headers,
    method: request.method,
    redirect: "manual",
    body,
  });
}
