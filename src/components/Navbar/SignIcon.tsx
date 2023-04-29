import { IconProps, SignOut } from 'phosphor-react'
import { GitHub } from '~/icons'

interface SignIconProps extends IconProps {
	authenticated: boolean
}

export const SignIcon = ({ authenticated, ...props }: SignIconProps) => {
	if (authenticated) {
		return <SignOut color='var(--panel-header-icon)' size={24} weight='bold' {...props} />
	}

	return <GitHub fill='var(--panel-header-icon)' size={24} {...props} />
}

export default SignIcon
