import { sign, constants } from 'crypto'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'

dotenv.config()

export const signData = (data: any) => {
    const privateKey = readFileSync('src/keyPair/private.key.txt', 'utf-8')
    const signature = sign(
        'sha256',
        Buffer.from(data),
        {
            key: privateKey,
            padding: constants.RSA_PKCS1_PADDING
        }
    ).toString('base64')
    return signature
}
