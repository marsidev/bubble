import { Avatar, Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { DefaultGroup } from '~/icons'
import { useQuery } from '@utils/trpc'
import { Link } from '@components'

const Brand = () => (
	<Avatar
		bg='transparent'
		borderRadius='sm'
		name='Bubble logo'
		size='sm'
		src='/logo.png'
	/>
)

export const NavbarAvatar = () => {
	const session = useQuery(['auth.getSession'])
	const { pathname } = useRouter()
	const authenticated = !!session.data && !session.isLoading
	const isHome = pathname === '/chats' || pathname === '/'
	const isChat = pathname.startsWith('/chats/') || pathname === '/'

	const name = session.data?.user?.name as string
	const image = session.data?.user?.image as string // ?? `https://i.pravatar.cc/150?u=${name}`

	if (session.isLoading) return <Spinner />

	if (!authenticated && !isHome) {
		return (
			<Link href='/'>
				<Brand />
			</Link>
		)
	}

	if (!authenticated && isHome) {
		return <Brand />
	}

	if (!isHome && !isChat) {
		return (
			<Link href='/chats'>
				<Avatar name={name} size='sm' src={image} />
			</Link>
		)
	}

	if (isChat) {
		return <DefaultGroup />
	}

	return <Avatar name={name} size='sm' src={image} />
}

export default NavbarAvatar
