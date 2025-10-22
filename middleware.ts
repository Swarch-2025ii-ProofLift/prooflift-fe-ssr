import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  const token = req.cookies.get('access_token')?.value

  const publicPaths = ['/', '/login', '/register', '/forgot-password']
  const isPublicPath = publicPaths.includes(pathname)

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/feed', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot)).*)'],
}