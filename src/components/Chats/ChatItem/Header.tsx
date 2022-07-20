import type { FC } from 'react'
import { Flex, type FlexProps, Spacer } from '@chakra-ui/react'
import { getTimeAgo } from '@utils/time'

interface HeaderProps extends FlexProps {
	chatName: string
	lastMessageDate: Date | null
}

export const Header: FC<HeaderProps> = ({ chatName, lastMessageDate, ...props }) => {
	const timeAgo = lastMessageDate ? getTimeAgo(lastMessageDate, { preventFuture: true }) : ''

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

			{timeAgo && (
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
				>
					{timeAgo}
				</Flex>
			)}
		</Flex>
	)
}

export default Header
