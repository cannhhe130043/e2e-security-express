const { generateKeyPair } = require('crypto')

//gen key pair
async function generateKey(): Promise<void> {
	generateKeyPair('rsa', {
		modulusLength: 8192,
		publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
		privateKeyEncoding: { type: 'pkcs1', format:  'pem' },
	}, (err: string, publicKey: string, privateKey: string) => {
        console.log(privateKey);
	})
}

generateKey()