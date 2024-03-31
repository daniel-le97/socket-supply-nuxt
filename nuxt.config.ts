import path from 'node:path'
const target = path.resolve(process.env.PREFIX || "")

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  alias:{
    "socket:*": 'socket/*'
  },
  ssr:false,
  vite:{
    build:{
      rollupOptions:{
        external: [/socket:.*/],
      }
    }
  },
  app:{
    head:{
      meta:[{
        'http-equiv': "Content-Security-Policy",
        'content': `
        connect-src socket: https: http: blob: ipc: wss: ws: ws://localhost:*;
         script-src socket: https: http: blob: http://localhost:* 'unsafe-eval' 'unsafe-inline';
         worker-src socket: https: http: blob: 'unsafe-eval' 'unsafe-inline';
          frame-src socket: https: http: blob: http://localhost:*;
            img-src socket: https: http: blob: data: http://localhost:*;
          child-src socket: https: http: blob:;
         object-src 'none';`
      }]
    }
  },
  nitro:{
    static:true,
    "rollupConfig":{
      "external": [/socket:.*/],
    },
    'exportConditions':["socket"],
    typescript:{
      tsConfig:{
        'compilerOptions':{
          'paths':{
            'socket:*': ['socket/*'],
          },
          
        
        },
        'exclude':['../build/**',]
      }
    }
  },
  typescript:{
    'tsConfig':{
      'compilerOptions':{
        'paths':{
          'socket:*': ['../socket/*']
        }
      }
    }
  },

  // modules: ["nuxt-build-cache"]
})
