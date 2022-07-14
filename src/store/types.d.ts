import { GetState, SetState } from 'zustand'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StoreSlice<T> = (set: SetState<any>, get: GetState<any>) => T
