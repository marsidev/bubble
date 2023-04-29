import crypto from 'crypto-js'
import { env } from '~/env.mjs'

const secret = env.CRYPTO_SECRET

export const encrypt = (text: string) => {
	const stringify = JSON.stringify(text)
	const encrypted = crypto.AES.encrypt(stringify, secret)
	return encrypted.toString()
}

export const decrypt = (data: string) => {
	const bytes = crypto.AES.decrypt(data, secret)
	const text = bytes.toString(crypto.enc.Utf8)
	return JSON.parse(text)
}
