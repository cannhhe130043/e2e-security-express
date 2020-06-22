import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { generatePeople } from './people/person.interface'
import { readFileSync } from 'fs'
import jwt from 'jsonwebtoken'
dotenv.config()

type JsonBodyType = {
    data: any,
    time: Date
}

const app = express()

const startServer = async () => {
    const port: number = parseInt(process.env.PORT || '5000', 10)
    app.listen(port, () => { console.log(`server-response start on port ${port}`) })
    setInterval(() => {
        fetch('http://localhost:5000', { method: 'POST' })
    }, 1500)
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

startServer()