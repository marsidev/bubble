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
