interface StoredValue {
	expires: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any
}

/**
 * If the key exists in localStorage, and the data hasn't expired, return the data
 * @param {string} key - the key to store the data under
 * @param [TTL=3600] - Time to live, in seconds. Default is 3600 (1 hour)
 * @returns The value of the key in localStorage if it exists and has not expired.
 */
export const getLocalStorageValue = (key: string, TTL = 3600) => {
	const localData = window.localStorage.getItem(key)
	if (localData) {
		const stored: StoredValue = JSON.parse(localData)

		const now = new Date().getTime()
		const expires = new Date(stored.expires).getTime()
		const diff = (now - expires) / 1000
		// console.log({ stored, now, expires, diff, TTL })

		if (diff < TTL && !!stored.data) {
			// console.log(`got cached ${key} from localStorage`)
			return stored.data
		} else {
			// console.log(`got cached ${key} from localStorage but it has expired`)
			return null
		}
	} else {
		// console.log(`${key} not found in localStorage`)
		return null
	}
}

/**
 * It takes a key, data, and TTL (time to live) and saves it to localStorage
 * @param {string} key - string - the key to store the data under
 * @param {unknown} data - the data you want to store
 * @param [TTL=3600] - Time to live in seconds. Default is 3600 (1 hour)
 */
export const setLocalStorageValue = (key: string, data: unknown, TTL = 3600) => {
	const expiresTimestamp = new Date().getTime() + TTL
	const expires = new Date(expiresTimestamp).toISOString()
	window.localStorage.setItem(key, JSON.stringify({ expires, data }))
	// console.log(`saved ${key} to localStorage`)
}
