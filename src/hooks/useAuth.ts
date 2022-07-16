import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@utils/trpc'
import { useStore } from '@store'

export const useAuth = () => {
	const setSession = useStore(state => state.setSession)
	const clearSession = useStore(state => state.clearSession)
	const session = useQuery(['auth.getSession'])
	const router = useRouter()

	const { isLoading: loading, data: sessionData } = session

	useEffect(() => {
		if (!loading) {
			if (sessionData && sessionData?.user) {
				setSession(sessionData)
			} else {
				clearSession()
				router.push('/')
			}
		}
	}, [loading, sessionData])

	return {
		session: sessionData,
		authenticated: !!sessionData && !loading,
		loading
	}
}

export default useAuth
