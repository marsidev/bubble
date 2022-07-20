import crypto from 'crypto-js'

const secret = process.env.CRYPTO_SECRET

if (!secret) {
	throw new Error('CRYPTO_SECRET is not set')
}

export const encrypt = (text: string) =>
	crypto.AES.encrypt(JSON.stringify(text), secret).toString()

export const decrypt = (data: string) =>
	JSON.parse(crypto.AES.decrypt(data, secret).toString(crypto.enc.Utf8))
