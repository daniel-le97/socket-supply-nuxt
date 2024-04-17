import "#internal/nitro/virtual/polyfills";
import * as os from "socket:os";
// @ts-ignore
import { isPublicAssetURL } from "#internal/nitro/virtual/public-assets";
import type { Context } from "socket:service-worker";
import * as path from "socket:path";
import * as fsp from "socket:fs/promises";

const nitroApp = useNitroApp();

export default {
  async fetch(request: Request, env = {}, ctx: Context) {
    ctx.data = os.uptime();
    const url = new URL(request.url);
    if (isPublicAssetURL(url.pathname) || url.pathname.includes("/_server/")) {
      console.log({ url: url.pathname, isPublicAsset: true });

      return;
    }

    let res: Response | undefined;
    let hitRoute = false;

    if (url.pathname.includes("/_nuxt/")) {
      hitRoute = true;
      const filePath = path.RESOURCES;
      const pathname = url.pathname.replace("/nitro", filePath as string);
      res = await fetch(url.pathname.replace("/nitro", ""));
    }
    if (!res && !hitRoute) {
      res = await handleEvent(url, request);
    }

    // if (url.pathname.includes('.css')) {
    //   // response.headers['Content-Type'] = 'text/css;charset=utf-8'
    //   response.headers.set('Content-Type', 'text/css;charset=utf-8')
    // }
    // if (url.pathname.includes('.js')) {
    //   // response.headers['Content-Type'] = 'application/javascript'
    //   response.headers.set('Content-Type', 'application/javascript')
    // }
    // if (url.pathname === '/nitro') {
    //   // response.headers['runtime-preload-injection'] = 'disabled'
    //   // response.headers.set('runtime-preload-injection', 'disabled')
    // }

    const clonedResponse = res ? res.clone() : undefined;

    // { response: 'hello world!' }
    if (res) {
      console.log({
        "content-type": clonedResponse?.headers.get("content-type"),
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

  // if (url.pathname.includes('.css')) {
  //   request.headers.set('Content-Type', 'text/css;charset=utf-8')
  // }
  // if (url.pathname.includes('.js')) {
  //   request.headers.set('Content-Type', 'application/javascript')
  // }
  // if (url.pathname === '/nitro') {
  //   request.headers.set('runtime-preload-injection', 'disabled')
  // }
  // return await nitroApp.localCall({
  //   body,
  //   'headers': request.headers,
  //   'method': request.method,
  //   'protocol': url.protocol,
  //   'host': url.hostname,
  //   'url': url.pathname + url.search,
  // })
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
