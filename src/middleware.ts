import { JWT } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { type NextRequest, NextResponse } from 'next/server'

type NextAuthRequest = NextRequest & { nextauth: { token: JWT | null } }

export default withAuth(
	req => {
		const { pathname } = req.nextUrl
		const hasToken = Boolean((req as NextAuthRequest).nextauth.token)
		const isHome = pathname === '/'

		if (!isHome && !hasToken) {
			return NextResponse.redirect(new URL('/', req.url))
		}

		if (isHome && hasToken) {
			return NextResponse.redirect(new URL('/chats', req.url))
		}

		return NextResponse.next()
	},
	{
		callbacks: {
			authorized() {
				return true
			}
		}
	}
)

export const config = {
	matcher: ['/', '/chats', '/chats/:path*']
}
