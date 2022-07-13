import { Avatar, Spinner } from '@chakra-ui/react'
import { useQuery } from '@utils/trpc'

export const NavbarAvatar = () => {
	const session = useQuery(['auth.getSession'])
	const authenticated = !!session.data && !session.isLoading

	if (session.isLoading) return <Spinner />

	if (!authenticated) {
		return (
			<Avatar
				bg='transparent'
				borderRadius='sm'
				name='Bubble logo'
				size='sm'
				src='/logo.png'
			/>
		)
	}

	const name = session.data?.user?.name as string
	const image = session.data?.user?.image ?? `https://i.pravatar.cc/150?u=${name}`

	return <Avatar name={name} size='sm' src={image} />
}

export default NavbarAvatar
