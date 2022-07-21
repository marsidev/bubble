import type { FC } from 'react'
import { Flex, type FlexProps, Spacer } from '@chakra-ui/react'
import { TimeElapsed } from './TimeElapsed'

interface HeaderProps extends FlexProps {
	chatName: string
	lastMessageDate: Date | null
}

export const Header: FC<HeaderProps> = ({ chatName, lastMessageDate, ...props }) => {
	return (
		<Flex
			align='center'
			fontWeight='medium'
			lineHeight='normal'
			overflow='hidden'
			textAlign='left'
			{...props}
		>
			<Flex
				as='span'
				className='ellipsis'
				fontSize='sm'
				maxW='85%'
				pos='relative'
			>
				{chatName}
			</Flex>

			<Spacer />

			<TimeElapsed date={lastMessageDate} />
		</Flex>
	)
}

export default Header
