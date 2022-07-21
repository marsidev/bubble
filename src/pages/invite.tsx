import type { NextPage } from 'next'
import type { Conversation } from '@twilio/conversations'
import { useState } from 'react'
import { Button, HStack, Heading, VStack, chakra } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { ClientlessLayout } from '@layouts'
import { useAuth } from '@hooks'
import { Link, ReturnHome } from '@components'
import { useQuery } from '@utils/trpc'
import { createChatClient } from '@services'

interface AlreadyJoinedProps {
	chat: Conversation
	title: string
}

const Decrypting = () => {
	return (
		<ClientlessLayout>
			<Heading
				color='var(--primary-title)'
				fontSize='4xl'
				wordBreak='break-word'
			>
				🔍 Decrypting invitation link...
			</Heading>
		</ClientlessLayout>
	)
}

const BrokenLink = ({ message = 'Invitation link broken 💔' }) => {
	return (
		<ClientlessLayout title='Broken link 💔'>
			<VStack maxW='4xl' spacing={4}>
				<Heading
					color='var(--primary-title)'
					fontSize='4xl'
					wordBreak='break-word'
				>
					{message}
				</Heading>

				<ReturnHome />
			</VStack>
		</ClientlessLayout>
	)
}

const AlreadyJoined: React.FC<AlreadyJoinedProps> = ({ title = '', chat }) => {
	return (
		<ClientlessLayout title={title}>
			<VStack gap={2} maxW='4xl'>
				<Heading
					color='var(--primary-title)'
					fontSize='4xl'
					fontWeight='normal'
					wordBreak='break-word'
				>
					{'You have already joined to the chat '}
					<chakra.span fontStyle='italic' fontWeight='bold'>
						{chat.friendlyName || chat.sid}
					</chakra.span>
					{'. 🤗'}
				</Heading>

				<Link href={`/chats/${chat.sid}`}>
					<Button colorScheme='linkedin'>Go to chat</Button>
				</Link>
			</VStack>
		</ClientlessLayout>
	)
}

const Invite: NextPage = () => {
	const router = useRouter()
	const { authenticated, session } = useAuth()
	const [title, setTitle] = useState('')
	const [conversation, setConversation] = useState<Conversation | null>(null)
	const [joinable, setJoinable] = useState(true)
	const [loading, setLoading] = useState(true)
	const { data: encryptedData } = router.query

	const invitation = useQuery(
		['invite.decryptInvitationLink', {
			data: (encryptedData as string)?.replace(/ /g, '+') || ''
		}],
		{
			refetchOnWindowFocus: false,
			retry: false,
			retryOnMount: true,
			async onSuccess(data) {
				const title = `${data.host.name} invited you to chat!`
				setTitle(title)

				const client = await createChatClient(data.accessToken)
				const conversation = await client.getConversationBySid(data.chatSid)
				setConversation(conversation)

				try {
					await conversation.getParticipantByIdentity(session?.user?.email)
					console.warn('You are already a member of this chat')
					setJoinable(false)
				} catch (e) {
					console.log('joinable')
				}

				setLoading(false)
			}
		}
	)

	const { host: hostUser, chatSid } = invitation.data || {}

	const onDecline = () => {
		router.push(authenticated ? '/chats' : '/')
	}

	const onAccept = async () => {
		if (!joinable) {
			return toast.error('You are already a member of this chat')
		}

		if (session?.user?.email && conversation) {
			const identity = session.user.email
			const participant = await conversation.add(identity)
			if (participant) {
				router.push(`/chats/${chatSid}`)
			}
		} else {
			toast.error('Something went wrong 😢')
		}
	}

	if (invitation.isLoading || loading) {
		return <Decrypting />
	}

	if (invitation.error) {
		return <BrokenLink message={invitation.error.message} />
	}

	if (!joinable && conversation) {
		return <AlreadyJoined chat={conversation} title={title} />
	}

	return (
		<ClientlessLayout title={title}>
			<VStack gap={2} maxW='4xl'>
				<Heading
					color='var(--primary-title)'
					fontSize='4xl'
					fontWeight='normal'
					wordBreak='break-word'
				>
					<chakra.span fontWeight='bold'>{hostUser?.name}</chakra.span> invited
					you to chat on{' '}
					<chakra.span fontStyle='italic' fontWeight='bold'>
						{conversation?.friendlyName}
					</chakra.span>
				</Heading>

				<HStack>
					<Button colorScheme='linkedin' onClick={onAccept}>
						Join
					</Button>

					<Button
						aria-label='Decline chat invitation'
						colorScheme='pink'
						onClick={onDecline}
					>
						Decline
					</Button>
				</HStack>
			</VStack>
		</ClientlessLayout>
	)
}

export default Invite
