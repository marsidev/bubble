import type { Conversation, Message } from '@twilio/conversations'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { getLocalStorageValue, setLocalStorageValue } from '@utils/localStorage'
import { useStore } from '@store'
import { getAccessToken } from '@services'
import { TWILIO_ACCESS_TOKEN_LOCAL_STORAGE_TTL as TTL } from '@utils/constants'

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

	const onMessageAdded = (message: Message) => {
		if (message.conversation.sid === activeChat?.sid) {
			addActiveChatMessage(message)
		}
	}

	const onConversationAdded = async (conversation: Conversation) => {
		console.log(`conversation added: ${conversation.sid}`)
		await getSubscribedChats()
	}

	const onConversationRemoved = async (conversation: Conversation) => {
		const { friendlyName, sid, createdBy } = conversation
		console.log(`conversation removed: ${sid}`)

		const isHost = session?.user?.email === createdBy

		if (!isHost) {
			toast.info(`Chat "${friendlyName}" was deleted by the host. 🗑️`)
		}

		await getSubscribedChats()

		if (!isHost && sid === activeChat?.sid) {
			router.push('/chats')
		}
	}

	// twilio listeners
	useEffect(() => {
		if (client) {
			client.on('messageAdded', onMessageAdded)
			client.on('conversationAdded', onConversationAdded)
			client.on('conversationRemoved', onConversationRemoved)
			// client.on('tokenExpired', console.warn)
			// client.on('tokenAboutToExpire', console.warn)

			// implement later:
			// client.on('participantJoined', handleParticipantJoined)
			// client.on('participantLeft', handleParticipantLeft)
			// client.on('typingStarted', handleParticipantLeft)
			// client.on('typingEnded', handleParticipantLeft)

			return () => {
				client.off('messageAdded', onMessageAdded)
				client.off('conversationAdded', onConversationAdded)
				client.off('conversationRemoved', onConversationRemoved)
				// client.off('tokenExpired', console.warn)
				// client.off('tokenAboutToExpire', console.warn)
			}
		}
	}, [client, activeChat, onMessageAdded, onConversationAdded, onConversationRemoved, getSubscribedChats])

	return twilioToken
}

export default useTwilio
