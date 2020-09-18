import express, { Request, Response } from 'express'
import * as dotenv from 'dotenv'
import { json } from 'body-parser'
import { readFileSync } from 'fs'
import fetch from 'node-fetch'
import crypto from 'crypto'
dotenv.config()

const app = express()
app.use(json())

app.post('/send', async (req: Request, res: Response) => {
  const data: string = req.body.data
  //get private key to sign data
  const privateKey = readFileSync('src/keys/private.key', 'utf8')
  //using crypto to sign data by private key
  const algorithm = 'RSA-SHA512'
  const signer = crypto.createSign(algorithm)
  signer.update(data)
  const signature = signer.sign(privateKey, 'hex')
  const url = process.env.RECEIVED_SERVER_URL || 'http://localhost:3000/send'
  //send data to recieved server
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    //body contains data and signature
    body: JSON.stringify({ data, signature, algorithm }),
    timeout: 10000,
  })
  //get result after post data
  const { result } = await response.json()
  return res.send({
    sentInformation: {
      data,
      algorithm,
      signature,
    },
    result,
  })
})

//provide public key to verify data to any one
app.get('/publicKey', (req: Request, res: Response) => {
  //get public key
  const publicKey = readFileSync('src/keys/public.key', 'utf8')
  // return public key
  return res.send({ publicKey })
})

const port: number = parseInt(process.env.PORT || '4000', 10)

app.listen(port, () =>
  console.log(`Server started on port ${port} and start sending data`)
)
