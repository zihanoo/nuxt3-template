// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',

    devtools:   { enabled: true },
    modules:    [
        '@nuxt/eslint',
        '@nuxt/test-utils/module',
        'nuxt-mongoose',
        'nuxt3-winston-log',

        '@vueuse/nuxt',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
        '@element-plus/nuxt',
    ],
    srcDir:     'src/',
    components: [
        { path: '~/components' },
        { path: '~/components/mongodb' },
        { path: '~/components/demo' },
    ],

    css: [
        'normalize.css',
        'element-plus/theme-chalk/dark/css-vars.css',
        '~/assets/style/base.css',
    ],

    mongoose: {
        uri:       process.env.MONGODB_URI,
        // options:   {},
        // modelsDir: 'models',
        // devtools:  true,
    },

    nuxt3WinstonLog: {
        maxSize:  '2048m',
        maxFiles: '30d',

        skipRequestMiddlewareHandler: true,
    },

})
