import superjson from 'superjson'
import { createRouter } from './context'
import { authRouter } from './auth'
import { chatRouter } from './chat'
import { usersRouter } from './users'
import { inviteRouter } from './invite'
import { twilioRouter } from './twilio'
import { messageRouter } from './message'

export const appRouter = createRouter()
	.transformer(superjson)
	.merge('auth.', authRouter)
	.merge('chat.', chatRouter)
	.merge('user.', usersRouter)
	.merge('invite.', inviteRouter)
	.merge('twilio.', twilioRouter)
	.merge('message.', messageRouter)

export type AppRouter = typeof appRouter
