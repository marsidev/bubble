import type { JWT } from 'next-auth/jwt'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import jwt from 'jsonwebtoken'
import { prisma } from '@server/db/client'
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
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
		// async jwt({ token, user }) {
		// 	if (user) {
		// 		// console.log('jwt callback', { token, user })
		// 		token.name = user.name
		// 		token.sub = String(user.id)
		// 		token.accessToken = user.access_token
		// 	}
		// 	return Promise.resolve(token)
		// },

		async session({ session, token }) {
			// console.log('session callback', { session, token })
			const encodedToken = jwt.sign(token as JWT, process.env.NEXTAUTH_SECRET as string)
			if (encodedToken) {
				session.token = encodedToken
			}
			return Promise.resolve(session)
		}
	},
	// jwt: {
	// 	maxAge: 60 * 60 * 24 * 30,
	// 	async encode({ secret, token }) {
	// 		// console.log('encode token', { token })
	// 		return Promise.resolve(jwt.sign(token as JWT, secret))
	// 	},
	// 	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// 	// @ts-ignore
	// 	async decode({ secret, token }) {
	// 		// console.log('decode token', { token })
	// 		return Promise.resolve(jwt.verify(String(token), secret))
	// 	}
	// },
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: 'jwt'
	}
}

export default NextAuth(authOptions)
