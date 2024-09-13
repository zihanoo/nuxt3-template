import { describe, expect, test } from 'vitest'
import { getIpsFormString } from '~/server/utils'


describe('getIpsFormString', () => {
    test('nomarl', () => {
        const ipsStr = '1.1.1.1, 114.248.238.236,192.168.1.1'
        const ips = getIpsFormString(ipsStr)
        expect(ips.length === 3).toBe(true)
        expect(ips[0] === '1.1.1.1').toBe(true)
        expect(ips[1] === '114.248.238.236').toBe(true)
        expect(ips[2] === '192.168.1.1').toBe(true)
    })
    test('other chars', () => {
        const ipsStr = 'unknown, <>"1.1.1.1, 114.248.238.236,\'>>2001:0db8:85a3:0000:0000:8a2e:0370:7334,::1'
        const ips = getIpsFormString(ipsStr)
        expect(ips.length === 4).toBe(true)
        expect(ips[0] === '1.1.1.1').toBe(true)
        expect(ips[1] === '114.248.238.236').toBe(true)
        expect(ips[2] === '2001:0db8:85a3:0000:0000:8a2e:0370:7334').toBe(true)
        expect(ips[3] === '::1').toBe(true)
    })
})
