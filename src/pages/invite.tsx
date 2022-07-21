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
			<Heading color='var(--primary-title)' fontSize='4xl'>
				🔍 Decrypting invitation link...
			</Heading>
		</ClientlessLayout>
	)
}

const BrokenLink = ({ message = 'Invitation link broken 💔' }) => {
	return (
		<ClientlessLayout title='Broken link 💔'>
			<VStack spacing={4}>
				<Heading color='var(--primary-title)' fontSize='4xl'>
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
			<VStack gap={2}>
				<Heading
					color='var(--primary-title)'
					fontSize='4xl'
					fontWeight='normal'
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
			<VStack gap={2}>
				<Heading
					color='var(--primary-title)'
					fontSize='4xl'
					fontWeight='normal'
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

// - show message {USER} invited you to {CHAT}
// - show buttons to join/reject invitation
// - if there is a session:
//   - accepting the invitation should redirect to the chat (/chats/:chatSid)
//   - declining the invitation should redirect to the home page (/chats)
// - if there is no session:
//   - there would be 3 options:
//     - sign in with github and join the chat
//     - join the chat as an anonymous user (this creates a new random user in the db)
//     - reject the invitation
//   - acceptinng the invitation should redirect to the chat (/chats/:chatSid)
//   - declining the invitation should redirect to the home page (/)

export default Invite
