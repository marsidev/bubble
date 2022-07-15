import type { NextPage } from 'next'
import type { Conversation } from '@twilio/conversations'
import { useDisclosure } from '@chakra-ui/react'
import { Plus } from 'phosphor-react'
import { Suspense, lazy, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FloatingButton } from '@components'
import { useMutation, useQuery } from '@utils/trpc'
import Layout from '@layouts/main'
import { createChat } from '@services'
import useStore from '@store'

const CreateChatModal = lazy(() => import('@components/Modals/CreateChatModal'))

const Home: NextPage = () => {
	const hello = useQuery(['home.hello', { text: 'from tRPC' }])
	const allChats = useQuery(['chat.getAll'])
	const addChat = useMutation(['chat.add'], {
		onSuccess: () => {
			toast.success('Chat created successfully')
		}
	})
	const twilioToken = useStore(state => state.twilioToken)

	const {
		isOpen: modalIsOpen,
		onClose: closeModal,
		onOpen: openModal
	} = useDisclosure()

	useEffect(() => {
		console.log(allChats.data)
	}, [allChats.data])

	const onAddingNewChat = async (chatName: string) => {
		if (!twilioToken) {
			throw new Error('Twilio token is not available')
		}

		if (!chatName) {
			throw new Error('Chat name is empty')
		}

		const chat = await createChat({ chatName, token: twilioToken! })

		if (chat.error) {
			toast.error(chat.error.message)
			return
		}

		console.log('chat created!')
		await addChat.mutateAsync({ name: chatName, sid: (chat as Conversation).sid })
		console.log('chat added to db!')
	}

	return (
		<>
			<Layout withAuth>
				{hello.data && <p>{hello.data.greeting}</p>}
				{allChats.data && <p>{allChats.data.length} chats</p>}
			</Layout>

			<aside>
				<FloatingButton
					aria-label='Create a new chat'
					icon={<Plus size={24} />}
					onClick={openModal}
				/>
			</aside>

			<Suspense aria-hidden='true' fallback={<div>test</div>}>
				<aside>
					<CreateChatModal
						isOpen={modalIsOpen}
						onAddingNewChat={onAddingNewChat}
						onClose={closeModal}
					/>
				</aside>
			</Suspense>
			{/* <CreateChatModal isOpen={modalIsOpen} onClose={closeModal} /> */}
		</>
	)
}

export default Home
