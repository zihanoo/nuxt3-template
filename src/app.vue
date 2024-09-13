<template>
    <NuxtLayout>
        <NuxtPage :keepalive="{max:10}" :page-key="route => route.fullPath" />
    </NuxtLayout>
</template>

<script setup>
const appConfig = useAppConfig()
useHead({
    title:     appConfig?.title || 'Nuxt App',
    htmlAttrs: { class: appConfig?.theme?.dark ? 'dark' : '' },
    bodyAttrs: { class: 'body-wrap' },
})
</script>

<style lang="scss">
@import url("@/assets/style/main.scss");
</style>
