import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter } from './context'

export interface ServiceToken {
	success: boolean
	accessToken: string
}

export const twilioRouter = createRouter()
	.mutation('getAuthToken', {
		input: z.object({
			identity: z.string(),
			ttl: z.number().default(3600)
		}),
		async resolve({ input }) {
			const url = process.env.NEXT_PUBLIC_TWILIO_TOKEN_SERVICE_URL

			const { identity, ttl } = input
			const query = new URLSearchParams({ identity, ttl: ttl.toString() })
			const res = await fetch(`${url}?${query}`)
			const data = (await res.json()) as ServiceToken

			if (!data.success) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
			return data.accessToken
		}
	})
