import type { Get, Set, StoreSlice } from '.'
import type { Conversation, Participant } from '@twilio/conversations'
import { User } from '.prisma/client'
import { sortChats } from '@utils/sort-chats'

interface DBChat {
	sid: string // twilio sid
	name: string // chat name
	ownerId: string // user id - chat admin
	id: string // db id
	createdAt: Date
	updatedAt: Date
}

type ChatList = Conversation[]

export interface ChatsState {
	// db related states
	chats: DBChat[]
	setChats: (chats: DBChat[]) => void
	removeChatBySid: (sid: string) => void

	activeChat: Conversation | null
	setActiveChat: (activeChat: Conversation | null) => void
	getChatData: (sid: string) => Promise<Conversation | null>

	activeChatParticipants: Participant[]
	getActiveChatParticipants: () => Promise<Participant[]>

	activeChatDBUsers: User[]
	setActiveChatDBUsers: (users: User[]) => void

	isAddingChat: boolean
	setIsAddingChat: (isAddingChat: boolean) => void

	fetchingChats: boolean
	subscribedChats: ChatList
	getSubscribedChats: () => Promise<ChatList>
}

export const chats: StoreSlice<ChatsState> = (set: Set, get: Get) => ({
	chats: [],
	setChats: chats => set({ chats }),
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

	activeChatParticipants: [],
	getActiveChatParticipants: async () => {
		const { activeChat } = get()
		if (!activeChat) return []

		const participants = await activeChat.getParticipants()
		set({ activeChatParticipants: participants })
		return participants
	},

	activeChatDBUsers: [],
	setActiveChatDBUsers: users => set({ activeChatDBUsers: users }),

	isAddingChat: false,
	setIsAddingChat: isAddingChat => set({ isAddingChat }),

	fetchingChats: false,
	subscribedChats: [],
	getSubscribedChats: async () => {
		const { TwilioClient } = get()
		if (!TwilioClient) return []

		set(() => ({ fetchingChats: true }))

		return new Promise<ChatList>(resolve => {
			TwilioClient.getSubscribedConversations()
				.then(paginator => {
					// paginator.hasNextPage
					const chats = sortChats(paginator.items)

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
