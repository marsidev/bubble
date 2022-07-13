import type { FlexProps } from '@chakra-ui/react'
import type { FC } from 'react'
import { Flex, chakra } from '@chakra-ui/react'

interface HeaderProps extends FlexProps {
	chatName: string
	lastMessageTimestamp: string | number
}

export const Header: FC<HeaderProps> = ({ chatName, lastMessageTimestamp, ...props }) => {
	return (
		<Flex
			justify='space-between'
			lineHeight='normal'
			textAlign='left'
			{...props}
		>
			<Flex
				flexGrow={1}
				fontSize='17px'
				fontWeight='medium'
				lineHeight='normal'
				overflow='hidden'
			>
				<chakra.span
					display='inline-block'
					flexGrow={1}
					overflow='hidden'
					pos='relative'
					textOverflow='ellipsis'
					whiteSpace='nowrap'
				>
					{chatName}
				</chakra.span>

				<chakra.span
					color='var(--chat-meta)'
					fontSize='12px'
					fontWeight='light'
					lineHeight='14px'
					overflow='hidden'
					textOverflow='ellipsis'
					whiteSpace='nowrap'
				>
					{lastMessageTimestamp}
				</chakra.span>
			</Flex>
		</Flex>
	)
}

export default Header
