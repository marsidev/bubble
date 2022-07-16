import { useEffect } from 'react'
import { getLocalStorageValue, setLocalStorageValue } from '@utils/localStorage'
import { useStore } from '@store'
import { getAccessToken } from '@services'
import { TWILIO_ACCESS_TOKEN_LOCAL_STORAGE_TTL as TTL } from '@utils/constants'

export const useToken = async () => {
	const session = useStore(state => state.session)
	const twilioToken = useStore(state => state.twilioToken)
	const setTwilioToken = useStore(state => state.setTwilioToken)

	useEffect(() => {
		if (session?.user) {
			const cachedToken = getLocalStorageValue('twilio-token', TTL)
			if (cachedToken && twilioToken !== cachedToken) {
				setTwilioToken(cachedToken as string)
			} else {
				getAccessToken(session.user.email as string).then(token => {
					setTwilioToken(token)
					setLocalStorageValue('twilio-token', token, TTL)
				})
			}
		}
	}, [session])

	return twilioToken
}

export default useToken
