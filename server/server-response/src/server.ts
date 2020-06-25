import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'
import fetch from 'node-fetch'
import { generatePeople } from './people/person'
import { json } from 'body-parser'

type JsonBodyType = {
    data: any,
    time: Date
}

dotenv.config()

const app = express()
app.use(json())

const startServer = (): void => {
    const port: number = parseInt(process.env.PORT || '4000', 10)
    app.listen(port, () => {
        console.log(`server-response start on port ${port}`)
        setInterval(() => {
            fetch('http://localhost:4000', { method: 'POST', timeout:5000 })
        }, process.env.itv ? (+process.env.itv * 1000)  : 2000)
    })
}

app.post('/', async (req: Request, res: Response) => {
    const data = generatePeople(3)
    const time = new Date()
    const payload: JsonBodyType = { data, time }
    const privateKey = readFileSync('src/keys/private.key', 'utf8')
    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' })
    const url: string = 'http://localhost:3000'
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": token
        }
    })
    const { result } = await response.json()
    console.log(result)
    return res.end()
})

app.get('/getPublicKey', (req: Request, res: Response) => {
    const publicKey = readFileSync('src/keys/public.key', 'utf8')
    return res.send({ publicKey })
})

startServer()