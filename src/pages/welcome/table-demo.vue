<template>
    <div class="demo-region">
        <el-button class="mid-back" @click="router.back()">
            Back
        </el-button>
        <element-demo />
    </div>
</template>

<script lang="ts" setup>
const router = useRouter()
</script>

<style lang="scss" scoped>
.mid-back { display: block; margin: auto; }
.demo-region { width: 100%; }
</style>
