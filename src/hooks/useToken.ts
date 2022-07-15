import { useEffect } from 'react'
import { getLocalStorageValue, setLocalStorageValue } from '@utils/localStorage'
import { useStore } from '@store'
import { getAccessToken } from '@services'

export const useToken = async () => {
	const session = useStore(state => state.session)
	const twilioToken = useStore(state => state.twilioToken)
	const setTwilioToken = useStore(state => state.setTwilioToken)

	useEffect(() => {
		if (session) {
			const cachedToken = getLocalStorageValue('twilio-token')
			if (cachedToken && twilioToken !== cachedToken) {
				setTwilioToken(cachedToken as string)
			} else {
				getAccessToken(session?.token as string).then(token => {
					setTwilioToken(token)
					setLocalStorageValue('twilio-token', token)
				})
			}
		}
	}, [session])

	return twilioToken
}

export default useToken
