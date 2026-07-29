import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import ms from 'ms'
import { prisma } from '../lib/prisma.js'
import { signAccessToken, signRefreshToken } from '../lib/jwt.js'
import { refreshTokenStore } from '../lib/refresh-token-store.js'
import { env } from '../config/env.js'
import { randomUUID } from 'crypto'

function parseMs(time: string): number {
  const result = ms(time as any)
  if (typeof result !== 'number') throw new Error(`Invalid time string: ${time}`)
  return result
}

export async function registerUser(name: string, email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new Error('EMAIL_ALREADY_EXISTS')
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  })

  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new Error('INVALID_CREDENTIALS')
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    throw new Error('INVALID_CREDENTIALS')
  }

  const accessToken = signAccessToken({ userId: user.id, role: user.role })
  const tokenId = randomUUID()
  const refreshTtlMs = parseMs(env.JWT_REFRESH_EXPIRES_IN)
  const refreshToken = signRefreshToken({ userId: user.id, tokenId })
  await refreshTokenStore.set(tokenId, user.id, refreshTtlMs)

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  }
}

export async function refreshAccessToken(refreshToken: string) {
  let payload: { userId: string; tokenId: string }
  try {
    payload = jwt.verify(refreshToken, env.JWT_SECRET) as { userId: string; tokenId: string }
  } catch {
    throw new Error('INVALID_REFRESH_TOKEN')
  }

  const stored = await refreshTokenStore.get(payload.tokenId)
  if (!stored || stored.userId !== payload.userId) {
    throw new Error('INVALID_REFRESH_TOKEN')
  }

  await refreshTokenStore.delete(payload.tokenId)

  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user) {
    throw new Error('USER_NOT_FOUND')
  }

  const newAccessToken = signAccessToken({ userId: user.id, role: user.role })
  const newTokenId = randomUUID()
  const refreshTtlMs = parseMs(env.JWT_REFRESH_EXPIRES_IN)
  const newRefreshToken = signRefreshToken({ userId: user.id, tokenId: newTokenId })
  await refreshTokenStore.set(newTokenId, user.id, refreshTtlMs)

  return { accessToken: newAccessToken, refreshToken: newRefreshToken }
}

export async function logoutUser(refreshToken: string) {
  try {
    const payload = jwt.verify(refreshToken, env.JWT_SECRET) as { tokenId: string }
    await refreshTokenStore.delete(payload.tokenId)
  } catch {
    // Se o token já é inválido, ignore
  }
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw new Error('USER_NOT_FOUND')
  }
  return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }
}
