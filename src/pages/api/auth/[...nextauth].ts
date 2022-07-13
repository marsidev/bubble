import NextAuth, { type NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { prisma } from '@server/db/client'
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { CustomPrismaAdapter } from '@server/db/adapter'

export const authOptions: NextAuthOptions = {
	adapter: CustomPrismaAdapter(prisma),
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET
		})
	],
	callbacks: {
		// async jwt({ token, account }) {
		// 	if (account) {
		// 		token.accessToken = account.access_token
		// 	}
		// 	return token
		// },
		async session({ session, user }) {
			return {
				// ...token,
				...session,
				user
			}
		}
	}
}

export default NextAuth(authOptions)
