import { Button, Flex, type FlexProps, Heading, Text } from '@chakra-ui/react'
import { signIn } from 'next-auth/react'
import { GitHub } from '~/icons'

export const NonSigned: React.FC<FlexProps> = ({ ...props }) => {
	const onSignIn = async () => {
		await signIn('github', { callbackUrl: '/chats' })
	}

	return (
		<Flex flexDir='column' gap={2} {...props}>
			<Heading color='var(--primary-title)'>Bubble</Heading>

			<Text color='var(--intro-secondary)' fontSize='sm'>You are not signed in.</Text>

			<Button
				_active={{
					bg: 'whiteAlpha.50'
				}}
				_hover={{
					bg: 'whiteAlpha.50'
				}}
				bg='black'
				leftIcon={<GitHub />}
				mt={4}
				transition='all 0.2s'
				variant='solid'
				onClick={onSignIn}
			>
				Sign in with GitHub
			</Button>
		</Flex>
	)
}

export default NonSigned
