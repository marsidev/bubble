import type { FC, ReactNode } from 'react'
import { Flex } from '@chakra-ui/react'
import { DefaultSeo } from 'next-seo'
import { defaultSeo } from 'next-seo.config'

interface LayoutProps {
	children: ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
	return (
		<>
			<DefaultSeo {...defaultSeo} />
			<Flex
				alignItems='center'
				as='main'
				flex={1}
				flexDir='column'
				justify='center'
				minH='100vh'
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
