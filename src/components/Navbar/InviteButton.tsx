import { Button, type ButtonProps, useBreakpointValue } from '@chakra-ui/react'
import { toast } from 'react-toastify'
import { api } from '~/utils/api'
import { copyTextToClipboard } from '~/utils/clipboard'

interface InviteButtonProps extends ButtonProps {
	sid: string
	text?: string
}

export const InviteButton: React.FC<InviteButtonProps> = ({ sid, text = 'Invite' }) => {
	const getInvitationLink = api.invite.getInvitationLink.useMutation({
		async onSuccess(data) {
			await copyTextToClipboard(data)
			toast.success('Invitation link copied to clipboard')
		},
		onError() {
			toast.error('Something went wrong')
		}
	})

	const breakPointText = useBreakpointValue({ base: '+', sm: text })

	const onClick = async () => {
		if (sid.startsWith('CH') && sid.length === 34) {
			try {
				await getInvitationLink.mutateAsync({ chatSid: sid })
			} catch (error) {
				console.error(error)
			}
		} else {
			toast.error('Something went wrong')
		}
	}

	return (
		<Button
			colorScheme='linkedin'
			isLoading={getInvitationLink.isLoading}
			size={['sm', 'md']}
			onClick={onClick}
		>
			{breakPointText}
		</Button>
	)
}

export default InviteButton
