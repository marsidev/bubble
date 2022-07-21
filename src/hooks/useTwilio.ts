import type { Conversation, Message, Participant } from '@twilio/conversations'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { getLocalStorageValue, setLocalStorageValue } from '@utils/localStorage'
import { useStore } from '@store'
import { getAccessToken } from '@services'
import { TWILIO_ACCESS_TOKEN_LOCAL_STORAGE_TTL as TTL } from '@utils/constants'

const isDev = process.env.NODE_ENV === 'development'

export const useTwilio = async () => {
	const router = useRouter()
	const session = useStore(state => state.session)
	const client = useStore(state => state.TwilioClient)
	const twilioToken = useStore(state => state.twilioToken)
	const setTwilioToken = useStore(state => state.setTwilioToken)
	const createTwilioClient = useStore(state => state.createTwilioClient)
	const activeChat = useStore(state => state.activeChat)
	const addActiveChatMessage = useStore(state => state.addActiveChatMessage)
	const getSubscribedChats = useStore(state => state.getSubscribedChats)

	const isChatsList = router.pathname === '/chats'

	// get token from local storage. If not exists or if expired, fetch a new one
	useEffect(() => {
		if (session?.user) {
			const cachedToken = getLocalStorageValue('twilio-token', TTL)

			if (cachedToken && cachedToken !== twilioToken) {
				setTwilioToken(cachedToken as string)
				createTwilioClient(cachedToken as string)
			}

			if (!cachedToken) {
				getAccessToken(session.user.email as string).then(token => {
					setTwilioToken(token)
					createTwilioClient(token)
					setLocalStorageValue('twilio-token', token, TTL)
				})
			}
		}
	}, [session, client])

	// refetch subscribed chats when rendering the chats list
	useEffect(() => {
		if (isChatsList) {
			getSubscribedChats()
		}
	}, [isChatsList, getSubscribedChats])

	const onMessageAdded = (m: Message) => {
		if (m.conversation.sid === activeChat?.sid) {
			addActiveChatMessage(m)
		}

		if (isChatsList) {
			getSubscribedChats()
		}
	}

	const onConversationAdded = async (c: Conversation) => {
		isDev && console.log(`conversation added: ${c.sid}`)
		await getSubscribedChats()
	}

	const onConversationRemoved = async (c: Conversation) => {
		const { friendlyName, sid, createdBy } = c
		isDev && console.log(`conversation removed: ${sid}`)

		const isHost = session?.user?.email === createdBy
		const isChatPage = router.pathname.startsWith('/chats/')

		!isHost && toast.info(`Chat ${friendlyName} removed. 🗑️`)
		await getSubscribedChats()
		if (isChatPage && sid === router.query.sid) {
			router.push('/chats')
		}
	}

	const onConversationLeft = async (c: Conversation) => {
		const { sid } = c
		isDev && console.log(`conversation left: ${sid}`)
		const isChatPage = router.pathname.startsWith('/chats/')

		await getSubscribedChats()
		if (isChatPage && sid === router.query.sid) {
			router.push('/chats')
		}
	}

	const onParticipantLeft = async (p: Participant) => {
		isDev && console.log(`user ${p.identity} left the conversation ${p.conversation.sid}`)
		await getSubscribedChats()
	}

	// twilio listeners
	useEffect(() => {
		if (client) {
			client.on('messageAdded', onMessageAdded)
			client.on('conversationAdded', onConversationAdded)
			client.on('conversationRemoved', onConversationRemoved)
			client.on('conversationLeft', onConversationLeft)
			client.on('participantLeft', onParticipantLeft)

			return () => {
				client.off('messageAdded', onMessageAdded)
				client.off('conversationAdded', onConversationAdded)
				client.off('conversationRemoved', onConversationRemoved)
				client.off('conversationLeft', onConversationLeft)
				client.off('participantLeft', onParticipantLeft)
			}
		}
	}, [
		client,
		activeChat,
		onMessageAdded,
		onConversationAdded,
		onConversationRemoved,
		getSubscribedChats,
		onParticipantLeft,
		onConversationLeft
	])

	return twilioToken
}

export default useTwilio
