import express, { Request, Response } from 'express'
import fetch, { Headers } from 'node-fetch'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'
import jwt from 'jsonwebtoken'
import { verifyData } from './signature/verify.data'
import { json } from 'body-parser'

export type JwtPayLoadType = {
    data: any,
    signature: string
}

dotenv.config()

const app = express()
app.use(json())

const startServer = (): void => {
    const port: number = parseInt(process.env.PORT || '3000', 10)
    app.listen(port, () => { console.log(`server-request start on port ${port}`) })
}

app.post('/', async (req: Request, res: Response) => {
    try {
        const { data, signature, time } = req.body
        const response = await fetch(process.env.GET_PUBLIC_KEY_URL || 'http://localhost:4000/getPublicKey', { method : 'GET' })
        const {publicKey} = await response.json()   
        const isVerified = verifyData(data, signature, publicKey)
        if (!isVerified) {
            console.log('Reject data\n--------------------')
            return
        }
        const recieveTime = await new Date()
        const sendTime = new Date(time)
        const totalTime = new Date(Math.abs(sendTime.getTime() - recieveTime.getTime()))
        console.log({
            Send_time: sendTime,
            Recieve_time: recieveTime,
            Total_time: `${totalTime.getUTCHours()}h:${totalTime.getMinutes()}M:${totalTime.getSeconds()}s:${totalTime.getMilliseconds()}z`,
            Data: data
        })
        console.log('-------------------')  
        return
    } catch {
        console.error(`Reject data\n------------------`)
        return
    }
})

startServer()
