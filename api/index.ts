import 'dotenv/config'
import serverless from 'serverless-http'
import express from 'express'
import app from '../backend/src/app.js'

const vercelApp = express()
vercelApp.use('/api', app)

export default serverless(vercelApp)
