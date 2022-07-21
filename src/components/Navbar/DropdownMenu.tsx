import {
	type FlexProps,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList
} from '@chakra-ui/react'
import {
	DotsThreeVertical as DotsIcon,
	IconProps,
	SignOut as LeaveIcon,
	SignIn as SignInIcon,
	SignOut as SignOutIcon,
	Trash as TrashIcon
} from 'phosphor-react'
import { signIn, signOut } from 'next-auth/react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { GitHub as GitHubIcon } from '~/icons'
import { useMutation, useQuery } from '@utils/trpc'
import { useStore } from '@store'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DropdownMenuProps extends FlexProps { }

const iconProps: IconProps = {
	color: 'var(--panel-header-icon)',
	size: 24,
	weight: 'bold'
}

export const DropdownMenu: React.FC<DropdownMenuProps> = () => {
	const activeChat = useStore(state => state.activeChat)
	const clearSession = useStore(state => state.clearSession)
	const session = useQuery(['auth.getSession'])
	const router = useRouter()
	const { sid: routeSid } = router.query

	const createAnonUser = useMutation(['user.createAnonUser'], {
		async onSuccess(user) {
			await signIn('credentials', {
				email: user.email,
				callbackUrl: '/chats'
			})
		}
	})

	const { data: sessionData } = session
	const authenticated = !!session.data && !session.isLoading

	const isChat = router.pathname.startsWith('/chats/')
	const host = activeChat?.createdBy
	const isHost = !!host && sessionData?.user?.email === host
	const isSameChat = routeSid === activeChat?.sid

	const showDeleteOption = isChat && isHost && isSameChat && !!activeChat
	const showLeaveOption = isChat && !isHost && isSameChat && !!activeChat

	const onSignInWithGitHub = async () => {
		await signIn('github', { callbackUrl: '/chats' })
	}

	const onSignInAsAnon = async () => {
		await createAnonUser.mutateAsync()
	}

	const onSignOut = async () => {
		await signOut({ callbackUrl: '/' })
		clearSession()
	}

	const onRemoveChat = async () => {
		const promise = activeChat!.delete()
		await toast.promise(promise, {
			pending: 'Removing chat...',
			success: 'Chat removed! 🗑️',
			error: 'Something went wrong! 😞'
		})

		router.push('/chats')
	}

	const onLeaveChat = async () => {
		const promise = activeChat!.leave()

		await toast.promise(promise, {
			pending: 'Leaving chat...',
			success: 'Chat leaved!',
			error: 'Something went wrong! 😞'
		})

		router.push('/chats')
	}

	return (
		<Menu>
			<MenuButton
				aria-label='Options'
				as={IconButton}
				icon={<DotsIcon {...iconProps} size={32} />}
				variant='ghost'
			/>

			<MenuList>
				{!authenticated && (
					<MenuItem
						icon={<GitHubIcon fill='var(--panel-header-icon)' size={24} />}
						onClick={onSignInWithGitHub}
					>
						Sign in with GitHub
					</MenuItem>
				)}

				{!authenticated && (
					<MenuItem icon={<SignInIcon {...iconProps} />} onClick={onSignInAsAnon}>
						Sign in as anonymous
					</MenuItem>
				)}

				{authenticated && (
					<MenuItem icon={<SignOutIcon {...iconProps} />} onClick={onSignOut}>
						Sign out
					</MenuItem>
				)}

				{showDeleteOption && (
					<MenuItem icon={<TrashIcon {...iconProps} />} onClick={onRemoveChat}>
						Delete chat
					</MenuItem>
				)}

				{showLeaveOption && (
					<MenuItem icon={<LeaveIcon {...iconProps} />} onClick={onLeaveChat}>
						Leave chat
					</MenuItem>
				)}
			</MenuList>
		</Menu>
	)
}

export default DropdownMenu
