import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './config/env.js'
import authRoutes from './routes/auth.js'
import proposalsRoutes from './routes/proposals.js'
import adminRoutes from './routes/admin.js'

const app = express()

app.use(cors({
  origin: env.FRONTEND_URL,
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
