import type { Conversation, Message } from '@twilio/conversations'
import { type FC, useEffect, useState } from 'react'
import { Flex, type FlexProps } from '@chakra-ui/react'
import { useStore } from '@store'
import { Header } from './Header'
import { SubHeader } from './SubHeader'

interface PreviewProps extends FlexProps {
	chat: Conversation
}

export const Preview: FC<PreviewProps> = ({ chat, ...props }) => {
	const getMessages = useStore(state => state.getMessages)
	const session = useStore(state => state.session)
	const [lastMessage, setLastMessage] = useState<Message | undefined>()

	const { friendlyName, uniqueName } = chat
	const chatName = (friendlyName ?? uniqueName) as string
	const lastMessageBody = lastMessage ? lastMessage.body! : ''
	const lastMessageAuthor = lastMessage ? lastMessage.author! : ''
	const lastMessageDate = lastMessage ? lastMessage.dateCreated! : null

	const userEmail = session?.user?.email
	const isOutgoing = userEmail === lastMessageAuthor
	const formattedAuthor = isOutgoing ? 'You' : `${lastMessageAuthor}`

	useEffect(() => {
		if (chat.lastMessage) {
			getMessages(chat).then(messages => {
				setLastMessage(messages.at(-1))
			})
		}
	}, [])

	useEffect(() => {
		chat.on('messageAdded', msg => {
			setLastMessage(msg)
		})
	}, [chat])

	return (
		<Flex
			borderTop='1px solid'
			// eslint-disable-next-line react/jsx-sort-props
			borderColor='var(--border-list)'
			flexDir='column'
			flexGrow={1}
			flexShrink={1}
			h={16}
			justify='center'
			pr={4}
			py={0}
			w='100%'
			{...props}
		>
			<Header chatName={chatName} lastMessageDate={lastMessageDate} />
			<SubHeader
				lastMessageAuthor={formattedAuthor}
				lastMessageBody={lastMessageBody}
			/>
		</Flex>
	)
}

export default Preview
