import type { FlexProps } from '@chakra-ui/react'
import type { FC } from 'react'
import {
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList
} from '@chakra-ui/react'
import { DotsThreeVertical, Trash } from 'phosphor-react'
import { signIn, signOut } from 'next-auth/react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@utils/trpc'
import { useStore } from '@store'
import { SignIcon } from '.'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DropdownMenuProps extends FlexProps {}

export const DropdownMenu: FC<DropdownMenuProps> = () => {
	const activeChat = useStore(state => state.activeChat)
	const session = useQuery(['auth.getSession'])
	const router = useRouter()
	const { sid: routeSid } = router.query

	const removeChatFromDB = useMutation(['chat.remove'], {
		async onSuccess() {
			await activeChat?.delete()
		}
	})

	const { data: sessionData } = session
	const authenticated = !!session.data && !session.isLoading

	const isChat = router.pathname.startsWith('/chats/')
	const host = activeChat?.createdBy
	const isHost = !!host && sessionData?.user?.email === host
	const isSameChat = routeSid === activeChat?.sid
	const showDeleteOption = isChat && isHost && isSameChat && !!activeChat

	const onSignIn = async () => {
		await signIn('github', { callbackUrl: '/chats' })
	}

	const onSignOut = async () => {
		await signOut({ callbackUrl: '/' })
	}

	const onRemoveChat = async () => {
		const promise = removeChatFromDB.mutateAsync({ sid: activeChat!.sid })

		await toast.promise(promise, {
			pending: 'Removing chat...',
			success: 'Chat removed! 🗑️',
			error: 'Something went wrong! 😞'
		})

		router.push('/chats')
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

				{showDeleteOption && (
					<MenuItem
						icon={
							<Trash color='var(--panel-header-icon)' size={24} weight='bold' />
						}
						onClick={onRemoveChat}
					>
						Delete chat
					</MenuItem>
				)}
			</MenuList>
		</Menu>
	)
}

export default DropdownMenu
