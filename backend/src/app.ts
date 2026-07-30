import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './config/env.js'
import authRoutes from './routes/auth.js'
import proposalsRoutes from './routes/proposals.js'
import adminRoutes from './routes/admin.js'

const app = express()

app.use(cors({
  origin: [
    'https://project-19097.vercel.app',
    'http://localhost:5173',
  ],
  credentials: true,
}))

app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

app.use('/auth', authRoutes)
app.use('/proposals', proposalsRoutes)
app.use('/admin', adminRoutes)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default app
