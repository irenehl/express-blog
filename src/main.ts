require('express-async-errors')
import express from 'express'
import baseRouter from './common/base-router'
import errorHandler from './middlewares/error.mid'
import passportConfig from './config/passport'
const app = express()

app.use(express.json())

app.use('/api', baseRouter)

app.use(errorHandler)

app.use(passportConfig)

app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Running on port: ${process.env.PORT}`)
})
