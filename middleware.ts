import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 对登录后才能访问的页面进行保护
  if (request.nextUrl.pathname.startsWith('/settings')) {
    // 在这里添加认证逻辑
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/settings/:path*'  // 只对 settings 页面进行认证检查
  ]
} 