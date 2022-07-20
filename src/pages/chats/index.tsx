import type { NextPage } from 'next'
import type { Conversation } from '@twilio/conversations'
import { useEffect } from 'react'
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
	const setChats = useStore(state => state.setChats)
	const setIsAddingChat = useStore(state => state.setIsAddingChat)
	const client = useStore(state => state.TwilioClient)
	const subscribedChats = useStore(state => state.subscribedChats)
	const getSubscribedChats = useStore(state => state.getSubscribedChats)

	const allChats = useQuery(['chat.getAll'], {
		refetchOnWindowFocus: false,
		onSuccess(data) {
			setChats(data)
		}
	})

	const addChatToDB = useMutation(['chat.add'], {
		async onSuccess() {
			allChats.refetch()
			await getSubscribedChats()
			setIsAddingChat(false)
			toast.success('Chat created successfully')
		},
		onError(error) {
			console.error(error.message)
			setIsAddingChat(false)
		}
	})

	useEffect(() => {
		if (client) {
			getSubscribedChats()
		}
	}, [client])

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

		await addChatToDB.mutateAsync({
			name: chatName,
			sid: (twilioChat as Conversation).sid
		})
	}

	return (
		<>
			<Layout isPrivate>
				<ChatsContainer>
					{subscribedChats.map(chat => (
						<ChatItem key={chat.sid} chat={chat} />
					))}
				</ChatsContainer>
			</Layout>

			{client && (
				<aside>
					<FloatingButton
						aria-label='Create a new chat'
						icon={<Plus size={24} />}
						onClick={openModal}
					/>
				</aside>
			)}

			<aside>
				<CreateChatModal
					isOpen={modalIsOpen}
					onAddingNewChat={onAddingNewChat}
					onClose={closeModal}
				/>
			</aside>
		</>
	)
}

export default Chats
