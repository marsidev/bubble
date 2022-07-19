import { useEffect } from 'react'
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
	const devMode = process.env.NODE_ENV === 'development'

	// get token from local storage. If not exists or if expired, fetch a new one
	useEffect(() => {
		if (session?.user) {
			const cachedToken = getLocalStorageValue('twilio-token', TTL)

			if (cachedToken !== twilioToken) {
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

	// twilio client listeners
	useEffect(() => {
		if (client) {
			client.on('connectionStateChanged', state => {
				devMode && console.log('connectionStateChanged', state)
			})

			client.on('conversationAdded', state => {
				devMode && console.log('conversationAdded', state.sid)
			})

			client.on('conversationJoined', state => {
				devMode && console.log('conversationJoined', state.sid)
			})

			client.on('messageAdded', message => {
				devMode && console.log('messageAdded', message.sid)
				if (message.conversation.sid === activeChat?.sid) {
					addActiveChatMessage(message)
				}
			})

			client.on('participantJoined', state => {
				devMode && console.log('participantJoined', state.sid)
			})

			client.on('participantLeft', state => {
				devMode && console.log('participantLeft', state.sid)
			})

			client.on('pushNotification', state => {
				devMode && console.log('pushNotification', state)
			})

			client.on('stateChanged', state => {
				devMode && console.log('stateChanged', state)
			})

			client.on('tokenExpired', () => {
				devMode && console.log('tokenExpired')
			})

			client.on('tokenAboutToExpire', state => {
				devMode && console.log('tokenAboutToExpire', state.toString())
			})

			client.on('typingEnded', state => {
				devMode && console.log('typingEnded', state)
			})

			client.on('typingStarted', state => {
				devMode && console.log('typingStarted', state)
			})

			client.on('userSubscribed', state => {
				devMode && console.log('userSubscribed', state)
			})
		}
	}, [client, activeChat])

	return twilioToken
}

export default useTwilio
