<template>
    <el-table :data="tableData" stripe class="fit" :class="[status === 'pending' ? 'table-loading' : '']">
        <el-table-column
            v-for="item in tableColumn"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            sortable />
        <template #empty>
            <div v-loading="status === 'pending'" class="empty-box">
                {{ emptyContent }}
            </div>
        </template>
    </el-table>
</template>

<script lang="ts" setup>
interface DemoDataItem {
    name:   string
    price:  number
    remark: string
}
interface DemoDataRes {
    data:   DemoDataItem[]
    cursor: number
}

const tableData = useState<DemoDataItem[]>(() => [])
const tableColumn = [
    { label: 'name', prop: 'name' },
    { label: 'Sell Price', prop: 'price' },
    { label: 'desc', prop: 'remark' },
]
const emptyContent = ref('暂无内容')
const pageSize = ref(12)
const dataCursor = ref('') // 下一页游标，需要加载时再赋值为nextCursor的值

const { status, refresh } = await useAsyncData<ApiResponse.Res<DemoDataRes>>(
    () => $fetch('/api/demo/list',
        {
            query:  {
                size:   pageSize.value,
                cursor: dataCursor.value,
            },
        }),
    {
        // watch:     [],
        transform: render,
    },
).then((result) => {
    // 服务端渲染的时通用404是无法返回的（通过error判断），如果接口异常result.data.value为null
    // 后续异步获取的数据如果异常，才能正常返回通用接口异常，也就是此时api/[...].ts才生效
    // console.log('useAsyncData result', result.data.value?.code)
    const res = result.data.value
    if (res && res.code !== 0) {
        // 需要界面渲染的方法，必须在页面生命周期再执行，不然服务器ssr会直接页面500
        onMounted(() => ElMessage.error(res.errMsg || '获取数据错误[1]'))
    }
    return result
})

function render(result: ApiResponse.Res<DemoDataRes>) {
    // console.log('render result', result.data)
    if (result && result.code === 0) {
        const res = result.data
        tableData.value = res?.data || []
    }
    else {
        emptyContent.value = result?.errMsg || '暂无内容，请稍后再试'
    }
    return result
}
</script>
