import CryptoJS from 'crypto-js'

const secret = process.env.CRYPTO_SECRET

if (!secret) {
	throw new Error('CRYPTO_SECRET is not set')
}

export const encrypt = (text: string) => CryptoJS.AES.encrypt(text, secret).toString()
export const decrypt = (data: string) => CryptoJS.AES.decrypt(data, secret).toString(CryptoJS.enc.Utf8)
