import type { FlexProps } from '@chakra-ui/react'
import type { Conversation } from '@twilio/conversations'
import { type FC, useEffect } from 'react'
import { Flex } from '@chakra-ui/react'
import { Header } from './Header'
import { SubHeader } from './SubHeader'

interface PreviewProps extends FlexProps {
	chat: Conversation
}

export const Preview: FC<PreviewProps> = ({ chat, ...props }) => {
	const { friendlyName, uniqueName, lastMessage } = chat
	const chatName = friendlyName ?? (uniqueName as string)

	const lastMessageBody = lastMessage ? 'Test message body' : ''
	const lastMessageAuthor = lastMessage ? 'Test Author' : ''
	const lastMessageTimestamp = lastMessage ? 'yesterday' : ''

	// useEffect(() => {
	// 	console.log({ lastMessage })
	// }, [lastMessage])

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
			<Header chatName={chatName} lastMessageTimestamp={lastMessageTimestamp} />
			<SubHeader
				lastMessageAuthor={lastMessageAuthor}
				lastMessageBody={lastMessageBody}
			/>
		</Flex>
	)
}

export default Preview
