import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 只对 API 路由进行基本保护
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/api/:path*']
} 