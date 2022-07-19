import type { Chat } from '@store/chats'

export const sortChats = (chats: Chat[]) => {
	return chats.sort((a, b) => {
		const dateB = b.lastMessage?.dateCreated || b.dateUpdated || b.dateCreated
		const timeB = new Date(dateB!).getTime()
		const dateA = a.lastMessage?.dateCreated || a.dateUpdated || a.dateCreated
		const timeA = new Date(dateA!).getTime()
		return timeB - timeA
	})
}
