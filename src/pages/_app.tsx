import '~/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import type { AppType } from 'next/app'
import type { Session } from 'next-auth'
import { ToastContainer, ToastContainerProps, Zoom } from 'react-toastify'
import { SessionProvider } from 'next-auth/react'
import { api } from '~/utils/api'
import { ChakraProvider } from '~/utils/chakra/Provider'

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

interface PageProps {
	session: Session | null
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	cookies: any
}

const MyApp: AppType<PageProps> = ({
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

export default api.withTRPC(MyApp)
