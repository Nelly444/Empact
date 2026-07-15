const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

// Retry delays for GET requests only - a GET never mutates anything, so
// retrying after the server never even received it (connection refused, a
// dev-server reload, the backend still starting up) is always safe. POSTs
// are never auto-retried: if a /search POST reached the server, blindly
// retrying could double-fire a paid embedding call.
const GET_RETRY_DELAYS_MS = [400, 1000]

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function fetchWithRetry(url: string, init: RequestInit, retryDelaysMs: number[]): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fetch(url, init)
    } catch (err) {
      if (attempt >= retryDelaysMs.length) throw err
      await new Promise((resolve) => setTimeout(resolve, retryDelaysMs[attempt]))
    }
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method ?? 'GET'
  const requestInit: RequestInit = { headers: { 'Content-Type': 'application/json' }, ...init }
  const response =
    method === 'GET'
      ? await fetchWithRetry(`${API_BASE_URL}${path}`, requestInit, GET_RETRY_DELAYS_MS)
      : await fetch(`${API_BASE_URL}${path}`, requestInit)
  if (!response.ok) {
    throw new ApiError(response.status, `${method} ${path} failed: ${response.status}`)
  }
  return response.json() as Promise<T>
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
}
