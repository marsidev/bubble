/* eslint-disable react/display-name */
import { memo } from 'react'
import { Flex, type FlexProps } from '@chakra-ui/react'
import { useTime } from '@hooks'

interface TimeElapsedProps extends FlexProps {
	date: Date | null
}

export const TimeElapsed: React.FC<TimeElapsedProps> = memo(({ date, ...props }) => {
	const elapsed = useTime(date)

	return (
		<Flex
			align='center'
			as='span'
			className='ellipsis'
			color='var(--chat-meta)'
			fontSize='xx-small'
			fontWeight='light'
			justify='flex-end'
			lineHeight='14px'
			// minW='120px'
			minW='15%'
			textAlign='right'
			{...props}
		>
			{elapsed}
		</Flex>
	)
})

export default TimeElapsed
