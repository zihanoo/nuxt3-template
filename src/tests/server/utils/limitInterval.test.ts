import { describe, expect, test } from 'vitest'
import limitInterval from '~/server/utils/limitIntarval'

const visConfig = {
    limit:    1,
    interval: 200, // 测试时不宜过大，需要远远小于你会第二次执行test的时间，不然可能导致测试失败
}
const limitIntarvalInstance = limitInterval(visConfig.limit, visConfig.interval)

function testCore(reqUrl: URL, ip: string) {
    return new Promise((resolve) => {
        if (reqUrl.pathname.match(/\/api/)) {
            limitIntarvalInstance(ip)
                .then(res => resolve(res))
                // .catch(() => resolve(false))
        }
        else {
            resolve(true)
        }
    })
}

describe('server test limitInterval use1', () => {
    const reqUrl = new URL('/api/demo', 'http://127.0.0.1')
    const ip = '127.0.0.1'

    test('one', async () => {
        const result = await testCore(reqUrl, ip)
        expect(result).toBe(true)
    })

    test('two', async () => {
        const result = await testCore(reqUrl, ip)
        expect(result).toBe(false)
    })

    test('thrid', async () => {
        await new Promise((resolve) => {
            setTimeout(() => resolve(true), visConfig.interval * 2 + 1)
        })
        const result = await testCore(reqUrl, ip)
        expect(result).toBe(true)
    })

    test('four', async () => {
        const result = await testCore(reqUrl, ip)
        expect(result).toBe(false)
    })
})

describe('server test limitInterval use2', () => {
    const reqUrl = new URL('/api/demo', 'http://127.0.0.1')
    const ip = '222.111.33.44'

    test('one', async () => {
        const result = await testCore(reqUrl, ip)
        expect(result).toBe(true)
    })

    test('two', async () => {
        await new Promise((resolve) => {
            setTimeout(() => resolve(true), visConfig.interval + 1)
        })
        const result = await testCore(reqUrl, ip)
        expect(result).toBe(true)
    })

    test('thrid', async () => {
        const result = await testCore(reqUrl, ip)
        expect(result).toBe(false)
    })
})

describe('server test limitInterval use3', () => {
    const reqUrl = new URL('/api/demo', 'http://127.0.0.1')
    const ip = '144.144.111.122'

    test('one', async () => {
        const result = await testCore(reqUrl, ip)
        expect(result).toBe(true)
    })

    test('two', async () => {
        await new Promise((resolve) => {
            setTimeout(() => resolve(true), visConfig.interval + 1)
        })
        const result = await testCore(reqUrl, ip)
        expect(result).toBe(true)
    })

    test('thrid', async () => {
        const result = await testCore(reqUrl, ip)
        expect(result).toBe(false)
    })
})
