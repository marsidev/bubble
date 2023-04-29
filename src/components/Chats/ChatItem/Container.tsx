import type { FC, ReactNode } from 'react'
import { Flex, type FlexProps, HStack } from '@chakra-ui/react'
import { Link } from '~/components'

interface ContainerProps extends FlexProps {
	sid: string
	children: ReactNode
}

export const Container: FC<ContainerProps> = ({ children, sid, ...props }) => {
	return (
		<Flex align='center' justify='center' w='full' {...props}>
			<Link href={`/chats/${sid}`} maxW='4xl' w='full'>
				<HStack
					_hover={{
						bg: 'var(--background-default-hover)'
					}}
					align='center'
					bg='var(--background-default)'
					h={16}
					justify='flex-start'
					maxW='4xl'
					mx='auto'
					px={8}
					spacing={2}
					w='full'
				>
					{children}
				</HStack>
			</Link>
		</Flex>
	)
}

export default Container
