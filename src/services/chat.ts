/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, Conversation } from '@twilio/conversations'
import { v4 as uuidv4 } from 'uuid'

interface ChatService {
	client: Client
	chatName: string
}

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

	let conversation: Conversation | null

	try {
		conversation = await client.getConversationByUniqueName(chatName)
		conversation.join()
		return conversation
	} catch (error: any) {
		console.warn(error)
		return null
	}
}

export const createChat = async (props: ChatService) => {
	const { client, chatName } = props
	let conversation: Conversation | null

	try {
		conversation = await client.createConversation({
			uniqueName: uuidv4(),
			friendlyName: chatName
		})
		conversation.join()
		return conversation
	} catch (error: any) {
		console.warn(error)
		return null
	}
}

export const joinOrCreateChat = async (props: ChatService) => {
	let conversation: Conversation | null

	conversation = await joinChat(props)

	if (!conversation) {
		conversation = await createChat(props)
	}

	return conversation
}
