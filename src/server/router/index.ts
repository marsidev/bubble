import superjson from 'superjson'
import { createRouter } from './context'
import { homeRouter } from './home'
import { authRouter } from './auth'
import { chatRouter } from './chat'

export const appRouter = createRouter()
	.transformer(superjson)
	.merge('home.', homeRouter)
	.merge('auth.', authRouter)
	.merge('chat.', chatRouter)

export type AppRouter = typeof appRouter
