import type { AppRouter } from '@server/router'
import { createReactQueryHooks } from '@trpc/react'

const trpc = createReactQueryHooks<AppRouter>()

const { useQuery, useMutation, useSubscription, useInfiniteQuery, useDehydratedState, useContext, createClient, Provider } = trpc

export {
	useQuery,
	useMutation,
	useSubscription,
	useInfiniteQuery,
	useDehydratedState,
	useContext,
	createClient,
	Provider
}

export default trpc

/**
 * Check out tRPC docs for Inference Helpers
 * https://trpc.io/docs/infer-types#inference-helpers
 */
