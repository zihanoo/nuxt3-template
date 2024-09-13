// 重构csv数据为数组数据
type CsvArrData = [string[], AnyObject[]]
/**
 * CSV转为数据对象
 * @description 注意，数据是清除"双引号的
 * @param {string} resText csv原始数据text
 * @param {[number, number]} titleOrigin 标题原点坐标
 * @return {CsvArrData} [标题数组，数据数组]
 */
export function csvToArr(resText: string, titleOrigin: [number, number]): CsvArrData {
    // 总数据
    const rows = resText.match(/[^\r]*(\r)?/g) || []
    // 标题行
    const titles = rows[titleOrigin[1]].replace(/"|\n|\r/g, '').split(',') || []
    titles.splice(0, titleOrigin[0])

    const data: AnyObject[] = []
    // 数据行：除标题以外的数据
    rows.splice(0, titleOrigin[1] + 1)
    // 转化为以标题名称为key的数据对象
    rows.forEach((d) => {
        d = d.replace(/\r\n$/, '').replace(/"/g, '').replace(/ *, */g, ',').trim()
        if (!d || /^,*$/.test(d)) return

        const arr = d.split(',')
        const item: AnyObject = {}
        titles.forEach((n, i) => {
            if (n && !item[n]) item[n] = arr[i + titleOrigin[0]]
        })
        data.push(item)
    })
    return [titles, data]
}

/**
 * 转换超长数值文本为浮点数（默认18位）
*/
export function longNumString2price(str: string, len = 18) {
    if (str.indexOf('.') !== -1) return str

    str = (str || '').replace(/^0*/, '')
    const leftStr = str.substring(0, str.length - len) || '0'
    let rightStr = str.replace(new RegExp('^' + leftStr), '')
    if (len > str.length) rightStr = Array(len - str.length + 1).join('0') + rightStr
    const result = leftStr + '.' + rightStr.replace(/0*$/, '')
    return result
}

export function debounce<T>(fn: (...args: T[]) => void, delay?: number) {
    let timer: NodeJS.Timeout
    return function core(...args: T[]) {
        clearTimeout(timer)
        return timer = setTimeout(() => {
            fn.apply(core, args)
        }, delay || 200)
    }
}

/**
 * 合并对象（以第一个对象有的key才合并）
 *
 * 合并后的结果特性与Object.assgin保持一致（本合并会尝试转化string和number保持为第一个对象一致）
 *
 * 如果不想重置已有对象存在的值，请不要传入该key的对象，应为只要存在key，即使为空也回覆盖为空值。
*/
export function objectAssignExist(...args: object[]) {
    if (!args[0]) return {}
    if (!args[1]) return args[0]

    if (args.length > 2) {
        args[1] = Object.assign(args[1], ...args.slice(2))
    }

    const target = args[0] as AnyObject
    let other
    try {
        // 解除了除第一个对象以外的所有对象的深度链接
        other = JSON.parse(JSON.stringify(args[1]))
    }
    catch (err) {
        console.error('objectAssignExist error', err)
    }

    if (other) {
        for (const key in target) {
            if (typeof other[key] === 'undefined') continue

            if (typeof target[key] === 'string' && typeof other[key] === 'number') {
                target[key] = other[key].toString()
            }
            else if (typeof target[key] === 'number' && typeof other[key] === 'string' && Number(other[key]).toString() !== 'NaN') {
                target[key] = Number(other[key])
            }
            else {
                target[key] = other[key]
            }
        }
    }
    // console.log('args', args)
    return target
}
