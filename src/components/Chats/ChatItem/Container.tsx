import type { FlexProps } from '@chakra-ui/react'
import type { FC, ReactNode } from 'react'
import { Flex } from '@chakra-ui/react'
import { Link } from '@components'

interface ContainerProps extends FlexProps {
	sid: string
	children: ReactNode
}

export const Container: FC<ContainerProps> = ({ children, sid, ...props }) => {
	return (
		<Flex align='center' display='flex' justify='center'>
			<Link href={`/chats/${sid}`} maxW='lg' w='100%'>
				<Flex
					_hover={{
						bg: 'var(--background-default-hover)'
					}}
					align='center'
					bg='var(--background-default)'
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
			</Link>
		</Flex>
	)
}

export default Container
