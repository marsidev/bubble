import type { Get, Set, StoreSlice } from '.'
import { clearLocalStorageValue } from '~/utils/localStorage'

interface User {
	name?: string | null | undefined
	image?: string | null | undefined
	email?: string | null | undefined
}

interface Session {
	expires?: string
	token?: string
	user?: User
}

export interface UserState {
	session: Session | null
	setSession: (session: Session) => void
	clearSession: () => void
}

export const user: StoreSlice<UserState> = (set: Set, _get: Get) => ({
	session: null,
	setSession: (session: Session) => set({ session }),
	clearSession: () => {
		clearLocalStorageValue('twilio-token')
		set({
			session: null,
			activeChat: null,
			subscribedChats: [],
			activeChatParticipants: [],
			activeChatDBUsers: [],
			activeChatMessages: [],
			twilioToken: null,
			TwilioClient: null
		})
	}
})
