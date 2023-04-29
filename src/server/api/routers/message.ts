import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { decrypt, encrypt } from '~/utils/encryption'

export const messageRouter = createTRPCRouter({
	encrypt: protectedProcedure.input(z.object({ message: z.string() })).mutation(({ input }) => {
		return encrypt(input.message)
	}),

	decrypt: protectedProcedure
		.input(z.object({ encrypted: z.string().nullish() }))
		.output(z.string())
		.query(({ input }) => {
			const { encrypted } = input
			if (!encrypted) return ''
			return decrypt(encrypted)
		})
})
