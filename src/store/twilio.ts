import type { Get, Set, StoreSlice } from '.'

export interface TwilioState {
	twilioToken: string | null
	setTwilioToken: (token: string) => void
	removeTwilioToken: () => void
}

export const twilio: StoreSlice<TwilioState> = (set: Set, _get: Get) => ({
	twilioToken: null,
	setTwilioToken: (twilioToken: string) => set({ twilioToken }),
	removeTwilioToken: () => set({ twilioToken: null })
})
