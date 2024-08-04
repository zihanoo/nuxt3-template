import fs from 'fs'
import { fileURLToPath } from 'node:url'

export function getFile(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!url) return reject('getFile not have file url')

        const filePath = fileURLToPath(new URL(url, import.meta.url))
        // console.log('filePath', filePath)
        fs.readFile(filePath, null, (err, data) => {
            if (err) return console.error('Get server file error', err)

            const result = new TextDecoder().decode(data)
            resolve(result)
        })
    })
}
