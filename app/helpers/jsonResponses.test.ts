import { describe, expect, it } from 'vitest'
import cachedJson from '~/helpers/cachedJson'
import uncachedJson from '~/helpers/uncachedJson'

const getDataHeaders = (response: ReturnType<typeof uncachedJson>) =>
  new Headers(response.init?.headers)

describe('session JSON responses', () => {
  it('does not cache session data containing a CSRF token', () => {
    const response = uncachedJson('session-cookie', {
      csrfToken: 'csrf-token',
    })
    const headers = getDataHeaders(response)

    expect(headers.get('Cache-Control')).toBe('private, no-store')
    expect(headers.get('Set-Cookie')).toBe('session-cookie')
    expect(headers.has('ETag')).toBe(false)
  })

  it('privately caches authenticated data with an ETag', () => {
    const response = cachedJson(
      new Request('https://concert-diary.example/concerts'),
      'session-cookie',
      { concerts: [] },
    )

    expect(response).not.toBeInstanceOf(Response)

    if (response instanceof Response) {
      return
    }

    const headers = new Headers(response.init?.headers)

    expect(headers.get('Cache-Control')).toBe(
      'private, max-age=0, must-revalidate',
    )
    expect(headers.get('Set-Cookie')).toBe('session-cookie')
    expect(headers.get('ETag')).not.toBeUndefined()
  })

  it('keeps authenticated 304 responses private', () => {
    const initialResponse = cachedJson(
      new Request('https://concert-diary.example/concerts'),
      'initial-session-cookie',
      { concerts: [] },
    )

    if (initialResponse instanceof Response) {
      throw new Error('Expected an initial data response')
    }

    const etag = new Headers(initialResponse.init?.headers).get('ETag')

    if (etag === null) {
      throw new Error('Expected an ETag')
    }

    const response = cachedJson(
      new Request('https://concert-diary.example/concerts', {
        headers: { 'If-None-Match': etag },
      }),
      'renewed-session-cookie',
      { concerts: [] },
    )

    expect(response).toBeInstanceOf(Response)

    if (!(response instanceof Response)) {
      return
    }

    expect(response.status).toBe(304)
    expect(response.headers.get('Cache-Control')).toBe(
      'private, max-age=0, must-revalidate',
    )
    expect(response.headers.get('Set-Cookie')).toBe('renewed-session-cookie')
  })
})
