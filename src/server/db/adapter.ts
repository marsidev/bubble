/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
// https://github.com/nextauthjs/next-auth/blob/main/packages/adapter-prisma/src/index.ts
import type { Adapter } from 'next-auth/adapters'
import type { Prisma, PrismaClient } from '.prisma/client'

export function CustomPrismaAdapter(p: PrismaClient): Adapter {
	return {
		createUser: data => p.user.create({ data }),

		getUser: id => p.user.findUnique({ where: { id } }),

		getUserByEmail: email => p.user.findUnique({ where: { email } }),

		async getUserByAccount(provider_providerAccountId) {
			const account = await p.account.findUnique({
				where: { provider_providerAccountId },
				select: { user: true }
			})
			return account?.user ?? null
		},

		updateUser: ({ id, ...data }) => p.user.update({ where: { id }, data }),

		deleteUser: id => p.user.delete({ where: { id } }),

		linkAccount: ({ refresh_token_expires_in: _, ...data }) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return p.account.create({ data }) as any
		},

		unlinkAccount: provider_providerAccountId =>
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			p.account.delete({ where: { provider_providerAccountId } }) as any,

		async getSessionAndUser(sessionToken) {
			const userAndSession = await p.session.findUnique({
				where: { sessionToken },
				include: { user: true }
			})
			if (!userAndSession) return null
			const { user, ...session } = userAndSession
			return { user, session }
		},

		createSession: data => p.session.create({ data }),

		updateSession: data =>
			p.session.update({ where: { sessionToken: data.sessionToken }, data }),

		deleteSession: sessionToken =>
			p.session.delete({ where: { sessionToken } }),

		async createVerificationToken(data) {
			// @ts-ignore
			const { id: _, ...verificationToken } = await p.verificationToken.create({
				data
			})
			return verificationToken
		},

		async useVerificationToken(identifier_token) {
			try {
				// @ts-ignore
				const { id: _, ...verificationToken } =
					await p.verificationToken.delete({ where: { identifier_token } })
				return verificationToken
			} catch (error) {
				// If token already used/deleted, just return null
				// https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
				if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
					return null
				}
				throw error
			}
		}
	}
}
