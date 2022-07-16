import type { Get, Set, StoreSlice } from '.'

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
	clearSession: () =>
		set({
			session: null,
			// activeConversation: null,
			// messages: [],
			twilioToken: null
		})
})
