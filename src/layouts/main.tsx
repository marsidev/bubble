import type { FC, ReactNode } from 'react'
import { Flex, Spinner } from '@chakra-ui/react'
import { DefaultSeo } from 'next-seo'
import { defaultSeo as seo } from 'next-seo.config'
import { Navbar, NonSigned } from '@components'
import { useAuth, useToken } from '@hooks'

interface LayoutProps {
	children: ReactNode
	withAuth?: boolean
}

interface LayoutContentProps {
	withAuth: boolean
	isLoading: boolean
	authenticated: boolean
	children: ReactNode
}

const LayoutContent = ({ withAuth, isLoading, authenticated, children }: LayoutContentProps) => {
	if (!withAuth || authenticated) return <>{children}</>
	if (isLoading) return <Spinner />
	return <NonSigned />
}

const Layout: FC<LayoutProps> = ({ withAuth = false, children }) => {
	const { authenticated, loading } = useAuth()
	useToken()

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
					// isLoading={session.isLoading}
					isLoading={loading}
					withAuth={withAuth}
				>
					{children}
				</LayoutContent>
			</Flex>
		</>
	)
}

export default Layout
