import { describe, expect, test } from 'vitest'
import { longNumString2price, objectAssignExist } from '..'

describe('utils tests', () => {
    test('longNumString2price', () => {
        const result1 = longNumString2price('2604000000000000', 18)
        expect(result1 === '0.002604').toBe(true)

        const result2 = longNumString2price('132211000000000000', 18)
        expect(result2 === '0.132211').toBe(true)

        const result3 = longNumString2price('1732211000000000000', 18)
        expect(result3 === '1.732211').toBe(true)

        const result4 = longNumString2price('0001732211000000000000', 18)
        expect(result4 === '1.732211').toBe(true)

        const result5 = longNumString2price('00000002604000000000000', 18)
        expect(result5 === '0.002604').toBe(true)

        const result6 = longNumString2price('00000002604000000000001', 18)
        expect(result6 === '0.002604000000000001').toBe(true)

        const result7 = longNumString2price('0.2604000000000001', 18)
        expect(result7 === '0.2604000000000001').toBe(true)

        const result8 = longNumString2price('25440000000000000000', 18)
        expect(result8 === '25.44').toBe(true)
    })

    test('objectAssignExist', () => {
        const obj1 = { a: 1, b: 2, c: {}, h: {} }
        const obj1_sub = { h: { ok: 'not' } }
        obj1.h = obj1_sub.h

        const obj2 = { a: '3' }
        const obj3 = { a: 't2', d: 'cc' }
        const obj4 = { a: null, c: {}, e: 'we' }
        obj4.c = obj1_sub.h

        // 常规2个对象合并
        const result1 = objectAssignExist(obj1, obj2) as AnyObject
        expect(result1 === obj1).toBe(true)
        expect(result1.a === obj2.a).toBe(false)
        expect(result1.a === 3).toBe(true) // 强制转为目标数据类型
        expect(result1.b === obj1.b).toBe(true)

        // 常规多对象合并，并且obj1保存了原始子对象的内部链接
        const result2 = objectAssignExist(obj1, obj2, obj3) as AnyObject
        expect(result2 === obj1).toBe(true)
        expect(result2.b === obj1.b).toBe(true)
        expect(result2.a === obj3.a).toBe(true) // 无法转为number所以直接覆盖
        expect(typeof result2.d === 'undefined').toBe(true)
        expect(obj1.h === obj1_sub.h).toBe(true)
        obj1_sub.h.ok = 'yes'
        const obj1c = obj1.c as { ok: string }
        expect(obj1c?.ok === obj1_sub.h.ok).toBe(false)
        expect((obj1.h) === obj1_sub.h).toBe(true)

        // 多对象合并，后面的对象覆盖掉前面的子对象时，破坏原子对象的链接
        const result3 = objectAssignExist(obj1, obj2, obj3, obj4) as AnyObject
        expect(result3 === obj1).toBe(true)
        expect(result3.b === obj1.b).toBe(true)
        expect(result3.a === obj4.a).toBe(true)
        expect(result3.c === obj4.c).toBe(false)
        expect((result3.c || '').toString() === (obj4.c || '').toString()).toBe(true)
        expect(typeof result3.d === 'undefined').toBe(true)
        expect(typeof result3.e === 'undefined').toBe(true)
        expect(obj1.h === obj1_sub.h).toBe(true)
        expect(typeof obj1.c === 'object').toBe(true)
        if (typeof obj1.c === 'object') {
            expect(obj1.c === obj1_sub.h).toBe(false)
            const obj1c = obj1.c as { ok: string }
            expect(obj1c?.ok === obj1_sub.h.ok).toBe(true)
            obj1_sub.h.ok = 'no'
            expect(obj1c?.ok === obj1_sub.h.ok).toBe(false)
        }
    })
})
