
declare namespace ApiResponse {
    type Code = number // 状态码，0为正常
    // type Data<T> = T | null | boolean | string | object | Array<unknown>
    type Data<T> = T | null
    type ErrMsg = string // 错误信息
    type Version = string
    type Source<T> = Data<T> | (() => (Data<T> | Promise<Data<T>>)) | Promise<Data<T>>

    interface Res<T> {
        code:   Code
        data:   Data<T>
        errMsg: ErrMsg
        v?:     Version
    }
}

declare interface ApiResponseRes extends ApiResponse.Res<ApiResponse.Data> {}
