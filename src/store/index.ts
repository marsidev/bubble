import type { GetState, SetState } from 'zustand'
import createStore from 'zustand'
import { devtools } from 'zustand/middleware'
import { UserState, user } from './user'
import { ChatsState, chats } from './chats'
import { TwilioState, twilio } from './twilio'
import { MessagesState, messages } from './messages'

export type StoreState = UserState & ChatsState & TwilioState & MessagesState
export type Set = SetState<StoreState>
export type Get = GetState<StoreState>

const store = (set: Set, get: Get) => ({
	...user(set, get),
	...chats(set, get),
	...messages(set, get),
	...twilio(set, get)
})

export const useStore =
	process.env.NODE_ENV === 'development'
		? createStore(devtools(store))
		: createStore(store)

export * from './types.d'

export default useStore
