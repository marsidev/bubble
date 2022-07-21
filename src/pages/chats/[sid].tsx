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
	const client = useStore(s => s.TwilioClient)
	const activeChat = useStore(s => s.activeChat)
	const setActiveChat = useStore(s => s.setActiveChat)
	const getChatData = useStore(s => s.getChatData)
	const activeChatMessages = useStore(s => s.activeChatMessages)
	const getActiveChatMessages = useStore(s => s.getActiveChatMessages)
	const activeChatParticipants = useStore(s => s.activeChatParticipants)
	const getActiveChatParticipants = useStore(s => s.getActiveChatParticipants)
	const setActiveChatDBUsers = useStore(s => s.setActiveChatDBUsers)
	const activeChatDBUsers = useStore(s => s.activeChatDBUsers)
	const bottomRef = useRef<HTMLDivElement>(null)

	const getNames = useQuery([
		'user.findManyByEmails', {
			emails: activeChatParticipants?.map(p => p.identity)
		}], {
		refetchOnWindowFocus: false,
		onSuccess(users) {
			console.log({ users })
			setActiveChatDBUsers(users)
		},
		cacheTime: 0
	})

	const refetchNames = async () => {
		await getNames.refetch()
	}

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

	useEffect(() => {
		if (client) {
			client.on('participantJoined', refetchNames)
			client.on('messageAdded', refetchNames)

			return () => {
				client.off('participantJoined', refetchNames)
				client.off('messageAdded', refetchNames)
			}
		}
	}, [client, refetchNames])

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
