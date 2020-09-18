import { generateKeyPairSync } from 'crypto'
import { existsSync, writeFileSync } from 'fs'

const genKey = async () => {
  if (!existsSync('./private.key') || !existsSync('./public.key')) {
    const { privateKey, publicKey } = await generateKeyPairSync('rsa', {
      modulusLength: 8192,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    })
    await writeFileSync('./src/keys/private.key', privateKey)
    await writeFileSync('./src/keys/public.key', publicKey)
  }
}

genKey()
