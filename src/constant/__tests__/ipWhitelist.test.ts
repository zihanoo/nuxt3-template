import { describe, expect, test } from 'vitest'
import { SERVER } from '..'


describe('ipWhitelist', () => {
    test('LAN', () => {
        const lanIps = [
            '127.0.0.1',
            '192.168.1.1',
            '192.168.250.254',
            '172.16.0.22',
        ]
        const result = lanIps.join(',').match(new RegExp(SERVER.ipWhitelist.join('|'), 'g')) || []
        expect(result.length === 4).toBe(true)
        expect(result[1] === '192.168.1.1').toBe(true)
    })
})
