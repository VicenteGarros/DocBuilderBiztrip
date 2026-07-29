import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SECURE: z
    .string()
    .default('false')
    .transform((v) => v === 'true'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  PORT: z
    .string()
    .default('3001')
    .transform((v) => parseInt(v, 10)),
  SEED_MASTER_EMAIL: z.string().email().optional(),
  SEED_MASTER_PASSWORD: z.string().optional(),
  SEED_MASTER_NAME: z.string().optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('[config] Erro nas variáveis de ambiente:', parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
