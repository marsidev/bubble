import type { FlexProps } from '@chakra-ui/react'
import type { FC } from 'react'
import {
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList
} from '@chakra-ui/react'
import { DotsThreeVertical } from 'phosphor-react'
import { signIn, signOut } from 'next-auth/react'
import { useQuery } from '@utils/trpc'
import { SignIcon } from '.'

export const DropdownMenu: FC<FlexProps> = () => {
	const session = useQuery(['auth.getSession'])
	const { data: sessionData } = session
	const authenticated = !!session.data && !session.isLoading

	const onSignIn = async () => {
		await signIn('github', { callbackUrl: '/chats' })
	}

	const onSignOut = async () => {
		await signOut({ callbackUrl: '/' })
	}

	return (
		<Menu>
			<MenuButton
				aria-label='Options'
				as={IconButton}
				icon={
					<DotsThreeVertical
						color='var(--panel-header-icon)'
						size={32}
						weight='bold'
					/>
				}
				variant='ghost'
			/>

			<MenuList>
				<MenuItem
					icon={<SignIcon authenticated={authenticated} />}
					onClick={sessionData ? onSignOut : onSignIn}
				>
					{sessionData ? 'Sign out' : 'Sign in with GitHub'}
				</MenuItem>
			</MenuList>
		</Menu>
	)
}

export default DropdownMenu
