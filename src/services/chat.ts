/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, Conversation } from '@twilio/conversations'

interface ChatService {
	room: string
	token: string
}
const CONNECTION_STATE_CONNECTED = 'connected'

export const isChatClientConnected = (client?: Client): boolean => client?.connectionState === CONNECTION_STATE_CONNECTED

const ensureChatClient = (token: string) => {
	const newClient = new Client(token, {
		logLevel: 'silent'
	})

	return new Promise<Client>((resolve, reject) => {
		newClient.on('stateChanged', state => {
			if (state === 'initialized') {
				resolve(newClient)
			}
			if (state === 'failed') {
				reject(new Error('Failed to initialize chat client'))
			}
		})
	})
}

export const joinChat = async (props: ChatService) => {
	const { room, token } = props
	const client = await ensureChatClient(token)

	let conversation: Conversation | undefined

	try {
		conversation = await client.getConversationByUniqueName(room)
		conversation.join()
		console.log('joined to chat:', conversation.sid)
		return conversation
	} catch (error: any) {
		console.warn('Error joining conversation')
		// console.error(error.status) // 404
		// console.error(error.message) // Not Found
		console.warn(error.body) // {status: 404, message: 'Conversation not found'}
	}

	return conversation
}

export const createChat = async (props: ChatService) => {
	const { room, token } = props
	const client = await ensureChatClient(token)

	let conversation: Conversation | undefined

	try {
		conversation = await client.createConversation({ uniqueName: room })
		conversation.join()
		console.log('chat created:', conversation.sid)
		return conversation
	} catch (error: any) {
		console.warn('Error creating chat')
		// console.error(error.status) // 409
		// console.error(error.message) // Conflict
		console.warn(error.body) // {status: 409, message: 'Conversation with provided unique name already exists', code: 50353}
	}

	return conversation
}

export const joinOrCreateChat = async (props: ChatService) => {
	let conversation: Conversation | undefined

	conversation = await joinChat(props)

	if (!conversation) {
		conversation = await createChat(props)
	}

	return conversation
}
