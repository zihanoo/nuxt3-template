
/**
 * 服务器配置
*/
export const SERVER = {
    /**
     * 请求拦截配置（以IP为纬度限制请求数）
    */
    visitorConfig: {
        /** 计数间隔内最大请求数 */
        limit:    10,
        /** 计数间隔 */
        interval: 0.1 * 60 * 1000,
    },

    /**
     * 任务队列
    */
    queueTaskConfig: {
        /** 单批次最大并行任务数 */
        maxTaskOnce:         10,
        /** 任务批次轮询间隔 */
        taskInterval:        500,
        /** 总任务执行时间上限，任务执行时间长于本设置，将停止和清楚执行队列，并抛弃剩下的所有任务 */
        queueConsumeTimeout: 5 * 60 * 1000,
    },

    // 接口限流白名单
    ipWhitelist: [
        '127.0.0.1',
        '192.168.\\d.\\d',
        '172.16.\\d.\\d',
    ],
}
