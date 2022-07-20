import type { Message } from '@twilio/conversations'
// import { useEffect } from 'react'
import { Flex, type FlexProps, Tag } from '@chakra-ui/react'
import { useStore } from '@store'

interface BubbleProps extends FlexProps {
	message: Message
}

export const Bubble: React.FC<BubbleProps> = ({ message }) => {
	const activeChat = useStore(state => state.activeChat)
	const session = useStore(state => state.session)
	const { createdBy: chatHost } = activeChat ?? {}

	const userEmail = session?.user?.email
	const { body, author, dateCreated } = message
	const sentByHost = chatHost === author

	const outgoingMessage = userEmail === author
	const incomingMessage = !outgoingMessage
	const formattedAuthor = outgoingMessage ? 'You' : `${author}`
	const bubbleBg = outgoingMessage
		? 'var(--outgoing-background)'
		: 'var(--incoming-background)'

	const today = new Date()
	const isToday = today.toDateString() === new Date(dateCreated!).toDateString()

	const timestamp = isToday
		? new Date(dateCreated!).toLocaleTimeString()
		: new Date(dateCreated!).toLocaleString()

	return (
		<Flex align='center' justify='center' w='100%'>
			<Flex
				align={outgoingMessage ? 'flex-end' : 'flex-start'}
				flexDir='column'
				maxW='4xl'
				mb={2}
				pos='relative'
				w='full'
			>
				<Flex
					as='article'
					bg={bubbleBg}
					borderRadius='lg'
					borderTopLeftRadius={outgoingMessage ? 'md' : 0}
					borderTopRightRadius={outgoingMessage ? 0 : 'md'}
					boxShadow='0 1px 0.5px rgba(var(--shadow-rgb),.13)'
					color='var(--message-primary)'
					flexDir='column'
					fontSize='14.2px'
					lineHeight='normal'
					maxW='85%'
					minW='120px'
					pos='relative'
					px={2}
					py={2}
					textAlign='left'
					zIndex={199}
				>
					<Flex as='span' fontSize='xs' fontWeight='bold'>
						{formattedAuthor}

						{incomingMessage && sentByHost && (
							<Tag
								borderRadius='full'
								colorScheme='twitter'
								fontSize='xs'
								ml={2}
								size='sm'
								variant='solid'
							>
								Host
							</Tag>
						)}
					</Flex>

					<Flex
						as='span'
						fontSize='xs'
						overflowWrap='break-word'
						whiteSpace='pre-wrap'
						wordBreak='break-word'
					>
						{body}
					</Flex>

					<Flex
						as='span'
						color='var(--bubble-meta)'
						fontSize='xx-small'
						justify='flex-end'
						textAlign='right'
					>
						{timestamp}
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	)
}

export default Bubble
