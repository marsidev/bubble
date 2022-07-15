interface StoredValue {
	expires: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any
}

const hoursToMs = (hours: number) => 1000 * 60 * 60 * hours

export const getLocalStorageValue = (key: string, cachedHours = 24) => {
	const localData = window.localStorage.getItem(key)
	if (localData) {
		const stored: StoredValue = JSON.parse(localData)
		const now = new Date().getTime()
		const expires = new Date(stored.expires).getTime()
		const diff = now - expires

		if (diff < hoursToMs(cachedHours) && stored.data) {
			// console.log(`got cached ${key} from localStorage`)
			return stored.data
		} else {
			return null
		}
	} else {
		return null
	}
}

export const setLocalStorageValue = (key: string, data: unknown, cachedHours = 24) => {
	const expiresTimestamp = new Date().getTime() + hoursToMs(cachedHours)
	const expires = new Date(expiresTimestamp).toISOString()
	window.localStorage.setItem(key, JSON.stringify({ expires, data }))
	// console.log(`saved ${key} to localStorage`)
}
