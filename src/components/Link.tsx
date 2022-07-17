import {
	Link as ChakraLink,
	type LinkProps as ChakraLinkProps
} from '@chakra-ui/react'
import NextLink, { type LinkProps as NextLinkProps } from 'next/link'

type LinkProps = ChakraLinkProps & NextLinkProps

export const Link: React.FC<LinkProps> = ({
	href,
	children,
	textDecoration = 'none',
	...props
}) => (
	<NextLink passHref href={href}>
		<ChakraLink _hover={{ textDecoration }} {...props}>
			{children}
		</ChakraLink>
	</NextLink>
)

export default Link
