import type { GetState, SetState } from 'zustand'
import createStore from 'zustand'
import { devtools } from 'zustand/middleware'
import { UserState, user } from './user'
import { ChatState, chat } from './chat'

export type StoreState = UserState & ChatState
export type Set = SetState<StoreState>
export type Get = GetState<StoreState>

const store = (set: Set, get: Get) => ({
	...user(set, get),
	...chat(set, get)
})

// export const useStore = createStore(devtools(persist(store, { name: 'bubble-store' })))
export const useStore = createStore(devtools(store))

export * from './types'

export default useStore
