import type { NextPage } from 'next'
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
import { useMutation } from '@utils/trpc'
import { createChat as createTwilioChat } from '@services'
import { useStore } from '@store'

const Chats: NextPage = () => {
	const twilioToken = useStore(state => state.twilioToken)
	const setIsAddingChat = useStore(state => state.setIsAddingChat)
	const client = useStore(state => state.TwilioClient)
	const subscribedChats = useStore(state => state.subscribedChats)
	const getSubscribedChats = useStore(state => state.getSubscribedChats)

	const addChatToDB = useMutation(['chat.add'], {
		async onSuccess() {
			setIsAddingChat(false)
			toast.success('Chat created successfully')
		},
		onError(error) {
			console.error(error.message)
			setIsAddingChat(false)
		}
	})

	useEffect(() => {
		if (client && subscribedChats.length === 0) {
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

		try {
			const twilioChat = await createTwilioChat({ chatName, client })

			if (twilioChat) {
				await addChatToDB.mutateAsync({
					name: chatName,
					sid: twilioChat.sid
				})
			}
		} catch (_error) {
			toast.error('Error creating chat')
			setIsAddingChat(false)
		}
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
