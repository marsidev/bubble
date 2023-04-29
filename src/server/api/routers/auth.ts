import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

export const authRouter = createTRPCRouter({
	getSession: publicProcedure.query(({ ctx }) => {
		return ctx.session
	})
})
