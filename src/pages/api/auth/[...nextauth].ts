import NextAuth, { type NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@server/db/client'

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET
		}),
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				name: {
					label: 'Name',
					type: 'text',
					placeholder: 'Enter your name'
				}
			},
			async authorize(credentials, _req) {
				const user = { id: 1, name: credentials?.name ?? 'J Smith' }
				return user
			}
		})
	]
}

export default NextAuth(authOptions)
