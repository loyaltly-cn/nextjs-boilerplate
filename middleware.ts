import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  })

  const isAuthPage = request.nextUrl.pathname === '/login' || 
                    request.nextUrl.pathname === '/register'

  // 已登录用户访问登录页，重定向到首页
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 未登录用户访问任何非认证页面，重定向到登录页
  if (!isAuthPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径，包括根路径 /
     * 但排除 api 路由和静态资源
     */
    '/',
    '/((?!api|_next/static|server|_next/image|favicon.ico|login|register).*)'
  ]
} 