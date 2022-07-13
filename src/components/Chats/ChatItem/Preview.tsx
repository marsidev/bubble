import type { FlexProps } from '@chakra-ui/react'
import type { FC } from 'react'
import type { Conversation } from '@twilio/conversations'
import { Flex } from '@chakra-ui/react'
import { Header } from './Header'
import { SubHeader } from './SubHeader'

interface PreviewProps extends FlexProps {
	conversation?: Conversation
}

export const Preview: FC<PreviewProps> = ({ conversation, ...props }) => {
	return (
		<Flex
			borderTop='1px solid'
			// eslint-disable-next-line react/jsx-sort-props
			borderColor='var(--border-list)'
			flexDir='column'
			flexGrow={1}
			flexShrink={1}
			h={16}
			justify='center'
			pr={4}
			py={0}
			w='100%'
			{...props}
		>
			<Header chatName='Chat name' lastMessageTimestamp='ayer' />
			<SubHeader lastMessageAuthor='Mafer' lastMessageBody='Ultimo mensaje' />
		</Flex>
	)
}

export default Preview
