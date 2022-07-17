import type { ThemeConfig } from '@chakra-ui/react'
import type { Dict } from '@chakra-ui/utils'
import { extendTheme } from '@chakra-ui/react'
import '@fontsource/raleway/variable.css'
import '@fontsource/nunito/variable.css'

const fonts = {
	heading:
		'NunitoVariable, -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
	body: 'NunitoVariable, Roboto, -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'
}

const colors = {
	brand: {
		50: '#ddf5ff',
		100: '#b0deff',
		200: '#80c8ff',
		300: '#50b2fe',
		400: '#279cfc',
		500: '#1683e3',
		600: '#0966b2',
		700: '#004980',
		800: '#002c4f',
		900: '#00101f'
	}
}

const config: ThemeConfig = {
	initialColorMode: 'dark',
	useSystemColorMode: false
}

export const theme: Dict = extendTheme({ config, fonts, colors })

export default theme
