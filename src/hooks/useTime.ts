import { useEffect, useState } from 'react'
import { getTimeAgo } from '@utils/time'

export const useTime = (date: Date | null) => {
	const [, setTime] = useState<Date>(new Date())

	useEffect(() => {
		const timerId = setInterval(() => setTime(new Date()), 1000)
		return () => clearInterval(timerId)
	}, [])

	if (!date) return null

	return getTimeAgo(date, { preventFuture: true })
}

export default useTime
