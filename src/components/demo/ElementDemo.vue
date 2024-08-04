<template>
    <el-table :data="tableData" stripe class="fit" :class="[pending ? 'table-loading' : '']">
        <el-table-column
            v-for="item in tableColumn"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            sortable />
        <template #empty>
            <div v-loading="true" class="empty-box" />
        </template>
    </el-table>
</template>

<script lang="ts" setup>
interface DemoDataItem {
    name:   string
    price:  number
    remark: string
}

const pending = ref(false)
const tableData = useState<Array<DemoDataItem>>('resourceData', () => [])
const tableColumn = [
    { label: 'name', prop: 'name' },
    { label: 'Sell Price', prop: 'price' },
    { label: 'desc', prop: 'remark' },
]
// demo request
setTimeout(() => {
    tableData.value = getDemoData()
    pending.value = true
}, 500)

function getDemoData(): Array<DemoDataItem> {
    return [
        { name: 'A01', price: 0.12, remark: '' },
        { name: 'A02', price: 33.77, remark: '' },
    ]
}
</script>

<style scoped>
html,
body,
#__nuxt {
    height: 100%;
}
</style>
