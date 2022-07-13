import type { NextPage } from 'next'
import { Button, Flex, Text } from '@chakra-ui/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useMutation, useQuery } from '@utils/trpc'
// import { prisma } from '@server/db/client'

const LoginButton = ({ ...props }) => {
	const { data: session, status } = useSession()

	const onSignIn = async () => {
		await signIn('github')
	}

	const onSignOut = async () => {
		await signOut({ callbackUrl: '/' })
	}

	return (
		<>
			{session && <Text>Signed in as {session.user?.email}</Text>}
			<Button
				{...props}
				color='white'
				colorScheme='gray'
				isLoading={status === 'loading'}
				size={['md', 'md']}
				onClick={session ? onSignOut : onSignIn}
			>
				{session ? 'Sign out' : 'Sign in with Github'}
			</Button>
		</>
	)
}

const Home: NextPage = () => {
	const secret = useQuery(['auth.getSecretMessage'])
	const session = useQuery(['auth.getSession'])
	const hello = useQuery(['home.hello', { text: 'from tRPC' }])
	const allHomes = useQuery(['home.getAll'])
	const createHome = useMutation(['home.add'])

	const onCreate = async () => {
		await createHome.mutateAsync({
			title: 'home title',
			description: 'home description',
			baths: 2
		})

		console.log('created!')
	}

	useEffect(() => {
		if (!session.isLoading) {
			console.log({ session: session.data })
		}
	}, [session.data])

	useEffect(() => {
		if (secret.isSuccess) {
			console.log({ secretMessage: secret.data })
		}
	}, [secret.isSuccess])

	useEffect(() => {
		if (allHomes.data) {
			console.log({ homes: allHomes.data })
		}
	}, [allHomes.data])

	return (
		<Flex flexDir='column' gap={4}>
			{hello.data ? <p>{hello.data.greeting}</p> : <p>Loading..</p>}

			<LoginButton />

			<Button colorScheme='teal' onClick={onCreate}>
				Create a new home
			</Button>
		</Flex>
	)
}

export default Home
