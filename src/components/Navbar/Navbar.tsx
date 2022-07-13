import type { FlexProps } from '@chakra-ui/react'
import type { FC } from 'react'
import { Flex } from '@chakra-ui/react'
// import { Moon } from 'phosphor-react'
import { DropdownMenu, NavbarAvatar, NavbarContainer } from '.'

export const Navbar: FC<FlexProps> = ({ ...props }) => {
	return (
		<NavbarContainer {...props}>
			<NavbarAvatar />

			<Flex align='center' gap={2}>
				{/* <IconButton aria-label='toggle theme' variant='ghost'>
					<Moon color='var(--panel-header-icon)' size={32} weight='fill' />
				</IconButton> */}

				<DropdownMenu />
			</Flex>
		</NavbarContainer>
	)
}

export default Navbar
