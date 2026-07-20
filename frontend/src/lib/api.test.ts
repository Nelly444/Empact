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

  it('retries a GET after a network-level failure and succeeds', async () => {
    vi.useFakeTimers()
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce({ ok: true, json: async () => ({ org_names: [] }) })
    vi.stubGlobal('fetch', fetchMock)

    const promise = api.get('/organizations/filter-options')
    await vi.runAllTimersAsync()
    await expect(promise).resolves.toEqual({ org_names: [] })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })

  it('gives up on a GET after exhausting retries and surfaces the network error', async () => {
    vi.useFakeTimers()
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    vi.stubGlobal('fetch', fetchMock)

    const promise = api.get('/organizations/filter-options')
    const assertion = expect(promise).rejects.toThrow('Failed to fetch')
    await vi.runAllTimersAsync()
    await assertion
    expect(fetchMock).toHaveBeenCalledTimes(3)
    vi.useRealTimers()
  })

  it('does not retry a POST after a network-level failure', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    vi.stubGlobal('fetch', fetchMock)

    await expect(api.post('/search', { query: 'water' })).rejects.toThrow('Failed to fetch')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
