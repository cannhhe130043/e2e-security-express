import express, { Request, Response } from 'express'
import * as dotenv from 'dotenv'
import crypto from 'crypto'
import { json } from 'body-parser'
import fetch from 'node-fetch'
dotenv.config()

const app = express()
app.use(json())

app.post('/receive', async (req: Request, res: Response) => {
  let result = 'Sender is fake, reject data'
  const { data, signature, algorithm } = req.body
  // fetch to send server to get public key of verified sender
  const response = await fetch(
    process.env.PUBLIC_KEY_URL || 'http://localhost:4000/publicKey',
    { method: 'GET' }
  )
  //get key from response
  const { publicKey } = await response.json()
  const verifier = crypto.createVerify(algorithm)
  verifier.update(data)
  const publicKeyBuf = Buffer.from(publicKey, 'utf-8')
  const signatureBuf = Buffer.from(signature, 'hex')
  if (verifier.verify(publicKeyBuf, signatureBuf)) {
    result = 'Received data'
  }
  res.send({ result })
})

const port: number = parseInt(process.env.PORT || '3000', 10)

app.listen(port, () => console.log(`Start receive data on port ${port}`))
