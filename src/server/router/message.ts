import { z } from 'zod'
import { decrypt, encrypt } from '@utils/encryption'
import { createRouter } from './context'

export const messageRouter = createRouter()
	.mutation('encrypt', {
		input: z.object({
			message: z.string()
		}),
		resolve({ input }) {
			return encrypt(input.message)
		}
	})
	.query('decrypt', {
		input: z.object({
			encrypted: z.string().nullish()
		}),
		output: z.string(),
		resolve({ input }) {
			const { encrypted } = input
			if (!encrypted) return ''

			// temporary as not all messages are encrypted and some are badly encrypted:
			if (!encrypted?.startsWith('U2FsdGVkX1')) return encrypted
			if (encrypted === 'U2FsdGVkX19L5T/GtvnZndZy/uB+uUO71QBDkYCySWY=') return encrypted

			return decrypt(encrypted)
		}
	})
