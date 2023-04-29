import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc'

export const chatRouter = createTRPCRouter({
	findBySid: publicProcedure.input(z.object({ sid: z.string() })).query(async ({ input, ctx }) => {
		return await ctx.prisma.chat.findUnique({
			where: {
				sid: input.sid
			}
		})
	}),

	add: protectedProcedure
		.input(z.object({ sid: z.string(), name: z.string() }))
		.mutation(async ({ input, ctx }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: 'NOT_FOUND' })
			}

			const chat = await ctx.prisma.chat.create({
				data: {
					sid: input.sid,
					name: input.name,
					ownerId: ctx.session.user.id
				}
			})

			return chat
		}),

	getAll: protectedProcedure.query(async ({ ctx }) => {
		if (!ctx.session?.user?.id) {
			throw new TRPCError({ code: 'NOT_FOUND' })
		}

		return await ctx.prisma.chat.findMany({
			where: {
				ownerId: ctx.session.user.id
			}
		})
	}),

	remove: protectedProcedure
		.input(z.object({ sid: z.string() }))
		.mutation(async ({ input, ctx }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: 'NOT_FOUND' })
			}

			const chat = await ctx.prisma.chat.findUnique({
				where: {
					sid: input.sid
				}
			})

			if (!chat) {
				console.warn('chat not found')
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Chat not found' })
			}

			if (chat.ownerId !== ctx.session.user.id) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'You are not the owner of this chat'
				})
			}

			await ctx.prisma.chat.delete({
				where: {
					sid: input.sid
				}
			})

			return true
		})
})
