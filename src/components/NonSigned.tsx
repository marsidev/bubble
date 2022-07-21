import { Button, Flex, type FlexProps, Heading } from '@chakra-ui/react'
import { signIn } from 'next-auth/react'
import { GitHub } from '~/icons'
import { useMutation } from '@utils/trpc'

export const NonSigned: React.FC<FlexProps> = ({ ...props }) => {
	const createAnonUser = useMutation(['user.createAnonUser'], {
		async onSuccess(user) {
			await signIn('credentials', {
				email: user.email,
				callbackUrl: '/chats'
			})
		}
	})

	const onSignInWithGitHub = async () => {
		await signIn('github', { callbackUrl: '/chats' })
	}

	const onSignInAsAnon = async () => {
		await createAnonUser.mutateAsync()
	}

	return (
		<Flex flexDir='column' gap={2} {...props}>
			<Heading color='var(--primary-title)'>Bubble</Heading>

			<Button
				_active={{
					bg: 'whiteAlpha.50'
				}}
				_hover={{
					bg: 'whiteAlpha.50',
					transform: 'scale(1.05)'
				}}
				bg='black'
				leftIcon={<GitHub />}
				mt={4}
				transition='all 0.2s'
				variant='solid'
				onClick={onSignInWithGitHub}
			>
				Sign in with GitHub
			</Button>

			<Button
				color='var(--intro-secondary)'
				fontSize='sm'
				isLoading={createAnonUser.isLoading}
				variant='link'
				onClick={onSignInAsAnon}
			>
				Or sign in as anonymous
			</Button>
		</Flex>
	)
}

export default NonSigned
