import superjson from 'superjson'
import { createRouter } from './context'
import { authRouter } from './auth'
import { chatRouter } from './chat'

export const appRouter = createRouter()
	.transformer(superjson)
	.merge('auth.', authRouter)
	.merge('chat.', chatRouter)

export type AppRouter = typeof appRouter
