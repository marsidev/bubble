import { createTRPCRouter } from '~/server/api/trpc'
import { authRouter } from './routers/auth'
import { chatRouter } from './routers/chat'
import { usersRouter } from './routers/users'
import { inviteRouter } from './routers/invite'
import { twilioRouter } from './routers/twilio'
import { messageRouter } from './routers/message'

export const appRouter = createTRPCRouter({
	auth: authRouter,
	chat: chatRouter,
	user: usersRouter,
	invite: inviteRouter,
	twilio: twilioRouter,
	message: messageRouter
})

export type AppRouter = typeof appRouter
