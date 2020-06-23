import express, { Request, Response, response } from 'express'
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
        fetch('http://localhost:5000', { method: 'POST', timeout: 5000 })
    }, process.env.itv ? (+process.env.itv * 1000)  : 2000)
}

app.post('/', async (req: Request, res: Response) => {
    try {
        const data = generatePeople(3)
        const time = new Date()
        const payload: JsonBodyType = { data, time }
        const privateKey = readFileSync('src/keyPair/private.key.txt', 'utf8')
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
    } catch (e) {
        console.log(e.message)
    }
})

startServer()