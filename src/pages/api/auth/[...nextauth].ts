import type { JWT } from 'next-auth/jwt'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import jwt from 'jsonwebtoken'
import { prisma } from '@server/db/client'
import { CustomPrismaAdapter } from '@server/db/adapter'

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
	throw new Error('GITHUB_ID and GITHUB_SECRET must be set')
}

export const authOptions: NextAuthOptions = {
	adapter: CustomPrismaAdapter(prisma),
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET
		})
	],
	callbacks: {
		async session({ session, token }) {
			// console.log('session callback', { session, token })
			session.userId = token.sub

			const encodedToken = jwt.sign(token as JWT, process.env.NEXTAUTH_SECRET as string)
			if (encodedToken) {
				session.token = encodedToken
			}

			return Promise.resolve(session)
		}
	},
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: 'jwt'
	}
}

export default NextAuth(authOptions)
