import type { FC } from 'react'
import { Flex, type FlexProps, chakra } from '@chakra-ui/react'
import { api } from '~/utils/api'

interface SubHeaderProps extends FlexProps {
	lastMessageAuthor: string
	lastMessageBody: string
}

export const SubHeader: FC<SubHeaderProps> = ({ lastMessageAuthor, lastMessageBody, ...props }) => {
	const decryptedMessage = api.message.decrypt.useQuery(
		{
			encrypted: lastMessageBody
		},
		{
			refetchOnWindowFocus: false,
			retryOnMount: true,
			retry: false
		}
	)

	const messageBody = decryptedMessage?.data

	return (
		<Flex
			align='center'
			color='var(--secondary)'
			fontSize='xs'
			justify='flex-start'
			maxW='4xl'
			// maxW='480px'
			minH='20px'
			mt='2px'
			textAlign='left'
			w='100%'
			{...props}
		>
			{messageBody && (
				<chakra.span className='ellipsis' maxW={['100px', '150px', '200px', '300px', '400px']}>
					{lastMessageAuthor}
				</chakra.span>
			)}

			{messageBody && <chakra.span>:</chakra.span>}

			<chakra.span
				className='ellipsis'
				maxW={['300px', '350px', '400px', '600px', '600px']}
				ml={messageBody ? '3px' : 0}
			>
				{messageBody || 'Chat is empty'}
			</chakra.span>
		</Flex>
	)
}

export default SubHeader
