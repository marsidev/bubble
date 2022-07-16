import type { Get, Set, StoreSlice } from '.'

interface Chat {
	sid: string // twilio sid
	name: string // chat name
	ownerId: string // user id - chat admin
	id: string // db id
	createdAt: Date
	updatedAt: Date
}

export interface ChatsState {
	chats: Chat[]
	setChats: (chats: Chat[]) => void
	addChat: (chat: Chat) => void
	removeChatBySid: (sid: string) => void

	isAddingChat: boolean
	setIsAddingChat: (isAddingChat: boolean) => void

	isRemovingChat: boolean
	setIsRemovingChat: (isRemovingChat: boolean) => void
}

export const chats: StoreSlice<ChatsState> = (set: Set, _get: Get) => ({
	chats: [],
	setChats: chats => set({ chats }),
	addChat: chat => set(state => ({ chats: [...state.chats, chat] })),
	removeChatBySid: sid => set(state => ({ chats: state.chats.filter(c => c.sid !== sid) })),

	isAddingChat: false,
	setIsAddingChat: isAddingChat => set({ isAddingChat }),

	isRemovingChat: false,
	setIsRemovingChat: isRemovingChat => set({ isRemovingChat })
})
