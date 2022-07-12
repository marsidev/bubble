import type { ThemeConfig } from '@chakra-ui/react'
import type { Dict } from '@chakra-ui/utils'
import { extendTheme } from '@chakra-ui/react'
import '@fontsource/raleway/variable.css'
import '@fontsource/nunito/variable.css'

const fonts = {
	heading:
		'RalewayVariable, -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
	body: 'NunitoVariable, Roboto, -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'
}

const config: ThemeConfig = {
	initialColorMode: 'dark',
	useSystemColorMode: false
}

export const theme: Dict = extendTheme({ config, fonts })

export default theme
