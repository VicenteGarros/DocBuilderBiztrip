const API_BASE = import.meta.env.VITE_API_URL || '/api'

class ApiError extends Error {
  status: number
  details?: Record<string, string[]>
  constructor(message: string, status: number, details?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    })
  } catch (err) {
    const message = err instanceof TypeError
      ? 'Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:3001.'
      : (err as Error)?.message || 'Erro de conexão'
    throw new ApiError(message, 0)
  }

  if (!res.ok) {
    let body: any
    let bodyParseFailed = false
    try { body = await res.json() } catch { bodyParseFailed = true }

    if (bodyParseFailed || !body?.error) {
      if (res.status === 500) {
        throw new ApiError(
          'Erro interno no servidor. Pode ser que o backend não esteja rodando ou reiniciou. Tente recarregar a página.',
          res.status,
        )
      }
      throw new ApiError(body?.error || `Erro ${res.status}`, res.status, body?.details)
    }
    throw new ApiError(body.error, res.status, body?.details)
  }

  return res.json()
}

export { ApiError, API_BASE }
export default request
