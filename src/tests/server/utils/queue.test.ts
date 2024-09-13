import { describe, expect, test } from 'vitest'
import { queueTask } from '~/server/utils/queue'

describe('queue', async () => {
    const maxTaskOnce = 2 // 本次模拟单次最大并行任务数
    const reqNum = 5 // 本次模拟发送请求条数
    const taskInterval = 100
    const queueConsumeTimeout = 150
    const queueTaskMaxCount = queueConsumeTimeout / taskInterval * maxTaskOnce
    const queueTaskInstance = queueTask(maxTaskOnce, taskInterval, queueConsumeTimeout)

    async function runCore() {
        const requestAll = []
        const data = 'hello'
        const param = '269316'
        for (let i = 0; i < reqNum; i++) {
            requestAll.push(queueTaskInstance((param) => {
                const idx = i
                return new Promise((resolve) => {
                    if (i == 1) setTimeout(() => { resolve({ code: 500, data: '', errMsg: 'test demo error' }) }, taskInterval * 1.2)
                    else setTimeout(() => { resolve({ code: 0, data: data + param + '-' + idx, errMsg: '' }) }, taskInterval)
                })
            }, param))
        }

        const codes: number[] = []
        await Promise.all(requestAll).then((result) => {
            result.forEach((res) => {
                // console.log('resultData sss', res)
                codes.push(res.code)
            })
        })
        return codes
    }

    async function testCore() {
        const codes = await runCore()
        // console.log('codes', codes, queueTaskMaxCount)
        const codesStr = codes.join(',')
        expect(codes.length === reqNum).toBe(true)
        expect(codes[queueTaskMaxCount] === 408).toBe(true)
        // 仅2个返回了code = 0，还有一个code = 500
        expect((codesStr.match(/^0|[,]0/g) || []).length === 2).toBe(true)
        expect(codes[1] === 500).toBe(true)
        // 除了能成功加入队列的任务，其他任务返回code = 408
        expect(codes.filter(c => c === 408).length === reqNum - queueTaskMaxCount).toBe(true)
    }

    test('test queue work done', async () => await testCore())
    test('test queue use again', async () => await testCore())
})
