import type { AsyncData, AsyncDataOptions, NuxtError } from 'nuxt/app'
/**
 * ssr异步数据增强版
 *
 * 可以避免页面二次载入时数据重复加载的问题
 *
 * @param pageInited 页面锁，表示页面加载情况。（需要注意每次加载时，需要重设为false）
 * @param tableDataLangth 使用useState存储的数据长度
 * @param fetchFn 请求数据的方法
 * @param useAsyncDataOptions 原useAsyncData方法参数
 *
 * @example
```js

const tableData = useState<Array<XXX>>(() => [])
const pageSize = ref(10)
const dataCursor = ref('')

const pageInited = useState(() => false)
pageInited.value = false

const { status, error, refresh } = await useAsyncDataCustom(
    pageInited,
    tableData.value.length,
    () => $fetch<ApiResponse.Res<YYY>>(`/api/xxxx`,
        {
            query: {
                pageSize: pageSize.value,
                cursor:   dataCursor.value,
            },
        },
    ),
    {
        watch:     [dataCursor],
        transform: dataTransform,
    },
)

function dataTransform(result: ApiResponse.Res<ImxApi<Illuvial>>) {
    // ...do samthing
    return result
}
```
*/

// interface UseAsyncDataOptions<T> {
//     pageInited:      globalThis.Ref<boolean, boolean>
//     tableDataLangth: number
//     fetchFn:         () => Promise<ApiResponse.Res<T>>
//     dataOptions?:    AsyncDataOptions<ApiResponse.Res<T>>
//     // success:         () => void
//     fail:            (err: NuxtError<unknown> | null) => void
// }
export async function useAsyncDataCustom<T>(
    // pageInited: globalThis.Ref<boolean, boolean> | UseAsyncDataOptions<T>,
    pageInited: globalThis.Ref<boolean, boolean>,
    tableDataLangth: number,
    fetchFn: () => Promise<ApiResponse.Res<T>>,
    useAsyncDataOptions?: AsyncDataOptions<ApiResponse.Res<T>>,
    fail?:  (err: NuxtError<unknown> | null) => void,
): Promise<AsyncData<ApiResponse.Res<T> | null, NuxtError<unknown> | null>> {
    // 页面使用来useState做临时存储数据时，为避免页面二次进入重复加载数据，需要判断页面加载状态和是否已有数据。
    // 如果是则返回空数据结果避免数据重复。
    function fetchData() {
        // console.log('useAsyncDataCustom in', pageInited.value, tableDataLangth)
        if (!pageInited.value && tableDataLangth > 0) {
            // console.log('useAsyncDataCustom fetchData', pageInited.value)
            return new Promise<ApiResponse.Res<T>>((resolve) => {
                resolve({
                    data:   null,
                    code:   0,
                    errMsg: '',
                    v:      '',
                })
            })
        }
        else {
            return fetchFn()
        }
    }

    const dataRes = await useAsyncData<ApiResponse.Res<T>>(fetchData, useAsyncDataOptions).then((result) => {
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


    watch(dataRes.error, (val) => {
        dateError(val)
    })
    if (dataRes.error.value) {
        dateError(dataRes.error.value)
    }

    function dateError(err: NuxtError<unknown> | null) {
        console.error('useAsyncDataCustom error', err?.statusCode, err?.message || err?.statusMessage)
        if (fail) fail(err)
        try {
            if (err && err?.statusCode !== 0 && err?.statusCode !== 200) {
                // 不try一下，页面会报500
                const msg = err?.statusMessage || '获取数据错误[2]'
                ElMessage.error(msg)
            }
        }
        catch (err) {
            console.error('useAsyncDataCustom error show message error')
        }
    }

    if (import.meta.client) {
        // console.log('is in client')
        // 需要在client端改变状态，
        // 在服务端首先运行时使用的是传入的状态值，等待与客户进行水合时改变状态
        pageInited.value = true
    }

    return dataRes
}
