import { addBuildPlugin, addVitePlugin, defineNuxtModule } from "nuxt/kit";
import externalize from 'vite-plugin-externalize-dependencies';
import createExternal from 'vite-plugin-external';
export default defineNuxtModule({
    'meta':{
        'name':'hello',
    },
    setup:(nuxtOptions, nuxt) => {
      // nuxt.hook('build:before', () => {})
      // addVitePlugin(createExternal({
      // externals:{
      //   "socket:*": ""
      // }
      // }))
      //   addVitePlugin(externalize({
      //   externals: [/^socket:.*/],
      // }));
       
    }
})