import type { FlexProps } from '@chakra-ui/react'
import type { FC } from 'react'
import { Flex, chakra } from '@chakra-ui/react'

interface SubHeaderProps extends FlexProps {
	lastMessageAuthor: string
	lastMessageBody: string
}

export const SubHeader: FC<SubHeaderProps> = ({
	lastMessageAuthor,
	lastMessageBody,
	...props
}) => {
	return (
		<Flex
			align='center'
			color='var(--secondary)'
			fontSize='xs'
			justify='space-between'
			lineHeight='20px'
			minH='20px'
			mt='2px'
			textAlign='left'
			{...props}
		>
			<Flex
				flexDir='row'
				overflow='hidden'
				textOverflow='ellipsis'
				whiteSpace='nowrap'
			>
				{lastMessageBody && <span>{lastMessageAuthor}</span>}
				{lastMessageBody && <span>:</span>}

				<chakra.span ml={lastMessageBody ? '3px' : 0}>
					{lastMessageBody || 'Chat is empty'}
				</chakra.span>
			</Flex>
		</Flex>
	)
}

export default SubHeader
