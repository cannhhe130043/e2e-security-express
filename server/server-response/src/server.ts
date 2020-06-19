import express, { Request, Response } from 'express'
import { Dogs } from './dogs/dog.list.data'
import { signData } from './signature/sign.data'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'
import jwt from 'jsonwebtoken'

type JwtPayLoadType = {
    data: any,
    signature: string
}
 
dotenv.config()

const app = express()

const startServer = (): void => {
    const port: number = parseInt(process.env.PORT || '4000', 10)
    app.listen(port, () => { console.log(`server-response start on port ${port}`) })
}

app.get('/', (req: Request, res: Response) => {
    try{
        const data = Dogs
        const signature = signData(data)
        const payload: JwtPayLoadType = { data, signature }
        const privateKey = readFileSync('src/keyPair/private.key.txt').toString('base64')
        const token = jwt.sign(
            payload,
            privateKey,
            {
                expiresIn: '1h'
            }
        )
        return res.status(200).send({token})
    }catch(e){
        throw new Error(e)
    }
})

startServer()