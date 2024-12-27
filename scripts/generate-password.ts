import { md5 } from '../lib/utils'

const password = '123456'
console.log(`Password: ${password}`)
console.log(`MD5 Hash: ${md5(password)}`) 