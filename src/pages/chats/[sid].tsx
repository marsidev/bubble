import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useStore } from '@store'
import { Layout } from '@layouts'
import { Bubble, ChatContainer } from '@components'
import { useQuery } from '@utils/trpc'

const Chat: NextPage = () => {
	const { sid } = useRouter().query
	const [title, setTitle] = useState('')
	const client = useStore(state => state.TwilioClient)
	const activeChat = useStore(state => state.activeChat)
	const setActiveChat = useStore(state => state.setActiveChat)
	const getChatData = useStore(state => state.getChatData)
	const activeChatMessages = useStore(state => state.activeChatMessages)
	const getActiveChatMessages = useStore(state => state.getActiveChatMessages)
	const activeChatParticipants = useStore(state => state.activeChatParticipants)
	const getActiveChatParticipants = useStore(state => state.getActiveChatParticipants)
	const setActiveChatDBUsers = useStore(state => state.setActiveChatDBUsers)
	const activeChatDBUsers = useStore(state => state.activeChatDBUsers)
	const bottomRef = useRef<HTMLDivElement>(null)

	useQuery(['user.findManyByEmails', {
		emails: activeChatParticipants?.map(p => p.identity)
	}], {
		refetchOnWindowFocus: false,
		onSuccess: setActiveChatDBUsers
	})

	useEffect(() => {
		if (client && activeChat?.sid !== sid) {
			setTitle('...')
			getChatData(sid as string).then(setActiveChat)
		}
	}, [client, sid, activeChat])

	useEffect(() => {
		if (activeChat) {
			setTitle(activeChat.friendlyName || (activeChat.uniqueName as string))
			getActiveChatMessages()
			getActiveChatParticipants()
		}
	}, [activeChat])

	return (
		<Layout title={title}>
			<ChatContainer>
				{activeChatDBUsers.length > 0 &&
					activeChatMessages.map(message => (
						<Bubble
							key={message.sid}
							endOfChatRef={bottomRef}
							message={message}
						/>
					))}

				<span ref={bottomRef} />
			</ChatContainer>
		</Layout>
	)
}

export default Chat
