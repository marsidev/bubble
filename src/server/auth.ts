import type { JWT } from 'next-auth/jwt'
import { type DefaultSession, type NextAuthOptions, getServerSession } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import jwt from 'jsonwebtoken'
import { GetServerSidePropsContext } from 'next'
import { env } from '~/env.mjs'
import { prisma } from '~/server/db'
import { PrismaAdapter } from './auth-adapter'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			id?: string | null | undefined
			username?: string | null | undefined
			// ...other properties
			// role: UserRole;
		} & DefaultSession['user']
		expires: string
		// token?: JWT
		token?: string
	}

	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GithubProvider({
			clientId: env.GITHUB_ID,
			clientSecret: env.GITHUB_SECRET
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
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.sub
			}

			const encodedToken = jwt.sign(token as JWT, env.NEXTAUTH_SECRET as string)
			session.token = encodedToken
			return Promise.resolve(session)
		}
	},
	secret: env.NEXTAUTH_SECRET,
	session: {
		strategy: 'jwt'
	}
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
	req: GetServerSidePropsContext['req']
	res: GetServerSidePropsContext['res']
}) => {
	return getServerSession(ctx.req, ctx.res, authOptions)
}
