import * as fs from "socket:fs";
import { resolve, join } from "path";
import { defineDriver } from "unstorage";

import anymatch from "anymatch";
function ignoreNotfound(err: any) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}

function ignoreExists(err: any) {
  return err.code === "EEXIST" ? null : err;
}

function createError(
  driver: string,
  message: string,
  opts?: ErrorOptions
) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  return err;
}

function createRequiredError(driver: string, name: string | string[]) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name
        .map((n) => "`" + n + "`")
        .join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

export interface FSStorageOptions {
  base?: string;
  ignore?: (path: string) => boolean;
  readOnly?: boolean;
  noClear?: boolean;
}

const PATH_TRAVERSE_RE = /\.\.\:|\.\.$/;

const DRIVER_NAME = "socket-fs";

// @ts-expect-error - this is copied from unstorage
export default defineDriver((opts: FSStorageOptions = {base: 'socket'}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }

  opts.base = resolve(opts.base);
  const r = (key: string) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base!, key.replace(/:/g, "/"));
    return resolved;
  };

  return {
    name: DRIVER_NAME,
    options: opts,
    hasItem(key) {
      return (r(key));
    },
    async getItem(key) {
      return await fs.promises.readFile(r(key), { encoding: "utf8" });
    },
    async getItemRaw(key) {
      return await fs.promises.readFile(r(key))
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await fs.promises
        .stat(r(key))
        .catch(() => ({}) as fs.Stats);
      return { atime, mtime, size, birthtime, ctime };
    },
   async setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return await fs.promises.writeFile(r(key), value, { encoding: "utf8" })
    },
   async setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return await fs.promises.writeFile(r(key), value);
    },
    async removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return await fs.promises.unlink(r(key));
    },
    async getKeys() {
      return await fs.promises.readdir(r("."), { withFileTypes: true })
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await fs.promises.rmdir(r("."));
    },
  };
});