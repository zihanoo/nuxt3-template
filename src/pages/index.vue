<template>
    <div class="index-screen">
        <p>It is ok!</p>
        <el-button @click="router.push('./welcome')">
            Go Welcome Page
        </el-button>
        <el-button @click="router.push('./welcome/table-demo')">
            Go Table Demo Page
        </el-button>
    </div>
</template>

<script lang="ts" setup>
const router = useRouter()
</script>

<style lang="scss" scoped>
.index-screen {
    width: 100%;
    height: 100%;
    padding: 20px;
    text-align: center;
}
</style>
