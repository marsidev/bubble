import type { NextPage } from 'next'
import { ChatItem, ChatsContainer } from '@components'
import Layout from '@layouts/main'

const Home: NextPage = () => {
	return (
		<Layout withAuth>
			<ChatsContainer>
				<ChatItem />
				<ChatItem />
				<ChatItem />
				<ChatItem />
				<ChatItem />
				<ChatItem />
				<ChatItem />
				<ChatItem />
				<ChatItem />
				<ChatItem />
				<ChatItem />
				<ChatItem />
				<ChatItem />
				<ChatItem />
				<ChatItem />
				<ChatItem />
				<ChatItem />
				<ChatItem />
				<ChatItem />
				<ChatItem />
				<ChatItem />
				<ChatItem />
				<ChatItem />
			</ChatsContainer>
		</Layout>
	)
}

export default Home
