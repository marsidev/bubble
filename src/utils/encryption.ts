import crypto from 'crypto-js'

const secret = process.env.CRYPTO_SECRET

if (!secret) {
	throw new Error('CRYPTO_SECRET is not set')
}

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
