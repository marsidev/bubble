import type { FC, ReactNode } from 'react'
import { Flex } from '@chakra-ui/react'
import { DefaultSeo } from 'next-seo'
import { defaultSeo } from 'next-seo.config'
import { Navbar } from '@components'

interface LayoutProps {
	children: ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
	return (
		<>
			<DefaultSeo {...defaultSeo} />

			<Navbar minH='6.5vh' />

			<Flex
				alignItems='center'
				as='main'
				flex={1}
				flexDir='column'
				justify='center'
				minH='93.5vh'
				py={14}
				textAlign='center'
				w='100%'
			>
				{children}
			</Flex>
		</>
	)
}

export default Layout
