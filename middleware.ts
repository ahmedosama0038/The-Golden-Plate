import { NextRequest, NextResponse } from 'next/server'

// 🎯 غيرنا الاسم لـ middleware عشان Next.js يفهمه ويشغله تلقائي
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const path  = request.nextUrl.pathname

  // لو المستخدم رايح لصفحة اللوجين الرئيسية (/admin)، سيبه يعدي عادي عشان يعرف يسجل دخول
  if (path === '/admin') {
    return NextResponse.next()
  }

  // لو رايح لأي صفحة تانية جوه الأدمن ومعهوش Token، اطرده لصفحة اللوجين
  if (!token) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

// الـ matcher ده معناه: راقب أي مسار بيبدأ بـ /admin
export const config = {
  matcher: '/admin/:path*',
}