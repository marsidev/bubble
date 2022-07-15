/* eslint-disable @typescript-eslint/no-empty-function */
import type { FC, ReactNode } from 'react'
import type { ModalProps as ChakraModalProps } from '@chakra-ui/react'
import {
	Modal as ChakraModal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay
} from '@chakra-ui/react'

type ModalProps = ChakraModalProps & {
	title: string
	showCloseIcon?: boolean
	footer?: ReactNode
}

export const Modal: FC<ModalProps> = props => {
	const {
		isOpen,
		onClose,
		title = '',
		size = 'md',
		showCloseIcon = false,
		onCloseComplete = () => {},
		children,
		footer,
		...rest
	} = props

	return (
		<ChakraModal
			isOpen={isOpen}
			motionPreset='slideInBottom'
			size={size}
			onClose={onClose}
			onCloseComplete={onCloseComplete}
			{...rest}
		>
			<ModalOverlay />
			<ModalContent>
				{title && <ModalHeader textAlign='left'>{title}</ModalHeader>}

				{showCloseIcon && <ModalCloseButton />}

				<ModalBody>{children}</ModalBody>

				{footer && <ModalFooter>{footer}</ModalFooter>}
			</ModalContent>
		</ChakraModal>
	)
}

export default Modal
