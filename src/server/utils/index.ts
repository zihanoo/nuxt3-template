export function fetchJson(url: string) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json())
            .then((data: unknown) => resolve(data))
            .catch(reject)
    })
}


/**
 * 从字符串中提取ip地址
*/
// 包含ipv6，如 2001:0db8:85a3:0000:0000:8a2e:0370:7334
// ipv6简写，如 ::1
export function getIpsFormString(str?: string): string[] {
    const ipv4RegStr = '((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)'
    const ipv6RegStr = '(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}'
    const ipv6SortRegStr = '((?:[0-9A-Fa-f]{1,4}(?::[0-9A-Fa-f]{1,4})*)?)::((?:[0-9A-Fa-f]{1,4}(?::[0-9A-Fa-f]{1,4})*)?)'
    const ipsReg = new RegExp(ipv4RegStr + '|' + ipv6RegStr + '|' + ipv6SortRegStr, 'g')
    return ((str || '').match(ipsReg) || [])
}

/**
 * 序列化
 * （不包含?号的）
*/
export function serialize(obj: object) {
    let result = ''
    Object.keys(obj).forEach((key) => {
        const k = key as keyof object
        result += key + '=' + obj[k] + '&'
    })
    return result.replace(/&$/, '')
}

/**
 * 清除空字段
*/
export function clearObj<T>(targetObj: T): T {
    const result: T = {} as T
    // 清除空条件
    for (const key in targetObj) {
        const k = key as keyof T
        const d = targetObj[k]
        if (d || d === 0) {
            result[k] = d
        }
    }
    return result
}
