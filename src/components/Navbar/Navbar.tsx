import { Flex, type FlexProps, HStack, Heading } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useStore } from '~/store'
import { BackToHome, DropdownMenu, InviteButton, NavbarAvatar, NavbarContainer } from '.'

export const Navbar: React.FC<FlexProps> = ({ ...props }) => {
	const { pathname } = useRouter()
	const activeChat = useStore(state => state.activeChat)
	const client = useStore(state => state.TwilioClient)
	const session = useStore(state => state.session)

	const isChat = pathname.startsWith('/chats/')
	const chatTitle = activeChat?.friendlyName || activeChat?.uniqueName || ''
	const chatSid = activeChat?.sid || ''
	const host = activeChat?.createdBy
	const isHost = !!host && session?.user?.email === host

	return (
		<NavbarContainer {...props}>
			<HStack spacing={[1, 2]}>
				{isChat && <BackToHome />}

				<NavbarAvatar />

				{isChat && (
					<Heading
						as='h1'
						className='ellipsis'
						fontFamily='NunitoVariable'
						fontSize={['md', 'lg']}
						maxW={['180px', '280px', '600px', '900px']}
						pl={2}
					>
						{chatTitle}
					</Heading>
				)}
			</HStack>

			<Flex align='center' flexDir='row' gap={[1, 2]}>
				{isChat && client && isHost && <InviteButton sid={chatSid} />}

				{/* <IconButton aria-label='toggle theme' variant='ghost'>
					<Moon color='var(--panel-header-icon)' size={32} weight='fill' />
				</IconButton> */}

				<DropdownMenu />
			</Flex>
		</NavbarContainer>
	)
}

export default Navbar
