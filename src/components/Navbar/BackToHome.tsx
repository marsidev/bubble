import { IconButton } from '@chakra-ui/react'
import { CaretLeft } from 'phosphor-react'
import { Link } from '~/components'

export const BackToHome = () => {
	return (
		<Link href='/chats'>
			<IconButton aria-label='left caret icon' variant='ghost'>
				<CaretLeft color='var(--panel-header-icon)' size={32} weight='bold' />
			</IconButton>
		</Link>
	)
}

export default BackToHome
