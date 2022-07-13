import type { NextPage } from 'next'
import { Flex, Spinner } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useQuery } from '@utils/trpc'
import { NonSigned } from '@components'

const Home: NextPage = () => {
	const session = useQuery(['auth.getSession'])
	const hello = useQuery(['home.hello', { text: 'from tRPC' }])

	const authenticated = !!session.data && !session.isLoading

	useEffect(() => {
		if (authenticated) {
			console.log({ session: session.data })
		}
	}, [authenticated])

	if (session.isLoading) return <Spinner />

	return (
		<Flex flexDir='column' gap={4}>
			{!authenticated && <NonSigned />}

			{authenticated && hello.data && <p>{hello.data.greeting}</p>}
		</Flex>
	)
}

export default Home
