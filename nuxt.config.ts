import path from 'node:path'

const target = path.resolve(process.env.PREFIX || "")

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  // experimental: {
  //   crossOriginPrefetch: true
  // },
  // alias:{
  //   "socket:os": '../node_modules/@socketsupply/socket/os.js'
  // },
  // imports:{
  //   autoImport:false
  // },
  // ssr:false,
  vite:{
    
    // resolve:{
    //   alias:{
    //     'socket:*': '../node_modules/@socketsupply/socket/*'
    //   }
    // },
    // 'optimizeDeps':{
    //   "exclude":['@socketsupply/socket', "socket", "socket:*"]
    // },
    build:{
      // 'target': 'esnext',
      
      rollupOptions:{
        
        external: [/^socket:.*/],
      }
    }
  },
  app:{
    baseURL: '/nitro/',
    head: {
      meta: [{
        'http-equiv': "Content-Security-Policy",
        content: `
          connect-src 'self' socket: https: http: blob: ipc: wss: ws: ws://localhost:* data: text/html;
          script-src 'self' socket: https: http: blob: http://localhost:* 'unsafe-eval' 'unsafe-inline' data: text/html;
          worker-src 'self' socket: https: http: blob: 'unsafe-eval' 'unsafe-inline' data: text/html;
          frame-src 'self' socket: https: http: blob: http://localhost:* data: text/html;
          img-src 'self' socket: https: http: blob: data: http://localhost:* data: text/html;
          child-src 'self' socket: https: http: blob: data: text/html;
          object-src 'self' data: text/html;
        `
      }]
    }
  },
  nitro:{
    // imports:{
    //   autoImport:false
    // },
    // experimental:{
    //   'legacyExternals':true,
    //   'typescriptBundlerResolution':true,
    // },
    'externals':{
      'external': [/^socket:.*/],
    },
    // static:true,
    "rollupConfig":{
      "external": [/^socket:.*/],
    },
    'exportConditions':["socket", "socket:*"],
    // typescript:{
    //   tsConfig:{
    //     'compilerOptions':{
    //       'paths':{
    //         'socket:*': ['socket/*'],
    //       },
          
        
    //     },
    //   }
    // }
  },
  // typescript:{
  //   'tsConfig':{
  //     'compilerOptions':{
  //       'paths':{
  //         'socket:*': ['../socket/*']
  //       }
  //     }
  //   }
  // },

  modules: ["nuxt-build-cache", '@nuxt/ui', '@vueuse/nuxt']
})
