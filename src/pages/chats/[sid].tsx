import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useStore from '@store'
import Layout from '@layouts/main'

const Chat: NextPage = () => {
	const { sid } = useRouter().query
	const client = useStore(state => state.TwilioClient)
	const activeChat = useStore(state => state.activeChat)
	const setActiveChat = useStore(state => state.setActiveChat)
	const getChatData = useStore(state => state.getChatData)

	useEffect(() => {
		if (client && activeChat?.sid !== sid) {
			getChatData(sid as string).then(setActiveChat)
		}
	}, [client, sid, activeChat])

	return (
		<Layout>
			<h1>Chat</h1>
			<p>{sid}</p>
		</Layout>
	)
}

export default Chat
