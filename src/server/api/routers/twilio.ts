import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { env } from '~/env.mjs'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

export interface ServiceToken {
	success: boolean
	accessToken: string
}

export const twilioRouter = createTRPCRouter({
	getAuthToken: publicProcedure
		.input(
			z.object({
				identity: z.string(),
				ttl: z.number().default(3600)
			})
		)
		.mutation(async ({ input }) => {
			const url = env.NEXT_PUBLIC_TWILIO_TOKEN_SERVICE_URL

			const { identity, ttl } = input
			const query = new URLSearchParams({ identity, ttl: ttl.toString() })
			const res = await fetch(`${url}?${query}`)
			const data = (await res.json()) as ServiceToken

			if (!data.success) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
			return data.accessToken
		})
})
