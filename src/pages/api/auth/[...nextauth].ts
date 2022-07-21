import type { JWT } from 'next-auth/jwt'
import NextAuth, {
	type NextAuthOptions,
	type Session as NextAuthSession,
	type User
} from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import jwt from 'jsonwebtoken'
import { prisma } from '@server/db/client'
import { CustomPrismaAdapter } from '@server/db/adapter'

export interface Session extends NextAuthSession {
	user?: {
		name?: string | null
		email?: string | null
		image?: string | null
		id?: string | null | undefined
		username?: string | null | undefined
	}
	expires: string
	token?: string
}

interface SessionCallback {
	session: Session
	user: User
	token: JWT
}

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
	throw new Error('GITHUB_ID and GITHUB_SECRET must be set')
}

export const authOptions: NextAuthOptions = {
	adapter: CustomPrismaAdapter(prisma),
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET
		}),
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' }
			},
			async authorize(credentials) {
				const user = await prisma.user.findUnique({
					where: {
						email: credentials?.email
					}
				})

				if (user) {
					return user
				} else {
					return null
				}
			}
		})
	],
	callbacks: {
		async session({ session, token }: SessionCallback) {
			if (session.user) {
				session.user.id = token.sub
			}

			const encodedToken = jwt.sign(
				token as JWT,
				process.env.NEXTAUTH_SECRET as string
			)
			session.token = encodedToken
			return Promise.resolve(session)
		}
	},
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: 'jwt'
	}
}

export default NextAuth(authOptions)
