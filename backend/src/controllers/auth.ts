import { Request, Response } from 'express'
import * as authService from '../services/auth.js'
import { env } from '../config/env.js'
import ms from 'ms'

function parseMs(time: string): number {
  const result = ms(time as any)
  if (typeof result !== 'number') throw new Error(`Invalid time string: ${time}`)
  return result
}

const REFRESH_MAX_AGE_MS = parseMs(env.JWT_REFRESH_EXPIRES_IN)

function setCookieAuth(res: Response, accessToken: string, refreshToken: string) {
  const cookieOpts: Record<string, any> = {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'lax',
    path: '/',
  }
  if (env.COOKIE_DOMAIN) {
    cookieOpts.domain = env.COOKIE_DOMAIN
  }

  res.cookie('accessToken', accessToken, {
    ...cookieOpts,
    maxAge: parseMs(env.JWT_ACCESS_EXPIRES_IN),
  })

  res.cookie('refreshToken', refreshToken, {
    ...cookieOpts,
    maxAge: REFRESH_MAX_AGE_MS,
  })
}

function clearCookieAuth(res: Response) {
  res.clearCookie('accessToken', { path: '/' })
  res.clearCookie('refreshToken', { path: '/' })
}

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body
    const user = await authService.registerUser(name, email, password)
    res.status(201).json({ user })
  } catch (error: any) {
    if (error.message === 'EMAIL_ALREADY_EXISTS') {
      res.status(409).json({ error: 'Este email já está cadastrado' })
      return
    }
    console.error('[auth/register]', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    const result = await authService.loginUser(email, password)
    setCookieAuth(res, result.accessToken, result.refreshToken)
    res.json({ user: result.user })
  } catch (error: any) {
    if (error.message === 'INVALID_CREDENTIALS') {
      res.status(401).json({ error: 'Email ou senha inválidos' })
      return
    }
    console.error('[auth/login]', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) {
      res.status(401).json({ error: 'Refresh token não encontrado' })
      return
    }

    const result = await authService.refreshAccessToken(refreshToken)
    setCookieAuth(res, result.accessToken, result.refreshToken)
    res.json({ ok: true })
  } catch (error: any) {
    clearCookieAuth(res)
    if (error.message === 'INVALID_REFRESH_TOKEN') {
      res.status(401).json({ error: 'Sessão expirada, faça login novamente' })
      return
    }
    console.error('[auth/refresh]', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies?.refreshToken
    if (refreshToken) {
      await authService.logoutUser(refreshToken)
    }
    clearCookieAuth(res)
    res.json({ ok: true })
  } catch (error) {
    console.error('[auth/logout]', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export async function me(req: Request, res: Response) {
  try {
    const user = await authService.getMe(req.user!.userId)
    res.json({ user })
  } catch (error: any) {
    if (error.message === 'USER_NOT_FOUND') {
      res.status(404).json({ error: 'Usuário não encontrado' })
      return
    }
    console.error('[auth/me]', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
