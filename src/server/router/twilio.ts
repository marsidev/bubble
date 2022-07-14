// import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter } from './context'

const serviceUrl = process.env.TWILIO_TOKEN_SERVICE_URL

interface ServiceToken {
	success: boolean
	accessToken: string
}

export const twilioRouter = createRouter()
	.middleware(async ({ ctx, next }) => {
		if (!ctx.session) {
			throw new TRPCError({ code: 'UNAUTHORIZED' })
		}
		return next()
	})
	.query('getToken', {
		async resolve({ ctx }) {
			if (!serviceUrl) {
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
			}

			const user = await ctx.prisma.user.findUnique({
				where: { email: ctx.session?.user?.email ?? '' }
			})

			if (!user) {
				throw new TRPCError({ code: 'NOT_FOUND' })
			}

			const identity = user.id
			const serviceResponse = await fetch(`${serviceUrl}?identity=${identity}`)
			const data = await serviceResponse.json()
			const { accessToken } = data as ServiceToken

			return { accessToken }
		}
	})
