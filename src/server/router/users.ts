import { z } from 'zod'
import { createRouter } from './context'

export const usersRouter = createRouter()
	.query('findByEmail', {
		input: z.object({
			email: z.string().email()
		}),
		async resolve({ ctx, input }) {
			return await ctx.prisma.user.findUnique({
				where: {
					email: input.email
				}
			})
		}
	})
	.query('findManyByEmails', {
		input: z.object({
			emails: z.array(z.string().email().nullish())
		}),
		async resolve({ ctx, input }) {
			if (!input.emails) return []

			for (const email of input.emails) {
				if (!email) return []
				if (typeof email !== 'string') return []
			}

			return await ctx.prisma.user.findMany({
				where: {
					email: {
						in: input.emails as string[]
					}
				}
			})
		}
	})
