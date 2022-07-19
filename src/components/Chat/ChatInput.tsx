import {
	Flex,
	type FlexProps,
	HStack,
	IconButton,
	Input,
	chakra
} from '@chakra-ui/react'
import { PaperPlaneRight, Smiley } from 'phosphor-react'
import { useRef } from 'react'
import { useStore } from '@store'

export const ChatInput: React.FC<FlexProps> = ({ ...props }) => {
	const form = useRef<HTMLFormElement | null>(null)
	const activeChat = useStore(state => state.activeChat)
	const activeChatMessages = useStore(state => state.activeChatMessages)

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!activeChatMessages || !activeChat || !form) {
			console.warn('Chat not initialized')
			return
		}

		const formData = new FormData(form.current!)
		const data = Object.fromEntries(formData.entries())
		const { message } = data

		if (message) {
			await activeChat?.sendMessage(message as string)
		}

		form.current?.reset()
	}

	return (
		<Flex
			{...props}
			align='center'
			as='footer'
			bg='var(--compose-panel-background)'
			bottom={0}
			justify='center'
			left={0}
			pos='sticky'
			w='full'
			zIndex={999}
		>
			<HStack
				align='center'
				bg='var(--compose-panel-background)'
				bottom={0}
				justify='flex-end'
				left={0}
				maxW='4xl'
				px={2}
				py={4}
				w='100%'
			>
				<IconButton aria-label='left caret icon' variant='ghost'>
					<Smiley color='var(--icon)' size={32} weight='regular' />
				</IconButton>

				<chakra.form ref={form} display='flex' gap={2} w='100%' onSubmit={onSubmit}>
					<Input
						autoComplete='off'
						// bg='var(--compose-input-background)'
						// border='1px solid var(--compose-input-border)'
						id='message'
						name='message'
						placeholder='Write a message...'
						spellCheck='false'
						type='text'
						variant='filled'
					/>

					<IconButton
						aria-label='left caret icon'
						disabled={!activeChatMessages || !activeChat}
						type='submit'
						variant='ghost'
					>
						<PaperPlaneRight color='var(--icon)' size={32} weight='fill' />
					</IconButton>
				</chakra.form>
			</HStack>
		</Flex>
	)
}

export default ChatInput
