import { TWILIO_ACCESS_TOKEN_TTL } from '@utils/constants'

interface ServiceToken {
	success: boolean
	accessToken: string
}

export const getAccessToken = async (identity: string) => {
	const url = process.env.NEXT_PUBLIC_TWILIO_TOKEN_SERVICE_URL

	const res = await fetch(`${url}?identity=${identity}&ttl=${TWILIO_ACCESS_TOKEN_TTL}`)

	if (!res.ok) throw new Error('Error getting access token')

	const data = (await res.json()) as ServiceToken

	if (!data.success) throw new Error('Error getting access token')

	return data.accessToken
}
