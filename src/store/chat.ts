import type { Get, Set, StoreSlice, StoreState } from '.'
import type { Conversation, Message } from '@twilio/conversations'

export type Messages = Array<Message>

export interface ChatState {
	loading: boolean
	setLoading: (loading: boolean) => void

	activeConversation: Conversation | null
	setActiveConversation: (activeConversation: Conversation) => void

	messages: Messages
	getMessages: () => Promise<Messages>
	setMessages: (messages: Messages) => void
	addMessage: (message: Message) => void
}

export const chat: StoreSlice<ChatState> = (set: Set, get: Get) => ({
	loading: false,
	setLoading: (loading: boolean) => set({ loading }),

	activeConversation: null,
	setActiveConversation: (activeConversation: Conversation) =>
		set({ activeConversation }),

	messages: [],
	async getMessages() {
		const { activeConversation } = get()
		set(() => ({ loading: true }))

		const paginator = await activeConversation?.getMessages()
		const messages = paginator?.items as Messages

		set(() => ({ messages, loading: false }))
		return messages
	},
	setMessages: (messages: Messages) => set({ messages }),
	addMessage: (message: Message) =>
		// set({ messages: [...get().messages, message] })
		set((state: StoreState) => ({
			messages: [...state.messages, message]
		}))
})
