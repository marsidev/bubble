import type { FC, ReactNode } from 'react'
import { Box, Flex, type FlexProps } from '@chakra-ui/react'

interface ChatContainerProps extends FlexProps {
	children: ReactNode
}

export const ChatContainer: FC<ChatContainerProps> = ({ children }) => {
	return (
		<>
			<Box
				bgImage='url(/chat-bg.png)'
				bgRepeat='repeat'
				h='full'
				left={0}
				opacity='0.06'
				pos='absolute'
				top={0}
				w='full'
			/>

			<Flex
				bg='var(--conversation-panel-background)'
				flexDir='column'
				minH='82vh'
				px={8}
				py={4}
				w='100vw'
			>
				{children}
			</Flex>
		</>
	)
}

export default ChatContainer
