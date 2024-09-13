/**
 * server api provide response
 * @example
```js
import apiResponse from '~/server/common/response'
export default defineEventHandler(async () => {
    const remoteApiUrl = 'xxx'
    return await apiResponse(
        () => $fetch<ImxApi<Illuvial>>(remoteApiUrl),
        500,
        'request error',
    )
})
```
*/
/**
 * 标准接口返回数据结构
 *
 * @param {ApiResponse.Source<T>} data (type Source<T> = null | boolean | string | object | (() => (Data<T> | Promise<Data<T>>)) | Promise<Data<T>>)
 *
 * 需要返回的data数据，如果data传入的是null，则会优先使用传入code和errMsg进行返回
 * @param {ApiResponse.Code} code 传入数据，如果是结果是undefined或者null就使用传入的错误信息返回，否则全部返回正常。
 * @param {ApiResponse.ErrMsg} errMsg 传入数据，如果是结果是undefined或者null就使用传入的错误信息返回，否则全部返回正常。
 * @param {ApiResponse.Version} version 接口版本
 * @returns Promise<ApiResponse.Res<T>>
 *
 * @example
 *
 ```js
    const res = await apiResponse('hello content', 500, 'hello one error demo')
 ```
 * @example
 *
 ```js
    const remoteApiUrl = 'xxxxx'
    const dataFn = () => $fetch<DemoApi>(remoteApiUrl)
    return await apiResponse<DemoApi>(dataFn, 500, 'Get resources remote data error.')
 ```
*/
async function apiResponse<T>(
    data?: ApiResponse.Source<T>, // 如果data传入的是null，则会优先使用传入code和errMsg进行返回
    code?: ApiResponse.Code, // if error, use this code
    errMsg?: ApiResponse.ErrMsg,
    version?: ApiResponse.Version,
): Promise<ApiResponse.Res<T>> {
    let result: ApiResponse.Data<T> = null

    if (typeof data === 'function') {
        try {
            const dataFn = data as () => (ApiResponse.Data<T> | Promise<ApiResponse.Data<T>>)
            succ(await dataFn())
        }
        catch (err: unknown) {
            fail(err)
        }
    }
    else if ((data || '').toString() === '[object Promise]') {
        try { succ(await data || null) }
        catch (err: unknown) { fail(err) }
        // await promiseCallback(data as Promise<ApiResponse.Data<T>>)
    }
    else {
        // 传入的是静态数据，如果是undefined或者null就使用传入的错误信息返回，否则全部返回正常。
        // 如果你想表达返回的数据是null是正常的，应当返回object，例如：{ name: null }
        result = typeof data === 'undefined' ? null : data as ApiResponse.Data<T>
        if (result === null) {
            // 如果data是null，则会优先使用传入code和errMsg进行返回
            code = typeof code === 'undefined' ? 500 : code
            errMsg = errMsg || 'Response Error'
        }
        else {
            succ(result)
        }
    }

    // async function promiseCallback(response: Promise<ApiResponse.Data<T>>) {
    //     await new Promise((resolve) => {
    //         response.then(res => resolve(succ(res)))
    //             .catch(err => resolve(fail(err)))
    //     })
    // }

    function succ(data: ApiResponse.Data<T>) {
        result = data
        code = 0
        errMsg = ''
    }

    function fail(err: unknown) {
        result = null
        code = typeof code === 'undefined' ? 500 : code
        errMsg = errMsg || getMsgString(err)
        console.error('apiResponse err', err)
    }

    // console.log('apiRes done', result)
    return {
        data:   result,
        code:   code || 0,
        errMsg: errMsg || '',
        v:      version || '',
    }
}

export default apiResponse

function getMsgString(err: unknown) {
    let msg = ''
    if (typeof err === 'object') {
        const e = err as { message?: string }
        msg = e?.message || ''
    }
    return msg || 'Error'
}
