import type { Get, Set, StoreSlice } from '.'
import type { Conversation } from '@twilio/conversations'

interface DBChat {
	sid: string // twilio sid
	name: string // chat name
	ownerId: string // user id - chat admin
	id: string // db id
	createdAt: Date
	updatedAt: Date
}

type Chat = Conversation
type ChatList = Chat[]

export interface ChatsState {
	// db related states
	chats: DBChat[]
	setChats: (chats: DBChat[]) => void
	addChat: (chat: DBChat) => void
	removeChatBySid: (sid: string) => void

	activeChat: Conversation | null
	setActiveChat: (activeChat: Conversation | null) => void
	getChatData: (sid: string) => Promise<Conversation | null>

	isAddingChat: boolean
	setIsAddingChat: (isAddingChat: boolean) => void

	isRemovingChat: boolean
	setIsRemovingChat: (isRemovingChat: boolean) => void

	fetchingChats: boolean
	subscribedChats: ChatList
	setSubscribedChats: (subscribedChats: ChatList) => void
	getSubscribedChats: () => Promise<ChatList>
}

export const chats: StoreSlice<ChatsState> = (set: Set, get: Get) => ({
	chats: [],
	setChats: chats => set({ chats }),
	addChat: chat => set(state => ({ chats: [...state.chats, chat] })),
	removeChatBySid: sid =>
		set(state => ({ chats: state.chats.filter(c => c.sid !== sid) })),

	activeChat: null,
	setActiveChat: activeChat => set({ activeChat }),
	getChatData: async sid => {
		const client = get().TwilioClient
		if (!client) return null

		const chat = await client.getConversationBySid(sid)
		set({ activeChat: chat })
		return chat
	},

	isAddingChat: false,
	setIsAddingChat: isAddingChat => set({ isAddingChat }),

	isRemovingChat: false,
	setIsRemovingChat: isRemovingChat => set({ isRemovingChat }),

	fetchingChats: false,
	subscribedChats: [],
	setSubscribedChats: subscribedChats => set({ subscribedChats }),
	getSubscribedChats: async () => {
		const { TwilioClient } = get()
		if (!TwilioClient) return []

		set(() => ({ fetchingChats: true }))

		return new Promise<ChatList>(resolve => {
			TwilioClient
				.getSubscribedConversations()
				.then(paginator => {
					const chats = paginator.items
					set(() => ({ subscribedChats: chats, fetchingChats: false }))
					resolve(chats)
				})
				.catch(e => {
					console.error(e)
					set(() => ({ fetchingChats: false }))
				})
		})
	}
})
