import '@styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import type { AppRouter } from '@server/router'
import type { AppType } from 'next/dist/shared/lib/utils'
import { withTRPC } from '@trpc/next'
import superjson from 'superjson'
import { SessionProvider } from 'next-auth/react'
import { ToastContainer, ToastContainerProps, Zoom } from 'react-toastify'
import { ChakraProvider } from '@utils/chakra/Provider'

const toastProps: ToastContainerProps = {
	position: 'bottom-center',
	autoClose: 2000,
	hideProgressBar: true,
	newestOnTop: false,
	closeOnClick: true,
	rtl: false,
	pauseOnFocusLoss: false,
	draggable: true,
	pauseOnHover: false,
	theme: 'dark',
	limit: 15,
	closeButton: false,
	transition: Zoom,
	icon: true
}

const MyApp: AppType = ({
	Component,
	pageProps: { session, cookies, ...pageProps }
}) => {
	return (
		<SessionProvider session={session}>
			<ChakraProvider cookies={cookies}>
				<Component {...pageProps} />
				<ToastContainer {...toastProps} />
			</ChakraProvider>
		</SessionProvider>
	)
}

export const getBaseUrl = () => {
	if (typeof window !== 'undefined') return ''
	if (process.browser) return '' // Browser should use current path
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url

	return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

export default withTRPC<AppRouter>({
	config() {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */
		const url = `${getBaseUrl()}/api/trpc`

		return {
			url,
			transformer: superjson
			/**
			 * @link https://react-query.tanstack.com/reference/QueryClient
			 */
			// queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
		}
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: false
})(MyApp)
