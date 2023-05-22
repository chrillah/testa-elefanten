import {config} from 'dotenv'
import pkg from 'pg'
const {Client} =pkg

import express, {response} from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const PORT = 8800

const app = express()
config()
app.use(bodyParser.json())

app.use(
    bodyParser.urlencoded({
        extended: true
    })
)

app.use(cors())
app.use(express.json())
app.use((request, response, next)=>{
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})


const client = new Client({
    database: process.env.DATABASE,
    host: process.env.PGHOST,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    user: process.env.USER
})

client.connect(function (err){
    if(err) throw err
    console.log('DATABASE CONNECTED')
})

app.get('/', (req, res)=>{
    res.json('IT WORK')
})

app.get('/test', async (req, res)=>{
    try{
        const result = await client.query('SELECT * FROM test')
        res.json(result.rows)
    } catch(err){
        console.error(err)
        res.status(500)
    }
})

app.listen(PORT, ()=>{
    console.log(`SERVER IS ON ${PORT}`)
})
