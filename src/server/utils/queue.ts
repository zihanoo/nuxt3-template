import apiResponse from './apiResponse'

export type QueueResponse<T> = Promise<Promise<ApiResponse.Res<T>> | ApiResponse.Res<T>>
export type QueueInstance<T> = <U>(fn: (...args: U[]) => Promise<ApiResponse.Res<T>>, ...args: U[]) => QueueResponse<T>
/**
 * 并发任务队列
 * @param {number} maxTaskOnce 并发任务数，并发的任务需要等待任务完成才视为任务执行完成
 * @param {number} taskInterval 并发时间跨度，并发任务会在并发时间跨度内随机分布请求发起时间
 * @param {number} queueConsumeTimeout 总队列任务最小消费时间，指这个时间内，反计算出最大队列容忍任务排队数量，当超过该数量的任务将被抛弃。
 * 直到任务数少于这个数，才允许重新加入队列，那些被抛弃的任务将无法找回。
 *
 * 仅当队列被消化掉所有任务时，再次插入任务时，将重置计数总队列任务执行时间
 * @return {QueueInstance}
*/
export function queueTask<T>(
    maxTaskOnce: number = 10,
    taskInterval: number = 500,
    queueConsumeTimeout: number = 5 * 60 * 1000,
): QueueInstance<T> {
    const queue: Array<NodeJS.Timeout> = []
    const queueTaskMaxCount = queueConsumeTimeout / taskInterval * maxTaskOnce

    const queueCore: QueueInstance<T> = function (fn, ...args) {
        return new Promise((resolve) => {
            // 超过最大队列容忍任务排队数量，当前任务被抛弃并返回408错误。
            if (queue.length >= queueTaskMaxCount) {
                const data = apiResponse<T>(null, 408, 'Queue tasks are max, please try again in a few minutes.')
                resolve(data)
                // console.warn('Queue tasks are max, do not join new task, dump this new task')
                return
            }

            let queueIndex: number = 0

            // 在taskInterval内随机分布执行队列
            const innerInterval = Math.ceil((taskInterval * 2 / (maxTaskOnce + 1)) * Math.random())
            const timer = setInterval(taskCore, taskInterval / maxTaskOnce)
            queue.push(timer) // 入列
            // 第一次轮询直接执行
            taskCore()
            function taskCore() {
                queueIndex = queue.indexOf(timer)
                // 任务在可并发执行周期内，则直接执行，否则等待轮询
                if (queueIndex >= maxTaskOnce) return

                // 开始执行任务时，清除该任务定时，
                // 但依旧保留队列占位，直到任务执行完成后再清除队列
                clearInterval(timer)
                setTimeout(() => {
                    try {
                        const exc = fn.apply(fn, args)
                        resolve(exc)
                        exc.finally(() => {
                            // 执行完成之后移除队列
                            queueIndex = queue.indexOf(timer)
                            if (queueIndex >= 0) {
                                // 移除队列
                                queue.splice(queueIndex, 1)
                            }
                        })
                    }
                    catch (err) {
                        console.error('Queue task run error inner', err)
                        const data = apiResponse<T>(null, 500, 'Queue task run error.')
                        resolve(data)
                    }
                    // 第一个任务总是直接执行
                }, queueIndex === 0 ? 0 : innerInterval)
            }
        })
    }

    return queueCore
}
