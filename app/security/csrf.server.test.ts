import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { csrfFieldName } from '~/security/csrf'

const loadCsrf = async () => {
  const [{ commitSession, getSession }, csrf] = await Promise.all([
    import('~/logic/session'),
    import('~/security/csrf.server'),
  ])
  const session = await getSession()

  return {
    commitSession,
    session,
    ...csrf,
  }
}

const expectResponseStatus = async (
  callback: () => unknown,
  status: number,
) => {
  try {
    await callback()
    throw new Error(`Expected a ${status} response`)
  } catch (error) {
    expect(error).toBeInstanceOf(Response)

    if (error instanceof Response) {
      expect(error.status).toBe(status)
    }
  }
}

describe('CSRF protection', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('APP_ORIGIN', 'https://concert-diary.example')
    vi.stubEnv('SESSION_COOKIE_SECRET', 'test-session-cookie-secret')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('accepts a same-origin request with the session token', async () => {
    const { getCsrfToken, validateCsrfRequest } = await loadCsrf()
    const token = getCsrfToken()
    const body = new FormData()
    body.set(csrfFieldName, token)
    const request = new Request('https://concert-diary.example/concerts', {
      method: 'POST',
      headers: {
        Origin: 'https://concert-diary.example',
        'Sec-Fetch-Site': 'same-origin',
      },
      body,
    })

    await expect(validateCsrfRequest(request, token)).resolves.toBeInstanceOf(
      FormData,
    )
  })

  it('generates tokens without reading or mutating session state', async () => {
    const { getCsrfToken } = await loadCsrf()

    expect(getCsrfToken).toHaveLength(0)
    expect(getCsrfToken()).not.toBe(getCsrfToken())
  })

  it.each([
    ['missing', null],
    ['incorrect', 'incorrect-token'],
  ])('rejects a %s token', async (_, submittedToken) => {
    const { getCsrfToken, validateCsrfRequest } = await loadCsrf()
    const expectedToken = getCsrfToken()
    const body = new FormData()

    if (submittedToken !== null) {
      body.set(csrfFieldName, submittedToken)
    }

    const request = new Request('https://concert-diary.example/concerts', {
      method: 'POST',
      headers: { Origin: 'https://concert-diary.example' },
      body,
    })

    await expectResponseStatus(
      () => validateCsrfRequest(request, expectedToken),
      403,
    )
  })

  it('rejects a mismatched origin even with a valid token', async () => {
    const { getCsrfToken, validateCsrfRequest } = await loadCsrf()
    const expectedToken = getCsrfToken()
    const body = new FormData()
    body.set(csrfFieldName, expectedToken)
    const request = new Request('https://concert-diary.example/concerts', {
      method: 'POST',
      headers: { Origin: 'https://attacker.example' },
      body,
    })

    await expectResponseStatus(
      () => validateCsrfRequest(request, expectedToken),
      403,
    )
  })

  it('rejects cross-site Fetch Metadata even with a valid token', async () => {
    const { getCsrfToken, validateCsrfRequest } = await loadCsrf()
    const expectedToken = getCsrfToken()
    const body = new FormData()
    body.set(csrfFieldName, expectedToken)
    const request = new Request('https://concert-diary.example/concerts', {
      method: 'POST',
      headers: {
        Origin: 'https://concert-diary.example',
        'Sec-Fetch-Site': 'cross-site',
      },
      body,
    })

    await expectResponseStatus(
      () => validateCsrfRequest(request, expectedToken),
      403,
    )
  })

  it('fails closed when APP_ORIGIN is missing in production', async () => {
    vi.stubEnv('APP_ORIGIN', '')
    vi.resetModules()
    const { getCsrfToken, validateCsrfRequest } = await loadCsrf()
    const expectedToken = getCsrfToken()
    const body = new FormData()
    body.set(csrfFieldName, expectedToken)
    const request = new Request('https://concert-diary.example/concerts', {
      method: 'POST',
      headers: { Origin: 'https://concert-diary.example' },
      body,
    })

    await expectResponseStatus(
      () => validateCsrfRequest(request, expectedToken),
      500,
    )
  })

  it('sets SameSite=Lax on the session cookie', async () => {
    const { commitSession, csrfSessionKey, getCsrfToken, session } =
      await loadCsrf()
    session.set(csrfSessionKey, getCsrfToken())

    await expect(commitSession(session)).resolves.toContain('SameSite=Lax')
  })
})
