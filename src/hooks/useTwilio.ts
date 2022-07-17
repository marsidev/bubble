import { useEffect } from 'react'
import { getLocalStorageValue, setLocalStorageValue } from '@utils/localStorage'
import { useStore } from '@store'
import { getAccessToken } from '@services'
import { TWILIO_ACCESS_TOKEN_LOCAL_STORAGE_TTL as TTL } from '@utils/constants'

export const useTwilio = async () => {
	const session = useStore(state => state.session)
	const twilioToken = useStore(state => state.twilioToken)
	const setTwilioToken = useStore(state => state.setTwilioToken)
	const createTwilioClient = useStore(state => state.createTwilioClient)

	useEffect(() => {
		if (session?.user) {
			const cachedToken = getLocalStorageValue('twilio-token', TTL)

			if (cachedToken !== twilioToken) {
				console.log('setting twilio token from localStorage, and generating client...')
				setTwilioToken(cachedToken as string)
				createTwilioClient(cachedToken as string)
			}

			if (!cachedToken) {
				console.log('generating token and client...')
				// console.log('getting new token...')
				getAccessToken(session.user.email as string).then(token => {
					setTwilioToken(token)
					createTwilioClient(token)
					setLocalStorageValue('twilio-token', token, TTL)
				})
			}
		}
	}, [session])

	return twilioToken
}

export default useTwilio
