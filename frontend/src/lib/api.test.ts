import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, api } from './api'

describe('api', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns parsed JSON on a successful GET', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ hello: 'world' }) }),
    )
    await expect(api.get('/health')).resolves.toEqual({ hello: 'world' })
  })

  it('sends a JSON body and Content-Type header on POST', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [] }) })
    vi.stubGlobal('fetch', fetchMock)

    await api.post('/search', { query: 'clean water' })

    const [, init] = fetchMock.mock.calls[0]
    expect(init.method).toBe('POST')
    expect(init.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(init.body)).toEqual({ query: 'clean water' })
  })

  it('throws an ApiError carrying the HTTP status on a non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 429 }))

    const error = await api.get('/search').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBe(429)
  })
})
