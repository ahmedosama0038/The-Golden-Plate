import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const path  = request.nextUrl.pathname

  // صفحة /admin نفسها = صفحة اللوجين → مش محتاجة token
  if (path === '/admin') return NextResponse.next()

  // باقي صفحات الأدمن محتاجة token
  if (!token) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }
}

export const config = {
  matcher: '/admin/:path*',
}