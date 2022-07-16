/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, Conversation as TwilioConversation } from '@twilio/conversations'

interface ChatService {
	client: Client
	chatName: string
}

interface Error {
	status: number
	message: string
	code?: string
}

interface ErrorObj {
	error: Error
}

interface Conversation extends TwilioConversation {
	error?: Error
}

const CONNECTION_STATE_CONNECTED = 'connected'

export const isChatClientConnected = (client?: Client): boolean => client?.connectionState === CONNECTION_STATE_CONNECTED

export const createChatClient = async (token: string) => {
	const newClient = new Client(token, {
		logLevel: 'silent'
	})

	return new Promise<Client>((resolve, reject) => {
		newClient.on('stateChanged', async state => {
			if (state === 'initialized') {
				resolve(newClient)
			}
			if (state === 'failed') {
				reject(new Error('Failed to initialize Twilio chat client'))
			}
		})
	})
}

export const joinChat = async (props: ChatService) => {
	const { client, chatName } = props

	let conversation: Conversation | undefined | ErrorObj

	try {
		conversation = await client.getConversationByUniqueName(chatName)
		conversation.join()
		return conversation
	} catch (error: any) {
		const errorObj: ErrorObj = { error: error.body }
		return errorObj
	}
}

export const createChat = async (props: ChatService) => {
	const { client, chatName } = props
	let conversation: Conversation | undefined | ErrorObj

	try {
		conversation = await client.createConversation({ uniqueName: chatName })
		conversation.join()
		return conversation
	} catch (error: any) {
		const errorObj: ErrorObj = { error: error.body }
		return errorObj
	}
}

export const joinOrCreateChat = async (props: ChatService) => {
	let conversation: Conversation | undefined | ErrorObj

	conversation = await joinChat(props)

	if (!conversation) {
		conversation = await createChat(props)
	}

	return conversation
}
