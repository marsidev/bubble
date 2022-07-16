import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter } from './context'

export const chatRouter = createRouter()
	.middleware(async ({ ctx, next }) => {
		if (!ctx.session) {
			throw new TRPCError({ code: 'UNAUTHORIZED' })
		}
		return next()
	})
	.mutation('add', {
		input: z.object({
			sid: z.string(),
			name: z.string()
		}),
		async resolve({ ctx, input }) {
			const user = await ctx.prisma.user.findUnique({
				where: { email: ctx.session?.user?.email ?? '' }
			})

			if (!user) {
				throw new TRPCError({ code: 'NOT_FOUND' })
			}

			const chat = await ctx.prisma.chat.create({
				data: {
					sid: input.sid,
					name: input.name,
					ownerId: user!.id
				}
			})

			return chat
		}
	})
	.query('getAll', {
		async resolve({ ctx }) {
			const user = await ctx.prisma.user.findUnique({
				where: { email: ctx.session?.user?.email ?? '' }
			})

			if (!user) {
				throw new TRPCError({ code: 'NOT_FOUND' })
			}

			return await ctx.prisma.chat.findMany({
				where: {
					ownerId: user!.id
				}
			})
		}
	})
