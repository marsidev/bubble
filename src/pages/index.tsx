import type { NextPage } from 'next'
import { Flex } from '@chakra-ui/react'
import { trpc } from '@utils/trpc'

const Home: NextPage = () => {
	const hello = trpc.useQuery(['example.hello', { text: 'from tRPC' }])

	return (
		<Flex>
			{hello.data ? <p>{hello.data.greeting}</p> : <p>Loading..</p>}
		</Flex>
	)
}

export default Home
