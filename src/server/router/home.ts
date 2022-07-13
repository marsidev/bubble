import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter } from './context'

export const homeRouter = createRouter()
	.query('hello', {
		input: z
			.object({
				text: z.string().nullish()
			})
			.nullish(),
		resolve({ input }) {
			return {
				greeting: `Hello ${input?.text ?? 'world'}`
			}
		}
	})
	.middleware(async ({ ctx, next }) => {
		if (!ctx.session) {
			throw new TRPCError({ code: 'UNAUTHORIZED' })
		}
		return next()
	})
	.mutation('add', {
		input: z
			.object({
				title: z.string(),
				description: z.string().nullish(),
				price: z.number().nullish(),
				image: z.string().nullish(),
				guests: z.number().nullish(),
				beds: z.number().nullish(),
				baths: z.number().nullish()
			})
			.nullish(),
		async resolve({ ctx, input }) {
			const user = await ctx.prisma.user.findUnique({
				where: { email: ctx.session?.user?.email ?? '' }
			})

			const home = await ctx.prisma.home.create({
				data: {
					title: input?.title ?? '',
					description: input?.description ?? '',
					price: input?.price ?? 100,
					guests: input?.guests ?? 0,
					beds: input?.beds ?? 0,
					baths: input?.baths ?? 0,
					ownerId: user?.id ?? ''
				}
			})
			return home
		}
	})
	.query('getAll', {
		async resolve({ ctx }) {
			return await ctx.prisma.home.findMany()
		}
	})
