import {
	HStack,
	IconButton,
	Input,
	chakra
} from '@chakra-ui/react'
import { PaperPlaneRight, Smiley } from 'phosphor-react'
import { useRef } from 'react'
import { useStore } from '@store'

export const ChatInput = () => {
	const form = useRef<HTMLFormElement | null>(null)
	const activeChat = useStore(state => state.activeChat)

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(form.current!)
		const data = Object.fromEntries(formData.entries())
		const { message } = data

		if (message) {
			await activeChat?.sendMessage(message as string)
			// console.log({ message })
		}

		form.current?.reset()
	}

	return (
		<HStack
			align='center'
			as='footer'
			bg='var(--compose-panel-background)'
			bottom={0}
			justify='flex-end'
			left={0}
			pos='fixed'
			px={2}
			py={4}
			w='full'
			zIndex={999}
		>
			<IconButton aria-label='left caret icon' variant='ghost'>
				<Smiley color='var(--icon)' size={32} weight='regular' />
			</IconButton>

			<chakra.form ref={form} w='100%' onSubmit={onSubmit}>
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
			</chakra.form>

			<IconButton aria-label='left caret icon' variant='ghost'>
				<PaperPlaneRight color='var(--icon)' size={32} weight='fill' />
			</IconButton>
		</HStack>
	)
}

export default ChatInput
