import { Button, type ButtonProps } from '@chakra-ui/react'
import { toast } from 'react-toastify'
import { useMutation } from '@utils/trpc'
import { copyTextToClipboard } from '@utils/clipboard'

interface InviteButtonProps extends ButtonProps {
	sid: string
	text?: string
}

export const InviteButton: React.FC<InviteButtonProps> = ({ sid, text = 'Invite' }) => {
	const getInvitationLink = useMutation(['invite.getInvitationLink'], {
		async onSuccess(data) {
			await copyTextToClipboard(data)
			toast.success('Invitation link copied to clipboard')
		},
		onError() {
			toast.error('Something went wrong')
		}
	})

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
		<Button colorScheme='green' isLoading={getInvitationLink.isLoading} onClick={onClick}>
			{text}
		</Button>
	)
}

export default InviteButton
