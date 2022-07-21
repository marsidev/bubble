import { z } from 'zod'
import {
	adjectives,
	animals,
	colors,
	uniqueNamesGenerator
} from 'unique-names-generator'
import { getRandomAvatar } from '@fractalsoftware/random-avatar-generator'
import { createRouter } from './context'

export const usersRouter = createRouter()
	.query('findByEmail', {
		input: z.object({
			email: z.string()
		}),
		async resolve({ ctx, input }) {
			if (input.email === '') return null

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
	.mutation('createAnonUser', {
		async resolve({ ctx }) {
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
		}
	})
