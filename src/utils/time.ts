/* @ref https://midu.dev/como-crear-un-time-ago-sin-dependencias-intl-relativeformat/ */

interface Options {
	preventFuture?: boolean
}

const rtf = new Intl.RelativeTimeFormat('en', {
	localeMatcher: 'best fit',
	numeric: 'auto',
	style: 'long'
})

const DATE_UNITS = {
	day: 86400,
	hour: 3600,
	minute: 60,
	second: 1
}

const getSecondsDiff = (timestamp: number) => (Date.now() - timestamp) / 1000

const getUnitAndValueDate = (secondsElapsed: number) => {
	for (const [unit, secondsInUnit] of Object.entries(DATE_UNITS)) {
		if (secondsElapsed >= secondsInUnit || unit === 'second') {
			const value = Math.floor(secondsElapsed / secondsInUnit) * -1
			return { value, unit }
		}
	}
}

export const getTimeAgo = (date: Date, options: Options = {}) => {
	const { preventFuture = false } = options

	let secondsElapsed = getSecondsDiff(date.getTime())
	const isFuture = secondsElapsed < 0

	if (preventFuture && isFuture) {
		secondsElapsed = 0
	}

	const { value, unit } = getUnitAndValueDate(secondsElapsed)!
	return rtf.format(value, unit as Intl.RelativeTimeFormatUnit)
}
