import { useEffect, useRef, useState } from 'react'
import { Button, FormControl, Input, chakra } from '@chakra-ui/react'
import { toast } from 'react-toastify'
import { Modal } from '@components'
import { useStore } from '@store'

interface CreateChatModalProps {
	isOpen: boolean
	onClose: () => void
	onAddingNewChat: (chatName: string) => void
}

export const CreateChatModal: React.FC<CreateChatModalProps> = props => {
	const { isOpen, onClose, onAddingNewChat, ...rest } = props
	const form = useRef(null)
	const isAddingChat = useStore(state => state.isAddingChat)
	const [submitted, setSubmitted] = useState(false)

	useEffect(() => {
		if (submitted && !isAddingChat) {
			onClose()
			setSubmitted(false)
		}
	}, [isAddingChat, submitted])

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(form.current!)
		const data = Object.fromEntries(formData.entries())
		const chatName = data.chatName as string

		if (chatName.trim() === '') {
			toast.error('Chat name is empty')
			return
		}

		if (chatName.replace(/[^a-zA-Z0-9]/g, '').length < 3) {
			toast.error('Name is too short')
			return
		}

		setSubmitted(true)
		onAddingNewChat(chatName as string)
	}

	return (
		<Modal
			blockScrollOnMount={false}
			id='search'
			isOpen={isOpen}
			motionPreset='slideInBottom'
			scrollBehavior='inside'
			showCloseIcon={true}
			size='md'
			title='Add a new chat'
			onClose={onClose}
			{...rest}
		>
			<chakra.form
				ref={form}
				display='flex'
				flexDir='column'
				gap={4}
				pb={4}
				onSubmit={onSubmit}
			>
				<FormControl>
					<Input
						autoComplete='off'
						autoFocus={true}
						id='chatName'
						name='chatName'
						placeholder='Chat name'
						type='text'
					/>
				</FormControl>

				<Button
					_active={{
						bg: 'brand.400'
					}}
					_hover={{
						bg: 'brand.400'
					}}
					bg='brand.500'
					isLoading={isAddingChat}
					type='submit'
				>
					Create
				</Button>
			</chakra.form>
		</Modal>
	)
}

export default CreateChatModal
