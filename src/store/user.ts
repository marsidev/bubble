import type { Get, Set, StoreSlice } from '.'

interface User {
	name: string
	avatar: string
	email: string
	token: string
	userName: string
}

export interface UserState {
	user: User | null
	setUser: (user: User) => void
	logout: () => void
}

export const user: StoreSlice<UserState> = (set: Set, _get: Get) => ({
	user: null,
	setUser: (user: User) => set({ user }),
	logout: () =>
		set({
			user: null,
			activeConversation: null,
			messages: []
		})
})
