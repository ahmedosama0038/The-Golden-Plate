import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL

async function handler(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params
  const url = `${API_URL}/${path.join('/')}${req.nextUrl.search}`

  // 1) الجرسون يفتح الظرف ويقرا الكارنيه
  const token = (await cookies()).get('token')?.value

  const headers: Record<string, string> = { Accept: 'application/json' }
  const contentType = req.headers.get('content-type')
  if (contentType) headers['Content-Type'] = contentType

  // 2) يكتب الكارنيه على الطلب
  if (token) headers['Authorization'] = `Bearer ${token}`

  // 3) يوصّل الطلب لمطبخ ريم
  const hasBody = !['GET', 'HEAD'].includes(req.method)
  const res = await fetch(url, {
    method: req.method,
    headers,
    body: hasBody ? await req.arrayBuffer() : undefined,
    cache: 'no-store',
  })

  // 4) يرجّع الرد للزبون زي ما هو
  const data = await res.arrayBuffer()
  return new NextResponse(data, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('content-type') ?? 'application/json',
    },
  })
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
}