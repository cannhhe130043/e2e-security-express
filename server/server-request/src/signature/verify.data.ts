import { verify } from 'crypto'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'

dotenv.config()

export const verifyData = (data: any, signature: string, publicKey: string) => {
    const isVerified = verify(
        'sha256',
        Buffer.from(data),
        publicKey,
        Buffer.from(signature, 'base64')
    )
    return isVerified
}