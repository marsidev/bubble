import type { Message } from '@twilio/conversations'
// import { useEffect } from 'react'
import { Flex, type FlexProps, chakra } from '@chakra-ui/react'
import { useStore } from '@store'

interface BubbleProps extends FlexProps {
	message: Message
}

export const Bubble: React.FC<BubbleProps> = ({ message }) => {
	// const activeChat = useStore(state => state.activeChat)
	const session = useStore(state => state.session)
	// const { createdBy: chatAdmin } = activeChat ?? {}

	const userEmail = session?.user?.email
	const { body, author } = message

	// useEffect(() => {
	// 	console.log({ chatAdmin, body, author, userEmail })
	// }, [chatAdmin, body, author, userEmail])

	const outgoingMessage = userEmail === author
	const formattedAuthor = outgoingMessage ? 'You' : `${author}`
	const bubbleBg = outgoingMessage
		? 'var(--outgoing-background)'
		: 'var(--incoming-background)'

	return (
		<Flex
			align={outgoingMessage ? 'flex-end' : 'flex-start'}
			flexDir='column'
			mb={2}
			pos='relative'
			w='100%'
		>
			<Flex
				bg={bubbleBg}
				borderRadius='lg'
				borderTopLeftRadius={outgoingMessage ? 'md' : 0}
				borderTopRightRadius={outgoingMessage ? 0 : 'md'}
				boxShadow='0 1px 0.5px rgba(var(--shadow-rgb),.13)'
				color='var(--message-primary)'
				flexDir='column'
				// fontSize='14.2px'
				lineHeight='normal'
				maxW='85%'
				minW='120px'
				pos='relative'
				px={2}
				py={1}
				textAlign='left'
				zIndex={199}
			>
				<chakra.span fontSize='xs' fontWeight='bold'>
					{formattedAuthor}
				</chakra.span>
				<chakra.span
					fontSize='sm'
					overflowWrap='break-word'
					whiteSpace='pre-wrap'
				>
					{body}
				</chakra.span>
			</Flex>
		</Flex>
	)
}

export default Bubble
