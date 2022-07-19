import type { Get, Set, StoreSlice } from '.'
import type { Conversation, Message } from '@twilio/conversations'
import { sortChats } from '@utils/sort-chats'

interface DBChat {
	sid: string // twilio sid
	name: string // chat name
	ownerId: string // user id - chat admin
	id: string // db id
	createdAt: Date
	updatedAt: Date
	// lastMessage?: {
	// 	sid: string
	// 	participantSid: string
	// 	body: string
	// 	dateCreated: Date
	// 	author: string
	// 	type: string
	// }
}

export interface Chat extends Conversation {
	lastMessageData?: Message | undefined
}

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
					// paginator.hasNextPage
					const chats = sortChats(paginator.items)

					// const messagesPromises = chats.map(chat => chat.getMessages())
					// Promise.all(messagesPromises).then(msgsPaginator => {
					// 	msgsPaginator.forEach((paginator, i) => {
					// 		const messages = paginator.items
					// 		const lastMessageData = messages.at(-1)
					// 		chats[i]!.lastMessageData = lastMessageData
					// 	})
					// }).catch(err => {
					// 	console.error(err)
					// })

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
