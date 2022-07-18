import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Box, Spacer } from '@chakra-ui/react'
import { useStore } from '@store'
import { Layout } from '@layouts'
import { ChatContainer } from '@components'

const Chat: NextPage = () => {
	const { sid } = useRouter().query
	const client = useStore(state => state.TwilioClient)
	const activeChat = useStore(state => state.activeChat)
	const setActiveChat = useStore(state => state.setActiveChat)
	const getChatData = useStore(state => state.getChatData)
	const [title, setTitle] = useState('')

	useEffect(() => {
		if (client && activeChat?.sid !== sid) {
			setTitle('...')
			getChatData(sid as string).then(setActiveChat)
		}
	}, [client, sid, activeChat])

	useEffect(() => {
		if (activeChat) {
			setTitle(activeChat.friendlyName || (activeChat.uniqueName as string))
		}
	}, [activeChat])

	return (
		<Layout title={title}>
			<ChatContainer>
				<Box>
					<h1>Chat</h1>
					<p>{sid}</p>
				</Box>

				<Spacer />
			</ChatContainer>
		</Layout>
	)
}

export default Chat
