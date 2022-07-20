import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { getBaseUrl } from '~/pages/_app'
import { decrypt, encrypt } from '@utils/encryption'
import { createRouter } from './context'
import { ServiceToken } from './twilio'

export const inviteRouter = createRouter()
	.query('decryptInvitationLink', {
		input: z.object({
			data: z.string()
		}),
		async resolve({ ctx, input }) {
			// decrypt the data and check if has expected params
			const decrypted = decrypt(input.data)
			const [hostIdentity, chatSid, expires] = decrypted.split(',')

			if (!hostIdentity || !chatSid || !expires) {
				throw new TRPCError({
					code: 'PARSE_ERROR',
					message: 'Invitation link broken 💔'
				})
			}

			// check if invitation link is expired
			const now = new Date().getTime()
			const expiresDate = new Date(expires).getTime()

			if (now > expiresDate) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'Invitation link has expired ⌛'
				})
			}

			// check if host and chat exists in db
			const host = await ctx.prisma.user.findUnique({
				where: {
					email: hostIdentity
				}
			})

			if (!host) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Chat host not found 🔎'
				})
			}

			const chat = await ctx.prisma.chat.findUnique({
				where: {
					sid: chatSid
				}
			})

			if (!chat) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Chat not found 🔎'
				})
			}

			// get access token
			const tokenServiceUrl = process.env.NEXT_PUBLIC_TWILIO_TOKEN_SERVICE_URL
			const query = new URLSearchParams({
				identity: hostIdentity,
				ttl: '3600'
			})
			const res = await fetch(`${tokenServiceUrl}?${query}`)
			const tokenData = (await res.json()) as ServiceToken

			if (!tokenData.success) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Failed to get access token'
				})
			}

			const { accessToken } = tokenData
			return { host, chat, accessToken }
		}
	})
	.mutation('getInvitationLink', {
		input: z.object({
			chatSid: z.string().length(34),
			ttl: z.number().default(3600)
		}),
		async resolve({ ctx, input }) {
			const email = ctx.session?.user?.email

			if (!email) {
				throw new TRPCError({ code: 'UNAUTHORIZED' })
			}

			const expires = new Date().getTime() + (input.ttl * 1000)
			const stringToEncrypt = `${email},${input.chatSid},${expires}`
			const encrypted = encrypt(stringToEncrypt)

			const baseUrl = getBaseUrl()
			return `${baseUrl}/invite?data=${encrypted}`
		}
	})
