import { z } from 'zod'
import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator'
import { getRandomAvatar } from '@fractalsoftware/random-avatar-generator'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

export const usersRouter = createTRPCRouter({
	findByEmail: publicProcedure
		.input(z.object({ email: z.string() }))
		.query(async ({ input, ctx }) => {
			if (input.email === '') return null

			return await ctx.prisma.user.findUnique({
				where: {
					email: input.email
				}
			})
		}),

	findManyByEmails: publicProcedure
		.input(z.object({ emails: z.array(z.string().email().nullish()) }))
		.query(async ({ input, ctx }) => {
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
		}),
	createAnonUser: publicProcedure.mutation(async ({ ctx }) => {
		const name = uniqueNamesGenerator({
			dictionaries: [adjectives, colors, animals],
			separator: ' ',
			length: 3,
			style: 'capital'
		})
		const email = name.toLowerCase().replaceAll(' ', '-') + '@anon.user'
		const avatarSvg = getRandomAvatar(8, 'circle')
		const image = `data:image/svg+xml;base64,${Buffer.from(avatarSvg).toString('base64')}`

		const user = await ctx.prisma.user.create({
			data: {
				name,
				email,
				image
			}
		})

		return user
	})
})
