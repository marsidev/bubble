import type { FC, ReactNode } from 'react'
import { Flex, FlexProps } from '@chakra-ui/react'

interface ChatsContainerProps extends FlexProps {
	children: ReactNode
}

export const ChatsContainer: FC<ChatsContainerProps> = ({ children }) => {
	return (
		<Flex
			bg='var(--background-default)'
			flexDir='column'
			minH='93.5vh'
			w='100vw'
		>
			{children}
		</Flex>
	)
}

export default ChatsContainer