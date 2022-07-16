import type { Get, Set, StoreSlice } from '.'
import { Client } from '@twilio/conversations'
import { createChatClient } from '@services'

export interface TwilioState {
	twilioToken: string | null
	setTwilioToken: (token: string) => void
	removeTwilioToken: () => void

	TwilioClient: Client | null
	createTwilioClient: () => void
}

export const twilio: StoreSlice<TwilioState> = (set: Set, get: Get) => ({
	twilioToken: null,
	setTwilioToken: (twilioToken: string) => set({ twilioToken }),
	removeTwilioToken: () => set({ twilioToken: null }),

	TwilioClient: null,
	async createTwilioClient() {
		const token = get().twilioToken
		if (token) {
			const client = await createChatClient(token)
			set({ TwilioClient: client })
		}
	}
})
