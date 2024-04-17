


import "#internal/nitro/virtual/polyfills";
import * as os from "socket:os";
// @ts-ignore
import { isPublicAssetURL } from "#internal/nitro/virtual/public-assets";
import type { Context } from "socket:service-worker";
import * as path from "socket:path"
import * as fsp from "socket:fs/promises"



const nitroApp = useNitroApp();

export default {
  async fetch(request: Request, env = {}, ctx: Context) {
    request.headers.set('runtime-preload-injection', 'disabled')
    ctx.data = os.uptime();
    let url = new URL(request.url);

    if (isPublicAssetURL(url.pathname) || url.pathname.includes("/_server/")) {
      return;
    }

    let res
    let hit = false

    // idk why but nuxt will not serve its own build assets correctly so we need to fetch them
    if (url.pathname.includes("/_nuxt/")) {
      hit = true
      res = await fetch(url.pathname.replace('/nitro', ''))
    }

    if (!res && !hit) {
      res = await handleEvent(url, request);
    }

    return res
  },
};


async function handleEvent(url: URL, request: Request) {
  let body = undefined;
  if (request.body && request.arrayBuffer) {
    body = await request.arrayBuffer();
  }

  request.headers.set('runtime-preload-injection', 'disabled')
  return await nitroApp.localFetch(url.pathname + url.search, {
    host: url.hostname,
    protocol: url.protocol,
    headers: request.headers,
    method: request.method,
    redirect: 'manual',
    body,
  });
}
