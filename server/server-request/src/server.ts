import express, { Request, Response } from 'express'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { json } from 'body-parser'
import chalk, {} from 'chalk'

type JsonBodyType = {
    data: any,
    time: Date
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
        const token = req.headers.authorization as string
        const response = await fetch(process.env.GET_PUBLIC_KEY_URL || 'http://localhost:4000/getPublicKey', { method : 'GET' })
        const {publicKey} = await response.json()   
        const { data, time } = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JsonBodyType
        const recieveTime = new Date()
        const sendTime = new Date(time)
        const totalTime = new Date(Math.abs(sendTime.getTime() - recieveTime.getTime()))
        console.log({
            Send_time: sendTime,
            Recieve_time: recieveTime,
            Total_time: `${totalTime.getUTCHours()}h:${totalTime.getMinutes()}M:${totalTime.getSeconds()}s:${totalTime.getMilliseconds()}z`,
            Data: data
        })
        console.log(chalk.blue('-------------------'))  
        return res.send({ result: 'Received data' })
    } catch {
        console.error(chalk.red(`Reject data\n------------------`))
        return res.send({ result: 'Reject data' })
    }
})

startServer()
