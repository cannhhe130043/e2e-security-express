import express, { Request, Response } from 'express'
import { signData } from './signature/sign.data'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { generatePeople } from './people/person.interface'
import readline from 'readline'
dotenv.config()

type JsonBodyType = {
    data: any,
    signature: string,
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
    const signature = signData(data)
    const time = new Date()
    const payload: JsonBodyType = { data, signature, time }
    const url: string = 'http://localhost:3000'
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(payload)
    })
})

startServer()