
export default defineEventHandler(async (event) => {
    const params = Object.assign({}, getQuery(event))
    console.log('list params', params)

    const isNext = params?.cursor === 2
    const cursor = Number(params?.cursor) || isNext ? 1 : 2
    return await apiResponse(createData(Number(params?.size), cursor), 404, '404 Page not found')
})

// demo function
function createData(size: number, cursor: number) {
    const names = 'ABCDEFGHIJK'
    const data = Array.from({ length: size || 10 }).map((d, idx) => {
        return {
            no:     idx,
            name:   randomPickString(names, Math.ceil(Math.random() * 10)),
            price:  (Math.random() * 100).toFixed(2),
            remark: new Date(),
        }
    })
    return {
        cursor,
        data,
    }
}

function randomPickString(str: string, times: number) {
    const curs = Array.from({ length: times || 1 }).map(() => {
        return Math.ceil(Math.random() * 10)
    })
    return curs.map((cur) => {
        return (str || '').substring(cur, cur + 1) || ''
    }).join('')
}
