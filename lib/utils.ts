import CryptoJS from 'crypto-js'

export function md5(text: string): string {
  return CryptoJS.MD5(text).toString()
} 