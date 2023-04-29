import type { FC, ReactNode } from 'react'
import { Flex } from '@chakra-ui/react'
import { DefaultSeo } from 'next-seo'
import { Navbar } from '~/components'
import { defaultSeo as seo } from 'next-seo.config'

export interface ClientlessLayoutProps {
	children: ReactNode
	title?: string
}

export const ClientlessLayout: FC<ClientlessLayoutProps> = ({ children, title }) => {
	return (
		<>
			<DefaultSeo {...seo} title={title} />

			<Navbar minH='6.5vh' />

			<Flex
				alignItems='center'
				as='main'
				flex={1}
				flexDir='column'
				h='full'
				justify='center'
				minH='89.5vh'
				overflowX='hidden'
				overflowY='hidden'
				textAlign='center'
				w='full'
			>
				{children}
			</Flex>
		</>
	)
}

export default ClientlessLayout
