import type { FC, ReactNode } from 'react'
import { Flex, Spinner } from '@chakra-ui/react'
import { DefaultSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { ChatInput, Navbar, NonSigned } from '~/components'
import { useAuth, useTwilio } from '~/hooks'
import { useStore } from '~/store'
import { defaultSeo as seo } from 'next-seo.config'

export interface LayoutProps {
	children: ReactNode
	isPrivate?: boolean
	title?: string
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

export const Layout: FC<LayoutProps> = ({ isPrivate = false, children, title }) => {
	const { authenticated, loading } = useAuth()
	useTwilio()
	const client = useStore(state => state.TwilioClient)
	const { pathname } = useRouter()

	const isLoading = loading || (authenticated && !client)
	const isChat = pathname.startsWith('/chats/')

	return (
		<>
			<DefaultSeo {...seo} title={title} />

			<Navbar minH='10.5vh' />

			<Flex
				alignItems='center'
				as='main'
				flex={1}
				flexDir='column'
				h='full'
				justify='center'
				minH={isChat ? '79vh' : '89.5vh'} // 100vh - (navbar height + chat input height)
				overflowX='hidden'
				overflowY='hidden'
				textAlign='center'
				w='full'
			>
				<LayoutContent authenticated={authenticated} isLoading={isLoading} isPrivate={isPrivate}>
					{children}
				</LayoutContent>
			</Flex>

			{isChat && <ChatInput minH='10.5vh' />}
		</>
	)
}

export default Layout
