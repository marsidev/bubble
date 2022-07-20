import type { FC } from 'react'
import { Flex, type FlexProps, chakra } from '@chakra-ui/react'

interface SubHeaderProps extends FlexProps {
	lastMessageAuthor: string
	lastMessageBody: string
}

export const SubHeader: FC<SubHeaderProps> = ({ lastMessageAuthor, lastMessageBody, ...props }) => {
	// const previewMessage = lastMessageBody
	// 	? `${lastMessageAuthor}: ${lastMessageBody}`
	// 	: 'Chat is empty'

	return (
		<Flex
			align='center'
			color='var(--secondary)'
			fontSize='xs'
			justify='flex-start'
			maxW='4xl'
			// maxW='480px'
			minH='20px'
			mt='2px'
			textAlign='left'
			w='100%'
			{...props}
		>
			{lastMessageBody && (
				<chakra.span
					className='ellipsis'
					maxW={['100px', '150px', '200px', '300px', '400px']}
				>
					{lastMessageAuthor}
				</chakra.span>
			)}

			{lastMessageBody && <chakra.span>:</chakra.span>}

			<chakra.span
				className='ellipsis'
				maxW={['300px', '350px', '400px', '600px', '600px']}
				ml={lastMessageBody ? '3px' : 0}
			>
				{lastMessageBody || 'Chat is empty'}
			</chakra.span>
		</Flex>
	)
}

export default SubHeader
