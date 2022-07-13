import type { FlexProps } from '@chakra-ui/react'
import type { FC, ReactNode } from 'react'
import { Flex } from '@chakra-ui/react'

interface ContainerProps extends FlexProps {
	children: ReactNode
}

export const Container: FC<ContainerProps> = ({ children, ...props }) => {
	return (
		<Flex
			_hover={{
				bg: 'var(--background-default-hover)'
			}}
			align='center'
			bg='var(--background-default)'
			cursor='pointer'
			gap={2}
			h={16}
			justify='flex-start'
			maxW='lg'
			mx='auto'
			pl={4}
			w='100%'
			{...props}
		>
			{children}
		</Flex>
	)
}

export default Container
