// 固定返回一个defineEventHandler方法
export default defineEventHandler((event) => {
    // 接受的event 包含了node 的req 和res方法
    const query = getQuery(event) // getQuery是全局的方法，可以直接调用
    const { id } = query
    return { msg: `请求的是 ${id}的个人信息` }
})
