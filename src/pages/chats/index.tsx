import type { NextPage } from 'next'
import type { Conversation } from '@twilio/conversations'
import { useDisclosure } from '@chakra-ui/react'
import { Plus } from 'phosphor-react'
import { toast } from 'react-toastify'
import { Layout } from '@layouts'
import {
	ChatItem,
	ChatsContainer,
	CreateChatModal,
	FloatingButton
} from '@components'
import { useMutation, useQuery } from '@utils/trpc'
import { createChat } from '@services'
import { useStore } from '@store'

const Chats: NextPage = () => {
	const twilioToken = useStore(state => state.twilioToken)
	const addChatToStore = useStore(state => state.addChat)
	const setChats = useStore(state => state.setChats)
	const chats = useStore(state => state.chats)
	const setIsAddingChat = useStore(state => state.setIsAddingChat)
	const client = useStore(state => state.TwilioClient)

	useQuery(['chat.getAll'], {
		refetchOnWindowFocus: false,
		// onSuccess: setChats
		onSuccess(data) {
			setChats(data)
		}
	})

	const addChatToDB = useMutation(['chat.add'], {
		onSuccess() {
			toast.success('Chat created successfully')
		}
	})

	const {
		isOpen: modalIsOpen,
		onClose: closeModal,
		onOpen: openModal
	} = useDisclosure()

	const onAddingNewChat = async (chatName: string) => {
		if (!twilioToken) {
			throw new Error('Twilio token is not available')
		}

		if (!client) {
			throw new Error('Twilio client is not available')
		}

		if (!chatName) {
			throw new Error('Chat name is empty')
		}

		setIsAddingChat(true)
		const twilioChat = await createChat({ chatName, client })

		if (twilioChat.error) {
			toast.error(twilioChat.error.message)
			setIsAddingChat(false)
			return
		}

		const dbChat = await addChatToDB.mutateAsync({
			name: chatName,
			sid: (twilioChat as Conversation).sid
		})

		addChatToStore(dbChat)
		setIsAddingChat(false)
	}

	return (
		<>
			<Layout isPrivate>
				<ChatsContainer>
					{chats.map(chat => (
						<ChatItem key={chat.sid} sid={chat.sid} />
					))}
				</ChatsContainer>
			</Layout>

			<aside>
				<FloatingButton
					aria-label='Create a new chat'
					icon={<Plus size={24} />}
					onClick={openModal}
				/>
			</aside>

			<CreateChatModal
				isOpen={modalIsOpen}
				onAddingNewChat={onAddingNewChat}
				onClose={closeModal}
			/>
		</>
	)
}

export default Chats
