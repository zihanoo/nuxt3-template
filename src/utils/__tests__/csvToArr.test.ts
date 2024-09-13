import { describe, expect, test } from 'vitest'
import { csvToArr } from '@/utils/index'

import { getFile } from '@/server/utils/getFile'

describe('util test', async () => {
    const data = await getFile('../../server/data/coordinates.csv')
    const response = csvToArr(data, [1, 1])

    test('CSV转为数据对象: csvToArr', () => {
        expect(Array.isArray(response)).toBe(true)
        expect(response.length === 2).toBe(true)
        expect(response[0][0] ? typeof response[0][0] === 'string' : true).toBe(true)
        expect(response[1][0] ? typeof response[1][0] === 'object' : true).toBe(true)
    })
})
