import type { NextPage } from 'next'
import { Center, Container, HStack, Heading, StackDivider } from '@chakra-ui/react'
import { DefaultSeo } from 'next-seo'

const Custom404: NextPage = () => {
	return (
		<>
			<DefaultSeo title='404' />
			<Container>
				<Center>
					<HStack
						align='center'
						divider={<StackDivider borderColor='gray.400' minH='50px' />}
						spacing={4}
					>
						<Heading as='h1' fontSize={24} fontWeight={600}>
							404
						</Heading>

						<Heading as='h2' fontSize={14} fontWeight={400}>
							This page could not be found.
						</Heading>
					</HStack>
				</Center>
			</Container>
		</>
	)
}

export default Custom404
