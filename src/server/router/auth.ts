import { TRPCError } from '@trpc/server'
import { createRouter } from './context'

export const authRouter = createRouter()
	.query('getSession', {
		resolve({ ctx }) {
			return ctx.session
		}
	})
	.middleware(async ({ ctx, next }) => {
		if (!ctx.session) {
			throw new TRPCError({ code: 'UNAUTHORIZED' })
		}
		return next()
	})
	.query('getSecretMessage', {
		async resolve() {
			return 'You are logged in and can see this secret message!'
		}
	})
