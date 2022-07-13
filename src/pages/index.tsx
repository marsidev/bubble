import type { NextPage } from 'next'
// import { Flex } from '@chakra-ui/react'
import { useQuery } from '@utils/trpc'
import Layout from '@layouts/main'

const Home: NextPage = () => {
	const hello = useQuery(['home.hello', { text: 'from tRPC' }])

	return (
		<Layout withAuth>
			{hello.data && <p>{hello.data.greeting}</p>}
		</Layout>
	)
}

export default Home
