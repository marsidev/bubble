import { useEffect } from 'react'
import { useQuery } from '@utils/trpc'
import { useStore } from '@store'

export const useAuth = () => {
	const setSession = useStore(state => state.setSession)
	const clearSession = useStore(state => state.clearSession)
	const session = useQuery(['auth.getSession'])

	const authenticated = !!session.data && !session.isLoading
	const unauthenticated = !session.data && !session.isLoading

	useEffect(() => {
		if (authenticated && session.data?.user) {
			setSession(session.data)
		} else if (unauthenticated) {
			clearSession()
		}
	}, [authenticated])

	return {
		session: session.data,
		authenticated,
		loading: session.isLoading
	}
}

export default useAuth
