import type { Get, Set, StoreSlice } from '.'
import type { Conversation, Message } from '@twilio/conversations'

export type Messages = Message[]

export interface MessagesState {
	fetchingMessages: boolean
	setFetchingMessages: (fetchingMessages: boolean) => void

	activeChatMessages: Messages
	getActiveChatMessages: () => Promise<Messages>
	setActiveChatMessages: (messages: Messages) => void
	addActiveChatMessage: (message: Message) => void

	getMessages: (chat: Conversation) => Promise<Messages>
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
	},

	setActiveChatMessages: messages => set({ activeChatMessages: messages }),

	addActiveChatMessage: message =>
		set(state => ({
			activeChatMessages: [...state.activeChatMessages, message]
		})),

	getMessages: async chat => {
		return new Promise<Messages>(resolve => {
			chat
				.getMessages()
				.then(paginator => {
					const messages = paginator.items
					resolve(messages)
				})
				.catch(e => {
					console.error(e)
				})
		})
	}
})
