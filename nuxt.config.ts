// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',

    devtools:   { enabled: true },
    modules:    ['@nuxt/eslint', '@nuxt/test-utils/module', '@element-plus/nuxt'],
    srcDir:     'src/',
    components: [{ path: '~/components' }, { path: '~/components/demo' }],

    css: [
        'normalize.css',
        'element-plus/theme-chalk/dark/css-vars.css',
        '~/assets/style/base.css',
    ],

    eslint: {
        config: {
            stylistic: true,
        },
    },
})
