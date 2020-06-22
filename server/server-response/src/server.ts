import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'
import fetch from 'node-fetch'
import { generatePeople } from './people/person.interface'

type JsonBodyType = {
    data: any,
    time: Date
}

dotenv.config()

const app = express()

const startServer = (): void => {
    const port: number = parseInt(process.env.PORT || '4000', 10)
    app.listen(port, () => { console.log(`server-response start on port ${port}`) })
    setInterval(() => {
        fetch('http://localhost:4000', { method: 'POST' })
    }, 1000)
}

app.post('/', (req: Request, res: Response) => {
    const data = generatePeople(3)
    const time = new Date()
    const payload: JsonBodyType = { data , time}
    const privateKey = readFileSync('src/keyPair/private.key.txt', 'utf8')
    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' })
    const url: string = 'http://localhost:3000'
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": token
        }
    })
})

app.get('/getPublicKey', (req: Request, res: Response) => {
    const publicKey = readFileSync('src/keyPair/public.key.txt', 'utf8')
    res.send({publicKey})
})

startServer()