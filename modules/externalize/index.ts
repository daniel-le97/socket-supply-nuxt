import {
  addBuildPlugin,
  addVitePlugin,
  createResolver,
  defineNuxtModule,
  logger,
  useNitro,
} from "nuxt/kit";

export default defineNuxtModule({
  meta: {
    name: "socket-runtime",
  },
  setup: (nuxtOptions, nuxt) => {
    const { resolve } = createResolver(import.meta.url);
    nuxt.options.nitro.preset = resolve("./preset");
  },
});
