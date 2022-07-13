import superjson from 'superjson'
import { createRouter } from './context'
import { homeRouter } from './home'
import { authRouter } from './auth'

export const appRouter = createRouter()
	.transformer(superjson)
	.merge('home.', homeRouter)
	.merge('auth.', authRouter)

export type AppRouter = typeof appRouter
