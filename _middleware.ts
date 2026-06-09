import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // السماح بصفحة اللوجين
  if (pathname === '/admin') {
    return NextResponse.next()
  }

  // حماية باقي صفحات الأدمن
  if (!token) {
    const loginUrl = new URL('/admin', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}