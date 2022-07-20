import { Button } from '@chakra-ui/react'
import { Link } from '@components/Link'

export interface ReturnHomeProps {
	href?: string
}

export const ReturnHome: React.FC<ReturnHomeProps> = ({ href = '/' }) => {
	return (
		<Link href={href}>
			<Button
				_active={{
					textDecoration: 'none',
					filter: 'brightness(85%)'
				}}
				_hover={{
					textDecoration: 'none',
					filter: 'brightness(90%)'
				}}
				colorScheme='linkedin'
			>
				Go back home
			</Button>
		</Link>
	)
}

export default ReturnHome
