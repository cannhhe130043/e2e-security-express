import fetch from 'node-fetch'

const url = 'http://localhost:3000/getData'

const ping = () => {
    setInterval(async () => {
        const response = await fetch(url, { method: 'GET' })
        const data = await response.json()
        console.log(data)
    }, 3000)
}

ping()