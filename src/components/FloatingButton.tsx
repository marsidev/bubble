import { FC, ReactElement } from 'react'
import { IconButton, type IconButtonProps } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionButton = motion(IconButton)

interface FloatingButtonProps extends IconButtonProps {
	onClickHandler?: () => void
	icon: ReactElement
	bottom?: number
	right?: number
}

const variants = {
	initial: {
		opacity: 1,
		scale: 1
	},
	animate: {
		transition: { duration: 0.5, ease: 'easeOut' }
	},
	tap: {
		scale: 0.9,
		transition: { duration: 0.1, ease: 'easeOut' }
	},
	hover: {
		scale: 1.05,
		transition: { duration: 0.1, ease: 'easeOut' }
	}
}

export const FloatingButton: FC<FloatingButtonProps> = props => {
	const { onClickHandler, icon, bottom = 8, right = 8, ...rest } = props

	return (
		<MotionButton
			_active={{ bg: 'brand.400' }}
			_hover={{ bg: 'brand.400' }}
			animate='animate'
			bg='brand.500'
			border='none'
			borderRadius='full'
			bottom={bottom}
			boxShadow='lg'
			color='white'
			fontSize='md'
			icon={icon}
			initial='initial'
			pos='absolute'
			right={right}
			size='lg'
			variant='solid'
			variants={variants}
			whileHover='hover'
			whileTap='tap'
			zIndex={9999}
			onClick={onClickHandler}
			{...rest}
		/>
	)
}

export default FloatingButton
