import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export default clerkMiddleware({
  afterAuth(auth, req, evt) {
    if (!auth.userId && !req.nextUrl.pathname.startsWith('/sign-in')) {
      const signInUrl = new URL('/sign-in', req.url)
      return NextResponse.redirect(signInUrl)
    }
    return NextResponse.next()
  }
})

export const config = {
  matcher: [
    '/((?!.*\\..*|_next|favicon.ico|sign-in|sign-up|api/public|api/.*|public).*)',
  ],
}
