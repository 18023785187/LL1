import path from 'path'
import { fileURLToPath } from 'url'

// es module 不能直接获取 __dirname,需要手动获取
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function resolve(...paths) {
    return path.resolve(__dirname, ...paths)
}
