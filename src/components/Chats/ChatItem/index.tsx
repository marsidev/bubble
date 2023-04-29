import { type FlexProps } from '@chakra-ui/react'
import { type FC } from 'react'
import { Conversation } from '@twilio/conversations'
import { DefaultGroup } from '~/icons'
import { useStore } from '~/store'
import { Container } from './Container'
import { Preview } from './Preview'

export interface ChatItemProps extends FlexProps {
	chat: Conversation
}

export const ChatItem: FC<ChatItemProps> = ({ chat, ...props }) => {
	const setActiveChat = useStore(state => state.setActiveChat)

	const onSelectChat = () => {
		setActiveChat(chat)
	}

	return (
		<Container sid={chat.sid} onClick={onSelectChat} {...props}>
			<span>
				<DefaultGroup />
			</span>
			<Preview chat={chat} />
		</Container>
	)
}

export default ChatItem
