import type { FC, ReactNode } from 'react'
import { Flex, Spinner } from '@chakra-ui/react'
import { DefaultSeo } from 'next-seo'
import { defaultSeo as seo } from 'next-seo.config'
import { Navbar, NonSigned } from '@components'
import { useAuth, useTwilio } from '@hooks'
import { useStore } from '@store'

interface LayoutProps {
	children: ReactNode
	isPrivate?: boolean
}

interface LayoutContentProps {
	isPrivate: boolean
	isLoading: boolean
	authenticated: boolean
	children: ReactNode
}

const LayoutContent = ({ isPrivate, isLoading, authenticated, children }: LayoutContentProps) => {
	if (isLoading) return <Spinner />
	if (!isPrivate) return <>{children}</>
	if (!authenticated) return <NonSigned />
	return <>{children}</>
}

const Layout: FC<LayoutProps> = ({ isPrivate = false, children }) => {
	const { authenticated, loading } = useAuth()
	useTwilio()
	const client = useStore(state => state.TwilioClient)
	const isLoading = loading || (authenticated && !client)

	return (
		<>
			<DefaultSeo {...seo} />

			<Navbar minH='6.5vh' />

			<Flex
				alignItems='center'
				as='main'
				flex={1}
				flexDir='column'
				h='full'
				justify='center'
				minH='93.5vh'
				overflowY='auto'
				textAlign='center'
				w='full'
			>
				<LayoutContent
					authenticated={authenticated}
					isLoading={isLoading}
					isPrivate={isPrivate}
				>
					{children}
				</LayoutContent>
			</Flex>
		</>
	)
}

export default Layout
