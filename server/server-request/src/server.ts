import express, { Request, Response } from 'express'
import fetch, { Headers } from 'node-fetch'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'
import jwt from 'jsonwebtoken'
import { verifyData } from './signature/verify.data'

export type JwtPayLoadType = {
    data: any,
    signature: string
}

dotenv.config()

const app = express()

const startServer = (): void => {
    const port: number = parseInt(process.env.PORT || '3000', 10)
    app.listen(port, () => { console.log(`server-request start on port ${port}`) })
}

app.get('/getData', async (req: Request, res: Response) => {
    try {
        const sendTime = new Date()
        const url = process.env.SERVER_RESPONSE_URL
        if (!url) {
            return res.send('Bad request')
        }
        const response = await fetch(url, { method: 'GET' }
        )
        const { token } = await response.json()
        const privateKey = readFileSync('src/keyPair/private.key.txt').toString('base64')
        const payload = await jwt.verify(token, privateKey) as JwtPayLoadType
        const { data, signature } = payload
        const isVerified = verifyData(data, signature)
        if (!isVerified) {
            return res.status(401).send('Reject data')
        }
        const recieveTime = await new Date()
        const totalTime = new Date(Math.abs(sendTime.getTime() - recieveTime.getTime()))
        return res.status(200).send({
            Send_time: sendTime,
            Recieve_time: recieveTime,
            Total_time: `${totalTime.getUTCHours()}h:${totalTime.getMinutes()}M:${totalTime.getSeconds()}s:${totalTime.getMilliseconds()}z`,
            Data: data
        })
    } catch (e) {
        throw new Error(e)
    }
})

startServer()