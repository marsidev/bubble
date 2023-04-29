/* eslint-disable @typescript-eslint/indent */
import type { LinkProps as NextLinkProps } from 'next/link'
import type { LinkProps as ChakraLinkProps } from '@chakra-ui/react'
import { Link as ChakraLink, forwardRef } from '@chakra-ui/react'
import NextLink from 'next/link'

export interface LinkProps
	extends ChakraLinkProps,
		Omit<NextLinkProps, 'href' | 'as'> {
	href: ChakraLinkProps['href']
	as?: ChakraLinkProps['as']
}

export const Link = forwardRef<LinkProps, typeof ChakraLink>(
	({ children, textDecoration = 'none', ...props }, ref) => (
		<ChakraLink ref={ref} _hover={{ textDecoration }} as={NextLink} {...props}>
			{children}
		</ChakraLink>
	)
)

export default Link
