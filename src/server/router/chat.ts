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
			if (!ctx.session?.userId) {
				throw new TRPCError({ code: 'NOT_FOUND' })
			}

			const chat = await ctx.prisma.chat.create({
				data: {
					sid: input.sid,
					name: input.name,
					ownerId: ctx.session.userId
				}
			})

			return chat
		}
	})
	.query('getAll', {
		async resolve({ ctx }) {
			if (!ctx.session?.userId) {
				throw new TRPCError({ code: 'NOT_FOUND' })
			}

			return await ctx.prisma.chat.findMany({
				where: {
					ownerId: ctx.session.userId
				}
			})
		}
	})
