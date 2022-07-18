import type { Get, Set, StoreSlice } from '.'
import type { Message } from '@twilio/conversations'

export type Messages = Message[]

export interface MessagesState {
	fetchingMessages: boolean
	setFetchingMessages: (fetchingMessages: boolean) => void

	activeChatMessages: Messages
	getActiveChatMessages: () => Promise<Messages>
	setActiveChatMessages: (messages: Messages) => void
	addActiveChatMessage: (message: Message) => void
}

export const messages: StoreSlice<MessagesState> = (set: Set, get: Get) => ({
	fetchingMessages: false,
	setFetchingMessages: (fetchingMessages: boolean) => set({ fetchingMessages }),

	activeChatMessages: [],

	getActiveChatMessages: async () => {
		const { activeChat } = get()
		if (!activeChat) return []

		set(() => ({ fetchingMessages: true }))

		return new Promise<Messages>(resolve => {
			activeChat
				.getMessages()
				.then(paginator => {
					const activeChatMessages = paginator.items
					set(() => ({ activeChatMessages, fetchingMessages: false }))
					resolve(activeChatMessages)
				})
				.catch(e => {
					console.error(e)
					set(() => ({ fetchingMessages: false }))
				})
		})

		// const paginator = await activeChat.getMessages()
		// const activeChatMessages = paginator.items

		// set(() => ({ activeChatMessages, fetchingMessages: false }))
		// return activeChatMessages
	},

	setActiveChatMessages: messages => set({ activeChatMessages: messages }),

	addActiveChatMessage: message =>
		set(state => ({
			activeChatMessages: [...state.activeChatMessages, message]
		}))
})
