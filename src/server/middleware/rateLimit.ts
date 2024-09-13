import { SERVER } from '~/constant'
import limitInterval from '../utils/limitIntarval'
import { getIpsFormString } from '../utils'

const limitIntarvalInstance = limitInterval(SERVER.visitorConfig.limit, SERVER.visitorConfig.interval)

/**
 * 请求拦截，以IP为纬度限制请求数
 *
 * 需要进行nginx服务转发配置才能利用nginx获取用户真实ip
 * nuxt内部页面访问接口会无ip，无法达到限制的作用，需要nginx设置并发
 ```
 proxy_set_header X-Real-IP $remote_addr;
 proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
```
*/
export default defineEventHandler(async (event) => {
    const reqUrl = getRequestURL(event)
    // console.log('reqUrl.pathname', reqUrl.pathname)
    if (reqUrl.pathname.match(/\/api/)) {
        const headers = getRequestHeaders(event)
        const ipsString = getIpsFormString(headers['x-forwarded-for'])

        // 开发的时候一直保持check
        // 生产环境则有ip并且非白名单需要check
        const ip = ipsString[ipsString.length - 1]
        const isIpWhitelist = new RegExp(SERVER.ipWhitelist.join('|'), 'g').test(ip)
        const mustCheck = process.env.NODE_ENV === 'development' ? true : (ip && !isIpWhitelist)
        if (mustCheck) {
            const result = await limitIntarvalInstance(ip)
            if (result === false) {
                const msg = 'Many requests, please try again in a few minutes.'
                console.error(msg + ', ip:' + ip + ', referer:' + headers.referer)
                // return await apiResponse(null, 405, msg)
                throw createError({ statusCode: 405, statusMessage: msg })
            }
        }
    }
})
