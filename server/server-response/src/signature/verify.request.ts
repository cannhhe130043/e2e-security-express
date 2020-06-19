import { verify, constants } from 'crypto'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'

dotenv.config()

export const verifyRequest = (data: any, signature: string) => {
    const publicKey = readFileSync('src/keyPair/public.key.txt', 'utf-8')
    const isVerified = verify(
        'sha256',
        Buffer.from(data),
        publicKey,
        Buffer.from(signature, 'base64')
    )
    return isVerified
}