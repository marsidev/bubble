import superjson from 'superjson'
import { createRouter } from './context'
import { homeRouter } from './home'
import { authRouter } from './auth'
import { twilioRouter } from './twilio'

export const appRouter = createRouter()
	.transformer(superjson)
	.merge('home.', homeRouter)
	.merge('auth.', authRouter)
	.merge('twilio.', twilioRouter)

export type AppRouter = typeof appRouter
