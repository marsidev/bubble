import { useEffect } from 'react'
import { Message } from '@twilio/conversations'
import { getLocalStorageValue, setLocalStorageValue } from '@utils/localStorage'
import { useStore } from '@store'
import { getAccessToken } from '@services'
import { TWILIO_ACCESS_TOKEN_LOCAL_STORAGE_TTL as TTL } from '@utils/constants'

export const useTwilio = async () => {
	const session = useStore(state => state.session)
	const client = useStore(state => state.TwilioClient)
	const twilioToken = useStore(state => state.twilioToken)
	const setTwilioToken = useStore(state => state.setTwilioToken)
	const createTwilioClient = useStore(state => state.createTwilioClient)
	const activeChat = useStore(state => state.activeChat)
	const addActiveChatMessage = useStore(state => state.addActiveChatMessage)

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
	}, [session])

	const onMessageAdded = (message: Message) => {
		if (message.conversation.sid === activeChat?.sid) {
			addActiveChatMessage(message)
		}
	}

	// messages listener
	useEffect(() => {
		if (client && activeChat) {
			client.on('messageAdded', onMessageAdded)

			// implement later:
			// client.on('conversationAdded', handleConversationAdded)
			// client.on('participantJoined', handleParticipantJoined)
			// client.on('participantLeft', handleParticipantLeft)
			// client.on('tokenExpired', handleParticipantLeft)
			// client.on('tokenAboutToExpire', handleParticipantLeft)
			// client.on('typingStarted', handleParticipantLeft)
			// client.on('typingEnded', handleParticipantLeft)

			return () => {
				client.off('messageAdded', onMessageAdded)
			}
		}
	}, [client, activeChat, onMessageAdded])

	return twilioToken
}

export default useTwilio
