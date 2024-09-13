
interface VisItem {
    count:       number
    startTime:   number
    removeTimer: NodeJS.Timeout | null // 自我清除的倒计时，避免无限膨胀
    flag?:       string // 仅做标识注明用
}
/**
 * 执行间隔
 *
 * 下次访问时，会自动计算免除响应段访问计数，当前累计计数：`剩余累计 - 最后一次与前一次时间间隔 / interval * limit`
 *
 * 例如：limit设置为10，interval时间段设置为5000(ms)，连续访问8次后，第9次访问时是在第3s，
 * 那么此时的之前累计的计数实际是（这里忽略前8次快速访问实际间隔）：`8 - 3000/5000 * 10 = 2`，
 * 同时将此时的时间设置为开始计数时间。
 * @param {number} limit 在interval内访问限制次数
 * @param {number} interval 时间段(ms)
 *
 * eg:
 *
 * `const limitIntarvalInstance = limitInterval(visConfig.limit, visConfig.interval)`
 *
 * `await limitIntarvalInstance(ip)`
 * 实例返回false说明已达上限
*/
export default function limitInterval(limit: number, interval: number) {
    const visitor: Map<string, VisItem> = new Map()

    return function (key: string): Promise<boolean> {
        return new Promise((resolve) => {
            const nowTime = new Date().getTime()

            const vsip = visitor.get(key)
            if (vsip) {
                // 计数过去的时间减免的访问计数
                const timeRate = (nowTime - vsip.startTime) / interval
                const exemptCount = Math.floor(timeRate * limit)
                const surplusCount = vsip.count - exemptCount
                vsip.count = surplusCount < 0 ? 0 : surplusCount
                vsip.startTime = nowTime // 结算了之前的计数，就重设开始时间

                // 访问就计数，因此超过限制依旧进行访问会一直累计计数，会让这种用户限制更长的时间
                vsip.count++
                // 已达上限则返回false
                if (vsip.count > limit) {
                    console.error(`The ${key} is up to limit ${limit}, current is ${vsip.count}`)
                    resolve(false)
                }
                else {
                    resolve(true)
                }
            }
            else {
                // console.log('set visitor', key)
                setVisitor(key, 1)
                resolve(true)
            }

            function setVisitor(key: string, count: number) {
                visitor.set(key, {
                    flag:        key,
                    count:       count,
                    startTime:   nowTime,
                    removeTimer: removeTimer(key),
                })

                // 定时清除缓存，以免无限膨胀
                function removeTimer(key: string) {
                    return setInterval(() => {
                        const _vsip = visitor.get(key)
                        if (_vsip && _vsip.count <= 0) {
                            clearInterval(_vsip.removeTimer || 0)
                            visitor.delete(key)
                        }
                    }, 3 * 60 * 1000)
                }
            }
        })
    }
}
