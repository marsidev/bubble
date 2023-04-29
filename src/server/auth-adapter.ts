/* eslint-disable @typescript-eslint/ban-ts-comment */
// https://github.com/nextauthjs/next-auth/blob/main/packages/adapter-prisma/src/index.ts
import type { Adapter, AdapterSession, AdapterUser } from 'next-auth/adapters'
import type { Prisma, PrismaClient } from '@prisma/client'
import { Awaitable } from 'next-auth'

export function PrismaAdapter(p: PrismaClient): Adapter {
	return {
		createUser: data => p.user.create({ data }) as Awaitable<AdapterUser>,

		getUser: id => p.user.findUnique({ where: { id } }) as Awaitable<AdapterUser>,

		getUserByEmail: email => p.user.findUnique({ where: { email } }) as Awaitable<AdapterUser>,

		async getUserByAccount(provider_providerAccountId) {
			const account = await p.account.findUnique({
				where: { provider_providerAccountId },
				select: { user: true }
			})
			return (account?.user ?? null) as Awaitable<AdapterUser | null>
		},

		updateUser: ({ id, ...data }) =>
			p.user.update({ where: { id }, data }) as Awaitable<AdapterUser>,

		deleteUser: id =>
			p.user.delete({ where: { id } }) as Promise<void> | Awaitable<AdapterUser | null | undefined>,

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

			const result: Awaitable<{
				session: AdapterSession
				user: AdapterUser
			} | null> = { user: user as AdapterUser, session }

			return result
		},

		createSession: data => p.session.create({ data }),

		updateSession: data => p.session.update({ where: { sessionToken: data.sessionToken }, data }),

		deleteSession: sessionToken => p.session.delete({ where: { sessionToken } }),

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
				const { id: _, ...verificationToken } = await p.verificationToken.delete({
					where: { identifier_token }
				})
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
