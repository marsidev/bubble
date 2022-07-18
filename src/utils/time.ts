/* @ref https://midu.dev/como-crear-un-time-ago-sin-dependencias-intl-relativeformat/ */

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

export const getTimeAgo = (date: Date) => {
	const timestamp = date.getTime()
	const secondsElapsed = getSecondsDiff(timestamp)
	const { value, unit } = getUnitAndValueDate(secondsElapsed)!
	return rtf.format(value, unit as Intl.RelativeTimeFormatUnit)
}
