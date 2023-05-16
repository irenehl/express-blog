require('express-async-errors')
import express from 'express'
import baseRouter from './common/base-router'
import errorHandler from './middlewares/error.mid'
const app = express()

app.use(express.json())

app.use('/api', baseRouter)

app.use(errorHandler)

app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Running on port: ${process.env.PORT}`)
})
