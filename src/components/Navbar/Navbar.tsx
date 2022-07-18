import { type FlexProps, HStack, Heading } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useStore } from '@store'
import { BackToHome, DropdownMenu, NavbarAvatar, NavbarContainer } from '.'

export const Navbar: React.FC<FlexProps> = ({ ...props }) => {
	const { pathname } = useRouter()
	const activeChat = useStore(state => state.activeChat)

	const isNotHome = pathname !== '/' && pathname !== '/chats'
	const isChat = pathname.startsWith('/chats/')

	const chatTitle = activeChat?.friendlyName || activeChat?.uniqueName || ''

	return (
		<NavbarContainer {...props}>
			<HStack>
				{isNotHome && <BackToHome />}
				<NavbarAvatar />

				{isChat && (
					<Heading
						as='h1'
						fontFamily='NunitoVariable'
						fontSize={['xl', 'xl']}
					>
						{chatTitle}
					</Heading>
				)}
			</HStack>

			<HStack>
				{/* <IconButton aria-label='toggle theme' variant='ghost'>
					<Moon color='var(--panel-header-icon)' size={32} weight='fill' />
				</IconButton> */}

				<DropdownMenu />
			</HStack>
		</NavbarContainer>
	)
}

export default Navbar
