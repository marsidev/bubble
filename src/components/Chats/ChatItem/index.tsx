import type { FlexProps } from '@chakra-ui/react'
import type { FC } from 'react'
import type { Conversation } from '@twilio/conversations'
import { DefaultGroup } from '~/icons'
import { Container } from './Container'
import { Preview } from './Preview'

export interface ChatItemProps extends FlexProps {
	conversation?: Conversation
}

export const ChatItem: FC<ChatItemProps> = ({ conversation, ...props }) => {
	// const {
	// 	lastMessage,
	// 	getParticipants,
	// 	getMessages,
	// 	uniqueName,
	// 	createdBy,
	// 	friendlyName,
	// 	getMessagesCount,
	// 	attributes,
	// 	getAttributes,
	// 	getParticipantsCount,
	// 	getUnreadMessagesCount,
	// 	lastReadMessageIndex,
	// 	setAllMessagesRead,
	// 	setAllMessagesUnread,
	// 	sid,
	// 	state,
	// 	status
	// } = conversation

	// lastMessage?.dateCreated
	// lastMessage?.index

	return (
		<Container {...props}>
			<DefaultGroup />
			<Preview />
		</Container>
	)
}

export default ChatItem
