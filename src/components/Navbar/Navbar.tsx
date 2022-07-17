import { type FlexProps, HStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { BackToHome, DropdownMenu, NavbarAvatar, NavbarContainer } from '.'

export const Navbar: React.FC<FlexProps> = ({ ...props }) => {
	const router = useRouter()
	const { pathname } = router
	const isNotHome = pathname !== '/chats'

	return (
		<NavbarContainer {...props}>
			<HStack>
				{isNotHome && <BackToHome />}
				<NavbarAvatar />
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
