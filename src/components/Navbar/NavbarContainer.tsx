import type { FlexProps } from '@chakra-ui/react'
import type { FC, ReactNode } from 'react'
import { Flex } from '@chakra-ui/react'

interface NavbarContainerProps extends FlexProps {
	children: ReactNode
}

export const NavbarContainer: FC<NavbarContainerProps> = ({ children, ...props }) => {
	return (
		<Flex
			align='center'
			as='header'
			// bg='teal.900'
			border='1px solid'
			borderColor='gray.700'
			justify='center'
			px={4}
			py={1}
			style={{
				backgroundColor: 'var(--panel-header-background)',
				color: 'var(--panel-header-icon)'
			}}
			w='full'
			{...props}
		>
			<Flex
				align='center'
				flexWrap='wrap'
				h='full'
				justify='space-between'
				maxW='4xl'
				mx='auto'
				w='full'
			>
				{children}
			</Flex>
		</Flex>
	)
}

export default NavbarContainer
