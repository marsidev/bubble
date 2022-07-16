import { type FlexProps } from '@chakra-ui/react'
import { type FC, useEffect, useState } from 'react'
import { Conversation } from '@twilio/conversations'
import { DefaultGroup } from '~/icons'
import useStore from '@store'
import { Container } from './Container'
import { Preview } from './Preview'

export interface ChatItemProps extends FlexProps {
	sid: string
}

export const ChatItem: FC<ChatItemProps> = ({ sid, ...props }) => {
	const client = useStore(state => state.TwilioClient)
	const [conversation, setConversation] = useState<Conversation | null>(null)

	useEffect(() => {
		client?.getConversationBySid(sid).then(conversation => {
			setConversation(conversation)
		})
	}, [])

	useEffect(() => {
		if (conversation) {
			const { uniqueName, createdBy, friendlyName } = conversation
			console.log({ uniqueName, createdBy, friendlyName })
		}
	}, [conversation])

	if (!conversation) return null

	// TODO: if createdBy === user, show admin label/badge

	// TODO: add conversation listeners
	// useEffect(() => {
	// 	conversation?.on('messageAdded', message => {
	// 		console.log('messageAdded', message)
	// 		addMessage(message)
	// 	})

	// 	getMessages()
	// }, [conversation])

	return (
		<Container {...props}>
			<DefaultGroup />
			<Preview conversation={conversation} />
		</Container>
	)
}

export default ChatItem
